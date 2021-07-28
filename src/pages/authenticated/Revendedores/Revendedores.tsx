import { useContext, useEffect } from 'react';
import { ToggleDrawer } from '../../../components';
import {
  RevendedoresContext,
  RevendedoresProvider,
  RevendedorType
} from '../../../store/Revendedores/RevendedoresState';
import {
  GridOverlay,
  DataGrid,
  GridColDef,
  GridCellParams,
  useGridSlotComponentProps,
  GridEditCellPropsParams
} from '@material-ui/data-grid';
import { Button, LinearProgress, makeStyles, Paper, Switch, TextField } from '@material-ui/core';
import Pagination from '@material-ui/lab/Pagination';
import { GlobalContext } from '../../../store/Global/GlobalState';
import { RevendedoresForm } from './RevendedoresForm';

const Index = (): any => {
  const classes = useStyles();
  const { loading, revendedores, onUpdateRevendedor, onCreateRevendedor } = useContext(RevendedoresContext);

  const { setMenu } = useContext(GlobalContext);
  useEffect(() => {
    setMenu('revendedores');
  }, []);

  const changeStatus = (id: any) => (params: any) => {
    const status = params.target.checked ? 'ATIVO' : 'INATIVO';
    onUpdateRevendedor({ id, status: status });
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

  const handleEditCellChangeCommitted = ({ id, field, props }: GridEditCellPropsParams) => {
    const data = props;

    console.log(props);

    if (revendedores.find((item: RevendedorType) => item.id === id)[field] !== data.value) {
      onUpdateRevendedor({ id: parseFloat(id as string), [field]: data.value });
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
      field: 'label',
      headerName: 'Label',
      flex: 2,
      editable: !loading
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      renderCell: Status
    }
  ];
  return (
    <Paper className={classes.paper}>
      <div className={classes.container}>
        <DataGrid
          rows={revendedores}
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
        <ToggleDrawer>
          <RevendedoresForm onSubmit={onCreateRevendedor} />
        </ToggleDrawer>
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

  addRevendedor: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    marginLeft: 48,
    marginRight: theme.spacing(2)
  },
  container: {
    flexGrow: 1
  }
}));

export default Revendedores;
