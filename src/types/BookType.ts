// types/Book.ts

import { UserBookStatusData } from './StatusType';

export interface Meta {
  message: string;
  statusCode: number;
}

export interface CategoryType {
  id: number;
  name: string;
  slug: string;
}

export interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  coverImage: string;
  readingStatus: 'IN_PROGRESS' | 'COMPLETED' | 'NOT_STARTED';
  categories: CategoryType[];
  UserBookStatus: UserBookStatusData[];
}

export interface BookResponse {
  meta: Meta;
  data: Book[];
}
export interface BookResponseByID {
  meta: Meta;
  data: Book;
}
