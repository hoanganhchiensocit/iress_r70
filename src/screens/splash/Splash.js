import React, { Component } from 'react';
import { View, Dimensions, Image, Platform, Animated } from 'react-native';
import background from '../../img/background_mobile/ios82.png';
import backgroundAndroid from '../../img/background_mobile/android.png';
import logo from '../../img/background_mobile/logo.png';
import {
	getListRegion,
	postBrokerName2
} from '../home/Controllers/RegionController';
import { dataStorage } from '~/storage';
import { navigationRef } from '~/navigator/Navigation';
import performanceEnum from '../../constants/performance';
import config from '../../config';
import ENUM from '~/enum';
import * as Controller from '../../memory/controller';
import * as Business from '../../business';
import { getTimezoneByLocation } from '~/lib/base/functionUtil';
import * as Channel from '../../streaming/channel';
import * as Emitter from '@lib/vietnam-emitter';
import * as Util from '../../util';
import * as appActions from '../../app.actions';
import configureStore from '~/store/configureStore';
import { initApp } from '~/initStorage';
import Perf from '../../lib/base/performance_monitor';
import { resetLoginLoading } from '../login/login.actions';
import { setBrokerName } from '../home/Model/LoginModel';
import { logDevice } from '../../lib/base/functionUtil';

const { height, width } = Dimensions.get('window');
const topHeight = height * 0.45;
const MARGIN_TOP_LOGO_INIT = topHeight - 64;

const loginState = {
	NOT: 0,
	LOGING: 1,
	SUCCESS: 2
};

export const store = configureStore();
Controller.setGlobalStore(store);
export class Splash extends React.PureComponent {
	constructor(props) {
		super(props);
		this.loginSuccess = loginState.NOT; //clear
		this.needClickToLogout = false;

		this.perf = new Perf(performanceEnum.start_app_ios);

		this.emailDefault = config.username; //clear
		this.passDefault = config.password; //clear

		this.isReady = true; //clear
		this.alreadyShowReauthenPopUp = false; //clear
		this.prevNetworkConnection = null; //clear

		this.callbackAfterLogin = this.callbackAfterLogin.bind(this);
		dataStorage.reloadAppAfterLogin = this.reloadAppAfterLogin.bind(this);
		dataStorage.startApp = this.startAppFunction;
	}

	componentWillUnmount() {}
	componentDidMount() {
		this.startAppFunction();

		// this.perf && this.perf.incrementCounter(performanceEnum.show_form_updating);
	}

	openNotiInApp(notif) {
		console.log('YOLO openNotiInApp');
		const isLogged = Controller.getLoginStatus();
		if (isLogged) {
			dataStorage.menuSelected = ENUM.MENU_SELECTED.alertLog;
			// pushScreenToCurrentTab({
			// 	screen: 'equix.AlertLog',
			// 	title: 'equix.AlertLog',
			// 	backMore: false,
			// 	passProps: {
			// 		targetNoti: true
			// 	}
			// });
		}
	}

	initNotiListener() {
		console.log('YOLO initNotiListener');
		Business.getMessagingToken();
		Business.notificationOpenedListener(this.openNoti);
		Business.onMessage();
		Business.onNotification();
	}

	getDefaultTimeZone() {
		console.log('YOLO getDefaultTimeZone');
		const AUTimeZone = getTimezoneByLocation(ENUM.LOCATION.AU);
		const USTimeZone = getTimezoneByLocation(ENUM.LOCATION.US);
		Controller.setTimeZoneAU(AUTimeZone);
		Controller.setTimeZoneUS(USTimeZone);
	}

	subForceReloadUser() {
		console.log('YOLO subForceReloadUser');
		const channelName = Channel.getChannelForceReload();
		Emitter.addListener(channelName, Util.getRandomKey(), () => {
			initApp(this.callbackAfterLogin);
		});
	}

	handleConnectionChange(isConnected) {
		console.log('YOLO handleConnectionChange');
		store.dispatch(appActions.changeConnection(isConnected));
	}

	async showForm(isUpdating) {
		console.log('YOLO showForm');
		await this.settingThemeBeforeLogin();
		// showBusyBoxScreen({
		// 	isUpgrade: false,
		// 	isUpdating
		// });
		// SplashScreen.hide();
	}

	showMaintainModal() {
		console.log('YOLO showMaintainModal');
		if (dataStorage.maintain.preState === dataStorage.maintain.currentState) {
			return;
		}

		if (
			(dataStorage.maintain.preState === null &&
				dataStorage.maintain.currentState === false) ||
			(dataStorage.maintain.preState === false &&
				dataStorage.maintain.currentState === null)
		) {
			dataStorage.maintain.preState = dataStorage.maintain.currentState;
			return;
		}
		// reload App when maintain done
		if (
			(dataStorage.maintain.preState === true &&
				dataStorage.maintain.currentState === false) ||
			(dataStorage.maintain.preState === true &&
				dataStorage.maintain.currentState === null)
		) {
			dataStorage.maintain.preState = dataStorage.maintain.currentState;
			dataStorage.isLocked = true;
			dataStorage.startAppAfterLoadStore &&
				dataStorage.startAppAfterLoadStore();
			// this.startAppAfterLoadStore()
		}
		// maintain App
		if (
			dataStorage.maintain.preState !== true &&
			dataStorage.maintain.currentState === true
		) {
			dataStorage.maintain.preState = dataStorage.maintain.currentState;
			// showBusyBoxScreen({
			// 	isUpgrade: true
			// });
		}
	}

	showAlertChangePin() {
		// console.log('YOLO showAlertChangePin');
		// // return true
		// if (
		// 	!this.needClickToLogout &&
		// 	dataStorage.emailLogin &&
		// 	dataStorage.emailLogin !== config.username &&
		// 	dataStorage.currentScreenId !== ScreenId.CHANGE_PIN &&
		// 	dataStorage.currentScreenId !== ScreenId.SET_PIN
		// ) {
		// 	this.needClickToLogout = true;
		// 	setTimeout(() => {
		// 		showTokenWasChangedModal({
		// 			callback: (cb) => {
		// 				this.needClickToLogout = false;
		// 				Navigation.dismissModal({
		// 					animationType: 'none'
		// 				});
		// 				setTimeout(() => {
		// 					cb && typeof cb === 'function' && cb();
		// 				}, 200);
		// 			}
		// 		});
		// 	}, 300);
		// }
	}

	setLoginState(state) {
		this.loginSuccess = state;
	}

	async startAppFunction() {
		try {
			const listRegion = await getListRegion();
			console.log('listRegion', listRegion);
			dataStorage.listRegion = listRegion;
			navigationRef.navigate('Home');
		} catch (error) {
			dataStorage.listRegion = [];
			// loginError(error.message);
		}
	}

	reloadAppAfterLogin() {
		console.log('YOLO reloadAppAfterLogin vkl');
		this.callbackAfterLogin();
		// initApp(() => );
	}

	callbackAfterLogin() {
		console.log('DCM OPTIMIZE callbackAfterLogin START', new Date());
		try {
			// Sau khi dang nhap thanh cong thi vao day de check home screen
			// Get login user type
			const brokerName = store.getState().login.brokerName;
			setBrokerName(brokerName);
			postBrokerName2(brokerName);

			this.setLoginState(loginState.SUCCESS);
			// this.clearTimeoutLoging();
			if (dataStorage.checkUpdateApp) {
				dataStorage.checkUpdateApp(false, () => {
					this.goToApp();
				});
			} else {
				this.goToApp();
			}
		} catch (error) {
			logDevice(
				'error',
				`IOS - CALLBACK AFTER LOGIN -> GO TO HOME SCREEN EXCEPTION: ${error}`
			);
		}
	}

	//FUNC AFTER LOGIN OKTA SUCCESS
	goToApp() {
		// Set inApp status
		// const tabSelected = HOME_SCREEN[3];
		// dataStorage.tabIndexSelected = tabSelected.tabIndex;
		// const cb = (tabInfo = tabSelected) => {
		// 	// Exception when ko truyen tabInfor
		// 	Controller.setInAppStatus(true);
		// 	dataStorage.maintain.currentState !== true &&
		// 		showMainAppScreen({
		// 			...tabInfo,
		// 			...{
		// 				originActiveTab: this.notiData
		// 					? tabSelected.activeTab
		// 					: tabInfo.activeTab
		// 			}
		// 		});
		// 	this.resetNotiData();
		// 	func.setUpdateAfterChangeAppState(true);
		// };
		// if (this.notiData) {
		// 	getOrderDataBeforeShowDetail({
		// 		cb,
		// 		isOutApp: true,
		// 		notif: this.notiData
		// 	});
		// } else {
		// 	cb(tabSelected);
		// }
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
