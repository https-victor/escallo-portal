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
  const permissoes = data.permissoes
    .map((perm: any) => perm.permissao)
    .map((e: any, i: number, final: any) => final.indexOf(e) === i && e)
    .filter((e: any) => e);

  return (
    <div>
      <Paper className={classes.paper}>
        {permissoes.map(
          (permissao: any) =>
            (permissao === 'agente' && (
              <Button color="primary" onClick={checkBeforeRedirect('/painel')}>
                Painel
              </Button>
            )) ||
            (permissao === 'gestor' && [
              <Button color="primary" key={0} onClick={checkBeforeRedirect('/revendedor')}>
                Relatórios
              </Button>,
              <Button color="primary" key={1} onClick={checkBeforeRedirect('/escallo')}>
                Escallo
              </Button>
            ])
        )}
      </Paper>
      <Paper className={classes.paper}>
        {permissoes.map(
          (permissao: any) =>
            (permissao === 'consultor' && (
              <Button color="primary" onClick={checkBeforeRedirect('/consultor')}>
                Consultor
              </Button>
            )) ||
            (permissao === 'revendedor' && (
              <Button color="primary" onClick={checkBeforeRedirect('/revendedor')}>
                Revendedor
              </Button>
            ))
        )}
      </Paper>
      <Paper className={classes.paper}>
        {permissoes.map(
          (permissao: any) =>
            permissao === 'super' && (
              <Button
                color="primary"
                onClick={() => {
                  setApiConfig({ cliente: null, revendedor: null, permissao: 'super' });
                  navigate('/');
                  onRedirect(true);
                }}
              >
                Super
              </Button>
            )
        )}
      </Paper>
      <Outlet />
    </div>
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
