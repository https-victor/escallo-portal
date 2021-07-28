import { RevendedoresType } from '../../../store/Revendedores/RevendedoresReducer';
import { FormikProps, useFormik } from 'formik';
import { Button, makeStyles, TextField } from '@material-ui/core';
import { RevendedoresFormValues } from '../../../store/Revendedores/RevendedoresState';
import { TextArea } from '../../../components';
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
    // onSubmit(values, form);
    form.resetForm();
  }

  return (
    <form className={classes.form} onSubmit={() => onFormSubmit(form.values)}>
      <TextArea
        name="nome"
        label="Nome"
        id="nome"
        value={form.values.nome}
        onChange={form.handleChange}
        error={form.touched.nome && Boolean(form.errors.nome)}
        helperText={form.touched.nome && form.errors.nome}
        disabled={loading}
      />
      <TextArea
        name="email"
        label="E-mail"
        id="email"
        value={form.values.email}
        onChange={form.handleChange}
        error={form.touched.email && Boolean(form.errors.email)}
        helperText={form.touched.email && form.errors.email}
        disabled={loading}
      />
      <TextArea
        name="label"
        label="Label"
        id="label"
        value={form.values.label}
        onChange={form.handleChange}
        error={form.touched.label && Boolean(form.errors.label)}
        helperText={form.touched.label && form.errors.label}
        disabled={loading}
      />
      <div className={classes.buttonContainer}>
        <Button type="submit" className={classes.submit} variant="contained" color="primary" disabled={loading}>
          Adicionar
        </Button>
        <Button
          className={classes.submit}
          variant="contained"
          color="primary"
          disabled={loading}
          onClick={() => console.log(form)}
        >
          Cancelar
        </Button>
      </div>
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
    flexDirection: 'column',
    alignItems: 'center',
    '& .MuiTextField-root': {
      flexGrow: 1,
      marginLeft: 24,
      marginRight: 24
    }
  },
  buttonContainer: {
    display: 'flex'
  }
}));
