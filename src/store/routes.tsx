import { useContext } from 'react';
import { Navigate, useLocation, useRoutes } from 'react-router-dom';
import { AuthContext } from './Auth/AuthState';
import {
  Usuarios,
  Clientes,
  Configuracoes,
  Dashboard,
  LandingPage,
  Login,
  ModuloSelector,
  NotFound,
  Portal,
  Profile,
  Revendedores,
  SignUp
} from '../pages';
import Home from '../pages/authenticated/Home/Home';
import { GlobalContext } from './Global/GlobalState';

export default function MainRoutes(): any {
  const { user, redirected } = useContext(AuthContext);
  const { apiConfig } = useContext(GlobalContext);
  const { authenticated, loading } = user;
  const location = useLocation();
  const permissao = apiConfig?.permissao;
  const { cliente: clienteId, revendedor: revendedorId } = apiConfig || {};

  const host = user?.data?.permissoes.find((permissao: any) => permissao.cliente.id === clienteId)?.cliente?.host;
  const mainRoutes = {
    path: '/',
    element: loading ? <>Carregando</> : authenticated ? <Dashboard /> : <LandingPage />,
    children: authenticated && [
      ...(redirected
        ? [
            { path: '/', element: <Home /> },
            permissao === 'gestor' && { path: 'escallo', element: <Navigate to="https://www.google.com" /> },
            permissao === 'gestor' && { path: 'usuarios', element: <Usuarios /> },
            permissao === 'super' && { path: 'revendedores', element: <Revendedores /> },
            permissao === 'super' && { path: 'usuarios', element: <Usuarios /> },
            permissao === 'consultor' && { path: 'clientes', element: <Clientes /> },
            permissao === 'diretor' && { path: 'usuarios', element: <Usuarios /> },
            { path: 'perfil', element: <Profile /> }
          ]
        : [
            {
              path: '/',
              element: <Portal />
            },
            { path: 'agente', element: <ModuloSelector redirect /> },
            { path: 'gestor', element: <ModuloSelector redirect /> },
            { path: 'consultor', element: <ModuloSelector /> },
            { path: 'diretor', element: <ModuloSelector /> },
            { path: 'perfil', element: <Navigate to="/" /> },
            { path: 'escallo', element: <Navigate to="/" /> },
            { path: 'revendedores', element: <Navigate to="/" /> },
            { path: 'clientes', element: <Navigate to="/" /> },
            { path: 'usuarios', element: <Navigate to="/" /> }
          ]),
      { path: '404', element: <NotFound /> },
      { path: 'configuracoes', element: <Configuracoes /> },
      { path: '*', element: <Navigate to="/404" /> }
    ]
  };

  const otherRoutes = [
    {
      path: '/login',
      element: authenticated ? <Navigate to="/" /> : <Login />
    },
    {
      path: '/cadastro',
      element: authenticated ? <Navigate to="/" /> : <SignUp />
    },
    ...(authenticated || loading
      ? []
      : [
          { path: 'agente', element: <Navigate to="/" /> },
          { path: 'gestor', element: <Navigate to="/" /> },
          { path: 'consultor', element: <Navigate to="/" /> },
          { path: 'diretor', element: <Navigate to="/" /> },
          { path: 'usuarios', element: <Navigate to="/" /> },
          { path: 'revendedores', element: <Navigate to="/" /> },
          { path: 'clientes', element: <Navigate to="/" /> },
          { path: 'configuracoes', element: <Navigate to="/" /> },
          { path: 'perfil', element: <Navigate to="/" /> },
          { path: '*', element: <Navigate to="/404" /> },
          { path: '404', element: <NotFound /> }
        ])
  ];

  const routing = useRoutes([mainRoutes, { path: 'teste', element: <>Teste</> }, ...otherRoutes]);
  return <>{routing}</>;
}
