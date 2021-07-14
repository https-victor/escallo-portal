import { GlobalContext } from '../../../store/Global/GlobalState';
import { useContext, useEffect } from 'react';
import { makeStyles, Paper } from '@material-ui/core';
const Administradores = (): any => {
  const { setMenu } = useContext(GlobalContext);
  const classes = useStyles();
  useEffect(() => {
    setMenu('administradores');
  }, []);
  return <Paper className={classes.paper}>Administradores</Paper>;
};
const useStyles = makeStyles((theme: any) => ({
  paper: {
    margin: theme.spacing(3),
    padding: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column'
  }
}));
export default Administradores;
