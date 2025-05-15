import api from './api'; // shared axios instance

export const login = async (username: string, password: string) => {
  const response = await api.post(
    '/users/login',
    null,
    {
      params: { username, password },
      withCredentials: true,
    }
  );
  return response.data;
};
