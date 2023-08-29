const baseUrl =
  process.env.NEXT_PUBLIC_DEBUG === 'development'
    ? process.env.NEXT_PUBLIC_BACKEND_URL_DEV
    : process.env.NEXT_PUBLIC_BACKEND_URL;

export default baseUrl;
