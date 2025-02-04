'use client';
import React from 'react';
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Spinner,
} from '@material-tailwind/react';
import { useTranslations } from 'next-intl';
import { useCategories } from '@/hooks/useCategories';
import { ToastContainer } from 'react-toastify';

interface Props {
  open: boolean;
  handleOpen: () => void;
  token: string;
}

const DialogCategories: React.FC<Props> = ({ handleOpen, open, token }) => {
  const t = useTranslations();
  const {
    register,
    handleSubmit,
    errors,
    handleCreateCategories,
    reset,
    loading,
    handleFileChange,
    preview,
    setPreview,
  } = useCategories(token);

  const onSubmit = async (data: any) => {
    await handleCreateCategories(data);
    handleOpen(); // Menutup dialog setelah berhasil
    reset();
    setPreview(null);
  };

  const handleClose = () => {
    handleOpen();
    setPreview(null);
  };

  return (
    <Dialog open={open} handler={handleClose} className="relative z-[1]">
      <DialogHeader>{t('Tambah Categories')}</DialogHeader>
      <DialogBody className="max-h-[700px] sm:max-h-[800px] md:max-h-[700px] lg:max-h-[800px] overflow-y-auto">
        {/* Menambahkan kelas untuk scroll */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input
            crossOrigin={undefined}
            label={t('Name')}
            {...register('name', { required: true })}
            error={!!errors.name}
          />
          {errors.name && (
            <p className="text-red-500">{t('Name is required.')}</p>
          )}

          <Input
            crossOrigin={undefined}
            type="file"
            label={t('Photo')}
            {...register('photo', { required: true })}
            error={!!errors.photo}
            onChange={handleFileChange} // Menambahkan event handler
          />
          {errors.photo && (
            <p className="text-red-500">{t('Photo is required')}.</p>
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
    </Dialog>
  );
};

export default DialogCategories;
