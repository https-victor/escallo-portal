import { useContext } from 'react';
import { Navigate, useLocation, useNavigate, useRoutes } from 'react-router-dom';
import { AuthContext } from './Auth/AuthState';
import {
  Consultores,
  Clientes,
  Configuracoes,
  Dashboard,
  LandingPage,
  Login,
  ModuloSelector,
  NotFound,
  Portal,
  Profile,
  Relatorio,
  Relatorios,
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
  const mainRoutes = {
    path: '/',
    element: loading ? <>Carregando</> : authenticated ? <Dashboard /> : <LandingPage />,
    children: authenticated && [
      ...(redirected
        ? [
            { path: '/', element: <Home /> },
            permissao === 'super' && { path: 'revendedores', element: <Revendedores /> },
            permissao === 'consultor' && { path: 'clientes', element: <Clientes /> },
            permissao === 'revendedor' && { path: 'consultores', element: <Consultores /> },
            { path: 'perfil', element: <Profile /> }
          ]
        : [
            {
              path: '/',
              element: <Portal />
            },
            { path: 'painel', element: <ModuloSelector redirect /> },
            { path: 'escallo', element: <ModuloSelector redirect /> },
            { path: 'consultor', element: <ModuloSelector /> },
            { path: 'revendedor', element: <ModuloSelector /> },
            { path: 'perfil', element: <Navigate to="/" /> },
            { path: 'revendedores', element: <Navigate to="/" /> },
            { path: 'clientes', element: <Navigate to="/" /> },
            { path: 'consultores', element: <Navigate to="/" /> }
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
          { path: 'painel', element: <Navigate to="/" /> },
          { path: 'escallo', element: <Navigate to="/" /> },
          { path: 'cosultor', element: <Navigate to="/" /> },
          { path: 'revendedor', element: <Navigate to="/" /> },
          { path: 'configuracoes', element: <Navigate to="/" /> },
          { path: 'perfil', element: <Navigate to="/" /> },
          { path: '*', element: <Navigate to="/404" /> },
          { path: '404', element: <NotFound /> }
        ])
  ];

  const routing = useRoutes([mainRoutes, { path: 'teste', element: <>Teste</> }, ...otherRoutes]);
  return <>{routing}</>;
}
