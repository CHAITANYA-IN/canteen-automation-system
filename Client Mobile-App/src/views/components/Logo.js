import React, {Component} from 'react';
import {View, Text} from 'react-native';
import {StyleSheet} from 'react-native';
import {StatusBar} from 'react-native';
import {Image} from 'react-native';

export default class Logo extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Image
          style={{width: 50, height: 60, marginTop: 45}}
          source={require('C:\\Users\\Amey Makarand\\OneDrive\\Desktop\\FoodAppUIReactNative\\src\\assets\\login.png')}
        />
        <Text style={styles.logotext}>Signin</Text>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logotext: {
    marginVertical: 15,
    fontSize: 18,
    color: 18,
    color: 'black',
  },
});
