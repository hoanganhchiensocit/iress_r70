// import App from './src/app';
// console.disableYellowBox = true;
// const app = new App();

/**
 * @format
 */

import {AppRegistry} from 'react-native';
// import App from './App';
import App from './src/app';
import {name as appName} from './app.json';

// App();

AppRegistry.registerComponent(appName, () => App);
