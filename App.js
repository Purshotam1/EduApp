import { YellowBox } from 'react-native';
import _ from 'lodash';

YellowBox.ignoreWarnings(['Setting a timer']);
YellowBox.ignoreWarnings(['Remote debugger']);
YellowBox.ignoreWarnings(["Can't perform a React state update"]);


import React, { Component } from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import Loading from './src/screens/Loading';
import Login from './src/screens/Login';
import SignUp from './src/screens/SignUp';
import Main from './src/screens/Main';
import Account from './src/screens/Account';
import Subject from './src/screens/Subject';
import Chapters from './src/screens/Chapters';
import Topics from './src/screens/Topics';
import Content from './src/screens/Content';
import Camera from './src/screens/Camera';
import Examples from './src/screens/Examples';

const AppNavigator = createStackNavigator(
  {
    Main,
    Login,
    SignUp,
    Loading,
    Account,
    Subject,
    Chapters,
    Topics,
    Content,
    Camera,
    Examples
  },
  {
    initialRouteName: 'Main'
  }
);

const AppContainer = createAppContainer(AppNavigator);

export default class App extends Component {
  render() {
    return <AppContainer />;
  }
}