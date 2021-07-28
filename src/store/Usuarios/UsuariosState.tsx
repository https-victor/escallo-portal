import { createContext, useReducer, useEffect, useContext, useState } from 'react';
import UsuariosReducer, { UsuariosType } from './UsuariosReducer';
import { useMutation } from '@apollo/client';
import useImperativeQuery from '../../hooks/providers/useImperativeQuery';
import { USER_LIST, USER_LIST_STATUS } from '../../graphql/queries/usuarios';
import { USER_ADD, USER_AUTH, USER_UPDATE } from '../../graphql/mutations/usuarios';
import { FormikProps, useFormik } from 'formik';
import * as yup from 'yup';
import { AuthContext, UserType } from '../Auth/AuthState';
import { GlobalContext } from '../Global/GlobalState';
import { PERMISSOES } from '../../utils/vo/auth';

export enum actions {
  loading = 'LOADING',
  loadSuccess = 'LOAD_SUCCESS',
  loadFailed = 'LOAD_FAILED',
  update = 'UPDATE',
  updateFailed = 'UPDATE_FAILED',
  create = 'CREATE',
  createFailed = 'CREATE_FAILED',
  delete = 'EXCLUDE',
  deleteFailed = 'EXCLUDE_FAILED'
}

type Permissao = 'gestor' | 'diretor' | 'agente' | 'super' | 'consultor';

export type UsuarioType = {
  email: string;
  id: number;
  permissoes?: Array<Permissao>;
};

export type EditUsuarioType = {
  email?: string;
  id: number;
  permissoes?: Array<Permissao>;
};

export type UsuariosFormValues = {
  first: boolean;
  second: boolean;
  email: string;
};

type UsuarioContextType = {
  onCreateUsuario: (values: UsuariosFormValues, form: FormikProps<UsuariosFormValues>) => void;
  onUpdateUsuario: (fields: EditUsuarioType) => void;
  onDeleteUsuario: (userId: number) => void;
  loading: boolean;
  usuarios: any[];
};

const initialUsuarioState: UsuariosType = {
  usuarios: [],
  loading: true,
  errors: []
};

const initialMockupDiretor: UsuarioType[] = [
  {
    email: 'usuario1@teste.com.br',
    id: 1,
    permissoes: ['consultor', 'diretor']
  },
  {
    email: 'usuario2@teste.com.br',
    id: 2,
    permissoes: ['consultor']
  },
  {
    email: 'usuario3@teste.com.br',
    id: 3,
    permissoes: ['diretor']
  },
  {
    email: 'usuario5@teste.com.br',
    id: 5,
    permissoes: ['consultor', 'diretor']
  }
];

const initialMockupGestor: UsuarioType[] = [
  {
    email: 'usuario1@teste.com.br',
    id: 1,
    permissoes: ['agente', 'gestor']
  },
  {
    email: 'usuario2@teste.com.br',
    id: 2,
    permissoes: ['agente']
  },
  {
    email: 'usuario3@teste.com.br',
    id: 3,
    permissoes: ['gestor']
  },
  {
    email: 'usuario5@teste.com.br',
    id: 5,
    permissoes: ['agente', 'gestor']
  }
];

const initialMockupSuper: UsuarioType[] = [
  {
    email: 'usuario1@teste.com.br',
    id: 1,
    permissoes: ['super']
  },
  {
    email: 'usuario2@teste.com.br',
    id: 2,
    permissoes: ['super']
  },
  {
    email: 'usuario3@teste.com.br',
    id: 3,
    permissoes: ['super']
  },
  {
    email: 'usuario5@teste.com.br',
    id: 5,
    permissoes: ['super']
  }
];

export const UsuariosContext = createContext({} as UsuarioContextType);

export const UsuarioProvider: any = ({ children }: any) => {
  const { apiConfig } = useContext(GlobalContext);
  const { permissao } = apiConfig;
  const { AGENTE, DIRETOR, GESTOR, CONSULTOR, SUPER } = PERMISSOES;

  const isSuper = Boolean(permissao === SUPER);
  const isDiretor = Boolean(permissao === DIRETOR);

  const { mockup, auth } = useContext(AuthContext);

  const initialMockupState = isSuper ? initialMockupSuper : isDiretor ? initialMockupDiretor : initialMockupGestor;

  const [state, dispatch] = useReducer(UsuariosReducer, initialUsuarioState);

  const [createUser] = useMutation(USER_ADD);
  const [updateUser] = useMutation(USER_UPDATE);

  const queryUsuario = useImperativeQuery(USER_LIST);
  const queryUsuarioByStatus = useImperativeQuery(USER_LIST_STATUS);

  async function loadUsuario(status = '') {
    dispatch({ type: actions.loading });
    if (mockup) {
      await setTimeout(() => {
        dispatch({
          type: actions.loadSuccess,
          payload: initialMockupState
        });
      }, 1500);
    } else {
      try {
        const usuarios = status ? await queryUsuarioByStatus(status) : await queryUsuario();

        dispatch({ type: actions.loadSuccess, payload: usuarios?.data?.usuarios });
      } catch (err) {
        console.log(err);
        dispatch({
          type: actions.loadFailed,
          payload: {
            id: Date.now(),
            context: 'load_usuarios_error',
            severity: 'error',
            title: 'Falha na requisição',
            message: err
          }
        });
      }
    }
  }

  async function onCreateUsuario(values: UsuariosFormValues, form: FormikProps<UsuariosFormValues>) {
    dispatch({ type: actions.loading });

    const permissoes: Permissao[] = !isSuper
      ? ([values.first && isDiretor ? CONSULTOR : AGENTE, values.second && isDiretor ? DIRETOR : GESTOR] as Permissao[])
      : ([SUPER] as Permissao[]);

    if (mockup) {
      console.log(values);
      await setTimeout(() => {
        dispatch({
          type: actions.create,
          payload: {
            email: values.email,
            id: Date.now(),
            permissoes
          }
        });
        form.resetForm();
      }, 2000);
    }
    // else {
    //   try {

    //     const createdUser = await createUser({
    //       variables: {usuario: {}}
    //     })

    //     dispatch({ type: actions.create, payload: });
    //     form.resetForm();
    //   } catch (err) {
    //     dispatch({
    //       type: actions.createFailed,
    //       payload: {
    //         id: Date.now(),
    //         context: 'usuario_create_error',
    //         severity: 'error',
    //         title: 'Falha no cadastro do usuario',
    //         message: err
    //       }
    //     });
    //     console.log(err);
    //   }
    // }
  }

  async function onUpdateUsuario(fields: EditUsuarioType) {
    dispatch({ type: actions.loading });
    if (mockup) {
      await setTimeout(() => {
        dispatch({
          type: actions.update,
          payload: {
            ...fields
          }
        });
      }, 800);
    } else {
      try {
        const updatedUser = await updateUser({
          variables: { usuario: fields }
        });

        dispatch({ type: actions.update, payload: updatedUser.data.atualizarUsuario });
      } catch (err) {
        dispatch({
          type: actions.updateFailed,
          payload: {
            id: Date.now(),
            context: 'usuario_update_error',
            severity: 'error',
            title: 'Falha na atualização do usuario',
            message: err
          }
        });
        console.log(err);
      }
    }
  }

  async function onDeleteUsuario(userId: number) {
    dispatch({ type: actions.loading });
    if (mockup) {
      await setTimeout(
        () => [
          dispatch({
            type: actions?.delete,
            payload: userId
          })
        ],
        800
      );
    }
  }

  useEffect(() => {
    loadUsuario();
  }, []);

  return (
    <UsuariosContext.Provider
      value={{
        onUpdateUsuario,
        onCreateUsuario,
        onDeleteUsuario,
        loading: state.loading,
        usuarios: state.usuarios
      }}
    >
      {children}
    </UsuariosContext.Provider>
  );
};
