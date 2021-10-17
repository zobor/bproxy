export default () => {
  return <h1>haha</h1>;
};


const socket = io("ws://127.0.0.1:8888");

socket.on('test', (data) => {
  console.log(data);
});

socket.on('request', (data) => {
  console.log(data);
});
