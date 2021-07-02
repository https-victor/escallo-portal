import { Button } from '@material-ui/core';
import { useNavigate } from 'react-router-dom';

export const Welcome = () => {
  const navigate = useNavigate();
  return (
    <div className="landing-page-container page-container">
      <div className="hero-image">
        <div className="hero-text-container">
          <div className="hero-text signup">
            <p>Pronto para começar sua nova aventura?</p>
            <h1>Role seus Dados!</h1>
          </div>
          <Button onClick={() => navigate('/signup')}>Criar conta grátis</Button>
        </div>
      </div>
      <div className="hero-image">
        <div className="hero-text info">
          <h2>Descubra o mundo mágico de interpretação!</h2>
          <p>
            <em className="strong">Metagame </em>é uma nova experiência em jogos de tabuleiro. Reúna seus amigos ou faça
            novos e comece uma nova campanha, é grátis!
          </p>
        </div>
      </div>
    </div>
  );
};
