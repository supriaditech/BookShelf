'use client';
import { BookResponse } from '@/types/BookType';
import Api from '../../service/api';
import useSWR from 'swr';
import React from 'react';
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
const useBook = (token: string) => {
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

  //   get list book
  const {
    data: listDataBook,
    error,
    isLoading,
    mutate,
  } = useSWR<BookResponse>(
    ['/api/book/get/get-all', token],
    ([url, token]: [string, string]) => fetcher(url, token),
  );

  //   create
  const handleCreateBook: SubmitHandler<FormInputs> = async (data) => {
    setLoading(true);
    const formData = new FormData();

    // Append text fields
    formData.append('title', data.title);
    formData.append('author', data.author);
    formData.append('isbn', data.isbn);
    formData.append('readingStatus', 'NOT_STARTED');

    // Append category IDs as an array
    data.categoryIds.forEach((id) => {
      formData.append('categoryIds', id.toString()); // Ensure IDs are strings
    });

    // Append the cover image file
    if (data.coverImage && data.coverImage.length > 0) {
      formData.append('coverImage', data.coverImage[0]); // Assuming coverImage is a FileList
    }

    // Log the form data for debugging
    console.log('Form Data:', formData);
    if (data.coverImage.length > 0) {
      formData.append('coverImage', data.coverImage[0]); // Append the first file in the FileList
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
    console.log(response);
    if (response.meta.statusCode === 200) {
      toast.success('Book created successfully!');
      setOpen(false);
      mutate(); // Refresh the book list
      reset(); // Reset the form
      setLoading(false);
      return { success: true };
    } else {
      setLoading(false);
      toast.error(response.meta.message || 'Failed to create book');
      return { success: false, message: error.message };
    }
  };

  const handleEditBook: SubmitHandler<FormInputs> = async (data) => {
    setLoading(true);
    const formData = new FormData();

    // Append text fields
    formData.append('title', data.title);
    formData.append('author', data.author);
    formData.append('isbn', data.isbn);
    formData.append('readingStatus', data.readingStatus);

    // Append category IDs as an array
    data.categoryIds.forEach((id) => {
      formData.append('categoryIds', id.toString()); // Ensure IDs are strings
    });

    // Append the cover image file if it's selected
    if (data.coverImage && data.coverImage.length > 0) {
      formData.append('coverImage', data.coverImage[0]); // Assuming coverImage is a FileList
    }

    // Append the book ID for the update
    formData.append('id', data.id.toString()); // Assuming the book ID is a number

    const api = new Api();
    api.url = '/api/book/edit'; // URL for the edit API
    api.auth = true;
    api.token = token;
    api.type = 'multipart'; // Send data as multipart
    api.body = formData;

    const response = await api.call();
    console.log(response);

    if (response.meta.statusCode === 200) {
      toast.success('Book updated successfully!');
      setOpenEdit(false);
      mutate(); // Refresh the book list
      reset(); // Reset the form
      setLoading(false);
      return { success: true };
    } else {
      setLoading(false);
      toast.error(response.meta.message || 'Failed to update book');
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
  };
};

export default useBook;
