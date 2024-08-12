import React from 'react'
import { Swiper,SwiperSlide } from 'swiper/react';
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import { Autoplay,Navigation } from "swiper/modules";
import CatalogCourseCard from './CatalogCourseCard';
 
function CourseSlider({courses}) {
  return (
    <div>
      {
        !courses.length ? (
          <div>No Course Found!</div>
        ) : (
          <Swiper
            slidesPerView={1}
            loop={true}
            spaceBetween={25}
            autoplay={{
              delay:2500,
              disableOnInteraction: false
            }}
            className='mySwiper'
            modules={[Autoplay,Navigation]}
            breakpoints={{
              1024:{slidesPerView:3},
              768:{slidesPerView:2},
              425:{slidesPerView:1}
            }}
          >
            {
              courses.map((course,index) => (
                <SwiperSlide key={index}>
                  <CatalogCourseCard course={course} height={"h-[250px]"} />
                </SwiperSlide>
              ))
            }
          </Swiper>
        ) 
      }
    </div>
  )
}

export default CourseSlider;
