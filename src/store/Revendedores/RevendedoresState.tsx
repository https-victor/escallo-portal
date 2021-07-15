import { createContext, useReducer, useEffect, useContext, useState } from 'react';
import RevendedoresReducer, { RevendedoresType } from './RevendedoresReducer';
import { useMutation } from '@apollo/client';
import useImperativeQuery from '../../hooks/providers/useImperativeQuery';
import { REVENDEDOR_LIST, REVENDEDOR_LIST_STATUS } from '../../graphql/queries/revendedores';
import { REVENDEDOR_CREATE, REVENDEDOR_EDIT } from '../../graphql/mutations/revendedores';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { AuthContext } from '../Auth/AuthState';
import { RevendedorType } from '../../utils/types';

export enum actions {
  loading = 'LOADING',
  loadSuccess = 'SUCCESS',
  loadFailed = 'FAILED',
  update = 'UPDATE',
  updateFailed = 'UPDATE_FAILED',
  create = 'CREATE',
  createFailed = 'CREATE_FAILED'
}

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

export const RevendedoresContext = createContext<any>(initialRevendedoresState);

export const RevendedoresProvider: any = ({ children }: any) => {
  const { mockup } = useContext(AuthContext);

  const [state, dispatch] = useReducer(RevendedoresReducer, initialRevendedoresState);

  const [updateRevendedor] = useMutation(REVENDEDOR_EDIT);
  const [createRevendedor] = useMutation(REVENDEDOR_CREATE);
  const queryRevendedores = useImperativeQuery(REVENDEDOR_LIST);
  const queryRevendedoresByStatus = useImperativeQuery(REVENDEDOR_LIST_STATUS);

  const [rows, setRows] = useState(
    state.revendedores.reduce((total: any, { id, nome, email, label, status }: any) => {
      return [...total, { id, nome, email, label, status }];
    }, [])
  );

  useEffect(() => {
    setRows(
      state.revendedores.reduce((total: any, { id, nome, email, label, status }: any) => {
        return [...total, { id, nome, email, label, status }];
      }, [])
    );
  }, [state.revendedores]);

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

  async function onCreateRevendedor(values: any) {
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
        revendedorForm.resetForm();
      }, 1500);
    } else {
      try {
        const createdRevendedor = await createRevendedor({
          variables: { revendedor: { ...values, status: 'ATIVO' } }
        });
        dispatch({ type: actions.create, payload: createdRevendedor.data.criarRevendedor });
        revendedorForm.resetForm();
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

  async function onUpdateRevendedor(id: any, fields: any) {
    dispatch({ type: actions.loading });
    if (mockup) {
      await setTimeout(() => {
        dispatch({
          type: actions.update,
          payload: {
            id,
            ...fields
          }
        });
      }, 800);
    } else {
      try {
        const updatedRevendedor = await updateRevendedor({
          variables: { revendedor: { id: parseFloat(id), ...fields } }
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

  const revendedorFormValidation = yup.object({
    nome: yup.string().required('Digite um nome').min(5, 'O nome deve conter mais de 5 caracteres'),
    email: yup.string().email('Digite um e-mail válido').required('Digite um e-mail'),
    label: yup.string().required('Digite um label')
  });
  const revendedorFormInitialValues = {
    nome: '',
    email: '',
    label: ''
  };
  const revendedorForm = useFormik({
    initialValues: revendedorFormInitialValues,
    validationSchema: revendedorFormValidation,
    onSubmit: (values) => {
      onCreateRevendedor(values);
    }
  });

  useEffect(() => {
    loadRevendedores();
  }, []);

  return (
    <RevendedoresContext.Provider
      value={{
        revendedorForm,
        onUpdateRevendedor,
        onCreateRevendedor,
        loading: state.loading,
        rows,
        revendedores: state.revendedores
      }}
    >
      {children}
    </RevendedoresContext.Provider>
  );
};
