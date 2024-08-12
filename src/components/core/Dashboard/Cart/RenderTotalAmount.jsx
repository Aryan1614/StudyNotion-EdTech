import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import IconBtn from '../../../common/IconBtn';
import { buyCourse } from '../../../../services/operations/studentsFeatursAPI';
import { useNavigate } from 'react-router-dom';

function RenderTotalAmount() {
    const {total,cart} = useSelector((state) => state.cart);
    const {token} = useSelector((state)=>state.auth);
    const {user} = useSelector((state)=>state.profile);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleBuyCourse = async() => {
        const courses = cart.map((course) => course._id);
        console.log("Courses in Cart->",courses);
        await buyCourse(token,courses,navigate,dispatch,user);
    }

  return (
    <div className='bg-richblack-800 rounded-md p-6 w-[232px] flex flex-col gap-y-4'>
        <div className='flex flex-col'>
            <span className='font-medium text-richblack-400'>Total:</span>
            <div className='text-yellow-25 text-xl'>Rs. {total}</div>
        </div>
        <IconBtn 
            text={"Buy Now"}
            onclick={handleBuyCourse}
            customClasses={"w-full justify-center"}
        />
    </div>
  )
}

export default RenderTotalAmount;