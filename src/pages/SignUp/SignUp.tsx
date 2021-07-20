import { Button, Container, IconButton, InputAdornment, makeStyles, TextField, Typography } from '@material-ui/core';
import { HighlightOff, Visibility, VisibilityOff } from '@material-ui/icons';
import { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../store/Auth/AuthState';
import useLocalStorageState from '../../utils/useLocalStorageState';
import * as yup from 'yup';
import { useFormik } from 'formik';

const signUpFormValidation = yup.object({
  email: yup.string().email('Digite um e-mail válido').required('Digite um e-mail'),
  telefone: yup.string().required('Digite um telefone'),
  nome: yup.string().required('Digite um nome').min(5, 'O nome deve conter mais de 5 caracteres'),
  password: yup.string().min(6, 'A senha deve conter mais de 6 caracteres').required('Digite uma senha'),
  confirmPassword: yup
    .mixed()
    .oneOf([yup.ref('password'), null], 'A confirmação de senha deve ser igual à senha')
    .required()
});

const SignUp = (): any => {
  const { auth } = useContext(AuthContext);
  const { loginEmail, onSignUp, resetLoginStep } = auth;

  const signUpFormInitialValues = {
    email: loginEmail,
    telefone: '31998460353',
    nome: 'Mockup',
    password: '753951',
    confirmPassword: '753951'
  };

  const classes = useStyles();

  const signUpForm = useFormik({
    initialValues: signUpFormInitialValues,
    validationSchema: signUpFormValidation,
    onSubmit: (values) => {
      const { nome, email, telefone, password } = values;

      onSignUp({ nome, email, telefone, senha: password, status: 'ATIVO' });
    }
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showForm, setShowForm, refresh] = useLocalStorageState('showRegisterForm', false);

  useEffect(() => {
    if (loginEmail) {
      signUpForm.setFieldValue('email', loginEmail);
    }
  }, [loginEmail]);

  function handleMouseDown(event: any) {
    event.preventDefault();
  }

  function handleClickShowPassword() {
    setShowPassword((prevState: any) => {
      return !prevState;
    });
  }

  return loginEmail ? (
    showForm ? (
      <Container component="main" maxWidth="xs">
        <div className={classes.paper}>
          <Typography component="h1" variant="h5">
            Seja Bem vindo!
          </Typography>
          <form className={classes.form} onSubmit={signUpForm.handleSubmit}>
            <TextField
              fullWidth
              variant="filled"
              margin="normal"
              name="email"
              label="E-mail"
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => resetLoginStep('cadastro')}
                      onMouseDown={handleMouseDown}
                    >
                      <HighlightOff color="primary" />
                    </IconButton>
                  </InputAdornment>
                )
              }}
              id="email"
              value={signUpForm.values.email}
              onChange={signUpForm.handleChange}
              error={signUpForm.touched.email && Boolean(signUpForm.errors.email)}
              helperText={signUpForm.touched.email && signUpForm.errors.email}
            />

            <TextField
              fullWidth
              variant="outlined"
              margin="normal"
              name="nome"
              autoComplete="nome"
              autoFocus
              label="Nome"
              id="nome"
              InputProps={{
                placeholder: 'Digite seu nome'
              }}
              value={signUpForm.values.nome}
              onChange={signUpForm.handleChange}
              error={signUpForm.touched.nome && Boolean(signUpForm.errors.nome)}
              helperText={signUpForm.touched.nome && signUpForm.errors.nome}
            />

            <TextField
              fullWidth
              variant="outlined"
              margin="normal"
              name="telefone"
              autoComplete="telefone"
              autoFocus
              label="Telefone"
              id="telefone"
              InputProps={{
                placeholder: 'Digite seu telefone'
              }}
              value={signUpForm.values.telefone}
              onChange={signUpForm.handleChange}
              error={signUpForm.touched.telefone && Boolean(signUpForm.errors.telefone)}
              helperText={signUpForm.touched.telefone && signUpForm.errors.telefone}
            />

            <TextField
              fullWidth
              variant="outlined"
              margin="normal"
              name="password"
              autoComplete="password"
              autoFocus
              label="Senha"
              id="password"
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
              value={signUpForm.values.password}
              onChange={signUpForm.handleChange}
              error={signUpForm.touched.password && Boolean(signUpForm.errors.password)}
              helperText={signUpForm.touched.password && signUpForm.errors.password}
              type={showPassword ? undefined : 'password'}
            />

            <TextField
              fullWidth
              variant="outlined"
              margin="normal"
              name="confirmPassword"
              autoComplete="confirmPassword"
              autoFocus
              label="Confirmar Senha"
              id="confirmPassword"
              type={showPassword ? undefined : 'password'}
              InputProps={{
                placeholder: 'Confirme sua senha',
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
              value={signUpForm.values.confirmPassword}
              onChange={signUpForm.handleChange}
              error={signUpForm.touched.confirmPassword && Boolean(signUpForm.errors.confirmPassword)}
              helperText={signUpForm.touched.confirmPassword && signUpForm.errors.confirmPassword}
            />

            <Button type="submit" fullWidth className={classes.submit} variant="contained" color="primary">
              Cadastrar
            </Button>
          </form>
        </div>
      </Container>
    ) : (
      <Container component="main" maxWidth="xs">
        <div className={classes.paper}>
          <Typography component="h1" variant="h5">
            Seja Bem vindo!
          </Typography>
          <TextField
            fullWidth
            variant="filled"
            margin="normal"
            name="email"
            label="E-mail"
            InputProps={{
              readOnly: true,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => resetLoginStep('cadastro')}
                    onMouseDown={handleMouseDown}
                  >
                    <HighlightOff color="primary" />
                  </IconButton>
                </InputAdornment>
              )
            }}
            id="email"
            value={signUpForm.values.email}
            onChange={signUpForm.handleChange}
            error={signUpForm.touched.email && Boolean(signUpForm.errors.email)}
            helperText={signUpForm.touched.email && signUpForm.errors.email}
          />
          <Typography component="h6" variant="subtitle1">
            Esse é seu primeiro acesso com este e-mail, deseja registrar-se?
          </Typography>
          <Button
            fullWidth
            className={classes.submit}
            color="primary"
            variant="contained"
            onClick={() => setShowForm(true)}
          >
            Quero me registrar
          </Button>
        </div>
      </Container>
    )
  ) : (
    <Navigate to="/login" />
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

export default SignUp;
