import { useContext } from 'react';
import { Route, Navigate, Routes, useRoutes } from 'react-router-dom';
import { AuthContext } from './Auth/AuthState';
import Footer from '../components/layout/Footer';
import Header from '../components/layout/Header';
import LoadingSpin from '../components/LoadingSpin';
import {
  Administradores,
  Clientes,
  Configuracoes,
  Dashboard,
  LandingPage,
  Login,
  NotFound,
  Profile,
  Relatorio,
  Relatorios,
  Revendedores,
  SignUp
} from '../pages';
import Home from '../pages/authenticated/Home/Home';

export default function MainRoutes(): any {
  const { user } = useContext(AuthContext);
  const { authenticated, loading } = user;

  const mainRoutes = {
    path: '/',
    element: loading ? <>Carregando</> : authenticated ? <Dashboard /> : <LandingPage />,
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
      path: 'login',
      element: authenticated ? <Navigate to="/" /> : <Login />
    },
    {
      path: 'cadastro',
      element: authenticated ? <Navigate to="/" /> : <SignUp />
    },
    ...(authenticated || loading
      ? []
      : [
          { path: '*', element: <Navigate to="/404" /> },
          { path: '404', element: <NotFound /> }
        ])
  ];

  const routing = useRoutes([mainRoutes, ...otherRoutes]);
  return <>{routing}</>;
}
