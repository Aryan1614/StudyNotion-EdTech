import React, { useRef, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { markLectureAsComplete } from '../../../services/operations/courseDetailsAPI';
import { updateCompletedLectures } from '../../../slices/viewCourseSlice';
import { Player } from 'video-react';
import 'video-react/dist/video-react.css'; // import css
import { BigPlayButton } from 'video-react';
import IconBtn from '../../common/IconBtn';

function VideoDetails() {

  const {courseId,sectionId,subSectionId} = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const playerRef = useRef();
  const {token} = useSelector((state)=>state.auth);
  const {courseSectionsData,completedLectures,courseEntireData} = useSelector((state)=>state.viewCourse);

  const[videoData,setVideoData] = useState([]);
  const[videoEnded,setVideoEnded] = useState(false);
  const[viewSource,setViewSource] = useState("");
  const[loading,setLoading] = useState(false);

  useEffect(() => {
    const setVideo = () => {
      if(!courseSectionsData)
        return;
      if(!courseId || !sectionId || !subSectionId)
        navigate("/dashboard/enrolled-courses");
      else{
        
        const filteredData = courseSectionsData.filter((course) => course._id === sectionId);
        if(!filteredData)
          return;
        const filteredVideoData = filteredData?.[0]?.subSection.filter((subSection) => subSection._id === subSectionId);
        if(filteredVideoData){
          setVideoData(filteredVideoData[0]);
          setViewSource(courseEntireData.thumbNail);
          setVideoEnded(false);
        }
        
      }
    }
    setVideo();
  },[courseSectionsData,courseEntireData,location.pathname]);

  const isFirstVideo = () => {
    const currSectionIndex = courseSectionsData.findIndex((data) => data._id === sectionId);
    const currSubSectionIndex = courseSectionsData[currSectionIndex]?.subSection.findIndex((data) => data._id === subSectionId);
    if(currSectionIndex === 0 && currSubSectionIndex === 0){
      return true
    }
    else{
      return false;
    }
  }

  const isLastVideo = () => {
    const currSectionIndex = courseSectionsData.findIndex((data) => data._id === sectionId);
    const currSubSectionIndex = courseSectionsData[currSectionIndex].subSection.findIndex((data) => data._id === subSectionId);
    const noOfSubSections = courseSectionsData[currSectionIndex].subSection.length;
    if(currSectionIndex === courseSectionsData.length-1 && currSubSectionIndex === noOfSubSections-1){
      return true;
    }
    else{
      return false;
    }
  }

  const goToNextVideo = () => {
    const currSectionIndex = courseSectionsData.findIndex((data) => data._id === sectionId);
    const currSubSectionIndex = courseSectionsData[currSectionIndex].subSection.findIndex((data) => data._id === subSectionId);
    const noOfSubSections = courseSectionsData[currSectionIndex].subSection.length;

    if(currSubSectionIndex !== noOfSubSections-1){
      const nextSubSectionId = courseSectionsData[currSectionIndex]?.subSection[currSubSectionIndex+1]._id;
      navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubSectionId}`);
    }
    else{
      const nextSectionId = courseSectionsData[currSectionIndex+1]._id;
      const nextSubSectionId = courseSectionsData[currSectionIndex+1].subSection[0]._id;
      navigate(`/view-course/${courseId}/section/${nextSectionId}/sub-section/${nextSubSectionId}`)
    }
  }

  const goToPrevVideo = () => {
    const currSectionIndex = courseSectionsData.findIndex((data)=>data._id === sectionId);
    const currSubSectionIndex = courseSectionsData[currSectionIndex]?.subSection.findIndex((data) => data._id === subSectionId);
    if(currSubSectionIndex !== 0){
      const prevSubSectionId = courseSectionsData[currSectionIndex].subSection[currSubSectionIndex-1]._id;
      navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${prevSubSectionId}`);
    }
    else{
      const prevSectionId = courseSectionsData[currSectionIndex-1]._id;
      const prevSubSectionId = courseSectionsData[currSectionIndex-1].subSection[0]._id;
      navigate(`/view-course/${courseId}/section/${prevSectionId}/sub-section/${prevSubSectionId}`);
    } 
  }

  const HandleLectureComplition = async() => {
    setLoading(true);
    const res = await markLectureAsComplete({
      courseId: courseId,
      subSectionId: subSectionId 
    },token);
    if(res) {
      dispatch(updateCompletedLectures(subSectionId));
    }
    setLoading(false);
  }
 
  return (
    <div className='w-full text-white flex flex-col pt-10'>
      {
        !videoData ? (
          <div className='w-[calc(w-screen-240px)] h-auto flex justify-center items-center'>
            <img src={viewSource} alt='view-sourse' />
          </div>
        ) : (
          <Player 
            ref={playerRef}
            aspectRatio='16:8'
            playsInline
            onEnded={() => setVideoEnded(true)}
            src={videoData?.videoUrl}
          >
            <BigPlayButton position="center" />
            {
              videoEnded && (
                <div
                  style={{
                    backgroundImage:
                      "linear-gradient(to top, rgb(0, 0, 0), rgba(0,0,0,0.7), rgba(0,0,0,0.5), rgba(0,0,0,0.1)",
                  }}
                  className="full absolute inset-0 z-[100] grid h-full gap-y-3 place-content-center font-inter">
                  {
                    !completedLectures.includes(subSectionId) && (
                      <IconBtn 
                        disabled={loading}
                        text={!loading ? "Mark As Complete" : "Loading..." }
                        onclick={() => HandleLectureComplition()}
                        customClasses={"text-xl max-w-max px-4 mx-auto"}
                      />
                    )
                  }
                  
                  <IconBtn 
                    disabled={loading}
                    text={"Rewatch"}
                    onclick={() => {
                      if(playerRef.current){
                        playerRef.current.seek(0);
                        setVideoEnded(false);
                        playerRef.current.play();
                      }
                    }}
                    customClasses={"text-xl max-w-max px-4 mx-auto mt-2"}
                  />

                  <div className='mt-10 flex min-w-[250px] justify-center gap-x-4 text-xl'>
                    {
                      !isFirstVideo() && (
                        <button
                          disabled={loading}
                          className='blackButton'
                          onClick={goToPrevVideo}
                        >
                          Prev
                        </button>
                      )
                    }
                    {
                      !isLastVideo() && (
                        <button
                          disabled={loading}
                          onClick={goToNextVideo}
                          className='blackButton'
                        >
                          Next
                        </button>
                      )
                    }
                  </div>
                </div>
              )
            }
          </Player>
        )
      }
      <h1 className='mt-4 ml-3 text-3xl font-semibold'>
        {videoData.title}
      </h1>
      <p className='pt-2 ml-3 pb-6'>{videoData.description}</p>
    </div>
  )
}

export default VideoDetails;
