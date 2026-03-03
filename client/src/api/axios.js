import axios from "axios";
// console.log(import.meta.env.VITE_BASE_URL);
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true,
  
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("Unauthorized request");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
