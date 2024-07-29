import React, { useEffect, useState } from 'react';
import Cookies from "js-cookie";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { loadStripe } from '@stripe/stripe-js';

export default function Checkout() {
    const [cartItems, setCartItems] = useState([]);
    const [subTotal, setSubTotal] = useState(0);
    const url = "https://e-learning-website-server.onrender.com";

    useEffect(() => {
        fetchCartItems();
    }, []);

    useEffect(() => {
        let sum = 0;
        cartItems.forEach(e => {
            sum += e.price;
        });
        setSubTotal(sum);
    }, [cartItems]);

    const fetchCartItems = async () => {
        const email = Cookies.get("email");
        try {
            const response = await axios.get(`${url}/getcart`, { params: { email } });
            if (Array.isArray(response.data)) {
                setCartItems(response.data.map((e) => e.courses));
            } else {
                setCartItems([]);
            }
        } catch (error) {
            toast.error("Failed to fetch cart items");
        }
    };

    const removeFromCart = async (courseId) => {
        const email = Cookies.get("email");
        try {
            const res = await axios.post(`${url}/removeFromCart`, { email, courseId });
            if (res.data === "pass") {
                fetchCartItems();
            } else {
                toast.error("Failed to remove course from cart");
            }
        } catch (error) {
            toast.error("Something went wrong!");
        }
    };

    const makePayment = async () => {
        const email = Cookies.get("email");
        const stripe = await loadStripe('pk_test_51PR5eDDTzIgYcnyOeclvgpUWOKBiD8ft1oscnc9Ci7JoRtBqyFGAKahYZ515Bk79uXr6BZ9L1MappOTKeQmdIDmx00loqaRp0y');
        const body = {
            line_items: cartItems.map(course => ({
                price_data: {
                    currency: 'inr',
                    product_data: {
                        name: course.name,
                        images: [course.img[0]],
                    },
                    unit_amount: course.price * 100,
                },
                quantity: 1,
            })),
            mode: 'payment',
            email: email, // Include user email
            course: cartItems.map(e => e._id) // Include course IDs
        };
    
        const headers = {
            "Content-Type": "application/json"
        };
    
        try {
            const res = await fetch(`${url}/payment`, {
                method: "POST",
                headers: headers,
                body: JSON.stringify(body),
            });
            const session = await res.json();
            const result = await stripe.redirectToCheckout({
                sessionId: session.id
            });
            if (result.error) {
                console.error(result.error);
            }
        } catch (error) {
            console.error('Payment initiation failed', error);
        }
    };
    


    return (
        <div className="container px-4 py-6">
            {cartItems.length > 0 ? (
                <div>
                    <table className="w-full bg-white">
                        <thead className="bg-gray-800 text-white">
                            <tr>
                                <th className="px-3 py-3 uppercase font-semibold text-xs lg:text-sm">#</th>
                                <th className="px-3 py-3 uppercase font-semibold text-xs lg:text-sm">Course Name</th>
                                <th className="px-3 py-3 uppercase font-semibold text-xs lg:text-sm">Type</th>
                                <th className="px-3 py-3 uppercase font-semibold text-xs lg:text-sm">Price</th>
                                <th className="px-3 py-3 uppercase font-semibold text-xs lg:text-sm">Remove</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-700">
                            {cartItems.map((course, index) => (
                                <tr key={index} className="border-b text-center">
                                    <td className="py-4 px-3">{index + 1}</td>
                                    <td className="py-4 px-3">
                                        <p className="text-xs lg:text-lg font-semibold leading-6 text-gray-900">{course.name}</p>
                                    </td>
                                    <td className="py-4 px-3">
                                        <p className="text-xs lg:text-sm leading-5 text-gray-500">{course.type}</p>
                                    </td>
                                    <td className="py-4 px-3">
                                        <p className="text-xs lg:text-sm leading-6 text-gray-900">₹ {course.price}.00</p>
                                    </td>
                                    <td className="py-4 px-3">
                                        <button onClick={() => removeFromCart(course._id)} className="text-red-500">
                                            <FontAwesomeIcon icon={faTrash} className="mr-1" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="flex justify-center items-center text-3xl font-bold max-h-screen">
                    <h1>Your cart is empty</h1>
                </div>
            )}
            <div className="flex justify-end mt-5">
                <div className="w-full md:w-1/2 lg:w-1/4 px-4 py-6">
                    <div className="flex justify-between text-base font-medium text-gray-900">
                        <p>Subtotal</p>
                        <p>₹ {subTotal}.00</p>
                    </div>
                    <div className="mt-6">
                        <button onClick={makePayment} className="flex items-center justify-center w-full rounded-md bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700">
                            Payment
                        </button>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}
