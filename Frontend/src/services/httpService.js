import axios from "axios";

// const BASE_URL =
//   process.env.REACT_APP_API_URL || "http://localhost:5000/api";
const BASE_URL = "https://cinema-booking-system-zvte.onrender.com/api";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 50000,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const httpService = {
  get(endpoint, params = {}) {
    return axiosInstance.get(endpoint, { params }).then(res => res.data);
  },

  post(endpoint, data = {}) {
    return axiosInstance.post(endpoint, data).then(res => res.data);
  },

  put(endpoint, data = {}) {
    return axiosInstance.put(endpoint, data).then(res => res.data);
  },

  patch(endpoint, data = {}) {
    return axiosInstance.patch(endpoint, data).then(res => res.data);
  },

  delete(endpoint) {
    return axiosInstance.delete(endpoint).then(res => res.data);
  },
};
