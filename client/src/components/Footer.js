import React from 'react'

export default function Footer() {
    return (
        <div>
            <footer className="body-font">
                <div className="container bg-gray-900 px-5 py-5 mx-auto">
                    <div className="flex flex-wrap md:text-left text-center order-first">
                        <div className="lg:w-1/4 md:w-1/2 w-full px-4">
                            <nav className="list-none mb-6">
                                <li>
                                    <a className="text-gray-600 hover:text-gray-300">Blog</a>
                                </li>
                                <li>
                                    <a className="text-gray-600 hover:text-gray-300">Help and Support</a>
                                </li>
                                <li>
                                    <a className="text-gray-600 hover:text-gray-300">About Us</a>
                                </li>
                                <li>
                                    <a className="text-gray-600 hover:text-gray-300">Contact Us</a>
                                </li>
                            </nav>
                        </div>
                        <div className="lg:w-1/4 md:w-1/2 w-full px-4">
                            <nav className="list-none mb-10">

                                <li>
                                    <a className="text-gray-600 hover:text-gray-300">Terms</a>
                                </li>
                                <li>
                                    <a className="text-gray-600 hover:text-gray-300">Privacy policy</a>
                                </li>
                                <li>
                                    <a className="text-gray-600 hover:text-gray-300">Cookie settings</a>
                                </li>
                            </nav>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-900">  
                    <div className="container px-8 py-9 flex items-center sm:flex-row flex-col">
                        <a className="flex title-font font-medium items-center md:justify-start justify-center text-white">
                        {/* <img classNameName="h-8 md:h-20  md:mt-1 md:mb-1" src={require('./images/download.png')} alt="" /> */}
                            <span className="ml-3 text-xl">E-Course</span>
                        </a>
                        <p className="text-sm text-gray-400 sm:ml-6 sm:mt-0 mt-4">© 2024 E-course</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}
