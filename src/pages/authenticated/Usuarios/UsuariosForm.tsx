import { Button, TextField } from '@material-ui/core';
import { UsuariosFormValues } from '../../../store/Usuarios/UsuariosState';
import { FormikProps, useFormik } from 'formik';
import * as yup from 'yup';
import { makeStyles } from '@material-ui/core';

type UsuariosFormType = {
  onSubmit: (values: UsuariosFormValues, form: FormikProps<UsuariosFormValues>) => void;
};
export const UsuariosForm = ({ onSubmit }: UsuariosFormType): any => {
  const usuariosFormValidation = yup.object({
    email: yup.string().email('Digite um e-mail válido').required('Digite um e-mail'),
    permissoes: yup.array().min(1, 'Selecione ao menos uma permissão')
  });
  const usuariosFormInitialValues: UsuariosFormValues = {
    email: '',
    first: false,
    second: false
  };
  const form = useFormik({
    initialValues: usuariosFormInitialValues,
    validationSchema: usuariosFormValidation,
    onSubmit: onFormSubmit
  });

  function onFormSubmit(values: UsuariosFormValues) {
    onSubmit(values, form);
  }

  const classes = classStyle();

  return (
    <form onSubmit={form.handleSubmit} className={classes.form}>
      <div></div>
      <TextField
        variant="outlined"
        margin="normal"
        name="email"
        label="E-mail"
        id="email"
        value={form.values.email}
        onChange={form.handleChange}
        error={form.touched.email && Boolean(form.errors.email)}
        helperText={form.touched.email && form.errors.email}
      />

      <Button type="submit" variant="contained" color="primary" className={classes.submit}>
        Adicionar
      </Button>
    </form>
  );
};

const classStyle = makeStyles((theme: any) => ({
  submit: {
    margin: theme.spacing(3, 0, 2)
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
    '& .MuiTextField-root': {
      flexGrow: 1,
      marginLeft: 24,
      marginRight: 24
    },
    '& :nth-child(2)': {
      marginLeft: 0
    }
  }
}));
