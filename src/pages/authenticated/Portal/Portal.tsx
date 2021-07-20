import { Button, makeStyles, Paper } from '@material-ui/core';
import { useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../../store/Auth/AuthState';
import { GlobalContext } from '../../../store/Global/GlobalState';

const Portal = (): any => {
  const { setMenu } = useContext(GlobalContext);
  const { user, onRedirect } = useContext(AuthContext);
  const navigate = useNavigate();
  const { data } = user;
  console.log(data.permissoes);
  const classes = useStyles();

  // Função para redirecionar o Super para o dashboard
  // ModuloSelector  linha 26 e 27

  return (
    <Paper className={classes.paper}>
      Portal {user.data.nome}
      <Button color="primary" onClick={() => navigate('/painel')}>
        Painel
      </Button>
      <Button color="primary" onClick={() => navigate('/escallo')}>
        Escallo
      </Button>
      <Button color="primary" onClick={() => navigate('/consultor')}>
        Consultor
      </Button>
      <Button color="primary" onClick={() => navigate('/revendedor')}>
        Revendedor
      </Button>
      {/* Botao SUPER */}
    </Paper>
  );
};

const useStyles = makeStyles((theme: any) => ({
  paper: {
    margin: theme.spacing(3),
    padding: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column'
  }
}));

export default Portal;
