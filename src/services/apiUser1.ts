import Http from './Http';

interface Config {
    headers?: Record<string, string>;
  }
export const userLogin = (data: any) => {
    const url = `api/v1/user/login`;
    return Http.post(url, data, {
    });
  };

  export const userLogout = (data: any,config: Config) => {
    const url = `api/v1/user/logout`;
    return Http.post(url, data, {
      headers: config.headers,
    });
  };

  export const getUserInfor = (config: Config) => {
    const url = `api/v1/user/get_user_details`;
    return Http.get(url,{
      headers: config.headers,
    });
  };

