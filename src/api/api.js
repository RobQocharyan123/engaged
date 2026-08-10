import axios from 'axios';

const getBaseURL = () => {
  if (process.env.REACT_APP_API_BASE_URL) {
    return process.env.REACT_APP_API_BASE_URL;
  }

  if (process.env.REACT_APP_URL) {
    return process.env.REACT_APP_URL;
  }

  return process.env.NODE_ENV === 'development'
    ? 'http://localhost:5000/api'
    : '/api';
};

const instance = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000,
});

export default instance;
