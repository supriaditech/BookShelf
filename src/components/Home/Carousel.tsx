'use client';
import React from 'react';
import { Carousel } from '@material-tailwind/react';
import {
  prevArrow,
  nextArrow,
  navigation,
  slideRef,
  transition,
} from '@material-tailwind/react/types/components/carousel';
import { LoadingImage } from '../LazyLoading/LoadingImage';

interface CarouselSlides {
  key: string;
  bannerUrl: string;
  alt: string;
  url?: string | null;
}

interface CarouselProps {
  height?: number | `${number}`;
  width?: number | `${number}`;
  className?: string;
  prevArrow?: prevArrow;
  nextArrow?: nextArrow;
  navigation?: navigation;
  slideRef?: slideRef;
  autoplay?: boolean;
  autoplayDelay?: number;
  transition?: transition;
  loop?: boolean;
}

function CarouselScreen({
  height = 1920,
  width = 500,
  className,
  prevArrow,
  nextArrow,
  navigation,
  slideRef,
  autoplay = true,
  autoplayDelay = 4000,
  transition,
  loop = true,
}: CarouselProps) {
  return (
    <div>
      <Carousel
        prevArrow={prevArrow}
        nextArrow={nextArrow}
        navigation={navigation}
        slideRef={slideRef}
        autoplay={autoplay}
        autoplayDelay={autoplayDelay}
        transition={transition}
        loop={loop}
        className={className}
      >
        <LoadingImage
          src={'/images/Banner1.png'}
          alt={'image 1'}
          className="object-cover w-full h-[500px] "
          height={height}
          width={width}
        />
        <LoadingImage
          src={'/images/Banner2.png'}
          alt={'image 1'}
          className="object-cover w-full h-[500px] "
          height={height}
          width={width}
        />
        <LoadingImage
          src={'/images/Banner3.png'}
          alt={'image 1'}
          className="object-cover w-full h-[500px] "
          height={height}
          width={width}
        />
      </Carousel>
    </div>
  );
}

export default CarouselScreen;
