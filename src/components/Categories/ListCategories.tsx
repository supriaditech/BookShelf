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
import { useRouter } from '@/i18n/routing';
import { ApiUrl } from '../../../config/config';

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
  const router = useRouter();
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

  const handleViewDetails = (slug: string) => {
    router.push(`/categories/${slug}`); // Navigate to the dynamic route
  };
  return (
    <div>
      <div className="flex flex-row justify-between items-center px-8 sm:px-0">
        <p className="text-lg sm:text-2xl font-bold ">
          {t('List Categories')} ({listCategories?.data?.length || 0})
        </p>
        <Button
          className="flex flex-row gap-2 items-center bg-green-500 -mr-2 sm:mr-0"
          onClick={handleOpen}
        >
          <MdAddCircleOutline className="w-6 h-6" />
          <p>{t('Tambah Category')}</p>
        </Button>
      </div>
      <div className="mt-4">
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
              <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 px-8 sm:px-4 lg::px-0 gap-6 p-4">
                {currentCategories.map((category) => (
                  <li
                    key={category.id}
                    className="relative border p-4 rounded shadow flex-none w-full " // Setel lebar kategori
                  >
                    <LoadingImage
                      src={`${ApiUrl}/api/files/get?filename=${encodeURIComponent(
                        category.photo,
                      )}`}
                      alt={category.name}
                      className="w-full h-32 object-cover rounded"
                      width={500}
                      height={200}
                    />
                    <div className="grid grid-cols-2 justify-between items-center">
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
                      onClick={() => handleViewDetails(category.slug)}
                    >
                      <p
                        className={`cursor-pointer ${
                          theme === 'dark' ? 'text-black' : 'text-white'
                        }  text-center`}
                      >
                        {t('Lihat Selengkapnya')}
                      </p>
                    </div>
                    <div
                      className="cursor-pointer -top-4 -right-4 rounded-full text-white absolute bg-red-500 p-2"
                      onClick={() => handleDeleteClick(category)}
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
