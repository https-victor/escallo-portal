import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../store/Auth/AuthState';
import { Link } from 'react-router-dom';
import { Controller, FormProvider, useForm, useFormContext } from 'react-hook-form';
import FormInput from '../../components/forms/FormInput';

const LoginForm = ({ onSubmit, resetFormPassword }: any): any => {
  const { handleSubmit } = useFormContext();
  const { loginStep, checkEmail, resetLoginEmail } = useContext(AuthContext);
  const { getValues } = useFormContext();
  const classes = useStyles();

  // const [form] = Form.useForm();

  const onCheckEmail = () => {
    checkEmail(getValues('email'));
  };

  return (
    <form>
      <FormInput InputProps={{ readOnly: loginStep != 'email' }} name="email" label="E-mail" />
      {loginStep === 'password' && <FormInput name="password" label="Senha" type="password" />}
      <Link to="/">
        <Button variant="contained" onClick={resetLoginEmail}>
          Cancelar
        </Button>
      </Link>

      {loginStep === 'password' ? (
        <>
          <Button variant="contained" onClick={resetFormPassword}>
            Voltar
          </Button>
          <Button onClick={handleSubmit(onSubmit)} variant="contained" color="primary">
            Entrar
          </Button>
        </>
      ) : (
        <Button onClick={onCheckEmail} variant="contained" color="primary">
          Próximo
        </Button>
      )}
    </form>
  );
};

const Login = (): any => {
  const methods = useForm();
  const { login, resetLoginStep, authenticated } = useContext(AuthContext);
  console.log(authenticated);
  function onSubmit(data: any) {
    login(data);
  }

  function resetFormPassword() {
    methods.setValue('password', '');
    resetLoginStep();
  }

  useEffect(() => {
    resetLoginStep();
  }, []);

  const classes = useStyles();
  return (
    <Container className={classes.container} maxWidth="xs">
      <FormProvider {...methods}>
        <LoginForm onSubmit={onSubmit} resetFormPassword={resetFormPassword} />
      </FormProvider>
    </Container>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '25ch'
    }
  },
  hidden: {
    display: 'none'
  }
}));

export default Login;
