# Dokumentasi BookSelf
## Installasi

#### Clone Project 

```
  git clone https://github.com/supriaditech/BookShelf.git
```
#### Installasi Pakage

```
  yarn install
```
#### Jalankan Migrate Prisma ORM 

```
  yarn prisma db push
```
atau
```
  yarn prisma migrate dev --name init

```
#### Generate Prisma Client 

```
  yarn prisma generate
```
#### Cek Database dengan Prisma Studio

```
  yarn prisma studio
```
#### Jalankan Proyek
```
  yarn dev
```
#### Buka url di browser
```
  http://localhost:3000/
```
#





## Struktur Proyek

 - [Src](#)

    Folder ini digunakan untuk menyimpan kode sumber utama     aplikasi utama. Di dalamnya dapat terdapat subfolder untuk app, omponent, pages, utils, dan lainnya.
    
    - [app](#) :
        Folder ini digunakan untuk menyimpan komponen utama aplikasi Anda dan pengaturan routing. 
    - [components](#) :
       Folder ini berisi komponen-komponen UI yang dapat digunakan di berbagai halaman aplikasi. Komponen-komponen ini bisa berupa elemen antarmuka pengguna seperti tombol, formulir, modal, dan lainnya. 
    - [context](#) :
       Folder ini biasanya digunakan untuk menyimpan file yang berhubungan dengan konteks React. Konteks ini digunakan untuk menyediakan nilai global ke seluruh aplikasi, seperti pengaturan tema atau status autentikasi pengguna. 
    - [hooks](#) :
       Folder ini berisi custom hooks yang digunakan dalam aplikasi Anda. Hooks ini bisa membantu Anda menangani logika status, efek samping, dan fitur lain di dalam komponen tanpa perlu menulis ulang logika tersebut di banyak tempat. 
    - [i18n](#) :
       Folder ini kemungkinan berhubungan dengan internasionalisasi (i18n), yang digunakan untuk mendukung banyak bahasa dalam aplikasi. Berisi file konfigurasi dan terjemahan untuk berbagai bahasa yang digunakan di aplikasi.
    - [lib](#) :
      Folder ini biasanya berisi pustaka atau utilitas yang digunakan di seluruh aplikasi. Ini bisa mencakup fungsi atau API eksternal yang dipakai .
    - [pages](#) :
      Folder ini akan secara otomatis dipetakan ke rute yang sesuai berdasarkan namanya dalam proyek ini saya gunakan untuk menyimpan route API.
    - [types](#) :
      Folder ini berisi definisi tipe TypeScript yang digunakan di aplikasi Anda. Ini membantu menjaga konsistensi tipe data di seluruh aplikasi dan meningkatkan pengalaman pengembangan dengan autocomplete dan pemeriksaan kesalahan pada saat kompilasi.
    - [utils](#) :
      Folder ini berisi utilitas atau fungsi pembantu yang digunakan di berbagai bagian aplikasi Anda. Fungsi-fungsi ini mungkin berupa operasi matematika, manipulasi string, validasi, dan lainnya.
    - [middleware](#) :
      File ini kemungkinan berisi middleware yang digunakan dalam aplikasi. Middleware adalah fungsi yang dijalankan sebelum request mencapai rute atau handler, memungkinkan Anda untuk memproses request terlebih dahulu, misalnya untuk autentikasi, logging, atau modifikasi request.

 - [prisma]()

    Folder ini mungkin berisi konfigurasi untuk Prisma, yang digunakan sebagai ORM untuk database. Biasanya ada file schema.prisma di sini yang mendefinisikan model dan hubungan dalam database.

 - [public]()
    
    Folder ini digunakan untuk menyimpan file statis yang dapat diakses langsung melalui URL, seperti gambar, font, dan file lainnya yang tidak diproses oleh Next.js.
 
 - [service]()
    
    Folder ini bisa berisi kode yang menangani logika API yang digunakan oleh aplikasi.
 
 - [config]()
    
    Folder ini digunakan untuk menyimpan file konfigurasi yang dapat digunakan di seluruh proyek, seperti konfigurasi API_URL dari env atau NEXT_URL.

 - [messages]()
    
    Folder ini  digunakan untuk menyimpan JSON translite untuk internasionalisasi (i18n).
 
 - [.env]()
    
    File untuk menyimpan variabel lingkungan (environment variables) yang digunakan dalam aplikasi.

 - [.gitignore]()
    
    Daftar file dan folder yang tidak ingin Anda lacak menggunakan Git.


##
## Tech Stack

**Client:** NextJs, TailwindCSS , SWR , Material-tailwind , next-intl

**Server:** Prisma, SSR, VPS, Ubuntu, sqlite


## Features

- Light/dark mode toggle
- Translite
- Auth
- My summary untuk memenitoring jumlah buku, buku yang sedang di baca dan buku yang masi di baca
- Categoy untuk mengelompokkan buku yang ada
- CRUD buku

