import React, {Component} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {StyleSheet} from 'react-native';
import Logo from '../components/Logo';
import Form from '../components/Form';
import {StatusBar} from 'react-native';
import {Image} from 'react-native';
import {TextInput} from 'react-native';
import {AsyncStorage} from '@react-native-async-storage/async-storage';
import {Button} from 'react-native';
import {componentDidMount} from '../../../api';

const Signup = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Logo />
      <View style={styles.container}>
        <TextInput
          style={styles.inputBox}
          placeholder="First"
          placeholderTextColor="rgba(51,0,0,1)"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.inputBox}
          placeholder="Middle"
          placeholderTextColor="rgba(51,0,0,1)"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.inputBox}
          placeholder="Last"
          placeholderTextColor="rgba(51,0,0,1)"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.inputBox}
          placeholder="Email"
          secureTextEntry={true}
          placeholderTextColor="rgba(51,0,0,1)"
        />
        <TextInput
          style={styles.inputBox}
          placeholder="Phone Number"
          secureTextEntry={true}
          placeholderTextColor="rgba(51,0,0,1)"
        />
        <TextInput
          style={styles.inputBox}
          placeholder="Department"
          secureTextEntry={true}
          placeholderTextColor="rgba(51,0,0,1)"
        />
        <TextInput
          style={styles.inputBox}
          placeholder="Password"
          secureTextEntry={true}
          placeholderTextColor="rgba(51,0,0,1)"
        />
        <TouchableOpacity>
          <Button
            onPress={() => {
              navigation.navigate('Login');
            }}
            style={styles.button}
            title="Create Account"></Button>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '',
  },
  signup: {
    flexGrow: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingVertical: 16,
    flexDirection: 'row',
  },
  signuptest: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 16,
  },
  signupbutton: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
  inputBox: {
    width: 300,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 25,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#ffffff',
    marginVertical: 10,
  },
  button: {
    backgroundColor: '#1b3039',
    borderRadius: 25,
    width: 300,
    marginVertical: 10,
    paddingVertical: 13,
  },
});
export default Signup;
