require("dotenv").config();
const cors = require("cors");
const bcrypt = require("bcryptjs");
const express = require("express");
const nodemailer = require("nodemailer");
const stripe = require('stripe')(process.env.STRIPE_KEY);
const { userCollection, courseCollection, cartCollection, orderCollection } = require('./mongo');
const PORT = process.env.PORT || 8000;
const multer = require('multer');
const url = "http://localhost:3000";
const path = require('path'); const { error } = require("console");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now();
        const originalName = file.originalname;
        const extension = path.extname(originalName);
        const baseName = path.basename(originalName, extension);
        cb(null, baseName + '-' + uniqueSuffix + extension);
    }
});
const upload = multer({ storage: storage })
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));
app.use(cors());

async function hashPass(password) {
    const res = await bcrypt.hash(password, 10);
    return res;
}
async function compare(userPass, hashPass) {
    const res = await bcrypt.compare(userPass, hashPass);
    return res;
}


// Admin Accesses like Adding, Updating, Removing Courses, Student Progress, etc..,
// Course adding API (Admin Access only)
// Using insertmany method to add a new course
app.post("/addcourse", async (req, res) => {
    const form = req.body.form;
    const image = req.body.image;

    try {
        const data = {
            name: form.name,
            type: form.type,
            level: form.level,
            description: form.description,
            language: form.language,
            creator: form.creator,
            duration: form.duration,
            teacher: form.teacher,
            price: form.price,
            img: image,
            allRatings: [],
            reviews: []
        }

        await courseCollection.insertMany([data])

        res.json("pass")

    } catch (e) {
        res.json("fail");
    }
});


// Updating Course API (Admin access only)
// Using findByIdAndUpdate method to update a specific values of the course
// for fetching the id we used req.body
app.post("/updateCourse", async (req, res) => {
    const form = req.body.form;
    const { _id } = req.body;
    try {
        const data = {
            name: form.name,
            type: form.type,
            level: form.level,
            description: form.description,
            language: form.language,
            creator: form.creator,
            duration: form.duration,
            teacher: form.teacher,
            price: form.price,
            allRatings: [],
            reviews: []
        }
        await courseCollection.findByIdAndUpdate(_id, data, { new: true });
        res.json("pass")

    } catch (e) {
        res.json("fail");
    }
});


// Deleting Course API (Admin access only)
// Using findByIdAndDelete method to delete a specific course
app.post("/deleteCourse", async (req, res) => {
    const { _id } = req.body;
    try {
        await courseCollection.findByIdAndDelete(_id);
        res.json("pass")
    } catch (e) {
        res.json("fail");
    }
});


// Course View page to UI API
app.post("/getCourses", async (req, res) => {
    try {
        const type = req.body.selectedOption;

        if (type == "All Courses") {
            const allCourses = await courseCollection.find({}).skip(0).limit(12);
            const totalCourse = await courseCollection.find({}).countDocuments();
            const data = {
                allCourses: allCourses,
                totalCourse: totalCourse,
            };
            res.json(data)
        }
        else {
            const allCourses = await courseCollection.find({ type: type }).skip(0).limit(12);
            const totalCourse = await courseCollection.find({ type: type }).countDocuments();
            const data = {
                allCourses: allCourses,
                totalCourse: totalCourse
            }
            res.json(data)
        }
    } catch (e) {
        res.json("fail");
    }
});


app.post('/getCoursesByEmail', async (req, res) => {
    const cookieVal = req.body.cookieVal;
    try {
        const data = await courseCollection.find({ teacher: cookieVal });
        res.json(data);
    } catch (error) {
        res.json("fail");
    }
});


app.post('/getCourseById', async (req, res) => {
    const { courseId } = req.body;
    try {
        const course = await courseCollection.findById(courseId);
        res.json(course);
    } catch (error) {
        res.status(500).json("fail");
    }
});


app.post("/addReview", async (req, res) => {
    const { courseId, userId, rating, comment } = req.body;
    try {
        const course = await courseCollection.findById(courseId);
        if (course) {
            course.reviews.push({ user: userId, rating, comment });
            await course.save();
            res.json({ status: "success" });
        } else {
            res.status(404).json({ status: "course not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: "Something went wrong!" });
    }
});


// Cart Section like Adding Course to Cart, Viewing Course from Cart, Removing Course from Cart and Checkout.
// Course cart page API
app.post("/addToCart", async (req, res) => {
    const { email, course } = req.body;
    try {
        const cart = await cartCollection.findOne({ email: email, courses: course });
        if (!cart) {
            await cartCollection.insertMany({ email: email, courses: course })
            res.json("pass");
        } else {
            res.json("alreadyAdded");
        }
    } catch (e) {
        console.log(e);
        res.json("fail");
    };
});


// Fetching cart details API
app.get("/getcart", async (req, res) => {
    try {
        const email = req.query.email;
        if (!email) {
            res.json("fail");
        }
        const cart = await cartCollection.find({ email: email }).populate('courses');
        if (!cart) {
            res.json("fail");
        }
        res.json(cart);
    } catch (error) {
        res.json("fail");
    }
})


// Deleting cart details API
app.post("/removeFromCart", async (req, res) => {
    const { email, courseId } = req.body;
    try {
        if (!email || !courseId) {
            res.json("fail");
        }
        await cartCollection.findOneAndDelete({ email: email, courses: courseId });
        res.json("pass");
    } catch (e) {
        console.log(e);
        res.json("fail");
    }
});


app.post('/payment', async (req, res) => {
    const { line_items, email, course } = req.body;
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: line_items,
            mode: 'payment',
            success_url: `${url}/purchased`,
            cancel_url: `${url}/checkout`,
            customer_email: email,
            metadata: {
                course_ids: course.join(','),
            },
        });

        if (session.id === null) {
            console.log("Failed to purchase")
        } else {
            const sessionData = await stripe.checkout.sessions.retrieve(session.id);
            const order = await orderCollection.findOne({ email: sessionData.customer_email });
            if (order) {
                await orderCollection.updateOne(
                    { email: sessionData.customer_email },
                    { $push: { courses: { $each: sessionData.metadata.course_ids.split(',') } } },
                );

                // Remove purchased courses from the cart
                await cartCollection.deleteOne(
                    { email: sessionData.customer_email },
                    { $pull: { courses: { $in: sessionData.metadata.course_ids.split(',') } } }
                );
            } else {
                const newOrder = {
                    email: sessionData.customer_email,
                    courses: sessionData.metadata.course_ids.split(',')
                };
                await orderCollection.insertMany(newOrder);
                // Remove purchased courses from the cart
                await cartCollection.deleteOne(
                    { email: sessionData.customer_email },
                    { $pull: { courses: { $in: sessionData.metadata.course_ids.split(',') } } }
                );
            };
        };
        res.json({ id: session.id });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});


app.get("/purchasedCourse/:email", async (req, res) => {
    const { email } = req.params;
    try {
        const purchasedCourses = await orderCollection.findOne({ email }).populate('courses');
        if (purchasedCourses && purchasedCourses.courses) {
            res.json(purchasedCourses.courses);
        } else {
            res.status(404).json([]);
        }
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Server error" });
    }
});




// Account Details 
// Signup API details, Login API details both user and admin
// Signup API (Users/Admin)
app.post("/signup", async (req, res) => {
    const form = req.body.form;
    const data = {
        name: form.name,
        email: form.email,
        password: await hashPass(form.password),
    }

    try {
        const check = await userCollection.findOne({ email: form.email })

        if (check) {
            res.json("exists")
        }
        else {
            res.json("notexists")
            await userCollection.insertMany([data])
        }
    } catch (e) {
        res.json("Failed...")
    }
})


// Login API (Users/Admin)
app.post("/login", async (req, res) => {
    const formData = req.body.form;
    try {
        const check = await userCollection.findOne({ email: formData.email });

        if (check) {
            const passCheck = await compare(formData.password, check.password);
            passCheck ? res.json("loginPass") : res.json("loginFail");
        } else {
            res.json("nouser");
        }
    } catch (e) {
        res.json("fail");
    }
});


// Resetting password API
app.post("/resetPassword", async (req, res) => {
    const cookieVal = req.body.cookieVal;
    const password = req.body.password;
    try {
        const newPass = await hashPass(password);
        await userCollection.updateOne(
            { email: cookieVal },
            { $set: { password: newPass } }
        );
        res.json("pass");
    } catch (e) {
        res.json("fail");
    }
});


// OTP verification Mail API
app.post("/sendemail", async (req, res) => {
    try {
        const email = req.body.email;
        const otp = req.body.OTP;
        const check = await userCollection.findOne({ email: email });
        if (check) {
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: 'access.ecourse78@gmail.com',
                    pass: process.env.My_EMAIL_PASS
                }
            });

            const mailOption = {
                from: "E=Learning",
                to: email,
                subject: "password Reset",
                text: `OTP to reset your Password ${otp}`,
            };
            transporter.sendMail(mailOption, (error, info) => {
                if (error) {
                    res.json('fail');
                } else {
                    res.json('pass');
                }
            });
        }
        else {
            res.json("notexists");
        }

    } catch (e) {
        res.json('fail');
    }
});


// Users account API
app.post("/myaccount", async (req, res) => {
    try {
        const email = req.body.cookieVal;
        const check = await userCollection.findOne({ email: email });
        res.json(check);
    } catch (e) { }
});


// Admin account API
app.post("/adminaccount", async (req, res) => {
    try {
        const email = req.body.cookieVal;
        const check = await userCollection.findOne({ email: email });
        res.json(check);
    } catch (e) { }
});


app.post("/updateProfile", upload.single("profilePic"), async (req, res) => {
    const { email, name, phone, dob, gender, profession, country, role } = req.body;
    const profilepic = req.file;
    try {
        const updateData = { name, phone, dob, gender, profession, country, role };
        if (profilepic) {
            updateData.profilePicPath = profilepic.path;
            updateData.profilePicFilename = profilepic.filename;
        }
        const user = await userCollection.findOneAndUpdate(
            { email },
            updateData,
            { new: true, runValidators: true }
        );
        if (!user) {
            return res.json("fail");
        }
        const profilePicUrl = user.profilePicFilename ? `${req.protocol}://${req.get('host')}/uploads/${user.profilePicFilename}` : null;
        res.json({
            ...user._doc,
            profilePic: profilePicUrl
        });
    } catch (error) {
        res.json("fail");
    }
});



// Fetching Student details only access for Admins
app.get('/students', async (req, res) => {
    const user = req.query.role;
    try {
        const count = await userCollection.find({ role: user });
        res.json(count);
    } catch (e) {
        console.log(e);
    };
});


app.get('/teachers', async (req, res) => {
    const user = req.query.role;
    try {
        const count = await userCollection.find({ role: user });
        res.json(count);
    } catch (e) {
        console.log(e);
    };
});


app.get('/graphData', async (req, res) => {
    try {
        const Users = await userCollection.find();
        const graphData = Users.reduce((acc, app) => {
            const month = new Date(app.createdAt).toLocaleString('default', { month: 'short' });
            if (!acc[month]) acc[month] = 0;
            acc[month]++;
            return acc;
        }, {});
        const graphDataArray = Object.entries(graphData).map(([month, count]) => ({ month, count }));
        res.json(graphDataArray);
    } catch (e) {
        console.log(e);
    };
});


app.get('/learningGraphData', async (req, res) => {
    try {
        const course = await courseCollection.find();
        const graphData = course.reduce((acc, app) => {
            const month = new Date(app.createdAt).toLocaleString('default', { month: 'short' });
            if (!acc[month]) acc[month] = 0;
            acc[month]++;
            return acc;
        }, {});
        const graphDataArray = Object.entries(graphData).map(([month, count]) => ({ month, count }));
        res.json(graphDataArray);
    } catch (e) {
        console.log(e);
    };
});


app.get('/purchasedGraphData', async (req, res) => {
    try {
        const orders = await orderCollection.find();

        const graphData = orders.reduce((acc, order) => {
            order.courses.forEach(course => {
                const courseMonth = new Date(order.createdAt).toLocaleString('default', { month: 'short' });
                if (!acc[courseMonth]) acc[courseMonth] = 0;
                acc[courseMonth]++;
            });
            return acc;
        }, {});

        const graphDataArray = Object.entries(graphData).map(([month, count]) => ({ month, count }));
        res.json(graphDataArray);
    } catch (e) {
        console.log(e);
        res.json("fail");
    }
});


app.get('/fetchCourse/:email', async (req, res) => {
    const { email } = req.params;
    try {
        const data = await orderCollection.find({ email: email });
        res.json(data);
    } catch (e) {
        console.log(e);
        res.json("fail");
    };
});


app.post('/requestTeacherRole', async (req, res) => {
    const { email, role } = req.body;
    if (role !== 'Teacher') {
        res.json("fail");
    }
    try {
        const user = await userCollection.findOneAndUpdate({ email }, { role, role_status: 'pending' }, { new: true });
        res.json(user);
    } catch (error) {
        res.json("fail");
    }
});


app.post('/approveTeacherRequest', async (req, res) => {
    const { email, approve } = req.body;
    try {
        const user = await userCollection.findOneAndUpdate(
            { email, role: 'Teacher', role_status: 'pending' },
            { role_status: approve ? 'approved' : 'rejected' },
            { new: true }
        );
        res.json(user);
    } catch (error) {
        res.json("fail");
    }
});


app.get('/pendingTeacherRequests', async (req, res) => {
    try {
        const pendingRequests = await userCollection.find({ role: 'Teacher', role_status: 'pending' });
        res.json(pendingRequests);
    } catch (error) {
        res.json("fail");
    }
});


app.listen(PORT, () => {
    console.log("Port Connected...")
})