import React from 'react';
import { Image } from 'react-native';
import Animated  from 'react-native-reanimated';
import CommonStyle from '~/theme/theme_controller';

const Logo = ({ translateY }) => {
	const opacity = translateY.interpolate({
		inputRange: [-300, 0],
		outputRange: [0, 1]
	});
	return (
		<Animated.View
			style={{
				opacity: opacity
			}}
		>
			<Image
				source={CommonStyle.images.logo}
				resizeMode={'contain'}
				style={{ marginTop: 59, height: 122, width: 156 }}
			/>
		</Animated.View>
	);
};

export default Logo;
