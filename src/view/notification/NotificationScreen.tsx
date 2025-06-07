import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {RootStackParamList} from '../../navigation/type';
import metrics from '../../constants/metrics';
import {Notification, getNotifications} from '../../service/api/ApiService';

type Props = NativeStackScreenProps<RootStackParamList, 'NotificationScreen'>;

const NotificationScreen = ({navigation}: Props) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('auth_token');
      if (!token) {
        setError('Không tìm thấy token');
        return;
      }

      const data = await getNotifications(token);
      setNotifications(data.notifications);
    } catch (err) {
      setError('Không thể tải thông báo');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderItem = ({item}: {item: Notification}) => (
    <TouchableOpacity
      style={[styles.notificationItem, !item.isRead && styles.unreadItem]}>
      <View style={styles.notificationContent}>
        <Text style={styles.notificationTitle}>{item.title}</Text>
        <Text style={styles.notificationBody}>{item.body}</Text>
        <Text style={styles.notificationTime}>
          {formatDate(item.createdAt)}
        </Text>
      </View>
      {!item.isRead && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleBack}
          style={styles.backButton}>
          <Icon name="arrow-back" size={metrics.ms(24)} color="#2196F3" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thông báo</Text>
        <View style={{width: metrics.s(24)}} />
      </View>

      {loading ? (
        <ActivityIndicator style={styles.loader} color="#2196F3" />
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={fetchNotifications}>
            <Text style={styles.retryText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderItem}
          keyExtractor={item => item._id}
          contentContainerStyle={styles.listContainer}
          refreshing={loading}
          onRefresh={fetchNotifications}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: metrics.s(16),
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: metrics.ms(18),
    fontWeight: '600',
    color: '#2196F3',
  },
  listContainer: {
    padding: metrics.s(16),
  },
  notificationItem: {
    flexDirection: 'row',
    padding: metrics.s(16),
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    alignItems: 'center',
  },
  unreadItem: {
    backgroundColor: '#f5f5f5',
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: metrics.ms(16),
    fontWeight: '600',
    marginBottom: metrics.vs(4),
  },
  notificationBody: {
    fontSize: metrics.ms(14),
    color: '#666',
    marginBottom: metrics.vs(4),
  },
  notificationTime: {
    fontSize: metrics.ms(12),
    color: '#999',
  },
  unreadDot: {
    width: metrics.s(8),
    height: metrics.s(8),
    borderRadius: metrics.s(4),
    backgroundColor: '#2196F3',
    marginLeft: metrics.s(8),
  },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: metrics.s(16),
  },
  errorText: {
    fontSize: metrics.ms(16),
    color: '#f44336',
    marginBottom: metrics.vs(16),
  },
  retryButton: {
    padding: metrics.s(12),
    backgroundColor: '#2196F3',
    borderRadius: metrics.ms(8),
  },
  retryText: {
    color: '#fff',
    fontSize: metrics.ms(14),
  },
  backButton: {
    padding: metrics.s(8),
    marginLeft: -metrics.s(8), // Add negative margin to align with content
  },
});

export default NotificationScreen;