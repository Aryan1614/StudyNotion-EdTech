import toast from "react-hot-toast";
import { profileEndpoints } from "../apis";
import { apiconnector } from "../apiconnector";

const {
    GET_ENROLLED_COURSE_API,
    GET_INSTRUCTOR_DASHBOARD_DETAILS
} = profileEndpoints;

export const getEnrolledCourses = async(token) => {
    let result;
    try{
        const response = await apiconnector("GET",GET_ENROLLED_COURSE_API,null,{
            Authorization : `Bearer ${token}`
        });
        
        if(!response.data.success){
            throw new Error(response.data.message);
        }

        // console.log("Response oF Enrolled Courses->",response);
        result = response.data.data;
        // setEnrolledCourses(response.data.data);
        // toast.success("Successfully Fetched Enrolled Courses");
    } catch(e){
        console.log(e);
        toast.error(e);
    }
    return result;
}

export const fetchInstructorDashboardData = async(token,setLoading) => {
    let result = [];
    setLoading(true);
    try{
        const response = await apiconnector("GET",GET_INSTRUCTOR_DASHBOARD_DETAILS,null,{
            Authorization: `Bearer ${token}`
        });
        console.log(response);
        if(!response.data.success){
            throw new Error(response.data.message);
        }

        result = response.data;
    } catch(e){
        console.log(e);
        toast.error(e.response.data.message);
    }
    setLoading(false);
    return result;
}