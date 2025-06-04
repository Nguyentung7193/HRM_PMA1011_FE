/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import HomeHeader from '../../components/HomeHeader';
import ScheduleScreen from '../schedule/ScheduleScreen';
import LeaveScreen from '../leave/LeaveScreen';
import OvertimeScreen from '../overtime/OvertimeScreen';
import AttendanceScreen from '../attendance/AttendanceScreen';
import ProfileScreen from '../profile/ProfileScreen';
import metrics from '../../constants/metrics';
import {RootStackParamList, BottomTabParamList} from '../../navigation/type';

const Tab = createBottomTabNavigator<BottomTabParamList>();

type Props = NativeStackScreenProps<RootStackParamList, 'HomeScreen'>;

const HomeScreen = ({navigation}: Props) => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        header: () => <HomeHeader />,
        tabBarIcon: ({focused, color, size}) => {
          let iconName;
          switch (route.name) {
            case 'Schedule':
              iconName = focused ? 'calendar' : 'calendar-outline';
              break;
            case 'Leave':
              iconName = focused ? 'briefcase' : 'briefcase-outline';
              break;
            case 'Overtime':
              iconName = focused ? 'time' : 'time-outline';
              break;
            case 'Attendance':
              iconName = focused ? 'finger-print' : 'finger-print-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'list';
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2196F3',
        tabBarInactiveTintColor: '#666',
        tabBarStyle: {
          height: metrics.vs(60),
          paddingBottom: metrics.vs(5),
        },
      })}>
      <Tab.Screen
        name="Schedule"
        component={ScheduleScreen}
        options={{title: 'Lịch biểu'}}
      />
      <Tab.Screen
        name="Leave"
        component={LeaveScreen}
        options={{title: 'Xin nghỉ'}}
      />
      <Tab.Screen
        name="Overtime"
        component={OvertimeScreen}
        options={{title: 'OT'}}
      />
      <Tab.Screen
        name="Attendance"
        component={AttendanceScreen}
        options={{title: 'Chấm công'}}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{title: 'Cá nhân'}}
      />
    </Tab.Navigator>
  );
};

export default HomeScreen;
