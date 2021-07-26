import { ClientesType } from '../../../store/Clientes/ClientesReducer';
import { FormikProps, useFormik } from 'formik';
import { Button, makeStyles, TextField } from '@material-ui/core';
import { ClientesFormValues } from '../../../store/Clientes/ClientesState';
import * as yup from 'yup';

type ClientesValuesType = {
  onSubmit: (values: ClientesFormValues, form: FormikProps<ClientesFormValues>) => void;
  loading?: boolean;
};

export const ClientesForm = ({ onSubmit, loading }: ClientesValuesType): any => {
  const classes = useStyles();

  const clienteFormValidation = yup.object({
    nome: yup.string().required('Digite um nome').min(5, 'O nome deve conter mais de 5 caracteres'),
    email: yup.string().email('Digite um e-mail válido').required('Digite um e-mail')
  });
  const clienteFormInitialValues: ClientesFormValues = {
    nome: '',
    email: '',
    status: 'ATIVO'
  };
  const form = useFormik({
    initialValues: clienteFormInitialValues,
    validationSchema: clienteFormValidation,
    onSubmit: onFormSubmit
  });

  function onFormSubmit(values: ClientesFormValues) {
    onSubmit(values, form);
  }

  return (
    <form className={classes.form} onSubmit={form.handleSubmit}>
      <div></div>
      <TextField
        variant="outlined"
        margin="normal"
        name="nome"
        label="Nome"
        id="nome"
        value={form.values.nome}
        onChange={form.handleChange}
        error={form.touched.nome && Boolean(form.errors.nome)}
        helperText={form.touched.nome && form.errors.nome}
      />
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
      <Button type="submit" className={classes.submit} variant="contained" color="primary">
        Adicionar
      </Button>
    </form>
  );
};

const useStyles = makeStyles((theme: any) => ({
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
