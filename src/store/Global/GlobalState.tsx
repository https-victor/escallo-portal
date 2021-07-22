import { createContext, useReducer } from 'react';
import GlobalReducer from './GlobalReducer';
import {
  CLEAR_GLOBALERRORS,
  SET_GLOBALERRORS,
  SET_GLOBALERROR,
  CLEAR_GLOBALERROR,
  SET_TITLE,
  SET_INDEX
} from './actions';

const initialState = { globalErrors: [], title: 'Início', menuIndex: 1 };

export const GlobalContext = createContext<any>(initialState);

export const GlobalProvider: any = ({ children, token, onSetToken, apiConfig, setApiConfig }: any) => {
  const [state, dispatch] = useReducer(GlobalReducer, initialState);

  function setMenu(pagina = 'inicio') {
    switch (pagina) {
      case 'inicio':
        dispatch({ type: SET_INDEX, payload: 1 });
        dispatch({ type: SET_TITLE, payload: 'Início' });
        break;
      case 'consultores':
        dispatch({ type: SET_INDEX, payload: 2 });
        dispatch({ type: SET_TITLE, payload: 'Consultores' });
        break;
      case 'revendedores':
        dispatch({ type: SET_INDEX, payload: 3 });
        dispatch({ type: SET_TITLE, payload: 'Revendedores' });
        break;
      case 'clientes':
        dispatch({ type: SET_INDEX, payload: 4 });
        dispatch({ type: SET_TITLE, payload: 'Clientes' });
        break;
      case 'relatorios':
        dispatch({ type: SET_INDEX, payload: 5 });
        dispatch({ type: SET_TITLE, payload: 'Relatórios' });
        break;
      case 'portal':
        dispatch({ type: SET_INDEX, payload: 0 });
        dispatch({ type: SET_TITLE, payload: 'Portal' });
        break;
      case 'agente':
        dispatch({ type: SET_INDEX, payload: 0 });
        dispatch({ type: SET_TITLE, payload: 'Agente' });
        break;
      case 'gestor':
        dispatch({ type: SET_INDEX, payload: 0 });
        dispatch({ type: SET_TITLE, payload: 'Gestor' });
        break;
      case 'consultor':
        dispatch({ type: SET_INDEX, payload: 0 });
        dispatch({ type: SET_TITLE, payload: 'Consultor' });
        break;
      case 'diretor':
        dispatch({ type: SET_INDEX, payload: 0 });
        dispatch({ type: SET_TITLE, payload: 'Diretor' });
        break;
      case 'perfil':
        dispatch({ type: SET_INDEX, payload: 0 });
        dispatch({ type: SET_TITLE, payload: 'Perfil' });
        break;
      case '404':
        dispatch({ type: SET_INDEX, payload: 0 });
        dispatch({ type: SET_TITLE, payload: 'Não encontrado - 404' });
        break;
      case 'relatorio':
      case 'configuracoes':
        break;
      default:
        dispatch({ type: SET_INDEX, payload: 1 });
        dispatch({ type: SET_TITLE, payload: 'Início' });
        break;
    }
  }

  function setMenuIndex(index = 1) {
    dispatch({ type: SET_INDEX, payload: index });
  }
  function setTitle(title = 'Início') {
    dispatch({ type: SET_TITLE, payload: title });
  }

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
        token,
        apiConfig,
        setApiConfig,
        title: state.title,
        setTitle,
        setMenu,
        menuIndex: state.menuIndex,
        setMenuIndex,
        onSetToken,
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
