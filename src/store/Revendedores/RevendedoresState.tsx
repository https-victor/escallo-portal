import { createContext, useReducer, useEffect, useContext } from 'react';
import RevendedoresReducer, { RevendedoresType } from './RevendedoresReducer';
import { useMutation } from '@apollo/client';
import useImperativeQuery from '../../hooks/providers/useImperativeQuery';
import { REVENDEDOR_LIST, REVENDEDOR_LIST_STATUS } from '../../graphql/queries/revendedores';
import { REVENDEDOR_CREATE, REVENDEDOR_EDIT, REVENDEDOR_SALVAR_EMAIL } from '../../graphql/mutations/revendedores';
import { FormikProps, useFormik } from 'formik';

import { AuthContext } from '../Auth/AuthState';

export enum actions {
  loading = 'LOADING',
  loadSuccess = 'SUCCESS',
  loadFailed = 'FAILED',
  update = 'UPDATE',
  updateFailed = 'UPDATE_FAILED',
  create = 'CREATE',
  createFailed = 'CREATE_FAILED'
}

export type RevendedorType = {
  email: string;
  id: number;
  label: string;
  nome: string;
  status: 'ATIVO' | 'INATIVO';
};

export type RevendedorKey = keyof RevendedorType;

export type EditRevendedorType = {
  email?: string;
  id: number;
  label?: string;
  nome?: string;
  status?: 'ATIVO' | 'INATIVO';
};

export type RevendedoresFormValues = {
  email: string;
  label: string;
  nome: string;
};
type RevendedorContextType = {
  onUpdateRevendedor: (values: EditRevendedorType) => void;
  onCreateRevendedor: (values: RevendedoresFormValues, form: FormikProps<RevendedoresFormValues>) => void;
  loading: boolean;
  revendedores: any[];
};

const initialRevendedoresState: RevendedoresType = {
  revendedores: [],
  loading: true,
  errors: []
};

const initialMockupState: RevendedorType[] = [
  {
    email: 'revendedor1@teste.com.br',
    id: 1,
    label: 'Revendedor 1',
    nome: 'Revendedor 1',
    status: 'ATIVO'
  },
  {
    email: 'revendedor2@teste.com.br',
    id: 2,
    label: 'Revendedor 2',
    nome: 'Revendedor 2',
    status: 'ATIVO'
  },
  {
    email: 'revendedor3@teste.com.br',
    id: 3,
    label: 'Revendedor 3',
    nome: 'Revendedor 3',
    status: 'ATIVO'
  }
];

export const RevendedoresContext = createContext({} as RevendedorContextType);

export const RevendedoresProvider: any = ({ children }: any) => {
  const { mockup } = useContext(AuthContext);

  const [state, dispatch] = useReducer(RevendedoresReducer, initialRevendedoresState);

  const [updateRevendedor] = useMutation(REVENDEDOR_EDIT);
  const [createRevendedor] = useMutation(REVENDEDOR_CREATE);
  const [emailRevendedor] = useMutation(REVENDEDOR_SALVAR_EMAIL);

  const queryRevendedores = useImperativeQuery(REVENDEDOR_LIST);
  const queryRevendedoresByStatus = useImperativeQuery(REVENDEDOR_LIST_STATUS);

  async function loadRevendedores(status = '') {
    dispatch({ type: actions.loading });
    if (mockup) {
      await setTimeout(() => {
        dispatch({
          type: actions.loadSuccess,
          payload: initialMockupState
        });
      }, 2000);
    } else {
      try {
        const loadedRevendedores = status ? await queryRevendedoresByStatus(status) : await queryRevendedores();
        dispatch({ type: actions.loadSuccess, payload: loadedRevendedores?.data?.revendedores });
      } catch (err) {
        console.log(err);
        dispatch({
          type: actions.loadFailed,
          payload: {
            id: Date.now(),
            context: 'load_revendedores_error',
            severity: 'error',
            title: 'Falha na requisição',
            message: err
          }
        });
      }
    }
  }

  async function onCreateRevendedor(values: RevendedoresFormValues, form: FormikProps<RevendedoresFormValues>) {
    dispatch({ type: actions.loading });
    if (mockup) {
      await setTimeout(() => {
        dispatch({
          type: actions.create,
          payload: {
            email: values.email,
            id: Date.now(),
            label: values.label,
            nome: values.nome,
            status: 'ATIVO'
          }
        });
        form.resetForm();
      }, 1500);
    } else {
      try {
        const createdRevendedor = await createRevendedor({
          variables: { revendedor: { nome: values.nome, label: values.label, status: 'ATIVO', token: 'Tokenstring' } }
        });

        const { id } = createdRevendedor?.data.criarRevendedor;

        await emailRevendedor({
          variables: {
            email: { idRevendedor: parseFloat(id), valor: values.email, isDiretor: true, isConsultor: false }
          }
        });

        dispatch({ type: actions.create, payload: createdRevendedor.data.criarRevendedor });

        form.resetForm();
      } catch (err) {
        dispatch({
          type: actions.createFailed,
          payload: {
            id: Date.now(),
            context: 'revendedor_create_error',
            severity: 'error',
            title: 'Falha no cadastro do revendedor',
            message: err
          }
        });
        console.log(err);
      }
    }
  }

  async function onUpdateRevendedor(values: EditRevendedorType) {
    dispatch({ type: actions.loading });
    if (mockup) {
      await setTimeout(() => {
        dispatch({
          type: actions.update,
          payload: {
            ...values
          }
        });
      }, 800);
    } else {
      try {
        const updatedRevendedor = await updateRevendedor({
          variables: { revendedor: { ...values } }
        });

        dispatch({ type: actions.update, payload: updatedRevendedor.data.atualizarRevendedor });
      } catch (err) {
        dispatch({
          type: actions.updateFailed,
          payload: {
            id: Date.now(),
            context: 'revendedor_update_error',
            severity: 'error',
            title: 'Falha na atualização do revendedor',
            message: err
          }
        });
        console.log(err);
      }
    }
  }

  useEffect(() => {
    loadRevendedores();
  }, []);

  return (
    <RevendedoresContext.Provider
      value={{
        onUpdateRevendedor,
        onCreateRevendedor,
        loading: state.loading,
        revendedores: state.revendedores
      }}
    >
      {children}
    </RevendedoresContext.Provider>
  );
};
