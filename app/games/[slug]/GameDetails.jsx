"use client";

import { useParams } from 'next/navigation';
import React, { useState, useEffect, useCallback } from 'react';
import { FaTwitter, FaFacebookF, FaDiscord, FaTelegram, FaReddit, FaGlobe, FaDollarSign, FaChartLine, FaCoins, FaFileInvoiceDollar } from 'react-icons/fa';
import axios from 'axios';
import { motion } from 'framer-motion';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, INLINES } from '@contentful/rich-text-types';
import Link from 'next/link';
import GalleryAndTrailer from '@/components/game-gallery-and-trailer';
import SEO from '@/components/SEO';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const Navigation = ({ title }) => {
  
    return (
      <nav className="flex items-center space-x-2 text-pink-900 ml-6 mt-6">
        <Link href="/games" className="hover:text-blue-600"> 
           Games
        </Link>
        <span> &gt; </span>
        <span className="font-semibold text-blue-800">{title}</span>
      </nav>
    );
};

const GameDetails = (initialData) => {
  const [game, setGame] = useState(initialData.initialData);
  const [additionalGames, setAdditionalGames] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [price, setPrice] = useState('$0.00');
  const [marketCap, setMarketCap] = useState('$0');
  const slug  = game.slug;

  useEffect(() => {
    if (!game) {
      setError('Failed to load game info');
      return;
    }
    const fetchCoinDataAndAdditionalGames = async (slug) => {
      try {
        // Fetch coin data
        if (game.token_api_id) {
          try {
            const coinResponse = await axios.get(`https://api.coingecko.com/api/v3/coins/${game.token_api_id}`);
            const coinData = coinResponse.data;
            console.log(coinData);
            setPrice(`$${coinData.market_data.current_price.usd.toFixed(5)}`);
            setMarketCap(`$${coinData.market_data.market_cap.usd.toLocaleString()}`);
          } catch (error) {
            console.error('Error fetching coin data:', error);
          }
        }

        // Fetch additional games
        const response = await axios.get(`${apiUrl}/games`, {
          params: {
            limit: 4,
          },
        });
        const games = await response.data;
        setLoading(false);
        const moreGames = games.filter((game) => game.slug !== slug);
        setAdditionalGames(moreGames);
      } catch (error) {
        console.error('Failed to load additional games:', error);
        setLoading(false);
      }
    };

    if (slug) {
      fetchCoinDataAndAdditionalGames(slug);
    }
  }, [slug, game]);

  
  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6 my-32">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded" role="alert">
          <p className="font-bold">Error</p>
          <p>{error.message}</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className='flex justify-center my-32'> Loading game info </div>
  }

  if (!game) {
      return <div>Game not found</div>;
    }

  const { title, description, excerpt, keywords, image, guide, gallery } = game
  
const GameCard = ({ game }) => {
  return (
    <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.5 }}
    className="mt-12 overflow-hidden m-auto mb-4 transition-shadow duration-300"
    style={{ width: "100%" }}
  >
    
    <div className="bg-white rounded-xl shadow-lg overflow-hidden m-auto lg:p-6 mb-6 border border-gray-200 hover:border-blue-500 transition-all duration-300" style={{ width: "95%" }}>
      <div className="flex flex-col lg:flex-row">
        <img className="w-full h-48 lg:w-48 lg:h-48 object-cover rounded-t-xl lg:rounded-xl mb-4 lg:mb-0 lg:mr-6" src={game.image} alt={game.title} />
        <div className="flex-1 px-4 lg:px-0">
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-xl lg:text-2xl font-bold text-blue-900 flex mx-auto lg:mx-0">{game.title}</h2>
            {/* <Link href={`/games/${game.slug}`}>
              <span className="text-sm font-semibold py-1 px-4 bg-blue-100 text-blue-800 rounded-full cursor-pointer hover:bg-blue-200 transition-colors duration-300">
                View
              </span>
            </Link> */}
          </div>
          <div className="flex items-center mb-3 justify-center mx-auto lg:mx-0 lg:justify-start">
            <a href={game.website} className="mr-3 text-gray-600 hover:text-blue-600 transition-colors duration-300"><FaGlobe title={game.website} /></a>
            {game.socialLinks.map((link, index) => {
              let icon;
              if (link.includes("twitter.com") || link.includes("x.com")) icon = <FaTwitter title={link} />;
              else if (link.includes("facebook.com")) icon = <FaFacebookF title={link} />;
              else if (link.includes("discord.com") || link.includes("discord.gg")) icon = <FaDiscord title={link} />;
              else if (link.includes("telegram.com") || link.includes("t.me")) icon = <FaTelegram title={link} />;
              else if (link.includes("reddit.com")) icon = <FaReddit title={link} />;
              return (
                <a key={index} href={link} className="mx-3 text-gray-600 hover:text-blue-600 transition-colors duration-300">
                  {icon}
                </a>
              );
            })}
          </div>
          <p className="text-sm text-blue-800 font-semibold mb-2">Developer: {game?.developer}</p>
          <p className="text-sm text-gray-600 mb-4">{game.description}</p>
        </div>
      </div>
      <div className="bg-gray-100 p-4 mt-4 rounded-xl">
        <div className="flex flex-wrap justify-start lg:justify-between gap-3">
          <InfoTag label="Genre" value={game?.genre} color="blue" />
          <InfoTag label="Platform" value={game?.platform.length > 1 ? game?.platform.join(', ') : game?.platform} color="green" />
          <InfoTag label="Token" value={game?.token} color="red" />
          <InfoTag label="Free-to-Play" value={game?.free2play == 'Yes' ? "Yes" : "No"} color="blue" />
          <InfoTag label="Chain" value={game?.chain || 'N/A'} color="green" />
        </div>
      </div>
    </div>
    </motion.div>
  );
};

const InfoTag = ({ label, value, color }) => {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-800",
    green: "bg-green-100 text-green-800",
    red: "bg-red-100 text-red-800",
  };

  return (
    <div className={`px-3 py-1 rounded-full ${colorClasses[color]}`}>
      <p className="text-xs font-semibold">{label}: <span className="font-normal">{value}</span></p>
    </div>
  );
};
    
  return (
    <>
    <section className='max-w-[1928px] m-auto px-4 sm:px-6 lg:px-8'>
      <Navigation title={title} />
      <GameCard game={game} className='mt-12' />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="game-stats grid grid-cols-2 gap-4 md:grid-cols-4 mt-8"
      >
        {[
          { Icon: FaDollarSign, label: `${game?.token} Price`, value: price },
          { Icon: FaChartLine, label: "Marketcap", value: marketCap },
          { Icon: FaCoins, label: "Required Investment", value: `${game?.initialInvestment || 'N/A'}` },
          { Icon: FaFileInvoiceDollar, label: "Avg Income / Week", value: `${game?.avgEarnPerWeek || 'N/A'}` },
        ].map((stat, index) => (
          <div key={index} className="bg-gradient-to-br from-blue-500 to-purple-600 text-white p-4 rounded-lg shadow-md">
            <div className='flex flex-wrap'>
              <stat.Icon className="text-lg mb-2 mr-2" />
              <p className="text-sm font-medium">{stat.label}</p>
            </div>
            <p className="text-lg font-bold">{stat.value}</p>
          </div>
        ))}

      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="gameplay-trailer-and-gallery my-12"
      >
        <h1 className="text-3xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-red-500">
          {game.title} Gameplay
        </h1>
        
         <GalleryAndTrailer trailer={game.trailer} gallery={game.gallery} />

      </motion.div>

      {guide ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="game-guide mt-16 mb-24"
        >
          <h2 className="text-3xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-red-600">
            {title} Guide
          </h2>
          <div className="guide-content max-w-4xl mx-auto bg-gray-100 shadow-lg rounded-lg overflow-hidden">
            <div className="p-6 lg:p-10 ">
              {documentToReactComponents(guide, {
               
                renderNode: {
                  [BLOCKS.PARAGRAPH]: (node, children) => (
                    <p className="text-lg  mb-6 ">{children}</p>
                  ),
                  [BLOCKS.HEADING_1]: (node, children) => (
                    <h1 className="text-3xl font-bold mb-6 text-blue-800">{children}</h1>
                  ),
                  [BLOCKS.HEADING_2]: (node, children) => (
                    <h2 className="text-2xl font-bold mb-4 mt-8 text-blue-800">{children}</h2>
                  ),
                  [BLOCKS.HEADING_3]: (node, children) => (
                    <h3 className="text-xl font-bold mb-3 mt-6 text-blue-800">{children}</h3>
                  ),
                  // Unordered List Node
                  [BLOCKS.UL_LIST]: (node, children) => (
                    <ul className="list-disc list-outside pl-5 text-gray-700">{children}</ul>
                  ),
                  
                  // Ordered List Node
                  [BLOCKS.OL_LIST]: (node, children) => (
                    <ol className="list-decimal list-outside pl-4 ">{children}</ol>
                  ),
                  
                  // List Item Node
                  [BLOCKS.LIST_ITEM]: (node, children) => (
                    <li className="text-gray-700 -my-2 pl-1">{children}</li>
                  ),
                  [BLOCKS.QUOTE]: (node, children) => (
                    <blockquote className="border-l-4 border-blue-500 pl-4 py-2 mb-6 italic text-gray-600">
                      {children}
                    </blockquote>
                  ),
                  [BLOCKS.EMBEDDED_ASSET]: (node) => {
                    const { file, title } = node.data.target.fields;
                    return (
                      <div className="my-4 rounded-md">
                        <img src={file.url} alt={title} className="mx-auto rounded-lg" />
                        {title && <p className="text-center text-sm text-gray-600">{title}</p>}
                      </div>
                    );
                  },
                  [INLINES.HYPERLINK]: (node, children) => (
                    <a href={node.data.uri} className="text-blue-700 hover:underline" target="_blank" rel="noopener noreferrer">
                      {children}
                    </a>
                  ),
                },
              })}
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="text-center text-gray-500 my-16">
          <p className="text-xl">No guide available for this game.</p>
          <p className="mt-2">Check back later for updates!</p>
        </div>
      )}
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="more-games py-12 px-6 mt-12 mb-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg shadow-inner"
      >
        <h2 className="text-3xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-800 to-orange-800">
          More Games You Might Like
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {additionalGames.map((game) => (
            <Link href={`/games/${game.slug}`} key={game._id}>
              <motion.div
                key={game._id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <img className="w-full h-48 object-cover" src={game.image} alt={game.title} />
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-blue-900 mb-2">{game.title}</h3>
                  <p className='text-gray-600 mb-2'>{game.genre}</p>
                  <p className='text-sm font-medium text-orange-800'>{game?.platform.length > 1 ? game?.platform.join(', ') : game?.platform}</p>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.div>
    </section>
    </>
  );
};

export default GameDetails;
