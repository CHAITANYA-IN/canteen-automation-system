/*CREATE TABLE customer(
  customer_id INT AUTO_INCREMENT,
  first_name VARCHAR(50) NOT NULL,
  middle_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  password VARCHAR(100) NOT NULL,
  contact_no NUMERIC(10),
  mail_id VARCHAR(50) NOT NULL,
  dept_name ENUM('Computer','Electronic','Mechanical'),
  deluxe BOOLEAN,
  PRIMARY KEY(customer_id)
);
*/

'use strict';
import React, {Component} from 'react';
import {
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableHighlight,
  StyleSheet,
} from 'react-native';
import ValidationComponent from 'react-native-form-validator';
import {Dropdown} from 'react-native-material-dropdown-v2';

export default class Su2 extends ValidationComponent {
  constructor(props) {
    super(props);
    this.state = {
      fname: '',
      mname: '',
      lname: '',
      email: '',
      number: '',
      newPassword: '',
      confirmPassword: '',
      dept: '',
    };
  }

  _onSubmit() {
    // Call ValidationComponent validate method
    console.log('This.state=', this.state);
    this.validate({
      fname: {minlength: 2, maxlength: 50, required: true},
      mname: {minlength: 2, maxlength: 50, required: true},
      lname: {minlength: 2, maxlength: 50, required: true},
      email: {email: true, maxlength: 50, required: true},
      number: {
        minlength: 10,
        maxlength: 10,
      },
      newPassword: {
        hasSpecialCharacter: true,
        minlength: 7,
        maxlength: 15,
      },
      confirmPassword: {equalPassword: this.state.newPassword},
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
          <TextInput
            style={styles.inputBox}
            ref="fname"
            placeholder="First name"
            placeholderTextColor="black"
            onChangeText={(fname) => this.setState({fname})}
            value={this.state.fname}
          />
          <TextInput
            style={styles.inputBox}
            ref="mname"
            placeholder="Middle name"
            placeholderTextColor="black"
            onChangeText={(mname) => this.setState({mname})}
            value={this.state.mname}
          />
          <TextInput
            style={styles.inputBox}
            ref="lname"
            placeholder="Last name"
            placeholderTextColor="black"
            onChangeText={(lname) => this.setState({lname})}
            value={this.state.lname}
          />
          <TextInput
            style={styles.inputBox}
            ref="email"
            placeholder="Email"
            placeholderTextColor="black"
            onChangeText={(email) => this.setState({email})}
            value={this.state.email}
          />

          <TextInput
            style={styles.inputBox}
            ref="number"
            placeholder="Contact no"
            placeholderTextColor="black"
            onChangeText={(number) => this.setState({number})}
            value={this.state.number}
          />
          <TextInput
            style={styles.inputBox}
            ref="newPassword"
            placeholder="Enter Password"
            placeholderTextColor="black"
            onChangeText={(newPassword) => this.setState({newPassword})}
            value={this.state.newPassword}
            secureTextEntry={true}
          />
          <TextInput
            style={styles.inputBox}
            ref="confirmPassword"
            placeholder="Confirm Password"
            placeholderTextColor="black"
            onChangeText={(confirmPassword) => this.setState({confirmPassword})}
            value={this.state.confirmPassword}
            secureTextEntry={true}
          />
          {this.isFieldInError('confirmPassword') &&
            this.getErrorsInField('confirmPassword').map((errorMessage) => (
              <Text style={styles.signuptest}>{errorMessage}</Text>
            ))}
          {/* <Dropdown
            style={styles.inputBox}
            ref="dept"
            placeholder="Department"
            value={this.state.dept}
            placeholderTextColor="black"
            onChangeText={(dept) => this.setState({dept})}
            label="Department"
            data={[
              {
                value: 'Mechancial',
              },
              {
                value: 'Computer',
              },
              {
                value: 'Electronics',
              },
            ]}
          /> */}
          <TouchableHighlight
            style={styles.button}
            onPress={() => {
              this._onSubmit();
              console.log('Form bvalid=', this.isFormValid());
              console.log('This state=', this.state);
              if (this.isFormValid()) {
                fetch('http://10.0.2.2:3000/users', {
                  method: 'post',
                  headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    first: this.state.fname,
                    middle: this.state.mname,
                    last: this.state.lname,
                    mail: this.state.email,
                    phone: this.state.number,
                    password: this.state.newPassword,
                  }),
                })
                  .then(
                    (d) => {
                      d.json();
                    },
                    (err) => {
                      console.log(err);
                    },
                  )
                  .then(
                    (json) => {
                      {
                        console.log('Json=', json);
                        this.props.navigation.navigate('Login');
                      }
                    },
                    (err) => {
                      console.log(err);
                    },
                  );
              }
            }}>
            <Text style={styles.buttonText}>Signup</Text>
          </TouchableHighlight>

          <Text style={styles.signuptest}>{this.getErrorMessages()}</Text>
        </ScrollView>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
