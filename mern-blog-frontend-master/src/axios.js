import axios from 'axios';

const instance = axios.create({ //Every requests on localhost. This is additional settings for axios.
  baseURL: 'http://localhost:4444'
});

instance.interceptors.request.use((config) => {
  config.headers.Authorization = window.localStorage.getItem('token');
  return config;
});

export default instance;