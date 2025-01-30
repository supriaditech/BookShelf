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
  if (dataDelete !== null || dataDelete !== undefined) {
    Message = `Apakah kamu yakin ingin menghapus categori ${dataDelete?.name} dengan
          ${dataDelete?.id}`;
  }

  const onSubmit = async (id: number) => {
    await handleDelete(id);
    handleOpenDelete(); // Menutup dialog setelah berhasil
  };
  return (
    <Dialog open={openDelete} handler={handleOpenDelete}>
      <DialogHeader>{t('Delete Categories')}</DialogHeader>
      <DialogBody className="max-h-[1000px] overflow-y-auto">
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
      </DialogBody>
    </Dialog>
  );
};

export default DialogDeleteCategories;
