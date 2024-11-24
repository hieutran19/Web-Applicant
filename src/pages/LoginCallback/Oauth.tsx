import axios from 'axios';
import Buttons from '../../components/filed/button/button';

function OauthBtn(props: any) {
  const handleLogin = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_FE_LINKS}get_auth_code/`);
      window.location = response.data.data;
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  return <Buttons texts="Login with AVT Account" type="button" handleClick={handleLogin} status="primary" />;
}

export default OauthBtn;
