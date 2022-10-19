import {
  ApolloClient,
  ApolloClientOptions,
  createHttpLink,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import axios from 'axios';
import jwtDecode, { JwtPayload } from 'jwt-decode';
import { useEffect, useState } from 'react';
import { refreshToken } from 'src/redux/slice/auth.slice';
import { injectStore } from 'src/utils/injectStore';
import useRouter from './useRouter';

export default function useAppApolloClient() {
  const [optionClient, setOptionClient] = useState<ApolloClientOptions<NormalizedCacheObject>>({
    cache: new InMemoryCache(),
    ssrMode: true,
  });

  const getToken = (): string => injectStore().getState().auth.accessToken || '';

  const setToken = (token: string): void => {
    injectStore().dispatch(refreshToken(token));
  };

  const { pathname } = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const httpLink = createHttpLink({
        uri: `${import.meta.env.VITE_APP_BASE_URL}/graphql`,
        credentials: 'include',
        // same-origin
      });

      const authLink = setContext(async (_, { headers }) => {
        const accessToken = getToken();

        try {
          const payload = accessToken && (jwtDecode(accessToken as string) as JwtPayload);

          const currentTime = (new Date().getTime() + 1) / 1000;

          const whiteListUrl = ['/auth/login', '/auth/register'].includes(pathname);

          if (payload && Number(payload.exp) < currentTime && !whiteListUrl) {
            const response = await axios({
              method: 'POST',
              url: `${import.meta.env.VITE_APP_BASE_URL}/refreshToken`,
              withCredentials: true,
            });

            setToken(response.data.accessToken);
          }
        } catch (error: any) {
          console.log(error.message);
        }

        return {
          headers: {
            ...headers,
            authorization: `Bearer ${getToken()}`,
          },
        };
      });
      setOptionClient((prev) => ({ ...prev, link: authLink.concat(httpLink) }));
    }
  }, []);

  const apolloClient = new ApolloClient(optionClient);

  return apolloClient;
}
