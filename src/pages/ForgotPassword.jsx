import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { GoArrowLeft } from 'react-icons/go'
import { getPasswordResetToken } from '../services/operations/authAPI';

function ForgotPassword() {
    const dispatch = useDispatch();

    const[emailSent,setEmailSent] = useState(false);
    const[email,setEmail] = useState("");
    const {loading} = useSelector((state) => state.auth);

    const HandleOnClick = (e) =>  {
        e.preventDefault();
        dispatch(getPasswordResetToken(email,setEmailSent));
    }

  return (
    <div className='w-screen h-screen flex justify-center fixed'>
        {
            loading ? (<div className='spinner'></div>)
            : (
                <div className=' text-richblack-5 flex flex-col gap-4 w-[500px] p-8 my-auto'>
                    <div className='text-3xl font-inter font-bold left-0'>
                        {
                            !emailSent ? "Reset your password" : "Check Your Mail"
                        }
                    </div>
                    <div className=' text-lg font-inter text-richblack-100'>
                        {
                            !emailSent ? "Have no fear. We'll email you instructions to reset your password. If you dont have access to your email we can try account recovery" : `We have sent the reset email to ${email}`
                        }
                    </div>
                    <form >
                        <div>
                            {
                                !emailSent && (
                                    <label className='flex flex-col gap-1'>
                                        <div className='flex items-center gap-1'><p className='text-sm '>Email Address</p> <sup className='text-sm flex items-center text-pink-300'>*</sup></div>
                                        <input
                                            value={email}
                                            name='email'
                                            placeholder='Enter email address'
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className='w-full border-b border-richblack-700 outline-none bg-richblack-800 px-3 py-3 rounded-md'
                                        />
                                    </label>
                                )
                            }
                        </div>
                        <button className='w-full border-b border-yellow-200 bg-yellow-25 text-richblack-800 px-3 py-3 rounded-md mt-5 text-bold' onClick={HandleOnClick}>
                            {
                                !emailSent ? "Reset Password" : "Resend Email"
                            }
                        </button>
                    </form>
                    
                    <div className='flex items-center gap-2'>
                        <Link to='/login' className='flex flex-row gap-2 items-center text-md font-medium'>
                            <GoArrowLeft />
                            <p>Back To Login</p>
                        </Link>
                    </div>
                </div>        
            )
        }
    </div>
  )
}

export default ForgotPassword;