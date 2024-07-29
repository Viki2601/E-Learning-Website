import React, { useEffect, useState } from 'react'
import CourseViewPage from './CourseViewPage'
import { ToastContainer } from 'react-toastify'

export default function Home() {
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        setAnimate(true);
    }, []);

    return (
        <div>
            <div className="relative overflow-hidden bg-gray-900">
                <div className="pb-80 pt-16 sm:pb-40 sm:pt-24 lg:pb-48 lg:pt-40">
                    <div className="relative mx-auto max-w-7xl px-4 sm:static sm:px-6 lg:px-8">
                        <div className={`sm:max-w-lg ${animate ? 'animate-slideLeft' : ''}`}>
                            <h1 className="text-4xl font-bold tracking-tight text-gray-200 sm:text-6xl">
                                <span className='text-red-800'>#1</span> Platform for On<span className='text-red-800'>line</span> Training & Intern<span className='text-red-800'>ship</span>
                            </h1>
                            <p className="mt-4 text-xl font-semibold font-sans text-gray-500">
                                E-Course Learning: Your Gate<span className='text-red-800'>way to</span> Industry Excellence. Explore new skills beyond the world <span className='text-red-800'>of know</span>ledge and get lost in freedom of creativity.
                            </p>
                        </div>
                        <div>
                            <div className="mt-10">
                                <div aria-hidden="true" className="pointer-events-none lg:absolute lg:inset-y-0 lg:mx-auto lg:w-full lg:max-w-7xl">
                                    <div className="absolute transform sm:left-1/2 sm:top-0 sm:translate-x-8 lg:left-1/2 lg:top-1/2 lg:-translate-y-1/2 lg:translate-x-8">
                                        <div className="flex items-center space-x-6 lg:space-x-8">
                                            <div className={`grid flex-shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8 ${animate ? 'animate-slideUp' : ''}`}>
                                                <div className="h-64 w-44 overflow-hidden rounded-lg sm:opacity-0 lg:opacity-100">
                                                    <img src="https://cdn.ila-france.com/wp-content/uploads/2015/02/our-students.jpg" className="h-full w-full object-cover object-center" />
                                                </div>
                                                <div className="h-64 w-44 overflow-hidden rounded-lg">
                                                    <img src="https://www.tech-wonders.com/wp-content/uploads/2018/06/educational-technology-impact-learning.jpg" className="h-full w-full object-cover object-center" />
                                                </div>
                                            </div>
                                            <div className={`grid flex-shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8 ${animate ? 'animate-slideUp' : ''}`}>
                                                <div className="h-64 w-44 overflow-hidden rounded-lg">
                                                    <img src="https://www.evelynlearning.com/wp-content/uploads/2020/08/Picture1.png" className="h-full w-full object-cover object-center" />
                                                </div>
                                                <div className="h-64 w-44 overflow-hidden rounded-lg">
                                                    <img src="https://leverageedublog.s3.ap-south-1.amazonaws.com/blog/wp-content/uploads/2020/03/24185535/Online-Learning.jpg" className="h-full w-full object-cover object-center" />
                                                </div>
                                                <div className="h-64 w-44 overflow-hidden rounded-lg">
                                                    <img src="https://cec89d.learnworlds.com/users/a218fd3214b4/images/e33fa73303a41675155776-ebook.png?width=750" className="h-full w-full object-cover object-center" />
                                                </div>
                                            </div>
                                            <div className={`grid flex-shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8 ${animate ? 'animate-slideUp' : ''}`}>
                                                <div className="h-64 w-44 overflow-hidden rounded-lg">
                                                    <img src="https://cdn.leverageedu.com/blog/wp-content/uploads/2020/05/20191333/Online-Learning-Platforms.png" className="h-full w-full object-cover object-center" />
                                                </div>
                                                <div className="h-64 w-44 overflow-hidden rounded-lg">
                                                    <img src="https://distance-educator.com/wp-content/uploads/virtual_school_Learner.jpg" className="h-full w-full object-cover object-center" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <CourseViewPage />
            <div className="bg-white py-20">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <h2 className="text-center text-lg font-semibold leading-8 text-gray-900">
                        Languages offered
                    </h2>
                    <div className="mx-auto mt-10 grid max-w-lg grid-cols-4 items-center gap-x-8 gap-y-10 sm:max-w-xl sm:grid-cols-6 sm:gap-x-10 lg:mx-0 lg:max-w-none lg:grid-cols-8">
                        <div className='flex flex-wrap'>
                            <img
                                className="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
                                src="https://cdn-icons-png.flaticon.com/512/11328/11328223.png"
                                alt="Transistor"
                                width={158}
                                height={48}
                            />
                            <p className='w-full text-center font-semibold'>HTML-5</p>
                        </div>
                        <div>
                            <img
                                className="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
                                src="https://cdn-icons-png.flaticon.com/512/6342/6342803.png"
                                alt="Reform"
                                width={158}
                                height={48}
                            />
                            <p className='w-full text-center font-semibold'>CSS-3</p>
                        </div>
                        <div>
                            <img
                                className="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
                                src="https://cdn-icons-png.flaticon.com/512/12658/12658485.png"
                                alt="Tuple"
                                width={158}
                                height={48}
                            />
                            <p className='w-full text-center font-semibold'>JavaScript</p>
                        </div>
                        <div>
                            <img
                                className="col-span-2 max-h-12 w-full object-contain sm:col-start-2 lg:col-span-1"
                                src="https://cdn-icons-png.flaticon.com/512/1183/1183723.png"
                                alt="SavvyCal"
                                width={158}
                                height={48}
                            />
                            <p className='w-full text-center font-semibold'>React.js</p>
                        </div>
                        <div>
                            <img
                                className="col-span-2 col-start-2 max-h-12 w-full object-contain sm:col-start-auto lg:col-span-1"
                                src="https://cdn-icons-png.flaticon.com/512/12004/12004037.png"
                                alt="Statamic"
                                width={158}
                                height={48}
                            />
                            <p className='w-full text-center font-semibold'>UI/UX</p>
                        </div>
                        <div>
                            <img
                                className="col-span-2 col-start-2 max-h-12 w-full object-contain sm:col-start-auto lg:col-span-1"
                                src="https://cdn-icons-png.flaticon.com/512/1449/1449158.png"
                                alt="Statamic"
                                width={158}
                                height={48}
                            />
                            <p className='w-full text-center font-semibold'>Data Science</p>
                        </div>
                        <div>
                            <img
                                className="col-span-2 col-start-2 max-h-12 w-full object-contain sm:col-start-auto lg:col-span-1"
                                src="https://cdn-icons-png.flaticon.com/512/7075/7075373.png"
                                alt="Statamic"
                                width={158}
                                height={48}
                            />
                            <p className='w-full text-center font-semibold'>Moblie App Development</p>
                        </div>
                        <div>
                            <img
                                className="col-span-2 col-start-2 max-h-12 w-full object-contain sm:col-start-auto lg:col-span-1"
                                src="https://cdn-icons-png.flaticon.com/512/2906/2906206.png"
                                alt="Statamic"
                                width={158}
                                height={48}
                            />
                            <p className='w-full text-center font-semibold'>Mongo-DB</p>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    )
}
