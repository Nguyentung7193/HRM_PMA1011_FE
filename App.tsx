import {NavigationContainer} from '@react-navigation/native';
import React, {useEffect} from 'react';
import AppNavigator from './src/navigation/AppNavigator';
// import { requestUserPermission } from './src/firebase/messaging';
import * as messagingService from './src/firebase/messaging';

if (__DEV__) {
  require('./src/core/reactotron/ReactotronConfig'); // dùng require để tránh lỗi build ở production
}

export default function App() {
  useEffect(() => {
    const setupMessaging = async () => {
      try {
        console.log('Requesting permission...');
        await messagingService.requestUserPermission();
        console.log('Getting FCM token...');
        await messagingService.getFcmToken();
      } catch (error) {
        console.error('Setup messaging error:', error);
      }
    };

    setupMessaging();
  }, []);

  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}
