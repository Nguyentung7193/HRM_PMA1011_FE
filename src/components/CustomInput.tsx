import React from 'react';
import { TextInput, StyleSheet } from 'react-native';
import metrics from '../constants/metrics';

interface CustomInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  secureTextEntry?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
}

const CustomInput = ({
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  autoCapitalize,
}: CustomInputProps) => {
  return (
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      autoCapitalize={autoCapitalize}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: metrics.ms(10),
    padding: metrics.s(15),
    marginBottom: metrics.vs(15),
    borderWidth: 1,
    borderColor: '#e0e0e0',
    fontSize: metrics.ms(16),
  },
});

export default CustomInput;