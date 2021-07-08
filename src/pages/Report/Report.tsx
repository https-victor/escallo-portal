import { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../../store/Auth/AuthState';

const Report = (): any => {
  const { auth } = useContext(AuthContext);
  const { tokenConfig } = auth;
  const params = useParams();
  return (
    <div>
      <h1>Relatório {params.id}</h1>
    </div>
  );
};

export default Report;
