/* eslint-disable @typescript-eslint/no-unused-vars */
import { spawn } from 'child_process';

const getErrorScripts = `
const BP = window.BP = {
  errors: [],
};
window.addEventListener('error', (err) => {
  BP.errors.push({
    messasge: err.messasge,
    stack: err.stack,
  });
  console.error(err);
});

window.addEventListener('unhandledrejection', (err) => {
  BP.errors.push({
    message: err && err.reason && err.reason.message ? err.reason.message : '',
    stack: err && err.reason && err.reason.stack ? err.reason.stack : '',
  });
  console.error(err);
});
`;
import { getLocalIpAddress } from './ip';

// 在HTML里面插入 weinre\vconsole\自定义的脚本
export function insertScriptsToHTML(html: string, debug: boolean | string) {
  if (!html) {
    return html;
  }
  let replacement = '';
  const [ip] = getLocalIpAddress();
  const bpScript = `<script>window.BPROXY_SERVER_IP='${ip}';${getErrorScripts}</script>`;
  if (debug === 'vconsole') {
    replacement = `
      ${bpScript}
      <script type="text/javascript" src="https://cdn.bootcdn.net/ajax/libs/vConsole/3.9.1/vconsole.min.js"></script>
      <script type="text/javascript">
      try{
        window.addEventListener('load', () => new window.VConsole());
      }catch(err){}
      </script>
    `;
  } else if (debug === true) {
    replacement = `
      ${bpScript}
      <script defer="defer" type="text/javascript" src="https://www.bproxy.dev/static/dist/inspect.iife.js"></script>
    `;
  } else {
    replacement = `
      ${bpScript}
      <script type="text/javascript">
        ${debug}
      </script>
    `;
  }

  const res = html
    .replace(/<meta[^"]*http-equiv="Content-Security-Policy"[^\>]*>/i, '')
    .replace('<head>', `<head>${replacement}`);

  return res;
}

export function runShellCode(shell, callback?, onerror = (error) => {}, onend = () => {}) {
  if (!shell) {
    return;
  }
  const params = shell.split(' ');
  const cmd = params.shift();
  const sh = spawn(cmd, params);

  if (callback) {
    sh.stdout.on('data', callback);
    sh.stderr.on('data', onerror);
    sh.on('close', onend);
  }
}
