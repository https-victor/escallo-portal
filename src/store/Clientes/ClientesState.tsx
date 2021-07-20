import { createContext, useReducer, useEffect, useContext, useState } from 'react';
import ClientesReducer, { ClientesType } from './ClientesReducer';
import { useMutation } from '@apollo/client';
import useImperativeQuery from '../../hooks/providers/useImperativeQuery';
import { CLIENTE_LIST, CLIENTE_LIST_STATUS } from '../../graphql/queries/clientes';
import { CLIENTE_CREATE, CLIENTE_EDIT } from '../../graphql/mutations/clientes';
import { FormikProps, useFormik } from 'formik';
import * as yup from 'yup';
import { AuthContext } from '../Auth/AuthState';

export enum actions {
  loading = 'LOADING',
  loadSuccess = 'LOAD_SUCCESS',
  loadFailed = 'LOAD_FAILED',
  update = 'UPDATE',
  updateFailed = 'UPDATE_FAILED',
  create = 'CREATE',
  createFailed = 'CREATE_FAILED'
}

export type ClienteType = {
  email: string;
  id: number;
  nome: string;
  status: 'ATIVO' | 'INATIVO';
};

export type EditClienteType = {
  email?: string;
  id: number;
  nome?: string;
  status?: 'ATIVO' | 'INATIVO';
};

export type CreateClienteType = {
  email: string;
  nome: string;
};

type FormikValues = {
  nome: string;
  email: string;
};

type ClienteContextType = {
  clienteForm: FormikProps<FormikValues>;
  onUpdateCliente: (fields: EditClienteType) => void;
  loading: boolean;
  clientes: any[];
};

const initialClientesState: ClientesType = {
  clientes: [],
  loading: true,
  errors: []
};

const initialMockupState: ClienteType[] = [
  {
    email: 'cliente1@teste.com.br',
    id: 1,
    nome: 'Cliente 1',
    status: 'ATIVO'
  },
  {
    email: 'cliente2@teste.com.br',
    id: 2,
    nome: 'Cliente 2',
    status: 'ATIVO'
  },
  {
    email: 'cliente3@teste.com.br',
    id: 3,
    nome: 'Cliente 3',
    status: 'ATIVO'
  }
];

export const ClientesContext = createContext({} as ClienteContextType);

export const ClientesProvider: any = ({ children }: any) => {
  const { mockup } = useContext(AuthContext);

  const [state, dispatch] = useReducer(ClientesReducer, initialClientesState);

  const [updateCliente] = useMutation(CLIENTE_EDIT);
  const [createCliente] = useMutation(CLIENTE_CREATE);
  const queryClientes = useImperativeQuery(CLIENTE_LIST);
  const queryClientesByStatus = useImperativeQuery(CLIENTE_LIST_STATUS);

  async function loadClientes(status = '') {
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
        const clientes = status ? await queryClientesByStatus(status) : await queryClientes();
        dispatch({ type: actions.loadSuccess, payload: clientes?.data?.clientes });
      } catch (err) {
        console.log(err);
        dispatch({
          type: actions.loadFailed,
          payload: {
            id: Date.now(),
            context: 'load_clientes_error',
            severity: 'error',
            title: 'Falha na requisição',
            message: err
          }
        });
      }
    }
  }

  async function onCreateCliente(values: CreateClienteType) {
    dispatch({ type: actions.loading });
    if (mockup) {
      await setTimeout(() => {
        dispatch({
          type: actions.create,
          payload: {
            email: values.email,
            id: Date.now(),
            nome: values.nome,
            status: 'ATIVO'
          }
        });
        clienteForm.resetForm();
      }, 2000);
    } else {
      try {
        const createdCliente = await createCliente({
          variables: { cliente: { ...values, status: 'ATIVO' } }
        });
        dispatch({ type: actions.create, payload: createdCliente.data.criarCliente });
        clienteForm.resetForm();
      } catch (err) {
        dispatch({
          type: actions.createFailed,
          payload: {
            id: Date.now(),
            context: 'cliente_create_error',
            severity: 'error',
            title: 'Falha no cadastro do cliente',
            message: err
          }
        });
        console.log(err);
      }
    }
  }

  async function onUpdateCliente(fields: EditClienteType) {
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
        const updatedCliente = await updateCliente({
          variables: { cliente: fields }
        });
        dispatch({ type: actions.update, payload: updatedCliente.data.atualizarCliente });
      } catch (err) {
        dispatch({
          type: actions.updateFailed,
          payload: {
            id: Date.now(),
            context: 'cliente_update_error',
            severity: 'error',
            title: 'Falha na atualização do cliente',
            message: err
          }
        });
        console.log(err);
      }
    }
  }

  const clienteFormValidation = yup.object({
    nome: yup.string().required('Digite um nome').min(5, 'O nome deve conter mais de 5 caracteres'),
    email: yup.string().email('Digite um e-mail válido').required('Digite um e-mail')
  });
  const clienteFormInitialValues = {
    nome: '',
    email: ''
  };
  const clienteForm = useFormik({
    initialValues: clienteFormInitialValues,
    validationSchema: clienteFormValidation,
    onSubmit: (values: CreateClienteType) => {
      onCreateCliente(values);
    }
  });

  useEffect(() => {
    loadClientes();
  }, []);

  return (
    <ClientesContext.Provider
      value={{
        onUpdateCliente,
        clienteForm,
        loading: state.loading,
        clientes: state.clientes
      }}
    >
      {children}
    </ClientesContext.Provider>
  );
};
