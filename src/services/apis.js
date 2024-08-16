const BASE_URL = process.env.REACT_APP_BASE_URL

export const endpoints = {
    SENDOTP_API: BASE_URL + "/auth/sendotp",
    SIGNUP_API: BASE_URL + "/auth/signup",
    LOGIN_API: BASE_URL + "/auth/login",
    RESETPASSTOKEN_API: BASE_URL + "/auth/reset-password-token",
    RESETPASSWORD_API: BASE_URL + "/auth/reset-password",
}

export const categories = {
    CATEGORIES_API : BASE_URL + "/course/showAllCategories",
    GET_ALL_CATAGORY_DETAILS: BASE_URL + "/course/getAllCategoryDetails"
}


export const contactusEndpoint = {
    CONTACT_US_API: BASE_URL + "/reach/contact",
}

export const settingsEndpoints = {
    DELETE_ACCOUNT_API : BASE_URL + "/profile/deleteProfile",
    CHANGE_PASSWORD_API : BASE_URL + "/auth/changepassword",
    UPDATE_PROFILE_API : BASE_URL + "/profile/updateProfile",
    UPDATE_DISPLAY_PICTURE_API : BASE_URL + "/profile/updateProfilePicture"
}

export const profileEndpoints = {
    GET_ENROLLED_COURSE_API : BASE_URL + "/profile/getEnrolledCourses",
    GET_INSTRUCTOR_DASHBOARD_DETAILS: BASE_URL + "/profile/instructorDashboardData",
}

export const courseEndpoints = {
    COURSE_CATEGORIES_API : BASE_URL + "/course/showAllCategories",
    CREATE_COURSE_API : BASE_URL + "/course/createCourse",
    EDIT_COURSE_API : BASE_URL + "/course/editCourse",
    DELETE_COURSE_API : BASE_URL + "/course/deleteCourse",
    CREATE_SECTION_API : BASE_URL + "/course/addSection",
    EDIT_SECTION_API : BASE_URL + "/course/updateSection",
    DELETE_SECTION_API : BASE_URL + "/course/deleteSection",
    CREATE_SUBSECTION_API : BASE_URL + "/course/addSubSection",
    EDIT_SUBSECTION_API : BASE_URL + "/course/updateSubSection",
    DELETE_SUBSECTION_API : BASE_URL + "/course/deleteSubSection",
    GET_INSTRUCTOR_COURSES: BASE_URL + "/course/getAllInstructorCourses",
    GET_FULL_DETAILS_OF_COURSE_AUTHENTICATED : BASE_URL + "/course/getFullDetailsOfCourse",
    GET_ALL_COURSE_DETAILS : BASE_URL + "/course/getAllCourseDetails",
    MARK_LECTURE_AS_COMPLETE_API : BASE_URL + "/course/markLectureAsComplete"
}

export const studentsEndpoints = {
    COURSE_PAYMENT_API: BASE_URL + "/payment/capturePayment",
    COURSE_VERIFY_API : BASE_URL + "/payment/verifySignature",
    SEND_PAYMENT_VERIFICATION_MAIL : BASE_URL + "/payment/successPaymentEmail",
    FETCH_PAYMENT_HISTORY_DETAILS: BASE_URL + "/payment/paymentHistory"
}

export const viewCourseEndpoints = {
    FETCH_COURSE_DETAILS_FOR_STUDENT : BASE_URL + "/course/getDetailsOfCourse",
}

export const ratingEndpoints = {
    CREATE_RATING_API : BASE_URL + "/course/createRating",
    GET_AVG_RATING_API: BASE_URL + "/course/getAverageRating",
    GET_ALL_RATINGS_API : BASE_URL + "/course/allRatings"
}

export const adminEndpoints = {
    CREATE_CATEGORY_API : BASE_URL + "/course/createCategory",
}