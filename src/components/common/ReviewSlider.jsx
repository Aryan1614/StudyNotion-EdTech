import React, { useEffect, useState } from 'react';
import { Swiper,SwiperSlide } from 'swiper/react';
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import { Autoplay,Navigation,FreeMode,Pagination } from "swiper/modules";
import ReactStars from 'react-stars';
import { getAllRatings } from '../../services/operations/courseDetailsAPI';
import { IoStarOutline,IoStar } from 'react-icons/io5';


function ReviewSlider() {

    const[reviews,setReviews] = useState([]);
    const TRUNCATE_WORDS = 15;

    useEffect(() =>{
        const fetchRatings = async() => {
            const response = await getAllRatings();
            // console.log(response);
            if(response){
                setReviews(response);
            }
        }
        fetchRatings();
    },[]);

  return (
    <div className='text-white'>
        <div className='h-[190px] max-w-maxContent mt-4'>
            <Swiper 
                slidesPerView={4}
                spaceBetween={24}
                loop={true}
                freeMode={true}
                autoplay={{
                    delay: 2500
                }}
                modules={[FreeMode,Pagination,Autoplay]}
            >
                {
                    reviews.map((review,index) => (
                        <SwiperSlide key={index} className=''>
                            <img src={review?.user?.image ? review?.user?.image : `https://api.dicebear.com/5.x/initials/svg?seed=${review?.user?.firstName} ${review?.user?.lastName}` } alt='profile-pic' className='h-9 w-9 rounded-full object-cover' />
                            <p>{review?.user?.firstName} {review?.user?.lastName}</p>
                            <p>{review?.course?.courseName}</p>
                            <p>
                                {review?.review}
                            </p>
                            <div className='flex flex-row items-center gap-x-2'>
                                <p>{review?.rating.toFixed(1)}</p>
                                <ReactStars 
                                    count={5}
                                    value={review.rating}
                                    size={20}
                                    edit={false}
                                    activeColor={"#ffd700"}
                                    emptyIcon={<IoStarOutline />}
                                    fullIcon={<IoStar />}
                                />
                            </div>
                        </SwiperSlide>
                    ))
                }
            </Swiper>
        </div>
    </div>
  )
}

export default ReviewSlider;
