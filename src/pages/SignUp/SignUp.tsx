import { Button, Container, IconButton, InputAdornment, makeStyles, TextField, Typography } from '@material-ui/core';
import { AccountCircle, HighlightOff, Lock, Visibility, VisibilityOff } from '@material-ui/icons';
import { useContext, useEffect, useState } from 'react';
import { Controller, FormProvider, useForm, useFormContext } from 'react-hook-form';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import FormInput from '../../components/forms/FormInput';
import { AuthContext } from '../../store/Auth/AuthState';
import patterns from '../../utils/patterns';
import useLocalStorageState from '../../utils/useLocalStorageState';
import InputMask from 'react-input-mask';
import { validateConfirmPassword } from '../../utils/validators';

const SignUp = (): any => {
  const { loginEmail, signUp, authenticated, resetLoginEmail, resetLoginStep } = useContext(AuthContext);
  const classes = useStyles();
  const signUpForm = useForm({
    defaultValues: { email: loginEmail, telefone: '', nome: '', password: '', confirmPassword: '' }
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showForm, setShowForm] = useLocalStorageState('showRegisterForm', false);

  useEffect(() => {
    if (loginEmail) {
      signUpForm.setValue('email', loginEmail);
    }
  }, [loginEmail]);

  function onSubmit(data: any) {
    console.log(data);
    signUp(data);
  }

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
          <FormProvider {...signUpForm}>
            <form className={classes.form} onSubmit={signUpForm.handleSubmit(onSubmit)}>
              <FormInput
                control={signUpForm.control}
                rules={{
                  required: 'Digite um e-mail',
                  pattern: { value: patterns.email, message: 'Digite um e-mail válido' }
                }}
                InputProps={{
                  placeholder: 'Digite seu endereço de e-mail',
                  readOnly: true,
                  // startAdornment: (
                  //   <InputAdornment position="start">
                  //     <AccountCircle color="primary" />
                  //   </InputAdornment>
                  // ),
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
                variant="filled"
                id="email"
                margin="normal"
                fullWidth
                name="email"
                label="E-mail"
              />
              <FormInput
                control={signUpForm.control}
                rules={{
                  required: 'Digite seu nome'
                }}
                InputProps={{
                  placeholder: 'Digite seu nome'
                }}
                variant="outlined"
                id="nome"
                margin="normal"
                fullWidth
                autoComplete="nome"
                autoFocus
                name="nome"
                label="Nome"
                type={showPassword ? undefined : 'nome'}
              />
              <FormInput
                control={signUpForm.control}
                rules={{
                  required: 'Digite seu telefone'
                  // validate: (value: any) => {
                  //   console.log(value.replace(/\D/g, ''));
                  //   return value;
                  // }
                  // pattern: { value: patterns.telefone, message: 'Digite um telefone válido' }
                }}
                // InputProps={{
                //   placeholder: 'Digite seu telefone'
                // }}
                // maskType="telefone"
                alwaysShowMask
                variant="outlined"
                id="telefone"
                margin="normal"
                fullWidth
                autoComplete="telefone"
                name="telefone"
                label="Telefone"
                type={showPassword ? undefined : 'telefone'}
              />

              <FormInput
                control={signUpForm.control}
                rules={{
                  required: 'Digite uma senha',
                  minLength: {
                    value: 6,
                    message: 'A senha deve conter mais de 6 caracteres'
                  }
                }}
                InputProps={{
                  placeholder: 'Digite sua senha',
                  // startAdornment: (
                  //   <InputAdornment position="start">
                  //     <Lock color="primary" />
                  //   </InputAdornment>
                  // ),
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
                name="password"
                label="Senha"
                type={showPassword ? undefined : 'password'}
              />
              <FormInput
                control={signUpForm.control}
                rules={{
                  required: 'Confirme sua senha',
                  minLength: {
                    value: 6,
                    message: 'A senha deve conter mais de 6 caracteres'
                  },
                  validate: validateConfirmPassword(signUpForm.getValues('password'))
                }}
                InputProps={{
                  placeholder: 'Confirme sua senha',
                  // startAdornment: (
                  //   <InputAdornment position="start">
                  //     <Lock color="primary" />
                  //   </InputAdornment>
                  // ),
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
                id="confirmPassword"
                margin="normal"
                fullWidth
                name="confirmPassword"
                label="Confirmar senha"
                type={showPassword ? undefined : 'password'}
              />
              <Button type="submit" fullWidth className={classes.submit} variant="contained" color="primary">
                Cadastrar
              </Button>
            </form>
          </FormProvider>
        </div>
      </Container>
    ) : (
      <Container component="main" maxWidth="xs">
        <div className={classes.paper}>
          <Typography component="h1" variant="h5">
            Seja Bem vindo!
          </Typography>
          <FormInput
            control={signUpForm.control}
            rules={{
              required: 'Digite um e-mail',
              pattern: { value: patterns.email, message: 'Digite um e-mail válido' }
            }}
            InputProps={{
              placeholder: 'Digite seu endereço de e-mail',
              readOnly: true,
              // startAdornment: (
              //   <InputAdornment position="start">
              //     <AccountCircle color="primary" />
              //   </InputAdornment>
              // ),
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
            variant="filled"
            id="email"
            margin="normal"
            fullWidth
            name="email"
            label="E-mail"
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
