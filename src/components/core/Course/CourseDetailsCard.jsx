import copy from 'copy-to-clipboard';
import React from 'react'
import toast from 'react-hot-toast';
import { FaShareFromSquare } from 'react-icons/fa6';
import { RxTriangleRight } from 'react-icons/rx';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function CourseDetailsCard({course, HandleBuyCourse, HandleAddToCart}) {

    const {user} = useSelector((state) => state.profile);

    const navigate = useNavigate();

    const HandleShare = async() => {
      copy(window.location.href);
      toast.success("Link copied to clipboard");
    }

  return (
    <div className='flex flex-col absolute w-[410px] -top-5 right-2 bg-richblack-700 rounded-xl p-4'>
      <img src={course.thumbNail} alt={course.courseName} className='max-h-[300px] min-h-[180px] w-[400px] rounded-xl' />
      <div className='flex flex-col gap-y-3 pl-4 pr-4'>
        <div className='text-2xl font-semibold mt-4'>Rs. {course.price}</div>
        <div className='flex flex-col gap-y-4'>
          <button className='bg-yellow-50 rounded-md text-richblack-900 font-semibold py-2' onClick={ user && course.studentsEnrolled.includes(user._id) ? (() => navigate("/dashboard/enrolled-courses")) : (HandleBuyCourse)}>
              {
                  user && course.studentsEnrolled.includes(user._id) ? "Go To Course" : "Buy Now"
              }
          </button>
          {
            (!user || !course.studentsEnrolled.includes(user._id)) && (
              <button className='bg-richblack-800 rounded-md text-white font-semibold py-2' onClick={HandleAddToCart}>
                  Add To Cart
              </button>
            )
          }
        </div>
        <p className='text-center text-sm font-medium mt-3 mb-2 text-richblack-100'>30-Day-Money-Back Guarentee</p>
        <div>
          <p>This Course Includes: </p>
          <div className='flex flex-col gap-y-3'>
              {
                  course.instructions.map((item,index) => (
                      <p key={index} className='text-caribbeangreen-200 flex flex-row items-center gap-x-1'>
                          <RxTriangleRight className='text-2xl' />
                          <span>{item}</span>
                      </p>
                  ))
              }
          </div>
        </div>
      </div>
      <button className='flex items-center gap-x-2 mx-auto p-6 text-yellow-50' onClick={HandleShare}><FaShareFromSquare />Share</button>
    </div>
  )
}

export default CourseDetailsCard;
