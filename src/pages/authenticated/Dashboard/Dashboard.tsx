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
  Menu,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
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
  Group as GroupIcon,
  Store as StoreIcon,
  Security as SecurityIcon,
  SpeakerNotes as SpeakerNotesIcon,
  Settings as SettingsIcon
} from '@material-ui/icons';
import clsx from 'clsx';
import { useContext, useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router';
import { useSwitch } from '../../../hooks/generics/useSwitch';
import { AuthContext } from '../../../store/Auth/AuthState';
import { GlobalContext } from '../../../store/Global/GlobalState';

const Dashboard = (): any => {
  const { auth, onRedirect, redirected, user } = useContext(AuthContext);
  const { title, menuIndex, apiConfig } = useContext(GlobalContext);
  const { logoff } = auth;
  const navigate = useNavigate();
  const classes = useStyles();
  console.log('requisição', apiConfig);

  const [expandRelatorios, setExpandRelatorios] = useState(false);

  const menuDrawer = useSwitch();
  const relatoriosCollapse = useSwitch();

  const handleRelatoriosCollapse = () => {
    if (relatoriosCollapse.state) {
      navigate('/relatorios');
    }
    menuDrawer.onSwitch(true);
    relatoriosCollapse.onSwitch();
  };
  const handleDrawerOpen = () => {
    menuDrawer.onSwitch(true);
  };
  const handleDrawerClose = () => {
    menuDrawer.onSwitch(false);
  };

  const [exitDialog, setExitDialog] = useState(false);

  const handleExitDialogClickOpen = () => {
    setExitDialog(true);
  };

  const handleExitDialogClose = () => {
    setExitDialog(false);
    setProfileMenu(null);
  };

  const [profileMenu, setProfileMenu] = useState(null);
  const [configMenu, setConfigMenu] = useState(null);

  const handleProfileMenuClick = (event: any) => {
    setProfileMenu(event.currentTarget);
  };

  const handleConfigMenuClick = (event: any) => {
    setConfigMenu(event.currentTarget);
  };

  const handleConfigMenuClose =
    (goTo = '') =>
    () => {
      if (goTo) {
        navigate(goTo);
      }
      setConfigMenu(null);
    };

  const handleProfileMenuClose =
    (goTo = '') =>
    () => {
      if (goTo) {
        navigate(goTo);
      }
      setProfileMenu(null);
    };

  const openRelatorio = (relatorio: string, relatorioIndex: any) => () => {
    if (relatorioIndex === menuIndex) {
      menuDrawer.onSwitch();
    } else {
      navigate(`/relatorio/${relatorio}`);
    }
  };

  const goTo = (path = '/') => {
    navigate(path);
  };

  function openMenuOption(index: any) {
    return () => {
      switch (index) {
        case 1:
          if (menuIndex === index) {
            menuDrawer.onSwitch();
          } else {
            goTo('/');
          }
          break;
        case 2:
          if (menuIndex === index) {
            menuDrawer.onSwitch();
          } else {
            goTo('administradores');
          }
          break;
        case 3:
          if (menuIndex === index) {
            menuDrawer.onSwitch();
          } else {
            goTo('revendedores');
          }
          break;
        case 4:
          if (menuIndex === index) {
            menuDrawer.onSwitch();
          } else {
            goTo('clientes');
          }
          break;
        default:
          break;
      }
    };
  }

  const openRelatorios = () => {
    if (expandRelatorios) {
      navigate('/relatorios');
    }
    menuDrawer.onSwitch(true);
    setExpandRelatorios((prevState: any) => !prevState);
  };

  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={clsx(classes.appBar, menuDrawer.state && classes.appBarShift)}>
        <Toolbar className={classes.toolbar}>
          {redirected ? (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              className={clsx(classes.menuButton, menuDrawer.state && classes.menuButtonHidden)}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            <IconButton
              color="inherit"
              onClick={() => {
                navigate('/');
              }}
            >
              <ChevronLeftIcon />
            </IconButton>
          )}
          <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
            {title}
          </Typography>
          <IconButton color="inherit">
            <Badge badgeContent={4} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <IconButton onClick={handleConfigMenuClick} color="inherit">
            <SettingsIcon />
          </IconButton>
          <Menu
            id="simple-menu"
            anchorEl={configMenu}
            getContentAnchorEl={null}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right'
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center'
            }}
            keepMounted
            open={Boolean(configMenu)}
            onClose={handleConfigMenuClose()}
          >
            <MenuItem>Modo escuro</MenuItem>
            <MenuItem onClick={handleConfigMenuClose('configuracoes')}>Configurações</MenuItem>
          </Menu>
          <Divider className={classes.divider} orientation="vertical" flexItem />
          <Typography className={classes.toolbarSubtitle} variant="subtitle2">
            {user.data.nome}
          </Typography>
          <IconButton onClick={handleProfileMenuClick} color="inherit">
            <AccountCircleIcon />
          </IconButton>
          <Menu
            id="simple-menu"
            anchorEl={profileMenu}
            getContentAnchorEl={null}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right'
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center'
            }}
            keepMounted
            open={Boolean(profileMenu)}
            onClose={handleProfileMenuClose()}
          >
            {redirected && <MenuItem onClick={handleProfileMenuClose('perfil')}>Perfil</MenuItem>}
            {redirected && (
              <MenuItem
                onClick={() => {
                  setProfileMenu(null);
                  menuDrawer.onSwitch(false);
                  onRedirect(false);
                }}
              >
                Escolher módulos
              </MenuItem>
            )}
            <MenuItem onClick={handleExitDialogClickOpen}>Sair</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      {redirected && (
        <Drawer
          variant="permanent"
          classes={{
            paper: clsx(classes.drawerPaper, !menuDrawer.state && classes.drawerPaperClose)
          }}
          open={menuDrawer.state}
        >
          <div className={clsx(classes.toolbarHeader, !menuDrawer.state && classes.toolbarHeaderHidden)}>
            <div className={clsx(classes.toolbarTitle)}>
              <Typography className={classes.toolbarSubtitle} variant="h6">
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
            <ListItem button onClick={openMenuOption(1)}>
              <ListItemIcon>
                <DashboardIcon color={menuIndex === 1 ? 'secondary' : undefined} />
              </ListItemIcon>
              <ListItemText primary="Início" />
            </ListItem>
            <ListItem button onClick={openMenuOption(2)}>
              <ListItemIcon>
                <SecurityIcon color={menuIndex === 2 ? 'secondary' : undefined} />
              </ListItemIcon>
              <ListItemText primary="Administradores" />
            </ListItem>
            <ListItem button onClick={openMenuOption(3)}>
              <ListItemIcon>
                <StoreIcon color={menuIndex === 3 ? 'secondary' : undefined} />
              </ListItemIcon>
              <ListItemText primary="Revendedores" />
            </ListItem>
            <ListItem button onClick={openMenuOption(4)}>
              <ListItemIcon>
                <GroupIcon color={menuIndex === 4 ? 'secondary' : undefined} />
              </ListItemIcon>
              <ListItemText primary="Clientes" />
            </ListItem>
            <ListItem button onClick={openRelatorios}>
              <ListItemIcon>
                <BarChartIcon color={Math.floor(menuIndex) === 5 ? 'secondary' : undefined} />
              </ListItemIcon>
              <ListItemText primary="Relatórios" />
              {expandRelatorios ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </ListItem>
            <Collapse in={expandRelatorios} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem button className={classes.nested} onClick={openRelatorio('081', 5.1)}>
                  <ListItemIcon>
                    <QuestionAnswerIcon fontSize="small" color={menuIndex === 5.1 ? 'secondary' : undefined} />
                  </ListItemIcon>
                  <ListItemText primary="081" secondary={menuDrawer.state && 'Atendimentos via chat'} />
                </ListItem>
                <ListItem button className={classes.nested} onClick={openRelatorio('087', 5.2)}>
                  <ListItemIcon>
                    <SpeakerNotesIcon fontSize="small" color={menuIndex === 5.2 ? 'secondary' : undefined} />
                  </ListItemIcon>
                  <ListItemText primary="087" secondary={menuDrawer.state && 'Contatos via chat'} />
                </ListItem>
              </List>
            </Collapse>
          </List>
        </Drawer>
      )}
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Outlet />
      </main>
      <Dialog
        open={exitDialog}
        onClose={handleExitDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Encerrar sessão'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Tem certeza que deseja encerrar sua sessão?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleExitDialogClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={logoff} color="primary" autoFocus>
            Sair
          </Button>
        </DialogActions>
      </Dialog>
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
  list: {
    '& .MuiTypography-root': {
      whiteSpace: 'normal'
    }
  },
  nested: {
    paddingLeft: theme.spacing(4)
  },
  divider: {
    margin: theme.spacing(1)
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
