"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, INLINES } from '@contentful/rich-text-types';
import { FaChevronLeft, FaExternalLinkAlt, FaTwitter,
     FaReddit, FaDiscord, FaTelegram, FaFacebookF, FaGlobe, FaFileAlt
} from 'react-icons/fa';
import Disclaimer from '@/components/disclaimer';
import SEO from '@/components/SEO';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
 
const Navigation = ({ title }) => {
  return (
    <nav className="flex items-center space-x-2 text-pink-900 ml-6 mt-6">
      <p>
        <Link href="/token-farming" className="hover:text-blue-600">
          Token Farming <span className='mr-1'>&gt;</span>
        </Link>
        <p className="font-semibold text-blue-800 inline">{title}</p>
      </p>
    </nav>
  );
};

const ShareButton = ({ icon, color, onClick, label }) => (
  <button
    onClick={onClick}
    className={`${color} text-white p-2 rounded-full hover:opacity-80 transition-opacity duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${color}`}
    aria-label={label}
  >
    {icon}
  </button>
);

const TokenFarmingGuide = (initialData) => {
  const [tokenData, setTokenData] = useState(initialData.initialData);
  const [additionalTokens, setAdditionalTokens] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const slug = tokenData.slug;

  useEffect(() => {
    if (!tokenData) {
      setError('Failed to load token data');
      setLoading(false);
      return;
    }
    const fetchAdditionalTokens = async (slug) => {
      try {
        // Fetch additional tokens
        const additionalTokensResponse = await fetch(`${apiUrl}/farm-tokens`);
        const allTokens = await additionalTokensResponse.json();
        setLoading(false);
        const filteredTokens = allTokens.filter(token => token.slug !== slug).slice(0, 3);
        setAdditionalTokens(filteredTokens);
      } catch (error) {
        console.error('Failed to load additional tokens:', error);
        setLoading(false);
      }
    };

    if (slug) {
      fetchAdditionalTokens(slug);
    }
  }, [slug, tokenData]);

  /*------------- Share links setting -----------------------------------------------
  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank');
  };

  const shareOnTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(`Check out this token farming opportunity: ${tokenData.tokenName}`)}`, '_blank');
  };

  const shareOnLinkedIn = () => {
    window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(`Token Farming Guide: ${tokenData.tokenName}`)}`, '_blank');
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
   -------Share links setting end   -------------------------------------------------------------------- */


 /*  ----if loading fails */
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

  /* ----track loading state */
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="loading-dots">
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>
      </div>
    );
  }

  /*----------- Guide content formatter - page formatting for texts, links, and images ----------------------------- */
 const { tokenName, logo, platform, requirements, excerpt, keywords, blockchain, guide, linkToFarmingPlatform, website, whitepaper, twitter, telegram, discord } = tokenData;
 const renderOptions = {
    renderNode: {
      // Embedded Asset Node
      [BLOCKS.EMBEDDED_ASSET]: (node) => {
        const { file, title } = node.data.target.fields;
        return (
          <div className="my-8">
            <img src={file.url} alt={title} className="w-full rounded-lg shadow-md" />
            {title && <p className="text-center text-sm text-gray-600 mt-2">{title}</p>}
          </div>
        );
      },
      // Paragraph Node
      [BLOCKS.PARAGRAPH]: (node, children) => (
        <p className="mb-6 leading-relaxed">
          {children.map((child, index) => (typeof child === 'string' ? child : <React.Fragment key={index}>{child}</React.Fragment>))}
        </p>
      ),
      // Heading 1 Node
      [BLOCKS.HEADING_1]: (node, children) => {
        const text = children.reduce((acc, child) => acc + (typeof child === 'string' ? child : ''), '');
        const id = text.replace(/\s+/g, '-').toLowerCase();
        return (
          <h1 id={id} className="text-3xl font-bold mb-6 text-blue-800">
            {children.map((child, index) => (typeof child === 'string' ? child : <React.Fragment key={index}>{child}</React.Fragment>))}
          </h1>
        );
      },
      // Heading 2 Node
      [BLOCKS.HEADING_2]: (node, children) => {
        const text = children.reduce((acc, child) => acc + (typeof child === 'string' ? child : ''), '');
        const id = text.replace(/\s+/g, '-').toLowerCase();
        return (
          <h2 id={id} className="text-2xl font-bold mb-4 text-blue-800">
            {children.map((child, index) => (typeof child === 'string' ? child : <React.Fragment key={index}>{child}</React.Fragment>))}
          </h2>
        );
      },
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
    // Hyperling Node
      [INLINES.HYPERLINK]: (node, children) => (
        <a href={node.data.uri} className="text-blue-600 font-bold hover:underline transition-colors duration-300">
          {children.map((child, index) => (typeof child === 'string' ? child : <React.Fragment key={index}>{child}</React.Fragment>))}
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
  /*----------- Guide contend formatter end ------------------------------------------------------------------------------ */

  /* -----Set Social links display ----------------------------------------- */
  const SocialLink = ({ href, icon, title }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-600 hover:bg-blue-600 hover:text-white transition-all duration-300 transform hover:scale-110"
      title={title}
    >
      {icon}
    </a>
  );
 /* -------------- Set Social links display end --------------------------------------------------- */

  return (
   /*  SECTION START */
   <>
    <SEO 
        title={`${tokenName} Farming`}
        description={excerpt && excerpt }
        keywords={keywords && keywords.join(', ')}
        logoUrl={logo}
        siteUrl={`https://www.web3fruity.com/token-farming/${slug}`}
      />
   
    <motion.section
    >
      <Navigation title={tokenName} />

    {/* =========== Section heading =========================== */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <motion.h1 
          className="text-4xl font-bold text-center mb-8  text-blue-800"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {tokenData.tokenName} 
        </motion.h1>
    {/* ========= Section heading end ========================== */}
    
        
       {/*  ====================== Token Farming hero card =============================================================== */}
        <motion.div 
          className="bg-white rounded-lg shadow-lg overflow-hidden mb-8"
        >
          <div className="h-48 bg-gradient-to-bl from-blue-800 to-purple-800 flex items-center justify-center">
            <img src={tokenData.logo} className="w-32 h-32 rounded-full border-4 border-white shadow-md" alt={tokenData.tokenName} />
          </div>
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600">Platform:</span>
              <a href={tokenData.linkToFarmingPlatform}>
                <span className="bg-orange-100 hover:bg-orange-900 hover:text-white flex flex-wrap cursor-pointer text-orange-800 px-3 py-1 rounded-full">{tokenData.platform || 'N/A'}
                    <FaExternalLinkAlt className='mt-1 ml-2' />
                </span>
              </a>
            </div>
            <div className="mb-4">
              <p className="text-gray-600">Requirements:</p>
              <p className="font-semibold">{tokenData.requirements || 'N/A'}</p>
            </div>
            <div className="mb-4">
              <p className="text-gray-600">Blockchain:</p>
              <p className="font-semibold">{tokenData.blockchain}</p>
            </div>
            <div className="mb-4">
              <p className="text-gray-600">Farming Type:</p>
              <p className="font-semibold">{tokenData.stakeToFarm == 'stake' ? 'Stake to Farm' : 'Free Farming'}</p>
            </div>
          </div>
        </motion.div>
       {/*  =============================== Token Farming Hero card end ================================================================ */}

      {/* ============================ Participate Button ====================================================== */}
       <motion.div
          className="text-center"
        >
          <a 
            href={tokenData.referralLink} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex cursor-pointer items-center bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-colors duration-300 text-lg font-semibold"
          > Participate <FaExternalLinkAlt className="ml-2" />
          </a>
        </motion.div>
        {/* ======================== Participate Button end ================================================== */}


        {/* ================== Farming Guide ============================================================= */}
        <motion.div
          className="bg-white rounded-lg px-1 mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
           {guide ? (
                <div>
                    <h2 className="text-2xl font-bold text-center mb-4 mt-8 text-blue-800">{tokenName} Farming Guide</h2>
                    <div className='border-t-2 border-t-orange-800 p-6 l rounded-lg bg-gray-50 shadow-inner'>
                    {documentToReactComponents(guide, renderOptions)}
                    </div>
                
                </div>
                ) : (
                <p className="text-center text-gray-500">No guide available for this farming.</p>
            )}
        </motion.div>
        {/* ======================= Farming Guide end ========================================================= */}


       {/*===================== Project links =========================================================== */}
        <motion.div
        className="max-w-4xl mx-auto px-4 py-8 bg-white rounded-lg mb-8"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-800">Connect with {tokenData.tokenName}</h2>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <SocialLink href={tokenData.website} icon={<FaGlobe size={20} />} title="Official Website" />
          
          {tokenData.socialLinks.map((link, index) => {
            let icon;
            let title;
            if (link.includes("twitter.com") || link.includes("x.com")) {
              icon = <FaTwitter size={20} />;
              title = "Twitter";
            } else if (link.includes("facebook.com")) {
              icon = <FaFacebookF size={20} />;
              title = "Facebook";
            } else if (link.includes("discord.com") || link.includes("discord.gg")) {
              icon = <FaDiscord size={20} />;
              title = "Discord";
            } else if (link.includes("telegram.com") || link.includes("t.me")) {
              icon = <FaTelegram size={20} />;
              title = "Telegram";
            } else if (link.includes("reddit.com")) {
              icon = <FaReddit size={20} />;
              title = "Reddit";
            }
            return <SocialLink key={index} href={link} icon={icon} title={title} />;
          })}
          {tokenData.whitepaperLink && (
            <a
              href={tokenData.whitepaperLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-300 transform hover:scale-105"
            >
              <FaFileAlt className="mr-2" />
              Whitepaper
            </a>
          )}
        </div>
      </motion.div>
      {/* ============================== Project links end ======================================================= */}

        
      </div>

    {/*============== Share functionality, incomplete =======================
       <motion.div
          className="flex justify-center space-x-4 mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <p className='font-semibold text-[green] mt-1'>Share:</p>
          <ShareButton icon={<FaFacebookF />} color="bg-blue-600" onClick={shareOnFacebook} label="Share on Facebook" />
          <ShareButton icon={<FaTwitter />} color="bg-blue-400" onClick={shareOnTwitter} label="Share on Twitter" />
          <ShareButton icon={<FaLinkedinIn />} color="bg-blue-700" onClick={shareOnLinkedIn} label="Share on LinkedIn" />
          <ShareButton icon={<FaLink />} color="bg-gray-600" onClick={copyLink} label="Copy link" />
        </motion.div>
        {copied && (
          <motion.p
            className="text-green-600 text-center mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            Link copied to clipboard!
          </motion.p>
        )} 
        ========================================================================== */}

     {/*=============== Additonal tokens to farm ==========  */}
      <motion.div
        className="max-w-5xl mx-auto px-4 py-12"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <h2 className="text-2xl font-bold text-center mb-8 text-blue-800">More Tokens to Farm</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {additionalTokens.map((token) => (
            <Link href={`/token-farming/${token.slug}`} key={token.slug}>
              <div className="bg-white min-h-[250px] rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="h-32 bg-gradient-to-bl from-blue-800 to-purple-800 flex items-center justify-center">
                  <img src={token.logo} alt={token.tokenName} className="w-20 h-20 rounded-full border-2 border-white" />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2 text-blue-900">{token.tokenName}</h3>
                  <div className=' '>
                  <p className="text-sm text-gray-900 mb-2">{token.stakeToFarm == 'stake' ? 'Stake to Farm' : 'Free Farming'}</p>
                  <p className="text-sm font-bold text-gray-900">{token.blockchain}</p>
                <div className="mb-3">
                  {/* <p className="text-sm text-gray-600">{token.platform}</p> */}
                </div>
                
                    {/* <p className="text-gray-600">Farming Type:</p> */}
                     </div>
                  <div className="mb-3">
                    {/* <p className="text-gray-600">Blockchain:</p> */}
                    
                  </div>
                 
                </div>
                
              </div>
            </Link>
          ))}
        </div>
      </motion.div>
     {/*  ================================ Additional tokens end  ============================== */}

    {/* Disclaimer componennt */}
      <Disclaimer />

    </motion.section>
    </>
  );
};

export default TokenFarmingGuide;