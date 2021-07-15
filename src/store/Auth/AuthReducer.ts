import { ActionMap, ErrorType, UserType } from '../../utils/types';
import { actions } from './AuthState';

export type AuthType = {
  user: UserType;
  authenticated: boolean;
  loading: boolean;
  userLoading: boolean;
  errors: ErrorType[];
  loginEmail: string;
  emailCheckingLoading: boolean;
};

type AuthPayload = {
  [actions.appLoading]: undefined;
  [actions.appSuccess]: undefined;
  [actions.userLoading]: undefined;
  [actions.resetLoginEmail]: undefined;
  [actions.checkEmailLoading]: undefined;
  [actions.userSuccess]: UserType;
  [actions.loginSuccess]: UserType;
  [actions.registerSuccess]: UserType;
  [actions.logoutSuccess]: undefined;
  [actions.checkEmail]: string;
  [actions.logoutFailed]: ErrorType;
  [actions.authError]: ErrorType;
  [actions.loginFailed]: ErrorType;
  [actions.registerFailed]: ErrorType;
  [actions.setAuthError]: ErrorType;
  [actions.setAuthErrors]: ErrorType[];
  [actions.clearAuthError]: number;
  [actions.clearAuthErrors]: undefined;
};

export type AuthActions = ActionMap<AuthPayload>[keyof ActionMap<AuthPayload>];

export default (state: AuthType, action: AuthActions): AuthType => {
  switch (action.type) {
    case actions.appLoading:
      return {
        ...state,
        loading: true
      };
    case actions.appSuccess:
      return {
        ...state,
        loading: false
      };
    case actions.userLoading:
      return {
        ...state,
        userLoading: true
      };
    case actions.userSuccess:
    case actions.loginSuccess:
    case actions.registerSuccess:
      return {
        ...state,
        user: action.payload,
        authenticated: true,
        userLoading: false
      };
    case actions.logoutSuccess:
      return {
        ...state,
        user: null,
        authenticated: false,
        userLoading: false,
        errors: []
      };
    case actions.authError:
    case actions.loginFailed:
    case actions.registerFailed:
      return {
        ...state,
        user: null,
        authenticated: false,
        userLoading: false,
        errors: action.payload
          ? [...state.errors.filter((error: ErrorType) => error.id != action.payload.id), action.payload]
          : [...state.errors]
      };
    case actions.resetLoginEmail:
      return {
        ...state,
        loginEmail: ''
      };
    case actions.checkEmail:
      return {
        ...state,
        loginEmail: action.payload,
        emailCheckingLoading: false
      };
    case actions.checkEmailLoading:
      return {
        ...state,
        emailCheckingLoading: true
      };
    case actions.setAuthError:
      return {
        ...state,
        errors: [...state.errors, action.payload]
      };
    case actions.clearAuthError:
      return {
        ...state,
        errors: [...state.errors.filter((error: ErrorType) => error.id !== action.payload)]
      };
    case actions.setAuthErrors:
      return {
        ...state,
        errors: action.payload
      };
    case actions.clearAuthErrors:
      return {
        ...state,
        errors: []
      };
    default:
      return state;
  }
};
