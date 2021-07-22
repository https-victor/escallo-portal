import { Button, Card, CardActions, CardContent, Grid, makeStyles, Paper, Typography } from '@material-ui/core';
import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams, Outlet, Navigate } from 'react-router-dom';
import { AuthContext } from '../../../store/Auth/AuthState';
import { GlobalContext } from '../../../store/Global/GlobalState';
export const LinkPortal = ({ path, id, portal = true, children }: any) => {
  const { setApiConfig } = useContext(GlobalContext);
  const { user, onRedirect, mockup } = useContext(AuthContext);
  const navigate = useNavigate();
  const { data } = user;
  const classes = useStyles();
  const dados = data?.permissoes.reduce(
    (total: any, current: any) => {
      const clientes = current.cliente ? [...total.clientes, current.cliente] : total.clientes;
      const revendedores = current.revendedor ? [...total.revendedores, current.revendedor] : total.revendedores;
      return { clientes, revendedores };
    },
    { clientes: [], revendedores: [] }
  );

  function checkIsMultiPermissao() {
    const auxCliente = path === '/painel' ? 'agente' : 'gestor';

    const clientes = user?.data?.permissoes.reduce((total: any, current: any) => {
      if (current.cliente && current.permissao !== auxCliente) {
        return [...total, current.cliente];
      }
      return total;
    }, []);

    const auxRevendedor = path === '/consultor' ? 'consultor' : 'revendedor';

    const revendedores = user?.data?.permissoes.reduce((total: any, current: any) => {
      if (current.revendedor && current.permissao !== auxRevendedor) {
        return [...total, current.revendedor];
      }
      return total;
    }, []);

    if (path === '/painel' || path === '/escallo') {
      return clientes.length > 1;
    } else {
      return revendedores.length > 1;
    }
  }

  const isMulti = checkIsMultiPermissao();
  const isModuloCliente = Boolean(path === '/painel' || path === '/escallo');

  function getPermissao() {
    switch (path) {
      case '/painel':
        return 'agente';
      case '/escallo':
        return 'gestor';
      case '/consultor':
        return 'consultor';
      case '/revendedor':
        return 'revendedor';
      default:
        return 'agente';
    }
  }
  const cliente = !id
    ? data?.permissoes.find((permissao: any) => permissao?.revendedor?.id === dados.revendedores[0].id)?.cliente?.id
    : data?.permissoes.find((permissao: any) => permissao?.revendedor?.id === id)?.cliente?.id;
  const revendedor = portal ? dados.revendedores[0].id : id;
  const permissao = getPermissao();

  function navigateIsMulti() {
    navigate(path);
  }

  function navigateRevendedores() {
    setApiConfig({
      cliente,
      revendedor,
      permissao
    });
    navigate('/');
    onRedirect(true);
  }
  const host = portal ? dados?.clientes[0]?.host : dados?.clientes.find((cliente: any) => cliente.id === id)?.host;

  return (
    <Button
      className={classes.button}
      variant="contained"
      color="primary"
      {...(isMulti && portal
        ? { onClick: navigateIsMulti }
        : isModuloCliente
        ? { target: '_blank', href: `${host}escallo/${path === '/painel' ? 'atendimento' : 'admin'}` }
        : { onClick: navigateRevendedores })}
    >
      {children}
    </Button>
  );
};
const Portal = (): any => {
  const { setMenu, setApiConfig } = useContext(GlobalContext);
  const { user, onRedirect } = useContext(AuthContext);
  const { data } = user;
  const classes = useStyles();
  const navigate = useNavigate();

  const permissoes = data.permissoes.reduce((total: any, current: any) => {
    if (!total.includes(current.permissao)) {
      return [...total, current.permissao];
    }
    return total;
  }, []);

  useEffect(() => {
    setMenu('portal');
  }, []);

  return (
    <Paper elevation={0} className={classes.paper}>
      {(permissoes.includes('agente') || permissoes.includes('gestor')) && (
        <Grid justify="center" container spacing={4}>
          {permissoes.includes('agente') && (
            <Grid item xs={4}>
              <Card elevation={5} className={classes.root}>
                <CardContent className={classes.center}>
                  <Typography className={classes.title} color="textSecondary" component="h2" gutterBottom>
                    Painel
                  </Typography>
                  {/* <Typography  component="p">
                Painel do agente
              </Typography> */}
                </CardContent>
                <CardActions className={classes.center}>
                  <LinkPortal path="/painel">Acessar</LinkPortal>
                </CardActions>
              </Card>
            </Grid>
          )}
          {permissoes.includes('gestor') && (
            <>
              <Grid item xs={4}>
                <Card elevation={5} className={classes.root}>
                  <CardContent className={classes.center}>
                    <Typography className={classes.title} color="textSecondary" component="h2" gutterBottom>
                      Relatórios
                    </Typography>
                  </CardContent>
                  <CardActions className={classes.center}>
                    <Button
                      className={classes.button}
                      variant="contained"
                      color="primary"
                      target="_blank"
                      href="http://www.google.com"
                    >
                      Acessar
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
              <Grid item xs={4}>
                <Card elevation={5} className={classes.root}>
                  <CardContent className={classes.center}>
                    <Typography className={classes.title} color="textSecondary" component="h2" gutterBottom>
                      Escallo
                    </Typography>
                  </CardContent>
                  <CardActions className={classes.center}>
                    <LinkPortal path="/escallo">Acessar</LinkPortal>
                  </CardActions>
                </Card>
              </Grid>
            </>
          )}
        </Grid>
      )}

      {(permissoes.includes('consultor') || permissoes.includes('revendedor')) && (
        <Grid justify="center" container spacing={4}>
          {permissoes.includes('consultor') && (
            <Grid item xs={4}>
              <Card elevation={5} className={classes.root}>
                <CardContent className={classes.center}>
                  <Typography className={classes.title} color="textSecondary" component="h2" gutterBottom>
                    Consultor
                  </Typography>
                </CardContent>
                <CardActions className={classes.center}>
                  <LinkPortal path="/consultor">Acessar</LinkPortal>
                </CardActions>
              </Card>
            </Grid>
          )}
          {permissoes.includes('revendedor') && (
            <Grid item xs={4}>
              <Card elevation={5} className={classes.root}>
                <CardContent className={classes.center}>
                  <Typography className={classes.title} color="textSecondary" component="h2" gutterBottom>
                    Revendedor
                  </Typography>
                </CardContent>
                <CardActions className={classes.center}>
                  <LinkPortal path="/revendedor">Acessar</LinkPortal>
                </CardActions>
              </Card>
            </Grid>
          )}
        </Grid>
      )}

      {permissoes.includes('super') && (
        <Grid justify="center" container spacing={4}>
          <Grid item xs={4}>
            <Card elevation={5} className={classes.root}>
              <CardContent className={classes.center}>
                <Typography className={classes.title} color="textSecondary" component="h2" gutterBottom>
                  Administrador
                </Typography>
              </CardContent>
              <CardActions className={classes.center}>
                <Button
                  className={classes.button}
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    setApiConfig({
                      cliente: null,
                      revendedor: null,
                      permissao: 'super'
                    });
                    navigate('/');
                    onRedirect(true);
                  }}
                >
                  Acessar
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      )}
    </Paper>
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

export default Portal;
