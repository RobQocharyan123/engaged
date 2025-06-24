import axios from 'axios';
const getBaseURL = () => process.env.REACT_APP_URL;

const instance = axios.create({
  baseURL: getBaseURL(),
});

instance.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem('token');

    return token
      ? {
          ...config,
          headers: {
            ...config.headers,
            Authorization: `JWT ${token}`,
          },
        }
      : config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default instance;
