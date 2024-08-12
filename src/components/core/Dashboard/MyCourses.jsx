import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchInstructorCourses } from "../../../services/operations/courseDetailsAPI";
import IconBtn from "../../common/IconBtn";
import { FiPlus } from "react-icons/fi";
import CoursesTable from "./InstructorCourses/CoursesTable";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";

function MyCourses() {

  const {token} = useSelector((state)=>state.auth);
  const navigate = useNavigate();

  const[courses,setCourses] = useState([]);
  const[loading,setLoading] = useState(false);

  useEffect(() => {
    const fetchCourses = async() => {
      setLoading(true);
      try{
        const result = await fetchInstructorCourses(token);

        if(result){
          setCourses(result);
        }
      } catch(e){
        console.log(e);
        toast.error(e.message);
      }
      setLoading(false);
    }
    fetchCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  return (
    <div className="text-richblack-25">
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-3xl text-richblack-50">My Courses</h1>
        <IconBtn 
          text={"Add Course"}
          onclick={() => navigate("/dashboard/add-course")}
        >
          <FiPlus className="text-md" />
        </IconBtn>
      </div>
      {
        loading ? (<div className="w-full h-full flex items-center justify-center"><div className="spinner m-auto"></div></div>) : courses && (
          <CoursesTable courses={courses} setCourses={setCourses} />
        )
      }
    </div>
  )
}

export default MyCourses;
