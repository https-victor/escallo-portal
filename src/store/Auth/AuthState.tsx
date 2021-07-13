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

import { useMutation, useLazyQuery } from '@apollo/client';
import useImperativeQuery from '../../hooks/providers/useImperativeQuery';
import { USER_ADD, USER_AUTH } from '../mutations/user';
import { CHECK_EMAIL, CHECK_TOKEN } from '../query/login';

const initialAuthState = {
  user: null,
  authenticated: false,
  loading: true,
  userLoading: true,
  errors: [],
  loginEmail: '',
  emailCheckingLoading: false
};

export const AuthContext = createContext<any>(initialAuthState);

export const AuthProvider: any = ({ children }: any) => {
  const { validation, token, onSetToken } = useContext(GlobalContext);
  const { globalErrors, setGlobalError, clearGlobalError, setGlobalErrors, clearGlobalErrors } = validation;

  const [state, dispatch] = useReducer(AuthReducer, initialAuthState);

  const [autenticarUsuario, { loading: authUserLoading, data: authUserData }] = useMutation(USER_AUTH);
  const [signUp, { loading: signUpLoading, data: signUpData }] = useMutation(USER_ADD);
  const checkToken = useImperativeQuery(CHECK_TOKEN);
  const checkEmailQuery = useImperativeQuery(CHECK_EMAIL);
  // const [checkEmailQuery, { loading: checkEmailLoading, data: emailExists }] = useLazyQuery(CHECK_EMAIL);

  const [loginStep, setLoginStep] = useState('email');
  const navigate = useNavigate();

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
      const response = await checkEmailQuery({
        email
      });

      if (response && response.data && response.data.verificarSeUsuarioExiste) {
        dispatch({ type: LOGIN_EMAIL_CHECK, payload: email });
        setLoginStep('password');
      } else {
        dispatch({ type: LOGIN_EMAIL_CHECK, payload: email });
        navigate('/cadastro');
      }
    } catch (err) {
      dispatch({ type: AUTH_ERROR });
      console.log(err);
    }
  }

  function logout() {
    navigate('/');
    dispatch({ type: AUTH_ERROR });
  }

  async function load() {
    // User loading
    dispatch({ type: USER_LOADING });

    if (token) {
      // get user by token
      const user = await checkToken();
      if (user && user.data && user.data.meusDados) {
        dispatch({ type: USER_LOADED, payload: user.data.meusDados });
      } else {
        logout();
      }
    } else {
      logout();
    }
  }

  async function logoff() {
    // User loading
    dispatch({ type: USER_LOADING });

    try {
      onSetToken(null);
      navigate('/');
      dispatch({ type: LOGOUT_SUCCESS });
    } catch (err) {
      dispatch({ type: LOGIN_FAIL });
      console.log(err);
    }
  }

  async function login(credentials: any) {
    // User loading
    dispatch({ type: USER_LOADING });

    try {
      const user = await autenticarUsuario({
        variables: {
          email: credentials.email,
          senha: credentials.password
        }
      });
      console.log(user);
      navigate('/');
      dispatch({ type: LOGIN_SUCCESS, payload: user });
    } catch (err) {
      dispatch({
        type: LOGIN_FAIL,
        payload: { id: 'login_auth_error', severity: 'error', title: 'Falha na autenticação', error: err }
      });
    }
  }

  async function onSignUp(credentials: any) {
    // User loading
    dispatch({ type: USER_LOADING });

    try {
      const user = await signUp({
        variables: { usuario: credentials }
      });
      navigate('/');
      dispatch({ type: REGISTER_SUCCESS, payload: user });
    } catch (err) {
      dispatch({ type: REGISTER_FAIL });
      console.log(err);
    }
  }

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (!token) {
      logout();
    }
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        token: token,
        loading: state.loading,
        user: {
          data: state.user,
          authenticated: state.authenticated,
          loading: state.userLoading
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
          onSignUp,
          checkEmail,
          loginStep,
          loginEmail: state.loginEmail,
          resetLoginStep,
          resetLoginEmail
        }
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
