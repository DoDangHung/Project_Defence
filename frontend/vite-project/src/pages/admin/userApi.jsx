import axiosClient from './axiosClient';

export const userApi = {
  getAllUsers: () => axiosClient.get('/users'),
};
