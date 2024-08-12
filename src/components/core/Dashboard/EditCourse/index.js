import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom';
import RenderSteps from '../AddCourse/RenderSteps';
import { setCourse, setEditCourse } from '../../../../slices/courseSlice';
import { getFullDetailsOfCourse } from '../../../../services/operations/courseDetailsAPI';

function EditCourse() {

    const {token} = useSelector((state)=>state.auth);
    const {courseId} = useParams();
    const dispatch = useDispatch();
    const {course} = useSelector((state)=>state.course);

    const[loading,setLoading] = useState(false);

    useEffect(() => {
        const getCourseDetails = async() => {
            setLoading(true);
            const response = await getFullDetailsOfCourse(courseId,token);
            if(response){
                dispatch(setEditCourse(true));
                dispatch(setCourse(response));
            }
            setLoading(false);
        }
        getCourseDetails();
    },[]);

    if(loading){
        return (
            <div>
                Loading...
            </div>
        )
    }

  return (
    <div>   
        <h1 className='text-richblack-25 text-3xl'>Edit Course</h1>
        <div className='mt-8'>
            {
                course ? (<RenderSteps/>) : (<span className='text-richblack-25'>Course Not Found!</span>)
            }
        </div>
    </div>
  )
}

export default EditCourse
