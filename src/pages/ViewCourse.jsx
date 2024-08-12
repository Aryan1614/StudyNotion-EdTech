import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useParams } from 'react-router-dom';
import {fetchFullCourseDetails} from '../services/operations/courseDetailsAPI';
import { setCompletedLectures, setCourseSectionData, setEntireCourseData, setTotalNoOfLectures } from '../slices/viewCourseSlice';
import VideoDetailsSlider from '../components/core/ViewCourse/VideoDetailsSlider';
import CourseReviewModal from '../components/core/ViewCourse/CourseReviewModal';

function ViewCourse() {

    const[reviewModal,setReviewModal] = useState(null);
    const {courseId} = useParams();
    const {token} = useSelector((state)=>state.auth);
    const dispatch = useDispatch();


    useEffect(() => {
      const setCourseSpecificDetails = async() => {
        const courseData = await fetchFullCourseDetails(courseId,token);
        console.log(courseData);
        dispatch(setCourseSectionData(courseData?.courseContent));
        dispatch(setEntireCourseData(courseData));
        dispatch(setCompletedLectures());
        let lectures = 0;
        dispatch(setTotalNoOfLectures());
      }
      setCourseSpecificDetails();
    },[])

  return (
    <>
        <div>
            <VideoDetailsSlider setReviewModal={setReviewModal} />
            <div>
                <Outlet/>
            </div>
        </div>
        {reviewModal && <CourseReviewModal modalData={reviewModal} />}
    </>
  )
}

export default ViewCourse
