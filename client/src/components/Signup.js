import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ReCAPTCHA from 'react-google-recaptcha'
import axios from "axios"
import { ToastContainer, toast } from 'react-toastify';
import Cookies from "js-cookie";


export default function Signup() {
    const url = "https://e-learning-website-server.onrender.com";
    const [captchaval, setCaptchaVal] = useState(null);
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: "",
        email: '',
        password: '',
        repassword: ''
    });

    const submit = async (e) => {
        e.preventDefault()
        try {
            if (form.password.length < 6) {
                toast.error("Password should be more than 6 Character");
            }
            else if (form.password !== form.repassword) {
                toast.error("Password dosen't match");
            }
            else if (!captchaval) {
                toast.error("Captcha is required");
            }
            else {
                await axios.post(`${url}/signup`, {
                    form
                })
                    .then(res => {
                        if (res.data === "exists") {
                            toast.error("Email already exists")
                        }
                        else if (res.data = "notexists") {
                            Cookies.set("email", form.email, { expires: 7 })
                            toast.success("Successfully registered", { autoClose: 1000 });
                            setTimeout(() => {
                                navigate("/login")
                            }, 2000)
                        }
                    }).catch(e => {
                        toast.error("Something went wrong!")
                    })
            }
        } catch (e) {
            toast.error("Something went wrong!");
        }
    }

    return (
        <div className='mb-6'>
            <form action='POST' method='/login' onSubmit={submit}>
                <section class="text-gray-400 bg-white body-font relative grid place-items-center mt-10">
                    <div class="lg:w-1/3 md:w-1/2 shadow-md rounded-lg p-8 flex flex-col mt-10 md:mt-0 relative z-10">
                        <h2 class="text-gray-900 text-lg mb-1 font-medium title-font">Signup</h2>
                        <div class="relative mb-4">
                            <label for="name" class="leading-7 text-sm text-gray-400">Name</label>
                            <input required value={form.name} onChange={(e) => { setForm({ ...form, [e.target.name]: e.target.value }) }} type="text" id="name" name="name" class="w-full rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-900 text-base outline-none text-gray-900 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                        </div>
                        <div class="relative mb-4">
                            <label for="email" class="leading-7 text-sm text-gray-400">Email</label>
                            <input required value={form.email} onChange={(e) => { setForm({ ...form, [e.target.name]: e.target.value }) }} type="email" id="email" name="email" class="w-full rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-900 text-base outline-none text-gray-900 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                        </div>
                        <div class="relative mb-4">
                            <label for="password" class="leading-7 text-sm text-gray-400">Password</label>
                            <input required value={form.password} onChange={(e) => { setForm({ ...form, [e.target.name]: e.target.value }) }} type="password" id="password" name="password" class="w-full rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-900 text-base outline-none text-gray-900 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                        </div>
                        <div class="relative mb-4">
                            <label for="repassword" class="leading-7 text-sm text-gray-400">Confirm Password</label>
                            <input required value={form.repassword} onChange={(e) => { setForm({ ...form, [e.target.name]: e.target.value }) }} type="password" id="repassword" name="repassword" class="w-full rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-900 text-base outline-none text-gray-900 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                        </div>

                        <ReCAPTCHA
                            sitekey='6LfA2-8pAAAAAOFjPZxNQFaCIxJ1FligEG9GYYfG'
                            onChange={(value) => { setCaptchaVal(value) }}
                        />

                        <input class="mt-3 cursor-pointer text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg" type='submit' value='Submit' />

                        <p className='text-base mt-3'>Already have an account?</p>
                        <p className='text-base text-blue-700 mt-3'><Link to={'/login'}>Login</Link></p>

                    </div>
                </section>
            </form>
            <ToastContainer/>
        </div>
    )
}
