import { useContext, useEffect } from 'react';
import { ClientesContext, ClientesProvider } from '../../../store/Clientes/ClientesState';
import { GridOverlay, DataGrid, GridColDef, GridCellParams, useGridSlotComponentProps } from '@material-ui/data-grid';
import { Button, LinearProgress, makeStyles, Paper, Switch, TextField } from '@material-ui/core';
import Pagination from '@material-ui/lab/Pagination';
import { GlobalContext } from '../../../store/Global/GlobalState';

const Index = (): any => {
  const classes = useStyles();
  const { loading, rows, onUpdateCliente, clienteForm } = useContext(ClientesContext);

  const { setMenu } = useContext(GlobalContext);
  useEffect(() => {
    setMenu('clientes');
  }, []);

  const changeStatus = (id: number) => (params: any) => {
    const status = params.target.checked ? 'ATIVO' : 'INATIVO';
    onUpdateCliente(id, { status: status });
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
      onUpdateCliente(id, { [field]: data.value });
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
        <form className={classes.form} onSubmit={clienteForm.handleSubmit}>
          <div></div>
          <TextField
            variant="outlined"
            margin="normal"
            name="nome"
            label="Nome"
            id="nome"
            value={clienteForm.values.nome}
            onChange={clienteForm.handleChange}
            error={clienteForm.touched.nome && Boolean(clienteForm.errors.nome)}
            helperText={clienteForm.touched.nome && clienteForm.errors.nome}
          />
          <TextField
            variant="outlined"
            margin="normal"
            name="email"
            label="E-mail"
            id="email"
            value={clienteForm.values.email}
            onChange={clienteForm.handleChange}
            error={clienteForm.touched.email && Boolean(clienteForm.errors.email)}
            helperText={clienteForm.touched.email && clienteForm.errors.email}
          />
          <Button type="submit" className={classes.submit} variant="contained" color="primary">
            Adicionar
          </Button>
        </form>
      </div>
    </Paper>
  );
};

const Clientes = (): any => (
  <ClientesProvider>
    <Index />
  </ClientesProvider>
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
  addCliente: {
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

export default Clientes;
