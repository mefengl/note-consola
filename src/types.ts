/**
 * 这个文件定义了 consola 项目中所有重要的类型！
 * 就像玩具有不同的属性（比如颜色、大小、形状），
 * 我们的日志系统也需要定义不同的属性和规则。
 */

import type { LogLevel, LogType } from "./constants";

/**
 * 📝 主要配置选项接口
 * 就像你玩游戏时可以调整音量、画面和难度一样，
 * ConsolaOptions 让我们可以调整日志工具的各种设置！
 */
export interface ConsolaOptions {
  /**
   * 📢 报告员数组
   * 想象有几个小助手，每个助手负责用不同的方式展示信息：
   * - 有的把信息打印成普通文字
   * - 有的把信息打印成彩色的
   * - 有的把信息显示在浏览器上
   */
  reporters: ConsolaReporter[];

  /**
   * 📋 日志类型配置
   * 就像我们说话时有不同的语气（开心、难过、生气），
   * 日志也有不同的类型（普通信息、警告、错误等）
   */
  types: Record<LogType, InputLogObject>;

  /**
   * 📊 日志级别
   * 这就像是信息的重要程度：
   * - 0级：特别重要的错误信息
   * - 1级：警告信息
   * - 2级：普通信息
   * - 3级：详细信息
   * - 4级：调试信息
   * - 5级：最详细的追踪信息
   */
  level: LogLevel;

  /**
   * 📌 默认设置
   * 就像你的默认游戏设置一样，这里定义了日志的默认属性
   */
  defaults: InputLogObject;

  /**
   * ⏱️ 节流时间（毫秒）
   * 防止日志输出太快太多！
   * 就像你不能一直按游戏中的攻击按钮一样，需要有个冷却时间
   */
  throttle: number;

  /**
   * ⌛ 最小节流时间
   * 即使日志很少，也要至少等待这么长时间才能再次输出相同的日志
   */
  throttleMin: number;

  /**
   * 🖥️ 标准输出流
   * 就像电视机的显示屏，这里是输出普通信息的地方
   */
  stdout?: NodeJS.WriteStream;

  /**
   * ⚠️ 标准错误流
   * 专门用来显示错误信息的通道
   */
  stderr?: NodeJS.WriteStream;

  /**
   * 🎭 模拟函数
   * 在测试时使用，可以假装输出日志而不是真的输出
   * 就像彩排演出时不需要真的表演一样
   */
  mockFn?: (type: LogType, defaults: InputLogObject) => (...args: any) => void;

  /**
   * 💭 提示函数
   * 用于和用户互动，比如问问题或让用户选择选项
   */
  prompt?: typeof import("./prompt").prompt | undefined;

  /**
   * 🎨 格式化选项
   * 控制日志的外观，就像设置文字的字体、颜色和大小
   */
  formatOptions: FormatOptions;
}

/**
 * 🎨 格式化选项接口
 * 控制日志显示的样式，就像你在写作文时要选择字体、对齐方式等
 */
export interface FormatOptions {
  /**
   * 📏 最大列数
   * 控制文字显示的宽度，防止一行太长
   */
  columns?: number;

  /**
   * 📅 是否显示日期
   * 是否在日志中显示时间戳
   */
  date?: boolean;

  /**
   * 🌈 是否使用颜色
   * 让日志显示彩色，更容易分辨不同类型的信息
   */
  colors?: boolean;

  /**
   * 📦 是否压缩显示
   * true表示显示更紧凑，false表示显示更松散
   */
  compact?: boolean | number;

  /**
   * 🎯 错误显示层级
   * 控制显示错误详细程度的级别
   */
  errorLevel?: number;

  /**
   * 🔧 其他自定义选项
   * 可以添加任何其他格式化选项
   */
  [key: string]: unknown;
}

/**
 * 📝 日志输入对象接口
 * 定义一条日志需要包含哪些信息，就像写一篇日记需要包含什么内容
 */
export interface InputLogObject {
  /**
   * 📊 日志级别
   * 标记这条日志有多重要
   */
  level?: LogLevel;

  /**
   * 🏷️ 标签
   * 给日志打上标签，方便分类，就像给物品贴标签一样
   */
  tag?: string;

  /**
   * 📋 日志类型
   * 这条日志属于什么类型（普通信息、警告、错误等）
   */
  type?: LogType;

  /**
   * 💬 主要信息
   * 日志的主要内容
   */
  message?: string;

  /**
   * 📎 附加信息
   * 补充的详细说明
   */
  additional?: string | string[];

  /**
   * 📦 其他参数
   * 可以是任何额外的信息
   */
  args?: any[];

  /**
   * 📅 日期
   * 这条日志是什么时候创建的
   */
  date?: Date;
}

/**
 * 📝 完整日志对象接口
 * 在InputLogObject的基础上，所有可选属性变成必需的，
 * 就像把一份草稿变成正式文件
 */
export interface LogObject extends InputLogObject {
  level: LogLevel;
  type: LogType;
  tag: string;
  args: any[];
  date: Date;
  [key: string]: unknown;
}

/**
 * 📢 日志报告员接口
 * 定义了如何处理和显示日志的规则
 * 就像新闻播报员，负责把新闻（日志）传达给观众（用户）
 */
export interface ConsolaReporter {
  /**
   * 📝 日志处理函数
   * @param logObj 要处理的日志对象
   * @param ctx 包含配置选项的上下文对象
   * 
   * 这个函数决定了如何展示每一条日志
   * 就像新闻播报员决定用什么方式播报新闻
   */
  log: (
    logObj: LogObject,
    ctx: {
      options: ConsolaOptions;
    },
  ) => void;
}
