import React, { useContext } from 'react';
import { Outlet } from 'react-router';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../store/Auth/AuthState';

const Dashboard = (): any => {
  const { user } = useContext(AuthContext);
  console.log(user);
  return (
    <div>
      Dashboard - Bem vindo {user.nome}!<Link to="relatorio">Relatório</Link>
      <Outlet />
    </div>
  );
};

export default Dashboard;
