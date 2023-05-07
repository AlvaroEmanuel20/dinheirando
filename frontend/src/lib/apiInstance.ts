import axios from 'axios';
import { getSession } from 'next-auth/react';

export const apiInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

apiInstance.interceptors.request.use(
  async (config) => {
    const session = await getSession();

    if (session)
      config.headers.Authorization = `Bearer ${session.user.accessToken}`;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
