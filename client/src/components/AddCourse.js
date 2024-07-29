import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from "axios"
import { ToastContainer, toast } from 'react-toastify'
import LoadingBar from 'react-top-loading-bar'

export default function AddCourse() {
    const history = useNavigate();
    const url = "http://localhost:8000";
    const [progress, setProgress] = useState(0)
    const [form, setForm] = useState({
        name: '',
        type: '',
        level: '',
        description: '',
        language: '',
        creator: '',
        duration: '',
        teacher: '',
        price: null
    });

    const [image, setImage] = useState('');

    async function submit(e) {
        e.preventDefault();

        if (image.length === 0) {
            toast.error("Required an image URL")
        }
        else {
            try {
                await axios.post(`${url}/addcourse`, { form, image })
                    .then(res => {
                        if (res.data === "pass") {
                            toast.success("Course Request sent Successfully...");
                            setTimeout(() => {
                                history("/updateCourseViewPage")
                            }, 2000)
                        }
                        else if (res.data === "fail") {
                            toast.error("Something went Wrong!");
                        }
                    })
                    .catch(e => {
                        toast.error("Something went Wrong!");
                    })
            }
            catch (e) {
                toast.error("Something went Wrong!");
            }
            setForm({ name: '', type: '', level: '', description: '', language: '', creator: '', duration: '', teacher: '', price: '' });
            setImage('');
        }
    };

    const handleChange = (event) => {
        setImage(event.target.value);
    };


    return (
        <div className='bg-custom-radial'>
            <LoadingBar
                color='red'
                progress={progress}
                onLoaderFinished={() => setProgress(0)}
            />
            <form action='POST' method='/login' onSubmit={submit}>

                <section className="text-gray-600 body-font grid place-items-center relative">
                    <div className="container px-5 py-24 lg:w-1/2">
                        <div className="flex flex-col text-center w-full mb-6">
                            <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">Add a specific course details below.</h1>
                        </div>
                        <div className=" px-10 py-10 mx-auto rounded-xl shadow-md">
                            <div className="flex flex-wrap -m-2">
                                <div className="p-2 w-full sm:w-1/2 lg:w-1/3">
                                    <div className="relative">
                                        <label for="name" className="leading-7 text-sm text-gray-600">Name of the Course :</label>
                                        <input value={form.name} onChange={(event) => setForm({ ...form, [event.target.name]: event.target.value })}
                                            placeholder='eg: Full Stack Web development'
                                            required
                                            type="text"
                                            name="name"
                                            className="w-full text-sm bg-gray-100 bg-opacity-50 rounded border border-gray-900 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 outline-none text-gray-700 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                                    </div>
                                </div>
                                <div className="p-2 w-full sm:w-1/2 lg:w-1/3">
                                    <div className="relative">
                                        <label for="type" className="leading-7 text-sm text-gray-600">Course Type :</label>
                                        <input value={form.type} onChange={(event) => setForm({ ...form, [event.target.name]: event.target.value })}

                                            placeholder='eg: Web development'
                                            required
                                            type="text"
                                            name="type"
                                            className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-900 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-sm outline-none text-gray-700 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                                    </div>
                                </div>
                                <div className="p-2 w-full sm:w-1/2 lg:w-1/3">
                                    <div className="relative">
                                        <label for="level" className="leading-7 text-sm text-gray-600">Level :</label>
                                        <select value={form.level} onChange={(event) => setForm({ ...form, [event.target.name]: event.target.value })}
                                            required
                                            name="level"
                                            className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-900 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-sm outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" >
                                            <option value=''>-No Selection-</option>
                                            <option value='Beginer'>Beginer</option>
                                            <option value='Intermediate'>Intermediate</option>
                                            <option value='Advanced'>Advanced</option>

                                        </select>
                                    </div>
                                </div>
                                <div className="p-2 w-full">
                                    <div className="relative">
                                        <label for="description" className="leading-7 text-sm text-gray-600">Description :</label>
                                        <textarea value={form.description} onChange={(event) => setForm({ ...form, [event.target.name]: event.target.value })}
                                            placeholder='eg: Introducing Dev Mode, a new space in Figma for developers. Bring clarity to designs and give developers the tools they need to translate them into code. Save time and keep things consistent with reusable assets in shared libraries. Standardize components and variables so that there’s more time for exploration, and less time doing busy work.'
                                            required
                                            name="description"
                                            className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-900 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 h-32 text-sm outline-none text-gray-700 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"></textarea>
                                    </div>
                                </div>
                                <div className="p-2 w-full sm:w-1/2 lg:w-1/3">
                                    <div className="relative">
                                        <label for="language" className="leading-7 text-sm text-gray-600">Language :</label>
                                        <input value={form.language} onChange={(event) => setForm({ ...form, [event.target.name]: event.target.value })}
                                            placeholder='eg: English '
                                            required
                                            type="text"
                                            name="language"
                                            className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-900 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-sm outline-none text-gray-700 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                                    </div>
                                </div>
                                <div className="p-2 w-full sm:w-1/2 lg:w-1/3">
                                    <div className="relative">
                                        <label for="creator" className="leading-7 text-sm text-gray-600">Created By :</label>
                                        <input value={form.creator} onChange={(event) => setForm({ ...form, [event.target.name]: event.target.value })}
                                            placeholder='eg: SkillsUpdate.inc'
                                            required
                                            type="text"
                                            name="creator"
                                            className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-900 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-sm outline-none text-gray-700 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                                    </div>
                                </div>
                                <div className="p-2 w-full sm:w-1/2 lg:w-1/3">
                                    <div className="relative">
                                        <label for="duration" className="leading-7 text-sm text-gray-600">Duration :</label>
                                        <input value={form.duration} onChange={(event) => setForm({ ...form, [event.target.name]: event.target.value })}
                                            placeholder='eg: 5 Hours'
                                            required
                                            type="text"
                                            name="duration"
                                            className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-900 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-sm outline-none text-gray-700 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                                    </div>
                                </div>
                                <div className="p-2 w-full sm:w-1/2 lg:w-1/3">
                                    <div className="relative">
                                        <label for="teacher" className="leading-7 text-sm text-gray-600">Tutor :</label>
                                        <input value={form.teacher} onChange={(event) => setForm({ ...form, [event.target.name]: event.target.value })}
                                            placeholder='eg: Monica@gmail.com'
                                            required
                                            type="email"
                                            name="teacher"
                                            className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-900 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-sm outline-none text-gray-700 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                                    </div>
                                </div>
                                <div className="p-2 w-full sm:w-1/2 lg:w-1/3">
                                    <div className="relative">
                                        <label for="price" className="leading-7 text-sm text-gray-600">Price :</label>
                                        <input value={form.price} onChange={(event) => setForm({ ...form, [event.target.name]: event.target.value })}
                                            placeholder='eg: 1599.00'
                                            required
                                            type="number"
                                            name="price"
                                            className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-900 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-sm outline-none text-gray-700 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                                    </div>
                                </div>
                                <div className="p-2 w-2/3">
                                    <div className="relative">
                                        <label for="image" className="leading-7 text-sm text-gray-600">Course Image URL :</label>
                                        <input value={image} onChange={handleChange}
                                            placeholder='https://i.ytimg.com/vi/Cx2dkpBxst8/maxresdefault.jpg'
                                            type="text"
                                            name="image"
                                            className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-900 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-sm outline-none text-gray-700 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                                    </div>
                                </div>
                                <br />
                                <div className="p-2 flex  w-full justify-evenly">
                                    <input className="mt-3 inline-flex w-full justify-center rounded-md bg-gray-900 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-700 sm:ml-3 sm:w-auto" type='submit' value='Add Course' />
                                    <input onClick={() => history(-1)} className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-300 sm:ml-3 sm:w-auto" type='submit' value='Cancel' />

                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </form>
            <ToastContainer />
        </div>
    )
}
