/**
 * 🎮 日志游戏机的商店入口
 * 
 * 想象这个文件是一个游戏机商店：
 * - 你可以买到预设好的游戏机(默认实例)
 * - 也可以定制自己的游戏机(自定义实例)
 * - 商店会根据你的环境推荐合适的设置
 */

import { isDebug, isTest, isCI } from "std-env";
import { LogLevels, LogLevel } from "./constants";
import type { ConsolaOptions } from "./types";
import { BasicReporter } from "./reporters/basic";
import { FancyReporter } from "./reporters/fancy";
import { ConsolaInstance, createConsola as _createConsola } from "./consola";

// 导出所有共享功能
export * from "./shared";

/**
 * 🏭 游戏机制作工厂
 * 就像一个可以根据顾客需求定制游戏机的工厂
 * 
 * 例如：
 * - 在开发环境，制作一台显示更多调试信息的游戏机
 * - 在测试环境，制作一台只显示重要信息的游戏机
 * - 在正式环境，制作一台普通的游戏机
 * 
 * @param options 定制选项（就像顾客的具体要求）
 * @returns 一台定制好的游戏机
 */
export function createConsola(
  options: Partial<ConsolaOptions & { fancy: boolean }> = {},
): ConsolaInstance {
  // 设置日志等级（就像设置游戏难度）
  let level = _getDefaultLogLevel();
  
  // 如果环境变量里指定了等级，就用指定的
  if (process.env.CONSOLA_LEVEL) {
    level = Number.parseInt(process.env.CONSOLA_LEVEL) ?? level;
  }

  // 创建新的游戏机实例
  const consola = _createConsola({
    // 设置基本参数
    level: level as LogLevel,        // 日志等级
    defaults: { level },             // 默认设置
    stdout: process.stdout,          // 标准输出（像是游戏机的主屏幕）
    stderr: process.stderr,          // 错误输出（像是游戏机的警告屏幕）
    
    // 提示功能（像是游戏中的对话框）
    prompt: (...args) => import("./prompt").then((m) => m.prompt(...args)),
    
    // 选择显示器类型
    reporters: options.reporters || [
      // 如果没有特别指定，就根据环境选择：
      // - 在普通环境用漂亮的显示器(FancyReporter)
      // - 在测试或CI环境用简单的显示器(BasicReporter)
      (options.fancy ?? !(isCI || isTest))
        ? new FancyReporter()
        : new BasicReporter(),
    ],
    
    // 加入其他定制选项
    ...options,
  });

  return consola;
}

/**
 * 📊 获取默认的日志等级
 * 就像根据玩家的需求推荐合适的游戏难度
 * 
 * - 调试时：显示所有信息（像是游戏开发者模式）
 * - 测试时：只显示警告和错误（像是游戏测试模式）
 * - 普通使用：显示一般信息（像是普通玩家模式）
 */
function _getDefaultLogLevel() {
  if (isDebug) {
    return LogLevels.debug;    // 调试模式：显示更多信息
  }
  if (isTest) {
    return LogLevels.warn;     // 测试模式：只显示警告和错误
  }
  return LogLevels.info;       // 普通模式：显示一般信息
}

/**
 * 🎮 默认的游戏机实例
 * 
 * 这就像商店里的展示机，已经预装了最常用的设置：
 * - 根据环境自动选择合适的显示方式
 * - 可以直接拿来使用，非常方便
 * 
 * 使用示例：
 * ```js
 * import { consola } from 'consola';
 * 
 * consola.info('欢迎使用游戏机！');
 * consola.success('任务完成！');
 * consola.error('哎呀，出错了！');
 * ```
 */
export const consola = createConsola();

// 设为默认导出，这样用户想怎么导入都可以
export default consola;
