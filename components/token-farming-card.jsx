"use client";

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { FaCoins, FaChevronRight, FaTelegramPlane, FaWallet, FaExternalLinkAlt } from 'react-icons/fa';
import Link from 'next/link';
import { motion } from 'framer-motion';
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const TokenFarmingSkeleton = () => {
  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mx-3 lg:px-6">
      {[...Array(6)].map((_, index) => (
        <div key={index} className="rounded-lg bg-white shadow-md overflow-hidden border border-gray-300 animate-pulse">
          <div className="h-32 bg-gradient-to-bl from-blue-800 to-burgundy flex items-center justify-center">
            <div className="h-8 w-40 bg-white opacity-50 rounded"></div>
          </div>
          <div className="relative">
            <div className="w-24 h-24 rounded-full absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-4 border-white shadow-md bg-gray-300"></div>
          </div>
          <div className="pt-16 pb-6 px-6">
            <div className="flex justify-between items-center mb-4">
              <div className="h-4 w-20 bg-gray-300 rounded"></div>
              <div className="h-6 w-24 bg-orange-100 rounded-full"></div>
            </div>
            <div className="mb-4">
              <div className="h-4 w-24 bg-gray-300 rounded mb-2"></div>
              <div className="h-6 w-40 bg-gray-300 rounded"></div>
            </div>
            <div className="mb-4">
              <div className="h-4 w-24 bg-gray-300 rounded mb-2"></div>
              <div className="h-6 w-32 bg-gray-300 rounded"></div>
            </div>
            <div className="flex justify-end">
              <div className="h-10 w-24 bg-blue-600 rounded-full"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const fetchTokens = async () => {
  const response = await fetch(`${apiUrl}/farm-tokens`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const TokenFarming = () => {
  const { data: tokens = [], isLoading } = useQuery({
    queryKey: ['farmTokens'],
    queryFn: fetchTokens,
  });

  const blockchains = [...new Set(tokens.map(token => token.blockchain))];
  const [selectedBlockchain, setSelectedBlockchain] = useState('');
  const filteredTokens = selectedBlockchain
    ? tokens.filter(token => token.blockchain === selectedBlockchain).slice(0, 6)
    : tokens.slice(0, 6);

  const handleFilterChange = (blockchain) => {
    setSelectedBlockchain(blockchain);
  };

  return (
    <section className="py-12 md:py-24 lg:py-32 max-w-[1580px] m-auto bg-gray-200">
      <motion.h2 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl md:text-4xl font-extrabold flex items-center px-4 md:px-8"
      >
        <FaCoins className="text-orange-800 mr-4 text-4xl md:text-5xl" />
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-800 to-orange-800">
          Token Farming
        </span>
      </motion.h2>
      <p className='text-gray-500  mb-10 text-xl mt-3 px-4 md:px-8'>Farm, mine, and accumulate tokens for free or through staking</p>

      {isLoading ? (
        <TokenFarmingSkeleton />
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mx-3 lg:px-6">
          {filteredTokens.map((token, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ }}
              className="rounded-lg bg-white shadow-md transition-all duration-300 hover:-translate-y-2 overflow-hidden hover:shadow-lg border border-gray-300"
            >
              <div className="h-32 bg-gradient-to-bl from-blue-800 to-burgundy flex items-center justify-center">
                <h3 className="text-2xl text-white font-bold">{token.tokenName}</h3>
              </div>
              <div className="relative">
                <img src={token.logo} className="w-24 h-24 rounded-full absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-4 border-white shadow-md" alt={token.tokenName} />
              </div>
              <div className="pt-16 pb-6 px-6">
                <div className="flex justify-between items-center mb-4 text-sm">
                  <span className="text-gray-600">Platform:</span>
                  <a href={token.linkToFarmingPlatform}>
                    <span className="bg-orange-100 hover:bg-orange-900 hover:text-white flex flex-wrap cursor-pointer text-orange-800 px-3 py-1 rounded-full">
                      {token.platform || 'N/A'}
                      <FaExternalLinkAlt className='mt-1 ml-2' />
                    </span>
                  </a>
                </div>
                <div className="mb-4">
                  <p className="text-gray-600">Requirements:</p>
                  <p className="font-semibold ">{token.requirements ? token.requirements : ''}</p>
                </div>
                <div className="mb-4">
                  <p className="text-gray-600">Farming Type:</p>
                  <p className="font-semibold ">{token.stakeToFarm == 'stake' ? 'Stake to Farm' : 'Free Farming'}</p>
                </div>
                <Link
                  href={`/token-farming/${token.slug}`} 
                  className="flex right-4 items-center w-fit float-right mb-4 bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors duration-300"
                >
                  Guide
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Link href="/token-farming">
        <motion.span 
          whileHover={{ x: 10 }}
          className="text-blue-800 hover:text-orange-800 flex justify-center w-[95%] mx-auto items-center cursor-pointer text-lg mt-16 font-semibold transition-colors duration-300"
        >
          Explore Token Farming <FaChevronRight className="ml-2" />
        </motion.span>
      </Link>
    </section> 
  );
};

export default TokenFarming;
