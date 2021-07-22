import { GlobalContext } from '../../../store/Global/GlobalState';
import { useContext, useEffect } from 'react';
import { makeStyles, Paper } from '@material-ui/core';
const Consultores = (): any => {
  const { setMenu } = useContext(GlobalContext);
  const classes = useStyles();
  useEffect(() => {
    setMenu('consultores');
  }, []);
  return <Paper className={classes.paper}>Consultores</Paper>;
};
const useStyles = makeStyles((theme: any) => ({
  paper: {
    margin: theme.spacing(3),
    padding: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column'
  }
}));
export default Consultores;
