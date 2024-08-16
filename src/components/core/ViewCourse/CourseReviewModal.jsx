import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { ImCross } from 'react-icons/im';
import { useForm } from 'react-hook-form';
import ReactStars from 'react-stars';
import IconBtn from '../../common/IconBtn';
import { createRating } from '../../../services/operations/courseDetailsAPI';

function CourseReviewModal({setReviewModal}) {

  const {token} = useSelector((state)=>state.auth);
  const {user} = useSelector((state)=>state.profile);
  const {courseEntireData} = useSelector((state)=>state.viewCourse);

  const {
    handleSubmit,
    register,
    setValue,
    reset,
    formState:{errors}
  } = useForm();

  useEffect(() => {
    setValue("courseExperience","");
    setValue("courseRating",0);
  },[]);

  const onSubmit = async(data) => {
    await createRating({
      rating: data.courseRating,
      review: data.courseExperience,
      courseId: courseEntireData._id
    },token);

    reset();
    setReviewModal(false);
  }

  const ratingChanged = (newRating) => {
    setValue("courseRating",newRating);
  }

  return (
    <div className='fixed inset-0 z-[1000] !mt-0 grid place-items-center overflow-auto bg-white bg-opacity-10 backdrop-blur-sm'>
      <div className='w-11/12 max-w-[550px] rounded-lg border border-richblack-400 bg-richblack-800 p-6'>
        <div className='flex items-center justify-between w-full mb-3'>
          <p className='text-xl font-semibold text-richblack-25'>Add Review</p>
          <button onClick={() => setReviewModal(false)}>
            <ImCross className='text-richblack-25'/> 
          </button>
        </div>

        <div className='w-full'>
            <div className='flex flex-col mx-auto gap-y-2 items-center'>
              <img src={user.image} alt={`${user.firstName} ${user.lastName}`} className=' aspect-square w-[50px] rounded-full object-cover' />
              <div className='text-white mx-auto flex items-center flex-col'> 
                  <p>{user.firstName} {user.lastName}</p>
                  <p>Posting Publicly</p>
              </div>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className='mt-6 flex flex-col items-center'>
              <ReactStars 
                count={5}
                onChange={ratingChanged}
                size={24}
                activeColor="#ffd700"
              />

              <div className='w-full'>
                <label htmlFor='courseExperience' className='text-white'>Add Your Experience*</label>
                <textarea 
                id='courseExperience'
                  className='min-h-[130px] w-full form-style'
                  placeholder='Add Your Experience Here...'
                  {...register("courseExperience",{required:true})}
                />
                {
                  errors.courseExperience && (
                    <span className='text-yellow-50 text-sm'>Please Add Your Experience</span>
                  )
                }
              </div>
              <div className='flex items-center gap-x-3 mt-5'>
                <button className=' rounded-md px-3 text-richblack-5 font-semibold py-2 bg-richblack-500' onClick={() => setReviewModal(false)}>
                    Cancel
                </button>
                <IconBtn 
                  text={"Save"}
                  customClasses={"font-semibold"}
                />
              </div>
            </form>
        </div>
      </div>
    </div>
  )
}

export default CourseReviewModal;
