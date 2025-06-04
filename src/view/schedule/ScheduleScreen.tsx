import React from 'react';
import { View, StyleSheet } from 'react-native';
import metrics from '../../constants/metrics';

const ScheduleScreen = () => {
  return (
    <View style={styles.container}>
      {/* Add calendar component here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: metrics.s(16),
  },
});

export default ScheduleScreen;