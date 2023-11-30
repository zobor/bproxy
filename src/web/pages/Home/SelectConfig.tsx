import React, { useContext, useEffect, useState } from 'react';
import { Button, Card, message } from '../../components/UI';
import { selectConfig, updateConfigFilePath } from '../../modules/bridge';
import { isArray, isEmpty, omit } from '../../modules/lodash';
import { Ctx } from '../ctx';
import Icon from '../../components/Icon';
import './SelectConfig.scss';
import { isObject } from 'lodash';
import { parseJSON } from '../../../utils/utils';
import classNames from 'classnames';

const dataKey = 'config-data';

const getData = () => {
  const str = window.localStorage.getItem(dataKey);
  let data = {};
  try {
    data = parseJSON(str || '');
  } catch (err) {}

  return data || {};
};

const setData = (key?: string, value?: any) => {
  const data = getData();

  if (!key && !isEmpty(value) && isObject(value)) {
    window.localStorage.setItem(dataKey, JSON.stringify(value));
  } else if (key) {
    data[key] = value;
    window.localStorage.setItem(dataKey, JSON.stringify(data));
  }
};

export default () => {
  const delay = 100;
  const { state, dispatch } = useContext(Ctx);
  const [options, setOptions] = useState<any>([]);
  const [updateFlat, setUpdateFlat] = useState<number>(Date.now());
  const { configFilePath } = state;
  const selectOneConfig = (filepath: string) => {
    dispatch({ type: 'setConfigFilePath', configFilePath: filepath });
    updateConfigFilePath(filepath);
  };
  const onGoback = () => {
    dispatch({ type: 'setShowSelectConfig', showSelectConfig: false });
  };
  const onClickSelect = () => {
    selectConfig().then((rs) => {
      if (isArray(rs) && rs.length && rs[0]) {
        const [filepath] = rs;
        selectOneConfig(filepath);
        setTimeout(() => {
          onGoback();
        }, delay);
        setData(filepath, {
          time: Date.now(),
          color: 'red',
          alias: filepath.split(filepath.includes('/') ? '/' : '\\').pop(),
        });
      }
    });
  };
  const onSelectCard = (filepath: string, alias: string) => {
    selectOneConfig(filepath);
    setTimeout(() => {
      onGoback();
    }, delay);
    message.success(`已切换配置：${alias}`);
  };
  const onRemove = (e: any, filepath: string, alias: string) => {
    const data = getData();
    if (data[filepath]) {
      const newData = omit(data, [filepath]);
      setData('', newData);
      setUpdateFlat(Date.now());
    }
    return e.stopPropagation();
  };
  useEffect(() => {
    const data = getData();
    if (!isEmpty(data)) {
      const optList: any = Object.keys(data)
        .map((key) => ({
          key,
          ...data[key],
        }))
        .sort((a, b) => (a.alias > b.alias ? 1 : -1));
      setOptions(optList);
    }
  }, [updateFlat]);

  useEffect(() => {
    const keyPress = ({ keyCode }) => {
      if (keyCode === 27) {
        dispatch({ type: 'setShowSelectConfig', showSelectConfig: false });
      }
    };

    document.addEventListener('keydown', keyPress);

    return () => {
      document.removeEventListener('keydown', keyPress);
    };
  }, []);

  return (
    <div className="Select-config">
      <div className="select-usage">
        友情提示：切换配置适用于多个项目并行的时候，不需要频繁地切换到对应项目目录下，再启动 bproxy。
      </div>
      <div className="current">
        <span>{configFilePath || '请选择需要调试的项目'}</span>
        <Button type="primary" onClick={onClickSelect}>
          选择项目目录
        </Button>
        {configFilePath ? (
          <Button className="cancelSelect" onClick={onGoback}>
            取消
          </Button>
        ) : null}
      </div>
      {options.length ? <div className="title">最近的项目</div> : null}
      <div className="cards">
        {options.map((item) => {
          return (
            <Card
              key={item.key}
              className={classNames({
                currentCard: configFilePath?.replace('/bproxy.config.js', '') === item.key,
              })}
              title={
                <>
                  <span className="firstChar">{item.alias.slice(0, 1)}</span>
                  {item.alias}
                  <Icon type="remove" onClick={(e) => onRemove(e, item.key, item.alias)} />
                </>
              }
              bordered={false}
              onClick={onSelectCard.bind(null, item.key, item.alias)}
            >
              <div>{item.key}</div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
