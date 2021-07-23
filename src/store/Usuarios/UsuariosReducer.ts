import { ActionMap, ErrorType } from '../../utils/types';
import { actions, UsuarioType, EditUsuarioType } from './UsuariosState';

export type UsuariosType = {
  usuarios: UsuarioType[];
  loading: boolean;
  errors: ErrorType[];
};

type UsuariosPayload = {
  [actions.loading]: undefined;
  [actions.loadSuccess]: UsuarioType[];
  [actions.loadFailed]: ErrorType;
  [actions.update]: EditUsuarioType;
  [actions.updateFailed]: ErrorType;
  [actions.create]: UsuarioType;
  [actions.createFailed]: ErrorType;
};

export type UsuariosActions = ActionMap<UsuariosPayload>[keyof ActionMap<UsuariosPayload>];

export default (state: UsuariosType, action: UsuariosActions): UsuariosType => {
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
        usuarios: action.payload
      };
    case actions.loadFailed:
      return {
        ...state,
        usuarios: [],
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
      const idx = state.usuarios.findIndex((item: UsuarioType) => item.id === action.payload.id);
      const oldItem = state.usuarios.find((item: UsuarioType) => item.id === action.payload.id);
      const usuariosBef = state.usuarios.slice(0, idx);
      const usuariosAft = state.usuarios.slice(idx + 1, state.usuarios.length);
      return {
        ...state,
        loading: false,
        usuarios: [...usuariosBef, { ...oldItem, ...action.payload } as UsuarioType, ...usuariosAft]
      };
    }
    case actions.create: {
      return {
        ...state,
        loading: false,
        usuarios: [...state.usuarios, { ...action.payload }]
      };
    }
    default:
      return state;
  }
};
