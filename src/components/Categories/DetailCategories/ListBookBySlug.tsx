'use client';
import { useCategories } from '@/hooks/useCategories';
import { SessionType } from '@/types/SessionType';
import { Button, Input, Spinner } from '@material-tailwind/react';
import React, { useState } from 'react';
import { LoadingImage } from '@/components/LazyLoading/LoadingImage';
import { useTranslations } from 'next-intl';
import { useTheme } from '@/context/ThemeContext';
import useBook from '@/hooks/useBook';
import { useRouter } from '@/i18n/routing';
import { ApiUrl } from '../../../../config/config';

interface Props {
  session: SessionType;
  slug: string;
}

function ListBookBySlug({ session, slug }: Props) {
  const { dataBookCategory, errorDataBook, isLoadingDataBook } = useCategories(
    session.accessToken,
    slug,
  );
  const router = useRouter();
  const { loading, handleStatusBook } = useBook(session.accessToken);
  const { theme } = useTheme();
  const t = useTranslations();
  const [searchTerm, setSearchTerm] = useState('');
  // State untuk paginasi
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Jumlah buku per halaman

  // Menghitung total halaman
  const totalBooks = dataBookCategory?.books?.length || 0;
  const totalPages = Math.ceil(totalBooks / itemsPerPage);

  // Mengambil buku untuk halaman saat ini
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentBooks =
    dataBookCategory?.books?.slice(startIndex, startIndex + itemsPerPage) || [];

  // Filter buku berdasarkan pencarian (judul dan penulis)
  const filteredBooks = currentBooks.filter((book) => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return (
      book.title.toLowerCase().includes(lowerCaseSearchTerm) || // Pencarian berdasarkan judul
      book.author.toLowerCase().includes(lowerCaseSearchTerm) // Pencarian berdasarkan penulis
    );
  });

  const handleViewDetails = async (slug: number) => {
    await handleStatusBook(session.accessToken, slug, 'IN_PROGRESS');
    router.push(`/book/${slug}`);
  };
  return (
    <div>
      {isLoadingDataBook ? (
        <div className="flex flex-row gap-2 justify-center items-center">
          <div>
            <Spinner className="w-12 h-12 text-blue-500" />
          </div>
          <p className="text-xl font-bold">{t('loadingBook')}</p>
        </div>
      ) : errorDataBook ? (
        <div className="text-red-500 text-center">
          {t('Error loading books')} {errorDataBook.message}
        </div>
      ) : (
        <div>
          <div className="sm:flex flex-cols justify-between items-center">
            <h1 className="text-md sm:text-2xl  px-4 sm:px-0 font-bold">
              {dataBookCategory?.name}
            </h1>
            {/* Input Pencarian */}
            <div className="mt-4 px-4 sm:px-0">
              <Input
                crossOrigin={undefined}
                type="text"
                label={t('Search by title or author')}
                placeholder={t('Search by title or author')}
                className="w-full sm:w-80"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 px-4 sm:px-0 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {filteredBooks.map((book) => (
              <div key={book.id} className="border p-4 rounded shadow">
                <LoadingImage
                  src={`${ApiUrl}/api/files/get?filename=${encodeURIComponent(
                    book.coverImage,
                  )}`}
                  alt={book.title}
                  className="w-full h-32 object-cover rounded"
                  width={500}
                  height={200}
                />
                <h2 className="text-md sm:text-lg font-semibold mt-2">
                  {book.title}
                </h2>
                <p className="text-sm text-gray-500">
                  {t('Author')}: {book.author}
                </p>
                <p className="text-sm text-gray-500">
                  {t('ISBN')}: {book.isbn}
                </p>
                <p
                  className={`px-2 py-1 w-full mb-1 rounded-md  text-center  ${
                    book.UserBookStatus?.length === 0
                      ? 'bg-gray-800'
                      : book.UserBookStatus?.[0]?.status === 'COMPLETED'
                      ? 'bg-green-400'
                      : 'bg-blue-500'
                  } text-white`}
                >
                  Status :{' '}
                  {book.UserBookStatus?.length === 0
                    ? 'Belum dibaca'
                    : book.UserBookStatus?.[0]?.status === 'COMPLETED'
                    ? 'Selesai'
                    : 'Sedang Dibaca'}
                </p>
                <div
                  className={`flex w-full flex-row gap-2 items-center  border-2 ${
                    theme == 'dark'
                      ? 'bg-white text-black'
                      : 'bg-black text-white'
                  }bg-transparent  text-center p-2 justify-center rounded-md`}
                  onClick={() => handleViewDetails(book.id)}
                >
                  <p
                    className={`cursor-pointer ${
                      theme === 'dark' ? 'text-black' : 'text-white'
                    }  text-center`}
                  >
                    {t('Lihat buku')}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Paginasi */}
          <div className="flex justify-center items-center mt-4">
            <Button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            >
              {t('Previous')}
            </Button>
            <span>
              {t('Page')} {currentPage} {t('of')} {totalPages}
            </span>
            <Button
              disabled={currentPage === totalPages}
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
            >
              {t('Next')}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ListBookBySlug;
