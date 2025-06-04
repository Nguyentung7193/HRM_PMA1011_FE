import {Dimensions} from 'react-native';
import {scale, verticalScale, moderateScale} from 'react-native-size-matters';

const {width, height} = Dimensions.get('window');

export const metrics = {
  screenWidth: width,
  screenHeight: height,
  s: scale, // For general scaling
  vs: verticalScale, // For vertical scaling
  ms: moderateScale, // For moderate scaling with factor
};

export default metrics;
