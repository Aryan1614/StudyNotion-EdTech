import React, { useEffect, useState } from 'react'
import { FaArrowLeft } from 'react-icons/fa';
import { GiBackwardTime } from 'react-icons/gi';
import OTPInput from 'react-otp-input';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { sendOtp, signup } from '../services/operations/authAPI';

function VerifyEmail() {
    const {loading, signUpData} = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const[Otp,setOtp] = useState("");

    useEffect(() =>{
        if(!signUpData){
            navigate("/signup");
        }
    },[]);

    const HandleOnSubmit = (e) => {
        e.preventDefault();
        const { 
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType 
        } = signUpData;
        
        dispatch(signup(
            accountType,
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            Otp,
            navigate
        ));
    }
  
  return (
    <div className='w-screen h-screen fixed flex items-center justify-center text-richblack-5'>
        {
            loading ? (<div className='spinner'></div>) : (
                <div className='lg:w-[430px] flex flex-col gap-3 p-5'>
                    <div className='flex flex-col gap-2'>
                        <h3 className='font-inter font-medium text-2xl'>Verify Email</h3>
                        <p className='font-inter text-lg text-richblack-500'>A verification code has been sent to you. Enter the code below</p>
                        <form onSubmit={HandleOnSubmit} className='mt-2 flex flex-col gap-3'>
                            <OTPInput
                                value={Otp}
                                onChange={setOtp}
                                numInputs={6}
                                renderInput={(props) => (
                                    <input
                                        {...props}
                                        placeholder="-"
                                        style={{
                                            boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                                        }}
                                        className="w-[48px] lg:w-[60px] border-0 bg-richblack-800 rounded-[0.5rem] text-richblack-5 aspect-square text-center focus:border-0 focus:outline-2 focus:outline-yellow-50"
                                        />
                                    )}
                                containerStyle={{
                                    justifyContent: "space-between",
                                    gap: "0 6px",
                                }}
                             />

                            <button type='submit' className=' text-richblack-800 bg-yellow-25 border-b-2 font-medium border-yellow-200 rounded-md py-2 px-3'>
                                Verify Email
                            </button>
                        </form>
                    </div>
                    
                    <div className='w-full flex items-center justify-between mt-4'>
                        <Link to={"/login"} className='flex items-center text-md gap-2'>
                            <FaArrowLeft/>
                            <p>Back to login</p>
                        </Link>
                        <button className='flex items-center gap-1 text-md text-richblue-100' onClick={() => dispatch(sendOtp(signUpData.email,navigate))}>
                            <GiBackwardTime />
                            <p>Resend it</p>
                        </button>
                    </div>
                </div>
            )
        }
    </div>
  )
}

export default VerifyEmail;