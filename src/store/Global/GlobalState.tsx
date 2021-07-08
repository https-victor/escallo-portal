import { createContext, useReducer } from 'react';
import GlobalReducer from './GlobalReducer';
import { CLEAR_GLOBALERRORS, SET_GLOBALERRORS, SET_GLOBALERROR, CLEAR_GLOBALERROR } from './actions';

const initialState = { globalErrors: [] };

export const GlobalContext = createContext<any>(initialState);

export const GlobalProvider: any = ({ children }: any) => {
  const [state, dispatch] = useReducer(GlobalReducer, initialState);

  function setGlobalError(globalError: any) {
    dispatch({ type: SET_GLOBALERROR, payload: globalError });
  }

  function clearGlobalError(globalError: number) {
    dispatch({ type: CLEAR_GLOBALERROR, payload: globalError });
  }

  function setGlobalErrors(globalErrors: any) {
    dispatch({ type: SET_GLOBALERRORS, payload: globalErrors });
  }

  function clearGlobalErrors() {
    dispatch({ type: CLEAR_GLOBALERRORS });
  }

  return (
    <GlobalContext.Provider
      value={{
        validation: {
          globalErrors: state.globalErrors,
          setGlobalError,
          clearGlobalError,
          setGlobalErrors,
          clearGlobalErrors
        }
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
