/**
 * 🎨 颜色工具箱
 * 
 * 想象这是一个神奇的彩色画笔盒：
 * - 有各种颜色的画笔（红色、绿色、蓝色等）
 * - 可以给文字涂上颜色
 * - 还可以加粗、倾斜、下划线等特效
 * - 就像用彩色画笔写字一样！
 * 
 * 主要功能来自：https://github.com/jorgebucaran/colorette
 */

import * as tty from "node:tty";

/**
 * 🖥️ 检查电脑的设置
 * 就像检查我们的画画环境：
 * - 有没有纸和笔
 * - 天气好不好（光线够不够）
 * - 能不能用彩色笔
 */
const {
  env = {},           // 环境变量（就像天气情况）
  argv = [],          // 命令行参数（就像画画要求）
  platform = "",      // 操作系统（就像画画的地点）
} = typeof process === "undefined" ? {} : process;

/**
 * 🎨 检查能不能用彩色
 * 就像检查今天能不能用彩色笔画画：
 */
const isDisabled = "NO_COLOR" in env || argv.includes("--no-color");    // 有人说不能用彩色
const isForced = "FORCE_COLOR" in env || argv.includes("--color");      // 有人说一定要用彩色
const isWindows = platform === "win32";                                 // 是不是Windows电脑
const isDumbTerminal = env.TERM === "dumb";                            // 是不是特别简单的终端
const isCompatibleTerminal =                                           // 是不是支持彩色的终端
  tty && tty.isatty && tty.isatty(1) && env.TERM && !isDumbTerminal;
const isCI =                                                           // 是不是在自动化环境
  "CI" in env &&
  ("GITHUB_ACTIONS" in env || "GITLAB_CI" in env || "CIRCLECI" in env);

/**
 * 🎨 判断是否支持彩色显示
 * 就像判断"今天可以用彩色笔吗？"
 * 
 * 可以用彩色的情况：
 * 1. 没有人说不能用彩色
 * 2. 并且：
 *    - 有人说一定要用彩色，或者
 *    - 是Windows电脑（但不是特别简单的终端），或者
 *    - 是支持彩色的终端，或者
 *    - 是在自动化环境中
 */
const isColorSupported =
  !isDisabled &&
  (isForced || (isWindows && !isDumbTerminal) || isCompatibleTerminal || isCI);

/**
 * 🔄 替换关闭标记
 * 就像在一段彩色文字中间换个颜色
 */
function replaceClose(
  index: number,
  string: string,
  close: string,
  replace: string,
  head = string.slice(0, Math.max(0, index)) + replace,
  tail = string.slice(Math.max(0, index + close.length)),
  next = tail.indexOf(close),
): string {
  return head + (next < 0 ? tail : replaceClose(next, tail, close, replace));
}

/**
 * 🧹 清理颜色混合
 * 就像确保不同颜色的文字不会混在一起
 */
function clearBleed(
  index: number,
  string: string,
  open: string,
  close: string,
  replace: string,
) {
  return index < 0
    ? open + string + close
    : open + replaceClose(index, string, close, replace) + close;
}

/**
 * 📝 处理空字符串
 * 就像决定要不要给空白处上色
 */
function filterEmpty(
  open: string,
  close: string,
  replace = open,
  at = open.length + 1,
) {
  return (string: string) =>
    string || !(string === "" || string === undefined)
      ? clearBleed(("" + string).indexOf(close, at), string, open, close, replace)
      : "";
}

/**
 * 🎨 创建颜色函数
 * 就像准备一支新的彩色笔
 */
function init(open: number, close: number, replace?: string) {
  return filterEmpty(`\u001B[${open}m`, `\u001B[${close}m`, replace);
}

/**
 * 🎨 所有可用的颜色和样式
 * 就像一整盒彩色笔：
 * 
 * 基本样式：
 * - reset: 清除所有样式（像橡皮擦）
 * - bold: 加粗（像把字写粗一点）
 * - dim: 变暗（像把字写浅一点）
 * - italic: 斜体（像把字写斜一点）
 * - underline: 下划线（像在字下面画线）
 * - inverse: 反色（像把字的颜色反过来）
 * - hidden: 隐藏（像把字藏起来）
 * - strikethrough: 删除线（像在字上画横线）
 * 
 * 文字颜色：
 * - black, red, green, yellow, blue, magenta, cyan, white, gray
 * - 还有更亮的版本：blackBright, redBright, ...
 * 
 * 背景颜色：
 * - bgBlack, bgRed, bgGreen, ...（像用不同颜色的马克笔）
 * - 还有更亮的版本：bgBlackBright, bgRedBright, ...
 */
const colorDefs = {
  reset: init(0, 0),
  bold: init(1, 22, "\u001B[22m\u001B[1m"),
  dim: init(2, 22, "\u001B[22m\u001B[2m"),
  italic: init(3, 23),
  underline: init(4, 24),
  inverse: init(7, 27),
  hidden: init(8, 28),
  strikethrough: init(9, 29),
  black: init(30, 39),
  red: init(31, 39),
  green: init(32, 39),
  yellow: init(33, 39),
  blue: init(34, 39),
  magenta: init(35, 39),
  cyan: init(36, 39),
  white: init(37, 39),
  gray: init(90, 39),
  bgBlack: init(40, 49),
  bgRed: init(41, 49),
  bgGreen: init(42, 49),
  bgYellow: init(43, 49),
  bgBlue: init(44, 49),
  bgMagenta: init(45, 49),
  bgCyan: init(46, 49),
  bgWhite: init(47, 49),
  blackBright: init(90, 39),
  redBright: init(91, 39),
  greenBright: init(92, 39),
  yellowBright: init(93, 39),
  blueBright: init(94, 39),
  magentaBright: init(95, 39),
  cyanBright: init(96, 39),
  whiteBright: init(97, 39),
  bgBlackBright: init(100, 49),
  bgRedBright: init(101, 49),
  bgGreenBright: init(102, 49),
  bgYellowBright: init(103, 49),
  bgBlueBright: init(104, 49),
  bgMagentaBright: init(105, 49),
  bgCyanBright: init(106, 49),
  bgWhiteBright: init(107, 49),
};

/**
 * 📝 颜色名称类型
 * 就像画笔盒里每支笔的名字
 */
export type ColorName = keyof typeof colorDefs;

/**
 * 📝 上色函数类型
 * 就像定义"用画笔给文字上色"这个动作
 */
export type ColorFunction = (text: string | number) => string;

/**
 * 🎨 创建颜色工具集
 * 就像准备一盒新的彩色笔
 * 
 * @param useColor 是否使用彩色（就像问"要不要用彩色笔？"）
 * @returns 一盒彩色笔，每支笔都有自己的颜色功能
 */
function createColors(useColor = isColorSupported) {
  return useColor
    ? colorDefs
    : Object.fromEntries(Object.keys(colorDefs).map((key) => [key, String]));
}

/**
 * 🎨 颜色工具集
 * 就像一盒准备好的彩色笔，随时可以用
 */
export const colors = createColors() as Record<ColorName, ColorFunction>;

/**
 * 🎨 获取指定颜色的画笔
 * 就像从画笔盒里拿出一支特定颜色的笔
 * 
 * @param color 想要的颜色（比如"red"）
 * @param fallback 找不到时用的备用颜色（默认用"reset"）
 * @returns 这个颜色的画笔函数
 */
export function getColor(
  color: ColorName,
  fallback: ColorName = "reset",
): ColorFunction {
  return colors[color] || colors[fallback];
}

/**
 * 🎨 给文字上色
 * 就像用彩色笔写字
 * 
 * @param color 要用的颜色
 * @param text 要写的文字
 * @returns 上好色的文字
 * 
 * 例如：
 * colorize("red", "注意") -> 红色的"注意"
 * colorize("green", "成功") -> 绿色的"成功"
 */
export function colorize(color: ColorName, text: string | number): string {
  return getColor(color)(text);
}
