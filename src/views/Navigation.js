import React, { Component } from 'react';
import { Link, Redirect, Switch } from 'react-router-dom';

import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import HomeIcon from '@material-ui/icons/Home';
import SettingsIcon from '@material-ui/icons/Settings';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import { AccountHeart, Logout } from 'mdi-material-ui';

import * as routes from '../constants/routes';
import { auth } from '../firebase';
import AuthUserContext from '../components/AuthUserContext';

import './Navigation.css';

class NavigationAuth extends Component {
  constructor(props) {
    super(props);

    this.state = {
      right: false,
      redirectToDashboard: false,
      redirectToSettings: false,
    };

    this.handleOnClickSettings = this.handleOnClickSettings.bind(this);
    this.handleOnClickDashboard = this.handleOnClickDashboard.bind(this);
    this.renderRedirect = this.renderRedirect.bind(this);
  }

  toggleDrawer = (side, open) => () => {
    this.setState({
      [side]: open,
    });
  };

  handleOnClickSettings() {
    this.setState({
      redirectToSettings: true,
      redirectToDashboard: false,
    });
  }

  handleOnClickDashboard() {
    this.setState({
      redirectToSettings: false,
      redirectToDashboard: true,
    });
  }

  renderRedirect() {
    if (this.state.redirectToSettings) {
      return <Switch><Redirect to="/settings" /></Switch>;
    }

    if (this.state.redirectToDashboard) {
      return <Switch><Redirect to="/" /></Switch>;
    }

    return false;
  }

  render() {
    return (
      <AppBar
        position="static"
        className="navigationContainer"
      >
        <Toolbar>
          {/* <Typography variant="title" color="inherit">
            Dashboard
          </Typography> */}
          <IconButton
            aria-label="Menu"
            onClick={this.toggleDrawer('right', true)}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
        <Drawer
          open={this.state.right}
          onClose={this.toggleDrawer('right', false)}
          anchor="right"
        >
          <div
            className="drawer"
            tabIndex={0}
            role="button"
            onClick={this.toggleDrawer('right', false)}
            onKeyDown={this.toggleDrawer('right', false)}
          >
            <List component="nav">
              <ListItem button onClick={this.handleOnClickDashboard}>
                <ListItemText
                  primary="Dashboard"
                />
                <ListItemIcon>
                  <HomeIcon />
                </ListItemIcon>
              </ListItem>
              <ListItem button>
                <ListItemText
                  primary="Loved Ones"
                />
                <ListItemIcon>
                  <AccountHeart />
                </ListItemIcon>
              </ListItem>
            </List>
            <Divider />
            <List component="nav">
              <ListItem
                button
                onClick={this.handleOnClickSettings}
              >
                <ListItemText
                  primary="Settings"
                />
                <ListItemIcon>
                  <SettingsIcon />
                </ListItemIcon>
              </ListItem>
              <ListItem button onClick={() => auth.doSignOut()}>
                <ListItemText
                  primary="Sign Out"
                />
                <ListItemIcon>
                  <Logout />
                </ListItemIcon>
              </ListItem>
            </List>
          </div>
        </Drawer>
        {this.renderRedirect()}
      </AppBar>
    );
  }
}

const Navigation = () => (
  <AuthUserContext.Consumer>
    {authUser => (authUser ? <NavigationAuth /> : null)}
  </AuthUserContext.Consumer>
);

export default Navigation;
