import React, { useEffect, useMemo } from 'react';
import { Dimensions } from 'react-native';
import * as Util from '~/util';
import Animated, { EasingNode as Easing } from 'react-native-reanimated'
import * as Emitter from '@lib/vietnam-emitter';
import { Channel } from './Keyboard'

const { width: widthDevices, height: heightDevices } = Dimensions.get('window')
const useListenShow = function (translateY) {
    return useEffect(() => {
        Emitter.addListener(Channel.WILL_SHOW, Util.getRandomKey(), (data) => {
            const heightKeyBoard = data.current.layout.height
            const marginBottomKeyBoard = heightDevices - data.current.coordinates.pageY - data.current.coordinates.height
            if (marginBottomKeyBoard > heightKeyBoard) return
            Animated.timing(translateY, {
                toValue: (Math.abs(marginBottomKeyBoard - heightKeyBoard) + 16) * -1,
                duration: 300,
                easing: Easing.inOut(Easing.ease)
            }).start()
        });
    }, [])
}
const useListenHide = function (translateY) {
    return useEffect(() => {
        Emitter.addListener(Channel.WILL_HIDE, Util.getRandomKey(), () => {
            Animated.timing(translateY, {
                toValue: 0,
                duration: 300,
                easing: Easing.inOut(Easing.ease)
            }).start()
        });
    }, [])
}
const SpacePushContent = (props) => {
    const translateY = useMemo(() => {
        return new Animated.Value(0)
    }, [])
    useListenShow(translateY)
    useListenHide(translateY)
    return (
        <Animated.View style={{
            transform: [
                {
                    translateY
                }
            ]
        }}>
            {props.children}
        </Animated.View>
    );
}

export default SpacePushContent;
