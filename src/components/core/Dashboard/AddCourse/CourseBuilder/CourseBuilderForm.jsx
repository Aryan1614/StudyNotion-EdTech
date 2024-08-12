import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import IconBtn from '../../../../common/IconBtn';
import { IoIosAddCircleOutline } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import { MdNavigateNext } from 'react-icons/md';
import { setCourse, setEditCourse, setStep } from '../../../../../slices/courseSlice';
import toast from 'react-hot-toast';
import { updateSection, createSection } from '../../../../../services/operations/courseDetailsAPI';
import NestedView from './NestedView';
 
function CourseBuilderForm() {

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm();

  const dispatch = useDispatch();

  const[editSectionName,setEditSectionName] = useState(null);
  const{course} = useSelector((state)=>state.course);
  const{token} = useSelector((state)=>state.auth);

  const handleCancelEdit = () => {
    setEditSectionName(null);
    setValue("sectionName", "");
  }

  const goBack = () => {
    dispatch(setEditCourse(true));
    dispatch(setStep(1));
  }

  const goToNext = () => {
    if(course.courseContent.length === 0){
      toast.error("Please Create Atleast One Section!");
      return;
    }
    if(course.courseContent.some((section) => section.subSection.length === 0)){
      toast.error("Please Add Atleast One Lecture in each Section");
      return;
    }

    dispatch(setStep(3));
    return;
  }


  const onSubmit = async(data) => {
    let result;
    if(editSectionName){
      result = await updateSection({
        sectionName: data.sectionName,
        sectionID: editSectionName,
        courseID: course._id,
      },token);
    }
    else{
      result = await createSection({
        sectionName: data.sectionName,
        courseID: course._id
      },token);
    }

    // update value 
    if(result){
      dispatch(setCourse(result));
      setEditSectionName(null);
      setValue("sectionName","");
    }

  }

  const handleChangeEditSectionName = (sectionId,sectionName) => {
    if(editSectionName){
      setEditSectionName(null);
      setValue("sectionName","");
    }
    else{
      setEditSectionName(sectionId);
      setValue("sectionName",sectionName);
    }
  }


  return (
    <div className='text-white'>
      <div className='bg-richblack-800 flex flex-col gap-y-2 rounded-lg p-6'>
        <p className='text-richblack-25 text-xl'>Course Builder</p>
        <form onSubmit={handleSubmit(onSubmit)} className='mt-2'>
          <div className='flex flex-col gap-y-2'>
            <label htmlFor='sectionName'>Section Name<sup>*</sup></label>
            <input
              id='sectionName'
              className='text-richblack-25 outline-none border-b-2 border-richblack-600 bg-richblack-700 rounded-md px-4 py-3'
              placeholder='Add Section name'
              {...register("sectionName",{required:true})}
            />
            {
              errors.sectionName && (
                <span>Section name Required!</span>
              )
            }
          </div>

          <div className='mt-6 flex flex-row'>
            <IconBtn 
              type={"submit"}
              text={
                editSectionName ? "Edit Section Name" : "Create Section"
              }
              outline={true}
            >
              <IoIosAddCircleOutline className='text-yellow-25' />
            </IconBtn>
            {
              editSectionName && (
                <button
                  className='text-richblack-300 underline text-sm ml-10'
                  onClick={handleCancelEdit}
                >Cancel Edit</button>
              )
            }
          </div>
        </form>
      </div>

      {
        course.courseContent.length > 0 && (
          <NestedView handleChangeEditSectionName={handleChangeEditSectionName} />
        )
      }


      <div className='flex justify-end items-center gap-x-5 mt-10'>
        <button className='text-richblack-300 rounded-md cursor-pointer flex items-center' onClick={goBack}>Back</button>
        <IconBtn 
          text={"Next"}
          onclick={goToNext}
        >
          <MdNavigateNext />
        </IconBtn>
      </div>
    </div>
  )
}

export default CourseBuilderForm;