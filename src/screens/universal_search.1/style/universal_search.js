import { Platform, StyleSheet, Dimensions, PixelRatio } from 'react-native';
import config from '../../../config';
import CommonStyle, { register } from '~/theme/theme_controller'
import * as PureFunc from '~/utils/pure_func'
import { dataStorage } from '../../../storage';
const { height, width } = Dimensions.get('window');

const styles = {}

function getNewestStyle() {
  const newStyle = StyleSheet.create({
    rowContainer: {
      backgroundColor: 'white',
      flexDirection: 'row',
      // height: CommonStyle.heightM,
      paddingVertical: 5,
      borderBottomWidth: 1,
      borderColor: '#0000001e',
      alignItems: 'center',
      marginHorizontal: 16
    },
    codeStyle: {
      fontSize: CommonStyle.fontSizeM,
      color: CommonStyle.fontColor,
      opacity: CommonStyle.opacity1,
      fontFamily: CommonStyle.fontFamily
    },
    companyStyle: {
      fontSize: CommonStyle.fontSizeS,
      color: CommonStyle.fontColor,
      opacity: CommonStyle.opacity2,
      fontFamily: CommonStyle.fontFamily
    },
    iconLeft: {
      color: '#df0000',
      fontSize: CommonStyle.iconSizeM,
      width: '10%',
      textAlign: 'left',
      paddingRight: CommonStyle.paddingDistance2
    },
    iconRight: {
      color: 'black',
      fontSize: CommonStyle.fontSizeXXL,
      width: '10%',
      textAlign: 'right',
      opacity: CommonStyle.opacity2
    },
    searchBarContainer: {
      height: 44,
      paddingLeft: CommonStyle.paddingDistance2,
      paddingRight: CommonStyle.paddingDistance2,
      borderBottomWidth: 1,
      borderTopWidth: 1,
      borderColor: '#0000001e',
      backgroundColor: 'white',
      justifyContent: 'center'
    },
    searchBarContainer2: {
      height: 48,
      width: width,
      flexDirection: 'row',
      marginTop: CommonStyle.marginSize - 4,
      alignItems: 'center',
      paddingLeft: CommonStyle.paddingDistance2,
      backgroundColor: config.colorVersion,
      shadowColor: 'rgba(76,0,0,0)',
      shadowOffset: {
        width: 0,
        height: 0.5
      }
    },
    searchBar: {
      borderWidth: 1,
      borderColor: '#0000001e',
      height: 30,
      borderRadius: CommonStyle.borderRadius,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center'
    },
    searchBar2: {
      backgroundColor: 'rgba(254, 254, 254, 0.2)',
      borderRadius: CommonStyle.borderRadius,
      height: 32,
      alignItems: 'center',
      flexDirection: 'row'
    },
    searchBar2Clone: {
      backgroundColor: 'rgba(254, 254, 254, 0.2)',
      flex: 1,
      borderRadius: 4,
      height: 32,
      alignItems: 'center',
      flexDirection: 'row'
    },
    iconSearch: {
      color: '#8e8e93',
      fontSize: CommonStyle.iconSizeS,
      paddingRight: CommonStyle.paddingDistance2
    },
    iconSearch2: {
      color: 'rgba(255, 255, 255, 0.54)',
      fontSize: CommonStyle.iconSizeS,
      paddingRight: CommonStyle.paddingDistance2,
      paddingLeft: CommonStyle.paddingDistance2
    },
    iconRight1: {
      color: '#ececec',
      fontSize: CommonStyle.iconSizeS,
      width: '10%',
      textAlign: 'right',
      paddingRight: CommonStyle.paddingDistance2
    },
    iconRight2: {
      color: 'rgba(255, 255, 255, 0.7)',
      fontSize: CommonStyle.iconSizeS,
      width: '10%',
      textAlign: 'right',
      paddingRight: CommonStyle.paddingDistance2
    },
    searchPlaceHolder: {
      color: '#8e8e93',
      fontSize: CommonStyle.fontSizeS,
      fontFamily: CommonStyle.fontFamily
    },
    whiteText: {
      color: '#FFFFFF',
      fontSize: CommonStyle.fontSizeM,
      fontFamily: CommonStyle.fontFamily
    },
    buttonCancel: {
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row'
    },
    buttonCancelClone: {
      justifyContent: 'center',
      alignItems: 'center',
      paddingLeft: 16.5
    },
    inputStyle: {
      backgroundColor: 'transparent',
      color: 'rgba(255, 255, 255, 087)',
      fontSize: CommonStyle.fontSizeS,
      fontFamily: CommonStyle.fontFamily,
      lineHeight: 12,
      height: 40
    },
    iconAdd: {
      width: '15%',
      color: CommonStyle.fontColor,
      fontSize: CommonStyle.iconSizeM,
      opacity: CommonStyle.opacity2
    },
    iconCheck: {
      width: '15%',
      color: '#00c752',
      fontSize: CommonStyle.iconSizeM
    },
    col11: {
      width: '48%'
    },
    col12: {
      width: '26%'
    },
    col13: {
      width: '26%'
    },
    col21: {
      width: '33%'
    },
    col22: {
      width: '20%'
    },
    col23: {
      width: '23%'
    },
    col24: {
      width: '24%'
    },
    rowExpandNews: {
      backgroundColor: 'white',
      flexDirection: 'row',
      marginHorizontal: 16,
      paddingVertical: 10,
      alignItems: 'center',
      borderColor: '#0000001e'
    },
    headerBorderTop: {
      marginHorizontal: 14,
      alignItems: 'center',
      flexDirection: 'column',
      justifyContent: 'center',
      paddingVertical: 6,
      borderBottomWidth: 1,
      borderBottomColor: CommonStyle.fontBorderGray
    },
    col31: {
      width: '28%'
    },
    col32: {
      width: '20%'
    },
    col33: {
      width: '22%'
    },
    col34: {
      width: '30%'
    },
    header: {
      marginHorizontal: CommonStyle.marginSize,
      flexDirection: 'row',
      borderBottomWidth: 0.5,
      borderBottomColor: 'white'
    },
    headerLeft: {
      backgroundColor: 'transparent',
      width: '50%',
      justifyContent: 'flex-end',
      flexDirection: 'row',
      borderRightWidth: 1,
      borderRightColor: 'white'
    },
    headerRight: {
      backgroundColor: 'transparent',
      width: '50%',
      justifyContent: 'flex-start',
      flexDirection: 'row',
      borderLeftWidth: 1,
      borderLeftColor: 'white'
    },
    rowContainer2: {
      flexDirection: 'row',
      width: '100%',
      paddingHorizontal: CommonStyle.paddingSize,
      paddingVertical: 6
    },
    rowContainer3: {
      flexDirection: 'row',
      width: '100%',
      paddingHorizontal: 0,
      paddingVertical: 6
    },
    header2: {
      paddingVertical: 6,
      marginHorizontal: CommonStyle.marginSize,
      backgroundColor: '#10a8b260',
      paddingHorizontal: CommonStyle.paddingSize,
      flexDirection: 'row',
      borderRadius: 1
    },
    header3: {
      paddingVertical: 6,
      marginHorizontal: 0,
      backgroundColor: '#10a8b260',
      paddingHorizontal: CommonStyle.paddingSize,
      flexDirection: 'row',
      borderRadius: 1
    },
    container: {
      height: height,
      backgroundColor: CommonStyle.backgroundColor,
      ...Platform.select({
        ios: {
        },
        android: {
        }
      })
    },
    headerBorder: {
      backgroundColor: 'white',
      paddingHorizontal: CommonStyle.paddingSizeOrders,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      paddingVertical: 6,
      // height: CommonStyle.heightM,
      width: '100%'
    },
    // textContent: {
    //   fontSize: CommonStyle.font13,
    //   color: '#757575',
    //   width: '32%'
    // },
    // textRow: {
    //   fontWeight: 'bold',
    //   fontSize: CommonStyle.font13
    // },
    headerContainer: {
      flexDirection: 'row',
      backgroundColor: 'transparent'
    },
    col1: {
      width: CommonStyle.fontRatio === 1 ? '30%' : '30%', paddingRight: 4
    },
    col2: {
      width: CommonStyle.fontRatio === 1 ? '20%' : '20%', paddingHorizontal: 4
    },
    col3: {
      width: CommonStyle.fontRatio === 1 ? '25%' : '25%', paddingHorizontal: 4
    },
    col4: {
      width: CommonStyle.fontRatio === 1 ? '25%' : '23%', paddingLeft: 4
    },
    col50: {
      width: '50%'
    },
    col25: {
      width: '25%'
    },
    colExpand: {
      width: '28%'
    },
    buttonWrapper: {
      width: '95%',
      height: 36,
      borderRadius: CommonStyle.borderRadius,
      alignItems: 'center',
      justifyContent: 'center'
    },
    expandRow: {
      width: '100%',
      // flex: 1,
      flexDirection: 'row',
      // height: 24,
      paddingTop: 4
    }
  });

  PureFunc.assignKeepRef(styles, newStyle)
}
getNewestStyle()
register(getNewestStyle)

export default styles;
