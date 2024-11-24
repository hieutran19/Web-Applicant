import axios, { AxiosInstance } from 'axios';
import { createAxios } from './axios';

const axiosInstance = createAxios();

const userLogin = async (value) => {
  try {
    const response = await axiosInstance.post(`/api/v1/user/login`, value);
    if (response?.data?.token) {
      const { token } = response.data;
      const newAxiosInstance: AxiosInstance = createAxios(token);
      axiosInstance.defaults = newAxiosInstance.defaults;
    }
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const userLogout = async () => {
  try {
    const response = await axiosInstance.post(`/api/v1/user/logout`);
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const refreshToken = async (): Promise<string | null> => {
  try {
    // Lấy refresh token từ localStorage
    const refreshToken = localStorage.getItem('refresh_token');
    if (refreshToken) {
      // Gửi yêu cầu làm mới token
      const response = await axios.post(`${import.meta.env.VITE_URL_LINKS}api/v1/user/refresh_token`, {
        refresh: refreshToken
      });

      // Lưu token mới vào localStorage
      const newAccessToken = response.data.access;
      localStorage.setItem('token', newAccessToken);

      // Tạo AxiosInstance mới với token mới
      const newAxiosInstance: AxiosInstance = createAxios(newAccessToken);

      // Cập nhật axiosInstance toàn cục với AxiosInstance mới
      axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;

      // Trả về token mới
      return newAccessToken;
    } else {
      console.error('No refresh token found in localStorage');
    }
  } catch (err) {
    console.error('Error refreshing token', err);
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/login';
  }
  return null;
};

export {
    userLogin,
    userLogout,
    refreshToken
}