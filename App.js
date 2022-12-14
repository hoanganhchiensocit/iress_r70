import React, { useEffect } from 'react';
import type { Node } from 'react';

import SplashScreen from 'react-native-splash-screen'


const App: () => Node = () => {

  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 3000);
  }, [])

};
export default App;
