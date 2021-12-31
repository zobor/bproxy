const {spawnSync} = require('child_process');
const port = 8888;

const findTask = spawnSync('netstat', '-ano'.split(' '));
const str = findTask.output.toString();

function killTaskByPid (pid) {
  const rs = spawnSync('taskkill', `/T /F /PID ${pid}`.split(' '));
  if (!!rs.output.toString()) {
    console.log('bproxy 进程已杀掉！');
  }
}

if (str.length) {
  const list = str
    .split(/\n/)
    .filter(
      (item) => item.trim().indexOf('TCP') === 0 && item.includes(`:${port}`) && item.includes('ESTABLISHED') && item.includes('127.0.0.1')
    )
    .filter((item) => item.includes(`:${port}`));
  if (list && list.length) {
    const values = list[0].split(/\s+/).filter(item => item);
    const processPort = values[values.length - 1];
    killTaskByPid(processPort);
  }
}