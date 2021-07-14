import { makeStyles, Paper } from '@material-ui/core';
import { useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../../../store/Auth/AuthState';
import { GlobalContext } from '../../../store/Global/GlobalState';

const Relatorio = (): any => {
  const { auth } = useContext(AuthContext);
  const classes = useStyles();
  const { tokenConfig } = auth;
  const params = useParams();
  const { setTitle, setMenuIndex } = useContext(GlobalContext);
  useEffect(() => {
    setTitle(`Relatório ${params.id}`);
    function getRelatorioIndex() {
      switch (params.id) {
        case '081':
          setMenuIndex(5.1);
          break;
        case '087':
          setMenuIndex(5.2);
          break;
        default:
          break;
      }
    }
    getRelatorioIndex();
  }, [params.id]);
  return <Paper className={classes.paper}>Relatório {params.id}</Paper>;
};

const useStyles = makeStyles((theme: any) => ({
  paper: {
    margin: theme.spacing(3),
    padding: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column'
  }
}));

export default Relatorio;
