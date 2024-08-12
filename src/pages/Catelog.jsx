import React, { useEffect, useState } from 'react'
import { getCatalogPageDetails } from '../services/operations/pageAndComponentData';
import Footer from '../components/common/Footer';
import { useNavigate, useParams } from 'react-router-dom';
import { apiconnector } from '../services/apiconnector';
import { categories } from '../services/apis';
import CourseSlider from '../components/core/Catalog/CourseSlider';
import CatalogCourseCard from '../components/core/Catalog/CatalogCourseCard';

function Catelog() {

    const {catalogName} = useParams();
    const navigate = useNavigate();
    const[loading,setLoading] = useState(false);
    const[catelogPageData,setCatalogPageData] = useState(null);
    const[catagoryId,setCatagoryId] = useState("");
    const[curr,setCurr] = useState("Most Popular");

    useEffect(()=>{
        setLoading(true);
        const fetchCategoryId = async() => {
            const res = await apiconnector("GET",categories.CATEGORIES_API);
            const id = res?.data?.allCategory?.filter((cat) => cat.name.split(" ").join("-").toLowerCase() === catalogName)[0]._id;
            setCatagoryId(id);
        }
        fetchCategoryId();
        setLoading(false);
    },[catalogName]);

    useEffect(() => {
        setLoading(true);
        const fetchCategoryPageDetails = async() => {
            try{    
                const response = await getCatalogPageDetails(catagoryId);
                setCatalogPageData(response);
            } catch(e){
                console.log(e);
            }
        }
        if(catagoryId){
            fetchCategoryPageDetails();
        }
        setLoading(false);
    },[catagoryId]);

  return (
    <div className='text-white'>
    {
        loading ? (
            <div className='w-screen h-screen flex items-center justify-center'>
                <div className='spinner'></div>
            </div>
        ) :

        catelogPageData && catelogPageData.length === 0 ? 
        (
            <div className='w-screen h-screen flex items-center justify-center text-4xl'>
                No Courses Found For This Catagory...
            </div>
        ) 
        : (
            <div className='bg-richblack-900 mb-14'>
                <div className='bg-richblack-800 h-[260px] flex items-center w-screen'>
                    <div className='flex flex-col items-start max-w-maxContent w-11/12 mx-auto gap-3 text-richblack-300'>
                        <p className='text-sm'><span className='cursor-pointer' onClick={() =>navigate("/")}>Home</span> / Catalog / <span className='text-yellow-25'>{catelogPageData?.selectedCategory?.name}</span></p>
                        <p className='lg:text-4xl sm:text-3xl font-medium text-white'>{catelogPageData?.selectedCategory?.name}</p>
                        <p>{catelogPageData?.selectedCategory?.description}</p>
                    </div>
                </div>

                <div className='flex justify-center'>
                    <div className='w-11/12 max-w-maxContent flex flex-col mt-10'>
                        {/* section 1  */}
                        <div className='mb-5'>
                            <p className='text-white text-4xl font-semibold'>Courses to get you started</p>
                        </div>
                        <div className='mb-14'>
                            <div className='flex items-center gap-x-5 border-b-2 pl-4 border-b-richblack-700 pb-1 text-sm relative mb-8'>
                                <div onClick={() => setCurr("Most Popular")} className={` relative ${curr === "Most Popular" ? "text-yellow-25" : "text-richblack-300"} cursor-pointer`}>Most Popular <p className={`${curr === "Most Popular" ? "border-b-2 absolute w-full border-b-yellow-25 -bottom-1" : ""}`}></p></div>
                                <div onClick={() => setCurr("New")} className={`relative ${curr === "New" ? "text-yellow-25" : "text-richblack-300"} cursor-pointer`}>New <p className={`${curr === "New" ? "border-b-2 absolute w-full border-b-yellow-25 -bottom-1" : ""}`}></p></div>
                            </div>
                            <div>
                                {
                                    catelogPageData?.selectedCategory?.courses && (
                                        <CourseSlider courses={catelogPageData?.selectedCategory?.courses} />
                                    )
                                }
                            </div>
                        </div>

                        {/* Section 2 */}
                        <div className='mb-14'>
                            <p className='text-4xl font-semibold mb-7'>Top Courses in {catelogPageData?.differentCategory?.name}</p>
                            <div>
                                {
                                    catelogPageData?.differentCategory?.courses && (
                                        <CourseSlider courses={catelogPageData?.differentCategory?.courses} />
                                    )
                                }
                            </div>
                        </div>
                        
                        {/* Section 3  */}
                        <div className='flex flex-col gap-3'>
                            <p className='text-4xl font-semibold'>Freqently Bought Courses</p>
                            <div className='py-8'> 
                                <div className='grid grid-cols-1 lg:grid-cols-2 gap-10'>
                                    {
                                        catelogPageData?.mostSellingCourse && catelogPageData?.mostSellingCourse.slice(0,4).map((course,index) => (
                                            <CatalogCourseCard course={course} key={index} height={"h-[400px]"} />
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    <Footer />
    </div>
  )
}

export default Catelog;
