import React, {Component} from 'react';
import {View, Text} from 'react-native';
import {StyleSheet} from 'react-native';
import {StatusBar} from 'react-native';
import {Image} from 'react-native';
import {TextInput} from 'react-native';
import {TouchableOpacity} from 'react-native';
import {AsyncStorage} from '@react-native-async-storage/async-storage';
import {Button} from 'react-native';
import {componentDidMount} from '../../../api';

export default class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.inputBox}
          placeholder="UserID"
          placeholderTextColor="rgba(51,0,0,1)"
          value={this.state.username}
          onChangeText={(username) => this.setState({username})}
          autoCapitalize="none"
        />

        <TextInput
          style={styles.inputBox}
          placeholder="Password"
          secureTextEntry={true}
          placeholderTextColor="rgba(51,0,0,1)"
          value={this.state.password}
          onChangeText={(password) => this.setState({password})}
        />
        <TouchableOpacity>
          <Button
            style={styles.button}
            onPress={this._login}
            title="Login"></Button>
        </TouchableOpacity>
      </View>
    );
  }

  // You only need to define what will be added or updated

  // Console log result:
  // => {'name':'Chris','age':31,'traits':
  //    {'shoe_size':10,'hair':'brown','eyes':'blue'}}
  _login = async () => {
    componentDidMount(this.state.username, this.state.password).then((d) => {
      // let UID123_object = {
      //   name: 'Chris',
      //   age: 30,
      //   traits: {hair: 'brown', eyes: 'brown'},
      // };
      // let UID123_delta = {
      //   age: 31,
      //   traits: {eyes: 'blue', shoe_size: 10},
      // };

      // AsyncStorage.setItem('UID123', JSON.stringify(UID123_object), () => {
      //   AsyncStorage.mergeItem('UID123', JSON.stringify(UID123_delta), () => {
      //     AsyncStorage.getItem('UID123', (err, result) => {
      //       console.log(result);
      //     });
      //   });
      // });

      console.log(d);

      // await AsyncStorage.setItem('isLoggedin', '1');
      this.props.navigation.navigate('Home');
    });
  };
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputBox: {
    width: 300,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 25,
    paddingHorizontal: 16,
    fontSize: 16,
    color: 'black',
    marginVertical: 10,
    borderColor: '#ccc',
    borderWidth: 4,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#1b3039',
    borderRadius: 25,
    width: 300,
    marginVertical: 10,
    paddingVertical: 13,
  },
});
