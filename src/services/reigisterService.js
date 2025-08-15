import API from '../api/api';

export const postRegisterData = async (data) => {
  const res = await API.post('/vote', data);
  return res.data;
};

export const getTimeToENdEngaged = async () => {
  const res = await API.get('/remaining-time');
  return res.data;
};
