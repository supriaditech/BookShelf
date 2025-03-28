import { useTranslations } from 'next-intl';
import React from 'react';
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Spinner,
} from '@material-tailwind/react';
import { useCategories } from '@/hooks/useCategories';
import { ToastContainer } from 'react-toastify';

interface Props {
  openDelete: boolean;
  handleOpenDelete: () => void;
  token: string;
  dataDelete: any; // Data kategori yang akan diDelete
}

const DialogDeleteCategories: React.FC<Props> = ({
  openDelete,
  token,
  handleOpenDelete,
  dataDelete,
}) => {
  const t = useTranslations();
  const { loading, handleDelete } = useCategories(token);

  let Message;
  if (dataDelete) {
    Message = `${t('Are you sure you want to delete the category')} ${
      dataDelete?.name
    } ${t('with ID')} ${dataDelete?.id}?`;
  }

  const onSubmit = async (id: number) => {
    await handleDelete(id);
    handleOpenDelete(); // Menutup dialog setelah berhasil
  };

  return (
    <Dialog open={openDelete} handler={handleOpenDelete}>
      <DialogHeader>{t('Delete Categories')}</DialogHeader>
      <DialogBody className="max-h-[800px] overflow-y-auto">
        <p className="text-lg">{Message}</p>
        <DialogFooter>
          <Button
            type="submit"
            color="green"
            className="flex flex-row justify-center items-center gap-2"
            onClick={() => onSubmit(dataDelete?.id)}
          >
            {loading && <Spinner className="h-4 w-4" />}
            {t('Delete')}
          </Button>
          <Button color="red" onClick={handleOpenDelete}>
            {t('Cancel')}
          </Button>
        </DialogFooter>
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

export default DialogDeleteCategories;
