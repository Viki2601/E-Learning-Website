const mongoose = require("mongoose")
const { ObjectId } = mongoose.Schema.Types;
mongoose.connect('mongodb+srv://mcvicky2601:XwitDkaxqEFYOrev@cluster.uqeonqv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster')
    .then(() => {
        console.log("Mongo Connected...")
    })
    .catch(() => {
        console.log("Failed to connect MongoDB...")
    })


// USER AND ADMIN SCHEMA
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String
    },
    dob: {
        type: Date
    },
    gender: {
        type: String,
        enum: ['male', 'female']
    },
    profession: {
        type: String,
        enum: ['Student', 'Fresher', 'Employee']
    },
    country: {
        type: String
    },
    role: {
        type: String,
        enum: ['Student', 'Teacher'],
    },
    role_status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    attachment: {
        type: String,
    },
    profilePicPath: {
        type: String
    },
    profilePicFilename: {
        type: String
    },
}, { timestamps: true });


const reviewSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});


// COURSE SCHEMA DETAILS
const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    level: {
        type: String,
        enum: ['Beginer', 'Intermediate', 'Advanced'],
        required: true
    },
    description: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true
    },
    creator: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    teacher: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    img: {
        type: [String],
        required: true
    },
    allRatings: {
        type: Array,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    reviews: [reviewSchema] // Adding reviews as a sub-document

}, { timestamps: true });
const courseCollection = mongoose.model("courseCollection", courseSchema)
const reviewCollection = mongoose.model("reviewCollection", reviewSchema)



// Wishlist SCHEMA DETAILS
const savedSchema = new mongoose.Schema({
    email: {
        type: String,
    },
    courses: {
        type: ObjectId,
        ref: 'courseCollection',
    },
}, { timestamps: true });

// CART SCHEMA DETAILS
const cartSchema = new mongoose.Schema({
    email: {
        type: String,
    },
    courses: {
        type: ObjectId,
        ref: 'courseCollection',
    },
}, { timestamps: true });



// ORDER SCHEMA DETAILS
const orderSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    courses: [{
        type: ObjectId,
        ref: 'courseCollection',
    }],
}, { timestamps: true });



// SETTING SCHEMAS TO MONGODB USING MONGOOSE.MODEL()
const userCollection = mongoose.model("userCollection", userSchema)
const savedCollection = mongoose.model("savedCollection", savedSchema)
const cartCollection = mongoose.model("cartCollection", cartSchema)
const orderCollection = mongoose.model("orderCollection", orderSchema)



// SAVING ALL THE SCHEMA COLLECTION INTO SINGLE COLLECTION
const collection = {
    userCollection,
    courseCollection,
    reviewCollection,
    savedCollection,
    cartCollection,
    orderCollection
};



// EXPORTING THE COLLECTION TO SERVER TO USE THE COLLECTION DB
module.exports = collection
