import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://paystack-side-be-0cdbe122bc32.herokuapp.com",
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
