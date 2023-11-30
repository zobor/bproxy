// function parseWebSocketMessage(message) {
//   const data: any = {};

//   // 解析第一个字节，获取 FIN、RSV1-3、Opcode
//   const byte1 = message.readUInt8(0);
//   data.FIN = (byte1 & 0x80) != 0;
//   data.RSV1 = (byte1 & 0x40) != 0;
//   data.RSV2 = (byte1 & 0x20) != 0;
//   data.RSV3 = (byte1 & 0x10) != 0;
//   data.OpCode = byte1 & 0x0f;

//   // 解析第二个字节，获取 Mask、Payload Length
//   const byte2 = message.readUInt8(1);
//   data.Mask = (byte2 & 0x80) != 0;
//   let payloadLength = byte2 & 0x7f;

//   // 解析 Payload Length 的扩展长度
//   if (payloadLength == 126) {
//     payloadLength = message.readUInt16BE(2);
//     data.PayloadLengthBytes = 2;
//   } else if (payloadLength == 127) {
//     payloadLength = message.readBigUInt64BE(2);
//     data.PayloadLengthBytes = 8;
//   } else {
//     data.PayloadLengthBytes = 0;
//   }

//   // 解析 Masking Key
//   if (data.Mask) {
//     data.MaskingKey = message.subarray(data.PayloadLengthBytes + 2, data.PayloadLengthBytes + 6);
//   }

//   // 解析 Payload 数据
//   if (payloadLength > 0) {
//     data.PayloadData = message.subarray(data.PayloadLengthBytes + (data.Mask ? 6 : 2), payloadLength + 200);
//   } else {
//     data.PayloadData = null;
//   }

//   return data;
// }

const wsFrameFormat = `
Frame format:
​​
      0                   1                   2                   3
      0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
     +-+-+-+-+-------+-+-------------+-------------------------------+
     |F|R|R|R| opcode|M| Payload len |    Extended payload length    |
     |I|S|S|S|  (4)  |A|     (7)     |             (16/64)           |
     |N|V|V|V|       |S|             |   (if payload len==126/127)   |
     | |1|2|3|       |K|             |                               |
     +-+-+-+-+-------+-+-------------+ - - - - - - - - - - - - - - - +
     |     Extended payload length continued, if payload len == 127  |
     + - - - - - - - - - - - - - - - +-------------------------------+
     |                               |Masking-key, if MASK set to 1  |
     +-------------------------------+-------------------------------+
     | Masking-key (continued)       |          Payload Data         |
     +-------------------------------- - - - - - - - - - - - - - - - +
     :                     Payload Data continued ...                :
     + - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - +
     |                     Payload Data continued ...                |
     +---------------------------------------------------------------+
`;

export default function parseWebSocketMessage(frameData, output: any = [], callback = (v: any) => {}) {
  const d = frameData;
  const fin = (d[0] & 128) == 128;
  const opcode = d[0] & 15;
  const isMasked = (d[1] & 128) == 128;
  const payloadLength = d[1] & 127;

  if (d.length < 2) {
    return;
  }

  const wsFrameContent = d.slice(fin ? (payloadLength === 126 ? 4 : 2) : 0).toString();
  // console.log({
  //   fin,
  //   opcode,
  //   isMasked,
  // });
  // console.log(wsFrameContent)
  if (opcode === 1) {
    callback(wsFrameContent);
  } else if (opcode === 2 && output.length === 0) {
    output.push(wsFrameContent);
  } else if (opcode === 2 && output.length) {
    callback(output.join(''));
    output = [wsFrameContent];
  } else if (opcode !== 2) {
    output.push(wsFrameContent);
    output = [];
  }
}
