import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme: any) => ({
  list: {
    width: 250
  },
  fullList: {
    width: 'auto'
  },
  add: {
    margin: theme.spacing(3, 0, 2),
    borderRadius: 100,
    alignSelf: 'flex-end'
  }
}));

type Anchor = 'top' | 'left' | 'bottom' | 'right';

export default function ToggleDrawer({ children }: any): any {
  const classes = useStyles();
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false
  });

  const toggleDrawer = (anchor: Anchor, open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = (anchor: Anchor) => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === 'top' || anchor === 'bottom'
      })}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      {children}
    </div>
  );

  return (
    <div>
      <React.Fragment key="right">
        <Button
          className={classes.add}
          onClick={toggleDrawer('right', true)}
          type="submit"
          variant="contained"
          color="primary"
        >
          +
        </Button>
        <Drawer anchor="right" open={state['right']} onClose={toggleDrawer('right', false)}>
          {/* {list('right')} */}
          {children}
        </Drawer>
      </React.Fragment>
    </div>
  );
}
