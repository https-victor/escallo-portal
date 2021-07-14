import { GlobalContext } from '../../../store/Global/GlobalState';
import { useContext, useEffect } from 'react';
import { makeStyles, Paper } from '@material-ui/core';
const Configuracoes = (): any => {
  const { setMenu } = useContext(GlobalContext);
  const classes = useStyles();
  useEffect(() => {
    setMenu('configuracoes');
  }, []);
  return <Paper className={classes.paper}>Configuracoes</Paper>;
};
const useStyles = makeStyles((theme: any) => ({
  paper: {
    margin: theme.spacing(3),
    padding: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column'
  }
}));
export default Configuracoes;
