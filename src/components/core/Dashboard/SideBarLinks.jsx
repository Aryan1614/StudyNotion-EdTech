import React from 'react'
import { useLocation,NavLink, matchPath } from 'react-router-dom';
import * as Icons from 'react-icons/vsc'
import { resetCourseState } from '../../../slices/courseSlice';
import { useDispatch } from 'react-redux';

function SideBarLinks({link, IconName}) {

    const Icon = Icons[IconName];
    const location = useLocation();
    const dispatch = useDispatch();

    const matchRoute = (route) => {
      return matchPath({path:route}, location.pathname);
    }

  return (
    <NavLink
       to={link.path}
       onClick={() => dispatch(resetCourseState())}
       className={`${matchRoute(link.path) ? `bg-yellow-800 text-yellow-25` : `bg-opacity-0`} relative px-8 py-2 text-sm font-medium text-white`}
    >
        <span className={`absolute left-0 top-0 h-full w-[0.2rem] bg-yellow-50 ${matchRoute(link.path) ? 'opacity-100 ' : 'opacity-0'}`}>
        </span>

        <div className={`flex items-center gap-x-2 ${matchRoute(link.path) ? "text-yellow-25" : "text-richblack-200"}`}>
            <Icon className='text-lg ' />
            <span className=''>{link.name}</span>
        </div>
    </NavLink>
  )
}

export default SideBarLinks;