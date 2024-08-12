import React from 'react'
import { useSelector } from 'react-redux';
import RenderCartCourses from './RenderCartCourses';
import RenderTotalAmount from './RenderTotalAmount';

function Cart() {

    const {total,totalItems} = useSelector((state)=>state.cart);

  return (
    <div className='text-white'>
        <div>
            <h1 className='text-3xl font-medium text-richblack-50 mb-14'>Your Cart</h1>
            <p className='border-b border-b-richblack-400 pb-2 font-semibold text-richblack-400'>{totalItems} courses in cart</p>

            {
                total>0 ? 
                (
                    <div className='mt-8 flex flex-col-reverse justify-between items-start gap-x-10 gap-y-6 lg:flex-row'>
                        <RenderCartCourses />
                        <RenderTotalAmount />
                    </div>
                ) : 
                (<div className='mt-14 text-center text-3xl text-richblack-100'>Your Cart is Empty</div>)
            }
        </div>
    </div>
  )
}

export default Cart;