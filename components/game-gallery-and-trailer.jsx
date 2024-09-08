'use client'

import ReactPlayer from 'react-player/youtube';
import { Dialog, DialogPanel, DialogTitle, Description } from '@headlessui/react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import React, { useState, useEffect, useCallback } from 'react';

const GalleryAndTrailer = ({ trailer, gallery }) => {
    const [selectedImageIndex, setSelectedImageIndex] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
  
    useEffect(() => {
      const handleKeyDown = (event) => {
        if (event.key === 'Escape') {
          setIsModalOpen(false);
        } else if (event.key === 'ArrowLeft') {
          navigateImage(-1);
        } else if (event.key === 'ArrowRight') {
          navigateImage(1);
        }
      };
  
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);
  
    const openModal = (index) => {
      console.log('Opening modal with index:', index);
      setSelectedImageIndex(index);
      setIsModalOpen(true);
    };
  
    const navigateImage = (direction) => {
      if (gallery.length > 1) {
        setSelectedImageIndex((prevIndex) => {
          if (prevIndex === null) return 0;
          const newIndex = (prevIndex + direction + gallery.length) % gallery.length;
          return newIndex;
        });
      }
    };
  
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="lg:row-span-2">
            <div className="aspect-w-16 aspect-h-24 rounded-lg overflow-hidden shadow-lg h-[260px]">
              <ReactPlayer
                url={trailer}
                width="100%"
                height="100%"
                controls
                playing={false}
                light={true}
                playIcon={
                  <button className="bg-red-600 text-white rounded-full p-4 hover:bg-red-700 transition-colors duration-300">
                    Play Trailer
                  </button>
                }
              />
            </div>
          </div>
          
          {gallery.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {gallery.slice(0, 5).map((image, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative cursor-pointer overflow-hidden rounded-lg shadow-md ${
                    index === 4 ? 'col-span-2 sm:col-span-1' : ''
                  }`}
                  onClick={() => openModal(index)}
                >
                  <img
                    src={image}
                    alt={`Gallery image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </motion.div>
              ))}
              {gallery.length > 5 && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative cursor-pointer overflow-hidden rounded-lg shadow-md bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center"
                  onClick={() => openModal(5)}
                >
                  <span className="text-white text-xl font-bold">+{gallery.length - 5} More</span>
                </motion.div>
              )}
            </div>
          ) : (
            <div className="col-span-full flex items-center justify-center bg-gray-100 rounded-lg p-8">
              <p className="text-gray-500 text-lg">Gallery not available</p>
            </div>
          )}
        </div>
  
        <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className="relative z-50">
        <div className="fixed inset-0 flex items-center justify-center min-h-screen">
          <DialogPanel className="relative bg-white rounded-lg max-w-3xl w-full md:max-w-xl mx-4">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 z-10"
            >
              <X size={24} className='text-white bg-red-500 hover:bg-white hover:text-red-500 transition-all' />
            </button>
            {gallery.length > 0 && selectedImageIndex !== null && (
              <>
                <img
                  src={gallery[selectedImageIndex]}
                  alt={`Gallery image ${selectedImageIndex + 1}`}
                  className="w-full h-[300px] lg:h-[500px] rounded-lg"
                />
                <button
                  onClick={() => navigateImage(-1)}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition-all"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={() => navigateImage(1)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition-all"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}
          </DialogPanel>
        </div>
      </Dialog>
      </div>
    );
  };
  
export default GalleryAndTrailer;  