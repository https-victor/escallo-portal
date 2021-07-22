import { ActionMap, ErrorType } from '../../utils/types';
import { actions, ConsultorType, EditConsultorType } from './ConsultoresState';

export type ConsultoresType = {
  consultores: ConsultorType[];
  loading: boolean;
  errors: ErrorType[];
};

type ConsultoresPayload = {
  [actions.loading]: undefined;
  [actions.loadSuccess]: ConsultorType[];
  [actions.loadFailed]: ErrorType;
  [actions.update]: EditConsultorType;
  [actions.updateFailed]: ErrorType;
  [actions.create]: ConsultorType;
  [actions.createFailed]: ErrorType;
};

export type ConsultorsActions = ActionMap<ConsultoresPayload>[keyof ActionMap<ConsultoresPayload>];

export default (state: ConsultoresType, action: ConsultorsActions): ConsultoresType => {
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
        consultores: action.payload
      };
    case actions.loadFailed:
      return {
        ...state,
        consultores: [],
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
      const idx = state.consultores.findIndex((item: ConsultorType) => item.id === action.payload.id);
      const oldItem = state.consultores.find((item: ConsultorType) => item.id === action.payload.id);
      const consultoresBef = state.consultores.slice(0, idx);
      const consultoresAft = state.consultores.slice(idx + 1, state.consultores.length);
      return {
        ...state,
        loading: false,
        consultores: [...consultoresBef, { ...oldItem, ...action.payload } as ConsultorType, ...consultoresAft]
      };
    }
    case actions.create: {
      return {
        ...state,
        loading: false,
        consultores: [...state.consultores, { ...action.payload }]
      };
    }
    default:
      return state;
  }
};
