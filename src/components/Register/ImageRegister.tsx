'use client';
import { useTheme } from '@/context/ThemeContext';
import Image from 'next/image';
import React from 'react';

function ImageRegister() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div
      className={`w-full  flex flex-col items-center justify-center px-20 ${
        theme === 'dark' ? 'bg-white' : 'bg-toscaSoft'
      }`}
    >
      <Image
        className="dark:invert w-80 h-auto aspect-auto"
        src="/images/AssetRegister.png"
        alt="Next.js logo"
        width={180}
        height={38}
        priority
      />
    </div>
  );
}

export default ImageRegister;
