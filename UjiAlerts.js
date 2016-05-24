import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Navigator,
  RefreshControl
} from 'react-native'

import Menu from './Menu';
import SideMenu from 'react-native-side-menu';
import Button from './BurguerButton.js';
import Alerts from './Alerts.js';

export default class UjiAlerts extends Component {
  state = {
    isOpen: false
  };

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }

  updateMenuState(isOpen) {
    this.setState({ isOpen, });
  }

  onMenuItemSelected(route) {
    this.setState({
      isOpen: false
    });

    _navigator.resetTo(this.routes[route]);
  }

  routes = {
    alerts: {name: 'alerts', title: 'Alerts'},
    other: {name: 'other', title: 'Other'},
  };

  navigationBarRouteMapper = self => {
  return {
    LeftButton: function(route, navigator, index, navState) {
      var backButton;
      
      if(index > 0) {
        backButton = <TouchableOpacity
          style={styles.leftNavButtonTouchable}
          underlayColor="transparent"
          onPress={() => { if (index > 0) { navigator.pop() } }}>
          <View>
            <View style={ styles.leftNavButtonImg }><Image source={require('./img/back-arrow.png')} /></View>
            <Text style={ styles.leftNavButtonText }>Back</Text>
          </View>  
        </TouchableOpacity>
      };

      return (
        <View style={styles.leftNavView}>
          <Button style={styles.burguerButton} onPress={() => self.toggle()} />
          <View>{backButton}</View>
        </View>    
      )
    },

    RightButton: function(route, navigator, index, navState) {
    },

    Title: function(route, navigator, index, navState) {
      return <Text style={ styles.barTitle }>{route.title}</Text>
    }
  }}

  render() {
    return (
      <Navigator
        initialRoute={this.routes.alerts}
        renderScene={ this.navigatorRenderScene.bind(this)} 
        navigationBar={
         <Navigator.NavigationBar 
          style={ styles.bar } 
          routeMapper={ this.navigationBarRouteMapper(this) } />
      }/>
    );
  }

  navigatorRenderScene(route, navigator) {
    _navigator = navigator;
    const menu = <Menu 
                    onItemSelected={this.onMenuItemSelected.bind(this)} />;
    var sideMenu = null;                

    switch (route.name) {
      case 'alerts':
        sideMenu = 
            <Alerts />
        break;    
      case 'other':
        sideMenu = 
            <Text style={styles.welcome}>
              {route.title}
            </Text>
        break;    
    }

    return <SideMenu
      menu={menu}
      isOpen={this.state.isOpen}
      onChange={(isOpen) => this.updateMenuState(isOpen)}>
      <View style={styles.container}>
        {sideMenu}
      </View>
    </SideMenu>
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },

  bar: {
    height: 40,
    backgroundColor: "#ccc"
  },
  burguerButton: {
    position: 'absolute',
    top: 0,
    padding: 5,
    height: 40,
    width: 60
  },
  barTitle: {
    marginTop: 24,
    fontSize: 16,
    position: 'absolute',
    left: 0,
    right: 75,
    textAlign: 'center'
  },
  leftNavView: {
    height: 40,
    width: 120
  },
  leftNavButtonTouchable: {
    flex: 1, 
    height: 40,
    width: 60,
    marginLeft: 45,  
  },
  leftNavButtonImg: {
    position: 'absolute', 
    top: 4, 
    bottom: 0, 
    left: 0, 
    right: 0
  },
  leftNavButtonText: {
    marginTop: 10,
    marginLeft: 24
  }
});
