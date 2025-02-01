// types/Book.ts

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
}

export interface BookResponse {
  meta: Meta;
  data: Book[];
}
