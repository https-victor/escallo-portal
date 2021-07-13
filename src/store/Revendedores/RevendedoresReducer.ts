import { LOADING_LIST, SUCCESS_LIST, LIST_FAIL, UPDATE_REVENDEDOR, UPDATE_FAIL } from './actions';

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
      return {
        ...state,
        loading: false,
        errors: action.payload
      };
    case UPDATE_REVENDEDOR: {
      const idx = state.lista.findIndex((item: any) => item.id === action.payload.id);
      const listaBef = state.lista.slice(0, idx);
      const listaAft = state.lista.slice(idx + 1, state.lista.length);
      return {
        ...state,
        loading: false,
        lista: [...listaBef, { ...action.payload }, ...listaAft]
      };
    }
    default:
      return state;
  }
};
