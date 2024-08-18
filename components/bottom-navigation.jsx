"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { Fragment } from 'react';
import { FaHome, FaParachuteBox, FaGamepad, FaVideo, FaBookReader } from 'react-icons/fa';

export function BottomNavigationPanel() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const handleScroll = () => {
    if (typeof window !== 'undefined') {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY) {
        // Scrolling down
        setIsVisible(false);
      } else {
        // Scrolling up
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleScroll);
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, [lastScrollY]);

  return (
    <nav className={`fixed lg:hidden bottom-0 left-0 right-0 bg-white shadow-lg z-50 rounded-t-3xl border border-gray-400 transition-transform duration-300 ${isVisible ? 'translate-y-0' : 'translate-y-full'}`}>
      <div className="flex justify-between items-center p-4">
        <Link href="/" className="block text-center">
          <FaHome className='m-auto text-red-800' />
          <span className="text-blue-700 font-semibold text-sm">Discover</span>
        </Link>
        
        <Menu as="div" className="relative inline-block text-left">
          <MenuButton className="block text-center">
            <FaParachuteBox className='m-auto text-red-800' />
            <span className="text-blue-700 font-semibold text-sm">Airdrops</span>
          </MenuButton>
          <MenuItems className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-40 bg-white shadow-lg rounded-md">
            <MenuItem>
              {({ active }) => (
                <Link href="/airdrops" className={`block px-4 py-2 text-blue-700 ${active ? 'bg-gray-100' : ''}`}>
                  Airdrop
                </Link>
              )}
            </MenuItem>
            <MenuItem>
              {({ active }) => (
                <Link href="/token-farming" className={`block px-4 py-2 text-blue-700 ${active ? 'bg-gray-100' : ''}`}>
                  Farming
                </Link>
              )}
            </MenuItem>
          </MenuItems>
        </Menu>
        
        <Link href="/games" className="block text-center">
          <FaGamepad className='m-auto text-red-800' />
          <span className="text-blue-700 font-semibold text-sm">Games</span>
        </Link>
        
        <Link href="/platforms" className="block text-center">
          <FaVideo className='m-auto text-red-800' />
          <span className="text-blue-700 font-semibold text-sm">Platforms</span>
        </Link>

        <Menu as="div" className="relative inline-block text-left">
          <MenuButton className="block text-center">
            <FaBookReader className='m-auto text-red-800' />
            <span className="text-blue-700 font-bold text-sm">Learn</span>
          </MenuButton>
          <MenuItems className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-40 bg-white shadow-lg rounded-md">
            <MenuItem>
              {({ active }) => (
                <Link href="/academy" className={`block px-4 py-2 text-blue-700 ${active ? 'bg-gray-100' : ''}`}>
                  Academy
                </Link>
              )}
            </MenuItem>
            <MenuItem>
              {({ active }) => (
                <Link href="/crypto-news" className={`block px-4 py-2 text-blue-700 ${active ? 'bg-gray-100' : ''}`}>
                  News
                </Link>
              )}
            </MenuItem>
            <MenuItem>
              {({ active }) => (
                <Link href="/" className={`block px-4 py-2 text-blue-700 ${active ? 'bg-gray-100' : ''}`}>
                  About
                </Link>
              )}
            </MenuItem>
          </MenuItems>
        </Menu>
      </div>
    </nav>
  );
}