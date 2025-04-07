'use client';
import React, { useState } from 'react';

interface NewsTileProps {
  title: string;
  article_link: string;
  img_src_link: string;
  sector?: string;
}

const NewsTile: React.FC<NewsTileProps> = ({ title, article_link, img_src_link, sector }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <>
      <div
        onClick={openModal}
        className="cursor-pointer bg-white rounded-lg shadow-md overflow-hidden hover:scale-105 transition-transform duration-300 h-full flex flex-col"
      >
        <img src={img_src_link} alt="Stock" className="w-full h-48 object-cover" />
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            <span className="text-sm font-semibold text-[#adc178] uppercase">{sector}</span>
            <h3 className="text-lg font-bold text-gray-800 mt-2">{title}</h3>
          </div>
          <p className="text-sm text-gray-500 mt-2">Click to preview article</p>
        </div>
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-lg w-full relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-4 text-gray-500 hover:text-red-500 text-2xl"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-2">{title}</h2>
            <p className="text-sm text-gray-600 mb-4">Sector: <strong>{sector || "General"}</strong></p>
            <a
              href={article_link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Read full article →
            </a>
          </div>
        </div>
      )}
    </>
  );
};

export default NewsTile;