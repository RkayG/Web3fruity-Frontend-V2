"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FaAngleUp, FaAngleDown } from 'react-icons/fa';
import Link from 'next/link';
import { motion } from "framer-motion";
import BottomSubscribe from "@/components/bottom-subscribe";
import SEO from "@/components/SEO";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const fetchRewardData = async (api_id) => {
  const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${api_id}`);
  return response.data;
};

const RewardTooltip = ({ reward }) => {
  const { data: tokenData, isLoading, isError } = useQuery({
    queryKey: ['tokenData', reward.api_id],
    queryFn: () => fetchRewardData(reward.api_id),
    staleTime: 10 * 60 * 1000, // Cache expiry time set to 10 minutes
  });

  return (
    <div className="absolute bg-white p-4 rounded-md shadow-md border border-gray-300 ml-52 mt-8" style={{ width: "265px" }}>
      {isLoading ? (
        <p>Loading token data...</p>
      ) : isError ? (
        <p className="text-red-600">Error fetching token data</p>
      ) : (
        <>
          <span className="flex flex-wrap">
            <img src={reward.logo} alt="" className="w-8 h-8 rounded-sm mb-2" />
            <p className="pl-4 font-bold">${reward.token}</p>
          </span>
          {tokenData && (
            <>
              <div className="flex flex-wrap text-black">
                <p className="pr-16 ">Price:</p>
                <p className="text-left">${tokenData.market_data.current_price.usd}</p>
              </div>
              <div className="flex flex-wrap  text-black">
                <p className="pr-4">Market Cap:</p>
                <p className="text-right">${tokenData.market_data.market_cap.usd.toLocaleString()}</p>
              </div>
              <p className="text-[green] text-left text-sm mt-2">Coingecko</p>
            </>
          )}
        </>
      )}
    </div>
  );
};

const fetchRewards = async () => {
  const response = await axios.get(`${apiUrl}/reward-tasks`);
  return response.data;
};

const RewardForTask = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const rewardsPerPage = 12;
  const [tooltipData, setTooltipData] = useState(null);
  const [isTooltipOpen, setIsTooltipOpen] = useState([]);

  const { data: rewards = [], isLoading, isError, error } = useQuery({
    queryKey: ['rewards'],
    queryFn: fetchRewards,
    staleTime: 30 * 24 * 60 * 60 * 1000, // Cache expiry time set to 30 days
  });

  const indexOfLastReward = currentPage * rewardsPerPage;
  const indexOfFirstReward = indexOfLastReward - rewardsPerPage;
  const currentRewards = rewards.slice(indexOfFirstReward, indexOfLastReward);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (isError) {
    return (
      <div className="max-w-4xl mx-auto p-6 my-32">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded" role="alert">
          <p className="font-bold">Error</p>
          <p>{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <>
       <SEO 
            title="Complete Tasks, Earn Rewards"
            description="Find and join multiple task-based rewards platforms."
            keywords='web3 reward platforms, web3 marketing'
            siteUrl="https://www.web3fruity.com/platforms"
        />
   
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className=" w-full h-auto max-w-[1920px] m-auto"
    >
      {isLoading ? (
        <div className="loading-dots m-auto my-28">
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>
      ) : (
        <div>
         
          <motion.section 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="relative w-full h-[50vh] min-h-[300px] mb-6 flex items-center justify-center bg-cover bg-center bg-[url('/images/academy.jpg')]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[rgba(210,143,143,0.7)] to-[rgba(0,0,0,0.63)]" />
            <div className="relative z-10 text-center text-white max-w-3xl px-4 sm:px-6 lg:px-8">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 animate-pulse">Complete Tasks, Earn Rewards</h1>
              <p className="text-lg sm:text-xl md:text-2xl mb-8 text-[white]">
                Find and join multiple task-based rewards platforms.
              </p>
            </div>
          </motion.section>

          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-gradient-to-r from-red-100 to-blue-100 p-8 rounded-lg shadow-lg m-6 mb-20"
          >
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Explore Reward Opportunities</h2>
            <p className="text-gray-700 leading-relaxed">
              Several platforms offer rewards for completing various tasks, including taking surveys, watching videos, playing games, testing apps, participating in online studies, and more.
              However, finding the legitimate and rewarding ones can be challenging. That&apos;s why we&apos;ve curated a comprehensive list of the most reliable rewards-for-tasks platforms available.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              For many of these reward-for-tasks platforms, the basic requirements include having a wallet address for receiving rewards and social accounts, such as Twitter, Telegram, Discord, and the likes.
            </p>
            <p className="text-gray-800 font-semibold mt-6">
              Explore our curated list below to start earning rewards today!
            </p>
          </motion.div>

          <div className="mx-6 text-center relative mb-28 ">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center relative mb-28"
            >
              <div className="mr-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                {currentRewards.map((reward, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-md shadow-md p-4 border border-gray-300 hover:shadow-lg transition-shadow duration-300"
                  >
                    <span className="flex flex-wrap">
                      <img src={reward.logo} alt="" className="w-10 h-10 mx-3 rounded-lg mb-2" />
                      <h3 className="text-lg font-semibold mt-1 text-blue-700">{reward.title}</h3>
                    </span>
                    <p className="text-sm w-auto text-left p-2 pl-3 h-20">{reward.activities}</p>
                    <span className="flex bg-gray-200 rounded-lg h-20 m-3 border border-gray-400 justify-center">
                      <span className="block p-3 m-auto">
                        <p>Token</p>
                        <p className="font-semibold text-blue-700 flex flex-wrap justify-center cursor-pointer"
                          onMouseEnter={(event) => {
                            const newIsTooltipOpen = [...isTooltipOpen];
                            newIsTooltipOpen[index] = !newIsTooltipOpen[index];
                            setIsTooltipOpen(newIsTooltipOpen);
                            setTooltipData(reward);
                            event.stopPropagation();
                          }}
                          onClick={(event) => {
                            const newIsTooltipOpen = [...isTooltipOpen];
                            newIsTooltipOpen[index] = !newIsTooltipOpen[index];
                            setIsTooltipOpen(newIsTooltipOpen);
                            setTooltipData(reward);
                            event.stopPropagation();
                          }}
                          onMouseLeave={() => {
                            setTooltipData(null);
                            const newIsTooltipOpen = [...isTooltipOpen];
                            newIsTooltipOpen[index] = false;
                            setIsTooltipOpen(newIsTooltipOpen);
                          }}
                        >
                          {reward.token}
                          { reward.token ? (
                            <p className="text-xs pl-1 mt-2">
                              {isTooltipOpen[index] ? <FaAngleUp /> : <FaAngleDown />}
                            </p>
                          ) : (
                            <p className="text-xs pl-1 mt-2">-</p>
                          )}
                          {isTooltipOpen[index] && <RewardTooltip reward={reward} />}
                        </p>
                      </span>
                      <span className="block p-3 m-auto">
                        <p>Free</p>
                        <p className="font-semibold text-green-700">{reward.free}</p>
                      </span>
                      <span className="block p-3 m-auto">
                        <p>Active</p>
                        <p className="font-semibold text-green-700">{reward.active}</p>
                      </span>
                    </span>
                    <a href={reward.website}>
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className='py-2 px-10 m-auto mt-6 flex bg-blue-700 text-white active:bg-black checked:bg-black rounded-3xl shadow-md hover:bg-blue-600 transition-colors duration-300'
                      >
                        Visit
                      </motion.button>
                    </a>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            {/* Pagination controls */}
            <div className="flex justify-center mt-4">
              {Array.from({ length: Math.ceil(rewards.length / rewardsPerPage) }, (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => paginate(index + 1)}
                  className={`px-4 py-2 mx-1 rounded-md ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-blue-900'} hover:bg-blue-500 hover:text-white`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>

          <BottomSubscribe />
        </div>
      )}
    </motion.div>
    </>
  );
};

export default RewardForTask;