import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Link, useParams } from 'react-router-dom';

export default function StudentDetails() {
  const { courseId } = useParams();
  const [studentDetails, setStudentDetails] = useState([]);
  const [studentsCount, setStudentsCount] = useState(0);
  const [expandedStudents, setExpandedStudents] = useState({});
  const [animate, setAnimate] = useState(false);


  useEffect(() => {
    fetchStudents();
    setAnimate(true);
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await axios.get("http://localhost:8000/students", { params: { role: "Student" } });
      setStudentDetails(res.data);
      setStudentsCount(res.data.length);
    } catch (e) {
      toast.error("Something went wrong!");
    }
  };

  const fetchUserCourse = async (email) => {
    try {
      const res = await axios.get(`http://localhost:8000/fetchCourse/${email}`);
      return res.data[0]?.allCourses || [];
    } catch (e) {
      toast.error("Something went wrong!");
      return [];
    }
  };

  const toggleExpand = async (email) => {
    if (expandedStudents[email]) {
      setExpandedStudents(prev => ({
        ...prev,
        [email]: {
          ...prev[email],
          expanded: !prev[email].expanded
        }
      }));
    } else {
      const courseData = await fetchUserCourse(email);
      setExpandedStudents(prev => ({
        ...prev,
        [email]: {
          expanded: true,
          courseData: courseData
        }
      }));
    }
  };

  return (
    <div className="container mx-auto p-5">
      <h1 className="text-xl font-bold mb-5">Student and Progress Details</h1>

      <section>
        <h2 className="text-lg font-semibold mb-3">Students ({studentsCount})</h2>
        <ul role="list" className="divide-y divide-gray-100">
          {studentDetails.map((person) => (
            <li key={person.email} className="flex w-full gap-y-2 py-5">
              <div className="flex items-center gap-x-6">
                <div className="lg:flex min-w-0 gap-x-4">
                  <img className="text-sm text-center font-bold h-12 w-12 flex-none rounded-full object-cover bg-gray-50" src={`http://localhost:8000/${person.profilePicPath}`} alt={person.name} />
                  <div className="min-w-0 flex-auto pr-10 border-r">
                    <p className="text-sm font-semibold leading-6 text-gray-900">{person.name}</p>
                    <p className="mt-1 truncate text-xs leading-5 text-gray-500">{person.email}</p>
                  </div>
                  <div>
                    <p className='font-bold mt-1 truncate text-xs leading-5 text-gray-500'>Contact : {person.phone}</p>
                    <p className='font-bold mt-1 truncate text-xs leading-5 text-gray-500'>Gender : {person.gender}</p>
                    <p className='font-bold mt-1 truncate text-xs leading-5 text-gray-500'>Country : {person.country}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <button onClick={() => toggleExpand(person.email)} className="ml-2">
                    {expandedStudents[person.email]?.expanded ? <FaChevronLeft /> : <FaChevronRight />}
                  </button>
                </div>
              </div>
              {expandedStudents[person.email]?.expanded && (
                <div>
                  <div className="mt-2">
                    {/* <h3 className="text-sm p-5 font-semibold">Learning Courses</h3> */}
                    <div className='whitespace-nowrap overflow-x-auto max-w-full'>
                      <ul className='flex gap-x-2 overflow-x-auto'>
                        {expandedStudents[person.email]?.courseData.map((course, index) => (
                          <li key={index} className={`lg:ml-4 rounded-lg ${animate ? 'animate-slideLeft' : ''}`}>
                            <Link>
                              <img className='h-16 w-28 object-cover rounded-lg border shadow-sm' src={course.img} alt={course.name} />
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>
      <ToastContainer />
    </div>
  );
}
