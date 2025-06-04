import React, {useState} from 'react';
import {View, Text, StyleSheet, SafeAreaView} from 'react-native';
import {RootStackParamList} from '../../../navigation/type';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import CustomInput from '../../../components/CustomInput';
import CustomButton from '../../../components/CustomButton';
import metrics from '../../../constants/metrics';

type Props = NativeStackScreenProps<RootStackParamList, 'SignInScreen'>;

const SignInScreen = ({navigation}: Props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = () => {
    console.log('Sign in with:', email, password);
    navigation.replace('HomeScreen');
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

        <CustomButton title="Đăng nhập" onPress={handleSignIn} />
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
