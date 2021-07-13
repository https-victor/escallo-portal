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
import { HighlightOff, Visibility, VisibilityOff } from '@material-ui/icons';
import * as yup from 'yup';
import { useFormik } from 'formik';

const emailFormValidation = yup.object({
  email: yup.string().email('Enter a valid email').required('Email is required')
});

const loginFormValidation = yup.object({
  email: yup.string().email('Digite um e-mail válido').required('Digite um e-mail'),
  password: yup.string().min(6, 'A senha deve conter mais de 6 caracteres').required('Digite uma senha')
});

const emailFormInitialValues = {
  email: 'super@escallo.com.br'
};

const loginFormInitialValues = {
  email: '',
  password: ''
};

const Login = (): any => {
  const { auth } = useContext(AuthContext);
  const [password, setPassword] = useState('');
  const { login, loginStep, loginEmail, resetLoginEmail, resetLoginStep, checkEmail, validation } = auth;
  const { errors, clearAuthError, clearAuthErrors } = validation;

  const emailForm = useFormik({
    initialValues: emailFormInitialValues,
    validationSchema: emailFormValidation,
    onSubmit: (values) => {
      checkEmail(values.email);
    }
  });

  const loginForm = useFormik({
    initialValues: loginFormInitialValues,
    validationSchema: loginFormValidation,
    onSubmit: (values) => {
      setPassword(values.password);
      login(values);
    }
  });

  useEffect(() => {
    loginForm.setFieldValue('email', loginEmail);
  }, [loginEmail]);

  useEffect(() => {
    if (errors.length > 0) {
      if (loginForm.values.password != password) {
        clearAuthErrors();
      }
    }
  }, [errors, loginForm.values.password]);
  const [showPassword, setShowPassword] = useState(false);

  function resetFormPassword() {
    loginForm.setFieldValue('password', '');
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
          <form className={classes.form} onSubmit={emailForm.handleSubmit}>
            <TextField
              fullWidth
              variant="outlined"
              margin="normal"
              autoFocus
              name="email"
              label="E-mail"
              InputProps={{
                placeholder: 'Digite seu endereço de e-mail'
              }}
              id="email"
              value={emailForm.values.email}
              onChange={emailForm.handleChange}
              error={emailForm.touched.email && Boolean(emailForm.errors.email)}
              helperText={emailForm.touched.email && emailForm.errors.email}
            />
            <Button fullWidth className={classes.submit} type="submit" variant="contained" color="primary">
              Próximo
            </Button>
          </form>
        )}
        {loginStep == 'password' && (
          <form className={classes.form} onSubmit={loginForm.handleSubmit}>
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

            <TextField
              fullWidth
              variant="filled"
              margin="normal"
              autoFocus
              name="email"
              label="E-mail"
              InputProps={{
                readOnly: true,
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
              id="email"
              value={loginForm.values.email}
              onChange={loginForm.handleChange}
              error={loginForm.touched.email && Boolean(loginForm.errors.email)}
              helperText={loginForm.touched.email && loginForm.errors.email}
            />

            <TextField
              variant="outlined"
              id="password"
              margin="normal"
              fullWidth
              name="password"
              label="Senha"
              type={showPassword ? undefined : 'password'}
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
              value={loginForm.values.password}
              onChange={loginForm.handleChange}
              error={loginForm.touched.password && Boolean(loginForm.errors.password)}
              helperText={loginForm.touched.password && loginForm.errors.password}
            />
            <Button fullWidth className={classes.submit} type="submit" variant="contained" color="primary">
              Entrar
            </Button>
            <Link to="/login">Esqueceu sua senha?</Link>
          </form>
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
