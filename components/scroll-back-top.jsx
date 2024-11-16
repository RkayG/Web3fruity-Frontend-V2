"use client";
import React, { useState } from 'react';
import { FaArrowUp } from 'react-icons/fa';

const ScrollBackTop = () => {
    const [showBackToTop, setShowBackToTop] = useState(false);

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

    return showBackToTop ? (
        <button
            onClick={scrollToTop}
            className="fixed z-50 bottom-8 lg:right-8 right-4 bg-blue-500 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-300"
            aria-label="Back to Top"
        >
            <FaArrowUp />
        </button>
    ) : null;
};

export default ScrollBackTop;