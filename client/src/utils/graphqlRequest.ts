import axios from 'axios';
import { GraphQLClient } from 'graphql-request';
import jwtDecode, { JwtPayload } from 'jwt-decode';
import { refreshToken } from 'src/redux/slice/auth.slice';
import { injectStore } from './injectStore';

const url = `${import.meta.env.VITE_APP_BASE_URL}/graphql`;

const app = new GraphQLClient(url, {
  headers: () => {
    let retry = false;

    const getToken = (): string => injectStore().getState().auth.accessToken || '';

    const setToken = (token: string): void => {
      injectStore().dispatch(refreshToken(token));
    };

    const accessToken = getToken();

    const payload = accessToken && (jwtDecode(accessToken as string) as JwtPayload);

    const currentTime = (new Date().getTime() + 1) / 1000;

    // const whiteListUrl = ['/auth/login', '/auth/register'].includes(pathname);

    if (payload && Number(payload.exp) < currentTime && !retry) {
      const promise = axios({
        method: 'POST',
        url: `${import.meta.env.VITE_APP_BASE_URL}/refreshToken`,
        withCredentials: true,
      });

      promise.then((response) => {
        setToken(response?.data.accessToken);
        retry = true;
      });
    }

    return {
      authorization: `Bearer ${getToken()}`,
    };
  },
  credentials: 'include',
});

export default app;
