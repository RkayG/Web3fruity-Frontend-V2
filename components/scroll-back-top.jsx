"use client";
import React, { useState } from 'react';
import {FaArrowUp } from 'react-icons/fa';

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

      return (
        <div>
             {showBackToTop && (
            <button
              onClick={scrollToTop}
              className="sticky z-500 bottom-8 lg:left-[90%] left-[80%] bg-blue-500 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-300"
              aria-label="Back to Top"
            >
              <FaArrowUp />
            </button>
          )}
        </div>    
      );
};

export default ScrollBackTop;
