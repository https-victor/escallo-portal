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
    const clientes = user?.data?.permissoes.reduce((total: any, current: any) => {
      if (current.cliente && current.permissao === getPermissao()) {
        return [...total, current.cliente];
      }
      return total;
    }, []);

    const revendedores = user?.data?.permissoes.reduce((total: any, current: any) => {
      if (current.revendedor && current.permissao === getPermissao()) {
        return [...total, current.revendedor];
      }
      return total;
    }, []);

    if (path === '/agente' || path === '/gestor') {
      return clientes.length > 1;
    } else {
      return revendedores.length > 1;
    }
  }

  const isMulti = checkIsMultiPermissao();
  const isModuloCliente = Boolean(path === '/agente' || path === '/gestor');

  function getPermissao() {
    switch (path) {
      case '/agente':
        return 'agente';
      case '/gestor':
        return 'gestor';
      case '/consultor':
        return 'consultor';
      case '/diretor':
        return 'diretor';
      default:
        return 'agente';
    }
  }

  function getApiConfig() {
    if (id) {
      if (isModuloCliente) {
        const revendedorId = data?.permissoes.find((permissao: any) => permissao?.cliente?.id === id)?.revendedor?.id;
        return { cliente: id, revendedor: revendedorId };
      } else {
        return { cliente: null, revendedor: id };
      }
    } else {
      const permissao = data?.permissoes.find((permissao: any) => permissao?.permissao === getPermissao());

      return {
        cliente: isModuloCliente ? (permissao.cliente ? permissao.cliente.id : null) : null,
        revendedor: permissao.revendedor ? permissao.revendedor.id : null,
        permissao: getPermissao()
      };
    }
  }

  function navigateIsMulti() {
    navigate(path);
  }

  function navigateRevendedores() {
    setApiConfig(getApiConfig());
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
        : path === '/agente'
        ? { target: '_blank', href: `${host}escallo/atendimento` }
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
        <Paper elevation={3} className={classes.paper}>
          <Typography className={classes.title} color="textSecondary" component="h2" gutterBottom>
            Cliente
          </Typography>
          <Grid justify="center" container spacing={4}>
            {permissoes.includes('agente') && (
              <Grid item xs={3} className={classes.gridItem}>
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
                    <LinkPortal path="/agente">Acessar</LinkPortal>
                  </CardActions>
                </Card>
              </Grid>
            )}
            {permissoes.includes('gestor') && (
              <>
                <Grid item xs={3} className={classes.gridItem}>
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
                <Grid item xs={3} className={classes.gridItem}>
                  <Card elevation={5} className={classes.root}>
                    <CardContent className={classes.center}>
                      <Typography className={classes.title} color="textSecondary" component="h2" gutterBottom>
                        Gestor
                      </Typography>
                    </CardContent>
                    <CardActions className={classes.center}>
                      <LinkPortal path="/gestor">Acessar</LinkPortal>
                    </CardActions>
                  </Card>
                </Grid>
              </>
            )}
          </Grid>
        </Paper>
      )}

      {(permissoes.includes('consultor') || permissoes.includes('diretor')) && (
        <Paper elevation={3} className={classes.paper}>
          <Typography className={classes.title} color="textSecondary" component="h2" gutterBottom>
            Revendedor
          </Typography>
          <Grid justify="center" container spacing={4}>
            {permissoes.includes('consultor') && (
              <Grid item xs={3} className={classes.gridItem}>
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
            {permissoes.includes('diretor') && (
              <Grid item xs={3} className={classes.gridItem}>
                <Card elevation={5} className={classes.root}>
                  <CardContent className={classes.center}>
                    <Typography className={classes.title} color="textSecondary" component="h2" gutterBottom>
                      Diretor
                    </Typography>
                  </CardContent>
                  <CardActions className={classes.center}>
                    <LinkPortal path="/diretor">Acessar</LinkPortal>
                  </CardActions>
                </Card>
              </Grid>
            )}
          </Grid>
        </Paper>
      )}

      {permissoes.includes('super') && (
        <Paper elevation={3} className={classes.paper}>
          <Typography className={classes.title} color="textSecondary" component="h2" gutterBottom>
            Super
          </Typography>
          <Grid justify="center" container spacing={4}>
            <Grid item xs={3} className={classes.gridItem}>
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
        </Paper>
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
  gridItem: {
    minWidth: 250
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
