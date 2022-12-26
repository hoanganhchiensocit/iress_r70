import * as React from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';

//set root nav
import Navigation, { navigationRef } from './Navigation';
//screen list
// import Login from '../src/screens/login/login'
import BusyBox from '../screens/busybox/busybox';
import { ScreenEnum } from '../navigation/screenEnum';
import Home from '../screens/home/';
import Splash from '../screens/splash/Splash';
import { Login } from '~/screens/login/login';
import { AutoLogin } from '~/screens/auto_login/auto_login';

import Activities from '~/screens/marketActivity';
import Orders from '~/screens/orders/';
import Portfolio from '~/screens/portfolio/';
import Trade from '~/screens/watchlist';


const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const screenOptions = {
  headerShown: false,
  tabBarHideOnKeyboard: true,
  adaptive: true,
  keyboardHidesTabBar: true
};

function Main() {
  return <Tab.Navigator>
    <Tab.Screen name={ScreenEnum.ACTIVITIES} component={Activities}/>
    <Tab.Screen name={ScreenEnum.TRADE} component={Trade}/>
    <Tab.Screen name={ScreenEnum.PORTFOLIO} component={Portfolio}/>
    <Tab.Screen name={ScreenEnum.ORDERS} component={Orders}/>
  </Tab.Navigator>
}

function AppStack() {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator>
        <Stack.Screen
          name={ScreenEnum.SPLASH}
          component={Splash}
          options={screenOptions}
        />
        <Stack.Screen
          name={ScreenEnum.HOME}
          component={Home}
          options={screenOptions}
        />
        {/*<Stack.Screen name="Login" component={Login}/>*/}
        {/* <Stack.Screen
					name={ScreenEnum.BUSY_BOX}
					component={BusyBox}
					options={screenOptions}
				/> */}

        <Stack.Screen
          name={ScreenEnum.AUTO_LOGIN}
          component={AutoLogin}
          options={screenOptions}
        />

        <Stack.Screen
          name={ScreenEnum.MAIN}
          component={Main}
          options={screenOptions}
        />

        <Stack.Screen
          name={ScreenEnum.ACTIVITIES}
          component={Activities}
          options={screenOptions}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppStack;
