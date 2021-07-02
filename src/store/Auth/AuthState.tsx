import React, { createContext, useReducer, useEffect, useContext, useState } from 'react';
import AuthReducer from './AuthReducer';
import { GlobalContext } from '../Global/GlobalState';
import {
  USER_LOADING,
  USER_LOADED,
  LOGIN_SUCCESS,
  AUTH_ERROR,
  LOGIN_FAIL,
  LOGIN_EMAIL_CHECK_LOADING,
  LOGIN_EMAIL_CHECK,
  LOGIN_EMAIL_RESET,
  REGISTER_SUCCESS,
  REGISTER_FAIL
} from './actions';
import { useNavigate } from 'react-router';

const initialAuthState = {
  user: null,
  authenticated: false,
  token: localStorage.getItem('token'),
  loading: true,
  loginEmail: '',
  emailCheckingLoading: false
};

export const AuthContext = createContext<any>(initialAuthState);

export const AuthProvider: any = ({ children }: any) => {
  const { error, setError, clearError } = useContext(GlobalContext);
  const [state, dispatch] = useReducer(AuthReducer, initialAuthState);
  const [loginStep, setLoginStep] = useState('email');
  const navigate = useNavigate();

  const tokenConfig = {
    headers: {
      'Content-type': 'application/json',
      ...(state.token ? { 'x-auth-token': state.token } : {})
    }
  };

  function resetLoginStep() {
    setLoginStep('email');
  }

  function resetLoginEmail() {
    dispatch({ type: LOGIN_EMAIL_RESET });
  }
  async function checkEmail(email: any) {
    dispatch({ type: LOGIN_EMAIL_CHECK_LOADING });
    try {
      // const res = await fetch('/api/auth', {
      //   method: 'get',
      //   ...tokenConfig
      // });
      const res = {
        status: 200
      };
      // const json = await res.json();
      const json = { email: email };
      switch (res.status) {
        case 200:
          if (!(json.email === 'joao.oliveira@futurotec.com.br')) {
            navigate('/cadastro');
          } else {
            setLoginStep('password');
          }
          dispatch({ type: LOGIN_EMAIL_CHECK, payload: json });
          break;
        case 401:
          throw new Error('Erro Json');
        default:
          throw new Error('Erro Json');
      }
    } catch (err) {
      dispatch({ type: AUTH_ERROR });
      console.log(err);
    }
  }

  async function loadUser() {
    // User loading
    dispatch({ type: USER_LOADING });

    try {
      // const res = await fetch('/api/auth', {
      //   method: 'get',
      //   ...tokenConfig
      // });
      const res = {
        status: 200
      };
      // const json = await res.json();
      const json = { nome: 'João', id: 123 };
      switch (res.status) {
        case 200:
          dispatch({ type: USER_LOADED, payload: json });
          break;
        case 401:
          throw new Error('Erro Json');
        default:
          throw new Error('Erro Json');
      }
    } catch (err) {
      dispatch({ type: AUTH_ERROR });
      console.log(err);
    }
  }

  async function login(credentials: any) {
    // User loading
    console.log(credentials);
    dispatch({ type: USER_LOADING });

    try {
      // const res = await fetch('/api/auth', {
      //   method: 'post',
      //   ...tokenConfig,
      //   body: JSON.stringify(credentials)
      // });
      const res = {
        status: 200
      };
      // const json = await res.json();
      const json = {
        token: 'token123',
        user: {
          nome: 'João',
          email: credentials.password,
          id: 123
        }
      };
      switch (res.status) {
        case 200:
          dispatch({ type: LOGIN_SUCCESS, payload: json });
          navigate('/');
          break;
        case 401:
          throw new Error('Erro Json');
        default:
          throw new Error('Erro Json');
      }
    } catch (err) {
      dispatch({ type: LOGIN_FAIL });
      console.log(err);
    }
  }

  async function signUp(credentials: any) {
    // User loading
    console.log(credentials);
    dispatch({ type: USER_LOADING });

    try {
      // const res = await fetch('/api/auth', {
      //   method: 'post',
      //   ...tokenConfig,
      //   body: JSON.stringify(credentials)
      // });
      const res = {
        status: 200
      };
      // const json = await res.json();
      const json = {
        token: 'token123',
        user: {
          nome: 'João',
          email: credentials.password,
          id: 123
        }
      };
      switch (res.status) {
        case 200:
          dispatch({ type: REGISTER_SUCCESS, payload: json });
          navigate('/');
          break;
        case 401:
          throw new Error('Erro Json');
        default:
          throw new Error('Erro Json');
      }
    } catch (err) {
      dispatch({ type: REGISTER_FAIL });
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
        loginEmail: state.loginEmail,
        loginStep,
        loadUser,
        resetLoginStep,
        resetLoginEmail,
        checkEmail,
        login,
        signUp,
        tokenConfig
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
