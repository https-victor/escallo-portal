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

  const auxCliente = pathname === '/painel' ? 'agente' : 'gestor';

  const clientes = user?.data?.permissoes
    .filter((permissao: any) => permissao.cliente !== null && permissao.permissao === auxCliente && permissao.cliente)
    .map((permissao: any) => permissao.cliente);

  const auxRevendedor = pathname === '/consultor' ? 'consultor' : 'revendedor';

  const revendedores = user?.data?.permissoes
    .filter(
      (permissao: any) => permissao.revendedor !== null && permissao.permissao === auxRevendedor && permissao.revendedor
    )
    .map((permissao: any) => permissao.revendedor);

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
        setApiConfig({
          cliente: null,
          revendedor: id,
          permissao: auxRevendedor
        });
        navigate('/');
        onRedirect(true);
      }
    };
  }

  return (
    <div className={classes.paper}>
      {(isModuloCliente ? clientes : revendedores).map((selected: any) => {
        return (
          <Paper className={classes.paper} key={selected.id} onClick={onClick(selected.id)}>
            <Typography variant="subtitle2">{selected.nome}</Typography>
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
