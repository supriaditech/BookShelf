export interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  coverImage: string;
}

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
