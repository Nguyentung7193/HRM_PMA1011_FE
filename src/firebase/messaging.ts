// src/firebase/messaging.ts
import messaging from '@react-native-firebase/messaging';
import {Platform, PermissionsAndroid} from 'react-native';

export const requestUserPermission = async (): Promise<void> => {
  try {
    if (Platform.OS === 'ios') {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('iOS Authorization status:', authStatus);
      }
    } else if (Platform.OS === 'android') {
      // Kiểm tra version Android
      if (Platform.Version >= 33) {
        const permission = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );
        
        console.log('Android notification permission status:', permission);
        
        if (permission === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Notification permission granted');
        } else {
          console.log('Notification permission denied');
        }
      }
    }
    
    // Get FCM token after permission granted
    await getFcmToken();
  } catch (error) {
    console.error('Permission request error:', error);
  }
};

export const getFcmToken = async (): Promise<void> => {
  try {
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      console.log('FCM Token:', fcmToken);
    } else {
      console.log('Không lấy được FCM token');
    }
  } catch (error) {
    console.error('Lỗi khi lấy FCM token:', error);
  }
};
