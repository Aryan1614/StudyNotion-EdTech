const express = require("express");
const router = express.Router();

const {
    createCourse,
    getAllCourseDetails,
    getAllCourses,
    editCourse,
    fetchInstructorCourses,
    deleteCourse,
    getFullDetailsOfCourse,
    getAllDetailsOfCourse,
} = require("../controllers/Course");

const {
    createSection,
    updateSection,
    deleteSection,
} = require("../controllers/Section");

const {
    createSubSection,
    updateSubSection,
    deleteSubSection
} = require("../controllers/SubSection");

const {
    createRating,
    getAverageRating,
    getAllRatings
} = require("../controllers/RatingAndReview");

const {
    createCategory,
    showAllCategories,
    getAllCatagoryDetails
} = require("../controllers/Category");

const {
    markLectureAsComplete
} = require("../controllers/CourseProgress");

const { auth, isStudent, isInstructor, isAdmin } = require("../middlewares/auth");


// ********************************************************************************************************
//                                      Course Routes
// ********************************************************************************************************
router.post("/createCourse", auth, isInstructor, createCourse);
router.put("/editCourse",auth,isInstructor,editCourse);
router.get("/getAllCourses", getAllCourses);
router.post("/getFullDetailsOfCourse",auth, isInstructor, getFullDetailsOfCourse);
router.post("/getAllCourseDetails", getAllCourseDetails);
router.get("/getAllInstructorCourses", auth, isInstructor, fetchInstructorCourses);
router.delete("/deleteCourse",auth, isInstructor, deleteCourse);
router.post("/getDetailsOfCourse",auth,isStudent,getAllDetailsOfCourse);

router.post("/markLectureAsComplete",auth,isStudent,markLectureAsComplete);

// ********************************************************************************************************
//                                      Section Routes
// ********************************************************************************************************
router.post("/addSection", auth, isInstructor, createSection);
router.put("/updateSection", auth, isInstructor, updateSection);
router.delete("/deleteSection", auth, isInstructor, deleteSection);


// ********************************************************************************************************
//                                      SubSection Routes
// ********************************************************************************************************
router.post("/addSubSection", auth, isInstructor, createSubSection);
router.put("/updateSubSection", auth, isInstructor, updateSubSection);
router.delete("/deleteSubSection", auth, isInstructor, deleteSubSection);


// ********************************************************************************************************
//                                      Routes for Only Admin
// ********************************************************************************************************
router.post("/createCategory", auth, isAdmin, createCategory);
router.get("/showAllCategories", showAllCategories);
router.post("/getAllCategoryDetails",getAllCatagoryDetails);

// ********************************************************************************************************
//                                      Rating and Review
// ********************************************************************************************************
router.post("/createRating", auth, isStudent, createRating);
router.get("/getAverageRating", getAverageRating);
router.get("/allRatings", getAllRatings);


module.exports = router;