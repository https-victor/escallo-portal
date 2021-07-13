import { useCallback, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../../store/Auth/AuthState';
import { RevendedoresContext, RevendedoresProvider } from '../../store/Revendedores/RevendedoresState';
import { GridOverlay, DataGrid, GridColDef, GridCellParams } from '@material-ui/data-grid';
import { LinearProgress, makeStyles, Switch, Typography } from '@material-ui/core';
import { FiberManualRecord as FiberManualRecordIcon } from '@material-ui/icons';
import { red, green } from '@material-ui/core/colors';

const Index = (): any => {
  const classes = useStyles();
  const { auth } = useContext(AuthContext);
  const { loading, lista, rows, onUpdateRevendedor } = useContext(RevendedoresContext);

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
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      renderCell: Status
    }
  ];
  return (
    <div className={classes.paper}>
      <DataGrid
        rows={rows}
        loading={loading}
        components={{
          LoadingOverlay: CustomLoadingOverlay
        }}
        columns={columns}
        pageSize={5}
        onEditCellChangeCommitted={handleEditCellChangeCommitted}
        checkboxSelection
        disableSelectionOnClick
      />
    </div>
  );
};

const Revendedores = (): any => (
  <RevendedoresProvider>
    <Index />
  </RevendedoresProvider>
);

const useStyles = makeStyles((theme) => ({
  paper: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  }
}));

export default Revendedores;
