import { RevendedoresType } from '../../../store/Revendedores/RevendedoresReducer';
import { FormikProps, useFormik } from 'formik';
import { Button, makeStyles, TextField } from '@material-ui/core';
import { RevendedoresFormValues } from '../../../store/Revendedores/RevendedoresState';
import * as yup from 'yup';

type RevendedoresValuesType = {
  onSubmit: (values: RevendedoresFormValues, form: FormikProps<RevendedoresFormValues>) => void;
  loading?: boolean;
};

export const RevendedoresForm = ({ onSubmit, loading }: RevendedoresValuesType): any => {
  const classes = useStyles();

  const revendedorFormValidation = yup.object({
    nome: yup.string().required('Digite um nome').min(5, 'O nome deve conter mais de 5 caracteres'),
    email: yup.string().email('Digite um e-mail válido').required('Digite um e-mail'),
    label: yup.string().required('Digite um label')
  });
  const revendedorFormInitialValues: RevendedoresFormValues = {
    nome: '',
    email: '',
    label: ''
  };
  const form = useFormik({
    initialValues: revendedorFormInitialValues,
    validationSchema: revendedorFormValidation,
    onSubmit: onFormSubmit
  });

  function onFormSubmit(values: RevendedoresFormValues) {
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
        disabled={loading}
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
        disabled={loading}
      />
      <TextField
        variant="outlined"
        margin="normal"
        name="label"
        label="Label"
        id="label"
        value={form.values.label}
        onChange={form.handleChange}
        error={form.touched.label && Boolean(form.errors.label)}
        helperText={form.touched.label && form.errors.label}
        disabled={loading}
      />
      <Button type="submit" className={classes.submit} variant="contained" color="primary" disabled={loading}>
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
