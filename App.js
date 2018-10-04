import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import Canvas from 'react-native-canvas';
import Ball from './components/Ball';
// require('https://cdn.socket.io/socket.io-1.4.5.js');


const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

// type Props = {};
export default class App extends Component {
  constructor() {
    super();
    this.state = {
      h: 8
    }
  }

  handleCanvas = (canvas) => {
    // const h = canvas.height;
    canvas.height = 100;
    const ctx = canvas.getContext('2d');
    // ctx.width = 400;
    // ctx.height = 400;
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, 400, 400);
    
    this.setState({h: canvas.height})

  }

  componentDidMount() {
  }


  render() {
    return (
      <View style={styles.container}>
        {/* <Text style={styles.welcome}>Wel to React Native!</Text>
        <Text style={styles.instructions}>Yesssss</Text>
        <Text style={styles.instructions}>{instructions}</Text>
         */}
        {/* <Canvas ref={this.handleCanvas} width="400" height="400" />
        <Text style={styles.welcome}>{this.state.h}</Text> */}
        <Ball/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'red',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
