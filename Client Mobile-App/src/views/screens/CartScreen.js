import React from 'react';
import {
  StyleSheet,
  Button,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  TextInput,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import PrimaryButton from '../components/Button';
import foods from '../../consts/foods';
import {componentDidMount, componentfetch} from '../../../api';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import cart from '../../consts/Cart';
cart = [];
export var cart;
export default class Cart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectAll: false,
      cartItemsIsLoading: false,
      cartItems: cart,
    };
  }
  deleteHandler = (index) => {
    Alert.alert(
      'Are you sure you want to delete this item from your cart?',
      '',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            let updatedCart = this.state.cartItems; /* Clone it first */
            // let updatedCart = this.state.cart;
            updatedCart.splice(
              index,
              1,
            ); /* Remove item from the cloned cart state */
            cart = updatedCart;
            this.setState(updatedCart); /* Update the state */
          },
        },
      ],
      {cancelable: false},
    );
  };

  quantityHandler = (action, index) => {
    const newItems = [...this.state.cartItems]; // clone the array
    // const newItems = [this.state.cart];
    let currentQty = newItems[index]['quantity'];

    if (action == 'more') {
      newItems[index]['quantity'] = currentQty + 1;
    } else if (action == 'less') {
      newItems[index]['quantity'] = currentQty > 1 ? currentQty - 1 : 1;
    }

    cart = newItems;
    this.setState({cartItems: newItems}); // set new state
    // this.setState({cartItems: cart});
  };

  subtotalPrice = () => {
    const {cartItems} = this.state;
    if (cartItems) {
      return cartItems.reduce(
        (sum, item) => sum /*(item.checked ==1 ?*/ + item.quantity * item.price,
        0,
      );
    }
    return 0;
  };

  render() {
    const styles = StyleSheet.create({
      centerElement: {justifyContent: 'center', alignItems: 'center'},
    });

    const {cartItems, cartItemsIsLoading, selectAll} = this.state;
    console.log('Cart Items=', cartItems);
    return (
      <View style={{flex: 1, backgroundColor: '#f6f6f6'}}>
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: '#fff',
            marginBottom: 10,
          }}>
          <View
            style={[styles.centerElement, {height: 50, flexDirection: 'row'}]}>
            <Ionicons name="ios-cart" size={25} color="#000" />
            <Text style={{fontSize: 18, color: '#000'}}>Shopping Cart</Text>
          </View>
        </View>

        {cartItemsIsLoading ? (
          <View style={[styles.centerElement, {height: 300}]}>
            <ActivityIndicator size="large" color="#ef5739" />
          </View>
        ) : (
          <ScrollView>
            {cartItems &&
              cartItems.map((item, i) => (
                <View
                  key={i}
                  style={{
                    flexDirection: 'row',
                    backgroundColor: '#fff',
                    marginBottom: 2,
                    height: 120,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      flexGrow: 1,
                      flexShrink: 1,
                      alignSelf: 'center',
                    }}>
                    <TouchableOpacity
                      onPress={() => {
                        /*this.props.navigation.navigate('ProductDetails', {productDetails: item})*/
                      }}
                      style={{paddingRight: 10}}></TouchableOpacity>
                    <View
                      style={{flexGrow: 1, flexShrink: 1, alignSelf: 'center'}}>
                      <Text numberOfLines={1} style={{fontSize: 15}}>
                        {item.name}
                      </Text>
                      <Text
                        numberOfLines={1}
                        style={{color: '#333333', marginBottom: 10}}>
                        Rs {item.quantity * item.price}
                      </Text>
                      <View style={{flexDirection: 'row'}}>
                        <TouchableOpacity
                          onPress={() => this.quantityHandler('less', i)}
                          style={{borderWidth: 1, borderColor: '#cccccc'}}>
                          <MaterialIcons
                            name="remove"
                            size={22}
                            color="#cccccc"
                          />
                        </TouchableOpacity>
                        <Text
                          style={{
                            borderTopWidth: 1,
                            borderBottomWidth: 1,
                            borderColor: '#cccccc',
                            paddingHorizontal: 7,
                            paddingTop: 3,
                            color: '#bbbbbb',
                            fontSize: 13,
                          }}>
                          {item.quantity}
                        </Text>
                        <TouchableOpacity
                          onPress={() => this.quantityHandler('more', i)}
                          style={{borderWidth: 1, borderColor: '#cccccc'}}>
                          <MaterialIcons name="add" size={22} color="#cccccc" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                  <View style={[styles.centerElement, {width: 60}]}>
                    <TouchableOpacity
                      style={[styles.centerElement, {width: 32, height: 32}]}
                      onPress={() => this.deleteHandler(i)}>
                      <Ionicons name="md-trash" size={25} color="#ee4d2d" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
          </ScrollView>
        )}

        {!cartItemsIsLoading && (
          <View
            style={{
              backgroundColor: '#fff',
              borderTopWidth: 2,
              borderColor: '#f6f6f6',
              paddingVertical: 5,
              // alignItems: 'flex-end',
            }}>
            <View style={{flexDirection: 'row'}}>
              <View
                style={{
                  // flexDirection: 'row',
                  flexGrow: 1,
                  flexShrink: 1,
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                {/* <Text>Select All</Text> */}
                <View
                  style={{
                    // flexDirection: 'row',
                    flexDirection: 'row',
                    paddingRight: 50,
                    alignItems: 'center',
                  }}>
                  <Text style={{color: '#8f8f8f', alignSelf: 'flex-end'}}>
                    Total:{' '}
                  </Text>
                  <Text>Rs {this.subtotalPrice().toFixed(2)}</Text>
                </View>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                height: 32,
                paddingRight: 20,
                alignItems: 'center',
              }}>
              <TouchableOpacity
                style={[
                  styles.centerElement,
                  {
                    // backgroundColor: '#0faf9a',
                    width: 100,
                    height: 25,
                    borderRadius: 5,
                  },
                ]}
                onPress={() => console.log('test')}>
                <Button
                  onPress={async () => {
                    if (this.state.cartItems.length > 0) {
                      let details = {
                        bill: this.subtotalPrice(),
                        items: this.state.cartItems,
                        suggestion: '',
                        paymentmode: 1,
                      };
                      console.log('Details=', details);
                      AsyncStorage.getItem('cookie').then((retrieve) => {
                        fetch('http://10.0.2.2:3000/orders', {
                          method: 'post',
                          headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                            Cookie: retrieve,
                          },
                          body: JSON.stringify(details),
                        })
                          .then(
                            (order) => {
                              console.log('Orders=', order);
                              return order.json();
                            },
                            (err) => {
                              throw err;
                            },
                          )
                          .then(
                            (json) => {
                              {
                                this.props.navigation.navigate('Payment', {
                                  price: json.amount,
                                  order_id: json.id,
                                });
                                console.log('Json=', json);
                              }
                            },
                            (err) => {
                              return Promise.resolve(err);
                            },
                          );
                      });
                    }
                  }}
                  style={{color: '#ffffff'}}
                  title="Checkout"></Button>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  }
}
