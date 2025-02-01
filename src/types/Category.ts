import { Book } from './BookType';

export interface Category {
  id: number;
  name: string;
  slug: string;
  photo: string;
  books?: Book[];
}

export interface CategoryResponse {
  meta: {
    message: string;
    statusCode: number;
  };
  data: Category[];
}

export interface CategorySingleResponse {
  meta: {
    message: string;
    statusCode: number;
  };
  data: Category;
}
