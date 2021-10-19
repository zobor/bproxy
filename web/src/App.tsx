import { useEffect } from 'react';
import './App.scss';
import './modules/io';
import { testRule } from './modules/io';

const App = () => {
  const demo = async() => {
    const rs = await testRule("https://v.qq.com/h5/withdraw/index-2193377aab07a6db087c.js");
    console.log(rs);
  };

  useEffect(() => {
    demo();
  }, [])
  return <h1>haha</h1>;
}

export default App
