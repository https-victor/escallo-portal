import React, { createContext, useReducer, useEffect, useContext, useState } from 'react';
import RevendedoresReducer from './RevendedoresReducer';
import { GlobalContext } from '../Global/GlobalState';
import { useNavigate } from 'react-router';
import { useMutation, useLazyQuery } from '@apollo/client';
import useImperativeQuery from '../../hooks/providers/useImperativeQuery';
import {
  LOADING_LIST,
  LIST_FAIL,
  SUCCESS_LIST,
  UPDATE_REVENDEDOR,
  UPDATE_FAIL,
  CREATE_REVENDEDOR,
  CREATE_FAIL
} from './actions';
import { REVENDEDOR_LIST, REVENDEDOR_LIST_STATUS } from '../../graphql/queries/revendedores';
import { REVENDEDOR_CREATE, REVENDEDOR_EDIT } from '../../graphql/mutations/revendedores';
import { useFormik } from 'formik';
import * as yup from 'yup';

const initialRevendedoresState = {
  lista: [],
  loading: true
};

export const RevendedoresContext = createContext<any>(initialRevendedoresState);

export const RevendedoresProvider: any = ({ children }: any) => {
  const { validation, token, onSetToken } = useContext(GlobalContext);
  const { globalErrors, setGlobalError, clearGlobalError, setGlobalErrors, clearGlobalErrors } = validation;

  const [state, dispatch] = useReducer(RevendedoresReducer, initialRevendedoresState);

  const [updateRevendedor, { loading: updateRevendedorLoading, data: updateRevendedorData }] =
    useMutation(REVENDEDOR_EDIT);
  const [createRevendedor, { loading: createRevendedorLoading, data: createRevendedorData }] =
    useMutation(REVENDEDOR_CREATE);
  const queryRevendedores = useImperativeQuery(REVENDEDOR_LIST);
  const queryRevendedoresByStatus = useImperativeQuery(REVENDEDOR_LIST_STATUS);
  const navigate = useNavigate();

  const [rows, setRows] = useState(
    state.lista.reduce((total: any, { id, nome, email, label, status }: any) => {
      return [...total, { id, nome, email, label, status }];
    }, [])
  );

  useEffect(() => {
    setRows(
      state.lista.reduce((total: any, { id, nome, email, label, status }: any) => {
        return [...total, { id, nome, email, label, status }];
      }, [])
    );
  }, [state.lista]);

  async function loadRevendedores(status = '') {
    dispatch({ type: LOADING_LIST });

    try {
      const lista = status ? await queryRevendedoresByStatus(status) : await queryRevendedores();
      if (lista.data && lista.data.revendedores) {
        dispatch({ type: SUCCESS_LIST, payload: lista.data.revendedores });
      }
    } catch (err) {
      console.log(err);
      dispatch({
        type: LIST_FAIL,
        payload: {
          id: 'load_revendedores_error',
          severity: 'error',
          title: 'Falha na requisição',
          error: err
        }
      });
    }
  }

  async function onCreateRevendedor(values: any) {
    dispatch({ type: LOADING_LIST });
    try {
      const createdRevendedor = await createRevendedor({
        variables: { revendedor: { ...values, status: 'ATIVO' } }
      });
      dispatch({ type: CREATE_REVENDEDOR, payload: createdRevendedor.data.criarRevendedor });
    } catch (err) {
      dispatch({ type: CREATE_FAIL });
      console.log(err);
    }
  }

  async function onUpdateRevendedor(id: any, field: any) {
    dispatch({ type: LOADING_LIST });
    try {
      const updatedRevendedor = await updateRevendedor({
        variables: { revendedor: { id: parseFloat(id), ...field } }
      });
      dispatch({ type: UPDATE_REVENDEDOR, payload: updatedRevendedor.data.atualizarRevendedor });
    } catch (err) {
      dispatch({ type: UPDATE_FAIL });
      console.log(err);
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
        rows,
        lista: state.lista
      }}
    >
      {children}
    </RevendedoresContext.Provider>
  );
};
