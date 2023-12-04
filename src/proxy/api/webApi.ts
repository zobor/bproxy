import { parseJSON } from '../../utils/utils';
import { corsHeaders } from '../config';
import { updateClipboard } from '../system/os';
import { getLocalIpAddress } from '../utils/ip';

// 获取本机IP
export function ip({ response }) {
  response.writeHead(200, { 'content-type': 'application/json;charset=utf-8' });
  response.end(JSON.stringify({ data: getLocalIpAddress() }));
}

// 同步到系统剪切板
export function syncClipboard({ body, response }) {
  let data: any;
  try {
    if (body) {
      data = parseJSON(body.toString());
    }
  } catch (err) {
    console.error(err);
    response.writeHead(500, {});
    response.end('post data error');
    return;
  }
  if (data?.type === 'syncClipboard' && data?.payload) {
    updateClipboard(data.payload);
  }
  response.writeHead(200, { 'content-type': 'application/json;charset=utf-8', ...corsHeaders });
  response.end(
    JSON.stringify({
      error: 0,
      msg: 'ok',
      data: {},
    }),
  );
}
