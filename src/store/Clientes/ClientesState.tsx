import React, { createContext, useReducer, useEffect, useContext, useState } from 'react';
import ClientesReducer from './ClientesReducer';
import { GlobalContext } from '../Global/GlobalState';
import { useNavigate } from 'react-router';
import { useMutation, useLazyQuery } from '@apollo/client';
import useImperativeQuery from '../../hooks/providers/useImperativeQuery';
import {
  LOADING_LIST,
  LIST_FAIL,
  SUCCESS_LIST,
  UPDATE_CLIENTE,
  UPDATE_FAIL,
  CREATE_CLIENTE,
  CREATE_FAIL
} from './actions';
import { CLIENTE_LIST, CLIENTE_LIST_STATUS } from '../../graphql/queries/clientes';
import { CLIENTE_CREATE, CLIENTE_EDIT } from '../../graphql/mutations/clientes';
import { useFormik } from 'formik';
import * as yup from 'yup';

const initialClientesState = {
  lista: [],
  loading: true
};

export const ClientesContext = createContext<any>(initialClientesState);

export const ClientesProvider: any = ({ children }: any) => {
  const { validation, token, onSetToken } = useContext(GlobalContext);
  const { globalErrors, setGlobalError, clearGlobalError, setGlobalErrors, clearGlobalErrors } = validation;

  const [state, dispatch] = useReducer(ClientesReducer, initialClientesState);

  const [updateCliente, { loading: updateClienteLoading, data: updateClienteData }] = useMutation(CLIENTE_EDIT);
  const [createCliente, { loading: createClienteLoading, data: createClienteData }] = useMutation(CLIENTE_CREATE);
  const queryClientes = useImperativeQuery(CLIENTE_LIST);
  const queryClientesByStatus = useImperativeQuery(CLIENTE_LIST_STATUS);
  const navigate = useNavigate();

  const [rows, setRows] = useState(
    state.lista.reduce((total: any, { id, nome, email, status }: any) => {
      return [...total, { id, nome, email, status }];
    }, [])
  );

  useEffect(() => {
    setRows(
      state.lista.reduce((total: any, { id, nome, email, status }: any) => {
        return [...total, { id, nome, email, status }];
      }, [])
    );
  }, [state.lista]);

  async function loadClientes(status = '') {
    dispatch({ type: LOADING_LIST });

    try {
      const lista = status ? await queryClientesByStatus(status) : await queryClientes();
      if (lista.data && lista.data.clientes) {
        dispatch({ type: SUCCESS_LIST, payload: lista.data.clientes });
      }
    } catch (err) {
      console.log(err);
      dispatch({
        type: LIST_FAIL,
        payload: {
          id: 'load_clientes_error',
          severity: 'error',
          title: 'Falha na requisição',
          error: err
        }
      });
    }
  }

  async function onCreateCliente(values: any) {
    dispatch({ type: LOADING_LIST });
    try {
      const createdCliente = await createCliente({
        variables: { cliente: { ...values, status: 'ATIVO' } }
      });
      dispatch({ type: CREATE_CLIENTE, payload: createdCliente.data.criarCliente });
    } catch (err) {
      dispatch({ type: CREATE_FAIL });
      console.log(err);
    }
  }

  async function onUpdateCliente(id: any, field: any) {
    dispatch({ type: LOADING_LIST });
    try {
      const updatedCliente = await updateCliente({
        variables: { cliente: { id: parseFloat(id), ...field } }
      });
      dispatch({ type: UPDATE_CLIENTE, payload: updatedCliente.data.atualizarCliente });
    } catch (err) {
      dispatch({ type: UPDATE_FAIL });
      console.log(err);
    }
  }

  useEffect(() => {
    loadClientes();
  }, []);

  return (
    <ClientesContext.Provider
      value={{
        onUpdateCliente,
        onCreateCliente,
        loading: state.loading,
        rows,
        lista: state.lista
      }}
    >
      {children}
    </ClientesContext.Provider>
  );
};
