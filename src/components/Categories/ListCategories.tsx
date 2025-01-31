'use client';
import { useCategories } from '@/hooks/useCategories';
import { SessionType } from '@/types/SessionType';
import { Button, Spinner } from '@material-tailwind/react';
import React from 'react';
import { LoadingImage } from '../LazyLoading/LoadingImage';
import { MdAddCircleOutline } from 'react-icons/md';
import DialogCategories from './Modal/DialogCategories';
import { FiEdit3 } from 'react-icons/fi';
import DialogEditCategories from './Modal/DialogEditCategories';
import { BiX } from 'react-icons/bi';
import { useTheme } from '@/context/ThemeContext';
import DialogDeleteCategories from './Modal/DialogDelete';
import { useTranslations } from 'next-intl';

const ITEMS_PER_PAGE = 6;

function ListCategories({ session }: { session: SessionType }) {
  const {
    listCategories,
    error,
    isLoading,
    handleOpen,
    open,
    openEdit,
    handleOpenEdit,
    handleOpenDelete,
    openDelete,
  } = useCategories(session.accessToken);
  const t = useTranslations();
  const [currentPage, setCurrentPage] = React.useState(1);
  const [dataEdit, setDataEdit] = React.useState();
  const [dataDelete, setDataDelete] = React.useState();
  const { theme } = useTheme();
  const totalPages = Math.ceil(
    (listCategories?.data?.length || 0) / ITEMS_PER_PAGE,
  );

  // Menghitung kategori yang akan ditampilkan pada halaman saat ini
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentCategories = listCategories?.data?.slice(startIndex, endIndex);

  const handleEditClick = (category: any) => {
    setDataEdit(category);
    handleOpenEdit();
  };

  const handleDeleteClick = (category: any) => {
    setDataDelete(category);
    handleOpenDelete();
  };

  return (
    <div>
      <div className="flex flex-row justify-between items-center overflow-scroll">
        <p className="text-2xl font-bold">{t('List Categories')}</p>
        <Button
          className="flex flex-row gap-2 items-center bg-green-500"
          onClick={handleOpen}
        >
          <MdAddCircleOutline className="w-6 h-6" />
          <p>{t('Tambah Category')}</p>
        </Button>
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
            {currentCategories && currentCategories.length > 0 ? (
              <ul className="grid grid-cols-3 gap-6 p-4">
                {currentCategories.map((category) => (
                  <li
                    key={category.id}
                    className="relative border p-4 rounded shadow flex-none w-full " // Setel lebar kategori
                  >
                    <LoadingImage
                      src={category.photo}
                      alt={category.name}
                      className="w-full h-32 object-cover rounded"
                      width={500}
                      height={200}
                    />
                    <div className="flex flex-row justify-between items-center">
                      <div>
                        <h2 className="text-lg font-semibold mt-2">
                          {category.name}
                        </h2>
                        <p className="text-sm text-gray-500">{category.slug}</p>
                      </div>
                      <Button
                        className="flex flex-row gap-2 items-center  border-2 border-blue-500 bg-transparent text-blue-500"
                        onClick={() => handleEditClick(category)}
                      >
                        <FiEdit3 className="w-6 h-6" />
                        <p>{t('Edit Category')}</p>
                      </Button>
                    </div>
                    <div
                      className={`flex w-full flex-row gap-2 items-center  border-2 ${
                        theme == 'dark'
                          ? 'bg-white text-black'
                          : 'bg-black text-white'
                      }bg-transparent  text-center p-2 justify-center rounded-md`}
                      onClick={() => handleEditClick(category)}
                    >
                      <p
                        className={`${
                          theme === 'dark' ? 'text-black' : 'text-white'
                        }  text-center`}
                      >
                        {t('Lihat Selengkapnya')}
                      </p>
                    </div>
                    <div
                      className="-top-4 -right-4 rounded-full text-white absolute bg-red-500 p-2"
                      onClick={() => handleDeleteClick(category)}
                    >
                      <BiX className="w-6 h-6" />
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex flex-col border border-gray-200 justify-center items-center gap-1 p-20">
                <p>{t('No categories found.')}</p>
              </div>
            )}
          </>
        )}

        {/* Paginasi */}
        <div className="flex gap-4 items-center mt-4 justify-center   ">
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

        <DialogCategories
          open={open}
          handleOpen={handleOpen}
          token={session?.accessToken}
        />

        <DialogEditCategories
          dataEdit={dataEdit}
          handleOpenEdit={handleOpenEdit}
          openEdit={openEdit}
          token={session?.accessToken}
        />

        <DialogDeleteCategories
          dataDelete={dataDelete}
          handleOpenDelete={handleOpenDelete}
          token={session?.accessToken}
          openDelete={openDelete}
        />
      </div>
    </div>
  );
}

export default ListCategories;
