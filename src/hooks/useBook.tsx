'use client';
import { BookResponse, BookResponseByID } from '@/types/BookType';
import Api from '../../service/api';
import useSWR from 'swr';
import React, { useState, useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

interface FormInputs {
  title: string;
  author: string;
  isbn: string;
  readingStatus: string;
  coverImage: FileList;
  id: number;
  categoryIds: number[];
}

const fetcher = async <T,>(url: string, token: string): Promise<T> => {
  const api = new Api();
  api.url = url;
  api.auth = true;
  api.type = 'json';
  api.token = token;
  return (await api.call()) as T;
};

const useBook = (token: string, slug?: string) => {
  const [open, setOpen] = React.useState(false);
  const [preview, setPreview] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [openEdit, setOpenEdit] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
    setValue,
  } = useForm<FormInputs>();

  // Mengatur tampilan preview
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

  const handleOpen = () => {
    setOpen(!open);
    setPreview(null);
  };

  const handleOpenEdit = () => {
    setOpenEdit(!openEdit);
  };

  // get list book
  const {
    data: listDataBook,
    error,
    isLoading,
    mutate,
  } = useSWR<BookResponse>(
    ['/api/book/get/get-all', token],
    ([url, token]: [string, string]) => fetcher(url, token),
  );
  // get By ID
  const {
    data: dataBookId,
    error: errorDataBookId,
    isLoading: isLoadingBookId,
    mutate: mutateDataBook,
  } = useSWR<BookResponseByID>(
    slug ? [`/api/book/get/${slug}`, token] : null,
    ([url, token]: [string, string]) => fetcher(url, token),
  );

  const handleStatusBook = async (
    token: string,
    idBook: any,
    status: string,
  ) => {
    setLoading(true);
    const api = new Api();
    api.url = '/api/book-status/upsert';
    api.auth = true;
    api.token = token;

    api.body = {
      bookId: Number(idBook),
      status: status,
    };
    const response = await api.call();
    if (response.meta.statusCode === 200) {
      setLoading(false);
      mutateDataBook();
      return { success: true };
      // Reset form or lakukan tindakan lain setelah berhasil
    } else {
      setLoading(false);

      return { success: false, message: response.meta.message };
    }
  };

  // handle create
  const handleCreateBook: SubmitHandler<FormInputs> = async (data) => {
    setLoading(true);
    const formData = new FormData();

    formData.append('title', data.title);
    formData.append('author', data.author);
    formData.append('isbn', data.isbn);
    // formData.append('readingStatus', 'NOT_STARTED');

    data.categoryIds.forEach((id) => {
      formData.append('categoryIds', id.toString());
    });

    if (data.coverImage && data.coverImage.length > 0) {
    } else {
      setError('coverImage', {
        type: 'required',
        message: 'Cover Image is required',
      });
      setLoading(false);
      return;
    }

    const api = new Api();
    api.url = '/api/book/create';
    api.auth = true;
    api.token = token;
    api.type = 'multipart';
    api.body = formData;

    const response = await api.call();
    if (response.meta.statusCode === 200) {
      toast.success('Book created successfully!');
      setOpen(false);
      mutate();
      reset();
      setLoading(false);
    } else {
      setLoading(false);
      toast.error(response.meta.message || 'Failed to create book');
    }
  };

  // handle edit
  const handleEditBook: SubmitHandler<FormInputs> = async (data) => {
    setLoading(true);
    const formData = new FormData();

    formData.append('title', data.title);
    formData.append('author', data.author);
    formData.append('isbn', data.isbn);
    formData.append('id', data.id.toString());

    data.categoryIds.forEach((id) => {
      formData.append('categoryIds', id.toString());
    });

    if (data.coverImage && data.coverImage.length > 0) {
      formData.append('coverImage', data.coverImage[0]);
    }

    const api = new Api();
    api.url = '/api/book/edit';
    api.auth = true;
    api.token = token;
    api.type = 'multipart';
    api.body = formData;

    const response = await api.call();

    if (response.meta.statusCode === 200) {
      toast.success('Book updated successfully!');
      setOpenEdit(false);
      mutate();
      reset();
      setLoading(false);
    } else {
      setLoading(false);
      toast.error(response.meta.message || 'Failed to update book');
    }
  };

  // handle delete
  const handleDelete = async (id: number) => {
    setLoading(true);
    const api = new Api();
    api.url = '/api/book/delete';
    api.auth = true;
    api.token = token;
    api.type = 'json';
    api.body = { id: id };
    const response = await api.call();

    if (response.meta.statusCode === 200) {
      toast.success('Book delete successfully!');
      reset(); // Reset form setelah berhasil
      mutate();
      setLoading(false);
      return { success: true };
    } else {
      setLoading(false);
      toast.error(response.meta.message || 'Failed to delete Book');
      return { success: false, message: response.meta.message };
    }
  };

  return {
    listDataBook,
    error,
    isLoading,
    open,
    handleOpen,
    setPreview,
    preview,
    register,
    handleSubmit,
    setError,
    reset,
    setValue,
    handleCreateBook,
    errors,
    handleFileChange,
    loading,
    openEdit,
    handleOpenEdit,
    handleEditBook,
    handleDelete,
    dataBookId,
    errorDataBookId,
    isLoadingBookId,
    handleStatusBook,
  };
};

export default useBook;
