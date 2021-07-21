import { Button, makeStyles, Paper } from '@material-ui/core';
import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams, Outlet } from 'react-router-dom';
import { AuthContext } from '../../../store/Auth/AuthState';
import { GlobalContext } from '../../../store/Global/GlobalState';

const Portal = (): any => {
  const { setMenu, setApiConfig } = useContext(GlobalContext);
  useEffect(() => {
    setMenu('portal');
  }, []);
  const { user, onRedirect, mockup } = useContext(AuthContext);
  const navigate = useNavigate();
  const { data } = user;
  const dados = data?.permissoes.reduce(
    (total: any, current: any) => {
      const clientes = current.cliente ? [...total.clientes, current.cliente] : total.clientes;
      const revendedores = current.revendedor ? [...total.revendedores, current.revendedor] : total.revendedores;
      return { clientes, revendedores };
    },
    { clientes: [], revendedores: [] }
  );
  const isMultiClientes = dados.clientes.length > 1;
  const isMultiRevendedores = dados.revendedores.length > 1;

  const classes = useStyles();

  function checkBeforeRedirect(path: '/painel' | '/escallo' | '/consultor' | '/revendedor' = '/painel') {
    const isModuloCliente = Boolean(path === '/painel' || path === '/escallo');
    return () => {
      if (isModuloCliente ? isMultiClientes : isMultiRevendedores) {
        navigate(path);
      } else {
        if (isModuloCliente) {
          const host = dados.clientes[0].host;
          if (path === '/painel') {
            window.location.href = `${host}escallo/atendimento`;
          } else {
            window.location.href = `${host}escallo/admin`;
          }
        } else {
          setApiConfig({ cliente: dados.clientes[0].id, revendedor: dados.revendedores[0].id });
          navigate('/');
          onRedirect(true);
        }
      }
    };
  }

  return (
    <Paper className={classes.paper}>
      <Button color="primary" onClick={checkBeforeRedirect('/painel')}>
        Painel
      </Button>
      <Button color="primary" onClick={checkBeforeRedirect('/escallo')}>
        Escallo
      </Button>
      <Button color="primary" onClick={checkBeforeRedirect('/consultor')}>
        Consultor
      </Button>
      <Button color="primary" onClick={checkBeforeRedirect('/revendedor')}>
        Revendedor
      </Button>
      <Button
        color="primary"
        onClick={() => {
          navigate('/');
          onRedirect(true);
        }}
      >
        Super
      </Button>
      <Outlet />
    </Paper>
  );
};

const useStyles = makeStyles((theme: any) => ({
  paper: {
    margin: theme.spacing(3),
    padding: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column'
  }
}));

export default Portal;
