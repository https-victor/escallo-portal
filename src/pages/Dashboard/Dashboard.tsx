import {
  AppBar,
  IconButton,
  makeStyles,
  Toolbar,
  Typography,
  Badge,
  Drawer,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  Container,
  Grid
} from '@material-ui/core';
import {
  Notifications as NotificationsIcon,
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Dashboard as DashboardIcon,
  BarChart as BarChartIcon,
  AccountCircle as AccountCircleIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  QuestionAnswer as QuestionAnswerIcon,
  PeopleAlt as PeopleAltIcon
} from '@material-ui/icons';
import clsx from 'clsx';
import React, { useContext } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../store/Auth/AuthState';

const Dashboard = (): any => {
  const { user, auth } = useContext(AuthContext);
  const { data } = user;
  const { logoff } = auth;
  const navigate = useNavigate();
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [expandRelatorios, setExpandRelatorios] = React.useState(false);
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const openRelatorio = (relatorio: string) => () => {
    navigate(`/relatorio/${relatorio}`);
  };

  const goToHome = () => {
    navigate('/');
  };

  const openRelatorios = () => {
    handleDrawerOpen();
    setExpandRelatorios((prevState: any) => !prevState);
  };
  const handleDrawerClose = () => {
    setOpen(false);
    setExpandRelatorios(false);
  };

  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={clsx(classes.appBar, open && classes.appBarShift)}>
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
          >
            <MenuIcon />
          </IconButton>
          <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
            Início
          </Typography>
          <IconButton color="inherit">
            <Badge badgeContent={4} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <IconButton onClick={logoff} color="inherit">
            <AccountCircleIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose)
        }}
        open={open}
      >
        <div className={clsx(classes.toolbarHeader, !open && classes.toolbarHeaderHidden)}>
          <div className={clsx(classes.toolbarTitle)}>
            <Typography className={classes.toolbarSubtitle} variant="subtitle2">
              Cartão de Todos
            </Typography>
            <Typography className={classes.toolbarSubtitle} variant="subtitle2">
              Vale do aço
            </Typography>
          </div>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List className={classes.list}>
          <ListItem button onClick={goToHome}>
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Início" />
          </ListItem>
          <ListItem button onClick={goToHome}>
            <ListItemIcon>
              <QuestionAnswerIcon />
            </ListItemIcon>
            <ListItemText primary="Usuários" />
          </ListItem>
          <ListItem button onClick={openRelatorios}>
            <ListItemIcon>
              <BarChartIcon />
            </ListItemIcon>
            <ListItemText primary="Relatórios" />
            {expandRelatorios ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </ListItem>
          <Collapse in={expandRelatorios} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem button className={classes.nested} onClick={openRelatorio('rel081')}>
                <ListItemIcon>
                  <QuestionAnswerIcon />
                </ListItemIcon>
                <ListItemText primary="REL081" secondary="Atendimentos via chat" />
              </ListItem>
              <ListItem button className={classes.nested} onClick={openRelatorio('rel087')}>
                <ListItemIcon>
                  <QuestionAnswerIcon />
                </ListItemIcon>
                <ListItemText primary="REL087" secondary="Contatos via chat" />
              </ListItem>
            </List>
          </Collapse>
        </List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Outlet />
        </Container>
      </main>
    </div>
  );
};

const drawerWidth = 248;

const useStyles = makeStyles((theme: any) => ({
  root: {
    display: 'flex',
    height: '100vh'
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto'
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4)
  },
  list: {
    '& .MuiTypography-root': {
      whiteSpace: 'normal'
    }
  },
  nested: {
    paddingLeft: theme.spacing(4)
  },
  menuButton: {
    marginRight: 36
  },
  menuButtonHidden: {
    display: 'none'
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  toolbar: {
    paddingRight: 12
  },
  toolbarSubtitle: {},
  toolbarTitle: {},
  toolbarHeader: {
    // whiteSpace: 'normal',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    maxHeight: theme.spacing(8),
    padding: '0 8px',
    ...theme.mixins.toolbar
  },
  toolbarHeaderHidden: {
    '& >*': {
      display: 'none'
    }
  },
  title: {
    flexGrow: 1
  },
  drawerPaper: {
    marginLeft: 8,
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth - 8,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9)
    }
  }
}));

export default Dashboard;
