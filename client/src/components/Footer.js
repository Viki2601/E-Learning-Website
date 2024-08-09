import React from 'react'

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-400 body-font">
            <div className="container mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between">
                <div className="flex items-center justify-center md:justify-start">
                    <a className="flex title-font font-medium items-center text-white">
                        <span className="ml-3 text-xl">E-Course</span>
                    </a>
                </div>
                <div className="flex flex-col md:flex-row items-center justify-center md:justify-end md:mt-0 mt-4 space-y-2 md:space-y-0 md:space-x-6">
                    <p className="text-sm text-gray-400">© 2024 E-Course</p>
                    <nav className="list-none flex flex-wrap items-center justify-center gap-4">
                        <li>
                            <a className="text-gray-400 hover:text-gray-300 cursor-pointer">About Us</a>
                        </li>
                        <li>
                            <a className="text-gray-400 hover:text-gray-300 cursor-pointer">Contact Us</a>
                        </li>
                        <li>
                            <a className="text-gray-400 hover:text-gray-300 cursor-pointer">Privacy policy</a>
                        </li>
                        <li>
                            <a className="text-gray-400 hover:text-gray-300 cursor-pointer">Cookie settings</a>
                        </li>
                    </nav>
                </div>
            </div>
        </footer>
    )
}
