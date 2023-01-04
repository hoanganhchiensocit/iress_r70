import _ from 'lodash';

export const ScreenEnum = {
	FIND_WATCH_LIST: 'FindWatchlist',
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

	CATEGORIES_WL: 'CategoriesWL',
	EDIT_WATCHLIST: 'EditWatchList',
	CREATE_PRICEBOARD: 'CreatePriceboard',
	SEARCH_SYMBOL: 'SearchSymbol',
	WATCH_LIST_DETAIL: 'WatchlistDetail',
	NEW_DETAIL: 'NewDetail',
	NEWS_DETAIL: 'NewsDetail'
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
