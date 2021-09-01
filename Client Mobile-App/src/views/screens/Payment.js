import React, {Component} from 'react';
import {
  Button,
  StyleSheet,
  View,
  NativeModules,
  NativeEventEmitter,
} from 'react-native';
import RazorpayCheckout from 'react-native-razorpay';
import {yes} from './CartScreen';
const Payment = ({route, navigation}) => {
  console.log('Pirce=', route.params.price);
  //export default class ButtonBasics extends Component {
  function _onPressButton() {
    var options = {
      description: 'Credits towards consultation',
      image: 'https://i.imgur.com/3g7nmJC.png',
      currency: 'INR',
      key: 'rzp_test_XJUL9Ghveo83x5',
      amount: route.params.price,
      name: 'foo',
      prefill: {
        email: 'void@razorpay.com',
        contact: '9191919191',
        name: 'Razorpay Software',
      },
      theme: {color: '#F37254'},
    };
    RazorpayCheckout.open(options)
      .then((data) => {
        let i;
        // handle success
        alert(`Payment Successful`);
        console.log('Data=', data);
        navigation.navigate('Home');
        // ?for (i = 0; i < cart.length; i++) {
        //  ? cart.pop();
        // }
        // setcart([]);
        // alert('Succes12');
      })
      .catch((error) => {
        // handle failure
        alert('Payment Failed');
        navigation.navigate('Home');
      });
  }

  //render() {
  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button onPress={_onPressButton} title="Proceed to Payment" />
      </View>
    </View>
  );
  //}
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  buttonContainer: {
    margin: 20,
  },
  alternativeLayoutButtonContainer: {
    margin: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default Payment;
