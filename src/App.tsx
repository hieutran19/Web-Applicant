import { useEffect } from 'react';
import AppRouter from './routers/AppRouter';
import { useNavigate } from 'react-router-dom';
import { refreshToken } from './services/apiUser';
import useAuth from './hooks/useAuth';

function App() {
  const { loggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if(!localStorage.getItem('refresh_token') || !localStorage.getItem('token')){
      navigate('/login')
    }
    if (!localStorage.getItem('token') && loggedIn) {
      localStorage.clear();
    } else if (loggedIn) {
      refreshToken();
      const intervalId = setInterval(refreshToken, 300000); // 5 minutes

      // Clean up the interval on component unmount
      return () => clearInterval(intervalId);
    }
  }, [loggedIn, navigate]);
  return <AppRouter />;
}

export default App;
