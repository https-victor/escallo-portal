import { Button, Container, makeStyles, TextField } from '@material-ui/core';
import { useContext } from 'react';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { Link } from 'react-router-dom';
import FormInput from '../../components/forms/FormInput';
import { AuthContext } from '../../store/Auth/AuthState';

const SignUpForm = ({ onSubmit }: any): any => {
  const { handleSubmit } = useFormContext();
  const { resetLoginEmail } = useContext(AuthContext);

  return (
    <form>
      <FormInput name="email" label="E-mail" type="email" />
      <FormInput name="password" label="Senha" type="password" />
      <Link to="/">
        <Button variant="contained" onClick={resetLoginEmail}>
          Cancelar
        </Button>
      </Link>
      <Button onClick={handleSubmit(onSubmit)} variant="contained" color="primary">
        Cadastrar
      </Button>
    </form>
  );
};

const SignUp = (): any => {
  const { loginEmail, signUp, authenticated } = useContext(AuthContext);
  console.log(authenticated);
  const classes = useStyles();
  const methods = useForm({ defaultValues: { email: loginEmail } });

  function onSubmit(data: any) {
    signUp(data);
  }

  return (
    <Container className={classes.container} maxWidth="xs">
      <FormProvider {...methods}>
        <SignUpForm onSubmit={onSubmit} />
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
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '25ch'
    }
  }
}));

export default SignUp;
