import React, { Component } from 'react';
import {
  AppRegistry,
  ListView,
  Navigator,
  StyleSheet,
  RefreshControl,
  Text,
  View,
  TouchableHighlight,
  BackAndroid,
  Platform,
  Image
} from 'react-native';

var REQUEST_URL = 'http://static.uji.es/js/prova.json';
var _navigator;

class UjiAlerts extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
        sectionHeaderHasChanged: (s1, s2) => s1 !== s2
      }),
      loaded: false,
      refreshing: false
    };
  }

  componentDidMount() { 
    this.fetchData();
  }

  _getSection(id) {
    if (id == 0+'_') return {title: 'Ok', color: '#2196F3'};
    if (id == 1+'_') return {title: 'Warning', color: 'darkOrange'};
    if (id == 2+'_') return {title: 'Critical', color: 'red'}
    return {title: 'Unknown', color: 'gold'}
  }

  _convertArrayToMap(response) {
    let categoryMap = {}; 
    
    categoryMap['2_'] = [];
    categoryMap['1_'] = [];
    categoryMap['3_'] = [];
    categoryMap['0_'] = [];

    response.forEach(item => {
      categoryMap[item[2]+'_'].push(item);
    });
    
    return categoryMap;
  }

  _onRefresh() {
    this.setState({refreshing: true});
    this.fetchData();
  }

  _navigate(navigator, prop){
    navigator.push({
      name: 'second',
      passProps : {
        title: prop
      }
    });
  }

  fetchData() {
    fetch(REQUEST_URL)
      .then((response) => response.json())
      .then((responseData) => {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRowsAndSections(this._convertArrayToMap(responseData)),
          loaded: true,
          refreshing: false
        });
      })
      .done();
  }

  render() {
    return (
      <Navigator
        initialRoute={{name: 'first'}}
        renderScene={this.navigatorRenderScene.bind(this)}
        navigationBar={
         <Navigator.NavigationBar 
         style={ styles.bar } 
         routeMapper={ NavigationBarRouteMapper } />
      }/>
    );
  }

  navigatorRenderScene(route, navigator) {
    _navigator = navigator;
    switch (route.name) {
      case 'first':
        return this.renderList(navigator);
      case 'second':
        return <View style={styles.container} >
                 <Text>
                   {route.passProps.title}
                 </Text>
               </View>
    }
  }

  renderList(navigator) {
    if (!this.state.loaded) {
      return this.renderLoadingView();
    }

    return (
      <ListView
        navigator={navigator}
        dataSource={this.state.dataSource}
        renderRow={(row) => this.renderRow(row, navigator)}
        renderSectionHeader={this.renderSectionHeader} 
        style={styles.listView} 
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh.bind(this)} />
        } />
    );
  }

  renderLoadingView() {
    return (
      <View 
        style={styles.container} >
        <Text>
          Updating...
        </Text>
      </View>
    );
  }

  renderRow(row, navigator) {
    return (
      <TouchableHighlight onPress={ () => this._navigate(navigator, row[3]) }>
        <View style={styles.infoContainer}>
          <Text style={styles.title}>{row[3]}</Text>
          <Text style={styles.subtitle}>{row[0]} / {row[1]}</Text>
        </View>
      </TouchableHighlight>  
    );
  }

  renderSectionHeader(sectionData, id) {
    let section ={title: 'Unknown', color: 'gold'};

    if (id == 0+'_') section = {title: 'Ok', color: '#2196F3'};
    if (id == 1+'_') section = {title: 'Warning', color: 'darkorange'};
    if (id == 2+'_') section = {title: 'Critical', color: 'red'}

    return (
      <View style={[styles.section, {backgroundColor: section.color}]}>
        <Text style={styles.sectionTitle}>{section.title}</Text>
      </View>  
    )
  }
}

var NavigationBarRouteMapper = {
  LeftButton(route, navigator, index, navState) {
    if(index > 0) {
      return (
        <TouchableHighlight
          underlayColor="transparent"
          onPress={() => { if (index > 0) { navigator.pop() } }}>
          <Image source={require('./img/back-arrow.png')} style={ styles.leftNavButtonText } />
        </TouchableHighlight>)
    } 
    else { return null }
  },

  RightButton(route, navigator, index, navState) {
  },

  Title(route, navigator, index, navState) {
    return <Text style={ styles.barTitle }>Uji Alerts</Text>
  }
};

BackAndroid.addEventListener('hardwareBackPress', () => {
  if (_navigator.getCurrentRoutes().length === 1  ) {
     return false;
  }
  _navigator.pop();
  return true;
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#F5FCFF',
    marginTop: 50,
    alignItems:'center'
  },
  listView :{
    marginTop: 40
  },
  infoContainer: {
    flex: 1
  },
  title: {
    fontSize: 16,
    color: 'black'
  },
  subtitle: {
    marginBottom: 12
  },
  sectionTitle: {
    color: 'white',
    fontSize: 16
  },
  section: {
    padding: 8
  },
  bar: {
    height: 40,
    backgroundColor: "#ccc"
  },
  barTitle: {
    marginTop: 24,
    fontSize: 16,
    position: 'absolute',
    left: 0,
    right: 75,
    textAlign: 'center'
  },
  leftNavButtonText: {
    marginTop: 4,
    marginLeft: 10
  }
});

AppRegistry.registerComponent('UjiAlerts', () => UjiAlerts);
