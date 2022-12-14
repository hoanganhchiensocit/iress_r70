import React, { Component } from 'react';
import {
	View,
	Text,
	Platform,
	Dimensions,
	PixelRatio,
	Keyboard,
	KeyboardAvoidingView
} from 'react-native';
import {
	logDevice, translateErrorCode
} from '../../lib/base/functionUtil';
import styles from './style/home_page.2';
import I18n from '../../modules/language/index'
import { dataStorage, func } from '../../storage'
import * as AuthBusiness from '../../channel/auth_business'
import ENUM from '../../enum'
import * as Util from '../../util';

// Component
import ErrorAnimation from '../../component/error_animation/error_animation'
import HeaderAccount from './child_component/header'
import ContentForgotPassword from './child_component/forgot_password/content_forgot_password.2'
import XComponent from '../../component/xComponent/xComponent'

const { height, width } = Dimensions.get('window');
export default class ForgotPassword extends XComponent {
	constructor(props) {
		super(props);

		this.init = this.init.bind(this)
		this.bindAllFunc = this.bindAllFunc.bind(this)
		this.bindAllFunc()
		this.init()
	}

	init() {
		try {
			this.dic = {
				channelChangeHeader: AuthBusiness.getChannelChangeHeaderAccount('forgot_password')
			}

			this.state = {
				errorText: '',
				isExpand: false
			}
			return true
		} catch (error) {
			console.log(error)
			return false
		}
	}

	bindAllFunc() {
		try {
			this.showError = this.showError.bind(this)
			return true
		} catch (error) {
			console.log(error)
			return false
		}
	}

	showError(errorCode) {
		let isExpand = false;
		let errorText = ''

		if (errorCode !== '') {
			errorText = translateErrorCode(errorCode)
			isExpand = true
		}
		return this.setState({
			errorText,
			isExpand
		})
	}

	render() {
		const ForgotPWComponent = Platform.OS === 'ios'
			? KeyboardAvoidingView
			: View
		const forgorPWComponentProps = Platform.OS === 'ios'
			? { behavior: 'padding' }
			: {}
		const { wrapperFlexEnd, errorTxt, wrapperErrorTxt } = styles
		return (
			<ForgotPWComponent
				{...forgorPWComponentProps}
				style={[
					wrapperFlexEnd, { height: Util.isIOS() ? height - 48 : height }
				]}>
				<View style={{ marginBottom: 12, height: 50 }}>
					<ErrorAnimation
						isExpand={this.state.isExpand}
						textStyle={errorTxt}
						errorStyle={wrapperErrorTxt}
						errorText={this.state.errorText}
						callbackHideError={this.showError}
						duration={500}
						timeOutErrorHidden={ENUM.TIMEOUT_HIDE_ERROR} />
				</View>

				<HeaderAccount
					title={I18n.t('forgotPassword')}
					content={I18n.t('forgotPasswordWithCodeRemind')}
					channelChangeHeader={this.dic.channelChangeHeader} />
				<ContentForgotPassword
					showError={this.showError}
					channelChangeHeader={this.dic.channelChangeHeader}
					cancelFn={this.props.cancelFn} />
			</ForgotPWComponent>
		);
	}
}
