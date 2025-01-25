const { resolve } = require('path'); 
const createNextIntlPlugin = require('next-intl/plugin');
 
const withNextIntl = createNextIntlPlugin();
/** @type {import('next').NextConfig} */  
const nextConfig = {  
  reactStrictMode: true,  
  webpack: (config) => {  
    config.resolve.alias['@'] = resolve(__dirname, 'src');
    return config;  
  },  
};  
  
module.exports = withNextIntl(nextConfig); 
