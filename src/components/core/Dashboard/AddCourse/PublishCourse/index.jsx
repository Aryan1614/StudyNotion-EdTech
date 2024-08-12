import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import IconBtn from '../../../../common/IconBtn';
import { resetCourseState, setStep } from '../../../../../slices/courseSlice';
import { COURSE_STATUS } from '../../../../../utils/constants';
import { useNavigate } from 'react-router-dom';
import { editCourseDetails } from '../../../../../services/operations/courseDetailsAPI';

function PublishCourse() {

  const {
    register,
    handleSubmit,
    getValues,
    setValue
  } = useForm();
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const[loading,setLoading] = useState(false);

  const {token} = useSelector((state)=>state.auth);
  const {course} = useSelector((state)=>state.course);

  const onSubmit = () => {
    HandleCoursePublish();
  }

  const HandleBack = async() => {
    dispatch(setStep(2));
  }

  const HandleCoursePublish = async() => {
    if((course?.status === COURSE_STATUS.PUBLISHED && getValues("public") === true) || (course?.status === COURSE_STATUS.DRAFT && getValues("public") === false)){
      // no chnage made 
      // no need to make an api call
      goToCourses();
      return;
    }

    const formData = new FormData();
    formData.append("courseId",course._id);
    const courseStatus = getValues("public") ? COURSE_STATUS.PUBLISHED : COURSE_STATUS.DRAFT;
    formData.append("status",courseStatus);

    setLoading(true);
    const result = await editCourseDetails(formData,token);
    if(result){
      goToCourses();
    }

    setLoading(false);
  }

  const goToCourses = () => {
    dispatch(resetCourseState());
    navigate("/dashboard/my-courses");
  }

  useEffect(() => {
    setValue("public",course.status);
  },[]);

  return (
    <div className='rounded-md bg-richblack-800 p-6 border-[1px] border-richblack-700 text-richblack-25'>
      <p className=' text-xl'>Publish Course</p>
      <form onSubmit={handleSubmit(onSubmit)}>
          <div className='flex flex-row items-center'>
            <label htmlFor="public"> 
              <input 
                type='checkbox'
                id='public'
                {...register("public")}
                className='rounded h-4 w-4'
              />
              <span className='ml-3'>Make This Course As Public</span>
            </label>
          </div>
          <div className='flex flex-row justify-end gap-x-3 items-center'>
            <button 
              disabled={loading} 
              onClick={HandleBack} 
              className='flex items-center rounded-md bg-richblack-300 px-3 py-2'
            >
              Back
            </button>
            <IconBtn 
              text={"Save Changes"}
            />
          </div>
      </form>
    </div>
  )
}

export default PublishCourse;
