'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FaShip, FaBookReader, FaSearch, FaCaretDown, FaArrowUp } from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Close from '@/components/close';
import ScrollBackTop from '@/components/scroll-back-top';
import { formatTimestamp } from '@/utils.js';
import SEO from '@/components/SEO';
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// Custom hook to fetch articles using React Query
const useFetchArticles = () => {
  return useQuery({
    queryKey: ['academyArticles'],
    queryFn: async () => {
      const response = await axios.get(`${apiUrl}/academy`);
      return response.data;
    },
    staleTime: 30 * 24 * 60 * 60 * 1000, // Cache the data for 30 days
  });
};

const Academy = () => {
  const { data: articles = [], isLoading, isError, error } = useFetchArticles();
  const [categories, setCategories] = useState(['All']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTrack, setSelectedTrack] = useState('Any');
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  const tracks = ['Any', 'Beginner', 'Intermediate', 'Advanced'];
  const topics = ['All', 'Blockchain', 'DeFi', 'NFTs', 'TON', 'Cryptocurrency', 'Trading', 'Altcoin', 'Bitcoin', 'Staking'];

  // Filter articles based on category, track, and topic
  const filterArticles = () => {
    return articles.filter(article => (
      (selectedCategory === 'All' || article.category === selectedCategory) &&
      (selectedTrack === 'Any' || article.track === selectedTrack) &&
      (selectedTopic === 'All' || article.tags.includes(selectedTopic)) &&
      (searchQuery === '' || article.postHeading.toLowerCase().includes(searchQuery.toLowerCase()))
    ));
  };

  // Update categories when articles data is available
  if (articles.length && categories.length === 1) {
    setCategories(['All', ...new Set(articles.map(article => article.category))]);
  }

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setSearchResults([]);
      return;
    }

    const filtered = articles.filter(article =>
      article.postHeading.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(filtered);
  };

  // clear search bar
  const clearSearchResults = () => {
    setSearchResults([]);
    setSearchQuery('');
  };

  // dropdown toggle for topics
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const filteredArticles = filterArticles();

  // ====== scroll back up button functionality =============
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
  // ============== scroll back up end =========================


  return (
    <>
    <SEO 
        title="A beginner's guide to cryptocurrency."
        description='Dive into topics that spark your interest, from Blockchain to DeFi, NFTs to Cryptocurrency, and beyond.'
        keywords='crypto education, blockchain, deFi, cryptocurrency, trading, altcoin, bitcoin, staking'
        author='Rufus Gladness'
        siteUrl={`https://www.web3fruity.com/academy`}
      />
    
    <section className="w-full pb-32 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="py-24 text-center">
          <h1 className="text-5xl lg:text-7xl font-extrabold mb-6 bg-gradient-to-r from-orange-600 to-blue-800 bg-clip-text text-transparent">
            Crypto Education Hub
          </h1>
          <p className='text-xl text-gray-600 max-w-3xl mx-auto mb-12'>
              Dive into topics that spark your interest, from Blockchain to DeFi, NFTs to Cryptocurrency, and beyond.
          </p>
          <div className="relative max-w-2xl mx-auto">
            <input
              type="text"
              className="w-full p-4 pl-12 pr-10 rounded-full border-2 border-gray-300 focus:border-blue-500 focus:outline-none transition duration-300"
              placeholder="Search for a topic..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            {searchQuery && (
              <button
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={clearSearchResults}
              >
                <Close />
              </button>
            )}
          </div>
          {searchResults.length > 0 && (
                <div className="relative top-full text-left left-0 right-0 bg-white rounded-b-lg max-w-2xl mx-auto border border-t-0 border-gray-300 shadow-lg py-2 px-4">
                  {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for &apos;{searchQuery}&apos;:
                  <ul className="mt-2">
                    {searchResults.map(result => (
                      <li key={result._id} className="hover:bg-gray-100 rounded-lg py-1 px-2 cursor-pointer">
                        <Link href={`/academy/${result.slug}`}>
                          {result.postHeading}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
        </div>

        <div className="mb-16">
          <div className="bg-blue-100 rounded-2xl p-8 shadow-lg">
            <h2 className="text-3xl font-bold text-blue-800 mb-6 text-center">Choose Your Learning Path</h2>
            <div className="flex flex-wrap justify-center gap-4">
              {tracks.map(track => (
                <button
                  key={track}
                  className={`py-2 px-6 rounded-full text-lg font-semibold transition duration-300 ${
                    selectedTrack === track 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'bg-white text-blue-600 hover:bg-blue-50'
                  }`}
                  onClick={() => setSelectedTrack(track)}
                >
                  {track}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-16">
          <div className="bg-orange-100 rounded-2xl p-8 shadow-lg">
            <h2 className="text-3xl font-bold text-orange-800 mb-6 text-center">Explore Topics</h2>
            <div className="relative">
              <button
                className="w-full p-4 text-left bg-white rounded-lg shadow flex justify-between items-center"
                onClick={toggleDropdown}
              >
                <span className="font-semibold">{selectedTopic}</span>
                <FaCaretDown className={`transition duration-300 ${isDropdownOpen ? 'transform rotate-180' : ''}`} />
              </button>
              {isDropdownOpen && (
                <div className="absolute z-10 w-full mt-2 bg-white rounded-lg shadow-lg">
                  {topics.map(topic => (
                    <button
                      key={topic}
                      className={`w-full p-4 text-left hover:bg-orange-50 transition duration-300 ${
                        selectedTopic === topic ? 'bg-orange-100 font-semibold' : ''
                      }`}
                      onClick={() => {
                        setSelectedTopic(topic);
                        setIsDropdownOpen(false);
                      }}
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <h2 className="text-4xl font-bold text-center mb-16">
          <span className="bg-gradient-to-r from-orange-600 to-blue-800 bg-clip-text text-transparent">
            Begin Your Learning Journey
          </span>
          <FaShip className="inline-block ml-4 text-orange-600" />
        </h2>

        {isError && <p className='text-center font-semibold text-red-600'>{error.message}</p>}
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="loader"></div>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredArticles.map(article => (
              <Link href={`/academy/${article.slug}`} key={article._id}>
                <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 transform hover:-translate-y-1">
                  <div className="relative h-48">
                    <img src={article.imageLink} alt={article.postHeading} className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-xl font-bold text-white">{article.postHeading}</h3>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className='text-sm text-gray-500 mb-2'>{formatTimestamp(article.timestamp)}</p>
                    <p className="text-gray-600 mb-4">{article.description}</p>
                    <div className='flex justify-between items-center'>
                      <span className='flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-lg'>
                        <FaBookReader className='mr-2'/>
                        {article.track}
                      </span>
                      {/* <FaShare className='text-orange-600 hover:text-orange-700 cursor-pointer'/> */}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      <ScrollBackTop />
    </section>
    </>
  );
};

export default Academy;
