/**
 * ✍️ 文字排版工具箱
 * 
 * 想象这个文件是一个整理文字的工具箱：
 * - 可以把带颜色的文字变成普通文字
 * - 可以把文字居中、靠左、靠右排列
 * - 就像写黑板报时排版文字一样！
 */

/**
 * 🎨 ANSI转义字符的正则表达式
 * 这是一个用来找出文字里颜色标记的工具
 * （就像找出荧光笔画过的地方）
 */
const ansiRegex = [
  String.raw`[\u001B\u009B][[\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\d\/#&.:=?%@~_]+)*|[a-zA-Z\d]+(?:;[-a-zA-Z\d\/#&.:=?%@~_]*)*)?\u0007)`,
  String.raw`(?:(?:\d{1,4}(?:;\d{0,4})*)?[\dA-PR-TZcf-nq-uy=><~]))`,
].join("|");

/**
 * 🎨 去除颜色标记
 * 把带颜色的文字变成普通文字
 * 
 * 就像：
 * - 把用荧光笔画过的文字
 * - 变回普通的黑色文字
 * 
 * @param text 带颜色的文字
 * @returns 普通的文字
 */
export function stripAnsi(text: string) {
  return text.replace(new RegExp(ansiRegex, "g"), "");
}

/**
 * 📏 文字居中对齐
 * 让文字在指定的宽度内居中显示
 * 
 * 就像黑板报的标题：
 * "    少年中国说    "
 * 占20格，前后各留4格空白
 * 
 * @param str 要居中的文字
 * @param len 总共的宽度
 * @param space 填充用的字符（默认是空格）
 * @returns 居中后的文字
 */
export function centerAlign(str: string, len: number, space = " ") {
  // 计算需要填充的空白数量
  const free = len - str.length;
  // 如果文字比预留的空间还长，就保持原样
  if (free <= 0) {
    return str;
  }
  // 计算左边需要多少空白
  const freeLeft = Math.floor(free / 2);
  
  // 开始组装新的字符串
  let _str = "";
  for (let i = 0; i < len; i++) {
    _str +=
      i < freeLeft || i >= freeLeft + str.length ? space : str[i - freeLeft];
  }
  return _str;
}

/**
 * 📏 文字右对齐
 * 让文字靠右显示，左边填充空白
 * 
 * 就像数学算式：
 * "      123"
 * "     +456"
 * "    -----"
 * "      579"
 * 
 * @param str 要对齐的文字
 * @param len 总共的宽度
 * @param space 填充用的字符（默认是空格）
 * @returns 右对齐后的文字
 */
export function rightAlign(str: string, len: number, space = " ") {
  // 计算需要填充的空白数量
  const free = len - str.length;
  // 如果文字比预留的空间还长，就保持原样
  if (free <= 0) {
    return str;
  }
  
  // 开始组装新的字符串：先填空白，再填文字
  let _str = "";
  for (let i = 0; i < len; i++) {
    _str += i < free ? space : str[i - free];
  }
  return _str;
}

/**
 * 📏 文字左对齐
 * 让文字靠左显示，右边填充空白
 * 
 * 就像写作文：
 * "第一段    "
 * "第二段    "
 * "第三段    "
 * 
 * @param str 要对齐的文字
 * @param len 总共的宽度
 * @param space 填充用的字符（默认是空格）
 * @returns 左对齐后的文字
 */
export function leftAlign(str: string, len: number, space = " ") {
  // 开始组装新的字符串：先填文字，再填空白
  let _str = "";
  for (let i = 0; i < len; i++) {
    _str += i < str.length ? str[i] : space;
  }
  return _str;
}

/**
 * 📏 通用对齐函数
 * 根据需要选择合适的对齐方式
 * 
 * 就像写黑板报时：
 * - 标题要居中（center）
 * - 正文要靠左（left）
 * - 日期要靠右（right）
 * 
 * @param alignment 对齐方式：left左对齐、right右对齐、center居中
 * @param str 要对齐的文字
 * @param len 总共的宽度
 * @param space 填充用的字符（默认是空格）
 * @returns 对齐后的文字
 */
export function align(
  alignment: "left" | "right" | "center",
  str: string,
  len: number,
  space = " ",
) {
  // 根据对齐方式选择合适的函数
  switch (alignment) {
    case "left": {
      return leftAlign(str, len, space);
    }
    case "right": {
      return rightAlign(str, len, space);
    }
    case "center": {
      return centerAlign(str, len, space);
    }
    default: {
      return str;
    }
  }
}
