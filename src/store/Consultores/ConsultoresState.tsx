import { createContext, useReducer, useEffect, useContext, useState } from 'react';
import ConsultoresReducer, { ConsultoresType } from './ConsultoresReducer';
import { useMutation } from '@apollo/client';
import useImperativeQuery from '../../hooks/providers/useImperativeQuery';
// import { CONSULTOR_LIST, CONSULTOR_LIST_STATUS } from '../../graphql/queries/consultores';
// import { CONSULTOR_CREATE, CONSULTOR_EDIT } from '../../graphql/mutations/consultores';
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

//Alteracao nos status

export type ConsultorType = {
  email: string;
  id: number;
  nome: string;
  permissao?: Array<string>;
};

export type EditConsultorType = {
  email?: string;
  id: number;
  nome?: string;
  permissao?: Array<string>;
};

export type CreateConsultorType = {
  email: string;
  nome: string;
};

type FormikValues = {
  nome: string;
  email: string;
};

type ConsultorContextType = {
  consultorForm: FormikProps<FormikValues>;
  onUpdateConsultor: (fields: EditConsultorType) => void;
  loading: boolean;
  consultores: any[];
};

const initialConsultorState: ConsultoresType = {
  consultores: [],
  loading: true,
  errors: []
};

const initialMockupState: ConsultorType[] = [
  {
    email: 'consultor1@teste.com.br',
    id: 1,
    nome: 'Consultor 1',
    permissao: ['gestor', 'diretor']
  },
  {
    email: 'consultor2@teste.com.br',
    id: 2,
    nome: 'Consultor 2',
    permissao: ['gestor']
  },
  {
    email: 'consultor3@teste.com.br',
    id: 3,
    nome: 'Consultor 3',
    permissao: ['diretor']
  },
  {
    email: 'consultor5@teste.com.br',
    id: 5,
    nome: 'Consultor 5',
    permissao: ['gestor', 'diretor']
  }
];

export const ConsultoresContext = createContext({} as ConsultorContextType);

export const ConsultorProvider: any = ({ children }: any) => {
  const { mockup } = useContext(AuthContext);

  const [state, dispatch] = useReducer(ConsultoresReducer, initialConsultorState);

  // const [updateConsultor] = useMutation(CONSULTOR_EDIT);
  // const [createConsultor] = useMutation(CONSULTOR_CREATE);
  // const queryConsultor = useImperativeQuery(CONSULTOR_LIST);
  // const queryConsultorByStatus = useImperativeQuery(CONSULTOR_LIST_STATUS);

  async function loadConsultor(status = '') {
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
    //     const consultores = status ? await queryConsultorByStatus(status) : await queryConsultor();
    //     dispatch({ type: actions.loadSuccess, payload: consultores?.data?.consultores });
    //   } catch (err) {
    //     console.log(err);
    //     dispatch({
    //       type: actions.loadFailed,
    //       payload: {
    //         id: Date.now(),
    //         context: 'load_consultores_error',
    //         severity: 'error',
    //         title: 'Falha na requisição',
    //         message: err
    //       }
    //     });
    //   }
    // }
  }

  async function onCreateConsultor(values: CreateConsultorType) {
    dispatch({ type: actions.loading });
    if (mockup) {
      await setTimeout(() => {
        dispatch({
          type: actions.create,
          payload: {
            email: values.email,
            id: Date.now(),
            nome: values.nome,
            permissao: []
          }
        });
        consultorForm.resetForm();
      }, 2000);
    }
    // else {
    //   // try {
    //   //   const createdConsultor = await createConsultor({
    //   //     variables: { consultor: { ...values, status: 'ATIVO' } }
    //   //   });
    //   //   dispatch({ type: actions.create, payload: createdConsultor.data.criarConsultor });
    //   //   consultorForm.resetForm();
    //   // } catch (err) {
    //   //   dispatch({
    //   //     type: actions.createFailed,
    //   //     payload: {
    //   //       id: Date.now(),
    //   //       context: 'consultor_create_error',
    //   //       severity: 'error',
    //   //       title: 'Falha no cadastro do consultor',
    //   //       message: err
    //   //     }
    //   //   });
    //   //   console.log(err);
    //   // }
    // }
  }

  async function onUpdateConsultor(fields: EditConsultorType) {
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
    //   //   const updatedConsultor = await updateConsultor({
    //   //     variables: { consultor: fields }
    //   //   });
    //   //   dispatch({ type: actions.update, payload: updatedConsultor.data.atualizarConsultor });
    //   // } catch (err) {
    //   //   dispatch({
    //   //     type: actions.updateFailed,
    //   //     payload: {
    //   //       id: Date.now(),
    //   //       context: 'consultor_update_error',
    //   //       severity: 'error',
    //   //       title: 'Falha na atualização do consultor',
    //   //       message: err
    //   //     }
    //   //   });
    //   //   console.log(err);
    //   // }
    // }
  }

  const consultorFormValidation = yup.object({
    nome: yup.string().required('Digite um nome').min(5, 'O nome deve conter mais de 5 caracteres'),
    email: yup.string().email('Digite um e-mail válido').required('Digite um e-mail')
  });
  const consultorFormInitialValues = {
    nome: '',
    email: ''
  };
  const consultorForm = useFormik({
    initialValues: consultorFormInitialValues,
    validationSchema: consultorFormValidation,
    onSubmit: (values: CreateConsultorType) => {
      onCreateConsultor(values);
    }
  });

  useEffect(() => {
    loadConsultor();
  }, []);

  return (
    <ConsultoresContext.Provider
      value={{
        onUpdateConsultor,
        consultorForm,
        loading: state.loading,
        consultores: state.consultores
      }}
    >
      {children}
    </ConsultoresContext.Provider>
  );
};
