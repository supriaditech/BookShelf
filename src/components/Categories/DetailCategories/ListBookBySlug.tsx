'use client';
import { useCategories } from '@/hooks/useCategories';
import { SessionType } from '@/types/SessionType';
import { Button, Input, Spinner } from '@material-tailwind/react';
import React, { useState } from 'react';
import { LoadingImage } from '@/components/LazyLoading/LoadingImage';
import { useTranslations } from 'next-intl';

interface Props {
  session: SessionType;
  slug: string;
}

function ListBookBySlug({ session, slug }: Props) {
  const { dataBookCategory, errorDataBook, isLoadingDataBook } = useCategories(
    session.accessToken,
    slug,
  );
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
                  src={book.coverImage}
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
