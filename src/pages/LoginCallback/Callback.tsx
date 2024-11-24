import axios from 'axios';
import { useEffect } from 'react';
import useAuth from '../../hooks/useAuth';

export default function AuthCallback() {
  const { login } = useAuth();
  const getToken = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    try {
      const response = await axios.get(`${import.meta.env.VITE_FE_LINKS}api/v1/oauth/callback/?code=${code}`);
      const token = response.data.token;
      const refresh_token = response.data.refresh_token;
      
      login(token, refresh_token, true);
    } catch (error) {
      console.error('Error cridentals:', error);
    }
  };
  useEffect(() => {
    getToken();
  }, []);
  return <div></div>;
}
