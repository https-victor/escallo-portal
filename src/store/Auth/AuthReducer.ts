import {
  USER_LOADING,
  USER_LOADED,
  LOGIN_SUCCESS,
  REGISTER_SUCCESS,
  AUTH_ERROR,
  LOGIN_FAIL,
  LOGOUT_SUCCESS,
  REGISTER_FAIL,
  LOGIN_EMAIL_CHECK_LOADING,
  LOGIN_EMAIL_CHECK,
  LOGIN_EMAIL_RESET,
  APP_LOADING,
  APP_LOADED,
  SET_AUTHERROR,
  CLEAR_AUTHERROR,
  SET_AUTHERRORS,
  CLEAR_AUTHERRORS
} from './actions';

export default (state: any, action: any) => {
  switch (action.type) {
    case APP_LOADING:
      return {
        ...state,
        loading: true
      };
    case APP_LOADED:
      return {
        ...state,
        loading: false
      };
    case USER_LOADING:
      return {
        ...state,
        userLoading: true
      };
    case USER_LOADED:
      return {
        ...state,
        authenticated: true,
        userLoading: false,
        user: action.payload
      };
    case LOGIN_SUCCESS:
    case REGISTER_SUCCESS:
      return {
        ...state,
        ...action.payload,
        authenticated: true,
        userLoading: false
      };
    case AUTH_ERROR:
    case LOGIN_FAIL:
    case LOGOUT_SUCCESS:
    case REGISTER_FAIL:
      return {
        ...state,
        user: null,
        authenticated: false,
        userLoading: false,
        errors: action.payload
          ? [...state.errors.filter((error: any) => error.id != action.payload.id), action.payload]
          : [...state.errors]
      };
    case LOGIN_EMAIL_RESET:
      return {
        ...state,
        loginEmail: ''
      };
    case LOGIN_EMAIL_CHECK:
      return {
        ...state,
        loginEmail: action.payload,
        emailCheckingLoading: false
      };
    case LOGIN_EMAIL_CHECK_LOADING:
      return {
        ...state,
        emailCheckingLoading: true
      };
    case SET_AUTHERROR:
      return {
        ...state,
        errors: [...state.errors, action.payload]
      };
    case CLEAR_AUTHERROR:
      return {
        ...state,
        errors: [...state.errors.filter((error: any) => error.id != action.payload)]
      };
    case SET_AUTHERRORS:
      return {
        ...state,
        errors: action.payload
      };
    case CLEAR_AUTHERRORS:
      return {
        ...state,
        errors: []
      };
    default:
      return state;
  }
};
