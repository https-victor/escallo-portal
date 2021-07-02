import { createContext, useReducer } from 'react';
import GlobalReducer from './GlobalReducer';
import { CLEAR_ERRORS, SET_ERRORS, SET_ERROR, CLEAR_ERROR } from './actions';

const initialState = { errors: [] };

export const GlobalContext = createContext<any>(initialState);

export const GlobalProvider: any = ({ children }: any) => {
  const [state, dispatch] = useReducer(GlobalReducer, initialState);

  function setError(error: any) {
    dispatch({ type: SET_ERROR, payload: error });
  }

  function clearError(error: number) {
    dispatch({ type: CLEAR_ERROR, payload: error });
  }

  function setErrors(errors: any) {
    dispatch({ type: SET_ERRORS, payload: errors });
  }

  function clearErrors() {
    dispatch({ type: CLEAR_ERRORS });
  }

  return (
    <GlobalContext.Provider
      value={{
        validation: {
          errors: state.errors,
          setError,
          clearError,
          setErrors,
          clearErrors
        }
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
