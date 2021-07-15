import { ActionMap, ClienteType, EditClienteType, ErrorType } from '../../utils/types';
import { actions } from './ClientesState';

export type ClientesType = {
  clientes: ClienteType[];
  loading: boolean;
  errors: ErrorType[];
};

type ClientesPayload = {
  [actions.loading]: undefined;
  [actions.loadSuccess]: ClienteType[];
  [actions.loadFailed]: ErrorType;
  [actions.update]: EditClienteType;
  [actions.updateFailed]: ErrorType;
  [actions.create]: ClienteType;
  [actions.createFailed]: ErrorType;
};

export type ClientesActions = ActionMap<ClientesPayload>[keyof ActionMap<ClientesPayload>];

export default (state: ClientesType, action: ClientesActions): ClientesType => {
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
        clientes: action.payload
      };
    case actions.loadFailed:
      return {
        ...state,
        clientes: [],
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
      const idx = state.clientes.findIndex((item: ClienteType) => item.id === action.payload.id);
      const oldItem = state.clientes.find((item: ClienteType) => item.id === action.payload.id);
      const clientesBef = state.clientes.slice(0, idx);
      const clientesAft = state.clientes.slice(idx + 1, state.clientes.length);
      return {
        ...state,
        loading: false,
        clientes: [...clientesBef, { ...oldItem, ...action.payload } as ClienteType, ...clientesAft]
      };
    }
    case actions.create: {
      return {
        ...state,
        loading: false,
        clientes: [...state.clientes, { ...action.payload }]
      };
    }
    default:
      return state;
  }
};
