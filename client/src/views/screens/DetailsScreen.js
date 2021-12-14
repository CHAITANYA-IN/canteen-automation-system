import React from 'react';
import {SafeAreaView, StyleSheet, View, Text, Image} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';
import COLORS from '../../consts/colors';
import {SecondaryButton} from '../components/Button';
import {cart} from './CartScreen';
const DetailsScreen = ({navigation, route}) => {
  const item = route.params;

  return (
    <SafeAreaView style={{backgroundColor: COLORS.white}}>
      <View style={style.header}>
        <Icon name="arrow-back-ios" size={28} onPress={navigation.goBack} />
        <Text style={{fontSize: 20, fontWeight: 'bold'}}>Details</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            height: 280,
          }}>
          <Image source={{uri: item.image}} style={{height: 220, width: 220}} />
        </View>
        <View style={style.details}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text
              style={{fontSize: 25, fontWeight: 'bold', color: COLORS.white}}>
              {item.name}
            </Text>
            {/* <View style={style.iconContainer}> */}
            {/* <Icon name="favorite-border" color={COLORS.primary} size={25} /> */}
            {/* </View> */}
          </View>
          <Text style={style.detailsText}>{item.description}</Text>
          {/* <Text>{item.price}</Text> */}
          <View style={{marginTop: 40, marginBottom: 40}}>
            <SecondaryButton
              title="Add To Cart"
              onPress={() => {
                if (cart.length === 0) {
                  item.quantity = 1;
                  cart.push(item);
                } else {
                  let i,
                    found = 0;
                  for (i = 0; i < cart.length; i++) {
                    if (cart[i].item_id == item.item_id) {
                      found = 1;
                      break;
                    }
                  }
                  if (!found) {
                    item.quantity = 1;
                    cart.push(item);
                  }
                }
                navigation.navigate('Cart', {item});
              }}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
//export default connect(null, mapDispatchToProps)(DetailsScreen);
const style = StyleSheet.create({
  header: {
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  details: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 60,
    backgroundColor: COLORS.primary,
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,
  },
  iconContainer: {
    backgroundColor: COLORS.white,
    height: 50,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
  },
  detailsText: {
    marginTop: 10,
    lineHeight: 22,
    fontSize: 16,
    color: COLORS.white,
  },
});
export default DetailsScreen;
