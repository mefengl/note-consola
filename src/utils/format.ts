/**
 * 📝 格式化工具
 * 
 * 想象这个文件是一个填空题生成器：
 * - 有一个模板，里面有很多空格要填
 * - 我们把不同的内容填到对应的空格里
 * - 最后得到一个完整的句子
 */

import { vsprintf } from "printj";

/**
 * 📋 预定义的替换规则
 * 就像填空题里的提示：
 * - additional：第5个空（额外信息）
 * - message：第4个空（主要消息）
 * - type：第2个空（类型）
 * - date：第1个空（日期）
 * - tag：第3个空（标签）
 * 
 * 比如模板："%date [%tag] %message %additional"
 * 填完变成："2023-12-25 [test] Hello World!"
 */
const FORMAT_ARGS = [
  ["additional", 5],  // 额外信息放第5个空
  ["message", 4],     // 消息放第4个空
  ["type", 2],        // 类型放第2个空
  ["date", 1],        // 日期放第1个空
  ["tag", 3],         // 标签放第3个空
];

/**
 * 📦 编译结果缓存
 * 就像保存已经做过的填空题，下次遇到相同的就不用重新做了
 */
const _compileCache: any = {};

/**
 * 📝 编译格式字符串
 * 把带有占位符的模板转换成可以直接填空的格式
 * 
 * 就像把一个中文填空题：
 * "今天是___，___同学说___"
 * 变成一个编号填空题：
 * "今天是(1)，(2)同学说(3)"
 * 
 * @param format 原始的格式字符串（像一道填空题）
 * @returns 编译后的格式字符串（像一道带编号的填空题）
 */
export function compileFormat(format: string) {
  // 如果这道题做过了，直接用上次的答案
  if (_compileCache[format]) {
    return _compileCache[format];
  }

  // 没做过的题，开始处理
  let _format = format;

  // 按照规则替换每个占位符
  for (const arg of FORMAT_ARGS) {
    _format = _format.replace(
      new RegExp("([%-])" + arg[0], "g"),  // 找到占位符
      "$1" + arg[1],                        // 替换成编号
    );
  }

  // 保存结果，下次遇到相同的题就不用重做了
  _compileCache[format] = _format;
  return _format;
}

/**
 * 🎯 格式化字符串
 * 把实际的内容填到准备好的空格里
 * 
 * 就像真的在做填空题：
 * 题目："今天是(1)，(2)同学说(3)"
 * 答案：["星期一", "小明", "你好"]
 * 结果："今天是星期一，小明同学说你好"
 * 
 * @param format 格式字符串（像一道填空题）
 * @param argv 要填入的内容（像一组答案）
 * @returns 完整的字符串（像完成的句子）
 */
export function formatString(format: string, argv: any) {
  return vsprintf(compileFormat(format), argv);
}
