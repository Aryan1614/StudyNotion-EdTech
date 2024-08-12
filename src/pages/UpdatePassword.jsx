import React from 'react'
import { GoArrowLeft } from 'react-icons/go';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { resetPassword } from '../services/operations/authAPI';

function UpdatePassword() {
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading } = useSelector((state) => state.auth);

    const[showPassword,setShowPassword] = useState(false);
    const[showConfirmPassword,setShowConfirmPassword] = useState(false);

    const[FormData,setFormData] = useState({
        password:"",
        confirmPassword:""
    });

    const handleOnChange = (e) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            [e.target.name] : e.target.value
        }));
    }

    const handleOnClick = (e) => {
        e.preventDefault();

        if(FormData.password !== FormData.confirmPassword){
            return toast.error("password Not Matched");
        }

        console.log("Password Matched");

        const { password,confirmPassword } = FormData;
        const token = location.pathname.split("/").at(-1);

        dispatch(resetPassword(password,confirmPassword,token,navigate));

        setFormData({
            password:"",
            confirmPassword:""
        });
    }

  return (
    <div className='w-screen h-screen fixed flex items-center text-richblack-5 justify-center'>
        {
            loading ? (<div className='spinner'></div>) : (
                <div className='p-5 w-[400px]'>
                    <div className='flex flex-col gap-3'>
                        <h3 className='text-2xl font-inter font-semibold'>Choose new password</h3>
                        <p>Almost done. Enter your new password and you're all set.</p>
                    </div>
                    <form className='mt-3'>
                        <div className='flex flex-col gap-3'>
                            <label className='text-sm font-inter gap-2'>password<sup className='text-pink-200'>*</sup></label>
                            <div className='relative'>
                                <input type={`${showPassword ? `text` : `password`}`} name='password' value={FormData.password} className='relative w-full px-2 py-2 rounded-md bg-richblack-800 border-b border-richblack-700' onChange={handleOnChange} />
                                <div onClick={(e) => setShowPassword(!showPassword)} className='absolute right-3 top-3'>
                                    {
                                        showPassword ? (<FaEyeSlash/>) : (<FaEye/>)
                                    }
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className='text-sm font-inter gap-2'>confirm password<sup>*</sup></label>
                            <div className='relative'>
                                <input type={`${showConfirmPassword ? `text` : `password`}`} className='relative w-full px-2 py-2 rounded-md bg-richblack-800 border-b border-richblack-700' onChange={handleOnChange} name='confirmPassword' value={FormData.confirmPassword} />
                                <div onClick={(e) => setShowConfirmPassword(!showConfirmPassword)} className='absolute right-3 top-3'>
                                    {
                                        showConfirmPassword ? (<FaEyeSlash/>) : (<FaEye/>)
                                    }
                                </div>
                            </div>
                        </div>
                        <button onClick={handleOnClick} className='py-2 w-full mt-4 rounded-md bg-yellow-25 border-b border-yellow-200 text-richblack-800'>
                            Reset password
                        </button>
                    </form>
                    <div>
                        <Link to="/login" className='flex items-center gap-1 text-md mt-3'>
                            <GoArrowLeft/>
                            <div>Back To Login</div>
                        </Link>
                    </div>
                </div>
            )
        }
    </div>
  )
}

export default UpdatePassword;