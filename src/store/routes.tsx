import { useContext } from 'react';
import { Route, Navigate, Routes, useRoutes } from 'react-router-dom';
import { AuthContext } from './Auth/AuthState';
import Footer from '../components/layout/Footer';
import Header from '../components/layout/Header';
import LoadingSpin from '../components/LoadingSpin';
import { Dashboard, LandingPage, Login, NotFound, Profile, Report, SignUp } from '../pages';
import Home from '../pages/Home/Home';

export const PrivateRoute = ({
  component: Component,
  redirectTo,
  path,
  alreadyLoggedIn,
  header = true,
  footer = false,
  children,
  ...props
}: any): any => {
  const { authenticated, loading } = useContext(AuthContext);

  if (loading) {
    return <LoadingSpin loading />;
  } else {
    if (alreadyLoggedIn ? Boolean(authenticated) : Boolean(!authenticated)) {
      console.log('teste');
      return <Navigate to={redirectTo} />;
    } else {
      return (
        <Route
          path={path}
          element={
            <>
              {header && <Header />}
              <Component {...props} />
              {footer && <Footer />}
            </>
          }
        >
          {children}
        </Route>
      );
    }
  }
};

const AuthenticatedRoutes = () => {
  const { authenticated } = useContext(AuthContext);
  if (authenticated) {
    return (
      <Route path="/" element={<Dashboard />}>
        <Route path="perfil/:userId" element={<Profile />} />
        <Route path="relatorio/:relatorioId" element={<Report />} />
      </Route>
    );
  } else {
    return <Route path="/" element={<LandingPage />} />;
  }
};

export default function MainRoutes(): any {
  const { loginEmail, authenticated, loading } = useContext(AuthContext);

  const mainRoutes = {
    path: '/',
    element: authenticated ? <Dashboard /> : <LandingPage />,
    children: [
      { path: '*', element: <Navigate to="/404" /> },
      { path: '404', element: <NotFound /> },

      ...(authenticated
        ? [
            { path: '/', element: <Home /> },
            { path: 'login', element: <Navigate to="/" /> },
            { path: 'cadastro', element: <Navigate to="/" /> },
            { path: 'relatorio/:id', element: <Report /> },
            { path: 'relatorio/lista', element: <Report /> },
            { path: 'perfil', element: <Profile /> },
            { path: 'relatorio', element: <Navigate to="/relatorio/lista" /> }
          ]
        : [
            { path: 'login', element: <Login /> },
            { path: 'cadastro', element: <SignUp /> }
          ])
    ]
  };

  const routing = useRoutes([mainRoutes]);
  return <>{routing}</>;
}
