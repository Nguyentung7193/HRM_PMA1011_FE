import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {CompositeNavigationProp} from '@react-navigation/native';

export type BottomTabParamList = {
  Schedule: undefined;
  Leave: undefined;
  Overtime: undefined;
  Attendance: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  SignInScreen: undefined;
  HomeScreen: undefined;
  CreateLeaveScreen: undefined;
  NotificationScreen: undefined;
  LeaveDetailScreen: {
    leaveId: string;
  };
  OvertimeScreen: undefined;
  CreateOTScreen: undefined;
  OTDetailScreen: {
    otId: string;
  };
  // Admin screens
  AdminLeaveScreen: undefined;
  HomeAdminScreen: undefined;
  AdminLeaveDetailScreen: {
    id: string;
  };
  AdminOTReportScreen: undefined;
  AdminOTReportDetailScreen: {
    id: string;
  };
  CurrentScheduleAdminScreen: undefined;
  AdminAttendanceScreen: undefined;
  CreateScheduleScreen: undefined;

};

export type TabScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<BottomTabParamList>,
  NativeStackNavigationProp<RootStackParamList>
>;
