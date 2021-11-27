import Form from 'antd/es/form';
import Input from 'antd/es/input';
import Radio from 'antd/es/radio';
import 'antd/es/radio/style/css';
import 'antd/es/input/style/css';
import 'antd/es/form/style/css';
import { useContext } from 'react';
import { Ctx } from '../../ctx';

const typesList: string[] = ["host", "path", "url"];

export default () => {
  const { state, dispatch } = useContext(Ctx);
  const { filterType, filterString, highlight } = state;
  const setType = (val: string) => {
    dispatch({ type: 'setFilterType', filterType: val });
  };
  const setFilter = (val: string) => {
    dispatch({ type: 'setFilterString', filterString: val });
  };
  const onTextChange = (e) => {
    setFilter(e.target.value.trim());
  };
  const onHighlighChange = (e) => {
    const v = e.target.value.trim();
    dispatch({ type: 'setHighlight', highlight: v });
  };

  return <div>
    <Form>
      <Form.Item label="过滤方式">
          <Radio.Group value={filterType} onChange={e => setType(e.target.value)}>
          {
            typesList.map((type: string) => <Radio.Button key={`filter-type-${type}`} value={type}>{type}</Radio.Button>)
          }
        </Radio.Group>
      </Form.Item>
      <Form.Item label="过滤值">
        <Input allowClear value={filterString} onChange={onTextChange} />
      </Form.Item>
      <hr />
      <Form.Item label="高亮">
        <Input allowClear value={highlight} onChange={onHighlighChange} />
      </Form.Item>
    </Form>
  </div>
}
