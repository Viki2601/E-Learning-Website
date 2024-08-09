import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify';
import LoadingBar from 'react-top-loading-bar';
import { FaStar } from 'react-icons/fa';

export default function SingleViewPage() {
    const navigate = useNavigate();
    const { courseId } = useParams();
    const [progress, setProgress] = useState(0);
    const [activeTab, setActiveTab] = useState('Description');
    const [course, setCourse] = useState(null);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const url = "https://e-learning-website-server.onrender.com"

    useEffect(() => {
        getCourseById();
        setProgress(100);
    }, []);

    const getCourseById = async () => {
        try {
            const res = await axios.post(`${url}/getCourseById`, { courseId });
            setCourse(res.data);
        } catch (error) {
            toast.error('Something went wrong!');
        }
    };

    const addToCart = async () => {
        try {
            const cookieVal = Cookies.get('email');
            if (!cookieVal) {
                toast.warn('Login to Continue...');
                navigate('/login');
            } else {
                setProgress(50);
                const res = await axios.post(`${url}/addToCart`, { email: cookieVal, course: courseId });
                if (res.data === 'pass') {
                    toast.success('Course added to Cart');
                } else if (res.data === 'alreadyAdded') {
                    toast.warn('Already added to Cart');
                } else if (res.data === 'fail') {
                    toast.error('Something went wrong!');
                }
                setProgress(70);
                setProgress(100);
            }
        } catch (e) {
            toast.error('Something went wrong!');
            setProgress(100);
        }
    };

    const addToWishlist = async () => {
        try {
            const cookieVal = Cookies.get('email');
            if (!cookieVal) {
                toast.warn('Login to Continue...');
                navigate('/login');
            } else {
                setProgress(50);
                const res = await axios.post(`${url}/addToWishlist`, { email: cookieVal, course: courseId });
                if (res.data === 'pass') {
                    toast.success('Course added to wishlist');
                } else if (res.data === 'alreadyAdded') {
                    toast.warn('Already added to wishlist');
                } else if (res.data === 'fail') {
                    toast.error('Something went wrong!');
                }
                setProgress(70);
                setProgress(100);
            }
        } catch (e) {
            toast.error('Something went wrong!');
            setProgress(100);
        }
    };

    const submitReview = async () => {
        try {
            const userId = Cookies.get('email'); // Assume user ID is stored in cookies
            if (!userId) {
                toast.warn('Login to Continue...');
                navigate('/login');
                return;
            }

            const res = await axios.post(`${url}/addReview`, { courseId, userId, rating, comment });
            if (res.data.status === "success") {
                toast.success('Review added successfully');
                getCourseById(); // Refresh course data to show new review
            } else {
                toast.error('Something went wrong!');
            }
        } catch (error) {
            toast.error('Something went wrong!');
        }
    };

    if (!course) {
        return <div>Loading...</div>;
    }

    return (
        <div className="bg-white">
            <LoadingBar color="red" progress={progress} onLoaderFinished={() => setProgress(0)} />
            <section className="text-gray-600 body-font overflow-hidden">
                <div className="container px-5 py-24 mx-auto">
                    <div className="lg:w-4/5 mx-auto flex flex-wrap items-center">
                        <div className="lg:w-1/2 w-full lg:pr-10 lg:py-6 mb-6 lg:mb-0">
                            <h1 className="text-gray-900 text-3xl title-font font-medium mb-4">{course.name}</h1>
                            <div className="flex mb-4">
                                <button
                                    className={`flex-grow ${activeTab === 'Description' ? 'text-indigo-500 border-indigo-500' : 'border-gray-300'} border-b-2 py-2 text-lg px-1`}
                                    onClick={() => setActiveTab('Description')}
                                >
                                    Description
                                </button>
                                <button
                                    className={`flex-grow ${activeTab === 'Reviews' ? 'text-indigo-500 border-indigo-500' : 'border-gray-300'} border-b-2 py-2 text-lg px-1`}
                                    onClick={() => setActiveTab('Reviews')}
                                >
                                    Reviews
                                </button>
                            </div>
                            {activeTab === 'Description' && (
                                <div>
                                    <p className="leading-relaxed mb-4">{course.description}</p>
                                    <div className="flex border-t border-gray-200 py-2">
                                        <span className="text-gray-500">Duration</span>
                                        <span className="ml-auto text-gray-900">{course.duration}</span>
                                    </div>
                                    <div className="flex border-t border-gray-200 py-2">
                                        <span className="text-gray-500">Type</span>
                                        <span className="ml-auto text-gray-900">{course.type}</span>
                                    </div>
                                    <div className="flex border-t border-gray-200 py-2">
                                        <span className="text-gray-500">Level</span>
                                        <span className="ml-auto text-gray-900">{course.level}</span>
                                    </div>
                                    <div className="flex border-t border-gray-200 py-2">
                                        <span className="text-gray-500">Language</span>
                                        <span className="ml-auto text-gray-900">{course.language}</span>
                                    </div>
                                    <div className="flex border-t border-gray-200 py-2">
                                        <span className="text-gray-500">Created By</span>
                                        <span className="ml-auto text-gray-900">{course.creator}</span>
                                    </div>
                                    <div className="flex border-t border-b mb-6 border-gray-200 py-2">
                                        <span className="text-gray-500">Tutor</span>
                                        <span className="ml-auto text-gray-900"><a>{course.teacher}</a></span>
                                    </div>
                                    <div className="flex">
                                        <span className="title-font font-medium text-2xl text-gray-900">₹{course.price}.00</span>
                                        <button onClick={addToCart} className="flex ml-auto text-white bg-gray-900 border-0 py-2 px-6 focus:outline-none hover:bg-gray-600 rounded-lg">Add to Cart</button>
                                        <button onClick={addToWishlist} className="rounded-full w-10 h-10 bg-gray-200 p-0 border-0 inline-flex items-center justify-center text-gray-500 ml-4">
                                            <svg fill="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
                                                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"></path>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            )}
                            {activeTab === 'Reviews' && (
                                <div>
                                    <div className="mt-6">
                                        <h2 className="text-lg font-medium mb-4">Add a Review</h2>
                                        <div className="flex mb-4">
                                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="rating">
                                                Rating
                                            </label>
                                            <div className="flex items-center ml-2">
                                                {[...Array(5)].map((_, i) => (
                                                    <button
                                                        key={i}
                                                        type="button"
                                                        className={`focus:outline-none ${i < rating ? 'text-yellow-500' : 'text-gray-300'}`}
                                                        onClick={() => setRating(i + 1)}
                                                    >
                                                        <FaStar />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="comment">
                                                Comment
                                            </label>
                                            <textarea
                                                id="comment"
                                                name="comment"
                                                value={comment}
                                                onChange={(e) => setComment(e.target.value)}
                                                className="w-full p-2 border rounded"
                                            />
                                        </div>
                                        <button onClick={submitReview} className="text-white bg-gray-900 border-0 py-2 px-6 focus:outline-none hover:bg-gray-600 rounded-lg">
                                            Submit Review
                                        </button>
                                    </div>
                                    <h1 className='my-5 text-xl font-bold'>Recent reviews</h1>
                                    {course.reviews.length > 0 ? (
                                        course.reviews.map((review, index) => (
                                            <div key={index} className="border-b border-gray-200 py-2">
                                                <div className="flex items-center mb-2">
                                                    <h2 className="text-gray-900 font-medium">{review.user}</h2>
                                                    <div className="flex ml-auto">
                                                        {[...Array(review.rating)].map((star, i) => (
                                                            <FaStar className='text-yellow-500' />
                                                        ))}
                                                    </div>
                                                </div>
                                                <p className="leading-relaxed">{review.comment}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="leading-relaxed my-4">No reviews yet.</p>
                                    )}
                                </div>
                            )}
                        </div>
                        <img alt="ecommerce" className="lg:w-1/2 w-full h-80 object-cover border shadow-lg object-center rounded" src={course.img[0]} />
                    </div>
                </div>
            </section>
            <ToastContainer />
        </div>
    );
}
