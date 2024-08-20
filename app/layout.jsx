import '../styles/globals.css';
import { Footer } from '../components/footer';
import { Header } from '../components/header';
import { BottomNavigationPanel } from '../components/bottom-navigation';
import React from "react";

export const metadata = {
    title: {
        template: '%s | Netlify',
        default: 'Web3Fruity'
    }
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" data-theme="lofi">
            <head>
                <link rel="icon" href="/favicon.ico" sizes="any" />
            </head>
            <body className="antialiased bg-white">
                <div className="">
                    <div className="">
                        <Header />
                        <div className="grow">{children}</div>
                        <Footer />
                        <BottomNavigationPanel />
                    </div>
                </div>
            </body>
        </html>
    );
}
