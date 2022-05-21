import { useCallback, useContext, useEffect, useState } from 'react';
import { Ctx } from '../../ctx';
import { Button, Form, Input, Radio, Select } from '../UI';

const typesList: string[] = ['url', 'host', 'path'];
const contentType: string[] = [
  'all',
  'html',
  'javascript',
  'json',
  'css',
  'image',
];

export default () => {
  const { state, dispatch } = useContext(Ctx);
  const { filterType, filterContentType, filterString, highlight, historyFilterStringData = [] } = state;
  const [historyFilterString, setHistoryFilterString] = useState<string[]>(historyFilterStringData);
  const [currentFilterText, setCurrentFilterText] = useState<string>('');
  const setType = (val: string) => dispatch({ type: 'setFilterType', filterType: val });
  const setContentType = (val: string) => dispatch({ type: 'setFilterContentType', filterContentType: val });
  const setFilter = (val: string) => dispatch({ type: 'setFilterString', filterString: val });

  const onTextChange = (v: string) => v.length && setCurrentFilterText(v);
  const onClearFilterText = () => setCurrentFilterText('');
  const onSelectFilterString = (v: string) => setFilter(v);
  const onSaveFilterValue = useCallback(
    () =>{
      if(currentFilterText &&
      !historyFilterString.includes(currentFilterText)) {
        setHistoryFilterString((pre) => [...pre, currentFilterText]);
        setFilter(currentFilterText);
      }
    },
    [historyFilterString, currentFilterText]
  );

  const onHighlighChange = (e) => dispatch({ type: 'setHighlight', highlight: e.target.value.trim() });
  const onClearHistory = () => {
    dispatch({
      type: 'setHistoryFilterStringData',
      historyFilterStringData: [],
    });
    setHistoryFilterString([]);
  };

  useEffect(() => {
    return () => {
      dispatch({
        type: 'setUpdateRequestListFlag',
        updateRequestListFlag: Date.now(),
      });
    };
  }, []);

  useEffect(() => {
    return () => {
      dispatch({
        type: 'setHistoryFilterStringData',
        historyFilterStringData: historyFilterString
      });
    };
  }, [historyFilterString]);

  return (
    <div>
      <Form labelCol={{ span: 3 }} wrapperCol={{ span: 15 }}>
        <Form.Item label="类型">
          <Radio.Group
            value={filterContentType}
            onChange={(e) => setContentType(e.target.value)}
          >
            {contentType.map((type: string) => (
              <Radio.Button key={`filter-content-type-${type}`} value={type}>
                {type}
              </Radio.Button>
            ))}
          </Radio.Group>
        </Form.Item>
        <Form.Item label="过滤方式">
          <Radio.Group
            value={filterType}
            onChange={(e) => setType(e.target.value)}
          >
            {typesList.map((type: string) => (
              <Radio.Button key={`filter-type-${type}`} value={type}>
                {type}
              </Radio.Button>
            ))}
          </Radio.Group>
        </Form.Item>
        <Form.Item label="过滤值">
          <Select
            placeholder="过滤功能会更新当前的列表"
            allowClear
            showSearch
            value={filterString}
            onSearch={onTextChange}
            onBlur={onSaveFilterValue}
            onClear={onClearFilterText}
            onChange={onSelectFilterString}
            style={{ width: '70%' }}
          >
            {historyFilterString.map(item => (
              <Select.Option key={`historyFilterString-${item}`} value={item}>{item}</Select.Option>
            ))}
          </Select>
          <Button onClick={onClearHistory}>清除历史记录</Button>
        </Form.Item>
        <Form.Item label="高亮">
          <Input
            placeholder="高亮不会修改列表，但是可以标记出来匹配上的列表元素"
            allowClear
            value={highlight}
            onChange={onHighlighChange}
          />
        </Form.Item>
      </Form>
    </div>
  );
};
