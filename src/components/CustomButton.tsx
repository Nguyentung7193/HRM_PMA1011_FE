import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import metrics from '../constants/metrics';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
}

const CustomButton = ({ title, onPress }: CustomButtonProps) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#2196F3',
    padding: metrics.s(15),
    borderRadius: metrics.ms(10),
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: metrics.ms(16),
    fontWeight: '600',
  },
});

export default CustomButton;