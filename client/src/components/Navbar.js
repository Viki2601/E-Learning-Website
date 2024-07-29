import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faCartShopping, faUser, faPowerOff } from '@fortawesome/free-solid-svg-icons';
import Cookies from "js-cookie";
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import axios from 'axios';

export default function Navbar() {
    const [open, setOpen] = useState(false)
    const url = "https://e-learning-website-server.onrender.com";
    const [cartItems, setCartItems] = useState([]);
    const [subTotal, setSubTotal] = useState(0)
    const navigate = useNavigate();

    const goToCart = async () => {
        const cookie = Cookies.get("email");

        if (!cookie) {
            toast.warn("You need to login first");
            navigate("/login");
        } else {
            try {
                const response = await axios.get(`${url}/getcart`, { params: { email: cookie } });
                if (Array.isArray(response.data)) {
                    setCartItems(response.data.map((e)=>(e.courses)));
                } else {
                    setCartItems([]);
                }
                setOpen(true);
            } catch (error) {
                toast.error("Failed to fetch cart items");
            }
        }
    };


    const removeFromCart = async (courseId) => {
        const email = Cookies.get("email");
        try {
            const res = await axios.post(`${url}/removeFromCart`, { email: email, courseId: courseId });
            if (res.data === "pass") {
                goToCart();
            } else {
                toast.error("Failed to remove course from cart");
            }
        } catch (e) {
            toast.error("Something went wrong!");
        }
    };

    // Logout Call
    const logout = () => {
        Cookies.remove('email');
    };


    useEffect(() => {
        let sum = 0
        cartItems.map((e) => {
            sum = sum + e.price
        })
        setSubTotal(sum)
    }, [cartItems])

    return (
        <div>
            <header className="text-gray-400 bg-gray-900 body-font">
                <div className="container mx-auto flex flex-wrap flex-col md:flex-row items-center">
                    <Link to={"/"} className="flex title-font font-medium items-center text-white mb-4 md:mb-0">
                        <img className="h-8 md:h-20" src={require('./images/download.png')} alt="" />
                        <span className="ml-3 text-xl">E-Course</span>
                    </Link>
                    <nav className="md:ml-auto flex flex-wrap items-center text-base justify-evenly">
                        <Link className='block w-fit px-2 py-1 text-white font-semibold rounded' to={"/"}>
                            <FontAwesomeIcon icon={faHome} className='lg:text-1xl' />
                        </Link>
                        <a className='cursor-pointer block w-fit px-2 py-1 text-white font-semibold rounded' onClick={goToCart}>
                            <FontAwesomeIcon icon={faCartShopping} className='lg:text-1xl' />
                        </a>
                        <Link className='block w-fit px-2 py-1 text-white font-semibold rounded' to={"/login"}>
                            <FontAwesomeIcon icon={faUser} className='lg:text-1xl' />
                        </Link>
                        <button className='block w-fit px-2 py-1 text-white font-semibold rounded' onClick={logout}>
                            <FontAwesomeIcon icon={faPowerOff} className='lg:text-1xl' />
                        </button>
                    </nav>
                </div>
            </header>

            <Transition show={open}>
                <Dialog className="relative z-10" onClose={setOpen}>
                    <TransitionChild
                        enter="ease-in-out duration-500"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in-out duration-500"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                    </TransitionChild>

                    <div className="fixed inset-0 overflow-hidden">
                        <div className="absolute inset-0 overflow-hidden">
                            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                                <TransitionChild
                                    enter="transform transition ease-in-out duration-500 sm:duration-700"
                                    enterFrom="translate-x-full"
                                    enterTo="translate-x-0"
                                    leave="transform transition ease-in-out duration-500 sm:duration-700"
                                    leaveFrom="translate-x-0"
                                    leaveTo="translate-x-full"
                                >
                                    <DialogPanel className="pointer-events-auto w-screen max-w-sm">
                                        <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                                            <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                                                <div className="flex items-start justify-between">
                                                    <DialogTitle className="text-lg font-medium text-gray-900">Course cart</DialogTitle>
                                                    <div className="ml-3 flex h-7 items-center">
                                                        <button type="button" className="relative -m-2 p-2 text-gray-400 hover:text-gray-500" onClick={() => setOpen(false)} >
                                                            <span className="absolute -inset-0.5" />
                                                            <span className="sr-only">Close panel</span>
                                                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="mt-8">
                                                    <div className="flow-root">
                                                        <ul role="list" className="-my-6 divide-y divide-gray-200">
                                                            {cartItems.map(course => (
                                                                <li key={course.id} className="flex py-6">
                                                                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                                                        <img src={course.img} className="h-full w-full object-cover object-center" />
                                                                    </div>
                                                                    <div className="ml-4 flex flex-1 flex-col">
                                                                        <div>
                                                                            <div className="flex justify-between text-base font-medium text-gray-900">
                                                                                <h3><a>{course.name}</a></h3>
                                                                                <p className="ml-4">₹{' '}{course.price}.00</p>
                                                                            </div>
                                                                            <p className="mt-1 text-sm text-gray-500">{course.type}</p>
                                                                        </div>
                                                                        <div className="flex flex-1 items-end justify-between text-sm">
                                                                            <div className="flex">
                                                                                <button onClick={() => removeFromCart(course._id)} type="button" className="font-medium text-indigo-600 hover:text-indigo-500" >
                                                                                    Remove
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                                                <div className="flex justify-between text-base font-medium text-gray-900">
                                                    <p>Subtotal</p>
                                                    <p>₹{' '}{subTotal}.00</p>
                                                </div>
                                                <p className="mt-0.5 text-sm text-gray-500">GST and taxes calculated at checkout.</p>
                                                <div className="mt-6">
                                                    <a href="/checkout"
                                                        className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
                                                    >
                                                        Checkout
                                                    </a>
                                                </div>
                                                <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                                                    <p>
                                                        or{' '}
                                                        <button type="button" className="font-medium text-indigo-600 hover:text-indigo-500" onClick={() => setOpen(false)} >
                                                            Continue
                                                        </button>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </DialogPanel>
                                </TransitionChild>
                            </div>
                        </div>
                    </div>
                </Dialog>
            </Transition>
            <ToastContainer />
        </div>
    );
}
