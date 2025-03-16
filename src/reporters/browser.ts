/**
 * 🌐 浏览器显示器
 * 
 * 想象这是一个专门为网页浏览器设计的显示屏：
 * - 可以在浏览器的控制台显示漂亮的日志
 * - 支持彩色的背景和文字
 * - 可以显示不同样式的徽章
 * - 就像在浏览器里开了一个彩色电视！
 */

import { LogObject } from "../types";

/**
 * 🌐 浏览器显示器类
 * 专门负责在浏览器控制台显示漂亮的日志
 */
export class BrowserReporter {
  options: any;
  /**
   * 🎨 默认颜色
   * 就像画画时用的铅笔，最基本的颜色
   */
  defaultColor: string;

  /**
   * 🎨 不同级别的颜色映射
   * 不同重要程度用不同的颜色：
   * - 0级（错误）：红色 #c0392b
   * - 1级（警告）：黄色 #f39c12
   * - 3级（信息）：青色 #00BCD4
   */
  levelColorMap: Record<number, string>;

  /**
   * 🎨 不同类型的颜色映射
   * 特殊类型用特殊的颜色：
   * - success（成功）：绿色 #2ecc71
   */
  typeColorMap: Record<string, string>;

  /**
   * 🎨 创建一个新的浏览器显示器
   * 就像打开一个新的浏览器窗口
   */
  constructor(options: any) {
    this.options = { ...options };
    this.defaultColor = '#7f8c8d';  // 灰色（像铅笔）
    this.levelColorMap = {
      0: '#c0392b',  // 红色（像红灯）
      1: '#f39c12',  // 黄色（像黄灯）
      3: '#00BCD4',  // 青色（像天空）
    };
    this.typeColorMap = {
      success: '#2ecc71',  // 绿色（像绿灯）
    };
  }

  /**
   * 📝 获取合适的日志函数
   * 根据日志的重要程度选择合适的显示方式：
   * - 最重要（0级）用console.error
   * - 警告（1级）用console.warn
   * - 其他用console.log
   */
  _getLogFn(level: number) {
    if (level < 1) {
      return (console as any).__error || console.error;
    }
    if (level === 1) {
      return (console as any).__warn || console.warn;
    }
    return (console as any).__log || console.log;
  }

  /**
   * 📺 显示日志
   * 这是显示器最重要的功能：把日志显示在浏览器控制台上！
   * 
   * 效果像这样：
   * [tag:type] 消息内容
   * 
   * 例如：
   * [server:error] 连接失败
   * [app:success] 启动成功
   */
  log(logObj: LogObject) {
    // 获取合适的日志函数
    const consoleLogFn = this._getLogFn(logObj.level);

    // 准备类型标签（如果是普通日志就不显示类型）
    const type = logObj.type === 'log' ? '' : logObj.type;

    // 准备标签（如果没有标签就留空）
    const tag = logObj.tag || '';

    // 选择颜色（优先用类型的颜色，其次用级别的颜色，最后用默认颜色）
    const color = this.typeColorMap[logObj.type] ||
                 this.levelColorMap[logObj.level] ||
                 this.defaultColor;

    // 设计徽章样式（就像设计一个小标签的样子）
    const style = `
      background: ${color};      /* 背景颜色 */
      border-radius: 0.5em;      /* 圆角边框 */
      color: white;              /* 白色文字 */
      font-weight: bold;         /* 粗体文字 */
      padding: 2px 0.5em;        /* 内边距 */
    `;

    // 组合标签和类型（用冒号分隔）
    const badge = `%c${[tag, type].filter(Boolean).join(':')}`;

    // 显示到控制台
    // 如果第一个参数是字符串，就把它和徽章组合在一起
    if (typeof logObj.args[0] === 'string') {
      consoleLogFn(
        `${badge}%c ${logObj.args[0]}`,  // 徽章和消息
        style,                            // 徽章的样式
        '',                               // 消息使用默认样式
        ...logObj.args.slice(1)          // 其他参数
      );
    } else {
      // 如果第一个参数不是字符串，就分开显示
      consoleLogFn(badge, style, ...logObj.args);
    }
  }
}
