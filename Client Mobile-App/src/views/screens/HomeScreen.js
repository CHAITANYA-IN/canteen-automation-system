import React, {useState, useEffect} from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  FlatList,
  ScrollView,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';
import COLORS from '../../consts/colors';
import categories from '../../consts/categories';
import {componentDidMount, componentfetch} from '../../../api';
import {finame} from '../../../Profile';
import AsyncStorage from '@react-native-async-storage/async-storage';
// console.log('Finame=', finame);
const {width} = Dimensions.get('screen');
const cardWidth = width / 2 - 20;

const HomeScreen = ({navigation}) => {
  const [foods, setState] = useState([]);
  useEffect(() => {
    componentDidMount();
    componentfetch();
  }, []);
  const [name, setName] = useState('');
  function componentfetch() {
    AsyncStorage.getItem('cookie').then((retrieve) => {
      fetch('http://10.0.2.2:3000/menu', {
        method: 'GET',
        headers: {
          Cookie: retrieve,
        },
        // body: JSON.stringify({
        // username:1,
        // password:"ams",
        // })
      })
        .then(
          (items) => {
            return items.json();
          },
          (err) => {
            throw err;
          },
        )
        .then(
          (json) => {
            setState(json);
            return json;
          },
          (err) => {
            return Promise.resolve(err);
          },
        );
    });
  }
  function componentDidMount() {
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
            {
              setName(json.first_name);
              console.log('Name=', json.first_name);
            }
          },
          (err) => {
            return Promise.resolve(err);
          },
        );
    });
  }
  const Card = ({food}) => {
    return (
      <TouchableHighlight
        underlayColor={COLORS.white}
        activeOpacity={0.9}
        onPress={() => navigation.navigate('DetailsScreen', food)}>
        <View style={style.card}>
          <View style={{alignItems: 'center', top: -40}}>
            <Image source={{uri: food.image}} style={{height: 80, width: 80}} />
          </View>
          <View style={{marginHorizontal: 20}}>
            <Text style={{fontSize: 18, fontWeight: 'bold'}}>{food.name}</Text>
            <Text
              numberofLines={1}
              style={{fontSize: 14, color: COLORS.grey, marginTop: 2}}>
              {food.description}
            </Text>
          </View>
          <View
            style={{
              marginTop: 10,
              marginHorizontal: 20,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text style={{fontSize: 18, fontWeight: 'bold'}}>
              Rs. {food.price}
            </Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.white}}>
      <View style={style.header}>
        <View>
          <View style={{flexDirection: 'row'}}>
            <Text style={{fontSize: 28}}>Hello,</Text>
            <Text style={{fontSize: 28, fontWeight: 'bold', marginLeft: 10}}>
              {name}
            </Text>
          </View>
          <Text style={{marginTop: 5, fontSize: 22, color: COLORS.grey}}>
            COEP CANTEEN APP
          </Text>
        </View>
        <Image
          source={require('../../assets/icon.png')}
          style={{height: 50, width: 50, borderRadius: 25}}
        />
      </View>
      <View
        style={{
          marginTop: 40,
          flexDirection: 'row',
          paddingHorizontal: 20,
        }}></View>
      <FlatList
        showsVerticalScrollIndicator={false}
        numColumns={2}
        data={foods}
        renderItem={({item}) => <Card food={item} />}
      />
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  header: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  inputContainer: {
    flex: 1,
    height: 50,
    borderRadius: 10,
    flexDirection: 'row',
    backgroundColor: COLORS.light,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  sortBtn: {
    width: 50,
    height: 50,
    marginLeft: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoriesListContainer: {
    paddingVertical: 30,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  categoryBtn: {
    height: 45,
    width: 120,
    marginRight: 7,
    borderRadius: 30,
    alignItems: 'center',
    paddingHorizontal: 5,
    flexDirection: 'row',
  },
  categoryBtnImgCon: {
    height: 35,
    width: 35,
    backgroundColor: COLORS.white,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    height: 220,
    width: cardWidth,
    marginHorizontal: 10,
    marginBottom: 20,
    marginTop: 50,
    borderRadius: 15,
    elevation: 13,
    backgroundColor: COLORS.white,
  },
  addToCartBtn: {
    height: 30,
    width: 30,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;
