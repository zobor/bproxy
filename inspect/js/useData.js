
const { createContext } = React;

export const Ctx = createContext();

export const defaultState = {
  showDetail: false,
};

export const reducer = (state = defaultState, action) => {
    const actionMap = {};

    Object.keys(state).forEach((key) => {
        let fn = key.slice(0, 1).toUpperCase() + key.slice(1);
        fn = `set${fn}`;

        // 通用setter 方法
        // 特殊的setter就在actionMap里去独立实现
        if (!actionMap[fn]) {
            actionMap[fn] = () => {
              state[key] = action[key];
              return JSON.parse(JSON.stringify(state));
            };
        }
    });

    return actionMap[action.type] ? actionMap[action.type]() : state;
};
