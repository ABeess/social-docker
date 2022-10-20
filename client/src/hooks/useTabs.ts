import { SyntheticEvent, useState } from 'react';

// eslint-disable-next-line no-unused-vars
type UseTabType<T> = [T, (event: SyntheticEvent, value: T) => void | undefined];

export default function useTabs<T>(defaultValue: T): UseTabType<T> {
  const [currentTab, setCurrentTab] = useState<T>(defaultValue);

  const onChangeTab = (_event: SyntheticEvent, value: T) => {
    setCurrentTab(value);
  };
  return [currentTab, onChangeTab];
}
