import { Button, makeStyles, Paper } from '@material-ui/core';
import { useContext, useEffect } from 'react';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../../store/Auth/AuthState';
import { GlobalContext } from '../../../store/Global/GlobalState';

const ModuloSelector = ({ redirect }: any): any => {
  const { setMenu } = useContext(GlobalContext);
  const { user, onRedirect } = useContext(AuthContext);
  const navigate = useNavigate();
  const classes = useStyles();
  const location = useLocation();
  const { data } = user;
  const clientes = user?.data?.permissoes.map((permissao: any) => permissao.cliente !== null && permissao.cliente);
  const revendedores = user?.data?.permissoes.map(
    (permissao: any) => permissao.revendedor !== null && permissao.revendedor
  );
  console.log(clientes, revendedores, location.pathname);
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

  // const isModuloCliente = Boolean(path === '/painel' || path === '/escallo');
  //       if (isModuloCliente) {
  //         const host = dados.clientes.find(id).host;
  //         if (path === '/painel') {
  //           window.location.href = `${host}escallo/atendimento`;
  //         } else {
  //           window.location.href = `${host}escallo/admin`;
  //         }
  //       } else {
  //         setApiConfig({ cliente: dados.clientes.find(id).id, revendedor: dados.revendedores.find(id).id });
  //         navigate('/');
  //         onRedirect(true);
  //       }

  return (
    <div className={classes.paper}>
      {/* clientes/revendedores.map... */}
      {/* <Paper onClick={FunçãoParaRedirecionar(id)}> </Paper> */}
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
