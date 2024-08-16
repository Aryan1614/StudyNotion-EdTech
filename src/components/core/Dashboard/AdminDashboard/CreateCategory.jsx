import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { createCategoryAdmin } from '../../../../services/operations/adminAPI';
import { useForm } from 'react-hook-form';

function CreateCategory() {
    const {token} = useSelector((state)=>state.auth);

    const onSubmit = async() => {
        const data = {
            name: getValues("Category"),
            description: getValues("categoryDesc"),
        }
        // console.log(data);
        createCategoryAdmin(data,token);
        reset();
    }

    const {
        handleSubmit,
        reset,
        register,
        setValue,
        getValues,
        formState: {errors}
    } = useForm();

    useEffect(() => {
        setValue("Category","");
        setValue("categoryDesc","");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

  return (
    <div className='mt-3'>
      <form onSubmit={handleSubmit(onSubmit)} className=''>
        <div className=''>
            <div className='flex flex-col gap-y-2 max-w-[450px]'>
                <label htmlFor='Category'>Category Name:</label>
                <input 
                    type='text'
                    {...register("Category",{required: true})}
                    className='bg-richblack-700 py-2 px-3 text-richblack-5 border-b border-r-richblack-800 rounded-md'
                />
                {
                    errors.Category && (
                        <span className='text-sm text-pink-300'>Please Enter Category Name</span>
                    )
                }
            </div>
            <div className='flex flex-col gap-y-2 max-w-[450px] mt-5'>
                <label htmlFor='categoryDesc'>Category Description:</label>
                <input 
                    type='text'
                    {...register("categoryDesc",{required: true})}
                    className='bg-richblack-700 py-2 px-3 text-richblack-5 border-b border-r-richblack-800 rounded-md'
                />
                {
                    errors.categoryDesc && (
                        <span className='text-sm text-pink-300'>Please Enter Category Description</span>
                    )
                }
            </div>
        </div>
        <button type='submit' className='mt-5 bg-yellow-25 rounded-md py-2 px-3 text-richblue-900'>
            create category
        </button>
      </form>
    </div>
  )
}

export default CreateCategory;
