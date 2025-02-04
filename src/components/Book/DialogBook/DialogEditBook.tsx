import { useTranslations } from 'next-intl';
import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Spinner,
} from '@material-tailwind/react';
import useBook from '@/hooks/useBook';
import { useCategories } from '@/hooks/useCategories';
import { ToastContainer } from 'react-toastify';
import { ApiUrl } from '../../../../config/config';

interface Props {
  openEdit: boolean;
  handleOpenEdit: () => void;
  token: string;
  dataEdit: any; // Data kategori yang akan diedit
}

const DialogEditBook: React.FC<Props> = ({
  openEdit,
  token,
  handleOpenEdit,
  dataEdit,
}) => {
  const t = useTranslations();
  const {
    setPreview,
    preview,
    register,
    handleSubmit,
    reset,
    setValue,
    errors,
    handleEditBook,
    handleFileChange,
    isLoading,
  } = useBook(token);
  const [showCategories, setShowCategories] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryNames, setSelectedCategoryNames] = useState<string[]>(
    [],
  );
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const { listCategories } = useCategories(token);

  const filteredCategories = listCategories?.data.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  React.useEffect(() => {
    if (openEdit && dataEdit) {
      // Reset form fields dengan dataEdit
      reset({
        title: dataEdit.title,
        author: dataEdit.author,
        isbn: dataEdit.isbn,
        categoryIds: dataEdit.categories.map((category: any) => category.id), // Set categoryIds
      });

      setSelectedCategories(
        dataEdit.categories.map((category: any) => category.id),
      );
      setSelectedCategoryNames(
        dataEdit.categories.map((category: any) => category.name),
      );

      // Set preview gambar jika ada
      setPreview(dataEdit.coverImage);
    }
  }, [openEdit, dataEdit, reset]);

  const onSubmit = async (data: any) => {
    data.categoryIds = selectedCategories;
    setValue('id', dataEdit.id);
    await handleEditBook(data);
    handleOpenEdit();
    reset();
    setPreview(null);
  };

  const idBook =
    t('ID Book') + dataEdit !== null || dataEdit !== undefined
      ? dataEdit?.id
      : '-';

  const showListCategory = () => {
    setSearchTerm('');
    setShowCategories(!showCategories);
  };

  const handleCategoryChange = (categoryId: number, categoryName: string) => {
    setSelectedCategories((prev) => {
      if (prev.includes(categoryId)) {
        return prev.filter((id) => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });

    setSelectedCategoryNames((prev: any) => {
      if (prev.includes(categoryName)) {
        return prev.filter(
          (categoryName: string) => categoryName !== categoryName,
        );
      } else {
        return [...prev, categoryName];
      }
    });
  };

  const handleClose = () => {
    handleOpenEdit();
    setPreview(null);
  };
  return (
    <Dialog open={openEdit} handler={handleOpenEdit}>
      <DialogBody className="max-h-[700px] sm:max-h-[800px] md:max-h-[700px] lg:max-h-[800px] overflow-y-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input
            crossOrigin={undefined}
            type="text" // atau type="hidden"
            label="ID" // Opsional
            value={idBook}
            {...register('id')}
            disabled
          />
          <Input
            crossOrigin={undefined}
            label={t('Title')}
            {...register('title', { required: true })}
            error={!!errors.title}
          />
          {errors.title && (
            <p className="text-red-500">{t('Title is required')}</p>
          )}
          <Input
            crossOrigin={undefined}
            label={t('Author')}
            {...register('author', { required: true })}
            error={!!errors.author}
          />
          {errors.author && (
            <p className="text-red-500">{t('Author is required')}</p>
          )}
          <Input
            crossOrigin={undefined}
            type="text"
            label={t('ISBN')}
            {...register('isbn', { required: true })}
            error={!!errors.isbn}
          />
          {errors.isbn && (
            <p className="text-red-500">{t('ISBN is required')}</p>
          )}

          <div>
            <div
              className="p-2 bg-blue-500 rounded-md text-white cursor-pointer flex items-center justify-between"
              onClick={showListCategory}
            >
              {t('Select Categories')}
              <span>{showCategories ? '▲' : '▼'}</span>
            </div>
            {selectedCategoryNames.length > 0 && (
              <div className="flex flex-row mt-1 gap-2 flex-wrap">
                {selectedCategoryNames.map((item: any, index: number) => (
                  <div
                    className="text-sm text-white rounded-md px-4 py-1 bg-gray-800 flex items-center justify-between"
                    key={index}
                  >
                    {item}
                    <div
                      className="ml-2 text-red-500 cursor-pointer"
                      onClick={() => {
                        setSelectedCategories((prev) =>
                          prev.filter((_, i) => i !== index),
                        );
                        setSelectedCategoryNames((prev) =>
                          prev.filter((_, i) => i !== index),
                        );
                      }}
                    >
                      ×
                    </div>
                  </div>
                ))}
              </div>
            )}

            {showCategories && (
              <div className="w-full border rounded mt-2 max-h-60  bg-white">
                <Input
                  crossOrigin={undefined}
                  type="text"
                  placeholder={t('Searching Categories')}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  value={searchTerm}
                  className="border-b"
                />
                <div className="overflow-y-auto max-h-40   bg-white">
                  {filteredCategories?.map((category) => (
                    <div
                      key={category.id}
                      className={`p-2 cursor-pointer  ${
                        selectedCategories.includes(category.id)
                          ? 'bg-gray-300'
                          : ''
                      }`}
                      onClick={() =>
                        handleCategoryChange(category.id, category.name)
                      }
                    >
                      {category.name}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Input
            crossOrigin={undefined}
            type="file"
            label={t('Cover Image')}
            {...register('coverImage', { required: true })}
            error={!!errors.coverImage}
            onChange={handleFileChange}
          />
          {errors.coverImage && (
            <p className="text-red-500">{t('Cover Image is required')}</p>
          )}

          {/* Menampilkan preview gambar jika ada */}
          {preview && (
            <div className="mt-4">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-auto"
                onError={(e) => {
                  const target = e.target as HTMLImageElement; // Casting target ke HTMLImageElement
                  target.src = `${ApiUrl}/api/files/get?filename=${encodeURIComponent(
                    preview,
                  )}`; // Ganti src dengan preview jika error
                }}
              />
            </div>
          )}

          <DialogFooter>
            <Button
              type="submit"
              color="green"
              className="flex flex-row justify-center items-center gap-2"
            >
              {isLoading && <Spinner className="h-4 w-4" />}
              {t('Submit')}
            </Button>
            <Button color="red" onClick={handleClose}>
              {t('Cancel')}
            </Button>
          </DialogFooter>
        </form>
        <ToastContainer
          className="absolute z-[99999] top-0 left-0"
          position="top-center"
          autoClose={5000}
          hideProgressBar
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </DialogBody>
    </Dialog>
  );
};

export default DialogEditBook;
