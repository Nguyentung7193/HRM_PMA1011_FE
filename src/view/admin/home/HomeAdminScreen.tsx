import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {TabScreenNavigationProp} from '../../../navigation/type';
import metrics from '../../../constants/metrics';

interface MenuItem {
  id: string;
  title: string;
  icon: string;
  screen: string;
  color: string;
  description: string;
}

const menuItems: MenuItem[] = [
  {
    id: '1',
    title: 'Chấm công',
    description: 'Quản lý chấm công nhân viên',
    icon: 'finger-print',
    screen: 'AdminAttendanceScreen',
    color: '#2196F3',
  },
  {
    id: '2',
    title: 'Nghỉ phép',
    description: 'Duyệt đơn xin nghỉ phép',
    icon: 'calendar',
    screen: 'AdminLeaveScreen',
    color: '#4CAF50',
  },
  {
    id: '3',
    title: 'OT',
    description: 'Quản lý làm thêm giờ',
    icon: 'time',
    screen: 'AdminOTScreen',
    color: '#FF9800',
  },
  {
    id: '4',
    title: 'Lịch làm việc',
    description: 'Sắp xếp ca làm việc',
    icon: 'calendar',
    screen: 'AdminScheduleScreen',
    color: '#9C27B0',
  },
  {
    id: '5',
    title: 'Nhân viên',
    description: 'Quản lý thông tin nhân viên',
    icon: 'people',
    screen: 'AdminEmployeeScreen',
    color: '#F44336',
  },
];

const HomeAdminScreen = () => {
  const navigation = useNavigation<TabScreenNavigationProp>();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.welcomeText}>Xin chào,</Text>
              <Text style={styles.adminText}>Admin</Text>
            </View>
            <TouchableOpacity style={styles.profileButton}>
              <Icon name="person-circle" size={metrics.ms(40)} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Quản lý hệ thống</Text>

          <View style={styles.menuGrid}>
            {menuItems.map(item => (
              <TouchableOpacity
                key={item.id}
                style={styles.menuItem}
                onPress={() => navigation.navigate(item.screen as never)}>
                <View
                  style={[styles.iconContainer, {backgroundColor: item.color}]}>
                  <Icon name={item.icon} size={metrics.ms(24)} color="#fff" />
                </View>
                <View style={styles.menuItemContent}>
                  <Text style={styles.menuItemTitle}>{item.title}</Text>
                  <Text style={styles.menuItemDescription}>
                    {item.description}
                  </Text>
                </View>
                <Icon name="chevron-forward" size={20} color="#666" />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: metrics.vs(30),
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#2196F3',
    paddingTop: metrics.vs(20),
    paddingBottom: metrics.vs(40),
    borderBottomLeftRadius: metrics.ms(30),
    borderBottomRightRadius: metrics.ms(30),
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: metrics.s(20),
  },
  welcomeText: {
    fontSize: metrics.ms(16),
    color: '#E3F2FD',
    marginBottom: metrics.vs(4),
  },
  adminText: {
    fontSize: metrics.ms(24),
    fontWeight: 'bold',
    color: '#fff',
  },
  profileButton: {
    padding: metrics.s(4),
  },
  content: {
    flex: 1,
    marginTop: -metrics.vs(20),
    paddingHorizontal: metrics.s(16),
  },
  sectionTitle: {
    fontSize: metrics.ms(18),
    fontWeight: '600',
    color: '#333',
    marginBottom: metrics.vs(16),
    marginTop: metrics.vs(30),
  },
  menuGrid: {
    gap: metrics.vs(12),
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: metrics.s(16),
    borderRadius: metrics.ms(12),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  iconContainer: {
    width: metrics.s(48),
    height: metrics.s(48),
    borderRadius: metrics.ms(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItemContent: {
    flex: 1,
    marginLeft: metrics.s(16),
  },
  menuItemTitle: {
    fontSize: metrics.ms(16),
    fontWeight: '600',
    color: '#333',
    marginBottom: metrics.vs(4),
  },
  menuItemDescription: {
    fontSize: metrics.ms(12),
    color: '#666',
  },
});

export default HomeAdminScreen;
