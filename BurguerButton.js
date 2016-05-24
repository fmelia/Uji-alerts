import React, { Component } from 'react';
import {
  Image,
  TouchableOpacity
} from 'react-native'

export default class Button extends Component {

  handlePress(e) {
    if (this.props.onPress) {
      this.props.onPress(e);
    }
  }

  render() {
    return (
      <TouchableOpacity
        onPress={this.handlePress.bind(this)}
        style={this.props.style}>
        <Image 
        	style={{width: 32, height: 32}}
        	source={require('./img/burguer-menu.png')} />
      </TouchableOpacity>
    );
  }
}