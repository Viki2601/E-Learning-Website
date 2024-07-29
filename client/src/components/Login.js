import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import ReCAPTCHA from 'react-google-recaptcha'
import axios from "axios"
import { ToastContainer, toast } from 'react-toastify'
import Cookies from 'js-cookie';



export default function Login() {
    const url = "https://e-learning-website-server.onrender.com";
    const [captchaval, setCaptchaVal] = useState(null);

    const [form, setForm] = useState({
        email: '',
        password: ''
    });

    const submit = async (e) => {
        e.preventDefault();

        try {
            if (!captchaval) {
                toast.error("Captcha is required")
            } else {
                await axios.post(`${url}/login`, {
                    form
                })
                    .then(res => {
                        if (res.data === "loginPass") {
                            Cookies.set("email", form.email, { expires: 7 })
                            toast.success("Successfully Login...")
                        }
                        else if (res.data === "nouser") {
                            toast.error("The Email is not registered");
                        }
                        else if (res.data === "loginFail") {
                            toast.error("Invalid Credential");
                        }
                        else if (res.data === "fail") {
                            toast.error("Something went Wrong!");
                        }
                    }).catch(e => {
                        toast.error("Something went Wrong!");
                    })
            }
        }
        catch (e) {
            toast.error("Something went Wrong!");
        }
    }

    return (
        <div className='mb-6'>
            <form action='POST' method='/login' onSubmit={submit}>
                <section class="text-gray-400 bg-white body-font relative grid place-items-center mt-10">
                    <div class="lg:w-1/3 md:w-1/2 bg-white shadow-md rounded-lg p-8 flex flex-col mt-10 md:mt-0 relative z-10">
                        <h2 class="text-gray-900 text-lg mb-1 font-medium title-font">Login</h2>
                        <div class="relative mb-4">
                            <label for="email" class="leading-7 text-sm text-gray-400">Email</label>
                            <input value={form.email} onChange={(event) => setForm({ ...form, [event.target.name]: event.target.value })} required type="email" id="email" name="email" class="w-full rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-900 text-base outline-none text-gray-900 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                        </div>
                        <div class="relative mb-4">
                            <label for="password" class="leading-7 text-sm text-gray-400">Password</label>
                            <input value={form.password} onChange={(event) => setForm({ ...form, [event.target.name]: event.target.value })} required type="password" id="password" name="password" class="w-full rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-900 text-base outline-none text-gray-900 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                        </div>

                        <ReCAPTCHA
                            sitekey='6LfA2-8pAAAAAOFjPZxNQFaCIxJ1FligEG9GYYfG'
                            onChange={(value) => { setCaptchaVal(value) }}
                        />

                        <input class="mt-3 cursor-pointer text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg" type='submit' value='Submit' />
                        <p className='text-base text-blue-700 mt-3'><Link to={'/forgotpassword'}>Forgot Password?</Link></p>
                        <p className='text-base mt-3'>Don't have an account?</p>
                        <p className='text-base text-blue-700 mt-3'><Link to={'/signup'}>Signup</Link></p>

                    </div>
                    {/* </div> */}
                </section>
            </form>
            <ToastContainer/>
        </div>
    )
}
