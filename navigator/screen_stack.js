import * as React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

//set root nav
import Navigation, { navigationRef } from './Navigation';

//screen list
// import Login from '../src/screens/login/login'
import BusyBox from '../src/screens/busybox/busybox'

//sau update ve busy box
function HomeScreen() {

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>

      <TouchableOpacity onPress={() => {
        console.log('onpress BusyBox')
        Navigation.navigate('BusyBox')
      }}>
        <Text>Home Screen</Text>
      </TouchableOpacity>
    </View>
  );
}

const Stack = createNativeStackNavigator();

function AppStack() {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator>
        {/*<Stack.Screen name="Home" component={HomeScreen}/>*/}
        {/*<Stack.Screen name="Login" component={Login}/>*/}
        <Stack.Screen name="BusyBox" component={BusyBox}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppStack;
