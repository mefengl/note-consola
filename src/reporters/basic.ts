/**
 * 📺 基础显示器
 * 
 * 想象这是游戏机最基本的显示屏：
 * - 只显示简单的文字，不带颜色和特效
 * - 就像最早的黑白电视机
 * - 适合在简单的环境下使用
 */

import { formatWithOptions } from "node:util";
import type {
  LogObject,
  ConsolaReporter,
  FormatOptions,
  ConsolaOptions,
} from "../types";
import { parseStack } from "../utils/error";
import { writeStream } from "../utils/stream";

/**
 * 📦 给文字加上方括号
 * 比如：
 * - 输入 "你好" 会变成 "[你好]"
 * - 输入空字符串则什么都不显示
 */
const bracket = (x: string) => (x ? `[${x}]` : "");

/**
 * 📺 基础显示器类
 * 就像一个简单的显示屏，负责把日志内容显示出来
 */
export class BasicReporter implements ConsolaReporter {
  /**
   * 📝 格式化错误堆栈
   * 把程序出错的位置信息排列整齐
   * 
   * @param stack 错误堆栈信息
   * @param opts 格式化选项
   * @returns 整理好的错误位置信息
   */
  formatStack(stack: string, opts: FormatOptions) {
    const indent = "  ".repeat((opts?.errorLevel || 0) + 1);  // 缩进空格
    return indent + parseStack(stack).join(`\n${indent}`);    // 每行前面加上缩进
  }

  /**
   * ❌ 格式化错误信息
   * 把错误信息整理得更容易阅读
   * 
   * 就像老师批改作业时：
   * - 写下错误的地方
   * - 解释为什么错了
   * - 如果有连续的错误，会一个个列出来
   */
  formatError(err: any, opts: FormatOptions): string {
    // 获取错误信息
    const message = err.message ?? formatWithOptions(opts, err);
    // 获取错误位置
    const stack = err.stack ? this.formatStack(err.stack, opts) : "";
    // 计算缩进层级
    const level = opts?.errorLevel || 0;
    // 如果是嵌套错误，加上[cause]前缀
    const causedPrefix = level > 0 ? `${"  ".repeat(level)}[cause]: ` : "";
    // 如果有更深层的错误原因，递归处理
    const causedError = err.cause
      ? "\n\n" + this.formatError(err.cause, { ...opts, errorLevel: level + 1 })
      : "";
    
    // 组合所有部分
    return causedPrefix + message + "\n" + stack + causedError;
  }

  /**
   * 📝 格式化参数
   * 把各种类型的参数转换成易读的文本
   * 
   * 就像把各种玩具（积木、拼图、玩偶）
   * 都摆在一个展示柜里，整整齐齐的
   */
  formatArgs(args: any[], opts: FormatOptions) {
    // 处理每个参数
    const _args = args.map((arg) => {
      // 如果是错误对象，特殊处理
      if (arg && typeof arg.stack === "string") {
        return this.formatError(arg, opts);
      }
      return arg;
    });
    
    // 使用Node.js的格式化工具
    return formatWithOptions(opts, ..._args);
  }

  /**
   * 📅 格式化日期
   * 把日期转换成容易看的格式
   * 
   * @param date 日期对象
   * @param opts 格式化选项
   * @returns 格式化后的时间字符串
   */
  formatDate(date: Date, opts: FormatOptions) {
    return opts.date ? date.toLocaleTimeString() : "";
  }

  /**
   * 🧹 清理并合并数组
   * 把数组中的空值去掉，然后用空格连接
   */
  filterAndJoin(arr: any[]) {
    return arr.filter(Boolean).join(" ");
  }

  /**
   * 📝 格式化日志对象
   * 把日志对象变成好看的文本
   * 
   * 如果是box类型：
   * > [标签] 标题
   * > 内容第一行
   * > 内容第二行
   * 
   * 普通类型：
   * [类型] [标签] 内容
   */
  formatLogObj(logObj: LogObject, opts: FormatOptions) {
    const message = this.formatArgs(logObj.args, opts);
    
    // 如果是box类型，使用特殊格式
    if (logObj.type === "box") {
      return (
        "\n" +
        [
          bracket(logObj.tag),
          logObj.title && logObj.title,
          ...message.split("\n"),
        ]
          .filter(Boolean)
          .map((l) => " > " + l)
          .join("\n") +
        "\n"
      );
    }

    // 普通类型：组合类型、标签和消息
    return this.filterAndJoin([
      bracket(logObj.type),
      bracket(logObj.tag),
      message,
    ]);
  }

  /**
   * 📺 显示日志
   * 这是显示器最重要的功能：把日志显示出来！
   * 
   * - 重要的消息（level < 2）用stderr显示
   * - 普通的消息用stdout显示
   * 
   * 就像：
   * - 重要通知用红色信纸写
   * - 普通通知用白色信纸写
   */
  log(logObj: LogObject, ctx: { options: ConsolaOptions }) {
    // 格式化日志内容
    const line = this.formatLogObj(logObj, {
      columns: (ctx.options.stdout as any).columns || 0,
      ...ctx.options.formatOptions,
    });

    // 根据日志级别选择输出流
    return writeStream(
      line + "\n",
      logObj.level < 2
        ? ctx.options.stderr || process.stderr  // 重要消息
        : ctx.options.stdout || process.stdout  // 普通消息
    );
  }
}
