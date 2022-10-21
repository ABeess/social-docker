import { useCookies } from 'react-cookie';

export default function useCookiesTheme() {
  const [cookie, setCookie] = useCookies(['themeMode']);

  const production = import.meta.env.PROD;

  const setThemeMode = (mode: string) => {
    setCookie('themeMode', mode, {
      path: '/',
      sameSite: 'lax',
      ...(production && {
        domain: 'abeesdev.com',
      }),
    });
  };

  return {
    themeMode: cookie.themeMode as string,
    setThemeMode,
  };
}
