import React, { useEffect } from 'react';
import type { Node } from 'react';
import { Provider } from 'react-redux';
import { View } from 'react-native'

import SplashScreen from 'react-native-splash-screen'
import AppStack from './navigator/screen_stack'

import configureStore from './src/store/configureStore';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const App = () => {

  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();

      console.log('Aaaaaaaa-------------')
    }, 3000);
  }, [])

  return <GestureHandlerRootView style={{ flex: 1 }}>
    <Provider store={configureStore()}>
      <AppStack/>
    </Provider>
  </GestureHandlerRootView>

};
export default App;
