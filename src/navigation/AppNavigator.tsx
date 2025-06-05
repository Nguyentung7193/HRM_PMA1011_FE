import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackParamList} from './type';
import HomeScreen from '../view/home/HomeScreen';
import SignInScreen from '../view/auth/sign-in/SignInScreen';
import CreateLeaveScreen from '../view/leave/CreateLeaveScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="HomeScreen"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="SignInScreen" component={SignInScreen} />
      <Stack.Screen name="CreateLeaveScreen" component={CreateLeaveScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
