import {
  LOADING_LIST,
  SUCCESS_LIST,
  LIST_FAIL,
  UPDATE_CLIENTE,
  UPDATE_FAIL,
  CREATE_FAIL,
  CREATE_CLIENTE
} from './actions';

export default (state: any, action: any) => {
  switch (action.type) {
    case LOADING_LIST:
      return {
        ...state,
        loading: true
      };
    case SUCCESS_LIST:
      return {
        ...state,
        loading: false,
        lista: action.payload
      };
    case LIST_FAIL:
      return {
        ...state,
        lista: [],
        loading: false,
        errors: action.payload
      };
    case UPDATE_FAIL:
    case CREATE_FAIL:
      return {
        ...state,
        loading: false,
        errors: action.payload
      };
    case UPDATE_CLIENTE: {
      const idx = state.lista.findIndex((item: any) => item.id === action.payload.id);
      const listaBef = state.lista.slice(0, idx);
      const listaAft = state.lista.slice(idx + 1, state.lista.length);
      return {
        ...state,
        loading: false,
        lista: [...listaBef, { ...action.payload }, ...listaAft]
      };
    }
    case CREATE_CLIENTE: {
      return {
        ...state,
        loading: false,
        lista: [...state.lista, { ...action.payload }]
      };
    }
    default:
      return state;
  }
};
