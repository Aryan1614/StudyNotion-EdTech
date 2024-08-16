import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useParams } from 'react-router-dom';
import {fetchFullCourseDetails} from '../services/operations/courseDetailsAPI';
import { setCompletedLectures, setCourseSectionData, setEntireCourseData, setTotalNoOfLectures } from '../slices/viewCourseSlice';
import VideoDetailsSlider from '../components/core/ViewCourse/VideoDetailsSlider';
import CourseReviewModal from '../components/core/ViewCourse/CourseReviewModal';

function ViewCourse() {

    const[reviewModal,setReviewModal] = useState(false);
    const {courseId} = useParams();
    const {token} = useSelector((state)=>state.auth);
    const dispatch = useDispatch();


    useEffect(() => {
      const setCourseSpecificDetails = async() => {
        const courseData = await fetchFullCourseDetails(courseId,token);
        dispatch(setCourseSectionData(courseData?.courseDetails?.courseContent));
        dispatch(setEntireCourseData(courseData?.courseDetails));
        dispatch(setCompletedLectures(courseData?.completedVideos));
        let lectures = 0;
        for(let section of courseData?.courseDetails?.courseContent){
          lectures += section?.subSection?.length;
        }
        dispatch(setTotalNoOfLectures(lectures));
      }
      setCourseSpecificDetails();
    },[])

  return (
    <>
        <div className='relative flex min-h-[calc(100vh-3.5rem)]'>
            <VideoDetailsSlider setReviewModal={setReviewModal} />
            <div className='h-[calc(100vh-3.5rem)] flex-1 overflow-auto'>
              <div className='h-[calc(100vh-3.5rem)] flex-1 overflow-auto'>
                <Outlet/>
              </div>
            </div>
        </div>
        {reviewModal && <CourseReviewModal setReviewModal={setReviewModal} />}
    </>
  )
}

export default ViewCourse
