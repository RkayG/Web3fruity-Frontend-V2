"use client";

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import BottomSubscribe from '@/components/bottom-subscribe';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const fetchSearchResults = async (query) => {
  const response = await axios.get(`${apiUrl}/search`, { params: { query } });
  return response.data;
};

const SearchResultsContent = () => {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('query');

  const { data: results, isLoading, error } = useQuery({
    queryKey: ['searchResults', searchQuery],
    queryFn: () => fetchSearchResults(searchQuery),
    enabled: !!searchQuery, // only run query if there's a search query
    cacheTime: 7 * 24 * 60 * 60 * 1000, // cache results for 7 days
    staleTime: 7 * 24 * 60 * 60 * 1000, // data is considered fresh for 7 days
  });

  const categories = [
    { name: 'Airdrops', key: 'airdrops', itemKey: 'title', linkPrefix: '/airdrops/' },
    { name: 'Games', key: 'games', itemKey: 'title', linkPrefix: '/games/' },
    { name: 'Farming', key: 'tokenFarming', itemKey: 'tokenName', linkPrefix: '/token-farming/' },
    /* { name: 'Platforms', key: 'platforms', itemKey: 'title', linkPrefix: '/platforms/' },
    { name: 'News', key: 'cryptoNews', itemKey: 'newsHeading', linkPrefix: '/crypto-news/' },*/
    { name: 'Academy', key: 'academyArticles', itemKey: 'postHeading', linkPrefix: '/academy/' }, 
  ];

  const ResultCard = ({ title, items, itemKey, linkPrefix }) => (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4 text-indigo-700">{title}</h2>
      <div className="space-y-2">
        {items.map((item) => (
          <Link href={`${linkPrefix}${item.slug}`} key={item._id}
            className="block p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors">
              {item[itemKey]}      
          </Link>
        ))}
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="h-8 bg-gray-200 rounded w-3/4 mb-6"></div>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-2">
              {[...Array(3)].map((_, j) => (
                <div key={j} className="h-10 bg-gray-100 rounded-md"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6 my-32">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded" role="alert">
          <p className="font-bold">Error</p>
          <p>{error.message || 'An error occurred while fetching search results. Please try again.'}</p>
        </div>
      </div>
    );
  }

  const categoriesWithResults = categories.filter(
    category => results[category.key]?.length > 0
  );

  return (
    <section>
      <div className="max-w-4xl mx-auto p-6 mb-32">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Search Results for &quot;{searchQuery}&quot;</h1>
        {categoriesWithResults.length > 0 ? (
          categoriesWithResults.map((category) => (
            <ResultCard
              key={category.key}
              title={category.name}
              items={results[category.key]}
              itemKey={category.itemKey}
              linkPrefix={category.linkPrefix}
            />
          ))
        ) : (
          <p className="text-xl text-gray-600">No results found for &quot;{searchQuery}&quot;</p>
        )}
      </div>
      <BottomSubscribe />
    </section>
  );
};

const SearchResults = () => {
  return (
    <Suspense fallback={<div className='my-48'>Loading...</div>}>
      <SearchResultsContent />
    </Suspense>
  );
};

export default SearchResults;
