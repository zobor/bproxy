import React, { useCallback, useContext, useState } from 'react';
import { Ctx } from '../../pages/ctx';
import { Button, Form, Input, Radio } from '../UI';
import Icon from '../Icon';
import './index.scss';

const typesList: string[] = ['url', 'host', 'path'];
const requestMethods: string[] = ['all', 'get', 'post'];
const contentType: string[] = [
  'all',
  'html',
  'javascript',
  'json',
  'css',
  'image',
  'xhr/fetch',
];

function RequestMethod() {
  const { state, dispatch } = useContext(Ctx);
  const { filterRequestMethod } = state;
  const setRequestMethod = (val: string) =>
    dispatch({ type: 'setFilterRequestMethod', filterRequestMethod: val });

  return (
    <Form.Item label="请求类型">
      <Radio.Group
        value={filterRequestMethod}
        onChange={(e) => setRequestMethod(e.target.value)}
      >
        {requestMethods.map((type: string) => (
          <Radio.Button key={`filter-type-${type}`} value={type}>
            {type}
          </Radio.Button>
        ))}
      </Radio.Group>
    </Form.Item>
  );
}

function ContentType() {
  const { state, dispatch } = useContext(Ctx);
  const { filterContentType } = state;
  const setContentType = (val: string) =>
    dispatch({ type: 'setFilterContentType', filterContentType: val });

  return (
    <Form.Item label="数据类型" className="bp-filter-form-item-content-type">
      <Radio.Group
        value={filterContentType}
        onChange={(e) => setContentType(e.target.value)}
      >
        {contentType.map((type: string) => (
          <Radio.Button key={`filter-content-type-${type}`} value={type}>
            <Icon type={type} />
            {type}
          </Radio.Button>
        ))}
      </Radio.Group>
    </Form.Item>
  );
}

function MatchType() {
  const { state, dispatch } = useContext(Ctx);
  const { filterType, filterString } = state;
  const setType = (val: string) =>
    dispatch({ type: 'setFilterType', filterType: val });

  return (
    <Form.Item label="匹配类型">
      <Radio.Group disabled={!filterString} value={filterType} onChange={(e) => setType(e.target.value)}>
        {typesList.map((type: string) => (
          <Radio.Button key={`filter-type-${type}`} value={type}>
            {type}
          </Radio.Button>
        ))}
      </Radio.Group>
    </Form.Item>
  );
}

function Highlight() {
  const { state, dispatch } = useContext(Ctx);
  const { highlight } = state;
  const onHighlighChange = (e) =>
    dispatch({ type: 'setHighlight', highlight: e.target.value.trim() });

  return (
    <Form.Item label="高亮">
      <Input
        placeholder="高亮不会修改列表，但是可以标记出来匹配上的列表元素，高亮多个可以使用｜分隔"
        allowClear
        value={highlight}
        onChange={onHighlighChange}
      />
    </Form.Item>
  );
}

function FilterValue() {
  const { state, dispatch } = useContext(Ctx);
  const { filterString } = state;
  const [currentFilterText, setCurrentFilterText] = useState<string>(filterString || '');

  const setFilter = (val: string) =>
    dispatch({ type: 'setFilterString', filterString: val });

  const onChangeFilterString = (e: any) =>
    setCurrentFilterText(e.target.value.trim());
  const onSaveFilterValue = useCallback(
    () => setFilter(currentFilterText.trim()),
    [currentFilterText]
  );

  return (
    <Form.Item label="过滤值">
      <Input
        placeholder="过滤功能会更新当前的列表，过滤多个可以使用｜分隔"
        value={currentFilterText}
        onInput={onChangeFilterString}
        style={{ width: '80%' }}
      />
      <Button style={{ width: '20%' }} onClick={onSaveFilterValue}>
        保存
      </Button>
    </Form.Item>
  );
}

function Filter() {
  return (
    <div>
      <Form labelCol={{ span: 3 }} wrapperCol={{ span: 15 }}>
        <RequestMethod />
        <ContentType />
        <MatchType />
        <Highlight />
        <FilterValue />
      </Form>
    </div>
  );
}

export default Filter;
