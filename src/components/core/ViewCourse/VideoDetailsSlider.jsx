import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { MdOutlineArrowBackIosNew } from 'react-icons/md';
import IconBtn from '../../common/IconBtn';

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
            const currSubSectionIndex = courseSectionsData?.[currSectionIndex].findIndex((data) => data._id === subSectionId);
            const activeSubSectionId = courseSectionsData[currSectionIndex]?.subSection?.[currSubSectionIndex]?._id;

            setActiveStatus(courseSectionsData[currSectionIndex]);
            setVideoBarActive(activeSubSectionId);
        })()
    },[courseSectionsData,courseEntireData,location.pathname]);

  return (
    <>
        <div>
            <div>
                <div>
                    <button onClick={() => navigate("/dashboard/enrolled-courses")}>
                        <MdOutlineArrowBackIosNew />
                    </button>
                    <IconBtn
                        text={"Add Review"}
                        onclick={() => setReviewModal(true)}
                    />
                </div>
                <div>              
                    <p>{courseEntireData.courseName}</p>
                    <div>{completedLectures.length}/{totalNoOfLectures}</div>
                </div>
            </div>
            
            <div>
                {
                    courseSectionsData.map((course,index) => (
                        <div 
                            key={index} 
                            onClick={() => setActiveStatus(course._id)}
                        >
                            <div>
                                <div>
                                    {course?.sectionName}
                                </div>
                                {/* Arroe Icon Here handkle 180 degree rotate logic  */}
                            </div>

                            <div>
                                {
                                    activeStatus === course._id && (
                                        <div>
                                            {
                                                course.subSection.map((topic,index) => (
                                                    <div key={index}
                                                        className={`${topic._id === videoBarActive ? "bg-yellow-200 text-richblue-800" : "bg-richblack-900 text-richblue-5"} flex gap-4 p-5 `}
                                                        onClick={() => {
                                                            navigate(`/view-course/${courseEntireData?._id}/section/${course._id}/sub-section/${subSectionId}`);
                                                            setVideoBarActive(topic._id);
                                                        }}
                                                    >
                                                        <input 
                                                            type='checkbox'
                                                            disabled={true}
                                                            checked={completedLectures.includes(topic._id)}
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
