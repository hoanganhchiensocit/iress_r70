import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';

import Animated  from 'react-native-reanimated';

const { Clock, Value, set, cond, startClock, clockRunning, timing, debug, stopClock, block, eq, greaterThan } = Animated
const BoxLoading = ({ animatedValue = new Value(1), renderChildren, extraData, style, styleContent }) => {
    const reChildren = useCallback(() => {
        return renderChildren && renderChildren()
    }, [extraData])
    return (
        <View style={[{ alignSelf: 'center' }, style]}>
            <Animated.View style={[styleContent, {
                opacity: cond(greaterThan(animatedValue, 0.3), 0, 1)
            }]}>
                {
                    reChildren && reChildren()
                }
            </Animated.View>
            <Animated.View style={[StyleSheet.absoluteFill, {
                backgroundColor: '#434651',
                opacity: animatedValue,
                borderRadius: 4
            }]} />
        </View>
    )
}
export default BoxLoading
