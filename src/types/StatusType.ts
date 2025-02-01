export interface Meta {
  message: string;
  statusCode: number;
}

export interface UserBookStatusData {
  id: number;
  userId: number;
  bookId: number;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
}

export interface UserBookStatusResponse {
  meta: Meta;
  data: UserBookStatusData;
}

interface BookStatsData {
  totalBooks: number;
  inProgressBooks: number;
  completedBooks: number;
}

export interface BookStatsResponse {
  meta: Meta;
  data: BookStatsData;
}
