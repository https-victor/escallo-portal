import { makeStyles, Paper } from '@material-ui/core';
import { useContext, useEffect } from 'react';
import { AuthContext } from '../../../store/Auth/AuthState';
import { GlobalContext } from '../../../store/Global/GlobalState';

const Relatorios = (): any => {
  const classes = useStyles();
  const { setMenu } = useContext(GlobalContext);
  useEffect(() => {
    setMenu('relatorios');
  }, []);
  return <Paper className={classes.paper}>Relatório</Paper>;
};

const useStyles = makeStyles((theme: any) => ({
  paper: {
    margin: theme.spacing(3),
    padding: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column'
  }
}));

export default Relatorios;
