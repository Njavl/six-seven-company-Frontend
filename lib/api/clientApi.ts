import api from './api';



export const logout = async () => {
  const { data } = await api.post('/auth/logout');
  return data;
};


export { api };
