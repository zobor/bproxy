import { useContext, useEffect } from 'react';
import { Ctx } from '../../ctx';
import { Form, Input, Radio } from '../UI';

const typesList: string[] = ["host", "path", "url"];

interface FilterComponentProps {
  visible?: boolean;
}

export default (props: FilterComponentProps) => {
  const { visible } = props
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

  useEffect(() => {
    return () => {
      dispatch({ type: 'setUpdateRequestListFlag', updateRequestListFlag: Date.now()})
    }
  }, []);

  return <div>
    <Form labelCol={{span: 3}} wrapperCol={{span: 15}}>
      <Form.Item label="过滤方式">
          <Radio.Group value={filterType} onChange={e => setType(e.target.value)}>
          {
            typesList.map((type: string) => <Radio.Button key={`filter-type-${type}`} value={type}>{type}</Radio.Button>)
          }
        </Radio.Group>
      </Form.Item>
      <Form.Item label="过滤值">
        <Input placeholder="过滤功能会更新当前的列表" allowClear value={filterString} onChange={onTextChange} />
      </Form.Item>
      <hr />
      <Form.Item label="高亮">
        <Input placeholder="高亮不会修改列表，但是可以标记出来匹配上的列表元素" allowClear value={highlight} onChange={onHighlighChange} />
      </Form.Item>
    </Form>
  </div>
}
