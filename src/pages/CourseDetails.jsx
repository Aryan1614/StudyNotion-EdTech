import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchFullCourseDetails } from '../services/operations/courseDetailsAPI';
import GetAvgRating from '../utils/getAvgRating';
import { useDispatch, useSelector } from 'react-redux';
import Error from './Error';
import ConfirmationModal from '../components/common/ConfirmationModal';
import RatingStars from '../components/common/RatingStars';
import { BiInfoCircle } from 'react-icons/bi';
import { MdLanguage } from 'react-icons/md';
import { formattedDate } from '../utils/dateFormatter';
import CourseDetailsCard from '../components/core/Course/CourseDetailsCard';
import { ACCOUNT_TYPE } from '../utils/constants';
import { addToCart } from '../slices/cartSlice';
import { MdOutlineVerified } from "react-icons/md";
import toast from 'react-hot-toast';
import Footer from '../components/common/Footer';
import CourseAccordionBar from '../components/core/Course/CourseAccordionBar';
import { buyCourse } from '../services/operations/studentsFeatursAPI';
 
function CourseDetails() {

    const {cart} = useSelector((state) => state.cart);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {courseId} = useParams();
    const[course,setCourse] = useState(null);
    const[avgReviewCount,setAvgReviewCount] = useState(0);
    const[totalNoOfLectures,setTotalNoOfLectures] = useState(0);
    const[confirmationModal,setConfirmationModal] = useState(null);
    const[totalDuration,setTotalDuration] = useState(0);
    const[isActive,setIsActive] = useState(Array(0));

    const HandleActive = (id) => {
      setIsActive(
        !isActive.includes(id) ? 
        isActive.concat(id) :
        isActive.filter((e) => e !== id)
      )
    }

    const {user} = useSelector((state) => state.profile);
    const {loading} = useSelector((state) => state.profile);
    const {token} = useSelector((state) => state.auth);

    useEffect(() => {
        const fetchCourseDetails = async() => {
          const response = await fetchFullCourseDetails(courseId);
          if(response){
            setCourse(response);
            console.log(course);
          }
        }
        if(courseId){
          fetchCourseDetails();
        }
    },[courseId]);

    useEffect(() => {
      if(course) {
        const count = GetAvgRating(course.ratingAndReviews);
        setAvgReviewCount(count);
      }
    },[course]);

    useEffect(() => {
      if(course){
        let count = 0;
        let duration = 0;
        course.courseContent.forEach((sec) => {
          count += sec.subSection.length || 0
        });
        setTotalNoOfLectures(count);
        setTotalDuration(duration);
      }
    },[course]);

    const HandleBuyCourse = async() => {
      if(token){
        if(user && user.accountType === ACCOUNT_TYPE.INSTRUCTOR){
          toast.error("Instructor Can't Buy An Course");
          return;
        }
        if(user && user.accountType === ACCOUNT_TYPE.STUDENT){
          await buyCourse(token,[courseId],navigate,dispatch,user)
          return;
        } 
      } 
      else{
        setConfirmationModal({
          text1: "You are not logged in!",
          text2: "Please login to Purchase Course.",
          btn1Text: "Login",
          btn2Text: "Cancel",
          btn1Handler: () => navigate("/login"),
          btn2Handler: () => setConfirmationModal(null),
        });
      }
    }

    const HandleAddToCart = async() => {
      if(token) {
        if(user && user.accountType === ACCOUNT_TYPE.INSTRUCTOR){
          toast.error("Instructor Can't Buy An Course");
          return;
        }
        if(user && user.accountType === ACCOUNT_TYPE.STUDENT){
          dispatch(addToCart(course));
          return;
        }
      } 
      else{
        setConfirmationModal({
          text1: "You are not logged in!",
          text2: "Please login to add To Cart",
          btn1Text: "Login",
          btn2Text: "Cancel",
          btn1Handler: () => navigate("/login"),
          btn2Handler: () => setConfirmationModal(null),
        });
      }
    }

    if(loading){
      return (
        <div className='w-screen h-screen flex items-center justify-center'>
          <div className='spinner'></div>
        </div>
      )
    }

    if(course === null){
      return (
        <div>
          <Error />
        </div>
      )
    }

    // destructure allvalues 

    const {
      courseName,
      courseDescription,
      whatYouWillLearn,
      courseContent,
      ratingAndReviews,
      instructor,
      studentsEnrolled,
      createdAt,
    } = course;

  return (
    <div className='text-white flex flex-col'>
      <div className='bg-richblack-800 h-[450px] flex items-center'>
        <div className='relative flex flex-row justify-between w-11/12 max-w-maxContent mx-auto'>
          <div className='flex flex-col gap-y-5 w-[810px] max-w-maxContent'>
            <p className='text-5xl font-semibold'>{courseName}</p>
            <p className='text-richblack-200'>{courseDescription}</p>
            
            <div className='flex items-center gap-x-3 text-xl'>
              <p>{avgReviewCount}</p>
              <RatingStars Review_Count={avgReviewCount} Star_Size={24} />
              <p>({ratingAndReviews.length} Reviews)</p>
              <p>{studentsEnrolled.length} students enrolled</p>
            </div>

            <div className='flex items-center gap-x-2'>Created By:<span className='underline'>{instructor.firstName} {instructor.lastName}</span></div>

            <div className='flex items-center gap-x-3'>
              <div className='flex items-center gap-x-1 text-xl'><BiInfoCircle /> Created At:  { formattedDate(createdAt)}</div>
              <div className='flex items-center gap-x-1 text-xl'><MdLanguage /> English</div>
            </div>
          </div>

          <div>
            <CourseDetailsCard 
              course={course}
              HandleAddToCart={HandleAddToCart}
              HandleBuyCourse={HandleBuyCourse}
            />
          </div>
        </div>
      </div>

      <div className='w-11/12 max-w-maxContent mx-auto'>
        <div className='flex flex-col gap-y-3 w-[810px] max-w-maxContent'>
          <div className='border border-richblack-500 mt-8 px-8 py-6'>
            <p className='text-3xl font-semibold'>What You Will Learn</p>
            <p className='mt-4'>{whatYouWillLearn}</p>
          </div>

          <div className='mt-8 flex flex-col gap-y-3'>
            <div>
              <p className='text-3xl font-semibold'>Course Content: </p>
            </div>

            <div className='flex justify-between gap-x-3'>
              <div className='flex items-center gap-x-2'>
                <span>{courseContent.length} Section(s)</span>
                <span>{totalNoOfLectures} Lecture(s)</span>
                <span>{totalDuration} Total Length.</span>
              </div>

              <div>
                  <button onClick={() => setIsActive([])} className='text-yellow-25'>
                    Collapse All Sections
                  </button>
              </div>
            </div>

            <div className="py-4">
              {courseContent?.map((course, index) => (
                <CourseAccordionBar
                  course={course}
                  key={index}
                  isActive={isActive}
                  handleActive={HandleActive}
                />
              ))}
            </div>
          </div>

          <div className='flex flex-col gap-y-3 mb-10'>
            <p className='text-xl font-semibold'>Author:</p>
            <div className='flex flex-row gap-x-4'>
              <div>
                <img src={instructor.image} alt={instructor.firstName} className='w-[60px] h-[60px] rounded-full object-cover'/>
              </div>
              <div>
                <p className='text-lg font-semibold flex flex-row items-center gap-x-2'>{instructor.firstName} {instructor.lastName} <MdOutlineVerified className="text-blue-300" /></p>
                <p className='text-md text-richblack-50'>
                  {
                    instructor.additionalDetails.about === null ? "I am Instructor For This Course" : instructor.additionalDetails.about
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </div>
  )
}

export default CourseDetails
