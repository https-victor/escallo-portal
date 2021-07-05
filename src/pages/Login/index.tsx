import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { IconButton, InputAdornment, makeStyles } from '@material-ui/core';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../store/Auth/AuthState';
import { Link } from 'react-router-dom';
import { Controller, FormProvider, useForm, useFormContext } from 'react-hook-form';
import FormInput from '../../components/forms/FormInput';
import { AccountCircle, HighlightOff, Lock, Visibility, VisibilityOff } from '@material-ui/icons';

const Login = (): any => {
  const emailForm = useForm({ defaultValues: { email: 'joao.oliveira@futurotec.com.br' } });
  const loginForm = useForm();
  const { login, loginStep, resetLoginEmail, resetLoginStep, checkEmail } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);

  function onSubmit(data: any) {
    console.log(data);
    checkEmail(data.email);
    loginForm.setValue('email', data.email);
  }

  function resetFormPassword() {
    loginForm.setValue('password', '');
    resetLoginStep();
  }

  function handleMouseDown(event: any) {
    event.preventDefault();
  }

  function handleClickShowPassword() {
    setShowPassword((prevState) => {
      return !prevState;
    });
  }

  useEffect(() => {
    resetLoginStep();
  }, []);

  const classes = useStyles();
  return (
    <Container className={classes.container} maxWidth="xs">
      {loginStep == 'email' && (
        <FormProvider {...emailForm}>
          <form onSubmit={emailForm.handleSubmit(onSubmit)}>
            <FormInput
              control={emailForm.control}
              rules={{ required: 'Digite um e-mail' }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircle color="primary" />
                  </InputAdornment>
                )
              }}
              name="email"
              label="E-mail"
            />

            <Link to="/">
              <Button variant="contained" onClick={resetLoginEmail}>
                Cancelar
              </Button>
            </Link>
            <Button type="submit" variant="contained" color="primary">
              Próximo
            </Button>
          </form>
        </FormProvider>
      )}
      {loginStep == 'password' && (
        <FormProvider {...loginForm}>
          <form onSubmit={loginForm.handleSubmit(onSubmit)}>
            <FormInput
              control={loginForm.control}
              rules={{ required: 'Digite um e-mail' }}
              InputProps={{
                readOnly: loginStep != 'email',
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircle color="primary" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={resetFormPassword}
                      onMouseDown={handleMouseDown}
                    >
                      <HighlightOff color="primary" />
                    </IconButton>
                  </InputAdornment>
                )
              }}
              variant="filled"
              name="email"
              label="E-mail"
            />
            <FormInput
              control={loginForm.control}
              rules={{ required: 'Digite uma senha' }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="primary" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDown}
                    >
                      {showPassword ? <Visibility color="primary" /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              name="password"
              label="Senha"
              type={showPassword ? undefined : 'password'}
            />

            <Link to="/">
              <Button variant="contained" onClick={resetLoginEmail}>
                Cancelar
              </Button>
            </Link>
            <Button type="submit" variant="contained" color="primary">
              Entrar
            </Button>
          </form>
        </FormProvider>
      )}
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
