import { useContext } from 'react';
import { Route, Navigate, Routes, useRoutes } from 'react-router-dom';
import { AuthContext } from './Auth/AuthState';
import Footer from '../components/layout/Footer';
import Header from '../components/layout/Header';
import LoadingSpin from '../components/LoadingSpin';
import { Clientes, Dashboard, LandingPage, Login, NotFound, Profile, Report, Revendedores, SignUp } from '../pages';
import Home from '../pages/Home/Home';

export default function MainRoutes(): any {
  const { user } = useContext(AuthContext);
  const { authenticated, loading } = user;

  const mainRoutes = {
    path: '/',
    element: authenticated ? <Dashboard /> : <LandingPage />,
    children: authenticated && [
      { path: '/', element: <Home /> },
      { path: '404', element: <NotFound /> },
      { path: 'administradores', element: <Home /> },
      { path: 'revendedores', element: <Revendedores /> },
      { path: 'clientes', element: <Clientes /> },
      { path: 'relatorio/:id', element: <Report /> },
      { path: 'relatorio/lista', element: <Report /> },
      { path: 'perfil', element: <Profile /> },
      { path: 'relatorio', element: <Navigate to="/relatorio/lista" /> },
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
