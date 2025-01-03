"use client";

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Link from 'next/link';
import { FaLink, FaCoins, FaPercentage, FaCalendarAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Disclaimer from '@/components/disclaimer';
import ScrollBackTop from '@/components/scroll-back-top';
import BottomSubscribe from '@/components/bottom-subscribe';
import { isActive } from '@/utils';
import SEO from '@/components/SEO';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const fetchAirdrops = async ({ queryKey }) => {
  const [_, page] = queryKey;
  const response = await axios.get(`${apiUrl}/airdrops`, {
    params: { limit: 10, page },
  });
  return response.data;
};

const Airdrops = () => {
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useQuery({
    queryKey: ['airdrops', page],
    queryFn: fetchAirdrops,
    keepPreviousData: true,
    staleTime: 1 * 24 * 60 * 60 * 1000, // 1 day
  });
  

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= (data?.totalPages || 1)) {
      setPage(newPage);
    }
  };

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6 my-32">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded" role="alert">
          <p className="font-bold">Error</p>
          <p>{error.message || 'An error occurred while fetching data. Please check your internet connection.'}</p>
        </div>
      </div>
    );
  }

  return (
    <>
    <SEO 
          title="Discover Latest Airdrops"
          description="Earn free tokens by participating in our curated airdrop selections"
          keywords='airdrops, free crypto, cryptocurrency, crypto rewards, telegram airdrops'
          logoUrl="/images/airdrops1.jpg"
          siteUrl="https://www.web3fruity.com/airdrops"
      />    
   
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className=' m-auto max-w-[1580px]'
    >
      <section className="relative w-full h-[60vh] min-h-[400px] mb-12 flex items-center justify-center bg-cover bg-center bg-[url('/images/airdrops1.jpg')]">
        <div className="absolute inset-0 bg-gradient-to-r from-[rgba(0,0,0,0.7)] to-[rgba(0,0,0,0.4)]" />
        <motion.div
          className="relative z-10 text-center text-white max-w-3xl px-4 sm:px-6 lg:px-8"
        >
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 shadow-text">Discover Airdrop Pools</h1>
          <p className="text-xl sm:text-2xl md:text-3xl mb-10 shadow-text">
            Earn free tokens by participating in our curated airdrop selections
          </p>
          <Link
            href="academy/cryptocurrency-airdrops-a-guide-to-maximizing-your-earnings"
            className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-yellow-400 to-yellow-600 text-gray-900 text-lg font-bold rounded-full hover:from-yellow-500 hover:to-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 transition-all duration-300"
            prefetch={false}
          >
            Learn More About Airdrops
          </Link>
        </motion.div>
      </section>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="loader"></div>
        </div>
      ) : (
        <>
          <motion.div
            className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 px-4 sm:px-6 lg:px-8"
          >
             {data?.airdrops.map((airdrop) => (
              <motion.div
                key={airdrop._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{  delay: 0.2 }}
                className="  transition-all duration-300 hover:-translate-y-2"
              >
                <Link href={`/airdrops/${airdrop.slug}`}>
                 <div key={airdrop._id} className="group bg-gradient-to-br cursor-pointer from-blue-800 to-orange-800 p-1 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                    <div className="bg-white h-full rounded-2xl p-6 transition-all duration-300 group-hover:bg-gray-100">
                      <div className="relative mb-6">
                        <img src={airdrop.logo} className="w-20 h-20 rounded-full mx-auto shadow-md" alt={airdrop.title} />
                        <div className="absolute top-0 right-0 bg-orange-800 text-gray-200 text-xs font-semibold py-1 px-3 rounded-full">
                          {airdrop.platformType}
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold text-center mb-2 text-blue-800">{airdrop.title}</h3>
                      <p className="text-sm text-center text-gray-600 mb-4">{airdrop.chain}</p>
                      <div className="space-y-3 text-sm">
                        <p className="flex items-center justify-between">
                          <span className="flex items-center text-gray-600"><FaCoins className="mr-2 text-orange-800" /> Total Pool:</span>
                          <span className="font-semibold text-blue-800">{airdrop.rewardPool || 'N/A'}</span>
                        </p>
                        <p className="flex items-center justify-between">
                          <span className="flex items-center text-gray-600"><FaPercentage className="mr-2 text-orange-800" /> % of Supply:</span>
                          <span className="font-semibold text-blue-800">{airdrop.rewardPercentFromSupply || 'N/A'}</span>
                        </p>
                        <p className="flex items-center justify-between">
                          <span className="flex items-center text-gray-600"><FaCalendarAlt className="mr-2 text-orange-800" /> End Date:</span>
                          <span className="font-semibold text-blue-800">{airdrop.endDate && isActive(airdrop.endDate) || 'N/A'}</span>
                        </p>
                      </div>
                    </div>
                    <Link href={`/airdrops/${airdrop.slug}`}>
                      <div className="bg-gradient-to-r from-gray-900 to-orange-800 text-gray-200 p-4 rounded-b-2xl flex justify-between items-center cursor-pointer hover:from-orange-800 hover:to-blue-800 transition-all duration-300">
                        <span className="font-semibold">View Details</span>
                        <FaLink />
                      </div>
                    </Link>
                 </div>
                 </Link>
               </motion.div>
            ))}
          </motion.div>
          <ScrollBackTop />
          <div className="flex justify-center mt-12 mb-32">
          <Pagination currentPage={page} totalPages={data?.totalPages || 1} onPageChange={handlePageChange} />
          </div>
        </>
      )}
      
      <Disclaimer />
      <BottomSubscribe />
    </motion.div>
    </>
  );
};

const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-center">
    <div className="text-blue-500 mr-2">{icon}</div>
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-semibold text-gray-800">{value}</p>
    </div>
  </div>
);

const Pagination = ({ currentPage, totalPages, onPageChange }) => (
  <div className="flex space-x-2">
    <button
      onClick={() => onPageChange(currentPage - 1)}
      disabled={currentPage === 1}
      className="mr-2 px-4 py-2 bg-blue-600 text-white rounded-full disabled:opacity-50"
      >
         <FaChevronLeft />
    </button>
    {[...Array(totalPages)].map((_, i) => (
      <button
        key={i}
        onClick={() => onPageChange(i + 1)}
        className={`px-4 py-2 rounded-md ${
          currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
        }`}
      >
        {i + 1}
      </button>
    ))}
    <button
      onClick={() => onPageChange(currentPage + 1)}
      disabled={currentPage === totalPages}
      className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-full disabled:opacity-50"
      >
        <FaChevronRight />
    </button>
  </div>
);

export default Airdrops;