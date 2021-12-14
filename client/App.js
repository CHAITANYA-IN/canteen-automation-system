import 'react-native-gesture-handler';
import React from 'react';
import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import COLORS from './src/consts/colors';
import DetailsScreen from './src/views/screens/DetailsScreen';
import BottomNavigator from './src/views/navigation/BottomNavigator';
import OnBoardScreen from './src/views/screens/OnBoardScreen';
import Login from './src/views/screens/Login';
import Payment from './src/views/screens/Payment';
import {Cart} from './src/views/screens/CartScreen';
// import Signup from './src/views/screens/Signup';
import Su2 from './src/views/screens/Su2';
import Profile from './Profile';
const Stack = createStackNavigator();
var cart = [];
const App = () => {
  return (
    <NavigationContainer>
      <StatusBar backgroundColor={COLORS.white} barStyle="dark-content" />
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Login" component={Login} />
        {/* <Stack.Screen name="Signup" component={Signup} /> */}
        <Stack.Screen name="Signup2" component={Su2} />
        <Stack.Screen name="BoardScreen" component={OnBoardScreen} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="Home" component={BottomNavigator} />
        <Stack.Screen name="DetailsScreen" component={DetailsScreen} />
        <Stack.Screen name="Payment" component={Payment} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
