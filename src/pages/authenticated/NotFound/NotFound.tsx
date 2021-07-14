import { makeStyles, Paper } from '@material-ui/core';
import { useContext, useEffect } from 'react';
import { GlobalContext } from '../../../store/Global/GlobalState';

const NotFound = (): any => {
  const { setMenu } = useContext(GlobalContext);
  const classes = useStyles();
  useEffect(() => {
    setMenu('404');
  }, []);
  return <Paper className={classes.paper}>ERRO 404 - Não encontrado</Paper>;
};
const useStyles = makeStyles((theme: any) => ({
  paper: {
    margin: theme.spacing(3),
    padding: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column'
  }
}));
export default NotFound;
