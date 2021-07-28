import { ClientesType } from '../../../store/Clientes/ClientesReducer';
import { FormikProps, useFormik } from 'formik';
import { Button, makeStyles, TextField } from '@material-ui/core';
import { ClientesFormValues } from '../../../store/Clientes/ClientesState';
import { TextArea } from '../../../components';
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
    status: 'ATIVO',
    qtAgentesVoz: 0,
    qtAgentesChat: 0
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
      <div>
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
        <div className={classes.numbersFields}>
          <TextArea
            name="qtdeAgentesVoz"
            id="qtdeAgentesVoz"
            label="Nº Agentes Voz"
            formValue={form.initialValues.qtAgentesVoz}
            onChange={form.handleChange}
            error={form.touched.qtAgentesVoz && Boolean(form.errors.qtAgentesVoz)}
            helperText={form.touched.qtAgentesVoz && form.errors.qtAgentesVoz}
          />
          <TextArea
            name="qtdeAgentesVoz"
            id="qtdeAgentesVoz"
            label="Nº Agentes Voz"
            formValue={form.initialValues.qtAgentesChat}
            onChange={form.handleChange}
            error={form.touched.qtAgentesChat && Boolean(form.errors.qtAgentesChat)}
            helperText={form.touched.qtAgentesChat && form.errors.qtAgentesChat}
          />
        </div>
      </div>
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
    flexDirection: 'column',
    alignItems: 'center',
    '& .MuiTextField-root': {
      flexGrow: 1,
      marginLeft: 24,
      marginRight: 24
    }
  },
  numbersFields: {
    display: 'flex',
    flexDirection: 'row'
  }
}));
