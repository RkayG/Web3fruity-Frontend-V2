// components/SEO.tsx
"use client";
import { useEffect } from 'react';
import Head from 'next/head';

interface SEOProps {
  title: string;
  description: string;
  logoUrl: string;
  siteUrl: string;
}

const SEO = ({ title, description, logoUrl, siteUrl }: SEOProps) => {
  useEffect(() => {
    // Inject JSON-LD
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Web3Fruity",
      "url": siteUrl,
      "logo": logoUrl,
      "sameAs": [
        // Add your social media URLs
        "https://twitter.com/web3fruity",
        "https://linkedin.com/company/web3fruity"
      ]
    };

    // Create and append the script element
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(jsonLd);
    document.head.appendChild(script);

    // Cleanup
    return () => {
      document.head.removeChild(script);
    };
  }, [logoUrl, siteUrl]);

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      
      {/* OpenGraph Meta Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={siteUrl} />
      <meta property="og:image" content={logoUrl} />
      <meta property="og:site_name" content="Web3Fruity" />
      
      {/* Twitter Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={logoUrl} />
      
      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    </Head>
  );
};

export default SEO;