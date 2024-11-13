"use client";

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { FaHome, FaParachuteBox, FaGamepad, FaVideo, FaBookReader, FaCoins, FaBookOpen } from 'react-icons/fa';

export function BottomNavigationPanel() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const pathname = usePathname();

  const handleScroll = useCallback(() => {
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
  }, [lastScrollY]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleScroll);
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, [handleScroll]);

  // Determine if the current path is active
  const isActiveLink = (path) => pathname === path;
  const isActiveParentLink = (paths) => paths.includes(pathname);

  return (
    <nav className={`fixed lg:hidden bottom-0 left-0 right-0 bg-white shadow-lg z-50 rounded-t-3xl border border-gray-400 transition-transform duration-300 ${isVisible ? 'translate-y-0' : 'translate-y-full'}`}>
      <div className="flex justify-between items-center p-4">
        <Link href="/" className="block text-center">
          <FaHome className={`m-auto ${isActiveLink('/') ? 'text-orange-600' : 'text-red-800'} transition-colors duration-300 hover:text-blue-700`} />
          <span className={`${isActiveLink('/') ? 'text-orange-600' : 'text-blue-700'} font-semibold text-xs transition-colors duration-300 hover:text-red-800`}>Discover</span>
        </Link>
        <Link href="/airdrops" className="block text-center">
          <FaParachuteBox className={`m-auto ${isActiveLink('/airdrops') ? 'text-orange-600' : 'text-red-800'} transition-colors duration-300 hover:text-blue-700`} />
          <span className={`${isActiveLink('/airdrops') ? 'text-orange-600' : 'text-blue-700'} font-semibold text-xs transition-colors duration-300 hover:text-red-800`}>Airdrops</span>
        </Link>
        <Link href="/token-farming" className="block text-center">
          <FaCoins className={`m-auto ${isActiveLink('/token-farming') ? 'text-orange-600' : 'text-red-800'} transition-colors duration-300 hover:text-blue-700`} />
          <span className={`${isActiveLink('/token-farming') ? 'text-orange-600' : 'text-blue-700'} font-semibold text-xs transition-colors duration-300 hover:text-red-800`}>Farming</span>
        </Link>
        <Link href="/academy" className="block text-center">
          <FaBookOpen className={`m-auto ${isActiveLink('/academy') ? 'text-orange-600' : 'text-red-800'} transition-colors duration-300 hover:text-blue-700`} />
          <span className={`${isActiveLink('/academy') ? 'text-orange-600' : 'text-blue-700'} font-semibold text-xs transition-colors duration-300 hover:text-red-800`}>Academy</span>
        </Link>
        <Link href="/about" className="block text-center">
          <FaBookReader className={`m-auto ${isActiveLink('/about') ? 'text-orange-600' : 'text-red-800'} transition-colors duration-300 hover:text-blue-700`} />
          <span className={`${isActiveLink('/about') ? 'text-orange-600' : 'text-blue-700'} font-semibold text-xs transition-colors duration-300 hover:text-red-800`}>About</span>
        </Link>

       

        {/* <Menu as="div" className="relative inline-block text-left">
          <MenuButton className={`block text-center transition-all duration-300 ${isActiveParentLink(['/airdrops', '/token-farming']) ? 'text-orange-600' : ''} hover:text-blue-700 active:scale-95`}>
            <FaParachuteBox className={`m-auto ${isActiveParentLink(['/airdrops', '/token-farming']) ? 'text-orange-600' : 'text-red-800'} transition-colors duration-300 hover:text-blue-700`} />
            <span className={`${isActiveParentLink(['/airdrops', '/token-farming']) ? 'text-orange-600' : 'text-blue-700'} font-semibold text-sm transition-colors duration-300 hover:text-red-800`}>Airdrops</span>
          </MenuButton>
          <MenuItems className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-40 bg-white shadow-lg rounded-md">
            <MenuItem>
              {({ active }) => (
                <Link href="/airdrops" className={`block px-4 py-2 ${isActiveLink('/airdrops') ? 'text-orange-600' : 'text-blue-700'} transition-colors duration-300 hover:bg-gray-100`}>
                  Airdrop
                </Link>
              )}
            </MenuItem>
            <MenuItem>
              {({ active }) => (
                <Link href="/token-farming" className={`block px-4 py-2 ${isActiveLink('/token-farming') ? 'text-orange-600' : 'text-blue-700'} transition-colors duration-300 hover:bg-gray-100`}>
                  Farming
                </Link>
              )}
            </MenuItem>
          </MenuItems>
        </Menu> */}

       {/*  <Link href="/games" className={`block text-center transition-all duration-300 ${isActiveLink('/games') ? 'text-orange-600' : ''} hover:text-blue-700 active:scale-95`}>
          <FaGamepad className={`m-auto ${isActiveLink('/games') ? 'text-orange-600' : 'text-red-800'} transition-colors duration-300 hover:text-blue-700`} />
          <span className={`${isActiveLink('/games') ? 'text-orange-600' : 'text-blue-700'} font-semibold text-sm transition-colors duration-300 hover:text-red-800`}>Games</span>
        </Link>

        <Link href="/platforms" className={`block text-center transition-all duration-300 ${isActiveLink('/platforms') ? 'text-orange-600' : ''} hover:text-blue-700 active:scale-95`}>
          <FaVideo className={`m-auto ${isActiveLink('/platforms') ? 'text-orange-600' : 'text-red-800'} transition-colors duration-300 hover:text-blue-700`} />
          <span className={`${isActiveLink('/platforms') ? 'text-orange-600' : 'text-blue-700'} font-semibold text-sm transition-colors duration-300 hover:text-red-800`}>Platforms</span>
        </Link> */}

       {/*  <Menu as="div" className="relative inline-block text-left">
          <MenuButton className={`block text-center transition-all duration-300 ${isActiveParentLink(['/academy', '/crypto-news', '/about']) ? 'text-orange-600' : ''} hover:text-blue-700 active:scale-95`}>
            <FaBookReader className={`m-auto ${isActiveParentLink(['/academy', '/crypto-news', '/about']) ? 'text-orange-600' : 'text-red-800'} transition-colors duration-300 hover:text-blue-700`} />
            <span className={`${isActiveParentLink(['/academy', '/crypto-news', '/about']) ? 'text-orange-600' : 'text-blue-700'} font-semibold text-sm transition-colors duration-300 hover:text-red-800`}>Learn</span>
          </MenuButton>
          <MenuItems className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-40 bg-white shadow-lg rounded-md">
            <MenuItem>
              {({ active }) => (
                <Link href="/academy" className={`block px-4 py-2 ${isActiveLink('/academy') ? 'text-orange-600' : 'text-blue-700'} transition-colors duration-300 hover:bg-gray-100`}>
                  Academy
                </Link>
              )}
            </MenuItem>
            <MenuItem>
              {({ active }) => (
                <Link href="/crypto-news" className={`block px-4 py-2 ${isActiveLink('/crypto-news') ? 'text-orange-600' : 'text-blue-700'} transition-colors duration-300 hover:bg-gray-100`}>
                  News
                </Link>
              )}
            </MenuItem>
            <MenuItem>
              {({ active }) => (
                <Link href="/about" className={`block px-4 py-2 ${isActiveLink('/about') ? 'text-orange-600' : 'text-blue-700'} transition-colors duration-300 hover:bg-gray-100`}>
                  About
                </Link>
              )}
            </MenuItem>
          </MenuItems>
        </Menu> */}
      </div>
    </nav>
  );
}
