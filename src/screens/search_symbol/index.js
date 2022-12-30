import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import { StyleSheet, Text, View, TouchableWithoutFeedback, Keyboard, Animated, Dimensions, LayoutAnimation } from 'react-native'
import * as Animatable from 'react-native-animatable';
import HeaderSearchSymbol from '~/component/search_symbol/Views/HeaderSearchSymbol.js'
import Content from '~/component/search_symbol/Views/Content.js'
import CommonStyle from '~/theme/theme_controller'
import * as FunctionUtil from '~/lib/base/functionUtil';
// import { Navigation } from 'react-native-navigation'
import { useDispatch } from 'react-redux';
import { dataStorage } from '~/storage';
import Navigation from '~/navigator/Navigation';
import { ScreenEnum } from '~/navigation';
const Index = () => {
	const refAnimatedView = useRef()
	const dispatch = useDispatch()
	const onSelectedSymbol = useCallback(({ symbol, exchange }) => {
		try {
			Keyboard.dismiss()
			dispatch.marketInfo.getSymbolInfo({ symbol, exchange });
			setTimeout(() => {
				try {
					Navigation.navigate(ScreenEnum.WATCH_LIST_DETAIL, {
						symbol,
						exchange,
						isBackToSearch: true
					})
				} catch (error) {

				}
			}, 0);
		} catch (error) {
			console.log('ERROR SYMBOL OR EXCHANGE UNDEFILE')
		}
	}, []);
	useEffect(() => {
		return () => dataStorage.isShowError = false
	})
	return (
		<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
			<View useNativeDriver={true} duration={300} ref={refAnimatedView} animation={'slideInUp'} style={{
				backgroundColor: CommonStyle.backgroundColor,
				paddingTop: FunctionUtil.getMarginTopDevice(),
				flex: 1
			}}>
				<View>
					<HeaderSearchSymbol onClose={Navigation.back} />
				</View>
				<View style={{
					flex: 1
				}}>
					<Content handleOnPressSymbol={onSelectedSymbol} />
				</View>
			</View>
		</TouchableWithoutFeedback>

	)
}

export default Index

const styles = StyleSheet.create({})
