import { Button, TextField } from '@material-ui/core';
import { UsuariosFormValues } from '../../../store/Usuarios/UsuariosState';
import { FormikProps, useFormik } from 'formik';
import * as yup from 'yup';

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
  return (
    <form onSubmit={form.handleSubmit}>
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
      <Button type="submit" variant="contained" color="primary">
        Adicionar
      </Button>
    </form>
  );
};
