import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import metrics from '../../constants/metrics';

const ProfileScreen = () => {
  const menuItems = [
    { icon: 'person-outline', title: 'Thông tin cá nhân' },
    { icon: 'time-outline', title: 'Lịch sử chấm công' },
    { icon: 'document-text-outline', title: 'Lịch sử xin nghỉ' },
    { icon: 'settings-outline', title: 'Cài đặt' },
    { icon: 'log-out-outline', title: 'Đăng xuất' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Image
            style={styles.avatar}
            source={{ uri: 'https://via.placeholder.com/100' }}
          />
          <Text style={styles.name}>Nguyễn Văn A</Text>
          <Text style={styles.role}>Nhân viên</Text>
        </View>
      </View>

      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity key={index} style={styles.menuItem}>
            <Icon name={item.icon} size={metrics.ms(24)} color="#2196F3" />
            <Text style={styles.menuText}>{item.title}</Text>
            <Icon name="chevron-forward" size={metrics.ms(20)} color="#666" />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#E3F2FD',
    padding: metrics.s(20),
    paddingBottom: metrics.vs(40),
  },
  avatarContainer: {
    alignItems: 'center',
  },
  avatar: {
    width: metrics.s(100),
    height: metrics.s(100),
    borderRadius: metrics.ms(50),
    marginBottom: metrics.vs(12),
  },
  name: {
    fontSize: metrics.ms(20),
    fontWeight: 'bold',
    color: '#000',
  },
  role: {
    fontSize: metrics.ms(14),
    color: '#666',
    marginTop: metrics.vs(4),
  },
  menuContainer: {
    padding: metrics.s(16),
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: metrics.s(16),
    backgroundColor: '#F5F5F5',
    borderRadius: metrics.ms(8),
    marginBottom: metrics.vs(12),
  },
  menuText: {
    flex: 1,
    marginLeft: metrics.s(12),
    fontSize: metrics.ms(16),
    color: '#000',
  },
});

export default ProfileScreen;