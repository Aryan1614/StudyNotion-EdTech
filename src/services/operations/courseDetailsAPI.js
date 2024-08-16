import toast from "react-hot-toast";
import { courseEndpoints } from "../apis";
import { apiconnector } from "../apiconnector";
import { viewCourseEndpoints } from "../apis";
import { ratingEndpoints } from "../apis";

const {
    COURSE_CATEGORIES_API,
    CREATE_COURSE_API,
    EDIT_COURSE_API,
    CREATE_SECTION_API,
    EDIT_SECTION_API,
    DELETE_SECTION_API,
    CREATE_SUBSECTION_API,
    EDIT_SUBSECTION_API,
    DELETE_SUBSECTION_API,
    DELETE_COURSE_API,
    GET_INSTRUCTOR_COURSES,
    GET_ALL_COURSE_DETAILS,
    GET_FULL_DETAILS_OF_COURSE_AUTHENTICATED,
    MARK_LECTURE_AS_COMPLETE_API
} = courseEndpoints;

const {
    CREATE_RATING_API,
    GET_ALL_RATINGS_API,
    GET_AVG_RATING_API
} = ratingEndpoints;


const {
    FETCH_COURSE_DETAILS_FOR_STUDENT
} = viewCourseEndpoints;

export const getCourseCategories = async() => {
    let CourseCategories = [];
    try{    
        const response = await apiconnector("GET",COURSE_CATEGORIES_API);
        // console.log("Course Category api response");
        // console.log(response);

        if(!response?.data?.success){
            throw new Error("Could Not Fetch Course Categories");
        }

        CourseCategories = response?.data?.allCategory;
    } catch(e){
        console.log(e);
        toast.error("Categories Not Fetched!");
    }
    return CourseCategories;
}

export const addCourseDetails = async(data, token) => {
    let result = null;
    const toastId = toast.loading("Loading...");
    try{
        const response = await apiconnector("POST",CREATE_COURSE_API,data,{
            "Content-type" : "multipart/form-data",
            Authorization : `Bearer ${token}`
        });

        // console.log("Create Course Form Api Response: ", response);
        if(!response.data.success){
            throw new Error("Could Not Add Course Details!");
        }

        toast.success("Course Created Successfully!");
        result = response?.data?.data;
    } catch(e){
        console.log(e);
        toast.error(e.message);
    }
    toast.dismiss(toastId);
    return result;
}

export const editCourseDetails = async(data,token) => {
    let result = null;
    const toastId = toast.loading("Loading...");
    try{
        const response = await apiconnector("PUT",EDIT_COURSE_API,data,{
            Authorization : `Bearer ${token}`
        });

        if(!response.data.success){
            throw new Error("Course Data Not Updated");
        }

        toast.success("Course Data Updated Successfully!!");
        result = response?.data?.data;
    } catch(e){
        console.log("Edit Course API Error");
        toast.error(e.message);
    }
    toast.dismiss(toastId);
    return result;
}

export const createSection = async(data,token) => {
    let result;
    const toastId = toast.loading("Loading...");
    try{

        const response = await apiconnector("POST",CREATE_SECTION_API,data,{
            Authorization: `Bearer ${token}`
        });

        // console.log(response);

        if(!response.data.success){
            throw new Error(response.data.message);
        }

        toast.success("Section Created Successfully");
        result = response?.data?.updatedCourseDetails;
    } catch(e){
        console.log(e);
        toast.error(e.message);
    }
    toast.dismiss(toastId);
    return result;
}

export const updateSection = async(data,token) => {
    let result;
    const toastId = toast.loading("Loading...");
    try{

        const response = await apiconnector("PUT",EDIT_SECTION_API,data,{
            Authorization : `Bearer ${token}`
        });
        // console.log("Response Of An Update Section!");
        // console.log(response);

        if(!response.data.success){
            throw new Error(response?.data?.message);
        }

        toast.success("Section Updated Successfully");
        result = response?.data?.updatedCourseDetails;
    } catch(e){
        console.log(e);
        toast.error(e.message);
    }
    toast.dismiss(toastId);
    return result;
}

export const deleteSection = async(data,token) => {
    let result;
    const toastId = toast.loading("Loading...");
    try{
      const response = await apiconnector("DELETE",DELETE_SECTION_API,data,{
         Authorization : `Bearer ${token}`
      });

      if(!response.data.success){
         throw new Error(response.data.message);
      }

      toast.success("Section Deleted Successfully");
      result = response?.data?.updatedCourseDetails;
    } catch(e){
     console.log(e);
     toast.error(e.message);
    }
    toast.dismiss(toastId);
    return result;
}

export const createSubSection = async(data,token) => {
    let result;
    const toastId = toast.loading("Loading...");
    try{
        const response = await apiconnector("POST",CREATE_SUBSECTION_API,data,{
            Authorization: `Bearer ${token}`
        });

        // console.log("Response From Backend Of SubSection API: ",response);

        if(!response.data.success){
            throw new Error(response.data.message);
        }

        toast.success("SubSection Created Successfully!");
        result = response.data.updatedSection;
        // console.log(result);
    } catch(e){
        console.log(e);
        toast.error(e.message);
    }
    toast.dismiss(toastId);
    return result;
}

export const updateSubSection = async(data,token) => {
    let result;
    const toastId = toast.loading("Loading...");
    try{

        const response = await apiconnector("PUT",EDIT_SUBSECTION_API,data,{
            Authorization : `Bearer ${token}`
        });

        if(!response.data.success){
            throw new Error(response.data.message);
        }

        toast.success("SubSection Updated Successfully!");
        result = response?.data?.updatedSection;
    } catch(e){
        console.log(e);
        toast.error(e.message);
    }
    toast.dismiss(toastId);
    return result;
}

export const deleteSubSection = async(data,token) => {
    let result;
    const toastId = toast.loading("Loading...");
        try{

        const response = await apiconnector("DELETE",DELETE_SUBSECTION_API,data,{
            Authorization : `Bearer ${token}`
        });

        if(!response.data.success){
            throw new Error(response.data.message);
        }

        toast.success("subSection Deleted Successfully");
        result = response?.data?.data;
    } catch(e){
        console.log(e);
        toast.error(e.message);
    }
    toast.dismiss(toastId);
    return result;
}

export const fetchInstructorCourses = async(token) => {
    let result;
    try{
        const response = await apiconnector("GET",GET_INSTRUCTOR_COURSES,null,{
            Authorization : `Bearer ${token}`
        });

        if(!response.data.success){
            throw new Error(response.data.message);
        }
    
        result = response.data.courses;
    } catch(e){
        console.log(e);
        toast.error(e.message);
    }
    return result;
}

export const deleteCourse = async(data,token) => {
    const toastId = toast.loading("Loading...");
    try{

        const response = await apiconnector("DELETE",DELETE_COURSE_API,data,{
            Authorization : `Bearer ${token}`
        });

        if(!response.data.success) {
            throw new Error(response.data.message);
        }

        toast.success("Course Deleted Successfully!");
    } catch(e){
        console.log(e);
        toast.error(e.message);
    }
    toast.dismiss(toastId);
}


export const getAllCourseDetailsAllUsers = async(courseId) => {
    let result = null;
    try{
        const response = await apiconnector("POST",GET_ALL_COURSE_DETAILS,{courseId: courseId});

        if(!response.data.success){
            throw new Error(response.data.message);
        }

        result = response.data.data;
    } catch(e){
        console.log(e);
        toast.error(e.response.data.message);   
    }
    return result;
}

export const getFullDetailsOfCourseInstructor = async(courseId,token) => {
    let result;
    const toastId = toast.loading("Loading...");
    try{

        const response = await apiconnector("POST",GET_FULL_DETAILS_OF_COURSE_AUTHENTICATED,{courseId: courseId},{
            Authorization : `Bearer ${token}`
        });

        if(!response.data.success){
            throw new Error(response.data.message);
        }

        result = response?.data?.data;
    } catch(e){
        console.log(e);
        toast.error(e.message);
    }
    toast.dismiss(toastId);
    return result;
}

export const fetchFullCourseDetails = async(courseId,token) => {
    let result = {};
    const toastId = toast.loading("Loading...");
    try{
        const response = await apiconnector("POST",FETCH_COURSE_DETAILS_FOR_STUDENT,{courseId: courseId},{
            Authorization : `Bearer ${token}`
        });

        if(!response.data.success){
            throw new Error(response.data.message);
        }

        result = response?.data;
    } catch(e){
        console.log(e);
        toast.error(e.message);
    }
    toast.dismiss(toastId);
    return result;
}


export const createRating = async(data,token) => {
    const toastId = toast.loading("Loading...");
    try{    
        const response = await apiconnector("POST",CREATE_RATING_API,data,{
            Authorization : `Bearer ${token}`
        });

        if(!response.data.success){
            throw new Error(response.data.message);
        }

        toast.success("Rating Saved Successfully!");
    } catch(e){ 
        console.log("Error",e);
        toast.error(e.response.data.message);
    }
    toast.dismiss(toastId);
}

export const getAllRatings = async(data,token) => {
    let result = [];
    // const toastId = toast.loading("Loading...");
    try{
        const response = await apiconnector("GET",GET_ALL_RATINGS_API,null);

        if(!response.data.success){
            throw new Error(response.data.message);
        }

        result = response.data.allRating;
    } catch(e){
        console.log(e);
        toast.error(e.message);
    }
    // toast.dismiss(toastId);
    return result;
}

export const getAverageRating = async(data,token) => {
    let result = [];
    // const toastId = toast.loading("Loading...");
    try{
        const response = await apiconnector("GET",GET_AVG_RATING_API,null,{
            Authorization: `Bearer ${token}`
        });

        if(!response.data.success){
            throw new Error(response.data.message);
        }

        result = response.data.AvgRating;
    } catch(e){
        console.log(e);
        toast.error(e.message);
    }
    // toast.dismiss(toastId);
    return result;
}

export const markLectureAsComplete = async(data,token) => {
    let res = false;
    const toastId = toast.loading("Loading...");
    try{
        const response = await apiconnector("POST",MARK_LECTURE_AS_COMPLETE_API,data,{
            Authorization: `Bearer ${token}`
        });

        if(!response.data.success){
            throw new Error(response.data.message);
        }

        toast.success("Lecture Completed Successfully!");
        res = true;
    } catch(e){
        console.log(e);
        toast.error(e.response.data.message);
    }
    toast.dismiss(toastId);
    return res;
}