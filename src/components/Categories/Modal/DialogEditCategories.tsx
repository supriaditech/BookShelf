import { useTranslations } from 'next-intl';
import React, { useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Spinner,
} from '@material-tailwind/react';
import { useCategories } from '@/hooks/useCategories';
import { ToastContainer } from 'react-toastify';

interface Props {
  openEdit: boolean;
  handleOpenEdit: () => void;
  token: string;
  dataEdit: any; // Data kategori yang akan diedit
}

const DialogEditCategories: React.FC<Props> = ({
  openEdit,
  token,
  handleOpenEdit,
  dataEdit,
}) => {
  const {
    register,
    handleSubmit,
    errors,
    handleEditCategories,
    reset,
    loading,
    handleFileChange,
    preview,
    setPreview,
    setValue,
  } = useCategories(token);

  const t = useTranslations();

  // Mengatur nilai default saat dialog dibuka
  useEffect(() => {
    if (openEdit && dataEdit) {
      reset({
        name: dataEdit.name,
        // slug: dataEdit.slug,
        // Tidak perlu mengatur 'photo' di sini karena itu adalah file
      });
      setPreview(dataEdit.photo); // Set preview dengan URL gambar yang ada
    }
  }, [openEdit, dataEdit, reset]);

  const onSubmit = async (data: any) => {
    setValue('id', dataEdit.id);
    await handleEditCategories(data);
    handleOpenEdit(); // Menutup dialog setelah berhasil
    reset();
    setPreview(null);
  };

  const handleClose = () => {
    handleOpenEdit();
    setPreview(null);
  };
  const idCategory =
    t('ID category ') + dataEdit !== null || dataEdit !== undefined
      ? dataEdit?.id
      : '-';
  return (
    <Dialog open={openEdit} handler={handleOpenEdit}>
      <DialogHeader>{t('Edit Categories')}</DialogHeader>
      <DialogBody className="max-h-[800px] overflow-y-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input
            crossOrigin={undefined}
            type="text" // atau type="hidden"
            label="ID" // Opsional
            value={idCategory}
            {...register('id')}
            disabled
          />
          <Input
            crossOrigin={undefined}
            label={t('Name')}
            {...register('name', { required: true })}
            error={!!errors.name}
          />
          {errors.name && (
            <p className="text-red-500">{t('Name is required')}.</p>
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
            <p className="text-red-500">{t('Photo is required')}</p>
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

export default DialogEditCategories;
