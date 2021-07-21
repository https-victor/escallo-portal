import { Button, makeStyles, Paper, Typography } from '@material-ui/core';
import { useContext, useEffect } from 'react';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../../store/Auth/AuthState';
import { GlobalContext } from '../../../store/Global/GlobalState';

const ModuloSelector = ({ redirect }: any): any => {
  const { setMenu, setApiConfig } = useContext(GlobalContext);
  const { user, onRedirect } = useContext(AuthContext);
  const navigate = useNavigate();
  const classes = useStyles();
  const location = useLocation();
  const { data } = user;
  const clientes = user?.data?.permissoes.map((permissao: any) => permissao.cliente !== null && permissao.cliente);

  console.log(user?.data?.permissoes);

  const revendedores = user?.data?.permissoes.map(
    (permissao: any) => permissao.revendedor !== null && permissao.revendedor
  );
  const { pathname } = location;
  useEffect(() => {
    switch (location.pathname) {
      case '/painel':
        setMenu('painel');
        break;
      case '/escallo':
        setMenu('escallo');
        break;
      case '/consultor':
        setMenu('consultor');
        break;
      case '/revendedor':
        setMenu('revendedor');
        break;
      default:
        setMenu('portal');
        break;
    }
  }, []);

  const isModuloCliente = Boolean(pathname === '/painel' || pathname === '/escallo');

  function onClick(id: number): any {
    return () => {
      if (isModuloCliente) {
        const host = clientes.find(({ id: clienteId }: any) => id === clienteId).host;
        if (pathname === '/painel') {
          window.location.href = `${host}escallo/atendimento`;
        } else {
          window.location.href = `${host}escallo/admin`;
        }
      } else {
        // const selectedPermissao = user?.data?.permissoes.find(({ revendedor }: any) => revendedor.id === id);
        setApiConfig({
          cliente: null,
          revendedor: id,
          permissao: pathname === '/consultor' ? 'consultor' : 'revendedor'
        });
        navigate('/');
        onRedirect(true);
      }
    };
  }

  return (
    <div className={classes.paper}>
      {(isModuloCliente ? clientes : revendedores).map((cliente: any) => {
        return (
          <Paper className={classes.paper} key={cliente.id} onClick={onClick(cliente.id)}>
            <Typography variant="subtitle2">{cliente.nome}</Typography>
          </Paper>
        );
      })}
    </div>
  );
};

const useStyles = makeStyles((theme: any) => ({
  paper: {
    margin: theme.spacing(3),
    padding: theme.spacing(3),
    display: 'flex'
  }
}));

export default ModuloSelector;
