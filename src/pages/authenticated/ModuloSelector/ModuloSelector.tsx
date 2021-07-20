import { Button, makeStyles, Paper } from '@material-ui/core';
import { useContext, useEffect } from 'react';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../../store/Auth/AuthState';
import { GlobalContext } from '../../../store/Global/GlobalState';

const ModuloSelector = ({ redirect }: any): any => {
  const { setMenu } = useContext(GlobalContext);
  const { user, onRedirect } = useContext(AuthContext);
  const navigate = useNavigate();
  const classes = useStyles();
  const location = useLocation();
  console.log(location.pathname);

  console.log(redirect);
  function onSelect() {
    if (redirect) {
      // url
      if (location.pathname === '/painel') {
        window.location.href = 'http://clinicadofuturo.vpn.ftec.us/escallo/atendimento/';
      } else {
        window.location.href = 'http://clinicadofuturo.vpn.ftec.us/escallo/admin/';
      }
    } else {
      // state
      onRedirect(true);
    }
  }
  return (
    <Paper className={classes.paper}>
      Select {location.pathname}
      <Button onClick={onSelect}>Selecionar</Button>
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

export default ModuloSelector;
