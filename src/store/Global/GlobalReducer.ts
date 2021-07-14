import {
  SET_GLOBALERROR,
  SET_GLOBALERRORS,
  CLEAR_GLOBALERRORS,
  CLEAR_GLOBALERROR,
  SET_TITLE,
  SET_INDEX
} from './actions';

export default (state: any, action: any) => {
  switch (action.type) {
    case SET_TITLE:
      return {
        ...state,
        title: action.payload
      };
    case SET_INDEX:
      return {
        ...state,
        menuIndex: action.payload
      };
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
