// src/types/Session.ts

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  create_At: string; // Anda bisa menggunakan Date jika ingin memanipulasi tanggal
  update_At: string; // Anda bisa menggunakan Date jika ingin memanipulasi tanggal
}

export interface SessionType {
  user: {
    user: User;
  };
  accessToken: string;
}
