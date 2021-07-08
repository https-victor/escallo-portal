import { SET_GLOBALERROR, SET_GLOBALERRORS, CLEAR_GLOBALERRORS, CLEAR_GLOBALERROR } from './actions';

export default (state: any, action: any) => {
  switch (action.type) {
    case SET_GLOBALERROR:
      return {
        ...state,
        globalErrors: [...state.globalErrors, action.payload]
      };
    case CLEAR_GLOBALERROR:
      return {
        ...state,
        globalErrors: [...state.globalErrors.filter((globalError: any) => globalError.id != action.payload)]
      };
    case SET_GLOBALERRORS:
      return {
        ...state,
        globalErrors: action.payload
      };
    case CLEAR_GLOBALERRORS:
      return {
        ...state,
        globalErrors: []
      };
    default:
      return state;
  }
};
