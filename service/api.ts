// src/utils/api.ts
import axios, { AxiosRequestConfig } from 'axios';
import { ApiUrl } from '../config/config';

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

    // Mengatur konfigurasi permintaan
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

    // Set body sesuai dengan tipe request
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
      config.data = formData; // Menggunakan FormData untuk multipart
    }

    try {
      const response = await axios(config);
      return response.data; // Mengembalikan data dari respons
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        // Jika ada respons dari server
        console.error('API call error:', error.response.data);
        throw new Error(error.response.data.message || 'Something went wrong');
      } else {
        console.error('API call error:', error);
        throw new Error('Network error or request failed');
      }
    }
  };
}

export default Api;
