import { Button, makeStyles } from '@material-ui/core';
import { Link, useNavigate } from 'react-router-dom';

const LandingPage = (): any => {
  const classes = useStyles();
  const navigate = useNavigate();
  return (
    <div>
      <h1>Página inicial</h1>
      <Button
        fullWidth
        className={classes.submit}
        color="primary"
        variant="contained"
        onClick={() => navigate('/login')}
      >
        Entrar
      </Button>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

export default LandingPage;
