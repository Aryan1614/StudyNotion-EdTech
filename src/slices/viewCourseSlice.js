import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    courseSectionsData : [],
    courseEntireData: [],
    completedLectures: [],
    totalNoOfLectures: 0
}

const viewCourseSlice = createSlice({
    name: "viewCourse",
    initialState: initialState,
    reducers:{
        setCourseSectionData: (state,action) => {
            state.courseSectionsData = action.payload;
        },
        setEntireCourseData: (state,action) => {
            state.courseEntireData = action.payload;
        },
        setCompletedLectures: (state,action) => {
            state.completedLectures = action.payload;
        },
        setTotalNoOfLectures: (state,action) => {
            state.totalNoOfLectures = action.payload;
        },
        updateCompletedLectures: (state,action) => {
            state.completedLectures = [...state.completedLectures, action.payload];
        }
    }
})

export const {setCompletedLectures,setCourseSectionData,setEntireCourseData,setTotalNoOfLectures,updateCompletedLectures} = viewCourseSlice.actions;
export default viewCourseSlice.reducer;