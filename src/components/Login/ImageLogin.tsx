'use client';
import { useTheme } from '@/context/ThemeContext';
import Image from 'next/image';
import React from 'react';
import { LoadingImage } from '../LazyLoading/LoadingImage';

function ImageLogin() {
  const { theme } = useTheme();

  return (
    <div
      className={`w-full  flex flex-col items-center justify-center py-20 lg:py-0 px-20 ${
        theme === 'dark' ? 'bg-white' : 'bg-toscaSoft'
      }`}
    >
      <LoadingImage
        className="dark:invert w-80 h-auto aspect-auto"
        src="/images/AssetLogin.png"
        alt="Login Image"
        width={180}
        height={38}
      />
    </div>
  );
}

export default ImageLogin;
