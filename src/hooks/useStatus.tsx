import useSWR from 'swr';
import Api from '../../service/api';
import { BookStatsResponse } from '@/types/StatusType';
import React from 'react';

const fetcher = async <T,>(url: string, token: string): Promise<T> => {
  const api = new Api();
  api.url = url;
  api.auth = true;
  api.type = 'json';
  api.token = token;
  return (await api.call()) as T;
};

const useStatus = (token: string) => {
  const [loading, setLoading] = React.useState<boolean>(false);

  const {
    data: dataStatus,
    error,
    isLoading,
    mutate,
  } = useSWR<BookStatsResponse>(
    token ? [`/api/book-status/get/my-summary`, token] : null,
    ([url, token]: [string, string]) => fetcher(url, token),
  );

  return {
    loading,
    dataStatus,
    error,
    isLoading,
  };
};

export default useStatus;
