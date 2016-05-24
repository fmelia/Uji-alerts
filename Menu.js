import React, { Component } from 'react';
import {
  Dimensions,
  StyleSheet,
  ScrollView,
  View,
  Image,
  Text
} from 'react-native';

const window = Dimensions.get('window');

export default class Menu extends Component {
  static propTypes = {
    onItemSelected: React.PropTypes.func.isRequired,
  };

  render() {
    return (
      <ScrollView scrollsToTop={false} style={styles.menu}>
        <Text
          onPress={() => this.props.onItemSelected('alerts')}
          style={styles.item}>
          Alerts
        </Text>

        <Text
          onPress={() => this.props.onItemSelected('other')}
          style={styles.item}>
          Other
        </Text>
      </ScrollView>
    );
  }
};

const styles = StyleSheet.create({
  menu: {
    flex: 1,
    width: window.width,
    height: window.height,
    backgroundColor: '#696969',
    padding: 20,
    marginTop: 40
  },
  avatarContainer: {
    marginBottom: 20,
    marginTop: 20,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    flex: 1,
  },
  name: {
    position: 'absolute',
    left: 70,
    top: 20,
  },
  item: {
    fontSize: 22,
    fontWeight: '300',
    paddingTop: 5,
    color: 'white'
  },
});
