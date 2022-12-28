import React from 'react';
import { StyleSheet } from 'react-native';
import Animated, { interpolate } from 'react-native-reanimated';

import CommonStyle, { register } from '~/theme/theme_controller';
import * as PureFunc from '~/utils/pure_func'
import { DEVICE_WIDTH, DEVICE_HEIGHT } from '~s/watchlist/enum';
import { useUpdateChangeTheme } from '~/component/hook';

let BackDropView = ({ _scrollValue }) => {
  useUpdateChangeTheme()
  // ChienHA
  // const opacity = interpolate(_scrollValue, {
  //   inputRange: [-1, 0, DEVICE_HEIGHT, DEVICE_HEIGHT + 1],
  //   outputRange: [1, 1, 0, 0]
  // });
  //
  // const translateX = interpolate(_scrollValue, {
  //   inputRange: [
  //     DEVICE_HEIGHT - 2,
  //     DEVICE_HEIGHT - 1,
  //     DEVICE_HEIGHT,
  //     DEVICE_HEIGHT + 1
  //   ],
  //   outputRange: [0, 0, DEVICE_WIDTH, DEVICE_WIDTH]
  // });

  return (
    <Animated.View
      style={[
        styles.container,
        // {
        //   opacity,
        //   transform: [{ translateX }]
        // }
      ]}
    />
  );
};

BackDropView = React.memo(BackDropView);
export default BackDropView;

const styles = {}

function getNewestStyle() {
  const newStyle = StyleSheet.create({
    container: {
      alignItems: 'center',
      backgroundColor: CommonStyle.backgroundColor,
      height: DEVICE_HEIGHT,
      justifyContent: 'flex-end',
      position: 'absolute',
      width: '100%'
    }
  });

  PureFunc.assignKeepRef(styles, newStyle)
}

getNewestStyle()

register(getNewestStyle)
