import * as React from "react";
import {
  View,
  StyleSheet,
  Platform,
  Dimensions,
  TouchableOpacity,
  Animated
} from 'react-native';

import Svg, { Path } from 'react-native-svg';
import CommonStyle from '~/theme/theme_controller';
// import { Navigation } from 'react-native-navigation'
import {
  resetAnimation,
  checkDisableScreenByRole
} from '~/lib/base/functionUtil';
// Components
import Tabs from './tabs';
import TabInfo from '~/constants/tabs';
import DebonceButton from '~/component/debounce_button';

import { func, dataStorage } from '~/storage';
import * as Controller from '~/memory/controller';
import { showNewOrderModal } from '~/navigation/controller.1';
import * as RoleUser from '~/roleUser';
import Enum from '~/enum';
import { Component } from "react";
import { ScreenEnum } from "../../navigation";

const { NAME_PANEL } = Enum;
const { ROLE_USER } = Enum;
const NewTouchableOpacity = DebonceButton(TouchableOpacity, 500);
const { width, height: HEIGHT_DEVICE } = Dimensions.get('window');
const WIDTH_DEVICE =
  Platform.OS === 'ios' ? width : width % 2 === 0 ? width : width + 1;
const HEIGHT_TABBAR = CommonStyle.heightTabbar;

const CIRCLE_RADIUS = 25;
const CORNER_RADIUS = 8;
const SPACE = 8;
const DELTA = 8;

const TAB_ID = {
  OVERVIEW: 0,
  WATCHLIST: 1,
  NEW_ORDER: 2,
  PORTFOLIO: 3,
  ORDERS: 4
};

export default class MyBottomTabBar extends Component {
  // props ({ state, descriptors, navigation })

  constructor(props) {
    super(props);
    this.translateAnim = new Animated.Value(HEIGHT_TABBAR);
    this.opacityAnim = new Animated.Value(1);
    this.openNewOrder = this.openNewOrder.bind(this);
    this.onLayout = this.onLayout.bind(this);

    //ChienHA
    // if (typeof this.props.index === 'number') {
    //   this.setTabActive = this.setTabActive.bind(this);
    //   dataStorage.setTabActive[this.props.index] = this.setTabActive;
    // }
  }

  componentDidMount() {
    this.props.setRef && this.props.setRef(this);
  }

  checkDisableOrder = this.checkDisableOrder.bind(this);

  checkDisableOrder() {
    // Disable function with IRESS MOBILE
    // return true;
    const enabled =
      Controller.getLoginStatus() &&
      !dataStorage.isLockedAccount &&
      dataStorage.loginUserType !== 'REVIEW' &&
      !dataStorage.isNotHaveAccount &&
      RoleUser.checkRoleByKey(
        Enum.ROLE_DETAIL.PERFORM_NEW_ORDER_QUICK_BUTTON
      ) &&
      func.isAccountActive();
    return !enabled;
  }

  async openNewOrder() {
    dataStorage.isShowError = false;
    const nextScreenObj = {
      screen: 'equix.SearchSymbol',
      // title: I18n.t('alertUpper'),
      backButtonTitle: ' ',
      animated: true,
      animationType: 'slide-horizontal',
      passProps: {
        namePanel: NAME_PANEL.ADD_AND_SEARCH,
        isSwitchFromQuickButton: true,
        enabledGestureInteraction: false
      },
      navigatorStyle: CommonStyle.navigatorSpecialNoHeader
    };
    Controller.setStatusModalCurrent(true);
    //ChienHA open new
    // this.props.navigator.push(nextScreenObj);
    return;
  }

  onLayout(event) {
    this.props.onLayout && this.props.onLayout(event);
  }

  changeTabActive(tabIndex) {
    const routers = this.props.state.routes;
    const router = routers[tabIndex];

    const isFocused = this.props.state.index === tabIndex;
    const event = this.props.navigation && this.props.navigation.emit({
      type: 'tabPress',
      target: router.key,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      // The `merge: true` option makes sure that the params inside the tab screen are preserved
      this.props.navigation && this.props.navigation.navigate({ name: router.name, merge: true });
    }

    //ChienHA
    // this.props.navigator.dismissAllModals();
    func.setTabActive(tabIndex);
    // this.props.navigator.popToRoot({
    // 	// reset Stack hien tai
    // 	animated: false
    // });
    // resetAnimation();
    switch (tabIndex) {
      // bo selected o menu drawer
      case 0:
        dataStorage.changeMenuSelected &&
        dataStorage.changeMenuSelected(
          Enum.MENU_SELECTED.activities
        );
        break;
      case 1:
        dataStorage.changeMenuSelected &&
        dataStorage.changeMenuSelected(
          Enum.MENU_SELECTED.watchlist_drawer
        );
        break;
      case 3:
        dataStorage.changeMenuSelected &&
        dataStorage.changeMenuSelected(
          Enum.MENU_SELECTED.portfolio
        );
        break;
      case 4:
        dataStorage.changeMenuSelected &&
        dataStorage.changeMenuSelected(Enum.MENU_SELECTED.orders);
        break;
      default:
        dataStorage.changeMenuSelected &&
        dataStorage.changeMenuSelected(null);
        break;
    }

    // this.props.navigator &&
    // this.props.navigator.switchToTab({
    //   tabIndex
    // });
    // console.info('tabIndex', tabIndex);
    dataStorage.setTabActive[tabIndex] &&
    dataStorage.setTabActive[tabIndex](tabIndex);
  }

  renderQuickButton() {
    const isDisable = this.checkDisableOrder();
    const svgColor = {
      tabColor: CommonStyle.color.dusk_tabbar,
      bgColor: CommonStyle.backgroundColorNews,
      iconColor: CommonStyle.color.dusk_tabbar
    };
    return (
      <NewTouchableOpacity
        style={[
          styles.quickButton,
          {
            backgroundColor: isDisable
              ? CommonStyle.btnOrderDisableBg
              : CommonStyle.color.modify
          }
        ]}
        disabled={isDisable}
        onPress={this.openNewOrder}
      >
        <CommonStyle.icons.tabBarMain
          name="equixLogo"
          size={30}
          color={svgColor.iconColor}
        />
      </NewTouchableOpacity>
    );
  }

  renderTabs() {
    const tabList = TabInfo;
    const tabIndexSelected = this.props.state.index;

    return (
      <View style={styles.tabsContainer} pointerEvents="box-none">
        {tabList.map((e, i) => {
          let isDisable = false;
          if (e.id === TAB_ID.OVERVIEW) {
            isDisable = checkDisableScreenByRole(
              ROLE_USER.ROLE_MARKET_OVERVIEW
            );
          }
          // Disable function with IRESS MOBILE

          return (
            <Tabs
              key={`tabbarIndex_${i}`}
              onPress={() => this.changeTabActive(i)}
              tabIndexSelected={tabIndexSelected}
              tabIndex={i}
              isDisable={isDisable}
              tabName={e.tabName}
              iconName={e.iconName}
              iconType={e.iconType}
              labelTest={e.accessibilityLabel}
              idTest={e.testId}
            />
          );
        })}
      </View>
    );
  }


  render() {
    let ditchControlPointDx = CIRCLE_RADIUS + SPACE;
    let ditchControlPointDy = CIRCLE_RADIUS + SPACE / 2;
    let startingPointX = WIDTH_DEVICE / 2;
    let startingPointY = 2 * CIRCLE_RADIUS + SPACE;
    const HEIGHT_TABBAR_MOD = HEIGHT_TABBAR - 2 * CIRCLE_RADIUS - SPACE;
    const svgColor = {
      tabColor: CommonStyle.color.dusk_tabbar,
      bgColor: CommonStyle.backgroundColorNews,
      iconColor: CommonStyle.color.dusk
    };

    return <View style={styles.bottomTabBar} pointerEvents="box-none">
      {this.renderQuickButton()}
      {this.renderTabs()}
      <Svg width={WIDTH_DEVICE} height={HEIGHT_TABBAR}>
        <Path
          stroke={svgColor.tabColor}
          fill={svgColor.tabColor}
          d={`
                M ${startingPointX},${startingPointY}
                q -${
          ditchControlPointDx - DELTA
            },0 -${ditchControlPointDx},-${ditchControlPointDy}
                t -${ditchControlPointDx},-${ditchControlPointDy}
                L 0,0
                v ${HEIGHT_TABBAR}
                h ${WIDTH_DEVICE / 2}
                v -${HEIGHT_TABBAR_MOD}
                q ${
          ditchControlPointDx - DELTA
            },0 ${ditchControlPointDx},-${ditchControlPointDy}
                t ${ditchControlPointDx},-${ditchControlPointDy}
                L ${WIDTH_DEVICE},0
                v ${HEIGHT_TABBAR}
                h -${WIDTH_DEVICE / 2}
              `}
        />
      </Svg>
    </View>
  }
}


const styles = StyleSheet.create({
  container: {
    width: WIDTH_DEVICE,
    position: 'absolute',
    zIndex: 99,
    // bottom: -84,
    bottom: 0,
    // left: 0,
    // right: 0,
    backgroundColor: 'transparent',
    // transform: [{
    //   translateY: 0
    // }],
    alignItems: 'center'
  },
  quickButton: {
    display: 'flex',
    position: 'absolute',
    marginLeft: 'auto',
    marginRight: 'auto',
    justifyContent: 'center',
    zIndex: 100,
    alignItems: 'center',
    width: CIRCLE_RADIUS * 2,
    height: CIRCLE_RADIUS * 2,
    borderRadius: CIRCLE_RADIUS,
    shadowColor: 'rgba(0,0,0,0.2)',
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 6
  },
  bottomTabBar: {
    position: 'absolute',
    bottom: 220,
    left: 0,
    right: 0,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    width: WIDTH_DEVICE,
    height: HEIGHT_TABBAR,
    overflow: 'hidden',
    backgroundColor: CommonStyle.backgroundColor,
    borderTopLeftRadius: CORNER_RADIUS,
    borderTopRightRadius: CORNER_RADIUS
  },
  tabsContainer: {
    display: 'flex',
    position: 'absolute',
    zIndex: 999,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    width: WIDTH_DEVICE
  }
});
