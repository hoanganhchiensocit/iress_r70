import * as React from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

//set root nav
import Navigation, { navigationRef } from './Navigation';
//screen list
// import Login from '../src/screens/login/login'
import BusyBox from '../screens/busybox/busybox';
import { ScreenEnum } from '../navigation/screenEnum';
import Splash from '../screens/splash/Splash';

const Stack = createNativeStackNavigator();
const screenOptions = {
	headerShown: false,
	tabBarHideOnKeyboard: true,
	adaptive: true,
	keyboardHidesTabBar: true
};

function AppStack() {
	return (
		<NavigationContainer ref={navigationRef}>
			<Stack.Navigator>
				<Stack.Screen
					name={ScreenEnum.SPLASH}
					component={Splash}
					options={screenOptions}
				/>
				{/* <Stack.Screen name={ScreenEnum.HOME} component={HomeScreen} /> */}
				{/*<Stack.Screen name="Login" component={Login}/>*/}
				<Stack.Screen name={ScreenEnum.BUSY_BOX} component={BusyBox} />
			</Stack.Navigator>
		</NavigationContainer>
	);
}

export default AppStack;
