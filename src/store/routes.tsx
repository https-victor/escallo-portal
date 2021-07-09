import { useContext } from 'react';
import { Route, Navigate, Routes, useRoutes } from 'react-router-dom';
import { AuthContext } from './Auth/AuthState';
import Footer from '../components/layout/Footer';
import Header from '../components/layout/Header';
import LoadingSpin from '../components/LoadingSpin';
import { Dashboard, LandingPage, Login, NotFound, Profile, Report, SignUp } from '../pages';
import Home from '../pages/Home/Home';

export default function MainRoutes(): any {
  const { user } = useContext(AuthContext);
  const { authenticated } = user;

  const mainRoutes = {
    path: '/',
    element: authenticated ? <Dashboard /> : <LandingPage />,
    children: authenticated && [
      { path: '/', element: <Home /> },
      { path: '*', element: <Navigate to="/404" /> },
      { path: '404', element: <NotFound /> },
      { path: 'relatorio/:id', element: <Report /> },
      { path: 'relatorio/lista', element: <Report /> },
      { path: 'perfil', element: <Profile /> },
      { path: 'relatorio', element: <Navigate to="/relatorio/lista" /> }
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
    ...(authenticated
      ? []
      : [
          { path: '*', element: <Navigate to="/404" /> },
          { path: '404', element: <NotFound /> }
        ])
  ];

  const routing = useRoutes([mainRoutes, ...otherRoutes]);
  return <>{routing}</>;
}
