import axios from 'axios';

const api = axios.create({
  baseURL: "https://pandadiestro.xyz/services/stiller",
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('metagallery-token');
    if (token) {
      config.headers.token = JSON.parse(token);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;