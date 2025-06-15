import React, {useState} from 'react';
import {View, Text, StyleSheet, SafeAreaView, Alert} from 'react-native';
import {RootStackParamList} from '../../../navigation/type';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import CustomInput from '../../../components/CustomInput';
import CustomButton from '../../../components/CustomButton';
import metrics from '../../../constants/metrics';
import {login} from '../../../service/api/ApiService';
import {getSavedFcmToken} from '../../../firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = NativeStackScreenProps<RootStackParamList, 'SignInScreen'>;

const SignInScreen = ({navigation}: Props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    try {
      if (!email || !password) {
        Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
        return;
      }

      setLoading(true);
      const fcmToken = await getSavedFcmToken();
      if (!fcmToken) {
        Alert.alert('Lỗi', 'Không thể lấy được token thiết bị');
        return;
      }

      const response = await login({
        email,
        password,
        fcmToken,
      });
      // Save auth token
      await AsyncStorage.setItem('auth_token', response.data.token);

      // Save user role for future use
      await AsyncStorage.setItem('user_role', response.data.user.role);

      // Navigate based on role
      if (response.data.user.role === 'admin') {
        navigation.replace('HomeAdminScreen');
      } else {
        navigation.replace('HomeScreen');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Đã có lỗi xảy ra';
      Alert.alert('Lỗi đăng nhập', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Đăng nhập</Text>

        <View style={styles.inputContainer}>
          <CustomInput
            placeholder="Email/Tên đăng nhập"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />

          <CustomInput
            placeholder="Mật khẩu"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <CustomButton
          title={loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          onPress={handleSignIn}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
    padding: metrics.s(20),
    justifyContent: 'center',
  },
  title: {
    fontSize: metrics.ms(28, 0.3),
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: metrics.vs(30),
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: metrics.vs(20),
  },
});

export default SignInScreen;
