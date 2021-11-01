import { createContext } from 'react';
// import {cloneDeep} from 'lodash';

type contextData = {
    [key: string]: any;
}
type actionData = {
    [key: string]: any;
};

export const Ctx = createContext({} as contextData);

export const defaultState = {
  showDetail: false,
  detailActiveTab: 'custom',
  requestId: '',
  proxySwitch: true,
  filterType: 'url',
  filterString: '',
  ready: false,
  disableCache: false,
  clean: () => {},
};

export const reducer = (state = defaultState, action: actionData) => {
    const actionMap: contextData = {};

    Object.keys(state).forEach((key) => {
        let fn = key.slice(0, 1).toUpperCase() + key.slice(1);
        fn = `set${fn}`;

        // 通用setter 方法
        // 特殊的setter就在actionMap里去独立实现
        if (!actionMap[fn]) {
            actionMap[fn] = () => ({
                ...state,
                [key]: action[key],
            });
        }
    });

    return actionMap[action.type] ? actionMap[action.type]() : state;
};
