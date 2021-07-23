import { GlobalContext } from '../../../store/Global/GlobalState';
import { useContext, useEffect } from 'react';
import {
  GridOverlay,
  DataGrid,
  GridColDef,
  GridCellParams,
  useGridSlotComponentProps,
  GridEditCellPropsParams
} from '@material-ui/data-grid';
import { Button, LinearProgress, makeStyles, Paper, Checkbox } from '@material-ui/core';
import Pagination from '@material-ui/lab/Pagination';
import { ConsultoresContext, ConsultorProvider, ConsultorType } from '../../../store/Consultores/ConsultoresState';

const Index = (): any => {
  const classes = useStyles();
  const { loading, consultores, onUpdateConsultor, consultorForm } = useContext(ConsultoresContext);
  const { setMenu, apiConfig } = useContext(GlobalContext);

  useEffect(() => {
    setMenu('consultores');
  }, []);

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

  const changeCheck = (id: number, field: string) => {
    return () => {
      const consultor = consultores.find((element: any) => element.id === id);
      const { permissao } = consultor;

      if (permissao.includes(field)) {
        const auxPermissoes = permissao.filter((element: any) => element !== field && element);
        onUpdateConsultor({ id, permissao: auxPermissoes });
      } else {
        onUpdateConsultor({ id, permissao: [...permissao, field] });
      }
    };
  };

  const customCheckbox = ({ row, field }: GridCellParams) => {
    const isValidPermition = row.permissao.includes(field);

    return <Checkbox checked={isValidPermition} color="primary" onChange={changeCheck(row.id, field)} />;
  };

  const deleteButton = (params: GridCellParams) => {
    return (
      <Button variant="contained" color="primary" onClick={() => console.log(consultores)}>
        Delete
      </Button>
    );
  };

  const handleEditCellChangeCommitted = ({ id, field, props }: GridEditCellPropsParams) => {
    const data = props;

    if (consultores.find((item: ConsultorType) => item.id === id)[field] !== data.value) {
      onUpdateConsultor({ id: parseFloat(id as string), [field]: data.value });
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'email',
      headerName: 'E-mail',
      flex: 3,
      editable: !loading
    },
    {
      field: 'gestor',
      headerName: 'Gestor',
      flex: 1,
      renderCell: customCheckbox
    },
    {
      field: 'diretor',
      headerName: 'Diretor',
      flex: 1,
      renderCell: customCheckbox
    },
    {
      field: 'delete',
      headerName: 'Delete',
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      renderCell: deleteButton
    }
  ];
  return (
    <Paper className={classes.paper}>
      <div className={classes.container}>
        <DataGrid
          rows={consultores}
          autoHeight
          loading={loading}
          components={{
            LoadingOverlay: CustomLoadingOverlay,
            Pagination: CustomPagination
          }}
          columns={columns}
          pageSize={10}
          onEditCellChangeCommitted={handleEditCellChangeCommitted}
          disableSelectionOnClick
        />
      </div>
    </Paper>
  );
};

const Consultores = (): any => {
  return (
    <ConsultorProvider>
      <Index />
    </ConsultorProvider>
  );
};

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
export default Consultores;
