// next.config.js
const { resolve } = require('path'); 
const createNextIntlPlugin = require('next-intl/plugin');
const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */  
const nextConfig = {  
  reactStrictMode: true,  
  images: {
    domains: ['109.176.19.66'],  // Tambahkan domain yang digunakan untuk gambar
  },
  webpack: (config) => {  
    config.resolve.alias['@'] = resolve(__dirname, 'src');
    return config;  
  },  
};  

module.exports = withNextIntl(nextConfig);
