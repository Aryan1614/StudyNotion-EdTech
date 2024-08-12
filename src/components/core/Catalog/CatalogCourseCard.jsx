import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import GetAvgRating from '../../../utils/getAvgRating';
import RatingStars from '../../common/RatingStars';

function CatalogCourseCard({course, height}) {

    const[avgRatingCount,setAvgRatingCount] = useState(null);

    useEffect(() => {
        const count = GetAvgRating(course?.ratingAndReviews);
        setAvgRatingCount(count);
    },[course]);

  return (
    <div className={`flex flex-col gap-2 text-white`}>
        <Link to={`/course/${course._id}`}>
            <div>
                <img src={course.thumbNail} alt={course.courseName} className={`${height} object-cover rounded-xl w-full `} />
            </div>
            <div className='flex flex-col items-start gap-2 mt-5'>
                <p className='text-richblack-25'>{course?.courseName}</p>
                <p className='text-sm text-richblack-300'>{course?.instructor?.firstName} {course?.instructor?.lastName}</p>
                <div className='flex items-center gap-x-2'>
                    <span className='text-yellow-25'>{avgRatingCount || 0}</span>
                    <RatingStars Review_Count={avgRatingCount} />
                    <span className='text-md text-richblack-200 flex items-center'>{course?.ratingAndReviews.length} Ratings</span>
                </div>
                <p>Rs. {course?.price}</p>
            </div>
        </Link>
    </div>
  )
}

export default CatalogCourseCard;
