/**
 * 🌈 漂亮的彩色显示器
 * 
 * 想象这是游戏机的高级彩色显示屏：
 * - 可以显示彩色的文字
 * - 可以显示好看的图标
 * - 可以画出漂亮的框框
 * - 就像从黑白电视升级到了彩色电视！
 */

import _stringWidth from "string-width";
import isUnicodeSupported from "is-unicode-supported";
import { colors } from "../utils/color";
import { parseStack } from "../utils/error";
import { FormatOptions, LogObject } from "../types";
import { LogLevel, LogType } from "../constants";
import { BoxOpts, box } from "../utils/box";
import { stripAnsi } from "../utils";
import { BasicReporter } from "./basic";

/**
 * 🎨 日志类型的颜色映射表
 * 给不同类型的日志设置不同的颜色：
 * - info: 青色（像天空的颜色）
 * - fail: 红色（像红灯）
 * - success: 绿色（像绿灯）
 * - ready: 绿色（像绿灯）
 * - start: 紫色（像魔法）
 */
export const TYPE_COLOR_MAP: { [k in LogType]?: string } = {
  info: "cyan",
  fail: "red",
  success: "green",
  ready: "green",
  start: "magenta",
};

/**
 * 🎨 日志级别的颜色映射表
 * 不同重要程度用不同的颜色：
 * - 0级（错误）：红色
 * - 1级（警告）：黄色
 */
export const LEVEL_COLOR_MAP: { [k in LogLevel]?: string } = {
  0: "red",
  1: "yellow",
};

/**
 * 🖼️ 检查系统是否支持特殊字符
 * 就像检查电视机能不能播放高清节目
 */
const unicode = isUnicodeSupported();

/**
 * 🔄 字符选择器
 * 根据系统支持程度选择合适的字符：
 * - 如果支持特殊字符，就用漂亮的符号
 * - 如果不支持，就用普通的符号代替
 */
const s = (c: string, fallback: string) => (unicode ? c : fallback);

/**
 * 🎯 日志类型的图标映射表
 * 给每种类型的日志配上合适的小图标：
 * - error: ✖ 或 × （错误）
 * - fatal: ✖ 或 × （致命错误）
 * - ready: ✔ 或 √ （准备好了）
 * - warn: ⚠ 或 ‼ （警告）
 * - info: ℹ 或 i （信息）
 * - success: ✔ 或 √ （成功）
 * - debug: ⚙ 或 D （调试）
 * - trace: → 或 → （追踪）
 * - fail: ✖ 或 × （失败）
 * - start: ◐ 或 o （开始）
 */
const TYPE_ICONS: { [k in LogType]?: string } = {
  error: s("✖", "×"),
  fatal: s("✖", "×"),
  ready: s("✔", "√"),
  warn: s("⚠", "‼"),
  info: s("ℹ", "i"),
  success: s("✔", "√"),
  debug: s("⚙", "D"),
  trace: s("→", "→"),
  fail: s("✖", "×"),
  start: s("◐", "o"),
  log: "",
};

/**
 * 📏 获取字符串的显示宽度
 * 就像量一段文字占多少格子
 */
function stringWidth(str: string) {
  // 检查系统是否支持国际化功能
  const hasICU = typeof Intl === "object";
  if (!hasICU || !Intl.Segmenter) {
    return stripAnsi(str).length;
  }
  return _stringWidth(str);
}

/**
 * 🌈 漂亮的显示器类
 * 继承自基础显示器，但是加上了很多美化功能！
 */
export class FancyReporter extends BasicReporter {
  /**
   * 📝 格式化错误堆栈
   * 让错误信息看起来更漂亮：
   * - 文件路径用青色显示
   * - "at "用灰色显示
   * - 整体缩进对齐
   */
  formatStack(stack: string, opts: FormatOptions) {
    const indent = "  ".repeat((opts?.errorLevel || 0) + 1);
    return (
      `\n${indent}` +
      parseStack(stack)
        .map(
          (line) =>
            "  " +
            line
              .replace(/^at +/, (m) => colors.gray(m))
              .replace(/\((.+)\)/, (_, m) => `(${colors.cyan(m)})`),
        )
        .join(`\n${indent}`)
    );
  }

  /**
   * 🎨 格式化日志类型
   * 给不同类型的日志添加颜色和图标：
   * 
   * 如果是徽章模式：
   * - [错误] 会变成 一个红色背景的方块，里面是白字
   * 
   * 普通模式：
   * - 根据类型显示对应颜色的图标
   */
  formatType(logObj: LogObject, isBadge: boolean, opts: FormatOptions) {
    // 选择颜色
    const typeColor =
      (TYPE_COLOR_MAP as any)[logObj.type] ||
      (LEVEL_COLOR_MAP as any)[logObj.level] ||
      "gray";

    // 徽章模式
    if (isBadge) {
      return getBgColor(typeColor)(
        colors.black(` ${logObj.type.toUpperCase()} `),
      );
    }

    // 普通模式：选择图标
    const _type =
      typeof (TYPE_ICONS as any)[logObj.type] === "string"
        ? (TYPE_ICONS as any)[logObj.type]
        : (logObj as any).icon || logObj.type;
    
    return _type ? getColor(typeColor)(_type) : "";
  }

  /**
   * 📝 格式化日志对象
   * 把日志变得漂亮好看：
   * 
   * 如果是box类型：
   * ┌─────────────┐
   * │  标题       │
   * ├─────────────┤
   * │  内容       │
   * └─────────────┘
   * 
   * 普通类型：
   * ℹ 信息 [标签] [时间]
   */
  formatLogObj(logObj: LogObject, opts: FormatOptions) {
    // 分离消息和额外内容
    const [message, ...additional] = this.formatArgs(logObj.args, opts).split(
      "\n",
    );

    // 如果是box类型，画个好看的框框
    if (logObj.type === "box") {
      return box(
        characterFormat(
          message + (additional.length > 0 ? "\n" + additional.join("\n") : ""),
        ),
        {
          title: logObj.title
            ? characterFormat(logObj.title as string)
            : undefined,
          style: logObj.style as BoxOpts["style"],
        },
      );
    }

    // 格式化日期并加上灰色
    const date = this.formatDate(logObj.date, opts);
    const coloredDate = date && colors.gray(date);

    // 判断是否使用徽章模式（重要消息用徽章）
    const isBadge = (logObj.badge as boolean) ?? logObj.level < 2;

    // 格式化类型和标签
    const type = this.formatType(logObj, isBadge, opts);
    const tag = logObj.tag ? colors.gray(logObj.tag) : "";

    // 组装最终的显示内容
    let line;
    const left = this.filterAndJoin([type, characterFormat(message)]);
    const right = this.filterAndJoin(opts.columns ? [tag, coloredDate] : [tag]);

    // 计算左右两边之间需要多少空格
    const space =
      (opts.columns || 0) - stringWidth(left) - stringWidth(right) - 2;

    // 如果屏幕够宽，就把右边的内容靠右对齐
    line =
      space > 0 && (opts.columns || 0) >= 80
        ? left + " ".repeat(space) + right
        : (right ? `${colors.gray(`[${right}]`)} ` : "") + left;

    // 添加额外的内容
    line += characterFormat(
      additional.length > 0 ? "\n" + additional.join("\n") : "",
    );

    // 如果是追踪类型，添加堆栈信息
    if (logObj.type === "trace") {
      const _err = new Error("Trace: " + logObj.message);
      line += this.formatStack(_err.stack || "");
    }

    // 徽章模式多加一个换行，看起来更醒目
    return isBadge ? "\n" + line + "\n" : line;
  }
}

/**
 * ✨ 文字格式化
 * 让文字更好看：
 * - 把`框起来的文字`变成青色
 * - 把 _下划线文字_ 加上下划线
 */
function characterFormat(str: string) {
  return (
    str
      // 突出显示反引号中的内容
      .replace(/`([^`]+)`/gm, (_, m) => colors.cyan(m))
      // 给下划线中的内容加上下划线效果
      .replace(/\s+_([^_]+)_\s+/gm, (_, m) => ` ${colors.underline(m)} `)
  );
}

/**
 * 🎨 获取文字颜色函数
 * 就像选择彩色笔
 */
function getColor(color = "white") {
  return (colors as any)[color] || colors.white;
}

/**
 * 🎨 获取背景颜色函数
 * 就像选择彩纸的颜色
 */
function getBgColor(color = "bgWhite") {
  return (
    (colors as any)[`bg${color[0].toUpperCase()}${color.slice(1)}`] ||
    colors.bgWhite
  );
}
