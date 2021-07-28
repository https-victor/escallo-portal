import { Button, TextField } from '@material-ui/core';
import { UsuariosFormValues } from '../../../store/Usuarios/UsuariosState';
import { FormikProps, useFormik } from 'formik';
import * as yup from 'yup';
import { makeStyles } from '@material-ui/core';
import { TextArea } from '../../../components';

type UsuariosFormType = {
  onSubmit: (values: UsuariosFormValues, form: FormikProps<UsuariosFormValues>) => void;
};
export const UsuariosForm = ({ onSubmit }: UsuariosFormType): any => {
  const classes = classStyle();

  const usuariosFormValidation = yup.object({
    email: yup.string().email('Digite um e-mail válido').required('Digite um e-mail'),
    permissoes: yup.array().min(1, 'Selecione ao menos uma permissão')
  });
  const usuariosFormInitialValues: UsuariosFormValues = {
    nome: '',
    email: '',
    telefone: '',
    status: '',
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
    <form onSubmit={form.handleSubmit} className={classes.form}>
      <TextArea
        name="email"
        id="email"
        label="E-mail"
        formValue={form.initialValues.nome}
        onChange={form.handleChange}
        error={form.touched.email && Boolean(form.errors.email)}
        helperText={form.touched.email && form.errors.email}
      />
      <TextArea
        name="nome"
        id="nome"
        label="Nome"
        formValue={form.initialValues.nome}
        onChange={form.handleChange}
        error={form.touched.nome && Boolean(form.errors.nome)}
        helperText={form.touched.nome && form.errors.nome}
      />
      <TextArea
        name="telefone"
        id="telefone"
        label="Telefone"
        formValue={form.initialValues.telefone}
        onChange={form.handleChange}
        error={form.touched.telefone && Boolean(form.errors.telefone)}
        helperText={form.touched.telefone && form.errors.telefone}
      />
      <div className={classes.buttonContainer}>
        <Button type="submit" variant="contained" color="primary">
          Adicionar
        </Button>
        <Button type="submit" variant="contained" color="primary">
          Cancelar
        </Button>
      </div>
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
    flexDirection: 'column',
    alignItems: 'center',
    '& .MuiTextField-root': {
      flexGrow: 1,
      marginLeft: 24,
      marginRight: 24
    },
    '& :nth-child(2)': {
      marginLeft: 0
    }
  },
  buttonContainer: {
    display: 'flex'
  }
}));
