import _ from 'lodash';

export const ScreenEnum = {
	FIND_WATCH_LIST: 'FindWatchlist',
	CREATE_PRICEBOARD: 'CreatePriceboard',
	MANAGE_PRICEBOARD_PERSONAL: 'ManagePriceboardPersonal',
	MANAGE_PRICEBOARD: 'ManagePriceboard',
	MANAGE_PRICEBOARD_STATIC: 'ManagePriceboardStatic',
	APP: 'App',
	AUTO_LOGIN: 'AutoLogin',
	BUSY_BOX: 'BusyBox',
	HOME_PAGE: 'HomePage',
	SIGN_IN: 'SignIn',
	CONNECTING: 'Connecting',
	OVERVIEW: 'Overview',
	ABOUT_US: 'AboutUs',
	LOGS: 'Logs',
	NETWORK_ALERT: 'NetworkAlert',
	HOME: 'Home',
	LOGIN: 'Login',
	USER: 'User',
	SPLASH: 'Splash',

	MAIN: 'Main',
	ACTIVITIES: 'Activities',
	TRADE: 'Trade',
	QUICK_ACTION: 'QuickActions',
	PORTFOLIO: 'Portfolio',
	ORDERS: 'Orders',
};

// const addPreKeyScreen = () => {
// 	result = {};
// 	_.forEach(ScreenEnum, (value, key) => {
// 		result[key] = `equix.${value}`;
// 	});

// 	return result;
// };

// const EquixScreenEnum = addPreKeyScreen();

// module.exports = EquixScreenEnum;
