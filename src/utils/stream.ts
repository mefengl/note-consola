/**
 * 📬 流处理工具
 * 
 * 想象这个文件是一个邮递员：
 * - 负责把信件（数据）送到指定的信箱（流）
 * - 有些信箱是特制的（有__write方法）
 * - 有些信箱是普通的（只有write方法）
 */

/**
 * 📮 把数据写入流
 * 就像邮递员把信送到信箱
 * 
 * 想象一下：
 * - data 就是要送的信
 * - stream 就是信箱
 * - write 就是投递的动作
 * 
 * 有两种投递方式：
 * 1. 特殊投递（__write）：某些高级信箱有特殊的投递口
 * 2. 普通投递（write）：普通信箱就用普通的投递口
 * 
 * 返回值告诉我们：
 * - true：信已经成功送达，可以继续送下一封
 * - false：信箱暂时满了，需要等一等再送
 * 
 * @param data 要送的信（可以是字符串、数字等）
 * @param stream 目标信箱（一个可以写入数据的流）
 * @returns 是否可以继续送下一封信
 */
export function writeStream(data: any, stream: NodeJS.WriteStream) {
  // 选择投递方式：优先用特殊投递口，没有的话就用普通投递口
  const write = (stream as any).__write || stream.write;
  
  // 把信投进信箱
  return write.call(stream, data);
}
