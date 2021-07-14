import { useCallback, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../../../store/Auth/AuthState';
import { RevendedoresContext, RevendedoresProvider } from '../../../store/Revendedores/RevendedoresState';
import { GridOverlay, DataGrid, GridColDef, GridCellParams, useGridSlotComponentProps } from '@material-ui/data-grid';
import { Button, LinearProgress, makeStyles, Paper, Switch, TextField, Typography } from '@material-ui/core';
import { FiberManualRecord as FiberManualRecordIcon } from '@material-ui/icons';
import { red, green } from '@material-ui/core/colors';
import Pagination from '@material-ui/lab/Pagination';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { GlobalContext } from '../../../store/Global/GlobalState';

const Index = (): any => {
  const classes = useStyles();
  const { auth } = useContext(AuthContext);
  const { loading, lista, rows, onUpdateRevendedor, onCreateRevendedor } = useContext(RevendedoresContext);

  const { setMenu } = useContext(GlobalContext);
  useEffect(() => {
    setMenu('revendedores');
  }, []);
  const revendedorFormValidation = yup.object({
    nome: yup.string().required('Digite um nome').min(5, 'O nome deve conter mais de 5 caracteres'),
    email: yup.string().email('Digite um e-mail válido').required('Digite um e-mail'),
    label: yup.string().required('Digite um label')
  });
  const revendedorFormInitialValues = {
    nome: '',
    email: '',
    label: ''
  };
  const revendedorForm = useFormik({
    initialValues: revendedorFormInitialValues,
    validationSchema: revendedorFormValidation,
    onSubmit: (values) => {
      onCreateRevendedor(values);
    }
  });

  const changeStatus = (id: any) => (params: any) => {
    const status = params.target.checked ? 'ATIVO' : 'INATIVO';
    onUpdateRevendedor(id, { status: status });
  };

  const Status = (params: GridCellParams) => {
    const isAtivo = Boolean(params.value === 'ATIVO');
    return <Switch disabled={loading} checked={isAtivo} onChange={changeStatus(params.row.id)} color="primary" />;
  };

  function CustomLoadingOverlay() {
    return (
      <GridOverlay>
        <div style={{ position: 'absolute', top: 0, width: '100%' }}>
          <LinearProgress />
        </div>
      </GridOverlay>
    );
  }

  function CustomPagination() {
    const { state, apiRef } = useGridSlotComponentProps();
    const classes = useStyles();

    return (
      <Pagination
        className={classes.root}
        color="primary"
        count={state.pagination.pageCount}
        page={state.pagination.page + 1}
        onChange={(event, value) => apiRef.current.setPage(value - 1)}
      />
    );
  }

  const handleEditCellChangeCommitted = ({ id, field, props }: any) => {
    const data = props;
    if (rows.find((item: any) => item.id === id)[field] !== data.value) {
      onUpdateRevendedor(id, { [field]: data.value });
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'nome',
      headerName: 'Nome',
      flex: 3,
      editable: !loading
    },
    {
      field: 'email',
      headerName: 'E-mail',
      flex: 3,
      editable: !loading
    },
    {
      field: 'label',
      headerName: 'Label',
      flex: 2,
      editable: !loading
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      align: 'center',
      headerAlign: 'center',
      renderCell: Status
    }
  ];
  return (
    <Paper className={classes.paper}>
      <div className={classes.container}>
        <DataGrid
          rows={rows}
          autoHeight
          loading={loading}
          components={{
            LoadingOverlay: CustomLoadingOverlay,
            Pagination: CustomPagination
          }}
          columns={columns}
          pageSize={10}
          onEditCellChangeCommitted={handleEditCellChangeCommitted}
          checkboxSelection
          disableSelectionOnClick
        />
        <form className={classes.form} onSubmit={revendedorForm.handleSubmit}>
          <div></div>
          <TextField
            variant="outlined"
            margin="normal"
            name="nome"
            label="Nome"
            id="nome"
            value={revendedorForm.values.nome}
            onChange={revendedorForm.handleChange}
            error={revendedorForm.touched.nome && Boolean(revendedorForm.errors.nome)}
            helperText={revendedorForm.touched.nome && revendedorForm.errors.nome}
          />
          <TextField
            variant="outlined"
            margin="normal"
            name="email"
            label="E-mail"
            id="email"
            value={revendedorForm.values.email}
            onChange={revendedorForm.handleChange}
            error={revendedorForm.touched.email && Boolean(revendedorForm.errors.email)}
            helperText={revendedorForm.touched.email && revendedorForm.errors.email}
          />
          <TextField
            variant="outlined"
            margin="normal"
            name="label"
            label="Label"
            id="label"
            value={revendedorForm.values.label}
            onChange={revendedorForm.handleChange}
            error={revendedorForm.touched.label && Boolean(revendedorForm.errors.label)}
            helperText={revendedorForm.touched.label && revendedorForm.errors.label}
          />
          <Button type="submit" className={classes.submit} variant="contained" color="primary">
            Adicionar
          </Button>
        </form>
      </div>
    </Paper>
  );
};

const Revendedores = (): any => (
  <RevendedoresProvider>
    <Index />
  </RevendedoresProvider>
);

const useStyles = makeStyles((theme: any) => ({
  paper: {
    margin: theme.spacing(3),
    padding: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column'
  },
  footer: {
    display: 'flex',
    width: '100%',
    flexDirection: 'column'
  },
  root: {
    alignSelf: 'flex-end',
    display: 'flex',
    marginBottom: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  },
  addRevendedor: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    marginLeft: 48,
    marginRight: theme.spacing(2)
  },
  container: {
    flexGrow: 1
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

export default Revendedores;
