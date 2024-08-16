import React from 'react'
import { useSelector } from 'react-redux';
import CreateCategory from './AdminDashboard/CreateCategory';

function AdminPage() {
  const {user} = useSelector((state)=>state.profile);
    
  return (
    <div className='text-white flex h-full flex-col'>
      <p className='text-richblack-25 text-3xl font-semibold'>Hi {user.firstName} 👋</p>
      <p className='text-richblack-5 mt-2'>Welcome To The Admin Page</p>
      <div className='mt-4'>
        <CreateCategory />
      </div>
    </div>
  )
}

export default AdminPage;
