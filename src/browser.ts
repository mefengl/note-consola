/**
 * 🌐 浏览器专用信使
 * 
 * 想象这个文件是一个特别的信使：
 * - 它专门在浏览器里工作
 * - 它知道怎么用浏览器的方式显示消息
 * - 就像一个会用浏览器对话框的小助手！
 */

import { BrowserReporter } from "./reporters/browser";
import { createConsola as _createConsola } from "./consola";
import type { ConsolaOptions } from "./types";
export * from "./shared";

/**
 * 🎨 创建浏览器专用信使
 * 
 * 就像打造一个专门在浏览器里工作的小助手：
 * - 它会用浏览器的方式显示消息
 * - 它会用浏览器的对话框收集用户的回答
 * - 就像一个会用浏览器特色工具的小精灵！
 * 
 * @param options 可以给小助手的特别设置
 * @returns 一个新的浏览器专用信使
 */
export function createConsola(options: Partial<ConsolaOptions> = {}) {
  const consola = _createConsola({
    // 使用浏览器专用的报告员
    reporters: options.reporters || [new BrowserReporter({})],

    // 用浏览器的对话框收集用户的回答
    prompt(message, options = {}) {
      // 如果是确认问题，用confirm对话框
      if (options.type === "confirm") {
        return Promise.resolve(confirm(message) as any);
      }
      // 否则用prompt对话框
      return Promise.resolve(prompt(message));
    },
    ...options,
  });
  return consola;
}

/**
 * 🎭 默认的浏览器信使
 * 
 * 这是一个随时可用的浏览器专用信使：
 * - 它已经设置好了所有必要的功能
 * - 可以直接在任何地方使用它
 * - 就像一个随叫随到的小助手！
 */
export const consola = createConsola();
export default consola;
