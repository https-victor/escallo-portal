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
  REGISTER_FAIL,
  LOGOUT_SUCCESS,
  CLEAR_AUTHERROR,
  SET_AUTHERROR,
  SET_AUTHERRORS,
  CLEAR_AUTHERRORS
} from './actions';
import { useNavigate } from 'react-router';

import { useMutation } from '@apollo/client';
import { USER_AUTH } from '../../GraphQL/queries/user';
import useLocalStorageState from '../../utils/useLocalStorageState';

const initialAuthState = {
  user: null,
  authenticated: false,
  token: localStorage.getItem('token'),
  loading: true,
  userLoading: true,
  errors: [],
  loginEmail: '',
  emailCheckingLoading: false
};

export const AuthContext = createContext<any>(initialAuthState);

export const AuthProvider: any = ({ children }: any) => {
  const { validation } = useContext(GlobalContext);
  const { globalErrors, setGlobalError, clearGlobalError, setGlobalErrors, clearGlobalErrors } = validation;

  const [state, dispatch] = useReducer(AuthReducer, initialAuthState);

  // const [token, setToken] = useLocalStorageState('token', undefined);

  const [autenticarUsuario, { loading, data }] = useMutation(USER_AUTH);

  const [loginStep, setLoginStep] = useState('email');
  const navigate = useNavigate();

  const tokenConfig = {
    headers: {
      'Content-type': 'application/json',
      ...(state.token ? { 'x-auth-token': state.token } : {})
    }
  };

  function setAuthError(error: any) {
    dispatch({ type: SET_AUTHERROR, payload: error });
  }

  function clearAuthError(error: number) {
    dispatch({ type: CLEAR_AUTHERROR, payload: error });
  }

  function setAuthErrors(errors: any) {
    dispatch({ type: SET_AUTHERRORS, payload: errors });
  }

  function clearAuthErrors() {
    dispatch({ type: CLEAR_AUTHERRORS });
  }

  function resetLoginStep(page = 'login') {
    page !== 'login' && navigate('/login');
    setLoginStep('email');
  }

  function resetLoginEmail() {
    navigate('/');
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
          if (!(json.email === 'super@escallo.com.br')) {
            navigate('/cadastro');
            // Notificação: "Esse e-mail não existe, por favor cadastre-se"
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

  async function load() {
    // User loading
    dispatch({ type: USER_LOADING });

    try {
      const res = {
        status: 200
      };
      const json = { nome: 'João', id: 123 };
      switch (res.status) {
        case 200:
          navigate('/');
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

  async function logoff() {
    // User loading
    dispatch({ type: USER_LOADING });

    try {
      const res = {
        status: 200
      };
      switch (res.status) {
        case 200:
          navigate('/');
          dispatch({ type: LOGOUT_SUCCESS });
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

  async function login(credentials: any) {
    // User loading
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
      const user = await autenticarUsuario({
        variables: {
          email: credentials.email,
          senha: credentials.password
        }
      });
      console.log(user.data.token);
      switch (res.status) {
        case 200:
          navigate('/');
          dispatch({ type: LOGIN_SUCCESS, payload: user });
          break;
        case 401:
          throw new Error('Erro Json');
        default:
          throw new Error('Erro Json');
      }
    } catch (err) {
      dispatch({
        type: LOGIN_FAIL,
        payload: { id: 'login_auth_error', severity: 'error', title: 'Falha na autenticação', error: err }
      });
    }
  }

  async function signUp(credentials: any) {
    // User loading
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
          navigate('/');
          dispatch({ type: REGISTER_SUCCESS, payload: json });
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
    load();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        loading: state.loading,
        user: {
          data: state.user,
          authenticated: state.authenticated,
          loading: state.userLoading,
          token: state.token
        },
        auth: {
          validation: {
            errors: state.errors,
            setAuthError,
            clearAuthError,
            setAuthErrors,
            clearAuthErrors
          },
          load,
          logoff,
          login,
          signUp,
          checkEmail,
          loginStep,
          loginEmail: state.loginEmail,
          resetLoginStep,
          resetLoginEmail,
          tokenConfig
        }
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
