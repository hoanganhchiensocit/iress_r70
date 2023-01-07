import React, {
	useRef,
	useEffect,
	useCallback,
	useMemo,
	useState,
	useLayoutEffect
} from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	Dimensions,
	ActivityIndicator,
	Keyboard,
	Platform
} from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import Animated, { EasingNode as Easing } from 'react-native-reanimated';
import Shadow from '~/component/shadow';
import * as Emitter from '@lib/vietnam-emitter';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { runSpring } from '~/component/virtual_keyboard/HandleAnimation.js';
import { timing } from '~/lib/redash/index.js';
import * as Util from '~/util';
import CommonStyle, { register } from '~/theme/theme_controller';
import TouchableOpacityOpt from '~/component/touchableOpacityOpt/index';
import { getChannelChangeOrderError } from '~/streaming/channel';
import { dataStorage } from '~/storage';
export function getChannelChangeText(inputId) {
	return `${Channel.CHANGE_TEXT}#${inputId}`;
}
export function getChannelChangeTextFromSlider(inputId) {
	return `${Channel.CHANGE_TEXT}#SLIDER#${inputId}`;
}
export function getChannelDeleteText(inputId) {
	return `${Channel.DELETE_TEXT}#${inputId}`;
}
const {
	Value,
	event,
	useCode,
	block,
	call,
	set,
	cond,
	eq,
	Clock,
	and,
	stopClock,
	onChange,
	Extrapolate,
	sub,
	greaterThan
} = Animated;
export const Channel = {
	CHANGE_THIS_KEYBOARD: 'CHANGE_THIS_KEYBOARD',
	CHANGE_TEXT: 'CHANGE_TEXT',
	DELETE_TEXT: 'DELETE_TEXT',
	SHOW_HIDE: 'SHOW_HIDE',
	HIDE: 'HIDE',
	SHOW: 'SHOW',
	SHOW_KEYBOARD: 'SHOW_KEYBOARD',
	SHOW_BUTTON: 'SHOW_BUTTON',
	WILL_SHOW: 'WILL_SHOW',
	WILL_HIDE: 'WILL_HIDE',
	HIDE_KEYBOARD: 'HIDE_KEYBOARD',
	PUB_UNFOCUS_BY_INPUT_ID: 'PUB_UNFOCUS_BY_INPUT_ID'
};
const { width: widthDevices, height: heightDevices } = Dimensions.get('window');
export const TYPE_SHOW = {
	SHOW_BUTTON: 'SHOW_BUTTON',
	SHOW_KEYBOARD: 'SHOW_KEYBOARD'
};
const useGetStyleButton = function ({
	isConnected,
	isLoading,
	setDisabled,
	isBuy,
	forceDisabled
}) {
	return useMemo(() => {
		if (isConnected && !isLoading && !forceDisabled) {
			setDisabled(false);
			return {
				backgroundColor: isBuy
					? CommonStyle.color.btnReviewOrderBuy
					: CommonStyle.color.btnReviewOrderSell,
				color: CommonStyle.color.buyBTText
			};
		} else {
			setDisabled(true);
			return {
				backgroundColor: isBuy
					? CommonStyle.color.buyOrderButtonLoading
					: CommonStyle.color.sellOrderButtonLoading,
				color: CommonStyle.fontNearLight6
			};
		}
	}, [isConnected, isBuy, isLoading, forceDisabled, CommonStyle.color]);
};
function useListentLoading({ isLoading, setDisabled }) {
	return useEffect(() => {
		if (isLoading) {
			setDisabled(true);
		} else {
			setDisabled(false);
		}
	}, [isLoading]);
}
export const ButtomConfirm = function ({
	forceDisabled,
	heightTop,
	titleButton,
	isConnected,
	isBuy = true,
	onConfirm,
	isLoading,
	styleWrapper = {},
	txtStyle = {},
	translateY,
	iconReviewOrder2
}) {
	const [disabled, setDisabled] = useState(false);
	const { backgroundColor, color } = useGetStyleButton({
		isConnected,
		isLoading,
		setDisabled,
		isBuy,
		forceDisabled
	});
	const onPressReviewOrder = async function () {
		return onConfirm && onConfirm();
	};
	// useListentLoading({ isLoading, setDisabled })
	const midleTrigger = useMemo(() => {
		return sub(heightTop, new Value(32));
	}, []);

	const ReviewIcon = useMemo(() => {
		// if (isBuy) return CommonStyle.icons.reviewOrder2;
		return iconReviewOrder2
			? CommonStyle.icons.reviewOrder2
			: CommonStyle.icons.reviewOrder;
	}, [isBuy, CommonStyle.icons]);

	let animateStyles = {};
	if (translateY) {
		animateStyles = {
			opacity: Animated.interpolateNode(translateY, {
				inputRange: [0, midleTrigger, heightTop],
				outputRange: [0, 0, 1],
				extrapolate: Extrapolate.CLAMP
			}),
			transform: [
				{
					translateX: Animated.interpolateNode(translateY, {
						inputRange: [0, 8, heightTop],
						outputRange: [widthDevices, 0, 0],
						extrapolate: Extrapolate.CLAMP
					})
				}
			]
		};
	}
	return (
		<Animated.View
			style={[
				{
					backgroundColor: CommonStyle.backgroundColor
				},
				animateStyles
			]}
		>
			<Shadow
				setting={{
					radius: 0
				}}
			/>
			<View
				style={{
					backgroundColor: CommonStyle.backgroundColor,
					zIndex: 999
				}}
			>
				<Animated.View
					style={[
						{
							backgroundColor: backgroundColor,
							borderTopLeftRadius: 16,
							borderTopRightRadius: 16,
							paddingHorizontal: 32,
							paddingTop: 22,
							paddingBottom: 18,
							flexDirection: 'row',
							alignItems: 'center'
						},
						styleWrapper
					]}
				>
					<TouchableOpacityOpt
						onPress={onPressReviewOrder}
						disabled={disabled}
						style={{
							flexDirection: 'row',
							alignItems: 'center'
						}}
					>
						<Animated.View
							style={{
								flexDirection: 'row',
								flex: 1,
								justifyContent: 'center'
							}}
						>
							{isLoading && (
								<ActivityIndicator style={{ marginRight: 8 }} />
							)}
							<Text
								style={[
									{
										fontFamily: CommonStyle.fontPoppinsBold,
										fontSize: CommonStyle.fontSizeXL,
										color: isBuy
											? color
											: CommonStyle.color.textColor,
										textAlign: 'center',
										fontWeight: '600'
									},
									txtStyle
								]}
							>
								{titleButton}
							</Text>
						</Animated.View>
						{/* {
              isBuy ?
                <Ionicons
                  name={'md-send'}
                  size={26}
                  color={CommonStyle.fontBlack}
                /> : */}
						<ReviewIcon
							size={26}
							color={isBuy ? color : CommonStyle.color.textColor}
						/>
						{/* } */}
					</TouchableOpacityOpt>
				</Animated.View>
			</View>
		</Animated.View>
	);
};

const useListennerChangeThis = function (dic, showButton, showKeyboard) {
	return useLayoutEffect(() => {
		const id = Emitter.addListener(
			Channel.CHANGE_THIS_KEYBOARD,
			Util.getRandomKey(),
			({ inputId, isShowKeyBoard, coordinates, preText }) => {
				if (!isShowKeyBoard) return;
				dic.current.channelChangeText = getChannelChangeText(inputId);
				dic.current.inputId = inputId;
				dic.current.isShow = true;
				dic.current.coordinates = coordinates;
				dic.current.preText = preText;
				isShowKeyBoard && showKeyboard && showKeyboard();
			}
		);
		return () => {
			Emitter.deleteByIdEvent(id);
		};
	}, []);
};

function useOnShowButton(showButton) {
	return useLayoutEffect(() => {
		const id = Emitter.addListener(
			Channel.SHOW_BUTTON,
			Util.getRandomKey(),
			(type) => {
				showButton && showButton();
			}
		);
		return () => {
			Emitter.deleteByIdEvent(id);
		};
	}, []);
}
function useOnHideKeyBoard(showButton) {
	return useLayoutEffect(() => {
		const id = Emitter.addListener(
			Channel.HIDE_KEYBOARD,
			Util.getRandomKey(),
			(type) => {
				showButton && showButton();
			}
		);
		return () => {
			Emitter.deleteByIdEvent(id);
		};
	}, []);
}
function useOnHide(onHide) {
	return useLayoutEffect(() => {
		const id = Emitter.addListener(
			Channel.HIDE,
			Util.getRandomKey(),
			(type) => {
				onHide && onHide();
			}
		);
		return () => {
			Emitter.deleteByIdEvent(id);
		};
	}, []);
}
function useOnShowKeyboard(showKeyboard) {
	return useEffect(() => {
		const id = Emitter.addListener(
			Channel.SHOW_KEYBOARD,
			Util.getRandomKey(),
			(type) => {
				showKeyboard && showKeyboard();
			}
		);
		return () => {
			Emitter.deleteByIdEvent(id);
		};
	}, []);
}
const useOnLayoutHeightTopKeyBoard = function (heightTop, dic, showButton) {
	return useCallback((event) => {
		const { height } = event.nativeEvent.layout;
		dic.current.layout = event.nativeEvent.layout;
		heightTop.setValue(height);
		if (!dic.current.isReady) {
			dic.current.isReady = true;
			if (dic.current.promiseShowKeyboard) {
				showButton && showButton();
				dic.current.promiseShowKeyboard = false;
			}
		}
	}, []);
};
const useOnLayoutHeightButton = function (heightTop, dic, showButton) {
	return useCallback((event) => {
		const { height } = event.nativeEvent.layout;
		dic.current.heightButton = height;
	}, []);
};
const usePubTextToInput = function () {
	return useCallback(({ dic, newText }) => {
		newText = newText.toString();
		Emitter.emit(dic.current.channelChangeText, { newText });
	}, []);
};
const usePubDeleteTextToInput = function () {
	return useCallback(({ dic, newText }) => {
		if (dic.current.preText === '') {
			Emitter.emit(getChannelDeleteText(dic.current.inputId));
			return;
		}
		Emitter.emit(getChannelDeleteText(dic.current.inputId));
	}, []);
};
function KeyBoardWithButtomConfirm({
	titleButton,
	isBuy,
	onConfirm,
	renderMidleComp,
	isConnected,
	isLoading,
	forceDisabled
}) {
	const dic = useRef({
		isReady: false,
		type: null
	});
	const {
		gestureState,
		preState,
		nextState,
		velocityX,
		translationY,
		offsetY,
		disabledGesture,
		clock,
		isAndroid
	} = useMemo(() => {
		return {
			gestureState: new Value(State.UNDETERMINED),
			velocityX: new Value(0),
			translationY: new Value(0),
			offsetY: new Value(0),
			disabledGesture: new Value(1),
			clock: new Clock(),
			preState: new Value(State.UNDETERMINED),
			nextState: new Value(State.UNDETERMINED),
			isAndroid: new Value(Platform.OS === 'android' ? 1 : 0)
		};
	}, []);
	const onGestureEvent = useMemo(
		() =>
			event(
				[
					{
						nativeEvent: {
							translationY: translationY,
							velocityX: velocityX,
							state: gestureState
						}
					}
				],
				{ useNativeDriver: true }
			),
		[]
	);
	const heightTop = useMemo(() => {
		return new Animated.Value(0);
	}, []);
	const translateY = useMemo(() => {
		return new Animated.Value(heightDevices * 2);
	}, []);
	const showKeyboard = useCallback(() => {
		if (dic.current.type === 'KEYBOARD') return;
		dic.current.type = 'KEYBOARD';
		Emitter.emit(Channel.PUB_UNFOCUS_BY_INPUT_ID, {
			inputId: dic.current.inputId
		});
		Emitter.emit(Channel.WILL_SHOW, dic);
		Animated.timing(translateY, {
			toValue: 0,
			duration: 300,
			easing: Easing.inOut(Easing.ease)
		}).start(() => {
			disabledGesture.setValue(0);
		});
	}, []);
	const showButton = useCallback(() => {
		if (!dic.current.isReady) {
			return (dic.current.promiseShowKeyboard = true);
		} // Chua tinh duoc layout thi chua show

		if (dic.current.type === 'BUTTON') return;
		// if (dataStorage.currentScreenId !== ScreenId.ORDER) return;
		dic.current.type = 'BUTTON';
		Emitter.emit(Channel.WILL_HIDE);
		Keyboard.dismiss();
		Animated.timing(translateY, {
			toValue: heightTop,
			duration: 300,
			easing: Easing.inOut(Easing.ease)
		}).start();
	}, []);
	const hide = useCallback(() => {
		if (dic.current.type === null) return;
		dic.current.type = null;
		Animated.timing(translateY, {
			toValue: 1000,
			duration: 300,
			easing: Easing.inOut(Easing.ease)
		}).start();
	}, []);
	const pubTextToInput = usePubTextToInput();
	const pubDeleteToInput = usePubDeleteTextToInput();
	useListennerChangeThis(dic, showButton, showKeyboard);

	useOnHide(hide);
	useOnShowKeyboard(showKeyboard);
	useOnShowButton(showButton);
	useOnHideKeyBoard(showButton);
	const onCalHeightTopKeyBoard = useOnLayoutHeightTopKeyBoard(
		heightTop,
		dic,
		showButton
	);
	const onCalHeightButton = useOnLayoutHeightButton(
		heightTop,
		dic,
		showButton
	);
	useCode(
		block([
			onChange(
				gestureState,
				block([set(preState, nextState), set(nextState, gestureState)])
			),
			cond(
				and(
					eq(gestureState, State.END),
					eq(disabledGesture, 0),
					eq(preState, State.ACTIVE),
					greaterThan(translateY, 0)
				), // tren android khi touch vao number thi state bi change thanh end ios thi khong
				[
					set(
						translateY,
						timing({
							clock,
							from: translateY,
							to: heightTop
						})
					),
					set(offsetY, translationY)
				],
				cond(eq(disabledGesture, 0), [
					cond(
						eq(gestureState, State.BEGAN),
						[stopClock(clock), set(translateY, translationY)],
						cond(eq(gestureState, State.ACTIVE), [
							set(translateY, translationY)
						])
					)
				])
			),
			cond(and(eq(translateY, heightTop), eq(disabledGesture, 0)), [
				call(
					[
						translateY,
						disabledGesture,
						heightTop,
						gestureState,
						preState
					],
					([a, b, c, d, e]) => {
						dic.current.type = 'BUTTON';
						Emitter.emit(Channel.WILL_HIDE);
						Keyboard.dismiss();
					}
				),
				set(disabledGesture, 1),
				set(gestureState, State.UNDETERMINED)
			])
		]),
		[]
	);
	return (
		<Animated.View
			pointerEvents="box-none"
			style={[
				{ position: 'absolute', bottom: 0, left: 0, right: 0 },
				{
					transform: [
						{
							translateY: Animated.interpolateNode(translateY, {
								inputRange: [-1, 0, heightDevices * 2],
								outputRange: [0, 0, heightDevices * 2]
							})
							// translateY
						}
					]
				}
			]}
		>
			<ButtomConfirm
				styleWrapper={[
					{
						marginTop: 8
					}
				]}
				onLayout={onCalHeightButton}
				heightTop={heightTop}
				translateY={translateY}
				forceDisabled={forceDisabled}
				isLoading={isLoading}
				isConnected={isConnected}
				isBuy={isBuy}
				onConfirm={onConfirm}
				titleButton={titleButton}
			/>
			<PanGestureHandler
				onGestureEvent={onGestureEvent}
				onHandlerStateChange={onGestureEvent}
			>
				<Animated.View
					style={{
						alignItems: 'center',
						backgroundColor: CommonStyle.backgroundColor
						// paddingBottom: 8
					}}
					onLayout={onCalHeightTopKeyBoard}
				>
					<Shadow
						setting={{
							radius: 0
						}}
					/>
					<View
						style={{
							borderWidth: 1,
							borderColor: CommonStyle.color.dusk,
							width: '100%',
							borderBottomWidth: 0,
							backgroundColor: CommonStyle.backgroundColor,
							zIndex: 9999
						}}
					>
						{renderMidleComp && renderMidleComp()}
					</View>
					<NumberInput
						dic={dic}
						pubDeleteToInput={pubDeleteToInput}
						pubTextToInput={pubTextToInput}
					/>
				</Animated.View>
			</PanGestureHandler>
		</Animated.View>
	);
}
const NumberInput = React.memo(
	({ pubDeleteToInput, pubTextToInput, dic }) => {
		return (
			<View
				style={[
					{
						flexDirection: 'row',
						flexWrap: 'wrap',
						backgroundColor: CommonStyle.backgroundColor
					}
				]}
			>
				{[1, 2, 3, 4, 5, 6, 7, 8, 9].map((el) => {
					return (
						<TouchableOpacity
							style={{
								paddingVertical: 8,
								borderTopWidth: 1,
								borderLeftWidth: 1,
								borderColor: CommonStyle.fontNearLight3,
								width: widthDevices / 3,
								alignItems: 'center'
							}}
							onPress={() => {
								pubTextToInput &&
									pubTextToInput({ dic, newText: el });
							}}
						>
							<Text style={[CommonStyle.textNumberOfKeyBoard]}>
								{el}
							</Text>
						</TouchableOpacity>
					);
				})}
				<TouchableOpacity
					style={{
						paddingVertical: 8,
						paddingHorizontal: 48,
						width: widthDevices / 3,
						borderTopWidth: 1,
						borderLeftWidth: 1,
						borderColor: CommonStyle.fontNearLight3,
						justifyContent: 'center',
						alignItems: 'center',
						paddingBottom: 16
					}}
					onPress={() => {
						pubTextToInput && pubTextToInput({ dic, newText: '.' });
					}}
				>
					<Text style={[CommonStyle.textNumberOfKeyBoard]}>
						{'.'}
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={{
						paddingVertical: 8,
						paddingHorizontal: 48,
						width: widthDevices / 3,
						borderTopWidth: 1,
						borderLeftWidth: 1,
						borderColor: CommonStyle.fontNearLight3,
						justifyContent: 'center',
						alignItems: 'center',
						paddingBottom: 16
					}}
					onPress={() => {
						pubTextToInput && pubTextToInput({ dic, newText: '0' });
					}}
				>
					<Text style={[CommonStyle.textNumberOfKeyBoard]}>
						{'0'}
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={{
						paddingVertical: 8,
						paddingHorizontal: 32,
						width: widthDevices / 3,
						borderTopWidth: 1,
						borderLeftWidth: 1,
						borderColor: CommonStyle.fontNearLight3,
						justifyContent: 'center',
						alignItems: 'center',
						paddingBottom: 16
					}}
					onPress={() => {
						pubDeleteToInput && pubDeleteToInput({ dic });
					}}
				>
					<MaterialCommunityIcons
						color={CommonStyle.fontColor}
						name={'backspace-outline'}
						size={24}
					/>
				</TouchableOpacity>
			</View>
		);
	},
	() => true
);

export default KeyBoardWithButtomConfirm;
