import { Link } from 'react-router-dom';

const LandingPage = (): any => {
  return (
    <div>
      <h1>Página inicial</h1>
      <Link to="/login">Login</Link>
      <Link to="/cadastro">Cadastrar-se</Link>
    </div>
  );
};

export default LandingPage;
