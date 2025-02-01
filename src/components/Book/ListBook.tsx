'use client';
import { useCategories } from '@/hooks/useCategories';
import { SessionType } from '@/types/SessionType';
import { Button, Input, Spinner } from '@material-tailwind/react';
import React, { useState } from 'react';
import { LoadingImage } from '../LazyLoading/LoadingImage';
import { MdAddCircleOutline } from 'react-icons/md';
import { FiEdit3 } from 'react-icons/fi';
import { BiX } from 'react-icons/bi';
import { useTheme } from '@/context/ThemeContext';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import useBook from '@/hooks/useBook';
import { CategoryType } from '@/types/BookType';
import DialogCreateBook from './DialogBook/DialogCreateBook';
import DialogEditBook from './DialogBook/DialogEditBook';
import DialogDeleteBook from './DialogBook/DialogDeleteBook';

const ITEMS_PER_PAGE = 6;

function ListBook({ session }: { session: SessionType }) {
  const { handleOpenDelete, openDelete } = useCategories(session.accessToken);

  const {
    listDataBook,
    error,
    isLoading,
    open,
    handleOpen,
    openEdit,
    handleOpenEdit,
    loading,
    handleStatusBook,
  } = useBook(session.accessToken);
  const t = useTranslations();
  const router = useRouter();
  const [currentPage, setCurrentPage] = React.useState(1);
  const [dataEdit, setDataEdit] = React.useState();
  const [dataDelete, setDataDelete] = React.useState();
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = React.useState('');
  const totalPages = Math.ceil(
    (listDataBook?.data?.length || 0) / ITEMS_PER_PAGE,
  );

  // Menghitung kategori yang akan ditampilkan pada halaman saat ini
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentDataBook = listDataBook?.data?.slice(startIndex, endIndex);

  const handleEditClick = (Book: any) => {
    setDataEdit(Book);
    handleOpenEdit();
  };

  const handleDeleteClick = (Book: any) => {
    setDataDelete(Book);
    handleOpenDelete();
  };

  const handleViewDetails = async (slug: number) => {
    await handleStatusBook(session.accessToken, slug, 'IN_PROGRESS');
    router.push(`/book/${slug}`);
  };

  const filteredBooks = currentDataBook?.filter((book) => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return (
      book.title.toLowerCase().includes(lowerCaseSearchTerm) || // Pencarian berdasarkan judul
      book.author.toLowerCase().includes(lowerCaseSearchTerm) // Pencarian berdasarkan penulis
    );
  });
  return (
    <div>
      <div className="sm:flex flex-row justify-between items-center  px-8 sm:px-0">
        <p className="text-base sm:text-xl font-bold ">
          {t('List Book')} ({listDataBook?.data?.length || 0})
        </p>
        <div className="flex flex-row gap-2 justify-center items-center">
          <div className=" ">
            <Input
              crossOrigin={undefined}
              type="text"
              label={t('Search by title or author')}
              placeholder={t('Search by title or author')}
              className="w-fullh-full sm:w-80"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button
            size="sm"
            className="flex flex-row gap-2 items-center bg-green-500 -mr-2 sm:mr-0"
            onClick={handleOpen}
          >
            <MdAddCircleOutline className="w-6 h-6" />
            <p className="text-sm sm:text-base">{t('Tambah buku')}</p>
          </Button>
        </div>
      </div>
      <div className="mt-4 overflow-x-auto">
        {error && (
          <div className="flex flex-col border border-gray-200 justify-center items-center gap-1 p-20">
            <p>Error loading categories: {error.message}</p>
          </div>
        )}

        {isLoading ? (
          <div className="flex flex-col border border-gray-200 justify-center items-center gap-1 p-20">
            <Spinner className="w-12 h-12 text-blue-500" />
            <p>Loading categories...</p>
          </div>
        ) : (
          <>
            {filteredBooks && filteredBooks.length > 0 ? (
              <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 px-8 sm:px-4 lg::px-0 gap-6 p-4">
                {filteredBooks.map((book) => (
                  <li
                    key={book.id}
                    className="relative border p-4 rounded shadow flex-none w-full "
                  >
                    <div className="grid grid-cols-4 gap-2 ">
                      <LoadingImage
                        src={book.coverImage}
                        alt={book.title}
                        className=" col-span-1 w-full h-36 rounded-md object-cover "
                        width={500}
                        height={200}
                      />
                      <div className="col-span-3">
                        <h2 className="text-lg font-semibold ">{book.title}</h2>
                        <p className="text-sm text-gray-800">
                          {t('Author')} : {book.author}
                        </p>
                        <p className="text-sm text-gray-800">
                          {t('ISBN')} : {book.isbn}
                        </p>
                        <p className="text-sm font-bold ">
                          {t('Categories')} :
                        </p>

                        <div className="flex flex-row mt-1 gap-2 flex-wrap">
                          {book.categories.map((category: CategoryType) => (
                            <p
                              className="text-[10px]  text-white rounded-md  px-4 bg-gray-800 whitespace-nowrap "
                              key={category.id}
                            >
                              {category.name}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex my-1 flex-row justify-between items-center">
                      <p
                        className={`px-2 py-1 w-60 rounded-md  text-center  ${
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
                        className=" px-2 py-1  flex flex-row gap-2 items-center  border-2 border-blue-500 bg-transparent text-sm text-blue-500 rounded-md"
                        onClick={() => handleEditClick(book)}
                      >
                        <FiEdit3 />
                        <p>{t('Edit')}</p>
                      </div>
                    </div>
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
                    <div
                      className="cursor-pointer -top-4 -right-4 rounded-full text-white absolute bg-red-500 p-2"
                      onClick={() => handleDeleteClick(book)}
                    >
                      <BiX className="w-6 h-6" />
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex flex-col border border-gray-200 justify-center items-center gap-1 p-20">
                <p>{t('No categories found')}.</p>
              </div>
            )}
          </>
        )}

        {/* Paginasi */}
        <div className="flex gap-4 items-center mt-4 justify-center   ">
          <Button
            className={`${
              theme == 'dark' ? 'bg-white text-black' : 'bg-gray-800 text-white'
            }`}
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          >
            {t('Previous')}
          </Button>
          <span>
            {t('Page')} {currentPage} {t('of')} {totalPages}
          </span>
          <Button
            className={`${
              theme == 'dark' ? 'bg-white text-black' : 'bg-gray-800 text-white'
            }`}
            disabled={currentPage >= totalPages}
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
          >
            {t('Next')}
          </Button>
        </div>
        {open && (
          <DialogCreateBook
            open={open}
            handleOpen={handleOpen}
            token={session?.accessToken}
          />
        )}

        {dataEdit && (
          <DialogEditBook
            dataEdit={dataEdit}
            handleOpenEdit={handleOpenEdit}
            openEdit={openEdit}
            token={session?.accessToken}
          />
        )}

        {dataDelete && (
          <DialogDeleteBook
            dataDelete={dataDelete}
            handleOpenDelete={handleOpenDelete}
            token={session?.accessToken}
            openDelete={openDelete}
          />
        )}
      </div>
    </div>
  );
}

export default ListBook;
