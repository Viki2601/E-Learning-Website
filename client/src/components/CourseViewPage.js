import React, { useEffect, useState } from 'react';
import CoursePage from './CoursePage';
import { ToastContainer, toast } from 'react-toastify';
import LoadingBar from "react-top-loading-bar";
import axios from "axios";

export default function CourseViewPage() {
    const [progress, setProgress] = useState(0);
    const [data, setData] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [selectedOption, setSelectedOption] = useState('All Courses');
    const [animate, setAnimate] = useState(false);
    const url = "http://localhost:8000"

    useEffect(() => {
        setAnimate(true);
        typeChangeSubmit();
    }, [selectedOption]);

    const typeChangeSubmit = async () => {
        setProgress(20);
        try {
            const res = await axios.post(`${url}/getCourses`, { selectedOption });
            if (res.data === "fail") {
                toast.error("Something went Wrong!");
            } else {
                setProgress(50);
                const all = res.data;
                setData(all.allCourses);
                setProgress(100);
            }
        } catch (e) {
            console.log(e);
            toast.error("Something went Wrong!");
        }
    };

    useEffect(() => {
        const filtered = selectedOption === 'All Courses'
            ? data : data.filter(course => course.type === selectedOption);
        setFilteredCourses(filtered);
    }, [selectedOption, data]);

    const handleTypeChange = (option) => {
        setSelectedOption(option);
    };

    return (
        <div>
            <LoadingBar
                color="red"
                progress={progress}
                onLoaderFinished={() => setProgress(0)}
            />
            <h2 className="font-bold text-base my-2 ml-3 lg:text-2xl lg:my-4 text-center">Our Training Courses</h2>
            <ul className="bg-gray-100 shadow-md rounded flex sm:w-1/2 w-full sm:flex-row flex-col mx-auto px-8 py-1 sm:space-x-10 sm:px-0 justify-center items-center text-gray-400">
                <li className="relative flex-grow sm:flex-grow-0 w-full sm:w-auto">
                    <button className="w-full sm:w-auto font-semibold text-center py-2 hover:text-gray-900" onClick={() => handleTypeChange('All Courses')}>All Courses</button>
                </li>
                <li className="relative flex-grow sm:flex-grow-0 w-full sm:w-auto">
                    <button className="w-full sm:w-auto font-semibold text-center py-2 hover:text-gray-900" onClick={() => handleTypeChange('Web Developement')}>Web Development</button>
                </li>
                <li className="relative flex-grow sm:flex-grow-0 w-full sm:w-auto">
                    <button className="w-full sm:w-auto font-semibold text-center py-2 hover:text-gray-900" onClick={() => handleTypeChange('DSA')}>Data Science</button>
                </li>
                <li className="relative flex-grow sm:flex-grow-0 w-full sm:w-auto">
                    <button className="w-full sm:w-auto font-semibold text-center py-2 hover:text-gray-900" onClick={() => handleTypeChange('Mobile App Development')}>Mobile App Development</button>
                </li>
                <li className="relative flex-grow sm:flex-grow-0 w-full sm:w-auto">
                    <button className="w-full sm:w-auto font-semibold text-center py-2 hover:text-gray-900" onClick={() => handleTypeChange('UI/UX Design')}>UI/UX Design</button>
                </li>
            </ul>

            <section className='text-gray-300 body-font'>
                <div className='container px-5 py-12 mx-auto'>
                    <div className='flex flex-wrap m-4'>
                        {filteredCourses.map(i => (
                            <div className={`lg:w-1/4 md:1/2 p-2 scale-95 my-4 w-full rounded-lg shadow-md ${animate ? 'animate-slideUp' : ''}`} key={i._id}>
                                <CoursePage
                                    _id={i._id}
                                    name={i.name}
                                    type={i.type}
                                    level={i.level}
                                    description={i.description}
                                    language={i.language}
                                    creator={i.creator}
                                    duration={i.duration}
                                    teacher={i.teacher}
                                    price={i.price}
                                    img={i.img}
                                    allRatings={i.allRatings}
                                    reviews={i.reviews}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            <ToastContainer />
        </div>
    );
}
