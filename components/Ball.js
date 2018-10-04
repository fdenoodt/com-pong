import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';


export default class Ball extends Component {

  constructor() {
    super();
    this.state = {
      left: 0,
      top: 0
    }
  }

  // timerTick() {
  //   let newTop = this.state.top + 0.1;
  //   let newLeft = this.state.left + 0.1;

  //   styles = StyleSheet.create({
  //     ball: {
  //       width: 44,
  //       height: 44,
  //       borderRadius: 44 / 2,
  //       backgroundColor: 'blue',
  //       top: newTop,
  //       left: newLeft,
  //     },
  //   });

  //   // this.setState({ left: newLeft });
  //   this.setState({ top: newTop });
  // }

  componentDidMount() {
    this._interval = setInterval(() => {
      this.setState({left: this.state.left+1});
      this.setState({top: this.state.top+1});
    }, 4);
  }

  // }

  // timer() {
  //   let test = setInterval(timerTick, 4);
  // }



  render() {
    return (
      <View style={{width: 44, height: 44, backgroundColor: 'red', borderRadius: 44 / 2, top: this.state.top, left: this.state.left}}>

      </View>
    )
  }
}



// let styles = StyleSheet.create({
//   ball: {
//     width: 44,
//     height: 44,
//     borderRadius: 44 / 2,
//     backgroundColor: 'blue',
//     // top: -200,
//     // left: 0,
//   },
// });