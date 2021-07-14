import { GlobalContext } from '../../../store/Global/GlobalState';
import { useContext, useEffect } from 'react';
import { makeStyles, Paper } from '@material-ui/core';
const Home = (): any => {
  const { setMenu } = useContext(GlobalContext);
  const classes = useStyles();
  useEffect(() => {
    setMenu('inicio');
  }, []);
  return <Paper className={classes.paper}>Início</Paper>;
};
const useStyles = makeStyles((theme: any) => ({
  paper: {
    margin: theme.spacing(3),
    padding: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column'
  }
}));
export default Home;
