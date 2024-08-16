import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { fetchPaymentHistoryDetails } from '../../../services/operations/studentsFeatursAPI';

function PurchaseHistory() {

  const[paymentHistory,setPaymentHistory] = useState([]);
  const[loading,setLoading] = useState(false);
  const {token} = useSelector((state)=>state.auth);

  useEffect(() => {
    const fetchDetails = async() => {
      const response = await fetchPaymentHistoryDetails(setLoading,token);
      // console.log("Payment History Details -> ",response);
      if(response){
        setPaymentHistory(response);
      }
    }
    if(token){
      fetchDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  return (
    <div className='text-white w-full'>
      <p className='text-3xl text-richblack-50'>Payment History</p>
      <div className='mt-5'>
        <div className='flex items-center justify-between bg-richblack-800 rounded-md px-4 py-3'>
          <div>No.</div>
          <div>Order_Id</div>
          <div>Payment_Id</div>
          <div>Amount</div>
          <div>Courses</div>
        </div>
        <div>
          { 
            !loading && paymentHistory && paymentHistory.length === 0 ? (
              <div className='flex items-center justify-between bg-richblack-700 rounded-md px-4 py-3'>
                Data Not Found!
              </div>
            ) : 
            (
              !loading && paymentHistory && paymentHistory.map((course,index) => (
                <div className='flex items-center justify-between bg-richblack-700 border-2 border-richblack-600 rounded-md px-4 py-3' key={index}>
                  <div>{index}</div>
                  <div>{course.orderId}</div>
                  <div>{course.paymentId}</div>
                  <div>Rs. {course.amount}</div>
                  <div>{course.courses.length}</div>
                </div>
              ))
            )
          }
        </div>
      </div>
    </div>
  )
}

export default PurchaseHistory
