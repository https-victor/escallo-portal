import React, { createContext, useReducer, useEffect, useContext } from 'react';
import AuthReducer from './AuthReducer';
import { GlobalContext } from '../Global/GlobalState';
import { USER_LOADING, USER_LOADED, LOGIN_SUCCESS, AUTH_ERROR, LOGIN_FAIL } from './actions';

const initialAuthState = {
  user: null,
  authenticated: false,
  token: localStorage.getItem('token'),
  loading: true
};

export const AuthContext = createContext<any>(initialAuthState);

export const AuthProvider: any = ({ children }: any) => {
  const { error, setError, clearError } = useContext(GlobalContext);
  const [state, dispatch] = useReducer(AuthReducer, initialAuthState);

  const tokenConfig = {
    headers: {
      'Content-type': 'application/json',
      ...(state.token ? { 'x-auth-token': state.token } : {})
    }
  };

  async function loadUser() {
    // User loading
    dispatch({ type: USER_LOADING });

    try {
      const res = await fetch('/api/auth', {
        method: 'get',
        ...tokenConfig
      });
      const json = await res.json();
      switch (res.status) {
        case 200:
          dispatch({ type: USER_LOADED, payload: json });
          break;
        case 401:
          throw new Error(json);
        default:
          throw new Error(json);
      }
    } catch (err) {
      dispatch({ type: AUTH_ERROR });
      console.log(err);
    }
  }

  async function login(credentials: any) {
    // User loading
    dispatch({ type: USER_LOADING });

    try {
      const res = await fetch('/api/auth', {
        method: 'post',
        ...tokenConfig,
        body: JSON.stringify(credentials)
      });
      const json = await res.json();
      dispatch({ type: LOGIN_SUCCESS, payload: json });
    } catch (err) {
      dispatch({ type: LOGIN_FAIL });
      console.log(err);
    }
  }

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        authenticated: state.authenticated,
        user: state.user,
        loading: state.loading,
        token: state.token,
        loadUser,
        login,
        tokenConfig
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
