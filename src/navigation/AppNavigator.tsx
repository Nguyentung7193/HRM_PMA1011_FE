import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackParamList} from './type';
import HomeScreen from '../view/home/HomeScreen';
import SignInScreen from '../view/auth/sign-in/SignInScreen';
import CreateLeaveScreen from '../view/leave/CreateLeaveScreen';
import NotificationScreen from '../view/notification/NotificationScreen';
import LeaveDetailScreen from '../view/leave/LeaveDetailScreen';
import OTDetailScreen from '../view/overtime/OTDetailScreen';
import OvertimeScreen from '../view/overtime/OvertimeScreen';
import CreateOTScreen from '../view/overtime/CreateOTScreen';
import HomeAdminScreen from '../view/admin/home/HomeAdminScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="SignInScreen"
      screenOptions={{headerShown: false}}
      >
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="SignInScreen" component={SignInScreen} />
      <Stack.Screen name="CreateLeaveScreen" component={CreateLeaveScreen} />
      <Stack.Screen name="NotificationScreen" component={NotificationScreen} />
      <Stack.Screen name="LeaveDetailScreen" component={LeaveDetailScreen} />
      <Stack.Screen name="OTDetailScreen" component={OTDetailScreen} />
      <Stack.Screen name="OvertimeScreen" component={OvertimeScreen}/>
      <Stack.Screen name="CreateOTScreen" component={CreateOTScreen} />
      {/* từ đây xuống là màn hình cho admin */}
      <Stack.Screen name="HomeAdminScreen" component={HomeAdminScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
