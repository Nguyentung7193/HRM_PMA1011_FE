/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { View, Text } from 'react-native';
import { RootStackParamList } from '../../../navigation/type';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<RootStackParamList, 'SignInScreen'>;

const SignInScreen = ({ navigation }: Props) => {
  return (
    <View style={{ padding: 20 }}>
      <Text>Sign In</Text>
    </View>
  );
};

export default SignInScreen;
