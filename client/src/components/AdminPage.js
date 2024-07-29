import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import LoadingBar from 'react-top-loading-bar';
import Cookies from 'js-cookie';
import Graph from './Graph';
import GraphDetails from './GraphDetails';
import GraphOrderDetails from './GraphOrderDetails';
import { ToastContainer, toast } from 'react-toastify';
import { FaChevronDown, FaChevronUp, FaPen } from 'react-icons/fa';

export default function AdminPage() {
    // Fetching User Mail from Cookies
    const [cookieVal] = useState(Cookies.get('email'));
    const url = "http://localhost:8000";

    // Views, Popup, Display setting details
    const [pendingRequests, setPendingRequests] = useState([]);
    const [settings, setSettings] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    // Setting up the data which is fetched from DB
    const [data, setData] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        dob: '',
        gender: '',
        profession: '',
        country: ''
    });
    const [profilePic, setprofilePic] = useState("");
    const [previewImage, setPreviewImage] = useState(null);

    // Setting up the data for display the graph details
    const [graphData, setGraphData] = useState([]);
    const [learningGraphData, setLearningGraphData] = useState([]);
    const [purchasedGraphData, setPurchasedGraphData] = useState([]);

    // Setup for Student and teacher details
    const [studentDetails, setStudentDetails] = useState([]);
    const [studentsCount, setStudentsCount] = useState(0);
    const [teachersDetails, setTeachersDetails] = useState([]);
    const [teachersCount, setTeachersCount] = useState(0);
    const [expandedStudents, setExpandedStudents] = useState({});
    const [animate, setAnimate] = useState(false);

    // Fetching Admin details from DB
    const submit = async () => {
        try {
            await axios.post(`${url}/adminaccount`, { cookieVal })
                .then(res => {
                    setData(res.data);
                    setFormData({
                        name: res.data.name,
                        email: res.data.email,
                        phone: res.data.phone,
                        dob: res.data.dob,
                        gender: res.data.gender,
                        profession: res.data.profession,
                        country: res.data.country
                    });
                    setPreviewImage(res.data.profilePic);
                }).catch(e => {
                    toast.error('Something went wrong!');
                });
        } catch (e) {
            toast.error('Something went wrong!');
        }
    };

    // Updating the admin details
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const updateProfile = new FormData();
        updateProfile.append("name", formData.name);
        updateProfile.append("email", formData.email);
        updateProfile.append("phone", formData.phone);
        updateProfile.append("dob", formData.dob);
        updateProfile.append("gender", formData.gender);
        updateProfile.append("profession", formData.profession);
        updateProfile.append("country", formData.country);
        if (profilePic) {
            updateProfile.append("profilePic", profilePic);
        }
        try {
            const res = await axios.post(`${url}/updateProfile`, updateProfile, { headers: { "Content-Type": "multipart/form-data" } });
            setFormData(res.data);
            setPreviewImage(res.data.profilePic);
            toast.success('Profile updated successfully!');
            setSettings(false);
            submit();
        } catch (e) {
            toast.error('Failed to update profile!');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Fetching Users details graph data
    const fetchGraphData = async () => {
        try {
            const res = await axios.get(`${url}/graphData`);
            setGraphData(res.data);
        } catch (e) {
            toast.error("Something went wrong!");
        }
    };

    // Fetching Courses details graph data
    const fetchLearningGraphData = async () => {
        try {
            const res = await axios.get(`${url}/learningGraphData`);
            setLearningGraphData(res.data);
        } catch (e) {
            toast.error("Something went wrong!");
        }
    };

    // Fetching Purchases details graph data
    const fetchPurchaseGraphData = async () => {
        try {
            const res = await axios.get(`${url}/purchasedGraphData`);
            setPurchasedGraphData(res.data);
        } catch (e) {
            toast.error("Something went wrong!");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setprofilePic(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    // Approval section for both teachers and courses
    const fetchPendingRequests = async () => {
        try {
            const response = await axios.get(`${url}/pendingTeacherRequests`);
            setPendingRequests(response.data);
        } catch (error) {
            toast.error('Failed to fetch pending requests');
        }
    };

    const handleApproval = async (email, approve) => {
        try {
            await axios.post(`${url}/approveTeacherRequest`, { email, approve });
            setPendingRequests((prev) => prev.filter((request) => request.email !== email));
            toast.success(`User ${approve ? 'approved' : 'rejected'} successfully`);
        } catch (error) {
            toast.error('Failed to process request');
        }
    };


    const fetchStudents = async () => {
        try {
            const res = await axios.get(`${url}/students`, { params: { role: "Student" } });
            setStudentDetails(res.data);
            setStudentsCount(res.data.length);
        } catch (e) {
            toast.error("Something went wrong!");
        }
    };

    const fetchTeachers = async () => {
        try {
            const res = await axios.get(`${url}/teachers`, { params: { role: "Teacher" } });
            setTeachersDetails(res.data);
            setTeachersCount(res.data.length);
        } catch (e) {
            toast.error("Something went wrong!");
        }
    };

    const fetchUserCourse = async (email) => {
        try {
            const res = await axios.get(`${url}/fetchCourse/${email}`);
            return res.data[0]?.allCourses || [];
        } catch (e) {
            toast.error("Something went wrong!");
            return [];
        }
    };

    const toggleExpand = async (email) => {
        if (expandedStudents[email]) {
            setExpandedStudents(prev => ({
                ...prev,
                [email]: {
                    ...prev[email],
                    expanded: !prev[email].expanded
                }
            }));
        } else {
            const courseData = await fetchUserCourse(email);
            setExpandedStudents(prev => ({
                ...prev,
                [email]: {
                    expanded: true,
                    courseData: courseData
                }
            }));
        }
    };

    useEffect(() => {
        submit();
        fetchGraphData();
        fetchLearningGraphData();
        fetchPurchaseGraphData();
        fetchPendingRequests();
        fetchStudents();
        fetchTeachers();
        setAnimate(true);
    }, [cookieVal]);

    return (
        <div>
            <LoadingBar
                color='red'
                progress={progress}
                onLoaderFinished={() => setProgress(0)}
            />

            {settings && (
                <form className='z-20 fixed top-0 left-0 right-0 bottom-0 bg-custom-radial overflow-auto flex justify-center items-center' onSubmit={handleFormSubmit}>
                    <section className='text-gray-600 body-font relative'>
                        <div className='container lg:w-1/2 py-20 mx-auto mt-8 rounded-lg shadow-md'>
                            <div className='flex flex-col text-center w-full mb-12'>
                                <h1 className='sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900'>Personal Information</h1>
                            </div>
                            <div className='w-3/4 mx-auto'>
                                <div className='flex flex-wrap -m-2'>
                                    <div className='w-full py-4 flex items-end justify-between border-b'>
                                        <div className='flex'>
                                            {previewImage ? (
                                                <img className="rounded-full object-cover w-16 h-16" src={previewImage} alt="Profile" />
                                            ) : (
                                                <img className="rounded-full object-cover w-16 h-16" src={`${url}/${data.profilePicPath}`} alt="Profile" />
                                            )}
                                        </div>
                                        <div>
                                            <input className="hidden" id="fileInput" type="file" onChange={handleFileChange} />
                                            <button type="button" className='py-1 px-4 rounded-md border hover:bg-gray-100' onClick={() => document.getElementById('fileInput').click()}>
                                                Upload Image
                                            </button>
                                        </div>
                                    </div>
                                    <div className='p-2 w-1/2'>
                                        <div className='relative'>
                                            <label htmlFor='name' className='block text-sm font-medium leading-6 text-gray-900'>User Name</label>
                                            <input name='name' type='text' value={formData.name} onChange={handleInputChange} className='block w-full rounded-md py-1.5 px-1.5 text-gray-900 shadow-sm border border-gray-900 outline-none sm:text-sm sm:leading-6' />
                                        </div>
                                    </div>
                                    <div className='p-2 w-1/2'>
                                        <div className='relative'>
                                            <label htmlFor='email' className='block text-sm font-medium leading-6 text-gray-900'>Email address</label>
                                            <input name='email' type='email' value={formData.email} readOnly className='block w-full rounded-md py-1.5 px-1.5 text-gray-900 shadow-sm border border-gray-900 outline-none sm:text-sm sm:leading-6' />
                                        </div>
                                    </div>
                                    <div className='p-2 w-1/2'>
                                        <div className='relative'>
                                            <label htmlFor='phone' className='block text-sm font-medium leading-6 text-gray-900'>Contact</label>
                                            <input name='phone' type='tel' value={formData.phone} onChange={handleInputChange} className='block w-full rounded-md py-1.5 px-1.5 text-gray-900 shadow-sm border border-gray-900 outline-none sm:text-sm sm:leading-6' />
                                        </div>
                                    </div>
                                    <div className='p-2 w-1/2'>
                                        <div className='relative'>
                                            <label htmlFor='dob' className='block text-sm font-medium leading-6 text-gray-900'>Date Of Birth</label>
                                            <input name='dob' type='date' value={formData.dob} onChange={handleInputChange} className='block w-full rounded-md py-1.5 px-1.5 text-gray-900 shadow-sm border border-gray-900 outline-none sm:text-sm sm:leading-6' />
                                        </div>
                                    </div>
                                    <div className='p-2 w-1/2'>
                                        <label htmlFor='gender' className='block text-sm font-medium leading-6 text-gray-900'>Gender</label>
                                        <div className='relative flex items-center gap-10'>
                                            <label htmlFor='genderMale' className='text-sm font-medium leading-6 flex text-gray-900'>
                                                <input id='genderMale' name='gender' value='male' type='radio' checked={formData.gender === 'male'} onChange={handleInputChange} />Male
                                            </label>
                                            <label htmlFor='genderFemale' className='text-sm font-medium leading-6 flex text-gray-900'>
                                                <input id='genderFemale' name='gender' value='female' type='radio' checked={formData.gender === 'female'} onChange={handleInputChange} />Female
                                            </label>
                                        </div>
                                    </div>
                                    <div className='p-2 w-full'>
                                        <div className='relative'>
                                            <label htmlFor='profession' className='block text-sm font-medium leading-6 text-gray-900'>Profession</label>
                                            <select name='profession' value={formData.profession} onChange={handleInputChange} className='block w-full rounded-md py-1.5 px-1.5 text-gray-900 shadow-sm border border-gray-900 outline-none sm:text-sm sm:leading-6 sm:max-w-xs'>
                                                <option value=''>-No Selection-</option>
                                                <option value='Student'>Student</option>
                                                <option value='Fresher'>Fresher</option>
                                                <option value='Employee'>Employee</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className='p-2 w-full'>
                                        <div className='relative'>
                                            <label htmlFor='country' className='block text-sm font-medium leading-6 text-gray-900'>Country</label>
                                            <select name='country' value={formData.country} onChange={handleInputChange} className='block w-full rounded-md py-1.5 px-1.5 text-gray-900 shadow-sm border border-gray-900 outline-none sm:text-sm sm:leading-6 sm:max-w-xs'>
                                                <option value=''>-No Selection-</option>
                                                <option value='United States'>United States</option>
                                                <option value='Canada'>Canada</option>
                                                <option value='Mexico'>Mexico</option>
                                                <option value='India'>India</option>
                                                <option value='China'>China</option>
                                                <option value='Australia'>Australia</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className='mt-6 flex items-center justify-end gap-x-6'>
                                        <button onClick={() => setSettings(false)} type='button' className='text-sm font-semibold leading-6 text-gray-900'>
                                            Cancel
                                        </button>
                                        <button type='submit' className='rounded-md bg-gray-900 px-3 py-2 text-sm font-semibold text-white shadow-sm' disabled={isSubmitting}>
                                            {isSubmitting ? 'Saving...' : 'Save details'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </form>
            )}

            <div className='min-h-screen text-center bg-gray-100 p-4 bg-custom-radial'>
                <h1 className='sm:text-4xl text-3xl mb-4 font-bold text-gray-900'>Hello 👋 {data.name}</h1>
                <p className='mb-8'>Your Email ID: {cookieVal}</p>
                <div className='w-full flex justify-center items-center'>
                    <div onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} className='relative w-20 flex justify-center items-center mb-4' onClick={() => setSettings(true)}>
                        <img className="rounded-full object-cover w-20 h-20" src={`${url}/${data.profilePicPath}`} />
                        {isHovered && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center rounded-full">
                                <button className="font-bold uppercase text-sm text-gray-100"><FaPen /></button>
                            </div>
                        )}
                    </div>
                </div>

                <h1 className='text-3xl font-bold mb-4'>Dashboard</h1>

                <div className='my-10 lg:flex w-full'>
                    <div className='my-5 px-5 mt-10 w-full border-r border-b'>
                        <h2 className='text-2xl text-center font-bold mb-4'>Users Activity</h2>
                        <Graph data={graphData} />
                    </div>
                    <div className='my-5 px-5 mt-10 w-full border-r border-b'>
                        <h2 className='text-2xl text-center font-bold mb-4'>Total Courses</h2>
                        <GraphDetails data={learningGraphData} />
                    </div>
                    <div className='my-5 px-5 mt-10 w-full border-b'>
                        <h2 className='text-2xl text-center font-bold mb-4'>Purchased Courses</h2>
                        <GraphOrderDetails data={purchasedGraphData} />
                    </div>
                </div>

                <div className='w-full border border-gray-900'></div>

                <div className='lg:flex gap-x-5'>
                    <div className="mt-8 lg:w-1/3 shadow-lg p-3 h-96 overflow-y-auto">
                        <h2 className="text-lg text-center border-b border-gray-700 font-bold pb-3 mb-4">Requests to Become a Teacher</h2>
                        <div className="overflow-x-auto">
                            {pendingRequests.length > 0 ? (
                                <table className="table-auto w-full border-collapse border border-gray-300">
                                    <thead>
                                        <tr className="bg-gray-900 text-gray-300">
                                            <th className="border border-gray-300 px-4 py-2 text-left">Email</th>
                                            <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
                                            <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pendingRequests.map((request) => (
                                            <tr key={request.email} className="hover:bg-gray-400">
                                                <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700">{request.email}</td>
                                                <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700">{request.name}</td>
                                                <td className="border border-gray-300 px-4 py-2 text-sm">
                                                    <button onClick={() => handleApproval(request.email, true)} className="bg-green-700 text-white text-sm px-2 py-1 rounded mr-2">Approve</button>
                                                    <button onClick={() => handleApproval(request.email, false)} className="bg-red-700 text-white text-sm px-2 py-1 rounded">Reject</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p className="text-gray-700 font-semibold">No requests pending.</p>
                            )}
                        </div>
                    </div>

                    <div className="mt-8 lg:w-1/3 shadow-lg p-3 h-96 overflow-y-auto">
                        <h2 className="text-lg text-center border-b border-gray-700 font-bold pb-3 mb-4">Requests to Accept a Course</h2>
                        <div className="overflow-x-auto">
                            {pendingRequests.length > 0 ? (
                                <table className="table-auto w-full">
                                    <thead>
                                        <tr>
                                            <th>Email</th>
                                            <th>Name</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pendingRequests.map((request) => (
                                            <tr key={request.email}>
                                                <td className='text-sm'>{request.email}</td>
                                                <td className='text-sm'>{request.name}</td>
                                                <td>
                                                    <button onClick={() => handleApproval(request.email, true)} className="bg-green-700 text-white text-sm px-2 py-1 rounded mr-2">Approve</button>
                                                    <button onClick={() => handleApproval(request.email, false)} className="bg-red-700 text-white text-sm px-2 py-1 rounded">Reject</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p className="text-gray-700 font-semibold">No requests pending.</p>
                            )}
                        </div>
                    </div>

                    <div className='mt-8 lg:w-1/3 shadow-lg p-3 h-96 overflow-y-auto'>
                        <h1 className="text-xl font-bold mb-5">Student and Teacher Details</h1>
                        <section>
                            <h2 className="text-lg font-semibold mb-3">Students ({studentsCount})</h2>
                            <ul role="list" className="divide-y divide-gray-100">
                                {studentDetails.map((person) => (
                                    <li key={person.email} className="w-full gap-y-2 py-5">
                                        <div className="flex items-center gap-x-6">
                                            <div className="flex min-w-0 gap-x-4">
                                                <img className="text-sm text-center font-bold h-12 w-12 flex-none rounded-full object-cover bg-gray-50" src={`${url}/${person.profilePicPath}`} alt={person.name} />
                                                <div className="min-w-48 flex-auto pr-10 border-r">
                                                    <p className="text-sm font-semibold leading-6 text-gray-900">{person.name}</p>
                                                    <p className="mt-1 truncate text-xs leading-5 text-gray-500">{person.email}</p>
                                                </div>
                                                <div>
                                                    <p className='font-bold mt-1 truncate text-xs leading-5 text-gray-500'>Contact : {person.phone}</p>
                                                    <p className='font-bold mt-1 truncate text-xs leading-5 text-gray-500'>Gender : {person.gender}</p>
                                                    <p className='font-bold mt-1 truncate text-xs leading-5 text-gray-500'>Country : {person.country}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center">
                                                <button onClick={() => toggleExpand(person.email)} className="ml-2">
                                                    {expandedStudents[person.email]?.expanded ? <FaChevronUp /> : <FaChevronDown />}
                                                </button>
                                            </div>
                                        </div>
                                        {expandedStudents[person.email]?.expanded && (
                                            <div>
                                                <div className="mt-2">
                                                    <div className='whitespace-nowrap overflow-x-auto max-w-full'>
                                                        <ul className='flex gap-x-2 overflow-x-auto'>
                                                            {expandedStudents[person.email]?.courseData.map((course, index) => (
                                                                <li key={index} className={`lg:ml-4 rounded-lg`}>
                                                                    <Link>
                                                                        <img className='h-16 w-28 object-cover rounded-lg border shadow-sm' src={course.img} alt={course.name} />
                                                                    </Link>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </section>
                        <section className="mt-8">
                            <h2 className="text-lg font-semibold mb-3">Teachers ({teachersCount})</h2>
                            <ul role="list" className="divide-y divide-gray-100">
                                {teachersDetails.map((person) => (
                                    <li key={person.email} className="w-full gap-y-2 py-5">
                                        <div className="flex items-center gap-x-6">
                                            <div className='flex min-w-0 gap-x-4'>
                                                <img className="text-sm text-center font-bold h-12 w-12 flex-none rounded-full object-cover bg-gray-50" src={`${url}/${person.profilePicPath}`} alt={person.name} />
                                                <div className="min-w-48 flex-auto pr-10 border-r">
                                                    <p className="text-sm font-semibold leading-6 text-gray-900">{person.name}</p>
                                                    <p className="mt-1 truncate text-xs leading-5 text-gray-500">{person.email}</p>
                                                </div>
                                                <div>
                                                    <p className='font-bold mt-1 truncate text-xs leading-5 text-gray-500'>Contact : {person.phone}</p>
                                                    <p className='font-bold mt-1 truncate text-xs leading-5 text-gray-500'>Gender : {person.gender}</p>
                                                    <p className='font-bold mt-1 truncate text-xs leading-5 text-gray-500'>Country : {person.country}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center">
                                                <button onClick={() => toggleExpand(person.email)} className="ml-2">
                                                    {expandedStudents[person.email]?.expanded ? <FaChevronUp /> : <FaChevronDown />}
                                                </button>
                                            </div>
                                        </div>
                                        {expandedStudents[person.email]?.expanded && (
                                            <div>
                                                <div className="mt-2">
                                                    <div className='whitespace-nowrap overflow-x-auto max-w-full'>
                                                        <ul className='flex gap-x-2 overflow-x-auto'>
                                                            {expandedStudents[person.email]?.courseData.map((course, index) => (
                                                                <li key={index} className={`lg:ml-4 rounded-lg`}>
                                                                    <Link>
                                                                        <img className='h-16 w-28 object-cover rounded-lg border shadow-sm' src={course.img} alt={course.name} />
                                                                    </Link>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </section>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}
