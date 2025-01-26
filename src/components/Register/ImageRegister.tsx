'use client';
import { useTheme } from '@/context/ThemeContext';
import Image from 'next/image';
import React from 'react';

function ImageRegister() {
  const { theme } = useTheme();

  return (
    <div
      className={`w-full  flex flex-col items-center justify-center py-20 lg:py-0 px-20 ${
        theme === 'dark' ? 'bg-white' : 'bg-toscaSoft'
      }`}
    >
      <Image
        className="dark:invert w-80 h-auto aspect-auto"
        src="/images/AssetRegister.png"
        alt="Register Image"
        width={180}
        height={38}
        priority
      />
    </div>
  );
}

export default ImageRegister;
