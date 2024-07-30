import React from 'react'

export default function Footer() {
    return (
        <div>
            <footer className="body-font">
                <div className="flex items-center justify-between bg-gray-900">
                    <div className="container px-8 py-8 flex items-center sm:flex-row flex-col">
                        <a className="flex title-font font-medium items-center md:justify-start justify-center text-white">
                            <span className="ml-3 text-xl">E-Course</span>
                        </a>
                        <p className="text-sm text-gray-400 sm:ml-6 sm:mt-0 mt-4">© 2024 E-course</p>
                    </div>
                    <div className="text-sm w-full">
                        <nav className="list-none flex items-center justify-end gap-5 py-8">
                            <li>
                                <a className="text-gray-400 hover:text-gray-300 cursor-pointer">About Us</a>
                            </li>
                            <li>
                                <a className="text-gray-400 hover:text-gray-300 cursor-pointer">Contact Us</a>
                            </li>
                            <li>
                                <a className="text-gray-400 hover:text-gray-300">Privacy policy</a>
                            </li>
                            <li>
                                <a className="text-gray-400 hover:text-gray-300">Cookie settings</a>
                            </li>
                        </nav>
                    </div>
                </div>
            </footer>
        </div>
    )
}
