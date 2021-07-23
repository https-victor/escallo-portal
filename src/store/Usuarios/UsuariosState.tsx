import { createContext, useReducer, useEffect, useContext, useState } from 'react';
import UsuariosReducer, { UsuariosType } from './UsuariosReducer';
import { useMutation } from '@apollo/client';
import useImperativeQuery from '../../hooks/providers/useImperativeQuery';
// import { USUARIO_LIST, USUARIO_LIST_STATUS } from '../../graphql/queries/usuarios';
// import { USUARIO_CREATE, USUARIO_EDIT } from '../../graphql/mutations/usuarios';
import { FormikProps, useFormik } from 'formik';
import * as yup from 'yup';
import { AuthContext, UserType } from '../Auth/AuthState';
import { GlobalContext } from '../Global/GlobalState';

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

type Permissao = 'gestor' | 'diretor' | 'agente' | 'super';

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

type FormikValues = {
  permissoes: Array<Permissao>;
  email: string;
};

type UsuarioContextType = {
  usuarioForm: FormikProps<FormikValues>;
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
    permissoes: ['gestor', 'diretor']
  },
  {
    email: 'usuario2@teste.com.br',
    id: 2,
    permissoes: ['gestor']
  },
  {
    email: 'usuario3@teste.com.br',
    id: 3,
    permissoes: ['diretor']
  },
  {
    email: 'usuario5@teste.com.br',
    id: 5,
    permissoes: ['gestor', 'diretor']
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
  const isSuper = Boolean(permissao === 'super');
  const isDiretor = Boolean(permissao === 'diretor');
  const { mockup } = useContext(AuthContext);

  const initialMockupState = isSuper ? initialMockupSuper : isDiretor ? initialMockupDiretor : initialMockupGestor;

  const [state, dispatch] = useReducer(UsuariosReducer, initialUsuarioState);

  // const [updateUsuario] = useMutation(USUARIO_EDIT);
  // const [createUsuario] = useMutation(USUARIO_CREATE);
  // const queryUsuario = useImperativeQuery(USUARIO_LIST);
  // const queryUsuarioByStatus = useImperativeQuery(USUARIO_LIST_STATUS);

  async function loadUsuario(status = '') {
    dispatch({ type: actions.loading });
    if (mockup) {
      await setTimeout(() => {
        dispatch({
          type: actions.loadSuccess,
          payload: initialMockupState
        });
      }, 1500);
    }
    // else {
    //   try {
    //     const usuarios = status ? await queryUsuarioByStatus(status) : await queryUsuario();
    //     dispatch({ type: actions.loadSuccess, payload: usuarios?.data?.usuarios });
    //   } catch (err) {
    //     console.log(err);
    //     dispatch({
    //       type: actions.loadFailed,
    //       payload: {
    //         id: Date.now(),
    //         context: 'load_usuarios_error',
    //         severity: 'error',
    //         title: 'Falha na requisição',
    //         message: err
    //       }
    //     });
    //   }
    // }
  }

  async function onCreateUsuario(values: FormikValues) {
    dispatch({ type: actions.loading });
    if (mockup) {
      await setTimeout(() => {
        dispatch({
          type: actions.create,
          payload: {
            email: values.email,
            id: Date.now(),
            permissoes: values.permissoes
          }
        });
        usuarioForm.resetForm();
      }, 2000);
    }
    // else {
    //   // try {
    //   //   const createdUsuario = await createUsuario({
    //   //     variables: { usuario: { ...values, status: 'ATIVO' } }
    //   //   });
    //   //   dispatch({ type: actions.create, payload: createdUsuario.data.criarUsuario });
    //   //   usuarioForm.resetForm();
    //   // } catch (err) {
    //   //   dispatch({
    //   //     type: actions.createFailed,
    //   //     payload: {
    //   //       id: Date.now(),
    //   //       context: 'usuario_create_error',
    //   //       severity: 'error',
    //   //       title: 'Falha no cadastro do usuario',
    //   //       message: err
    //   //     }
    //   //   });
    //   //   console.log(err);
    //   // }
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
    }
    //  else {
    //   // try {
    //   //   const updatedUsuario = await updateUsuario({
    //   //     variables: { usuario: fields }
    //   //   });
    //   //   dispatch({ type: actions.update, payload: updatedUsuario.data.atualizarUsuario });
    //   // } catch (err) {
    //   //   dispatch({
    //   //     type: actions.updateFailed,
    //   //     payload: {
    //   //       id: Date.now(),
    //   //       context: 'usuario_update_error',
    //   //       severity: 'error',
    //   //       title: 'Falha na atualização do usuario',
    //   //       message: err
    //   //     }
    //   //   });
    //   //   console.log(err);
    //   // }
    // }
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

  const usuarioFormValidation = yup.object({
    email: yup.string().email('Digite um e-mail válido').required('Digite um e-mail'),
    permissoes: yup.array().min(1, 'Selecione ao menos uma permissão')
  });
  const usuarioFormInitialValues: FormikValues = {
    email: '',
    permissoes: isSuper ? ['super'] : []
  };
  const usuarioForm = useFormik({
    initialValues: usuarioFormInitialValues,
    validationSchema: usuarioFormValidation,
    onSubmit: (values: FormikValues) => {
      onCreateUsuario(values);
    }
  });

  useEffect(() => {
    loadUsuario();
  }, []);

  return (
    <UsuariosContext.Provider
      value={{
        onUpdateUsuario,
        onDeleteUsuario,
        usuarioForm,
        loading: state.loading,
        usuarios: state.usuarios
      }}
    >
      {children}
    </UsuariosContext.Provider>
  );
};
