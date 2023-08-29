import axios from "axios";

let url = process.env.NEXT_PUBLIC_BACKEND_URL; 
if (process.env.NEXT_PUBLIC_DEBUG === "development")  url = process.env.NEXT_PUBLIC_BACKEND_URL_DEV;
const newRequest = axios.create({
  baseURL: `${url}/api/`,
  withCredentials: true,
});

export default newRequest;
