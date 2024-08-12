const express = require("express");
const router = express.Router();

const { 
    updateProfile,
    deleteAccount,
    getAllUserDetails,
    updateProfilePicture,
    removeProfilePicture,
    getEnrolledCourses
} = require("../controllers/Profile");

const { auth, isStudent } = require("../middlewares/auth");


router.post("/updateProfile", auth ,updateProfile);
router.delete("/deleteProfile", auth , deleteAccount);
router.get("/getAllUserDetails", auth , getAllUserDetails);
router.put("/updateProfilePicture", auth ,updateProfilePicture)
router.put("/removeProfilePicture",auth,removeProfilePicture);
router.get("/getEnrolledCourses",auth, isStudent, getEnrolledCourses);

module.exports = router;