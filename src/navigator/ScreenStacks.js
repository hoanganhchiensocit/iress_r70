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
import MyBottomTabBar from '../component/tabbar/bottom_tabbar'

import CategoriesWL from '~s/watchlist/Categories/';
import EditWatchList from '~/screens/watchlist/EditWatchList/EditWatchlist.js';
import SearchSymbol from '~s/search_symbol';
import WatchlistDetail from '~s/watchlist/WatchlistDetail';
import CreatePriceboard from '~s/watchlist/Categories/View/CreatePriceBoard';
import NewDetail from '~s/news_v3/view/detail/';
import NewsDetail from '~s/news_detail/news_detail';
import Disclaimer from '~/screens/disclaimer/disclaimer_iress';
import CreateNewAlerts from '~s/alertLog/View/CreateNewAlerts'
import NewOrder from '~/screens/new_order/NewOrderWrapper'


const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const screenOptions = {
  headerShown: false,
  tabBarHideOnKeyboard: true,
  adaptive: true,
  keyboardHidesTabBar: true,
};

const modalOptions = {
  ...screenOptions,
  presentation: 'modal',
  animation: 'fade_from_bottom',
};

const QuickActions = () => {
  return <View/>
}

function Main() {
  return <Tab.Navigator screenOptions={screenOptions}
                        tabBar={props => <MyBottomTabBar {...props} />}>
    <Tab.Screen name={ScreenEnum.ACTIVITIES} component={Activities}/>
    <Tab.Screen name={ScreenEnum.TRADE} component={Trade}/>
    <Tab.Screen name={ScreenEnum.QUICK_ACTION} component={() => null}/>
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
          name={ScreenEnum.CATEGORIES_WL}
          component={CategoriesWL}
          options={screenOptions}
        />
        <Stack.Screen
          name={ScreenEnum.CREATE_PRICEBOARD}
          component={CreatePriceboard}
          options={screenOptions}
        />
        <Stack.Screen
          name={ScreenEnum.EDIT_WATCHLIST}
          component={EditWatchList}
          options={screenOptions}
        />
        <Stack.Screen
          name={ScreenEnum.SEARCH_SYMBOL}
          component={SearchSymbol}
          options={screenOptions}
        />
        <Stack.Screen
          name={ScreenEnum.WATCH_LIST_DETAIL}
          component={WatchlistDetail}
          options={screenOptions}
        />
        <Stack.Screen
          name={ScreenEnum.NEW_DETAIL}
          component={NewDetail}
          options={screenOptions}
        />
        <Stack.Screen
          name={ScreenEnum.NEWS_DETAIL}
          component={NewsDetail}
          options={modalOptions}
        />
        <Stack.Screen
          name={ScreenEnum.DISCLAIMER}
          component={Disclaimer}
          options={screenOptions}
        />
        <Stack.Screen
          name={ScreenEnum.CREATE_NEW_ALERTS}
          component={CreateNewAlerts}
          options={modalOptions}
        />
        <Stack.Screen
          name={ScreenEnum.NEW_ORDER}
          component={NewOrder}
          options={modalOptions}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppStack;
