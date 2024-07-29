import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from "js-cookie";
import { useEffect, useState } from "react";


import Home from './components/Home.js';
import Navbar from './components/Navbar.js';
import Footer from './components/Footer.js';
import Login from './components/Login.js';
import Signup from './components/Signup.js';
import MyAccount from './components/MyAccount.js';
import ForgotPassword from './components/ForgotPassword.js';
import ResetPassword from './components/ResetPassword.js';
import AdminPage from './components/AdminPage.js';
import AddCourse from './components/AddCourse.js';
import CourseViewPage from './components/CourseViewPage.js';
import UpdateCourseViewPage from './components/UpdateCourseViewPage.js';
import SingleViewPage from './components/SingleViewPage.js';
import StudentDetails from './components/StudentDetails.js';
import Checkout from './components/Checkout.js';
import Purchased from './components/Purchased.js';


function App() {

  const [cookieVal, setCookieVal] = useState(Cookies.get("email"));
  useEffect(() => {
    const interval = setInterval(() => {
      const updatedCookie = Cookies.get("email");
      if (updatedCookie !== cookieVal) {
        setCookieVal(updatedCookie);
      }
    }, 1000)
    return () => { clearInterval(interval) }
  }, [cookieVal])

  return (
    <div className="App ">
      <ToastContainer />
      <Router>
        <Navbar />
        <Routes>
          {cookieVal === undefined && <Route path='/login' element={<Login />} />}
          {cookieVal === "access.ecourse78@gmail.com" && <Route path='/login' element={<AdminPage />} />}
          {cookieVal !== undefined && cookieVal !== "access.ecourse78@gmail.com" && <Route path='/login' element={<MyAccount />} />}
          <Route path='/' element={<Home />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/studentDetails/:courseId' element={<StudentDetails />} />
          <Route path='/singleViewPage/:courseId' element={<SingleViewPage />} />
          <Route path='/addcourse' element={<AddCourse />} />
          <Route path='/getCourses' element={<CourseViewPage />} />
          <Route path='/updateCourseViewPage' element={<UpdateCourseViewPage />} />
          <Route path='/checkout' element={<Checkout />} />
          <Route path='/purchased' element={<Purchased />} />
          <Route path='/forgotpassword' element={<ForgotPassword />} />
          <Route path='/resetpassword' element={<ResetPassword />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
