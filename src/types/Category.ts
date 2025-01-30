export interface Category {
  id: number;
  name: string;
  slug: string;
  photo: string;
}

export interface CategoryResponse {
  meta: {
    message: string;
    statusCode: number;
  };
  data: Category[];
}


