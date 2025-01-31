"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, INLINES } from '@contentful/rich-text-types';
import Link from 'next/link';
import axios from 'axios';
import { FaTwitter, FaTelegram, FaDiscord, FaReddit, FaMedium, FaLinkedin, FaGlobe, FaFile, FaLink, FaCoins, FaPercentage, FaCalendarAlt, FaFileAlt, FaExternalLinkAlt, FaFacebookF } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Disclaimer from '@/components/disclaimer';
import { isActive } from '@/utils';
import SEO from '@/components/SEO';
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const Navigation = ({ title }) => {
  
  return (
    <nav className="flex items-center space-x-2 text-pink-900 ml-6 mt-6">
      <Link href="/airdrops" className="hover:text-blue-600"> 
         Airdrops
      </Link>
      <span> &gt; </span>
      <span className="font-semibold text-blue-800">{title}</span>
    </nav>
  );
};

const SocialLink = ({ href, icon: Icon, label }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-500 transition-colors duration-300">
    <Icon size={24} title={label} />
  </a>
);

const AirdropGuide = (initialData) => {
  const [airdropData, setAirdropData] = useState(initialData.initialData);
  const [additionalAirdrops, setAdditionalAirdrops] = useState([]);
  const [error, setError] = useState(null);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const slug = airdropData.slug;

  useEffect(() => {
    const fetchAdditionalAirdrops = async (slug) => {
      try {
        const response = await axios.get(`${apiUrl}/airdrops`, {
          params: { limit: 7, page: 1 },
        });
        const moreAirdrops = response.data.airdrops.filter((airdrop) => airdrop.slug !== slug);
        setAdditionalAirdrops(moreAirdrops);
      } catch (error) {
        console.error('Failed to load additional airdrops:', error);
      }
    };

    if (slug) {
      fetchAdditionalAirdrops(slug);
    }
  }, [slug]);

  if (error) return <div className="text-red-500 text-center my-48">{error}</div>;
  if (!airdropData) return <div className="loading-dots m-auto my-44"><span className="dot"></span><span className="dot"></span><span className="dot"></span></div>;

  const { title, description, excerpt, keywords, logo, guide, website, whitepaper, twitter, telegram, discord } = airdropData;

  const renderOptions = {
    renderNode: {
      [BLOCKS.EMBEDDED_ASSET]: (node) => {
        const { file, title } = node.data.target.fields;
        return (
          <div className="my-4 rounded-md">
            <img src={file.url} alt={title} className="mx-auto rounded-lg shadow-md" />
            {title && <p className="text-center text-sm text-gray-600 mt-2">{title}</p>}
          </div>
        );
      },
      [BLOCKS.PARAGRAPH]: (node, children) => <p className="mb-4 text-gray-700">{children}</p>,
      [BLOCKS.HEADING_1]: (node, children) => <h1 className="text-3xl font-bold mb-4 text-blue-900">{children}</h1>,
      [BLOCKS.HEADING_2]: (node, children) => <h2 className="text-2xl font-bold mb-4 text-blue-800">{children}</h2>,
      // Heading 3 Node
      [BLOCKS.HEADING_3]: (node, children) => {
        const text = children.reduce((acc, child) => acc + (typeof child === 'string' ? child : ''), '');
        const id = text.replace(/\s+/g, '-').toLowerCase();
        return (
            <h3 id={id} className="text-xl font-bold mb-3 text-blue-800">
                {children.map((child, index) => (
                    typeof child === 'string' ? child : <React.Fragment key={index}>{child}</React.Fragment>
                ))}
            </h3>
        );
      },
      // Heading 4 Node
    [BLOCKS.HEADING_4]: (node, children) => {
      const text = children.reduce((acc, child) => acc + (typeof child === 'string' ? child : ''), '');
      const id = text.replace(/\s+/g, '-').toLowerCase();
      return (
          <h4 id={id} className="text-lg font-bold mb-2 text-blue-800">
              {children.map((child, index) => (
                  typeof child === 'string' ? child : <React.Fragment key={index}>{child}</React.Fragment>
              ))}
          </h4>
      );
    },
      [INLINES.HYPERLINK]: (node, children) => (
        <a href={node.data.uri} className="text-blue-700 font-bold hover:underline" target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      ),
      // Unordered List Node
      [BLOCKS.UL_LIST]: (node, children) => (
        <ul className="list-disc list-outside pl-5 mb-2 text-gray-700">{children}</ul>
      ),
      
      // Ordered List Node
      [BLOCKS.OL_LIST]: (node, children) => (
        <ol className="list-decimal list-outside pl-4 mb-4 text-gray-700">{children}</ol>
      ),
      
      // List Item Node
      [BLOCKS.LIST_ITEM]: (node, children) => (
        <li className="mb-2 pl-1">{children}</li>
      ),
    },
  };

  const truncatedDescription = description?.length > 200 ? description?.substring(0, 200) + '...' : description;

  return (
    <>
    <motion.section
      className='max-w-[1580px] m-auto'
    >
      <Navigation title={title} />
    
      
      <motion.div 

        className="max-w-4xl mx-auto p-8 mt-12 bg-white "
      >
        <motion.h1 
          className="text-4xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600"
         
        >
          {title} Guide
      </motion.h1>
      <motion.div
            className="  transition-all duration-300 hover:-translate-y-2"
          >
          <div className="group bg-gradient-to-br from-blue-800 to-orange-800 p-1 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
            <div className="bg-white h-full rounded-2xl p-6 transition-all duration-300 group-hover:bg-gray-100">
              <div className="relative mb-6">
                <img src={logo} className="w-20 h-20 rounded-full mx-auto shadow-md" alt={title} />
                <div className="absolute top-0 right-0 bg-orange-800 text-gray-200 text-xs font-semibold py-1 px-3 rounded-full">
                  {airdropData.platformType}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-center mb-2 text-blue-800">{airdropData.title}</h3>
              <p className="text-sm text-center text-gray-600 mb-4">{airdropData.chain}</p>
              <div className="space-y-3 text-sm">
                <p className="flex items-center justify-between">
                  <span className="flex items-center text-gray-600"><FaCoins className="mr-2 text-orange-800" /> Total Pool:</span>
                  <span className="font-semibold text-blue-800">{airdropData.rewardPool || 'N/A'}</span>
                </p>
                <p className="flex items-center justify-between">
                  <span className="flex items-center text-gray-600"><FaPercentage className="mr-2 text-orange-800" /> % of Supply:</span>
                  <span className="font-semibold text-blue-800">{airdropData.rewardPercentFromSupply || 'N/A'}</span>
                </p>
                <p className="flex items-center justify-between">
                  <span className="flex items-center text-gray-600"><FaCalendarAlt className="mr-2 text-orange-800" /> End Date:</span>
                  <span className="font-semibold text-blue-800">{airdropData.endDate && isActive(airdropData.endDate) || 'N/A'}</span>
                </p>
              </div>
            </div>
              <div className="bg-gradient-to-r from-gray-900 to-orange-800 p-4 rounded-b-2xl">
                {/* <span className="font-semibold">View Details</span> */}
                
              </div>  
          </div>
        </motion.div>

        {/* ============================ Participate Button ====================================================== */}
       <motion.div
          className="text-center"
        >
          <a 
            href={airdropData.referralLink} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center mt-6 bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-colors duration-300 text-lg font-semibold"
          > Participate <FaExternalLinkAlt className="ml-2" />
          </a>
        </motion.div>
        {/* ======================== Participate Button end ================================================== */}


        <h2 className='text-2xl font-bold mt-6 mb-4 text-blue-800'>About Project</h2>
        <p className="text-lg mb-6 text-gray-700">
          {showFullDescription ? description : truncatedDescription}
          {description?.length > 200 && (
            <button
              className="ml-2 text-blue-500 hover:underline focus:outline-none"
              onClick={() => setShowFullDescription(!showFullDescription)}
            >
              {showFullDescription ? 'Read Less' : 'Read More'}
            </button>
          )}
        </p>

        {guide ? (
          <div>
            <h2 className="text-2xl font-bold mb-6 mt-12 text-blue-800">Steps To Join Airdrop</h2>
            <div className='border-t-2 border-t-orange-800 p-6 lg:px-12 rounded-lg bg-gray-50 shadow-inner'>
              {documentToReactComponents(guide, renderOptions)}
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500">No guide available for this airdrop.</p>
        )}
      </motion.div>


      {/*============ project social ilnks =====================*/}
      <h2 className="text-2xl font-bold text-center mb-6 text-blue-800">Connect with {airdropData.title}</h2>
      <div className="flex items-center mb-4 justify-center mx-auto lg:mx-0 ">
            <a href={airdropData.website} className="flex items-center mr-3 justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-600 hover:bg-blue-600 hover:text-white transition-all duration-300 transform hover:scale-110"><FaGlobe title={airdropData.website} /></a>
            {airdropData.socialLinks.map((link, index) => {
              let icon;
              if (link.includes("twitter.com") || link.includes("x.com")) icon = <FaTwitter size={24}  title={link} />;
              else if (link.includes("facebook.com")) icon = <FaFacebookF size={24} title={link} />;
              else if (link.includes("discord.com") || link.includes("discord.gg")) icon = <FaDiscord size={24} title={link} />;
              else if (link.includes("telegram.com") || link.includes("t.me")) icon = <FaTelegram size={24} title={link} />;
              else if (link.includes("reddit.com")) icon = <FaReddit size={24} title={link} />;
              else if (link.includes("medium.com")) icon = <FaMedium size={24} title={link} />
              else if (link.includes('linkedin.com')) icon = <FaLinkedin size={24} title={link} />
              return (
                <a key={index} href={link} className="flex items-center mx-3 justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-600 hover:bg-blue-600 hover:text-white transition-all duration-300 transform hover:scale-110">
                  {icon}
                </a>
              );
            })}
        </div>
        {/* ===================== project social links end =============== */}

        {/* Whitepaper */}
        {airdropData.whitepaperLink && (
            <a
              href={airdropData.whitepaperLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center mx-auto px-4 py-2 w-fit bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-300 transform hover:scale-105"
            >
              <FaFileAlt className="mr-2" />
              Whitepaper
            </a>
          )}
        {/* whitepaper end */}


      {/* ================== additional airdrops display ============== */}
      <motion.div 
      
        className="py-8 px-5 mt-32 mb-20 border rounded-lg bg-gray-50 shadow-md"
      >
        <h2 className="text-2xl font-bold mb-6 px-6 text-blue-900">More Airdrops</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {additionalAirdrops.map((airdrop) => (
            <motion.div
            key={airdrop._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{  delay: 0.2 }}
            className="  transition-all duration-300 hover:-translate-y-2"
          >
            <div key={airdrop._id} className="group bg-gradient-to-br from-blue-800 to-orange-800 p-1 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
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
                    <span className="font-semibold text-blue-800">{airdrop.endDate && new Date(airdrop.endDate).toLocaleDateString() || 'N/A'}</span>
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
          </motion.div>
          ))} 
        </div>
        <div className="text-center mt-8">
          <Link href="/airdrops">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="py-2 px-6 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-300 shadow-md"
            >
              See More
            </motion.button>
          </Link>
        </div>
      </motion.div>
      {/*============ additional airdrops display end =============================*/}

      {/* disclaimer component */}
      <Disclaimer />

    </motion.section>
    </>
  );
};

export default AirdropGuide;