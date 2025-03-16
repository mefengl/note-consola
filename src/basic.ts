/**
 * 📝 简单笔记本
 * 
 * 想象这个文件是一个简单的笔记本：
 * - 只有最基本的功能
 * - 没有花哨的装饰
 * - 就像一个普通的记事本！
 */

import { LogLevels, LogLevel } from "./constants";
import type { ConsolaOptions } from "./types";
import { BasicReporter } from "./reporters/basic";
import { ConsolaInstance, createConsola as _createConsola } from "./consola";

export * from "./shared";

/**
 * 📖 创建一个新笔记本
 * 
 * 就像去文具店买一个新笔记本：
 * - 可以选择笔记本的类型（普通的还是花哨的）
 * - 可以设置记录的详细程度（重要的还是所有的都记）
 * - 就像挑选一个最适合你的笔记本！
 * 
 * @param options 笔记本的设置选项
 * @returns 一个崭新的笔记本
 */
export function createConsola(
  options: Partial<ConsolaOptions & { fancy: boolean }> = {},
): ConsolaInstance {
  // 设置记录的详细程度
  // 就像决定记笔记要记多详细
  let level: LogLevel = LogLevels.info;
  if (process.env.CONSOLA_LEVEL) {
    level = Number.parseInt(process.env.CONSOLA_LEVEL) ?? level;
  }

  // 创建新的笔记本
  // 就像打开一个全新的本子
  const consola = _createConsola({
    level,
    defaults: { level },
    stdout: process.stdout,
    stderr: process.stderr,
    reporters: options.reporters || [new BasicReporter()],
    ...options,
  });

  return consola;
}

/**
 * 📒 默认的笔记本
 * 
 * 这是一个随时可用的简单笔记本：
 * - 已经准备好了最基本的功能
 * - 可以直接开始记录
 * - 就像桌上总是放着的那本笔记本！
 */
export const consola = createConsola();

export default consola;
