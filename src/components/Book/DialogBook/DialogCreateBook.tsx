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
import { useTranslations } from 'use-intl';
import { useCategories } from '@/hooks/useCategories';

interface Props {
  open: boolean;
  handleOpen: () => void;
  token: string;
}

const DialogCreateBook: React.FC<Props> = ({ handleOpen, open, token }) => {
  const t = useTranslations();
  const {
    setPreview,
    preview,
    register,
    handleSubmit,
    reset,
    setValue,
    errors,
    handleCreateBook,
    handleFileChange,
    loading,
  } = useBook(token);
  const { listCategories } = useCategories(token);

  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedCategoryNames, setSelectedCategoryNames] = useState<string[]>(
    [],
  );

  const [showCategories, setShowCategories] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const onSubmit = async (data: any) => {
    data.categoryIds = selectedCategories;
    setValue('readingStatus', 'NOT_STARTED');
    await handleCreateBook(data);
    handleOpen();
    reset();
    setPreview(null);
    setSelectedCategories([]);
    setSelectedCategoryNames([]);
    setShowCategories(false);
  };

  const handleClose = () => {
    handleOpen();
    setPreview(null);
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

  const filteredCategories = listCategories?.data.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const showListCategory = () => {
    setSearchTerm('');
    setShowCategories(!showCategories);
  };

  return (
    <Dialog open={open} handler={handleClose}>
      <DialogHeader>{t('Tambah Buku')}</DialogHeader>
      <DialogBody className="max-h-[800px] overflow-y-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
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

          {/* Input
          crossOrigin={undefined} untuk memilih kategori */}
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
              <img src={preview} alt="Preview" className="w-full h-auto" />
            </div>
          )}

          <DialogFooter>
            <Button
              type="submit"
              color="green"
              className="flex flex-row justify-center items-center gap-2"
            >
              {loading && <Spinner className="h-4 w-4" />}
              {t('Submit')}
            </Button>
            <Button color="red" onClick={handleClose}>
              {t('Cancel')}
            </Button>
          </DialogFooter>
        </form>
      </DialogBody>
    </Dialog>
  );
};

export default DialogCreateBook;
