import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { MdOutlineArrowBackIosNew } from 'react-icons/md';
import IconBtn from '../../common/IconBtn';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

function VideoDetailsSlider({setReviewModal}) {

    const[activeStatus,setActiveStatus] = useState("");
    const[videoBarActive,setVideoBarActive] = useState("");
    const navigate = useNavigate();
    const {sectionId,subSectionId} = useParams();
    const location = useLocation();

    const {
        courseSectionsData,
        courseEntireData,
        completedLectures,
        totalNoOfLectures
    } = useSelector((state)=>state.viewCourse);


    useEffect(() => {
        ;(() =>{
            if(!courseSectionsData.length)
                return;

            const currSectionIndex = courseSectionsData.findIndex((data) => data._id === sectionId);
            const currSubSectionIndex = courseSectionsData?.[currSectionIndex]?.subSection?.findIndex((data) => data._id === subSectionId);
            const activeSubSectionId = courseSectionsData[currSectionIndex]?.subSection[currSubSectionIndex]?._id;

            setActiveStatus(courseSectionsData?.[currSectionIndex]?._id);
            setVideoBarActive(activeSubSectionId);
        })()
    },[courseSectionsData,courseEntireData,location.pathname]);

  return (
    <>
        <div className='text-white bg-richblack-700 min-w-[280px] h-[calc(100vh-3.5rem)] flex flex-col' >
            <div className='flex flex-col mt-10 pl-3 pr-3'>
                <div className='flex items-center justify-between'>
                    <button onClick={() => navigate("/dashboard/enrolled-courses")} className='bg-richblack-400 flex items-center justify-center rounded-full p-2 text-xl'>
                        <MdOutlineArrowBackIosNew className='font-bold text-richblue-900' />
                    </button>
                    <IconBtn
                        text={"Add Review"}
                        onclick={() => setReviewModal(true)}
                    />
                </div>
                <div className='flex flex-col mt-5 gap-y-1'>              
                    <p>{courseEntireData.courseName}</p>
                    <div>{completedLectures.length}/{totalNoOfLectures}</div>
                </div>

                <div className='border-richblack-800 border-2 w-full mt-3 mb-3' />
            </div>
            
            <div className=''>
                {
                    courseSectionsData.map((course,index) => (
                        <div 
                            key={index} 
                            onClick={() => setActiveStatus(course._id)}
                        >
                            <div className='flex items-center justify-between bg-richblack-800 py-3 pl-3 pr-3 border-2 border-richblack-600'>
                                <div>
                                    {course?.sectionName}
                                </div>
                                <div>
                                    {
                                        activeStatus === course._id ? (<div><FaChevronUp/></div>) : (<div><FaChevronDown/></div>)
                                    }
                                </div>
                            </div>

                            <div>
                                {
                                    activeStatus === course._id && (
                                        <div>
                                            {
                                                course.subSection.map((topic,index) => (
                                                    <div key={index}
                                                        className={`${topic._id === videoBarActive ? "bg-yellow-200 text-richblue-800" : "bg-richblack-900 text-richblue-5"} flex gap-4 py-3 pl-3 items-center`}
                                                        onClick={() => {
                                                            navigate(`/view-course/${courseEntireData?._id}/section/${course._id}/sub-section/${topic._id}`);
                                                            setVideoBarActive(topic._id);
                                                        }}
                                                    >
                                                        <input 
                                                            type='checkbox'
                                                            checked={(completedLectures.includes(topic._id))}
                                                            onChange={() => {}}
                                                        />
                                                        <span>
                                                            {topic?.title}
                                                        </span>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    </>
  )
}

export default VideoDetailsSlider;
