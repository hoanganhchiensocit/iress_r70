import React  from 'react'
import { View, KeyboardAvoidingView, Platform } from 'react-native'

import CommonStyle from '~/theme/theme_controller';
const WrapperComponent = props => {
    const styles = {
        flex: 1,
        backgroundColor: CommonStyle.backgroundColor1
    };
    if (Platform.OS === 'ios') {
        return <View {...props} style={[styles, props.style]} />;
    } else {
        return (
            <KeyboardAvoidingView
                {...props}
                enabled={false}
                behavior="height"
                style={[styles, props.style]}
            />
        );
    }
};
WrapperComponent.propTypes = {}
WrapperComponent.defaultProps = {}
export default WrapperComponent
