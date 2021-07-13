import { useState, useEffect, Dispatch, SetStateAction } from 'react';

type Response<T> = [T, Dispatch<SetStateAction<T>>, any];

function useLocalStorageState<T>(key: string, initialState: T): Response<T> {
  const [state, setState] = useState(() => {
    const storageValue = localStorage.getItem(key);
    if (storageValue) {
      return JSON.parse(storageValue);
    } else {
      return initialState;
    }
  });

  function refresh(initialValues = false) {
    const storageValue = localStorage.getItem(key);
    if (storageValue) {
      setState(JSON.parse(storageValue));
      return JSON.parse(storageValue);
    } else {
      if (initialValues) {
        setState(initialState);
        return initialState;
      } else {
        setState(null);
        return null;
      }
    }
  }

  useEffect(() => {
    if (state !== null) {
      localStorage.setItem(key, JSON.stringify(state));
    } else {
      localStorage.removeItem(key);
    }
  }, [key, state]);

  return [state, setState, refresh];
}
export default useLocalStorageState;
