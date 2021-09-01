import React from 'react';
import {render} from 'react-dom';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Button,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {componentuser} from './api';
import DetailsScreen from './src/views/screens/DetailsScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
var finame;
export var finame;
// const Profile = (navigation) => {
//   const [details, setDetails] = React.useState([]);
//   componentuser().then((d) => {
//     console.log('User Details=', d);
//     setDetails(d);
//   });
export default class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {details: []};
  }
  componentDidMount() {
    this._isMounted = true;
    AsyncStorage.getItem('cookie').then((retrieve) => {
      fetch('http://10.0.2.2:3000/users/details', {
        method: 'GET',
        headers: {
          Cookie: retrieve,
        },
      })
        .then(
          (items) => {
            console.log('Items=', items);
            return items.json();
          },
          (err) => {
            throw err;
          },
        )
        .then(
          (json) => {
            if (this._isMounted) {
              this.setState({
                details: json,
              });
              console.log('Details=', json.first_name);
              finame = json.first_name;
              console.log('customer_id' in json);
            }
          },
          (err) => {
            return Promise.resolve(err);
          },
        );
    });
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  render() {
    // const [navigation] = this.props;

    return (
      <View style={{flex: 1, backgroundColor: '#f6f6f6', alignItems: 'center'}}>
        <View
          style={{
            //   flexDirection: 'row',
            //   backgroundColor: '#fff',
            marginBottom: 10,
          }}>
          {/* <View style={[styles.centerElement, {width: 50, height: 50}]}> */}
          {/* <Ionicons name="ios-cart" size={25} color="#000" /> */}
          {/* </View> */}
          <View
            style={[styles.centerElement, {height: 50, flexDirection: 'row'}]}>
            <Icon name="account-circle" size={25} color="#000" />
            <Text style={{fontSize: 18, textAlign: 'center'}}> Profile</Text>
          </View>
          <View style={styles.container}>
            <ScrollView>
              {/* <TextInput
                style={styles.inputBox}
                //   ref="fname"
                label="Customer Id"
                value={this.state.details.customer_id.toString()}
                editable={false}
                placeholderTextColor="black"
                //   onChangeText={(fname) => this.setState({fname})}
                //   value={this.state.fname}
              /> */}
              <Text>Name</Text>
              <TextInput
                style={styles.inputBox}
                //   ref="fname"

                value={
                  this.state.details.first_name +
                  ' ' +
                  this.state.details.middle_name +
                  ' ' +
                  this.state.details.last_name
                }
                label="First Name"
                editable={false}
                placeholderTextColor="black"
                //   onChangeText={(fname) => this.setState({fname})}
                //   value={this.state.fname}
              />
              <Text>Email Id</Text>
              <TextInput
                style={styles.inputBox}
                label="Mail"
                //   ref="fname"
                value={this.state.details.mail_id}
                editable={false}
                placeholderTextColor="black"
                //   onChangeText={(fname) => this.setState({fname})}
                //   value={this.state.fname}
              />
              <Text>Password</Text>
              <TextInput
                style={styles.inputBox}
                label="Password"
                //   ref="fname"
                value={this.state.details.password}
                editable={false}
                placeholderTextColor="black"
                //   onChangeText={(fname) => this.setState({fname})}
                //   value={this.state.fname}
              />
              <Text>Contact No</Text>
              <TextInput
                style={styles.inputBox}
                label="Contact No"
                //   ref="fname"
                value={this.state.details.contact_no}
                editable={false}
                placeholderTextColor="black"
                //   onChangeText={(fname) => this.setState({fname})}
                //   value={this.state.fname}
              />
              <TouchableOpacity>
                <Button
                  style={styles.button}
                  onPress={() => {
                    AsyncStorage.getItem('cookie').then((retrieve) => {
                      fetch('http://10.0.2.2:3000/auth/logout', {
                        method: 'get',
                        headers: {
                          Accept: 'application/json',
                          cookie: retrieve,
                        },
                      }).then(
                        (signout) => {
                          console.log('Orders=', signout);
                          if (signout.status == 200) {
                            AsyncStorage.removeItem('cookie', (err) => {
                              console.log('Error=', err);
                              err == null
                                ? this.props.navigation.navigate('Login')
                                : console.log(err);
                            });
                          }
                        },
                        (err) => {
                          return Promise.resolve(err);
                        },
                      );
                    });
                  }}
                  title="Logout"></Button>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </View>
    );
  }
}
// componentuser().then((d) => {
//   console.log('User Details=', d);
// });
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputBox: {
    width: 300,
    alignSelf: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 25,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#000',
    marginVertical: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
    textAlign: 'center',
  },
  signuptest: {
    color: '#000000',
    fontSize: 16,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#1b3039',
    borderRadius: 25,
    width: 300,
    marginVertical: 10,
    paddingVertical: 13,
    alignSelf: 'center',
  },
});
