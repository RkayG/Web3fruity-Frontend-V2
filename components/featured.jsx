"use client";

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { EffectCoverflow, Autoplay, Navigation, Pagination, A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FaArrowLeft, FaArrowRight, FaFire, FaChevronRight } from 'react-icons/fa';
import { GiWaterDrop } from 'react-icons/gi';
import Link from 'next/link';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import 'swiper/css/effect-coverflow';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const fetchAirdrops = async () => {
  const response = await fetch(`${apiUrl}/api/featured`);
  if (!response.ok) {
    throw new Error('Failed to fetch airdrops');
  }
  return response.json();
};

const FeaturedEventSkeleton = () => {
  return (
    <div className="px-4 md:px-8">
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        loop={true}
        breakpoints={{
          640: { slidesPerView: 1.3 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
      >
        {[1, 2, 3, 4, 5].map((index) => (
          <SwiperSlide key={index}>
            <div className="bg-gradient-to-br from-blue-800 to-orange-800 p-1 rounded-2xl shadow-lg animate-pulse">
              <div className="bg-gray-200 h-full rounded-2xl overflow-hidden">
                <div className="h-48 bg-gray-300 rounded-t-2xl"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-5/6 mb-4"></div>
                  <div className="flex items-center justify-between">
                    <div className="w-20 h-8 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full"></div>
                    <div className="w-24 h-6 bg-gray-300 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

const FeaturedEvent = () => {
  const { data: airdrops = [], isLoading } = useQuery({
    queryKey: ['featuredAirdrops'],
    queryFn: fetchAirdrops,
    staleTime: 1 * 60 * 60 * 1000, // Cache data for 1 hour
  });

  const breakpoints = {
    640: { slidesPerView: 1.3 },
    768: { slidesPerView: 2 },
    1024: { slidesPerView: 3 },
  };

  return (
    <section className='featured-airdrops my-20 m-auto max-w-[1580px]'>
      <div className="flex items-center justify-between mb-12 px-4 md:px-8">
        <h2 className="text-3xl md:text-4xl font-extrabold flex items-center">
          <FaFire className="text-orange-800 mr-4 text-4xl md:text-5xl" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-800 to-orange-800">
            Featured
          </span>
        </h2>
      </div>

      {isLoading ? (
        <FeaturedEventSkeleton />
      ) : (
        <div className="swiper-container px-4 md:px-8">
          <Swiper
            modules={[EffectCoverflow, Autoplay, Navigation, Pagination, A11y]}
            effect={'coverflow'}
            spaceBetween={50}
            grabCursor={true}
            breakpoints={breakpoints}
            centeredSlides={true}
            loop={true}
            pagination={{ el: '.swiper-pagination', clickable: true }}
            navigation={{ nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev', clickable: true }}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            coverflowEffect={{ rotate: 5, stretch: 0, depth: 100, modifier: 2, slideShadows: false }}
            className="swiper"
          >
            {airdrops.map((airdrop, index) => (
              <SwiperSlide key={index} className="swiper-slide">
                <Link href={airdrop.link}>
                <div className="bg-gradient-to-br cursor-pointer from-blue-800 to-orange-800 p-1 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 group">
                  <div className="bg-gray-200 h-full rounded-2xl overflow-hidden">
                    <div className="relative">
                      <img src={airdrop.bannerImageUrl} alt={airdrop.bannerHeading} className="w-full h-48 object-cover" />
                    </div>
                    <div className="p-6">
                      <h2 className="text-xl font-bold text-blue-800 mb-2">{airdrop.bannerHeading}</h2>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{airdrop.headingDescription}</p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span className="flex items-center bg-gradient-to-r from-pink-500 to-orange-500 rounded-full px-3 py-1 shadow-lg hover:shadow-xl transition-all duration-300 group">
                          <GiWaterDrop className="mr-2 text-pink-200 group-hover:text-pink-100 animate-bounce" />
                          <p className='text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-pink-200 font-extrabold text-lg group-hover:text-white transition-colors duration-300'>
                            Juicy
                          </p>
                        </span>
                         <Link href={airdrop.link}>
                          <button className="flex items-center text-blue-800 hover:text-orange-800 transition-colors duration-300">
                            Learn More <FaChevronRight className="ml-1" />
                          </button>
                        </Link>
      
                      </div>
                    </div>
                  </div>
                </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="slider-controler mt-16 hidden lg:block">
            <div className="swiper-button-prev slider-arrow">
              <FaArrowLeft className="text-blue-800 text-lg p-1 hidden lg:block hover:text-white transition-colors duration-300" />
            </div>
            <div className="swiper-button-next slider-arrow">
              <FaArrowRight className="text-blue-800 text-lg p-1 hidden lg:block hover:text-white transition-colors duration-300" />
            </div>
            <div className="swiper-pagination"></div>
          </div>
        </div>
      )}
    </section>
  );
};

export default FeaturedEvent;
