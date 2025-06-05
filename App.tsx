import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import * as messagingService from './src/firebase/messaging';

if (__DEV__) {
  require('./src/core/reactotron/ReactotronConfig');
}

export default function App() {
  useEffect(() => {
    messagingService.setupMessaging();
  }, []);

  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}
