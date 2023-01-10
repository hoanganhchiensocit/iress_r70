import React, { Component } from 'react';
import {
	View,
	Dimensions,
	Image,
	Platform,
	Animated,
	AppState,
	StatusBar,
	Text
} from 'react-native';
import background from '../../img/background_mobile/ios82.png';
import backgroundAndroid from '../../img/background_mobile/android.png';
import logo from '../../img/background_mobile/logo.png';
import {
	getListRegion,
	postBrokerName2
} from '../home/Controllers/RegionController';
import { dataStorage, func } from '~/storage';
import Navigation from '~/navigator/Navigation';
import performanceEnum from '../../constants/performance';
import config from '../../config';
import ENUM from '~/enum';
import {
	checkNetworkConnection1,
	checkTouchIdSupport,
	clearAllItemFromLocalStorage,
	declareAnimation,
	declareParallelAnimation,
	declareSequenceAnimation,
	getLastTimeRenewToken,
	getOrderDataBeforeShowDetail,
	getSoftBarHeight,
	getTimezoneByLocation,
	logAndReport,
	logFirebase
} from '~/lib/base/functionUtil';
import * as Controller from '../../memory/controller';
import * as Business from '../../business';
import * as Channel from '../../streaming/channel';
import * as Emitter from '@lib/vietnam-emitter';
import * as Util from '../../util';
import * as settingActions from '../setting/setting.actions';
import * as loginActions from '../login/login.actions';
import * as appActions from '../../app.actions';
import * as ManageConnection from '../../manage/manageConnection';
import * as ManageAppstate from '../../manage/manageAppState';
import * as authSettingActions from '../../screens/setting/auth_setting/auth_setting.actions';
import * as RoleUser from '../../roleUser';
import * as api from '../../api';
import * as AppController from '../../app.controller';
import configureStore from '~/store/configureStore';
import { initApp } from '~/initStorage';
import Perf from '../../lib/base/performance_monitor';
import { resetLoginLoading } from '../login/login.actions';
import { setBrokerName } from '../home/Model/LoginModel';
import { logDevice } from '../../lib/base/functionUtil';
import { ScreenEnum } from '../../navigation';
import ScreenId from '~/constants/screen_id';
import {
	registerByAccount,
	registerByRoleGroup,
	registerByUser,
	registerNews,
	unregisterAllMessage,
	unregisterAllMessageByUser,
	unregisterAllMessageRoleGroup,
	unregisterNews
} from '~/streaming';
import {
	showDisclaimerScreen,
	showMainAppScreen,
	showNewOverViewScreen,
	showUpdateMeScreen
} from '~/navigation/controller.1';
import { changeTheme, FIXED_THEME } from '~/theme/theme_controller';
import { setUserId } from '~/lib/base/analytics';
import { initCacheOrderTransactions } from '~/cache';
import CheckUpdate from '~/component/check_update/check_update';
import DeviceInfo from 'react-native-device-info';
import { iconsLoaded } from '../../utils/AppIcons';
import ProgressBarLight from '~/modules/_global/ProgressBarLight';
import CommonStyle from '~/theme/theme_controller';
import I18n from '../../modules/language';
import { checkBiometricAvailable, getBiometricSetting, getLastUserOktaLoginId } from '~/manage/manageAuth';
import { isEmpty, size } from 'lodash';
import { buildStyle } from '~/build_style';
import { connect } from 'react-redux'

const { height, width } = Dimensions.get('window');
const topHeight = height * 0.45;
const MARGIN_TOP_LOGO_INIT = topHeight - 64;

const bottomHeight = height * 0.55;
const WELCOME_MARGIN_TOP = (bottomHeight - 64 - 64 - 128) / 2;
const MARGIN_TOP_LOGO_AFTER_ANIM = (topHeight - 64) / 2;

const loginState = {
	NOT: 0,
	LOGING: 1,
	SUCCESS: 2
};

const TIMEOUT_LOGING = 5000;

export const store = configureStore();
buildStyle();
dataStorage.platform = Platform.OS;

class Splash extends React.PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			ratio: 0,
			percent: 0,
			logoOpacity: new Animated.Value(0),
			logoMarginTop: new Animated.Value(MARGIN_TOP_LOGO_INIT),
			welcomeOpacity: new Animated.Value(0),
			busyBoxOpacity: new Animated.Value(0)
		};

		this.loginSuccess = loginState.NOT; //clear
		this.needClickToLogout = false;
		this.perf = new Perf(performanceEnum.start_app_ios);
		this.emailDefault = config.username; //clear
		this.passDefault = config.password; //clear
		this.isReady = true; //clear
		this.alreadyShowReauthenPopUp = false; //clear
		this.interVal = null;
		this.prevNetworkConnection = null; //clear
		this.update = null;

		this.startApp = this.startApp.bind(this);
		this.callbackAfterLogin = this.callbackAfterLogin.bind(this);
		this.showForm = this.showForm.bind(this);
		this.loginDefault = this.loginDefault.bind(this);
		this.startAppFunction = this.startAppFunction.bind(this);
		this.registerMessage = this.registerMessage.bind(this);
		this.startAppAfterLoadStore = this.startAppAfterLoadStore.bind(this);
		this.callbackDefault = this.callbackDefault.bind(this);
		this.autoLogin = this.autoLogin.bind(this);
		this.checkUpdateApp = this.checkUpdateApp.bind(this);
		this.clearCheckNetworkInterval = this.clearCheckNetworkInterval.bind(this);
		this.checkConnection = this.checkConnection.bind(this);
		this.openNoti = this.openNoti.bind(this);
		this.initNotiListener = this.initNotiListener.bind(this);
		this.showAlertChangePin = this.showAlertChangePin.bind(this);
		this._handleAppStateChange = this._handleAppStateChange.bind(this);
		this.showDisclaimer = this.showDisclaimer.bind(this);
		this.callBackAutoLogin = this.callBackAutoLogin.bind(this);
		this.goToApp = this.goToApp.bind(this);
		this.unregisterMessage = this.unregisterMessage.bind(this);
		this.getDefaultTimeZone = this.getDefaultTimeZone.bind(this);
		this.showMaintainModal = this.showMaintainModal.bind(this);
		this.reloadAppAfterLogin = this.reloadAppAfterLogin.bind(this);
		this.onCheck = this.onCheck.bind(this);
		this.onAccept = this.onAccept.bind(this);
		this.startAppFunction = this.startAppFunction.bind(this);

		this.downloadProgressCallback =
			this.downloadProgressCallback.bind(this);
		this.logoMarginTopAnim = declareAnimation(
			this.state.logoMarginTop,
			MARGIN_TOP_LOGO_AFTER_ANIM,
			500
		);
		this.logoOpacityAnim = declareAnimation(this.state.logoOpacity, 1, 500);
		this.opacityAnim = declareParallelAnimation([
			declareAnimation(this.state.welcomeOpacity, 1, 500),
			declareAnimation(this.state.busyBoxOpacity, 1, 500)
		]);
		this.setStatusBarMode();
	}

	setStatusBarMode() {
		StatusBar.setBarStyle('light-content');
	}

	downloadProgressCallback(progress) {
		try {
			const recei = progress.receivedBytes || 0;
			const total = progress.totalBytes || 0;
			let percent = 0;
			if (total) {
				percent = Math.round((recei / total) * 10000) / 100;
			}
			const downloadProgress = progress
				? `${progress.receivedBytes} of ${progress.totalBytes} bytes`
				: 'Caculating...';
			this.setState({
				ratio: percent
			});
			// dataStorage.callbackDownload && dataStorage.callbackDownload(downloadProgress, percent);
		} catch (error) {
			logDevice(
				'error',
				`NATIVE - downloadProgressCallback exception with ${error}`
			);
		}
	}

	setPercent(ratio, percent) {
		this.setState({ ratio, percent });
	}

	componentDidMount() {
		this.addToStorage();
	}

	initFunc() {
		Controller.setGlobalStore(store);
		Controller.setDispatchFunc(this.props.dispatch)
		declareSequenceAnimation([
			this.logoOpacityAnim,
			this.logoMarginTopAnim,
			this.opacityAnim
		]).start();

		this.update = new CheckUpdate(
			this.startAppAfterLoadStore,
			null,
			this.showForm
		);

		this.showForm(false);
		checkTouchIdSupport();
		if (config.clearLocalStorage) {
			clearAllItemFromLocalStorage();
		}
		getSoftBarHeight();
		AppController.handleEventApp();
		this.subForceReloadUser();
		this.getDefaultTimeZone();
		Business.getUserAgent();
		Business.getDeviceID();
		Business.initEnv();
		this.initNotiListener();

		this.startAppFunction()
	}

	addToStorage() {
		dataStorage.startApp = this.startAppFunction;
		dataStorage.unregisterMessage = this.unregisterMessage;
		dataStorage.reloadAppAfterLogin = this.reloadAppAfterLogin;
		dataStorage.checkUpdateApp = this.checkUpdateApp;
		dataStorage.loginDefault = this.loginDefault;
		dataStorage.clearCheckNetworkInterval = this.clearCheckNetworkInterval;
		dataStorage.deviceModel = DeviceInfo.getModel();
		dataStorage.deviceBrand = DeviceInfo.getBrand();
		dataStorage.disclaimerOncheck = this.onCheck;
		dataStorage.disclaimerAccept = this.onAccept;
		dataStorage.setNewPin = this.setNewPin;
		dataStorage.reloadAppAfterLogin = this.callbackAfterLogin;
		dataStorage.callBackAutoLogin = this.callBackAutoLogin;
		dataStorage.showAlertChangePin = this.showAlertChangePin;
		dataStorage.startAppAfterLoadStore = this.startAppAfterLoadStore;

		this.initFunc()
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

	openNoti(notif) {
		console.log('YOLO openNoti');
		try {
			const inApp = Controller.getInAppStatus();
			if (inApp) {
				getLastTimeRenewToken(() => this.openNotiInApp(notif));
			} else {
				this.setNotiData(notif);
			}
		} catch (error) {
			console.log('openNoti', error);
		}
	}

	initNotiListener() {
		console.log('YOLO initNotiListener');
		if (Platform.OS === 'android') {
			Business.createAndroidNotiChannel();
		}
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

	showAlertChangePin() {
		console.log('YOLO showAlertChangePin');
		if (
			!this.needClickToLogout &&
			dataStorage.emailLogin &&
			dataStorage.emailLogin !== config.username &&
			dataStorage.currentScreenId !== ScreenId.CHANGE_PIN &&
			dataStorage.currentScreenId !== ScreenId.SET_PIN
		) {
			this.needClickToLogout = true;
			setTimeout(() => {
				// Navigation.showModal({
				// 	screen: 'equix.TokenWasChanged',
				// 	animated: true,
				// 	animationType: 'fade',
				// 	navigatorStyle: {
				// 		navBarHidden: true,
				// 		screenBackgroundColor: 'transparent',
				// 		modalPresentationStyle: 'overCurrentContext'
				// 	},
				// 	passProps: {
				// 		callback: (cb) => {
				// 			this.needClickToLogout = false;
				// 			Navigation.dismissModal({
				// 				animationType: 'none'
				// 			});
				// 			setTimeout(() => {
				// 				cb && typeof cb === 'function' && cb();
				// 			}, 200);
				// 		}
				// 	}
				// });
			}, 300);
		}
	}

	unregisterMessage() {
		const accountId = dataStorage.accountId;
		const userId = Controller.getUserId();

		unregisterNews();

		if (accountId) {
			unregisterAllMessage(accountId);
		}
		if (userId) {
			unregisterAllMessageByUser(userId);
			unregisterAllMessageRoleGroup();
		}
	}

	registerMessage() {
		console.log('YOLO registerMessage');
		try {
			const accountId = dataStorage.accountId;
			const userId = Controller.getUserId();

			this.unregisterMessage();

			registerNews(preprocessNoti, 'ALL');

			if (accountId) {
				registerByAccount(accountId, preprocessNoti, 'ALL');
			}
			if (userId) {
				registerByUser(userId, preprocessNoti, 'ALL');
				registerByUser(userId, this.showAlertChangePin, 'AUTH');
				registerByRoleGroup(preprocessNoti, 'ALL');
			}
		} catch (error) {
			logFirebase('getToken error: ');
			logFirebase(error);
		}
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
		this.props.dispatch(appActions.changeConnection(isConnected));
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
			// Navigation.startSingleScreenApp({
			// 	screen: {
			// 		screen: 'equix.BusyBox',
			// 		navigatorStyle: {
			// 			drawUnderNavBar: true,
			// 			navBarHidden: true,
			// 			navBarHideOnScroll: false,
			// 			statusBarTextColorScheme: 'light',
			// 			navBarNoBorder: true
			// 		}
			// 	},
			// 	appStyle: {
			// 		orientation: 'portrait'
			// 	},
			// 	passProps: {
			// 		isUpgrade: true
			// 	},
			// 	animationType: 'none'
			// });
		}
	}

	clearCheckNetworkInterval() {
		if (this.interVal) {
			clearInterval(this.interVal);
		}
	}

	checkConnection(cb) {
		console.log('YOLO checkConnection');
		try {
			const handlerConenction = (isConnected) => {
				Emitter.emit(Channel.getChannelConnectionChange(), isConnected);
				logDevice(
					'info',
					`ANDROID => HANDLERCONNECTION CALLED - isConnected: ${isConnected} - this.isReady: ${this.isReady}`
				);
				if (!isConnected && this.isReady) {
					this.showForm(false);
				} else {
					if (isConnected && this.isReady) {
						cb && cb(isConnected);
					}
					this.isReady = false;
					this.handleConnectionChange(isConnected);
				}
			};

			const url = `${Controller.getBaseUrl(false)}/${Controller.getVersion(
				'version'
			)}/info`;
			if (!this.interVal) {
				checkNetworkConnection1(url, (cn) => {
					this.showMaintainModal();
					if (
						this.prevNetworkConnection === null ||
						this.prevNetworkConnection !== cn
					) {
						if (cn) {
							if (!dataStorage.isSignOut) {
								// dataStorage.callbackAfterReconnect && dataStorage.callbackAfterReconnect();
								// dataStorage.callbackAfterReconnect = null;
							}
							dataStorage.isSignOut = false;
						}
						handlerConenction(cn);
						this.prevNetworkConnection = cn;
					}
				});
			} else {
				clearInterval(this.interVal);
			}
			this.interVal = setInterval(() => {
				checkNetworkConnection1(url, (cn) => {
					this.showMaintainModal();
					ManageConnection.checkNetworkConnecting(
						this.prevNetworkConnection,
						cn
					);
					if (
						this.prevNetworkConnection === null ||
						this.prevNetworkConnection !== cn
					) {
						if (cn) {
							if (this.loginSuccess === loginState.LOGING) {
								this.clearTimeoutLoging();
								this.timeoutLoging = setTimeout(() => {
									console.log('YOLO relogin');
									this.startAppFunction();
								}, TIMEOUT_LOGING);
							} else {
								if (!dataStorage.isSignOut) {
									// dataStorage.callbackAfterReconnect && dataStorage.callbackAfterReconnect();
									// dataStorage.callbackAfterReconnect = null;
								}
								dataStorage.isSignOut = false;
							}
						}
						handlerConenction(cn);
						this.prevNetworkConnection = cn;
						// fbemit.emit('autoLoginChangeNetworkConnection', 'autologin', cn)
					}
				});
			}, 3000);
		} catch (error) {
			logDevice('info', `App Android Check connection error: ${error}`);
			logAndReport(`App Android Check connection error: ${error}`);
		}
	}

	_handleAppStateChange(nextAppState) {
		console.log('YOLO _handleAppStateChange');
		try {
			ManageConnection.setAppState(nextAppState);
			if (nextAppState === 'active') {
				ManageAppstate.reloadScreenAfterActive();
				this.update.checkSystemVersion().then((isNeedUpdate) => {
					if (isNeedUpdate) {
						this.showUpdateMe();
					} else {
						this.update.updateSoftware(false);
					}
				});
				if (func.getDiffTimeBackground()) {
					if (dataStorage.pinSetting !== 0) {
						const objStore = store.getState();
						let login = null;
						if (objStore) {
							login = objStore.login || {};
						}

						if (
							login &&
							login.loginObj &&
							login.loginObj.accessToken &&
							login.loginObj.refreshToken &&
							login.loginObj.pin &&
							login.email
						) {
							dataStorage.pin = Util.getPinOriginal(login.loginObj);
							dataStorage.reAuthen = true;
							if (
								Controller.getLoginStatus() &&
								this.alreadyShowReauthenPopUp === false
							) {
								this.alreadyShowReauthenPopUp = true;
								dataStorage.closeDrawerSignOut &&
									dataStorage.closeDrawerSignOut();
								// Navigation.showModal({
								// 	screen: 'equix.AutoLogin',
								// 	animated: true,
								// 	animationType: 'fade',
								// 	navigatorStyle: {
								// 		...CommonStyle.navigatorSpecialNoHeader,
								// 		screenBackgroundColor: 'transparent',
								// 		modalPresentationStyle: 'overCurrentContext'
								// 	},
								// 	passProps: {
								// 		callback: () => {
								// 			setTimeout(() => {
								// 				func.setLoginConfig(true);
								// 				Navigation.dismissModal({
								// 					animationType: 'none'
								// 				});
								// 			}, 200);
								// 			setTimeout(() => {
								// 				this.alreadyShowReauthenPopUp = false;
								// 			}, 4 * 60 * 1000);
								// 		},
								// 		byPassAuthenFn: this.autoLogin,
								// 		isModal: true,
								// 		token: login.loginObj.refreshToken
								// 	}
								// });
							}
						}
					}
				}
			} else if (nextAppState === 'background' || nextAppState === 'inactive') {
				func.setInactiveTime();
			}
		} catch (error) {
			logDevice('error', `_handleAppStateChange EXCEPTION - ${error}`);
		}
	}

	showUpdateMe() {
		console.log('YOLO showUpdateMe');
		showUpdateMeScreen();
	}

	async showForm(isUpdating) {
		console.log('YOLO showForm');
		await this.settingThemeBeforeLogin();
		// Navigation.startSingleScreenApp({
		// 	screen: {
		// 		screen: 'equix.BusyBox',
		// 		navigatorStyle: {
		// 			drawUnderNavBar: true,
		// 			navBarHidden: true,
		// 			navBarHideOnScroll: false,
		// 			statusBarTextColorScheme: 'light',
		// 			navBarNoBorder: true
		// 		}
		// 	},
		// 	appStyle: {
		// 		orientation: 'portrait'
		// 	},
		// 	passProps: {
		// 		isUpgrade: false,
		// 		isUpdating
		// 	},
		// 	animationType: 'none'
		// });
		// SplashScreen.hide();
	}

	async settingThemeBeforeLogin() {
		if (!FIXED_THEME)
			dataStorage.currentTheme = await Controller.getThemeColor();
		changeTheme(dataStorage.currentTheme);
	}

	setDataLoginSuccess = this.setDataLoginSuccess.bind(this);
	setDataLoginSuccess(userInfo) {
		try {
			// console.log('DCM OPTIMIZE setDataLoginSuccess START', new Date());
			const email = dataStorage.emailLogin;
			// Login success -> setpin isLoading = false
			setTimeout(() => {
				Controller.dispatch(authSettingActions.setPinSuccess());
			}, 1000);
			const userId = userInfo.user_id || userInfo.uid;
			dataStorage.user_id = userId;
			setUserId(userId); // Set id cho firebase analytics
			Controller.setLoginStatus(email !== config.username);
			func.setLoginUserType();
			// Controller.dispatch(loginSuccess(email, password));
			const listPromise = [
				RoleUser.getRoleData(),
				Business.getListAccount(userId)
			];
			console.log('DCM OPTIMIZE GET ROLE & GET LIST ACCOUNT START', new Date());
			Promise.all(listPromise).then(() => {
				console.log('DCM OPTIMIZE GET ROLE & GET LIST ACCOUNT END', new Date());
				if (dataStorage.accountId) {
					console.log('initCacheOrders - dataStorage.accountId');
					// initCacheOrders();
					initCacheOrderTransactions();
				}
				console.log(
					'DCM OPTIMIZE dataStorage.reloadAppAfterLogin START',
					new Date()
				);
				dataStorage.reloadAppAfterLogin && dataStorage.reloadAppAfterLogin();
			});
		} catch (error) {
			logDevice('info', `setDataLoginSuccess login action exception: ${error}`);
		}
	}

	callBackAutoLogin(token) {
		console.log('YOLO callBackAutoLogin');
		const objStore = store.getState();
		let login = null;
		if (objStore) {
			login = objStore.login || {};
			ckecked = login.checked || false;
			// func.setAccountId(login.accountId);
		}
		// Lay user info -> auto login
		// if (prop.login.accountId) {
		// 	func.setAccountId(prop.login.accountId);
		// }
		this.perf && this.perf.incrementCounter(performanceEnum.auto_login);

		const url = api.getUrlUserDetailByUserLoginId(dataStorage.emailLogin);
		api
			.requestData(url, true)
			.then(async (data) => {
				if (data) {
					// da lay duoc user info ko get user info lai o phan login action nua (dataStorage.isGettedUserInfo = true)
					Controller.setUserInfo(data);
					this.settingThemeBeforeLogin();
					// this.registerMessage();
					dataStorage.isGettedUserInfo = true;
					await RoleUser.getRoleData();
					this.autoLogin(null, true);
				} else {
					dataStorage.isGettedUserInfo = false;
					this.loginDefault();
				}
			})
			.catch((err) => {
				logDevice('error', `GET USERINFO ERROR - URL: ${url} - err: ${err}`);
			});
	}

	autoLogin = (notif, isStartApp) => {
		console.log('YOLO autoLogin');
		try {
			const objStore = store.getState();
			const login = objStore.login;
			dataStorage.emailLogin = login.email.toLowerCase().trim() || '';
			Controller.setLoginStatus(login.isLogin);
			if (login.token || isStartApp) {
				this.props.dispatch(
					loginActions.login(
						login.email,
						null,
						login.token,
						dataStorage.loginDefault
					)
				);
			}
		} catch (error) {
			// logDevice('error', `IOS autoLogin exception: ${error}`)
			console.log('IOS autoLogin error', error);
		}
	};

	loginDefault() {
		console.log('YOLO loginDefault');
		const objStore = store.getState() || {};
		const login = objStore.login || {};
		const checked = login.checked || false;
		this.callbackDefault();
		// if (checked || dataStorage.is_logout) {
		// 	this.callbackDefault();
		// } else {
		// 	this.showDisclaimer();
		// }
	}

	showDisclaimer() {
		console.log('YOLO showDisclaimer');
		dataStorage.checkUpdateApp &&
			dataStorage.checkUpdateApp(false, () => {
				// Timeout wait for busybox animation finish
				setTimeout(() => {
					dataStorage.maintain.currentState !== true &&
						showDisclaimerScreen({
							onCheck: this.onCheck,
							onAccept: this.onAccept.bind(this)
						});
				}, 1100);
			});

	}

	setNotiData(data) {
		this.notiData = data;
	}

	resetNotiData() {
		this.notiData = null;
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
			dataStorage.listRegion = listRegion;
		} catch (error) {
			dataStorage.listRegion = [];
			loginError(error.message);
		}

		try {
			const listRegionByEnv = dataStorage.listRegion.filter((item) => {
				const { region_type: regionType } = item;
				return regionType === ENUM.ENV_TYPE.UAT;
			});
			const sizeRegion = size(listRegionByEnv);
			Controller.dispatch(loginActions.changeBrokerName(config.envRegion));
			if (sizeRegion === 1) {
				const item = listRegionByEnv[0];
				Controller.setRegion(item.region_code);

				await postBrokerName2(config.envRegion);
			} else {
				const [storeRegion] = await this.getStorageInformation();

				if (storeRegion) {
					Controller.setRegion(storeRegion.region_code);
				}
				if (!isEmpty(storeRegion)) {
					await postBrokerName2(config.envRegion);
				}
			}

			const biometric = await getBiometricSetting();
			Controller.dispatch(settingActions.setBiometric(!!biometric));
		} catch (error) {
			loginActions.loginError(error.message);
		}

		dataStorage.isOkta = false;
		dataStorage.isLoggedInOkta = false;
		this.loginDefault();
	}

	getStorageInformation() {
		return new Promise((resolve) => {
			Promise.all([
				func.getRegionSelected(),
				func.getBrokerName(),
				func.getCacheLoginSuccess(),
				getLastUserOktaLoginId(),
				checkBiometricAvailable()
			])
				.then((res) => {
					resolve(res);
				})
				.catch((err) => {
					console.log(
						'getStorageInformation EXCEPTION',
						err,
						err.message
					);
					resolve([{}, 'false']); // Default value của region là {}, của loginSuccess là 'false'
				});
		});
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
			//DUCLM FUNC
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

	cb() {
		// Exception when ko truyen tabInfor
		Controller.setInAppStatus(true);
		dataStorage.maintain.currentState !== true && Navigation.navigate(ScreenEnum.HOME)
		this.resetNotiData();
		func.setUpdateAfterChangeAppState(true);
	};

	goToApp() {
		// Set inApp status
		if (this.notiData) {
			getOrderDataBeforeShowDetail({
				cb,
				isOutApp: true,
				notif: this.notiData
			});
		} else {
			console.log('goToApp cb')
			this.cb();
		}
	}

	clearTimeoutLoging() {
		this.timeoutLoging && clearTimeout(this.timeoutLoging);
	}

	setNewPin(objParam, token, localData) {
		console.log('YOLO setNewPin');
		if (localData) {
			// TH: autologin -> co local storage -> goi component AutoLogin de xac thuc -> run app
			dataStorage.userPin = localData;
			// Set touch id status on or off for auth setting screen
			if (
				localData.enableTouchID !== null &&
				localData.enableTouchID !== undefined
			) {
				this.props.dispatch(
					authSettingActions.setEnableTouchID(localData.enableTouchID)
				);
			}
		}
		// SplashScreen.hide();
		// Navigation.showModal({
		// 	screen: 'equix.SetPin',
		// 	animated: true,
		// 	animationType: 'slide-up',
		// 	navigatorStyle: {
		// 		statusBarColor: config.background.statusBar,
		// 		statusBarTextColorScheme: 'light',
		// 		navBarHidden: true,
		// 		navBarHideOnScroll: false,
		// 		navBarTextFontSize: 18,
		// 		drawUnderNavBar: true,
		// 		navBarNoBorder: true
		// 	},
		// 	passProps: {
		// 		type: 'new',
		// 		isShowCancel: false,
		// 		token,
		// 		objParam
		// 	}
		// });
		this.props.dispatch(loginActions.loginAppSuccess());
		this.perf && this.perf.stop();
	}

	async callbackDefault() {
		// Show login screen
		dataStorage.checkUpdateApp &&
			dataStorage.checkUpdateApp(false, async () => {
				dataStorage.isSignOut = true;
				dataStorage.closeModalSignOut && dataStorage.closeModalSignOut();
				dataStorage.closeDrawerSignOut && dataStorage.closeDrawerSignOut();
				if (dataStorage.loginAsGuest) {
					await this.settingThemeBeforeLogin();
					dataStorage.maintain.currentState !== true && showNewOverViewScreen();
				} else {
					const timeOut = dataStorage.is_logout ? 200 : 1100;
					setTimeout(() => {
						dataStorage.maintain.currentState !== true && this.goToApp();
						// showHomePageScreen();
					}, timeOut);
				}
				this.props.dispatch(loginActions.loginAppSuccess());
			});

		if (Controller.getLoginStatus()) {
			api.getUserPosition();
		}

		Controller.setLang('en');
		Controller.dispatch(settingActions.setLang('en'));
		Controller.setFontSize(ENUM.FONT_SIZES[1].value);
		Controller.dispatch(settingActions.setFontSize(ENUM.FONT_SIZES[1].value));
	}

	startApp() {
		console.log('YOLO startApp');
		this.callbackDefault()
	}

	onCheck(checked) {
		console.log('YOLO onCheck',checked);
		Controller.dispatch(loginActions.disclaimerDisplay(checked));
	}

	onAccept() {
		console.log('YOLO onAccept');
		try {
			this.startApp();
		} catch (err) {
			this.props.dispatch(loginActions.disclaimerDisplay(false));
		}
	}

	checkUpdateNative = this.checkUpdateNative.bind(this);
	checkUpdateNative(callback) {
		let isNeedUpdate = false;
		const byPass = false;
		const {
			iress = true,
			ios_build: iosBuild,
			ios_next_build: iosNextBuild,
			android_build: androidBuild,
			android_next_build: androidNextBuild
		} = dataStorage.systemInfo;
		Controller.setIressStatus(iress);
		// console.log('currentIosVersion', config.currentIosVersion)
		// console.log('dataStorage.systemInfo', dataStorage.systemInfo)
		if (Platform.OS === 'ios') {
			if (
				config.currentIosVersion <= iosBuild &&
				config.currentIosVersion <= iosNextBuild
			) {
				isNeedUpdate = true;
			}
		} else {
			if (
				config.currentAndroidVersion <= androidBuild &&
				config.currentAndroidVersion <= androidNextBuild
			) {
				isNeedUpdate = true;
			}
		}
		console.log('isNeedUpdate', isNeedUpdate)
		// Process
		if (isNeedUpdate) {
			this.showUpdateMe();
		} else {
			console.log('DCM OPTIMIZE checkUpdateApp END', new Date());
			callback && callback();
			this.update.updateSoftware(byPass);
			AppState.removeEventListener('change', this._handleAppStateChange);
			AppState.addEventListener('change', this._handleAppStateChange);
		}
	}

	checkUpdateApp(byPass = false, callback) {
		console.log('DCM OPTIMIZE checkUpdateApp START', new Date());
		try {
			// Check update native?
			!byPass && this.checkUpdateNative(callback);

			this.checkConnection((isConnected) => {
				if (byPass) {
					this.update.updateSoftware(byPass);
				} else {
					this.checkUpdateNative(callback);
				}
			});
		} catch (error) {
			logDevice('info', `ANDROID checkUpdateApp error: ${error}`);
		}
	}

	startAppAfterLoadStore() {
		console.log('YOLO startAppAfterLoadStore');
		try {
			this.props.dispatch(loginActions.setLoginFailed());
			iconsLoaded.then(() => {
				dataStorage.startApp = this.startAppFunction;

				this.startAppFunction();
				this.initNotification();
			});
		} catch (error) {
			logDevice('error', `START APP AFTER LOADSTORE EXCEPTION ${error}`);
			Alert.alert('Could not load resource. Please try again');
		}
	}

	initNotification() {
		console.log('YOLO initNotification');
		Business.requestNotiPermission();
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
								marginTop: this.state.logoMarginTop,
								opacity: this.state.logoOpacity
							}}
						>
							{this.renderLogo()}
						</Animated.View>
					</View>

					<View style={{ flex: 1, height: bottomHeight }}>
						<Animated.View
							style={{ opacity: this.state.busyBoxOpacity }}
						>
							<View
								style={{
									backgroundColor: 'transparent',
									height: 40,
									justifyContent: 'center',
									alignItems: 'center'
								}}
							>
								<ProgressBarLight
									color={CommonStyle.fontWhite}
								/>
							</View>
							{this.props.isUpgrade ? (
								<View
									style={{
										marginHorizontal: 32,
										justifyContent: 'center',
										alignItems: 'center'
									}}
								>
									<Text
										style={{
											fontSize: CommonStyle.fontSizeM,
											fontFamily: 'HelveticaNeue',
											fontWeight: 'bold',
											color: '#FFF'
										}}
									>
										{I18n.t('importantNotification')}
									</Text>
									<Text
										style={{
											fontSize: CommonStyle.fontSizeM,
											fontFamily: 'HelveticaNeue',
											color: '#FFF'
										}}
									>
										{I18n.t('upgradedSystem')}
									</Text>
								</View>
							) : this.props.isUpdating ? (
								<View
									style={{
										width,
										justifyContent: 'center',
										alignItems: 'center',
										flexDirection: 'row'
									}}
								>
									<Text
										style={[
											CommonStyle.textMainNoColor,
											{
												color: '#FFF',
												marginBottom: 4,
												textAlign: 'left'
											}
										]}
									>
										{I18n.t('updatingFirstCapitalize')}
									</Text>
									<Text
										style={[
											CommonStyle.textMainNoColor,
											{
												color: '#FFF',
												marginBottom: 4,
												textAlign: 'left'
											}
										]}
									>{` (${this.state.percent}%)...`}</Text>
								</View>
							) : (
								<Text
									style={[
										CommonStyle.textMainNoColor,
										{
											color: '#FFF',
											marginBottom: 4,
											textAlign: 'center'
										}
									]}
								>
									{I18n.t('connectingFirstCapitalize')}
								</Text>
							)}
						</Animated.View>
						{this.props.isUpgrade ? (
							<View />
						) : (
							<Animated.View
								style={{
									opacity: this.state.welcomeOpacity,
									marginHorizontal: 64,
									marginTop: WELCOME_MARGIN_TOP
								}}
							>
								<Text
									style={{
										textAlign: 'center',
										fontSize: CommonStyle.font30,
										fontFamily: 'HelveticaNeue-Medium',
										color: '#FFFFFF'
									}}
								>
									{I18n.t('WelComeTo')}
								</Text>
								<Text
									style={{
										textAlign: 'center',
										fontSize: CommonStyle.font30,
										fontFamily: 'HelveticaNeue-Medium',
										color: '#FFFFFF'
									}}
								>
									{I18n.t('appName')}
								</Text>
							</Animated.View>
						)}
					</View>
				</View>
			</View>
		);
	}
}
export default connect()(Splash);
