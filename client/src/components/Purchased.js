import axios from 'axios';
import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export default function Purchased() {
    const [purchased, setPurchased] = useState([]);
    const url = "https://e-learning-website-server.onrender.com";
    console.log(purchased);

    useEffect(() => {
        fetchPurchasedCourse();
    }, []);

    const fetchPurchasedCourse = async () => {
        const cookie = Cookies.get('email');
        try {
            const response = await axios.get(`${url}/purchasedCourse/${cookie}`);
            if (Array.isArray(response.data)) {
                setPurchased(response.data);
            } else {
                setPurchased([]); // Set to empty array if response is not an array
            }
        } catch (error) {
            toast.error("You don't have purchased courses");
            setPurchased([]); // Handle error by setting purchased to an empty array
        }
    };

    return (
        <div className='bg-custom-radial-1 flex flex-col justify-center'>
            <h1 className="sm:text-3xl text-3xl font-bold text-center title-font m-4 text-gray-900">My Learnings</h1>
            {purchased.length > 0 ? (
                <div className='flex flex-wrap m-4'>
                    {purchased.map((course, index) => (
                        <div key={index} className='lg:w-1/4 md:w-1/2 p-2 scale-95 my-4 w-full rounded-lg shadow-md'>
                            <div className='flex flex-col font-sans'>
                                <a className='flex relative h-48 justify-center rounded overflow-hidden'>
                                    <img className='object-cover w-full h-full block' src={course.img || 'default-image-url'} alt={course.name} />
                                </a>
                                <div className='mt-4 mb-4 flex flex-col'>
                                    <h3 className='text-gray-500 text-xs font-bold tracking-widest mb-1'>Type : {course.type}</h3>
                                    <h3 className='text-gray-900 tracking-widest mb-1 text-lg font-semibold'>{course.name}</h3>
                                    <p className='mt-1 font-semibold'>Language : {course.language}</p>
                                    <p className='mt-1 font-semibold'>Creator : {course.creator}</p>
                                </div>
                                <div className='flex justify-between'>
                                    <button className='text-gray-300 bg-gray-900 border-0 py-2 px-5 rounded-lg hover:border-gray-600'>Start Course</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className='flex justify-center items-center text-3xl font-bold max-h-screen'>
                    <h1>Oops! Not yet purchased</h1>
                </div>
            )}
        </div>
    );
}
