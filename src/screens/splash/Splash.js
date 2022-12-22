import React, { Component } from 'react';
import { View, Dimensions, Image, Platform, Animated } from 'react-native';
import background from '../../img/background_mobile/ios82.png';
import backgroundAndroid from '../../img/background_mobile/android.png';
import logo from '../../img/background_mobile/logo.png';
import config from '../../../src/config';

const { height, width } = Dimensions.get('window');
const topHeight = height * 0.45;
const MARGIN_TOP_LOGO_INIT = topHeight - 64;
export class Splash extends React.PureComponent {
	constructor(props) {
		super(props);
	}

	renderLogo() {
		switch (config.logoInApp) {
			case 'BETA':
				return (
					<Image
						source={logo}
						style={{ width: (2830 / 980) * 64, height: 64 }}
					/>
				);
				break;
			case 'DEMO':
				return (
					<Image
						source={logo}
						style={{ width: width - 64, height: ((width - 64) * 260) / 1766 }}
					/>
				);
			default:
				return (
					<Image
						source={logo}
						style={{ width: (684 / 644) * 128, height: 128 }}
					/>
				);
		}
	}

	componentWillUnmount() {}
	componentDidMount() {
		// this.perf && this.perf.incrementCounter(performanceEnum.show_form_updating);
	}

	render() {
		return (
			<View
				style={{
					flex: 1,
					width,
					height,
					backgroundColor: 'transparent'
				}}
			>
				<Image
					source={Platform.OS === 'ios' ? background : backgroundAndroid}
					style={{ flex: 1, width: null, height: null }}
					resizeMode={Platform.OS === 'ios' ? 'cover' : 'stretch'}
				/>
				<View style={{ flex: 1, width, height, position: 'absolute' }}>
					<View style={{ alignItems: 'center', height: topHeight }}>
						<Animated.View
							style={{
								height: 72,
								marginTop: MARGIN_TOP_LOGO_INIT
							}}
						>
							{this.renderLogo()}
						</Animated.View>
					</View>
				</View>
			</View>
		);
	}
}
export default Splash;
