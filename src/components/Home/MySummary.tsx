'use client';
import { useTheme } from '@/context/ThemeContext';
import React from 'react';
import { BiSolidBookBookmark } from 'react-icons/bi';
import { FaBook } from 'react-icons/fa';
import { FaBookOpenReader } from 'react-icons/fa6';

function MySummary() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className=" container  sm:mx-auto  mt-10 px-4 ">
      <p className="text-2xl font-bold">My Summary</p>
      <div className="grid sm:grid-cols-3 gap-4 mt-4 ">
        <div
          className={`${
            theme === 'dark'
              ? 'bg-white text-blue-500'
              : 'bg-blue-500 text-white'
          } p-4 sm:p-6 lg:p-10 rounded-md flex flex-row items-center gap-2 w-full`}
        >
          <FaBook className="w-12 h-12" />
          <div>
            <p className="text-sm sm:text-base">Total Buku</p>
            <p className="font-bold text-base sm:text-lg">Jumlah : 3</p>
          </div>
        </div>
        <div
          className={`${
            theme === 'dark'
              ? 'bg-white text-blue-500'
              : 'bg-blue-500 text-white'
          } p-4 sm:p-6 lg:p-10 rounded-md flex flex-row items-center gap-2`}
        >
          <FaBookOpenReader className="w-12 h-12" />
          <div>
            <p className="text-sm sm:text-base">Sedang di baca</p>
            <p className="font-bold text-base sm:text-lg">Jumlah : 3</p>
          </div>
        </div>
        <div
          className={`${
            theme === 'dark'
              ? 'bg-white text-blue-500'
              : 'bg-blue-500 text-white'
          } p-4 sm:p-6 lg:p-10 rounded-md flex flex-row items-center gap-2`}
        >
          <BiSolidBookBookmark className="w-12 h-12" />
          <div>
            <p className="text-sm sm:text-base">Selesai di baca</p>
            <p className="font-bold text-base sm:text-lg">Jumlah : 3</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MySummary;
