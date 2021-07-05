import { useContext } from 'react';
import { Route, Navigate, Routes } from 'react-router-dom';
import { AuthContext } from './Auth/AuthState';
import Footer from '../components/layout/Footer';
import Header from '../components/layout/Header';
import LoadingSpin from '../components/LoadingSpin';
import { Dashboard, LandingPage, Login, NotFound, Profile, Report, SignUp } from '../pages/';

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
  const { loginEmail } = useContext(AuthContext);
  return (
    <Routes>
      <AuthenticatedRoutes />
      <PrivateRoute alreadyLoggedIn path="login" redirectTo="/" component={Login} />
      <PrivateRoute alreadyLoggedIn path="cadastro" redirectTo="/" component={SignUp} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
