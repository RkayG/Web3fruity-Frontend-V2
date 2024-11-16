/** @type {import('next').NextConfig} */

const webpack = require('webpack');
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
});

const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
};

module.exports = withPWA(nextConfig);
