import { createContext, useReducer, useEffect, useContext, useState } from 'react';
import AuthReducer, { AuthType } from './AuthReducer';
import { GlobalContext } from '../Global/GlobalState';
import { useLocation, useNavigate } from 'react-router';
import { useMutation } from '@apollo/client';
import useImperativeQuery from '../../hooks/providers/useImperativeQuery';
import { USER_ADD, USER_AUTH } from '../../graphql/mutations/user';
import { CHECK_EMAIL, CHECK_TOKEN } from '../../graphql/queries/login';

export enum actions {
  appLoading = 'APP_LOADING',
  appSuccess = 'APP_SUCCESS',
  userLoading = 'USER_LOADING',
  userSuccess = 'USER_SUCCESS',
  loginSuccess = 'LOGIN_SUCCESS',
  loginFailed = 'LOGIN_FAILED',
  logoutSuccess = 'LOGOUT_SUCCESS',
  logoutFailed = 'LOGOUT_FAILED',
  registerSuccess = 'REGISTER_SUCCESS',
  registerFailed = 'REGISTER_FAILED',
  checkEmailLoading = 'CHECK_EMAIL_LOADING',
  checkEmail = 'CHECK_EMAIL',
  resetLoginEmail = 'RESET_LOGIN_EMAIL',
  authError = 'AUTH_ERROR',
  setAuthError = 'SET_AUTH_ERROR',
  clearAuthError = 'CLEAR_AUTH_ERROR',
  setAuthErrors = 'SET_AUTH_ERRORS',
  clearAuthErrors = 'CLEAR_AUTH_ERRORS'
}

const initialAuthState: AuthType = {
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
  const { token, onSetToken } = useContext(GlobalContext);
  const location = useLocation();

  const [state, dispatch] = useReducer(AuthReducer, initialAuthState);

  const [autenticarUsuario] = useMutation(USER_AUTH);
  const [signUp] = useMutation(USER_ADD);
  const checkToken = useImperativeQuery(CHECK_TOKEN);
  const checkEmailQuery = useImperativeQuery(CHECK_EMAIL);
  // const [checkEmailQuery, { loading: checkEmailLoading, data: emailExists }] = useLazyQuery(CHECK_EMAIL);

  const [pathname, setPathname] = useState('');

  const [loginStep, setLoginStep] = useState('email');
  const navigate = useNavigate();

  function setAuthError(error: any) {
    dispatch({ type: actions.setAuthError, payload: error });
  }

  function clearAuthError(error: number) {
    dispatch({ type: actions.clearAuthError, payload: error });
  }

  function setAuthErrors(errors: any) {
    dispatch({ type: actions.setAuthErrors, payload: errors });
  }

  function clearAuthErrors() {
    dispatch({ type: actions.clearAuthErrors });
  }

  function resetLoginStep(page = 'login') {
    page !== 'login' && navigate('/login');
    setLoginStep('email');
  }

  function resetLoginEmail() {
    navigate('/');
    dispatch({ type: actions.resetLoginEmail });
  }
  async function checkEmail(email: any) {
    dispatch({ type: actions.checkEmailLoading });
    if (email === 'mockup@futurotec.com.br') {
      dispatch({ type: actions.checkEmail, payload: email });
      setLoginStep('password');
    } else {
      try {
        const response = await checkEmailQuery({
          email
        });

        if (response?.data?.verificarSeUsuarioExiste) {
          dispatch({ type: actions.checkEmail, payload: email });
          setLoginStep('password');
        } else {
          dispatch({ type: actions.checkEmail, payload: email });
          navigate('/cadastro');
        }
      } catch (err) {
        dispatch({
          type: actions.authError,
          payload: {
            message: err,
            id: Date.now(),
            context: 'check_email_error',
            severity: 'error',
            title: 'Falha ao chegar o e-mail'
          }
        });
        console.log(err);
      }
    }
  }

  function logout(redirectPath = '/') {
    navigate(redirectPath);
    dispatch({ type: actions.logoutSuccess });
  }

  async function load() {
    // User loading
    dispatch({ type: actions.userLoading });

    if (token) {
      // get user by token
      const user = await checkToken();
      if (user?.data?.meusDados) {
        dispatch({ type: actions.userSuccess, payload: user.data.meusDados });
      } else {
        logout();
      }
    } else {
      logout();
    }
  }

  async function logoff() {
    // User loading
    dispatch({ type: actions.userLoading });

    try {
      onSetToken(null);
      navigate('/');
      dispatch({ type: actions.logoutSuccess });
    } catch (err) {
      dispatch({
        type: actions.logoutFailed,
        payload: {
          context: 'logout_error',
          severity: 'error',
          title: 'Falha ao efetuar logout',
          message: err,
          id: Date.now()
        }
      });
      console.log(err);
    }
  }

  async function login(credentials: any) {
    // User loading
    dispatch({ type: actions.userLoading });

    if (credentials.email === 'mockup@futurotec.com.br') {
      navigate(pathname);
      dispatch({
        type: actions.loginSuccess,
        payload: {
          email: 'mockup@futurotec.com.br',
          id: '12',
          nome: 'Mockup',
          status: 'ATIVO',
          telefone: '31998460353'
        }
      });
    } else {
      try {
        const user = await autenticarUsuario({
          variables: {
            email: credentials.email,
            senha: credentials.password
          }
        });
        navigate(pathname);
        dispatch({ type: actions.loginSuccess, payload: user?.data?.autenticarUsuario });
      } catch (err) {
        dispatch({
          type: actions.loginFailed,
          payload: {
            id: Date.now(),
            context: 'login_auth_error',
            severity: 'error',
            title: 'Falha na autenticação',
            message: err
          }
        });
      }
    }
  }

  async function onSignUp(credentials: any) {
    // User loading
    dispatch({ type: actions.userLoading });

    if (credentials.email === 'mockup@futurotec.com.br') {
      dispatch({
        type: actions.registerSuccess,
        payload: {
          email: 'mockup@futurotec.com.br',
          id: '12',
          nome: 'Mockup',
          status: 'ATIVO',
          telefone: '31998460353'
        }
      });
    } else {
      try {
        const user = await signUp({
          variables: { usuario: credentials }
        });
        navigate('/');
        dispatch({ type: actions.registerSuccess, payload: user?.data?.registrarUsuario });
      } catch (err) {
        dispatch({
          type: actions.registerFailed,
          payload: {
            id: Date.now(),
            context: 'sign_up_error',
            severity: 'error',
            title: 'Falha no cadastro',
            message: err
          }
        });
        console.log(err);
      }
    }
  }

  console.log(state.user);
  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (!token) {
      setPathname(location.pathname);
      logout();
    }
  }, [token]);
  return (
    <AuthContext.Provider
      value={{
        token: token,
        loading: state.loading,
        mockup: state.user && state.user.email ? state.user.email === 'mockup@futurotec.com.br' : false,
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
