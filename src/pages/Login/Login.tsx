import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { IconButton, InputAdornment, makeStyles, Typography } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../store/Auth/AuthState';
import { Link } from 'react-router-dom';
import { Controller, FormProvider, useForm, useFormContext, useWatch } from 'react-hook-form';
import FormInput from '../../components/forms/FormInput';
import { AccountCircle, HighlightOff, Lock, Visibility, VisibilityOff } from '@material-ui/icons';
import patterns from '../../utils/patterns';

const Login = (): any => {
  const emailForm = useForm({ defaultValues: { email: 'super@escallo.com.br' } });
  const loginForm = useForm();
  const [password, setPassword] = useState('');
  const watchPassword = useWatch({ control: loginForm.control, name: 'password' });
  const { auth } = useContext(AuthContext);
  const { login, loginStep, resetLoginEmail, resetLoginStep, checkEmail, validation } = auth;
  const { errors, clearAuthError, clearAuthErrors } = validation;
  useEffect(() => {
    if (errors.length > 0) {
      if (watchPassword != password) {
        clearAuthErrors();
      }
    }
  }, [errors, watchPassword]);
  const [showPassword, setShowPassword] = useState(false);

  function onCheckEmail(data: any) {
    loginForm.setValue('email', data.email);
    checkEmail(data.email);
  }

  function onSubmit(data: any) {
    setPassword(data.password);
    login(data);
  }

  function resetFormPassword() {
    loginForm.setValue('password', '');
    clearAuthErrors();
    resetLoginStep();
  }

  function handleMouseDown(event: any) {
    event.preventDefault();
  }

  function handleClickShowPassword() {
    setShowPassword((prevState: any) => {
      return !prevState;
    });
  }

  useEffect(() => {
    resetLoginStep();
  }, []);

  const classes = useStyles();
  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        {loginStep == 'email' && (
          <FormProvider {...emailForm}>
            <form className={classes.form} onSubmit={emailForm.handleSubmit(onCheckEmail)}>
              <FormInput
                control={emailForm.control}
                rules={{
                  required: 'Digite um e-mail',
                  pattern: { value: patterns.email, message: 'Digite um e-mail válido' }
                }}
                InputProps={{
                  placeholder: 'Digite seu endereço de e-mail'
                  // startAdornment: (
                  //   <InputAdornment position="start">
                  //     <AccountCircle color="primary" />
                  //   </InputAdornment>
                  // )
                }}
                variant="outlined"
                id="email"
                margin="normal"
                fullWidth
                autoFocus
                name="email"
                label="E-mail"
              />
              <Button fullWidth className={classes.submit} type="submit" variant="contained" color="primary">
                Próximo
              </Button>
            </form>
          </FormProvider>
        )}
        {loginStep == 'password' && (
          <FormProvider {...loginForm}>
            <form className={classes.form} onSubmit={loginForm.handleSubmit(onSubmit)}>
              {errors.map(({ id, severity, title, error }: any) => {
                const onCloseError = () => {
                  clearAuthErrors(id);
                };
                return (
                  <Alert onClose={onCloseError} key={id} severity={severity}>
                    <AlertTitle>{title}</AlertTitle>
                    {error.message}
                  </Alert>
                );
              })}

              <FormInput
                control={loginForm.control}
                rules={{ required: 'Digite um e-mail' }}
                InputProps={{
                  readOnly: loginStep != 'email',
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
                id="email"
                margin="normal"
                fullWidth
                name="email"
                label="E-mail"
              />
              <FormInput
                control={loginForm.control}
                rules={{
                  required: 'Digite uma senha',
                  minLength: {
                    value: 6,
                    message: 'A senha deve conter mais de 6 caracteres'
                  }
                }}
                InputProps={{
                  placeholder: 'Digite sua senha',
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
                variant="outlined"
                id="password"
                margin="normal"
                fullWidth
                autoComplete="password"
                name="password"
                label="Senha"
                type={showPassword ? undefined : 'password'}
              />
              <Button fullWidth className={classes.submit} type="submit" variant="contained" color="primary">
                Entrar
              </Button>
              <Link to="/login">Esqueceu sua senha?</Link>
            </form>
          </FormProvider>
        )}
      </div>
    </Container>
  );
};

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

export default Login;
