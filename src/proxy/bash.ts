import bproxy from '.';
import * as packageJson from '../../package.json';
import { updateDataSet } from './dataset';

updateDataSet('platform', 'bash');

const [, , $arg1] = process.argv;

if ($arg1 === '-v') {
  console.log(packageJson.version);
} else {
  console.clear();
  bproxy.start();
}

// require('./demo');
