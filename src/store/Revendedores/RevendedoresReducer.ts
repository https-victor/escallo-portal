import { ActionMap, ErrorType } from '../../utils/types';
import { actions, EditRevendedorType, RevendedorType } from './RevendedoresState';

export type RevendedoresType = {
  revendedores: RevendedorType[];
  loading: boolean;
  errors: ErrorType[];
};

type RevendedoresPayload = {
  [actions.loading]: undefined;
  [actions.loadSuccess]: RevendedorType[];
  [actions.loadFailed]: ErrorType;
  [actions.update]: EditRevendedorType;
  [actions.updateFailed]: ErrorType;
  [actions.create]: RevendedorType;
  [actions.createFailed]: ErrorType;
};

export type RevendedoresActions = ActionMap<RevendedoresPayload>[keyof ActionMap<RevendedoresPayload>];

export default (state: RevendedoresType, action: RevendedoresActions): RevendedoresType => {
  switch (action.type) {
    case actions.loading:
      return {
        ...state,
        loading: true
      };
    case actions.loadSuccess:
      return {
        ...state,
        loading: false,
        revendedores: action.payload
      };
    case actions.loadFailed:
      return {
        ...state,
        revendedores: [],
        loading: false,
        errors: action.payload
          ? [...state.errors.filter((error: ErrorType) => error.id != action.payload.id), action.payload]
          : [...state.errors]
      };
    case actions.updateFailed:
    case actions.createFailed:
      return {
        ...state,
        loading: false,
        errors: action.payload
          ? [...state.errors.filter((error: ErrorType) => error.id != action.payload.id), action.payload]
          : [...state.errors]
      };
    case actions.update: {
      const idx = state.revendedores.findIndex((item: RevendedorType) => item.id === action.payload.id);
      const oldItem = state.revendedores.find((item: RevendedorType) => item.id === action.payload.id);
      const revendedoresBef = state.revendedores.slice(0, idx);
      const revendedoresAft = state.revendedores.slice(idx + 1, state.revendedores.length);
      return {
        ...state,
        loading: false,
        revendedores: [...revendedoresBef, { ...oldItem, ...action.payload } as RevendedorType, ...revendedoresAft]
      };
    }
    case actions.create: {
      return {
        ...state,
        loading: false,
        revendedores: [...state.revendedores, { ...action.payload }]
      };
    }
    default:
      return state;
  }
};
