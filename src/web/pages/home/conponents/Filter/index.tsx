import Form from 'antd/es/form';
import Input from 'antd/es/input';
import Radio from 'antd/es/radio';
import 'antd/es/radio/style/css';
import 'antd/es/input/style/css';
import 'antd/es/form/style/css';
import { useState } from 'react';

const typesList: string[] = ["hostname", "query", "url"];

export default () => {
  const [type, setType] = useState<string>(typesList[0]);
  return <div>
    <Form>
      <Form.Item label="过滤方式">
          <Radio.Group value={type} onChange={e => setType(e.target.value)} defaultValue="a">
          {
            typesList.map((type: string) => <Radio.Button key={`filter-type-${type}`} value={type}>{type}</Radio.Button>)
          }
        </Radio.Group>
      </Form.Item>
      <Form.Item label="过滤值">
        <Input />
      </Form.Item>
    </Form>
  </div>
}
