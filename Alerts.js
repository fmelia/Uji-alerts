import React, { Component } from 'react';
import {
  ListView,
  StyleSheet,
  RefreshControl,
  Text,
  View,
  Image
} from 'react-native';

const REQUEST_URL = url

export default class Alerts extends Component {
  
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
    return this.renderList();
  }

  renderList(navigator) {
    if (!this.state.loaded) {
      return this.renderLoadingView();
    }

    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={(row) => this.renderRow(row)}
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

  renderRow(row) {
    return (
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{row[3]}</Text>
        <Text style={styles.subtitle}>{row[0]} / {row[1]}</Text>
      </View>
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
  }
});
