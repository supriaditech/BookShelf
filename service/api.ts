// src/utils/api.ts
import axios, { AxiosRequestConfig } from 'axios';
import { ApiUrl } from '../config/config';
import { toast } from 'react-toastify';

class Api {
  public url: string = '';
  public auth: boolean = false;
  public type: 'form' | 'json' | 'multipart' = 'json'; // Tipe konten
  public token: string = '';
  public header: Record<string, string> = {};
  public body: any = {};

  constructor(
    url: string,
    auth: boolean = false,
    type: 'form' | 'json' | 'multipart' = 'json',
  ) {
    this.url = url;
    this.auth = auth;
    this.type = type;
  }

  // Method untuk mengatur header
  public setHeader(key: string, value: string) {
    this.header[key] = value;
  }

  // Method untuk mengatur body
  public setBody(body: any) {
    this.body = body;
  }

  // Method untuk memanggil API
  public call = async (method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH') => {
    const url = ApiUrl + this.url;

    const config: AxiosRequestConfig | any = {
      method,
      url,
      headers: {
        ...this.header,
        ...(this.auth && this.token
          ? { Authorization: `Bearer ${this.token}` }
          : {}),
      },
    };

    if (this.type === 'json') {
      config.headers['Content-Type'] = 'application/json';
      config.data = JSON.stringify(this.body);
    } else if (this.type === 'form') {
      config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
      config.data = new URLSearchParams(this.body).toString();
    } else if (this.type === 'multipart') {
      const formData = new FormData();
      for (const key in this.body) {
        formData.append(key, this.body[key]);
      }
      config.data = formData;
    }

    try {
      const response = await axios(config);
      return response.data; // Mengembalikan data dari respons tanpa mengubah struktur
    } catch (error) {
      // Jika terjadi kesalahan, kembalikan respons kesalahan asli
      if (axios.isAxiosError(error) && error.response) {
        // Mengembalikan respons kesalahan tanpa mengubah strukturnya
        return error.response.data; // Mengembalikan data kesalahan asli
      } else {
        // Jika kesalahan jaringan, kembalikan objek kesalahan generik
        return {
          meta: {
            message: 'Kesalahan jaringan atau permintaan gagal',
            statusCode: 500,
          },
          data: null,
        };
      }
    }
  };
}

export default Api;
