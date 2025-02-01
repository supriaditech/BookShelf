import { useState } from 'react';
import Image from 'next/image';
import { Spinner } from '@material-tailwind/react';

interface LoadingImageType {
  src: string;
  alt: string;
  width: number | `${number}`;
  height: number | `${number}`;
  className?: string;
  imageClassName?: string;
  onLoadingComplete?: () => void;
}
// Custom Image Loader with Overlay and Loading Indicator
export const LoadingImage = ({
  src,
  alt,
  width,
  height,
  className,
  imageClassName,
  onLoadingComplete = () => {},
}: LoadingImageType) => {
  const [isLoading, setIsLoading] = useState(true);
  // Fungsi untuk menangani ketika gambar selesai dimuat
  const handleLoad = () => {
    // Tambahkan delay sebelum menghilangkan loading indicator
    setIsLoading(false);
    onLoadingComplete();
  };
  return (
    <div className={`${className}`}>
      <div className={`relative w-full h-full overflow-hidden`}>
        {isLoading && (
          <div className="absolute top-0 left-0 z-10 flex items-center justify-center w-full h-full bg-gray-200">
            <Spinner />
          </div>
        )}
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={`object-cover w-full h-full transition-transform duration-300 transform ${imageClassName}`}
          onLoad={handleLoad}
          unoptimized={true}
          priority
        />
      </div>
    </div>
  );
};
