import { useState } from 'react';

function useLocalStorageState<T>(key: string, initialState: T): any {
  const [state, setState] = useState(() => {
    const storageValue = localStorage.getItem(key);
    if (storageValue) {
      return JSON.parse(storageValue);
    } else {
      if (initialState !== null) {
        localStorage.setItem(key, JSON.stringify(initialState));
      }
      return initialState;
    }
  });

  function onSet(value: any) {
    if (value !== null) {
      localStorage.setItem(key, JSON.stringify(value));
    } else {
      localStorage.removeItem(key);
    }
    setState(value);
  }

  return [state, onSet];
}
export default useLocalStorageState;
