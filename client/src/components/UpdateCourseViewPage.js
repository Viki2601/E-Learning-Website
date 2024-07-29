import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import LoadingBar from "react-top-loading-bar";
import axios from "axios";
import Cookies from 'js-cookie';
import { faTrash, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'

export default function UpdateCourseViewPage() {
    const history = useNavigate();
    const url = "https://e-learning-website-server.onrender.com";
    const [cookieVal] = useState(Cookies.get('email'));
    const [progress, setProgress] = useState(0);
    const [data, setData] = useState([]);
    const [showUpdatePopup, setShowUpdatePopup] = useState(false);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [open, setOpen] = useState(false)
    const [courseToDelete, setCourseToDelete] = useState(null);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [animate, setAnimate] = useState(false);

    const [form, setForm] = useState({
        _id: '',
        language: '',
        creator: '',
        teacher: '',
        duration: '',
        img: '',
        price: ''
    });

    // Fetching Courses and display
    const typeChangeSubmit = async () => {
        try {
            const res = await axios.post(`${url}/getCoursesByEmail`, { cookieVal });
            if (res.data === "fail") {
                toast.error("Something went Wrong!");
            } else {
                setData(res.data);
            }
        } catch (e) {
            toast.error("Something went Wrong!");
        }
    };


    useEffect(() => {
        typeChangeSubmit();
        setAnimate(true);
    }, [cookieVal]);


    // Updating Courses
    const handleUpdateClick = (course) => {
        setForm(course);
        setSelectedCourse(course);
        setShowUpdatePopup(true);
    };


    const handleFormChange = (event) => {
        const { name, value } = event.target;
        setForm((prevForm) => ({ ...prevForm, [name]: value }));
    };


    const handleFormSubmit = async (event) => {
        event.preventDefault();
        try {
            const res = await axios.post(`${url}/updateCourse`, { form, _id: form._id });
            if (res.data === "pass") {
                toast.success("Course updated successfully!");
                typeChangeSubmit();
                setShowUpdatePopup(false);
            } else {
                toast.error("Failed to update course!");
            }
        } catch (error) {
            toast.error("Something went wrong!");
        }
    };


    // Deleting Courses
    const handleDeleteCourse = async (courseId) => {
        try {
            const res = await axios.post(`${url}/deleteCourse`, { _id: courseId });
            if (res.data === "pass") {
                toast.success("Course deleted successfully");
                setData(data.filter(course => course._id !== courseId));
                typeChangeSubmit();
                setShowDeletePopup(false)
                setOpen(false);
            } else {
                toast.error("Failed to delete course!");
            }
        } catch (e) {
            toast.error("Something went wrong!");
        }
    }


    return (
        <div className='bg-custom-radial'>
            <LoadingBar
                color="red"
                progress={progress}
                onLoaderFinished={() => setProgress(0)}
            />
            <h2 className={`font-bold text-base py-5 ml-3 lg:text-2xl text-center ${animate ? 'animate-slideUp' : ''}`}>Manage Training Courses</h2>
            <section className='text-gray-300 body-font'>
                <div className='container px-5 mx-auto flex flex-col justify-center items-center'>
                    <div className='m-4'>
                        {data.map((course) => (
                            <div className={`rounded-lg shadow-md ${animate ? 'animate-slideUp' : ''}`} key={course._id}>
                                <section className="text-gray-600 body-font overflow-hidden">
                                    <div className="container px-5 py-20 mx-auto">
                                        <div className="-my-10 divide-y-2 divide-gray-100">
                                            <div className="py-2 flex flex-wrap md:flex-nowrap">

                                                {/* Delete Popup details */}

                                                {showDeletePopup && courseToDelete === course._id && (
                                                    <Transition show={open}>
                                                        <Dialog className="relative z-10" onClose={setOpen}>
                                                            <TransitionChild
                                                                enter="ease-out duration-300"
                                                                enterFrom="opacity-0"
                                                                enterTo="opacity-100"
                                                                leave="ease-in duration-200"
                                                                leaveFrom="opacity-100"
                                                                leaveTo="opacity-0"
                                                            >
                                                                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                                                            </TransitionChild>

                                                            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                                                                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                                                                    <TransitionChild
                                                                        enter="ease-out duration-300"
                                                                        enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                                                        enterTo="opacity-100 translate-y-0 sm:scale-100"
                                                                        leave="ease-in duration-200"
                                                                        leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                                                        leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                                                    >
                                                                        <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                                                            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                                                                <div className="sm:flex sm:items-start">
                                                                                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                                                                        <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                                                                                    </div>
                                                                                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                                                                        <DialogTitle as="h3" className="text-base font-semibold leading-6 text-gray-900">
                                                                                            Delete Course
                                                                                        </DialogTitle>
                                                                                        <div className="mt-2">
                                                                                            <p className="text-sm text-gray-500">
                                                                                                Are you sure you want to delete this course? All of your course data will be permanently
                                                                                                removed. This action cannot be undone.
                                                                                            </p>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                                                                <button
                                                                                    type="button"
                                                                                    className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                                                                                    onClick={() => handleDeleteCourse(course._id)}
                                                                                >
                                                                                    Delete Course
                                                                                </button>
                                                                                <button
                                                                                    type="button"
                                                                                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                                                                    onClick={() => setOpen(false)}
                                                                                    data-autofocus
                                                                                >
                                                                                    Cancel
                                                                                </button>
                                                                            </div>
                                                                        </DialogPanel>
                                                                    </TransitionChild>
                                                                </div>
                                                            </div>
                                                        </Dialog>
                                                    </Transition>
                                                )}

                                                {/* Update Popup details */}

                                                {showUpdatePopup && selectedCourse && (
                                                    <form onSubmit={handleFormSubmit}>
                                                        <section className="text-gray-600 body-font grid place-items-center relative">
                                                            <div className="z-20 fixed top-0 left-0 right-0 bottom-0 justify-center items-center px-5 py-10">
                                                                <div className="px-5 py-10 lg:w-1/2 bg-gray-100 mx-auto rounded-xl shadow-md">
                                                                    <div className="text-center w-full mb-6">
                                                                        <p className="lg:w-1/2 mx-auto leading-relaxed text-base">Update a specific course details below.</p>
                                                                    </div>
                                                                    <div className="overflow-y-auto max-h-[60vh] px-5">
                                                                        <div className="flex flex-wrap -m-2">
                                                                            <input type="hidden" name="_id" value={form._id} />
                                                                            <div className="p-2 w-full sm:w-1/2 lg:w-1/3">
                                                                                <div className="relative">
                                                                                    <label htmlFor="name" className="leading-7 text-sm text-gray-600">Name of the Course :</label>
                                                                                    <input value={form.name} onChange={handleFormChange} readOnly="true" required type="text" name="name" className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                                                                                </div>
                                                                            </div>
                                                                            <div className="p-2 w-full sm:w-1/2 lg:w-1/3">
                                                                                <div className="relative">
                                                                                    <label htmlFor="type" className="leading-7 text-sm text-gray-600">Course Type :</label>
                                                                                    <input value={form.type} onChange={handleFormChange} readOnly="true" required type="text" name="type" className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                                                                                </div>
                                                                            </div>
                                                                            <div className="p-2 w-full sm:w-1/2 lg:w-1/3">
                                                                                <div className="relative">
                                                                                    <label htmlFor="level" className="leading-7 text-sm text-gray-600">Level :</label>
                                                                                    <input value={form.level} onChange={handleFormChange} readOnly="true" required type="text" name="level" className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                                                                                </div>
                                                                            </div>
                                                                            <div className="p-2 w-full">
                                                                                <div className="relative">
                                                                                    <label htmlFor="description" className="leading-7 text-sm text-gray-600">Description :</label>
                                                                                    <textarea value={form.description} readOnly="true" onChange={handleFormChange} required name="description" className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"></textarea>
                                                                                </div>
                                                                            </div>
                                                                            <div className="p-2 w-full sm:w-1/2 lg:w-1/3">
                                                                                <div className="relative">
                                                                                    <label htmlFor="language" className="leading-7 text-sm text-gray-600">Language :</label>
                                                                                    <input value={form.language} onChange={handleFormChange} required type="text" name="language" className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                                                                                </div>
                                                                            </div>
                                                                            <div className="p-2 w-full sm:w-1/2 lg:w-1/3">
                                                                                <div className="relative">
                                                                                    <label htmlFor="creator" className="leading-7 text-sm text-gray-600">Created By :</label>
                                                                                    <input value={form.creator} onChange={handleFormChange} readOnly="true" required type="text" name="creator" className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                                                                                </div>
                                                                            </div>
                                                                            <div className="p-2 w-full sm:w-1/2 lg:w-1/3">
                                                                                <div className="relative">
                                                                                    <label htmlFor="duration" className="leading-7 text-sm text-gray-600">Duration :</label>
                                                                                    <input value={form.duration} onChange={handleFormChange} required type="text" name="duration" className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                                                                                </div>
                                                                            </div>
                                                                            <div className="p-2 w-full sm:w-1/2 lg:w-1/3">
                                                                                <div className="relative">
                                                                                    <label htmlFor="teacher" className="leading-7 text-sm text-gray-600">Tutor :</label>
                                                                                    <input value={form.teacher} onChange={handleFormChange} required type="email" name="teacher" className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                                                                                </div>
                                                                            </div>
                                                                            <div className="p-2 w-full sm:w-1/2 lg:w-1/3">
                                                                                <div className="relative">
                                                                                    <label htmlFor="price" className="leading-7 text-sm text-gray-600">Price :</label>
                                                                                    <input value={form.price} onChange={handleFormChange} required type="number" name="price" className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                                                                                </div>
                                                                            </div>
                                                                            <div className="p-2 w-full sm:w-4/5">
                                                                                <div className="relative">
                                                                                    <label htmlFor="img" className="leading-7 text-sm text-gray-600">Course Image URL :</label>
                                                                                    <input value={form.img} onChange={handleFormChange} type="text" name="img" className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex w-full justify-evenly mt-6">
                                                                        <input className="mt-3 inline-flex w-full justify-center rounded-md bg-gray-900 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-700 sm:ml-3 sm:w-auto" type='submit' value="Update course" />
                                                                        <input onClick={() => setShowUpdatePopup(false)} className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-gray-300 sm:ml-3 sm:w-auto" type='button' value='Close' />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </section>
                                                    </form>
                                                )}

                                                <div className="md:w-64 md:mb-0 mb-6 flex-shrink-0 flex justify-center flex-col">
                                                    <div className='flex relative h-48 justify-center rounded overflow-hidden'>
                                                        <img className='object-cover w-full h-full block' src={`${(course.img)[0]}`} alt="Course" />
                                                    </div>
                                                </div>
                                                <div className="md:flex-grow px-5">
                                                    <h2 className="text-2xl font-medium text-gray-900 title-font mb-2">Course Name: {course.name}</h2>
                                                    <h4 className="leading-relaxed"><span className='text-lg text-neutral-950'>Description:</span> {course.description}</h4>
                                                    <h4 className="leading-relaxed"><span className='text-lg text-neutral-950'>Type:</span> {course.type}</h4>
                                                    <h4 className="leading-relaxed"><span className='text-lg text-neutral-950'>Created By:</span> {course.creator}</h4>
                                                    <h4 className="leading-relaxed"><span className='text-lg text-neutral-950'>Tutor:</span> {course.teacher}</h4>
                                                    <h4 className="leading-relaxed"><span className='text-lg text-neutral-950'>Price:</span> ₹{course.price}.00</h4>
                                                    <div className='flex py-2'>
                                                        <button onClick={() => handleUpdateClick(course)} className="text-indigo-600 font-bold inline-flex items-center mr-4">
                                                            <FontAwesomeIcon icon={faPenToSquare} className="mr-1" /> Update
                                                        </button>
                                                        <button onClick={() => { setOpen(true); setShowDeletePopup(true); setCourseToDelete(course._id); }} className="text-red-600 font-bold inline-flex items-center">
                                                            <FontAwesomeIcon icon={faTrash} className="mr-1" /> Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        ))}
                    </div>
                    <button onClick={() => history(-1)} className='inline-flex w-full justify-center rounded-md bg-gray-900 px-3 py-2 m-3 text-sm font-semibold text-white shadow-sm hover:bg-ged-500 sm:ml-3 sm:w-auto'>Back</button>
                </div>
            </section>
            <ToastContainer />
        </div>
    );
}
