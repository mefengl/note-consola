/**
 * 📝 日志工具函数
 * 
 * 这个文件就像是一个检查员，帮我们检查：
 * 1. 是不是普通的对象（像一张白纸）
 * 2. 是不是日志对象（像一张写好的便签）
 */

/**
 * 📋 检查是否是普通对象
 * 
 * 想象你有很多不同的东西：
 * - 一张白纸（普通对象 ✅）
 * - 一支铅笔（不是对象 ❌）
 * - 一个玩具（不是普通对象 ❌）
 * 
 * 这个函数就是帮我们检查"这是不是一张白纸？"
 * 
 * @param obj 要检查的东西
 * @returns 如果是普通对象就返回true，否则返回false
 */
export function isPlainObject(obj: any) {
  return Object.prototype.toString.call(obj) === "[object Object]";
}

/**
 * 📝 检查是否是日志对象
 * 
 * 想象你有很多便签：
 * - 一张写着消息的便签（有message属性 ✅）
 * - 一张贴着小贴纸的便签（有args属性 ✅）
 * - 一张空白的便签（既没有message也没有args ❌）
 * - 一张报错的便签（有stack属性 ❌）
 * 
 * 这个函数就是帮我们检查"这是不是一张正确的日志便签？"
 * 
 * 要求：
 * 1. 必须是普通对象（像一张便签）
 * 2. 必须有message或args（便签上要有内容）
 * 3. 不能有stack属性（不能是错误便签）
 * 
 * @param arg 要检查的东西
 * @returns 如果是正确的日志对象就返回true，否则返回false
 */
export function isLogObj(arg: any) {
  // 第一步：检查是不是普通对象（便签）
  if (!isPlainObject(arg)) {
    return false;
  }

  // 第二步：检查有没有内容（message或args）
  if (!arg.message && !arg.args) {
    return false;
  }

  // 第三步：检查是不是错误便签（有stack属性）
  if (arg.stack) {
    return false;
  }

  // 通过所有检查，是一个正确的日志对象！
  return true;
}
