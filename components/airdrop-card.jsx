"use client";

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { FaParachuteBox, FaChevronRight, FaCalendarAlt, FaLink, FaCoins, FaPercentage } from 'react-icons/fa';
import { motion } from 'framer-motion';
import axios from 'axios';
import { isActive } from '@/utils';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const AirdropsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 md:px-8">
      {[...Array(6)].map((_, index) => (
        <div key={index} className="bg-gradient-to-br from-blue-800 to-orange-800 p-1 rounded-2xl shadow-lg">
          <div className="bg-white h-full rounded-2xl p-6">
            <div className="relative mb-6">
              <div className="w-20 h-20 rounded-full mx-auto bg-gray-300 animate-pulse"></div>
              <div className="absolute top-0 right-0 bg-gray-300 h-6 w-20 rounded-full animate-pulse"></div>
            </div>
            <div className="h-8 bg-gray-300 rounded w-3/4 mx-auto mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto mb-4 animate-pulse"></div>
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="h-4 bg-gray-300 rounded w-1/3 animate-pulse"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/4 animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-gradient-to-r from-gray-900 to-orange-800 p-4 rounded-b-2xl flex justify-between items-center">
            <div className="h-6 bg-gray-300 rounded w-1/3 animate-pulse"></div>
            <div className="h-6 bg-gray-300 rounded-full w-6 animate-pulse"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

const fetchAirdrops = async () => {
  const { data } = await axios.get(`${apiUrl}/airdrops`, {
    params: { limit: 6, page: 1 },
  });
  return data.airdrops;
};

const Airdrops = () => {
  const { data: airdrops = [], isLoading, isError } = useQuery({
    queryKey: ['airdrops'],
    queryFn: fetchAirdrops,
    staleTime: 1 * 24 * 60 * 60 * 1000, // 1 day
    cacheTime: 1 * 24 * 60 * 60 * 1000, // 1 day
  });

  if (isError) {
    return <p>Error fetching airdrops.</p>;
  }

  return (
    <div className="my-20 max-w-[1580px] mx-auto">
      <div className=" items-center justify-between mb-12 px-4 md:px-8">
        <h2 className="text-3xl md:text-4xl font-extrabold flex items-center">
          <FaParachuteBox className="text-orange-800 mr-4 text-4xl md:text-5xl" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-800 to-orange-800">
            Hot Airdrops
          </span>
        </h2>
        <p className='text-gray-500 px-2  text-xl mt-3'>Explore latest airdrops and never miss an opportunity to earn free tokens</p>
      </div>

      {isLoading ? (
        <AirdropsSkeleton />
      ) : (
        <section>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 px-4 sm:px-6 lg:px-8">
            {airdrops.map((airdrop) => (
              <Link key={airdrop._id} href={`/airdrops/${airdrop.slug}`}>
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
            ))}
          </div>
          <Link href="/airdrops" className="flex justify-center mx-auto mt-12">
            <motion.span
              whileHover={{ x: 10 }}
              className="text-blue-600 hover:text-orange-600 flex  mx-auto items-center cursor-pointer text-lg mt-16 font-semibold transition-colors duration-300"
            >
              Explore Airdrops <FaChevronRight className="ml-2" />
            </motion.span>
          </Link>
        </section>
      )}
    </div>
  );
};

export default Airdrops;
