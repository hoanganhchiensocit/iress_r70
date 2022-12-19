import {createNavigationContainerRef, StackActions, useNavigation} from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef()

//các hàm hỗ trợ sẵn
function navigate(name, params) {
    if (navigationRef.isReady()) {
        navigationRef.navigate(name, params);
    }
}

function back(name, params) {
    if (navigationRef.isReady()) {
        navigationRef.goBack(name, params);
    }
}

function reset(name, params) {
    if (navigationRef.isReady()) {
        navigationRef.resetRoot({
            index: 0,
            routes: [{name: name, params: params}],
        });
    }
}

//các hàm qua stack action
function replace(name, params = {}) {
    const replaceAction = StackActions.replace(name, params);
    if (navigationRef.isReady) {
        navigationRef.dispatch(replaceAction)
    }
}

function useNavigationCustoms() {
    const navigation = useNavigation();
    return navigation;
}

export default {
    navigate,
    back,
    reset,
    replace,
    useNavigationCustoms
}
