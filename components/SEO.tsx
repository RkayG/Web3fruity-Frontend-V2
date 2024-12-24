"use client";
import { useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';

interface SEOProps {
  title: string;
  description: string;
  keywords: string;
  logoUrl: string;
  siteUrl: string;
  author: string;
}

const SEO = ({ title, description, keywords, logoUrl, author, siteUrl }: SEOProps) => {
  if (!author) {
    author = 'Rufus Gladness';
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Web3Fruity",
    "url": siteUrl,
    "logo": logoUrl,
    "author": author,
    "sameAs": [
      "https://twitter.com/web3fruity",
      "https://linkedin.com/company/web3fruity"
    ]
  };

  return (
    <>
      <head>
        {/* Basic Meta Tags */}
        <title>{title}</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="robots" content="index, follow" />
        {author && <meta data-n-head="ssr" data-hid="author" name="author" content={author}></meta>}
        
        {/* OpenGraph Meta Tags */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={siteUrl} />
        {logoUrl && <meta property="og:image" content={logoUrl} />}
        <meta property="og:site_name" content="Web3Fruity" />
        <meta property="og:locale" content="en_US" />
        
        {/* Twitter Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        {logoUrl && <meta name="twitter:image" content={logoUrl} />}
        <meta name="twitter:site" content="@web3fruity" />
        <meta name="twitter:creator" content="@web3fruity" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

        {/* Manifest */}
        <link rel="manifest" href="/manifest.json" />
        <link rel="canonical" href={siteUrl} />
      </head>
    </>
  );
};

export default SEO;
