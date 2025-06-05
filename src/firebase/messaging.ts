// src/firebase/messaging.ts
import messaging from '@react-native-firebase/messaging';
import {Platform, PermissionsAndroid} from 'react-native';
import PushNotification from 'react-native-push-notification';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Cấu hình notification channel cho Android
const createChannel = () => {
  PushNotification.createChannel(
    {
      channelId: 'default-channel',
      channelName: 'Default Channel',
      channelDescription: 'Default Notification Channel',
      soundName: 'default',
      importance: 4,
      vibrate: true,
    },
    created => console.log(`Channel created: ${created}`),
  );
};

// Xử lý notification khi app đang chạy
import type {FirebaseMessagingTypes} from '@react-native-firebase/messaging';

const onMessageReceived = async (
  remoteMessage: FirebaseMessagingTypes.RemoteMessage,
) => {
  console.log('Received foreground message:', remoteMessage);

  if (remoteMessage.notification) {
    PushNotification.localNotification({
      channelId: 'default-channel',
      title: remoteMessage.notification.title,
      message: remoteMessage.notification.body || '',
      playSound: true,
      soundName: 'default',
    });
  }
};

export const setupMessaging = async () => {
  try {
    await requestUserPermission();

    // Tạo notification channel cho Android
    if (Platform.OS === 'android') {
      createChannel();
    }

    // Xử lý notification khi app đang chạy
    messaging().onMessage(onMessageReceived);

    // Xử lý notification khi app ở background
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Background message:', remoteMessage);
    });

    // Xử lý khi click vào notification
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('Notification opened app:', remoteMessage);
    });

    // Xử lý trường hợp app được mở từ notification
    const initialNotification = await messaging().getInitialNotification();
    if (initialNotification) {
      console.log('App opened from quit state:', initialNotification);
    }
  } catch (error) {
    console.error('Setup messaging error:', error);
  }
};

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

const FCM_TOKEN_KEY = '@fcm_token';

export const getFcmToken = async (): Promise<string | null> => {
  try {
    // Kiểm tra token đã lưu
    const savedToken = await AsyncStorage.getItem(FCM_TOKEN_KEY);

    // Lấy token mới từ Firebase
    const fcmToken = await messaging().getToken();

    if (fcmToken) {
      console.log('FCM Token:', fcmToken);

      // Nếu token mới khác token đã lưu, cập nhật storage
      if (savedToken !== fcmToken) {
        await AsyncStorage.setItem(FCM_TOKEN_KEY, fcmToken);
        console.log('Đã lưu FCM token mới');
      }

      return fcmToken;
    } else {
      console.log('Không lấy được FCM token');
      return null;
    }
  } catch (error) {
    console.error('Lỗi khi lấy/lưu FCM token:', error);
    return null;
  }
};

// Thêm hàm tiện ích để lấy token đã lưu
export const getSavedFcmToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(FCM_TOKEN_KEY);
  } catch (error) {
    console.error('Lỗi khi đọc FCM token:', error);
    return null;
  }
};
