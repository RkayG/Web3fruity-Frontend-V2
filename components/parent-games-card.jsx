"use client";

import React from "react";
import { FaGamepad, FaChevronRight } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import Link from "next/link";
import GameCard from "./game-card";
import { motion } from "framer-motion";
import { useQuery } from '@tanstack/react-query';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const GameCardSkeleton = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-12 overflow-hidden m-auto mb-4 transition-shadow duration-300"
      style={{ width: "100%" }}
    >
      <div className="bg-white rounded-lg shadow-md overflow-hidden m-auto lg:p-8 mb-4 border-2 border-gray-200" style={{ width: "95%" }}>
        <div className="flex">
          <div className="w-24 h-24 lg:w-40 lg:h-40 bg-gray-200 rounded-2xl m-4 lg:m-0 lg:rounded-md lg:mr-6 animate-pulse"></div>
          <div className="ml-4 flex-1">
            <div className="title-and-view-button-container flex">
              <div className="w-48 h-8 mt-4 lg:mt-0 bg-gray-200 rounded animate-pulse"></div>
              <div className="hidden lg:block lg:static lg:ml-20 w-20 h-8 bg-gray-200 rounded-full animate-pulse"></div>
            </div>

            <div className="flex items-center mt-2">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="w-6 h-6 mr-3 mb-2 bg-gray-200 rounded-full animate-pulse"></div>
              ))}
            </div>
            <div className="w-40 h-4 mt-2 bg-gray-200 rounded animate-pulse"></div>
            <div className="mt-2 w-3/4 mb-2 lg:w-2/4 h-20 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
        
        <div className="overflow-x-auto w-auto pt-6 pl-6 lg:mb-4 rounded-t-none rounded-b-md lg:rounded-md shadow-md bg-gray-100">
          <div className="lg:flex lg:flex-wrap lg:justify-center inline-flex" style={{ maxHeight: "150px", overflowY: "auto" }}>
            {[...Array(5)].map((_, index) => (
              <div key={index} className="bg-gray-200 px-4 py-2 mr-6 mb-6 w-36 h-20 rounded-md shadow-md animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Games = () => {
  const router = useRouter();

  // Use React Query to fetch and cache the data
  const { data: games = [], isLoading } = useQuery({
    queryKey: ['games'],
    queryFn: async () => {
      const response = await fetch(`${apiUrl}/games`);
      if (!response.ok) {
        throw new Error('Failed to fetch games.');
      }
      return response.json();
    },
    cacheTime: 5 * 60 * 1000, // Cache data for 5 minutes
  });

  const handleNavigateToGames = () => {
    router.push('/games');
  };

  return (
    <div className="mb-20 max-w-[1580px] pt-12 m-auto">
        <h2 className="text-3xl md:text-4xl  font-extrabold flex items-center mb-12 px-4 md:px-8">
            <FaGamepad className="text-orange-800 mr-4 text-4xl md:text-5xl" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-800 to-orange-800">
              Play to Earn
            </span>
        </h2>
        {isLoading 
          ? [...Array(5)].map((_, index) => <GameCardSkeleton key={index} />)
          : games.map(game => <GameCard key={game.id} game={game} />)
        }
      
        <Link href="/games" className='flex justify-center mx-auto'>
           <motion.span 
              whileHover={{ x: 10 }}
              className="text-blue-600 hover:text-orange-600 flex  mx-auto items-center cursor-pointer text-lg mt-12 font-semibold transition-colors duration-300"
            >
              Explore Games <FaChevronRight className="ml-2" />
            </motion.span>
         </Link>
    </div>
  );
};

export default Games;
