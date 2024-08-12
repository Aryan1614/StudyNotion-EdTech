import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import ReactStars from 'react-stars';
import { IoStar,IoStarOutline } from 'react-icons/io5';
import { RiDeleteBinLine } from 'react-icons/ri';
import { removeFromCart } from '../../../../slices/cartSlice';

function RenderCartCourses() {
    const dispatch = useDispatch();
    const {cart} = useSelector((state)=>state.cart);

  return (
    <div className='w-[calc(1080px-232px)]'>
        {
            cart.map((course,index) => (
                <div key={index} className={`flex flex-row justify-between pb-6 mb-6 ${index !== cart.length-1 && "border-b border-richblack-400"}`}>
                    <div className='text-white flex justify-between gap-x-4'>
                        <div>
                            <img src={course.thumbNail} alt='course' className='w-[210px] rounded-xl' />
                        </div>
                        <div className='flex flex-col'>
                            <p className='text-md'>{course.courseName}</p>
                            <p className='text-sm text-richblack-100 mt-2'>{course.category.name}</p>
                            <div className='flex items-center gap-x-2 mt-3'>
                                <span className='text-yellow-25'>4.8</span>
                                <ReactStars 
                                    count={5}
                                    size={20}
                                    edit={false}
                                    activeColor="#FFE83D"
                                    emptyIcon={<IoStarOutline />}
                                    fullIcon={<IoStar />}
                                />
                                <span className='text-richblack-100 text-md'>{course?.ratingAndReviews.length} Ratings</span>
                            </div>
                            <p className='text-richblack-100 text-sm mt-2'>Total Courses • Lesson • Beginner</p>
                        </div>
                    </div>

                    <div className='flex flex-col gap-y-3'>
                        <button onClick={() => dispatch(removeFromCart(course._id))} className='flex flex-row items-center bg-richblack-800 rounded-md text-pink-400 px-3 py-2 gap-x-2'>
                            <RiDeleteBinLine />
                            <span>Remove</span>
                        </button>
                        <p className='text-yellow-25 text-lg'>Rs {course?.price}</p>
                    </div>
                </div>
            ))
        }
    </div>
  )
}

export default RenderCartCourses;