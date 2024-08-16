import React, { useEffect } from 'react'
import { Link, matchPath, useLocation } from 'react-router-dom';
import logo from '../../assets/Logo/Logo-Full-Light.png'
import { NavbarLinks } from '../../data/navbar-links';
import { useSelector } from 'react-redux';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { apiconnector } from '../../services/apiconnector';
import { categories } from '../../services/apis';
import { IoIosArrowDown } from 'react-icons/io';
import { AiOutlineMenu } from 'react-icons/ai';
import ProfileDropdown from '../core/Auth/ProfileDropDown';
import { ACCOUNT_TYPE } from '../../utils/constants';


function NavBar() {

    const {token} = useSelector((state)=> state.auth);
    const {user} = useSelector((state) => state.profile);
    const {totalItems} = useSelector((state) => state.cart); 

    const[subLinks,setSubLinks] = useState([]);

    const fetchCategories = async() => {
        try{    
            const result = await apiconnector("GET",categories.CATEGORIES_API);
            setSubLinks(result.data.allCategory);
        } catch(e){
            console.log("Could Not Fetch Categories");
            toast.error("Categories Fetching Failure!");
        }                           
    }

    useEffect( () => {
        fetchCategories();
    }, []);

    const location = useLocation();

    const matchRoute = (route) => {
        return matchPath({path:route}, location.pathname);
    }

  return (
    <div className='flex h-14 items-center justify-center border-b-[1px] border-richblack-700 bg-richblack-800'>
        <div className='flex w-11/12 max-w-maxContent items-center justify-between'>
            
            <Link to='/'>
                <img src={logo} alt='logo' width={160} height={32} loading='lazy' />
            </Link> 

            <nav>   
                <ul className='flex gap-x-6 text-richblack-25'>
                    {
                        NavbarLinks.map( (link,index) => (
                            <li key={index}>
                                {
                                    link.title === "Catalog" ? (
                                        <div className=''>
                                            <div className='flex gap-2 group items-center relative'>
                                                <p>{link.title} </p>
                                                <IoIosArrowDown />

                                                <div className='invisible absolute left-[50%] right-[50%] flex flex-col gap-2 rounded-md bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 lg:w-[300px] translate-x-[-50%] translate-y-[80%] z-50'>
                                                    <div className='absolute left-[57%] -top-1 h-6 w-6 rotate-45 -z-40 rounded-sm bg-richblack-5'></div>
                                                    {
                                                        subLinks.map((link,index) => (
                                                            <Link to={`/catalog/${link.name.split(" ").join("-").toLowerCase()}`} key={index} className='border border-richblack-25 px-2 py-1'>
                                                                {link.name}
                                                            </Link>
                                                        ))
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <Link to={link?.path}>
                                            <p className={` ${matchRoute(link?.path) ? `text-yellow-25` : `text-richblack-25`} `}>
                                                {link.title}
                                            </p>
                                        </Link>
                                    )
                                }
                            </li>
                        ))
                    }
                </ul>
            </nav>
            
            <div className="hidden items-center gap-x-4 md:flex">
                {user && user?.accountType === ACCOUNT_TYPE.STUDENT && (
                    <Link to="/dashboard/cart" className="relative">
                    <AiOutlineShoppingCart className="text-2xl text-richblack-100" />
                    {totalItems > 0 && (
                        <span className="absolute -bottom-2 -right-2 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-richblack-600 text-center text-xs font-bold text-yellow-100">
                            {totalItems}
                        </span>
                    )}
                    </Link>
                )}
                {token === null && (
                    <Link to="/login">
                    <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                        Log in
                    </button>
                    </Link>
                )}
                {token === null && (
                    <Link to="/signup">
                    <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                        Sign up
                    </button>
                    </Link>
                )}
                {token !== null && <ProfileDropdown />}
            </div>
            <button className="mr-4 md:hidden">
                <AiOutlineMenu fontSize={24} fill="#AFB2BF" />
            </button>
        </div>
    </div>
  )
}

export default NavBar;