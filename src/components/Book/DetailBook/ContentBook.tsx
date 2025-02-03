'use client';
import { LoadingImage } from '@/components/LazyLoading/LoadingImage';
import { useTheme } from '@/context/ThemeContext';
import useBook from '@/hooks/useBook';
import { useRouter } from '@/i18n/routing';
import { CategoryType } from '@/types/BookType';
import { SessionType } from '@/types/SessionType';
import { Spinner } from '@material-tailwind/react';
import React from 'react';
import { ApiUrl } from '../../../../config/config';

interface Props {
  session: SessionType;
  slug: string;
}

function ContentBook({ session, slug }: Props) {
  const {
    dataBookId,
    errorDataBookId,
    isLoadingBookId,
    loading,
    handleStatusBook,
  } = useBook(session.accessToken, slug);

  const { theme } = useTheme();
  const router = useRouter();

  return (
    <div className="flex flex-col items-center py-4 ">
      {/* Heading */}
      <h1 className="text-3xl font-semibold   mb-8">Book Details</h1>

      {isLoadingBookId ? (
        <div className="flex justify-center items-center">
          <Spinner className="w-12 h-12 text-blue-500" />
        </div>
      ) : errorDataBookId ? (
        <div className="text-red-500 text-center">
          <p>{errorDataBookId.message}</p>
        </div>
      ) : (
        <div
          className={` w-full   shadow-lg rounded-lg p-6 ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-white'
          }`}
        >
          {/* Category Image */}
          <div className="relative w-full h-64 mb-6 overflow-hidden rounded-lg">
            {dataBookId && (
              <LoadingImage
                src={`${ApiUrl}/api/files/get?filename=${encodeURIComponent(
                  dataBookId?.data?.coverImage,
                )}`}
                alt={dataBookId?.data.title}
                className="object-cover w-full h-full"
                width={500}
                height={200}
              />
            )}
            <div className="absolute inset-0 bg-black opacity-40" />
          </div>

          {/* Category Title */}
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">
              {dataBookId?.data.title}
            </h2>
            <p className="text-lg ">Explore our collection</p>

            {dataBookId && (
              <>
                <p
                  className={`p-2 w-80 rounded-md text-center mx-auto mt-1 ${
                    dataBookId?.data?.UserBookStatus?.length === 0
                      ? 'bg-gray-800'
                      : dataBookId?.data?.UserBookStatus?.[0]?.status ===
                        'COMPLETED'
                      ? 'bg-green-400'
                      : 'bg-blue-500'
                  } text-white`}
                >
                  {dataBookId?.data?.UserBookStatus?.length === 0
                    ? 'Belum dibaca'
                    : dataBookId?.data?.UserBookStatus?.[0]?.status ===
                      'COMPLETED'
                    ? 'Selesai'
                    : 'Sedang Dibaca'}
                </p>

                <div className="flex flex-row mt-1 gap-2 text-center   justify-center flex-wrap">
                  {dataBookId.data.categories.map((category: CategoryType) => (
                    <p
                      className="text-xs  text-white rounded-md text-center  py-1 px-4 bg-gray-800 whitespace-nowrap "
                      key={category.id}
                    >
                      {category.name}
                    </p>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Book Details */}
          <div className="mt-8 space-y-4">
            <div className="flex justify-between items-center">
              <span className=" font-semibold">Author:</span>
              <span>{dataBookId?.data.author}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className=" font-semibold">ISBN:</span>
              <span>{dataBookId?.data.isbn}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 sm:mt-8 sm:flex justify-center gap-4">
            <button
              className="flex flex-row gap-2 justify-center item-center bg-blue-500 -ml-1 w-full text-white px-6 py-2 rounded-lg hover:bg-blue-400 transition duration-300"
              onClick={() =>
                handleStatusBook(session.accessToken, slug, 'COMPLETED')
              }
            >
              {loading && <Spinner className="w-4 h-4 text-white" />}Tandai
              telah selesai baca
            </button>
            <button
              onClick={() => router.push('/book')}
              className="bg-gray-200 w-full -ml-1 px-6 py-2 rounded-lg hover:bg-gray-300 transition duration-300"
            >
              View More Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ContentBook;
