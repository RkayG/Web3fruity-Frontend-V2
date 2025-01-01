"use client";

import '../styles/globals.css';
import { Footer } from '../components/footer';
import { Header } from '../components/header';
import { BottomNavigationPanel } from '../components/bottom-navigation';
import React from "react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import CryptoPriceTicker from '@/components/crypto-prices';
import SEO from '@/components/SEO';
import Script from 'next/script';

export default function RootLayout({ children }) {
    // Create a new QueryClient instance for each request
    const [queryClient] = React.useState(() => new QueryClient());

    return (
        <html lang="en" data-theme="lofi">
            <head>
                <Script async src="https://www.googletagmanager.com/gtag/js?id=G-Y4J28FM147"></Script> 
                <Script id="google-analytics"> 
                    {` window.dataLayer = window.dataLayer || []; 
                    function gtag(){dataLayer.push(arguments);} 
                    gtag('js', new Date()); gtag('config', 'G-Y4J28FM147'); `} 
                </Script>
                <link rel="manifest" href="/manifest.json" />
                <link rel="icon" href="/favicon.ico" sizes="any" />
            </head>
            <body className="antialiased bg-white">
                <QueryClientProvider client={queryClient}>
                    <div className="">
                        <div className="">
                            <Header />
                            <CryptoPriceTicker />
                            <div className="grow">{children}</div>
                            <Footer />
                            <BottomNavigationPanel />
                        </div>
                    </div>
                </QueryClientProvider>
            </body>
        </html>
    );
}