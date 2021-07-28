import { GlobalContext } from '../../../store/Global/GlobalState';
import { useContext, useEffect, useState } from 'react';
import {
  GridOverlay,
  DataGrid,
  GridColDef,
  GridCellParams,
  useGridSlotComponentProps,
  GridEditCellPropsParams
} from '@material-ui/data-grid';
import {
  Button,
  LinearProgress,
  makeStyles,
  Paper,
  Checkbox as MUICheckbox,
  IconButton,
  TextField,
  FormControlLabel
} from '@material-ui/core';
import Pagination from '@material-ui/lab/Pagination';
import { UsuariosContext, UsuarioProvider, UsuarioType } from '../../../store/Usuarios/UsuariosState';
import { Delete as DeleteIcon } from '@material-ui/icons';
import { UsuariosType } from '../../../store/Usuarios/UsuariosReducer';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { UsuariosForm } from './UsuariosForm';
import { PERMISSOES } from '../../../utils/vo/auth';

const Index = (): any => {
  const classes = useStyles();
  const { loading, usuarios, onUpdateUsuario, onCreateUsuario, onDeleteUsuario } = useContext(UsuariosContext);
  const { setMenu, apiConfig } = useContext(GlobalContext);
  const { DIRETOR, GESTOR, SUPER } = PERMISSOES;

  useEffect(() => {
    setMenu('usuarios');
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
  //Talvez precise de alguma verificação de usuario
  const onChangeCheck = (id: number, field: string) => {
    return () => {
      const usuario = usuarios.find((element: any) => element.id === id);
      const { permissoes } = usuario;

      if (permissoes.includes(field)) {
        const auxPermissoes = permissoes.filter((element: any) => element !== field && element);
        onUpdateUsuario({ id, permissoes: auxPermissoes });
      } else {
        onUpdateUsuario({ id, permissoes: [...permissoes, field] });
      }
    };
  };

  const Checkbox = ({ row, field }: GridCellParams) => {
    const isValidPermition = row?.permissoes?.includes(field);
    return (
      <MUICheckbox
        checked={isValidPermition}
        disabled={loading}
        color="primary"
        onChange={onChangeCheck(row.id, field)}
      />
    );
  };

  const Delete = (params: GridCellParams) => {
    const [state, setState] = useState(false);

    return (
      <IconButton
        color={state ? 'primary' : 'default'}
        onMouseEnter={() => setState((prevState: any) => !prevState)}
        onMouseLeave={() => setState((prevState: any) => !prevState)}
        onClick={() => onDeleteUsuario(params.row.id)}
        disabled={loading}
      >
        <DeleteIcon />
      </IconButton>
    );
  };

  const handleEditCellChangeCommitted = ({ id, field, props }: GridEditCellPropsParams) => {
    if (props) {
      const data = props;

      if (usuarios.find((item: UsuarioType) => item.id === id)[field] !== data?.value) {
        onUpdateUsuario({ id: parseFloat(id as string), [field]: data?.value });
      }
    }
  };

  const isDiretor = apiConfig?.permissao === DIRETOR;
  const isGestor = apiConfig?.permissao === GESTOR;
  const isSuper = apiConfig?.permissao === SUPER;

  const firstLabel = isDiretor ? 'Consultor' : 'Agente';
  const secondLabel = isDiretor ? 'Diretor' : 'Gestor';

  const getPermissaoColumn = () => {
    if (isSuper) {
      return [];
    } else {
      return [
        {
          field: isDiretor ? 'consultor' : 'agente',
          headerName: firstLabel,
          flex: 1,
          renderCell: Checkbox
        },
        {
          field: isDiretor ? DIRETOR : GESTOR,
          headerName: secondLabel,
          flex: 1,
          renderCell: Checkbox
        }
      ];
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'email',
      headerName: 'E-mail',
      flex: 3,
      editable: !loading
    },
    ...getPermissaoColumn(),
    {
      field: 'delete',
      headerName: 'Delete',
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      renderCell: Delete
    }
  ];

  return (
    <Paper className={classes.paper}>
      <div className={classes.container}>
        <DataGrid
          rows={usuarios}
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
        <UsuariosForm onSubmit={onCreateUsuario} />
      </div>
    </Paper>
  );
};

const Usuarios = (): any => {
  return (
    <UsuarioProvider>
      <Index />
    </UsuarioProvider>
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
export default Usuarios;
