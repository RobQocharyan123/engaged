import API from '../api/api';

export const postRegisterData = async (data) => {
  const res = await API.post('/vote', data);
  return res.data;
};
