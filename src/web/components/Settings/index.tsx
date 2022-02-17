import { useEffect, useState } from 'react';
import { getVersion } from '../../modules/bridge';
import { Form, Input, Radio } from '../UI';
import './index.scss';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};

const style: any = document.body.style;

const onChange = (e) => {
  style.zoom = e.target.value;
};

export default () => {
  const [version, setVersion] = useState<string>('');

  useEffect(() => {
    getVersion().then((v: any) => setVersion(v));
  }, []);
  return (
    <div className="dialog-settings">
      <Form name="time_related_controls" {...formItemLayout}>
        <Form.Item
          label="页面缩放比例"
        >
          <Radio.Group onChange={onChange} defaultValue={style.zoom ? +style.zoom : 1}>
            <Radio value={1}>1:1</Radio>
            <Radio value={1.1}>10%</Radio>
            <Radio value={1.2}>20%</Radio>
            <Radio value={1.3}>30%</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label="版本号"
        >
          <div>{version}</div>
        </Form.Item>
      </Form>
    </div>
  );
};
