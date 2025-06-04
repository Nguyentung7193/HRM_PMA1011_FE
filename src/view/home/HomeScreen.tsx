/* eslint-disable @typescript-eslint/no-unused-vars */
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import {View, Text, Button} from 'react-native';
import { RootStackParamList } from '../../navigation/type';

type Props = NativeStackScreenProps<RootStackParamList, 'HomeScreen'>;

const HomeScreen = ({navigation}: Props) => {
  return (
    <View style={{padding: 20}}>
      <Text>Trang chủ</Text>
      <Button
        title="Đi tới chi tiết"
      />
    </View>
  );
};

export default HomeScreen;
