/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-unused-vars */
import { createContext, ReactElement } from 'react';
import useCookiesTheme from 'src/hooks/useCookies';

interface IInitialState {
  themeMode: string;
  onChange: (mode: string) => void;
  onToggleMode: () => void;
}

const initialState: IInitialState = {
  themeMode: 'light',
  onChange: () => {},
  onToggleMode: () => {},
};

const SettingContext = createContext(initialState);

interface SettingProviderProp {
  children: ReactElement;
}

export default function SettingContextProvider({ children }: SettingProviderProp): ReactElement {
  const { themeMode, setThemeMode } = useCookiesTheme();

  const handleChangeTheme = (mode: string) => {
    setThemeMode(mode);
  };

  const handleToggleTheme = () => {
    setThemeMode(themeMode === 'light' ? 'dark' : 'light');
  };

  return (
    <SettingContext.Provider value={{ themeMode, onChange: handleChangeTheme, onToggleMode: handleToggleTheme }}>
      {children}
    </SettingContext.Provider>
  );
}

export { SettingContext };
