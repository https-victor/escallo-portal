import { Button, Card, CardActions, CardContent, Grid, makeStyles, Paper, Typography } from '@material-ui/core';
import { useContext, useEffect } from 'react';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../../store/Auth/AuthState';
import { GlobalContext } from '../../../store/Global/GlobalState';
import { LinkPortal } from '../Portal/Portal';

const ModuloSelector = ({ redirect }: any): any => {
  const { setMenu, setApiConfig } = useContext(GlobalContext);
  const { user, onRedirect } = useContext(AuthContext);
  const navigate = useNavigate();
  const classes = useStyles();
  const location = useLocation();
  const { pathname } = location;

  useEffect(() => {
    switch (pathname) {
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

  return (
    <Paper elevation={0} className={classes.paper}>
      <Grid justify="center" container spacing={4}>
        {(isModuloCliente ? clientes : revendedores).map((selected: any) => {
          return (
            <Grid key={selected.id} item xs={4}>
              <Card elevation={5} className={classes.root}>
                <CardContent className={classes.center}>
                  <Typography className={classes.title} color="textSecondary" component="h2" gutterBottom>
                    {selected.nome}
                  </Typography>
                </CardContent>
                <CardActions className={classes.center}>
                  <LinkPortal portal={false} id={selected.id} path={pathname}>
                    Acessar
                  </LinkPortal>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Paper>

    // <div className={classes.paper}>
    //   {(isModuloCliente ? clientes : revendedores).map((selected: any) => {
    //     return (
    //       <Paper className={classes.paper} key={selected.id} onClick={onClick(selected.id)}>
    //         <Typography variant="subtitle2">{selected.nome}</Typography>
    //       </Paper>
    //     );
    //   })}
    // </div>
  );
};

const useStyles = makeStyles((theme: any) => ({
  paper: {
    margin: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  center: { justifyContent: 'center', textAlign: 'center' },
  button: {
    minWidth: '35%',
    marginBottom: theme.spacing(2)
  },
  root: {
    margin: theme.spacing(3)
  },
  title: {}
}));

export default ModuloSelector;
