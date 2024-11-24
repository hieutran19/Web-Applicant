import { ReactNode, createContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getUserInfor } from '../services/apiUser1';
// import { userLogout } from '../services/apiUser';

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext({});
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const navigate = useNavigate();

  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('token'));

  const login = async (token: string, refresh_token: string, isToHome?: boolean) => {
    try {
      localStorage.setItem('refresh_token', refresh_token);
      localStorage.setItem('token', token);
      const res=await getUserInfor({
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      localStorage.setItem('user', JSON.stringify(res.data));// lưu user_infor trên local
      setLoggedIn(true);
      if (isToHome) {
        navigate('/');
      } else {
        navigate(-1);
      }
    } catch (error) {
      console.log(error);
      toast.error('Unexpected error occurred! Please try again.');
    }
  };

  const logout = async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    setLoggedIn(false);
    navigate('/login');
  };

  return <AuthContext.Provider value={{ loggedIn, login, logout }}>{children}</AuthContext.Provider>;
};

export default AuthContext;
