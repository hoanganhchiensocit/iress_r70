import React, { useEffect } from 'react';
import { Provider } from 'react-redux';

import SplashScreen from 'react-native-splash-screen';
import AppStack from './src/navigator/ScreenStacks';

import configureStore from './src/store/configureStore';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { LogBox, StatusBar } from 'react-native';
LogBox.ignoreAllLogs();

const App = () => {
	useEffect(() => {
		StatusBar.setBarStyle('light-content');
		setTimeout(() => {
			SplashScreen.hide();
		}, 3000);
	}, []);

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<Provider store={configureStore()}>
				<AppStack />
			</Provider>
		</GestureHandlerRootView>
	);
};
export default App;
