"use client";

import React, { useState, useRef, useCallback } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowUp } from 'react-icons/fa';
import Link from 'next/link';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const newsPerPage = 2;

const fetchNews = async ({ pageParam = 1 }) => {
  try {
    const response = await fetch(`${apiUrl}/crypto-news?page=${pageParam}&limit=${newsPerPage}`);
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('News not found (404).');
      } else if (response.status === 500) {
        throw new Error('Internal server error (500).');
      } else {
        throw new Error('Failed to fetch news.');
      }
    }
    return await response.json();
  } catch (error) {
    throw new Error(`Error fetching data: ${error.message}`);
  }
};

const CryptoNews = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const observer = useRef();

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    isLoading,
    refetch, // Adding refetch for retry logic
  } = useInfiniteQuery({
    queryKey: ['cryptoNews'],
    queryFn: fetchNews,
    getNextPageParam: (lastPage, pages) => {
      return lastPage.length === newsPerPage ? pages.length + 1 : undefined;
    },
  });

  const lastNewsElementRef = useCallback(node => {
    if (isFetchingNextPage) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    });
    if (node) observer.current.observe(node);
  }, [isFetchingNextPage, hasNextPage, fetchNextPage]);

  React.useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6 my-32 text-center">
        <div className="loading-dots m-auto my-10">
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>
        <p>Loading crypto news...</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="max-w-4xl mx-auto p-6 my-32">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded" role="alert">
          <p className="font-bold">Error</p>
          <p>{error.message}</p>
        </div>
        <button
          onClick={() => refetch()} // Retrying fetch on button click
          className="bg-blue-500 flex justify-center mx-auto mt-3 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  const renderNewsItem = (item, index, isLastElement) => {
    const isLargeCard = index === 0 || index % 4 === 0;
    const cardClass = isLargeCard
      ? "rounded-lg bg-[#1a1a1a] p-6 md:col-span-2 lg:col-span-1 hover:bg-black/70 cursor-pointer"
      : "h-[350px] rounded-lg bg-[#f5f5f5] p-4 hover:bg-black hover:text-white cursor-pointer";

    return (
      <motion.div
        key={item._id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <Link
          href={`/crypto-news/${item.slug}`}
          ref={isLastElement ? lastNewsElementRef : null}
        >
          <div className={cardClass}>
            {isLargeCard ? (
              <div className="relative h-[300px] overflow-hidden rounded-lg">
                <img
                  src={item.imageLink}
                  alt={item.newsHeading}
                  className="h-full w-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h2 className="text-2xl font-bold bg-black bg-opacity-50 text-white">
                    {item.newsHeading}
                  </h2>
                  <p className="mt-2 text-white/80 bg-black bg-opacity-50">
                    {item.description}
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="flex h-[100px] items-center justify-center overflow-hidden rounded-lg">
                  <img
                    src={item.imageLink}
                    alt={item.newsHeading}
                    className="h-full w-full object-cover object-center"
                  />
                </div>
                <div className="mt-4 space-y-2">
                  <h3 className="text-lg font-medium">{item.newsHeading}</h3>
                  <p className="text-gray-500">{item.description}</p>
                </div>
              </>
            )}
          </div>
        </Link>
      </motion.div>
    );
  };

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 relative">
      <div className="mx-auto px-4">
        <h2 className="lg:text-[57px] text-2xl font-bold text-center py-10 mb-20 -mt-3 bg-gradient-to-r from-orange-600 to-blue-800 bg-clip-text text-transparent">
          Latest Cryptocurrency News & Insights
        </h2>
        
        <AnimatePresence>
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {data?.pages.map((page, i) => (
              <React.Fragment key={i}>
                {page.map((item, index) => renderNewsItem(item, index, page.length === index + 1 && i === data.pages.length - 1))}
              </React.Fragment>
            ))}
          </div>
        </AnimatePresence>
        {isFetchingNextPage && (
          <div className="loading-dots m-auto my-10">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
        )}
        {!hasNextPage && !isFetchingNextPage && data?.pages.length > 0 && (
          <p className="text-center mt-8">No more news to load.</p>
        )}
      </div>
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="sticky z-500 bottom-8 lg:left-[90%] left-[80%] bg-blue-500 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-300"
          aria-label="Back to Top"
        >
          <FaArrowUp />
        </button>
      )}
    </section>
  );
};

export default CryptoNews;
