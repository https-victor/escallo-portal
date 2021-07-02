import React, { useContext } from 'react';
import { Outlet } from 'react-router';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../store/Auth/AuthState';

const Dashboard: React.FC = () => {
  const { user } = useContext(AuthContext);
  return (
    <div>
      Dashboard - Bem vindo {user.name}!<Link to="report">Relatório</Link>
      <Outlet />
    </div>
  );
};

export default Dashboard;
