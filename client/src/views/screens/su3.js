import React, {Component} from 'react';
import {View, Button} from 'react-native';

import TextField from './textfield';
import validation from './validation';
import validate from './validation_wrapper';

export default class su3 extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: 'a@gmail.com',
      emailError: '',
      password: 'hello',
      passwordError: '',
    };
  }

  register() {
    const emailError = validate('email', this.state.email);
    const passwordError = validate('password', this.state.password);

    this.setState({
      emailError: emailError,
      passwordError: passwordError,
    });

    if (!emailError && !passwordError) {
      alert('Details are valid!');
    }
  }

  render() {
    return (
      <View>
        <TextField
          onChangeText={(value) => this.setState({email: value.trim()})}
          onBlur={() => {
            this.setState({
              emailError: validate('email', this.state.email),
            });
          }}
          error={this.state.emailError}
        />

        <TextField
          onChangeText={(value) => this.setState({password: value.trim()})}
          onBlur={() => {
            this.setState({
              passwordError: validate('password', this.state.password),
            });
          }}
          error={this.state.passwordError}
          secureTextEntry={true}
        />

        <Button title="Register" onPress={this.validateRegister} />
      </View>
    );
  }
}
