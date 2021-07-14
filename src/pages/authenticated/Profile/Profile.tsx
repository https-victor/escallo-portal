import { makeStyles, Paper } from '@material-ui/core';
import { useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { GlobalContext } from '../../../store/Global/GlobalState';

const Profile = (): any => {
  const { setMenu } = useContext(GlobalContext);
  const classes = useStyles();
  useEffect(() => {
    setMenu('perfil');
  }, []);
  const { userId } = useParams();
  return <Paper className={classes.paper}>Meu Perfil</Paper>;
};
const useStyles = makeStyles((theme: any) => ({
  paper: {
    margin: theme.spacing(3),
    padding: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column'
  }
}));

export default Profile;
