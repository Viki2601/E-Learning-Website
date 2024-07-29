import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBarsProgress, faBookOpenReader, faHeart, faPlusCircle, faTasks, faUsers } from '@fortawesome/free-solid-svg-icons';
import { FaPen } from 'react-icons/fa';

export default function MyAccount() {
    const [cookieVal] = useState(Cookies.get('email'));
    const url = "http://localhost:8000"
    const [data, setData] = useState('');
    const [settings, setSettings] = useState(false);
    const [isTeacherApproved, setIsTeacherApproved] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        dob: '',
        gender: '',
        profession: '',
        country: '',
        role: '',
    });
    const [profilePic, setprofilePic] = useState("");
    const [previewImage, setPreviewImage] = useState(null);

    const submit = async () => {
        try {
            const res = await axios.post(`${url}/myaccount`, { cookieVal });
            setData(res.data);
            setFormData({
                name: res.data.name,
                email: res.data.email,
                phone: res.data.phone,
                dob: res.data.dob,
                gender: res.data.gender,
                profession: res.data.profession,
                country: res.data.country,
                role: res.data.role,
            });
            setPreviewImage(res.data.profilePic);
            setIsTeacherApproved(res.data.role_status);
        } catch (e) {
            toast.error('Something went wrong while fetching data!');
        }
    };

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
        updateProfile.append("role", formData.role);
        if (profilePic) {
            updateProfile.append("profilePic", profilePic);
        }

        try {
            const res = await axios.post(`${url}/updateProfile`, updateProfile, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            setFormData(res.data);
            setPreviewImage(res.data.profilePic);
            setSettings(false);
            submit();
        } catch (e) {
            toast.error('Failed to update profile!');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = async (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));

        if (name === 'role' && value === 'Teacher') {
            try {
                const response = await axios.post(`${url}/requestTeacherRole`, { email: formData.email, role: value });
                if (response.data.role_status === 'pending') {
                    toast.success('Your request to become a teacher is pending approval.');
                }
            } catch (error) {
                toast.error('Failed to request teacher role!');
            }
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setprofilePic(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    useEffect(() => {
        submit();
    }, [cookieVal]);

    return (
        <div>
            {settings && (
                <form className='z-20 fixed top-0 left-0 right-0 bottom-0 bg-custom-radial overflow-auto' onSubmit={handleFormSubmit}>
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
                                    <div className='p-2 w-full'>
                                        <div className='relative flex items-center gap-10'>
                                            <label htmlFor='role' className='block text-md font-bold leading-6 text-gray-900'>As a : </label>
                                            <label htmlFor='roleStudent' className='text-sm font-medium leading-6 flex text-gray-900'>
                                                <input id='roleStudent' name='role' value='Student' type='radio' checked={formData.role === 'Student'} onChange={handleInputChange} />Student
                                            </label>
                                            <label htmlFor='roleTeacher' className='text-sm font-medium leading-6 flex text-gray-900'>
                                                <input id='roleTeacher' name='role' value='Teacher' type='radio' checked={formData.role === 'Teacher'} onChange={handleInputChange} />Teacher
                                            </label>
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

            <div className="min-h-screen text-center bg-gray-100 p-4 bg-custom-radial">
                <h1 className='sm:text-4xl text-3xl mb-4 font-bold text-gray-900'>Hello 👋 {data.name}</h1>
                <p className='mb-4'>Your Email ID : {cookieVal}</p>
                <div className='w-full flex justify-center items-center'>
                    <div onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} className='relative w-20 flex justify-center items-center mb-4' onClick={() => setSettings(true)}>
                        <img className="rounded-full object-cover w-20 h-20" src={`${url}/${data.profilePicPath}`} alt='Profile'/>
                        {isHovered && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center rounded-full">
                                <button className="font-bold uppercase text-sm text-gray-100"><FaPen /></button>
                            </div>
                        )}
                    </div>
                </div>
                <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {data.role === 'Teacher' && isTeacherApproved ==='approved' ? (
                        <>
                            <Link to='/addCourse' className="bg-custom-radial-1 py-6 rounded-lg text-center shadow">
                                <FontAwesomeIcon icon={faPlusCircle} className='text-3xl lg:text-5xl' />
                                <h2 className='title-font font-medium text-lg lg:text-2xl mt-4 text-gray-900'>Add Course</h2>
                            </Link>
                            <Link to='/updateCourseViewPage' className="bg-custom-radial-1 p-6 rounded-lg text-center shadow">
                                <FontAwesomeIcon icon={faTasks} className='text-3xl lg:text-5xl' />
                                <h2 className='title-font font-medium text-lg lg:text-2xl mt-4 text-gray-900'>Manage Course</h2>
                            </Link>
                            <Link to='/StudentDetails' className="bg-custom-radial-1 p-6 rounded-lg text-center shadow">
                                <FontAwesomeIcon icon={faUsers} className='text-3xl lg:text-5xl' />
                                <h2 className='title-font font-medium text-lg lg:text-2xl mt-4 text-gray-900'>Student Details</h2>
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link to='/purchased' className="bg-custom-radial-1 p-6 rounded-lg text-center shadow">
                                <FontAwesomeIcon icon={faBookOpenReader} className='text-3xl lg:text-5xl' />
                                <h2 className='title-font font-medium text-lg lg:text-2xl mt-4 text-gray-900'>Purchased Course</h2>
                            </Link>
                            <Link to='/' className="bg-custom-radial-1 p-6 rounded-lg text-center shadow">
                                <FontAwesomeIcon icon={faHeart} className='text-3xl lg:text-5xl' />
                                <h2 className='title-font font-medium text-lg lg:text-2xl mt-4 text-gray-900'>Wishlist</h2>
                            </Link>
                            <Link to='/' className="bg-custom-radial-1 p-6 rounded-lg text-center shadow">
                                <FontAwesomeIcon icon={faBarsProgress} className='text-3xl lg:text-5xl' />
                                <h2 className='title-font font-medium text-lg lg:text-2xl mt-4 text-gray-900'>Your Progress</h2>
                            </Link>
                        </>
                    )}
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}
