import { useContext } from 'react';
import { Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Profile from '../pages/Profile';
import { AuthContext } from './Auth/AuthState';
import Footer from '../components/layout/Footer';
import Header from '../components/layout/Header';
import LoadingSpin from '../components/LoadingSpin';
import LandingPage from '../pages/LandingPage';
import Report from '../pages/Report';

export const PrivateRoute = ({
  component: Component,
  redirectTo,
  path,
  loggedIn,
  header = true,
  footer = false,
  children,
  ...props
}: any): any => {
  const { authenticated, loading } = useContext(AuthContext);

  if (loading) {
    return <LoadingSpin loading />;
  } else {
    if (loggedIn ? Boolean(authenticated) : Boolean(!authenticated)) {
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

export default function MainRoutes() {
  return (
    <>
      <Route path="/*" element={<LandingPage />} />
      <PrivateRoute path="/login" redirectTo="/" component={Login} loggedIn />
      <PrivateRoute path="/" redirectTo="/login" component={Dashboard}>
        <Route path="profile/:userId" element={<Profile />} />
        <Route path="report" element={<Report />} />
      </PrivateRoute>
    </>
  );
}
