import React, { useCallback } from 'react'
import { StyleSheet, View, Dimensions } from 'react-native'
import AlertList from '~s/alertLog/View/AlertList'
import NotifcationList from '~/screens/alertLog/View/NotificationList'
import ENUM from '~/enum'
import { getAlertTag, getListAlertID } from '~s/alertLog/Model/AlertLogModel';

const { ALERT_TAG } = ENUM
const { width: DEVICE_WIDTH } = Dimensions.get('window')
const Content = ({ navigator, updateActiveStatus, activeTab }) => {
    const renderContent = useCallback(() => {
        switch (activeTab) {
            case ALERT_TAG.ALERT:
                return <AlertList
                    navigator={navigator}
                    updateActiveStatus={updateActiveStatus}
                />
                break;
            case ALERT_TAG.NOTIFICATION:
                return <NotifcationList />
        }
    }, [activeTab])

    return (
        <View style={{ flex: 1 }}>
            {renderContent()}
        </View>
    )
}

export default Content

const styles = StyleSheet.create({})
