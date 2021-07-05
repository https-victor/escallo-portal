import { useContext } from 'react';
import { AuthContext } from '../../store/Auth/AuthState';

const Report = (): any => {
  const { tokenConfig } = useContext(AuthContext);
  return (
    <div>
      <h1>Report</h1>
    </div>
  );
};

export default Report;
