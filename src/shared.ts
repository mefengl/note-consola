/**
 * 🎁 共享功能的大礼包
 * 
 * 想象这个文件是一个礼品包装店：
 * - 它把其他地方制作的礼物都包装在一起
 * - 这样顾客就可以一次拿到所有想要的东西
 * - 就像去便利店买零食大礼包一样方便！
 */

// 📦 导出日志级别和类型
// 就像把不同口味的糖果放进礼包
export { LogLevels, LogTypes } from "./constants";

// 🎮 导出主游戏机类
// 就像把游戏机放进礼包
export { Consola } from "./consola";

// 📝 导出所有类型定义
// 就像把使用说明书放进礼包
export type * from "./types";

// 🎮 导出游戏机实例类型
// 就像把游戏机的规格说明放进礼包
export type { ConsolaInstance } from "./consola";

// 📊 导出日志级别和类型的定义
// 就像把游戏难度说明放进礼包
export type { LogLevel, LogType } from "./constants";

// 💭 导出所有提示框相关的类型
// 就像把游戏对话框的说明放进礼包
export type {
  PromptOptions,         // 基础提示框选项
  ConfirmPromptOptions,  // 确认框选项
  MultiSelectOptions,    // 多选框选项
  SelectPromptOptions,   // 单选框选项
  TextPromptOptions,     // 文本输入框选项
} from "./prompt";
