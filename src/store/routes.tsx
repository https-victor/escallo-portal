import { useContext } from 'react';
import { Navigate, useLocation, useNavigate, useRoutes } from 'react-router-dom';
import { AuthContext } from './Auth/AuthState';
import {
  Administradores,
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

export default function MainRoutes(): any {
  const { user, redirected } = useContext(AuthContext);
  const { authenticated, loading } = user;
  console.log(authenticated, loading, redirected);
  const location = useLocation();
  console.log(location.pathname);
  const mainRoutes = {
    path: '/',
    element: loading ? <>Carregando</> : authenticated ? redirected ? <Dashboard /> : <Portal /> : <LandingPage />,
    children: authenticated && [
      { path: '/', element: <Home /> },
      { path: '404', element: <NotFound /> },
      { path: 'revendedores', element: <Revendedores /> },
      { path: 'clientes', element: <Clientes /> },
      { path: 'configuracoes', element: <Configuracoes /> },
      { path: 'administradores', element: <Administradores /> },
      { path: 'relatorio/:id', element: <Relatorio /> },
      { path: 'relatorios', element: <Relatorios /> },
      { path: 'perfil', element: <Profile /> },
      { path: 'relatorio', element: <Navigate to="/relatorios" /> },
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
    ...(authenticated && !redirected
      ? [
          { path: 'painel', element: <ModuloSelector redirect /> },
          { path: 'escallo', element: <ModuloSelector redirect /> },
          { path: 'consultor', element: <ModuloSelector /> },
          { path: 'revendedor', element: <ModuloSelector /> }
        ]
      : [
          { path: 'painel', element: <Navigate to="/login" /> },
          { path: 'escallo', element: <Navigate to="/login" /> },
          { path: 'consultor', element: <Navigate to="/login" /> },
          { path: 'revendedor', element: <Navigate to="/login" /> }
        ]),
    ...(authenticated || loading
      ? []
      : [
          { path: '*', element: <Navigate to="/404" /> },
          { path: '404', element: <NotFound /> }
        ])
  ];

  const routing = useRoutes([mainRoutes, { path: 'teste', element: <>Teste</> }, ...otherRoutes]);
  return <>{routing}</>;
}
