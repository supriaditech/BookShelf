'use client';
import useSWR from 'swr';
import { toast } from 'react-toastify';
import Api from '../../service/api';
import { CategoryResponse, CategorySingleResponse } from '@/types/Category';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { ApiUrl } from '../../config/config';

interface FormInputs {
  name: string;
  photo: FileList; // Change to FileList to handle file input correctly
  id: number;
}

const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .trim();
};

// Di dalam hook useCategories
const fetcher = async <T,>(url: string, token: string): Promise<T> => {
  const api = new Api();
  api.url = url;
  api.auth = true;
  api.type = 'json';
  api.token = token;
  return (await api.call()) as T;
};
export const useCategories = (token: string, slug?: string) => {
  const [open, setOpen] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [preview, setPreview] = React.useState<string | null>(null);
  // Fungsi untuk mengatur preview gambar
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPreview(null);
    const file = event.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
    } else {
      setPreview(null);
    }
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
    setValue,
  } = useForm<FormInputs>();

  const handleOpen = () => {
    setOpen(!open);
    setPreview(null);
  };

  const handleOpenEdit = () => {
    setOpenEdit(!openEdit);
  };

  const handleOpenDelete = () => {
    setOpenDelete(!openDelete);
  };

  const {
    data: listCategories,
    error,
    isLoading,
    mutate,
  } = useSWR<CategoryResponse>(
    ['/api/categories/get/all', token],
    ([url, token]: [string, string]) => fetcher(url, token),
  );

  const {
    data: dataBookCategory,
    error: errorDataBook,
    isLoading: isLoadingDataBook,
    mutate: mutateDataBook,
  } = useSWR<CategorySingleResponse>(
    slug ? [`/api/categories/get/slug/${slug}`, token] : null,
    ([url, token]: [string, string]) => fetcher(url, token),
  );

  const handleCreateCategories: SubmitHandler<FormInputs> = async (data) => {
    setLoading(true);
    // Menghasilkan slug dari nama
    const slug = generateSlug(data.name);
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('slug', slug);
    if (data.photo.length > 0) {
      formData.append('photo', data.photo[0]); // Append the first file in the FileList
    } else {
      setError('photo', { type: 'required', message: 'Photo is required' });
      return;
    }

    // Log the formData contents
    const formDataEntries = {};

    const api = new Api();
    api.url = '/api/categories/create-categorie';
    api.auth = true;
    api.token = token;
    api.type = 'multipart';
    api.body = formData;
    const response = await api.call();
    if (response.meta.statusCode === 200) {
      toast.success('Category created successfully!');
      setOpen(false);
      mutate();
      setLoading(false);

      return { success: true };
      // Reset form or lakukan tindakan lain setelah berhasil
    } else {
      setLoading(false);

      toast.error(response.meta.message || 'Failed to create category');
      return { success: false, message: error.message };
    }
  };

  const handleEditCategories: SubmitHandler<FormInputs> = async (data) => {
    setLoading(true);

    // Menghasilkan slug dari nama
    const slug = generateSlug(data.name);
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('slug', slug);
    formData.append('id', data.id.toString()); // Menambahkan ID ke FormData

    if (data.photo.length > 0) {
      formData.append('photo', data.photo[0]); // Append the first file in the FileList
    } else {
      setError('photo', { type: 'required', message: 'Photo is required' });
      setLoading(false);
      return;
    }

    const api = new Api();
    api.url = '/api/categories/edit-categorie';
    api.auth = true;
    api.token = token;
    api.type = 'multipart';
    api.body = formData;

    const response = await api.call();

    if (response.meta.statusCode === 200) {
      toast.success('Category edited successfully!');
      reset(); // Reset form setelah berhasil
      mutate();
      setLoading(false);
      return { success: true };
    } else {
      setLoading(false);
      toast.error(response.meta.message || 'Failed to edit category');
      return { success: false, message: response.meta.message };
    }
  };

  const handleDelete = async (id: number) => {
    setLoading(true);
    const api = new Api();
    api.url = '/api/categories/delete';
    api.auth = true;
    api.token = token;
    api.type = 'json';
    api.body = { id: id };
    const response = await api.call();

    if (response.meta.statusCode === 200) {
      toast.success('Category delete successfully!');
      reset(); // Reset form setelah berhasil
      mutate();
      setLoading(false);
      return { success: true };
    } else {
      setLoading(false);
      toast.error(response.meta.message || 'Failed to delete category');
      return { success: false, message: response.meta.message };
    }
  };

  return {
    listCategories,
    error,
    isLoading,
    handleOpen,
    open,
    register,
    handleSubmit,
    handleCreateCategories,
    errors,
    mutate,
    loading,
    setLoading,
    reset,
    handleFileChange,
    preview,
    setPreview,
    openEdit,
    setOpenEdit,
    handleOpenEdit,
    handleEditCategories,
    setValue,
    handleOpenDelete,
    openDelete,
    handleDelete,
    dataBookCategory: dataBookCategory?.data,
    errorDataBook,
    isLoadingDataBook,
  };
};
