import { Button, Card, message } from '../../components/UI';
import { selectConfig, updateConfigFilePath } from '../../modules/bridge';
import { Ctx } from '../ctx';
import './SelectConfig.scss';
import { useContext, useEffect, useState } from 'react';
import React from 'react';
import { isArray, isEmpty } from '../../modules/lodash';

const dataKey = 'config-data';

const getData = () => {
  const str = window.localStorage.getItem(dataKey);
  let data = {};
  try {
    data = JSON.parse(str || '');
  } catch (err) {}

  return data || {};
};

const setData = (key: string, value: any) => {
  const data = getData();

  data[key] = value;
  window.localStorage.setItem(dataKey, JSON.stringify(data));
};

export default () => {
  const delay = 100;
  const { state, dispatch } = useContext(Ctx);
  const [options, setOptions] = useState<any>([]);
  const { configFilePath } = state;
  const selectOneConfig = (filepath: string) => {
    console.log('selectOneConfig', filepath);
    dispatch({ type: 'setConfigFilePath', configFilePath: filepath });
    updateConfigFilePath(filepath);
  };
  const onGoback = () => {
    dispatch({ type: 'setShowSelectConfig', showSelectConfig: false });
  };
  const onClickSelect = () => {
    selectConfig().then((rs) => {
      console.log(1111, rs);
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
  useEffect(() => {
    const data = getData();
    if (!isEmpty(data)) {
      const optList: any = Object
      .keys(data)
      .map((key) => ({
        key,
        ...data[key],
      }))
      .sort((a, b) => a.alias > b.alias ? 1 : -1)
      setOptions(
        optList
      );
    }
  }, []);

  return (
    <div className="Select-config">
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
      {options.length ? (
        <div className="title">最近的项目</div>
      ) : null}
      <div className="cards">
        {options.map((item) => {
          return (
            <Card
              key={item.key}
              title={item.alias}
              bordered={false}
              onClick={onSelectCard.bind(null, item.key, item.alias)}
            >
              <p>{item.key}</p>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
