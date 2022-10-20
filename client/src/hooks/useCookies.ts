import { useCookies } from 'react-cookie';

export default function useCookiesTheme() {
  const [cookie, setCookie] = useCookies(['themeMode']);

  const setThemeMode = (mode: string) => {
    setCookie('themeMode', mode, {
      path: '/',
      sameSite: 'lax',
      ...(import.meta.env.PROD && {
        domain: 'abeesdev.com',
      }),
    });
  };

  console.log(import.meta.env.PROD);

  return {
    themeMode: cookie.themeMode as string,
    setThemeMode,
  };
}
