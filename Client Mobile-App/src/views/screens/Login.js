import React, {Component} from 'react';
import {View, Text, Button} from 'react-native';
import {StyleSheet} from 'react-native';
import Logo from '../components/Logo';
import Form from '../components/Form';
// import {componentDidMount} from '../../../api';
const Login = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Logo />
      <Form type="Login" navigation={navigation} />
      <View style={styles.signup}>
        <Text style={styles.signuptest}>Don't have a Account? </Text>
        <Text
          style={styles.signupbutton}
          onPress={() => navigation.navigate('Signup2')}>
          Signup
        </Text>
      </View>
    </View>
  );
};
// componentDidMount().then((d) => console.log('Login Info=', d.password));
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  signup: {
    flexGrow: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingVertical: 16,
    flexDirection: 'row',
  },
  signuptest: {
    color: '#000000',
    fontSize: 16,
  },
  signupbutton: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '500',
  },
});
export default Login;
