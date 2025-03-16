/**
 * 🎯 常量定义文件
 * 这个文件就像是一本字典，定义了日志系统中使用的所有"词汇"和"等级"。
 * 想象一下学校里的通知系统：有重要通知、一般通知、温馨提示等不同类型。
 */

import { LogObject } from "./types";

/**
 * 📊 日志级别类型定义
 * 就像考试成绩分为不同等级（A、B、C、D），日志也有不同的重要程度：
 * 
 * 0级：特别重要的错误信息（比如系统崩溃）
 * 1级：警告信息（比如"电池电量不足"）
 * 2级：普通信息（比如"正在保存文件"）
 * 3级：详细信息（比如"保存成功"）
 * 4级：调试信息（给程序员看的技术细节）
 * 5级：追踪信息（最详细的技术信息）
 */
export type LogLevel = 0 | 1 | 2 | 3 | 4 | 5 | (number & {});

/**
 * 📝 日志类型与级别的对应关系表
 * 就像学校里不同类型的通知有不同的重要程度：
 * - 紧急通知（最重要）
 * - 一般通知（比较重要）
 * - 温馨提示（普通重要）
 * - 活动预告（次要信息）
 * 
 * 这里定义了每种类型日志的重要程度：
 * - silent（静音）：不显示任何信息
 * - fatal（致命）和error（错误）：最重要的0级
 * - warn（警告）：重要的1级
 * - log（记录）：普通的2级
 * - info等（信息）：常规的3级
 * - debug（调试）：技术的4级
 * - trace（追踪）：最详细的5级
 * - verbose（啰嗦）：显示所有信息
 */
export const LogLevels: Record<LogType, number> = {
  // 🤫 完全安静，什么都不显示
  silent: Number.NEGATIVE_INFINITY,
  
  // ⚠️ 最重要的信息（0级）
  fatal: 0,    // 致命错误
  error: 0,    // 一般错误
  
  // ⚡ 警告信息（1级）
  warn: 1,     // 需要注意的问题
  
  // 📝 普通日志（2级）
  log: 2,      // 普通记录
  
  // 📢 常规信息（3级）
  info: 3,     // 一般信息
  success: 3,  // 成功消息
  fail: 3,     // 失败消息
  ready: 3,    // 准备就绪
  start: 3,    // 开始工作
  box: 3,      // 带框框的消息
  
  // 🔍 调试信息（4级）
  debug: 4,    // 帮助找出问题
  
  // 🔬 最详细的信息（5级）
  trace: 5,    // 跟踪程序运行
  
  // 📚 显示所有信息
  verbose: Number.POSITIVE_INFINITY
};

/**
 * 📋 日志类型定义
 * 就像老师批改作业时用的不同符号：
 * - ✅ 对勾表示正确
 * - ❌ 叉表示错误
 * - ❗ 感叹号表示需要注意
 * 
 * 我们的日志系统也有不同的类型：
 * - silent：安静模式，什么都不显示
 * - fatal：特别严重的错误
 * - error：一般的错误
 * - warn：需要注意的警告
 * - log：普通的记录
 * - info：一般信息
 * - success：成功消息
 * - fail：失败消息
 * - ready：准备就绪
 * - start：开始工作
 * - box：带框框的消息
 * - debug：调试信息
 * - trace：追踪信息
 * - verbose：显示所有细节
 */
export type LogType =
  // 🤫 静音模式
  | "silent"
  // ❌ 错误信息
  | "fatal"
  | "error"
  // ⚠️ 警告信息
  | "warn"
  // 📝 普通日志
  | "log"
  // 📢 常规信息
  | "info"
  | "success"
  | "fail"
  | "ready"
  | "start"
  | "box"
  // 🔬 技术信息
  | "debug"
  | "trace"
  | "verbose";

/**
 * 📦 日志类型配置表
 * 这个表格把每种类型的日志都设置好了显示级别
 * 
 * 举个例子：
 * - 就像爸妈说话要用不同的语气
 * - 温柔地说"真棒！"（success，3级）
 * - 严肃地说"要小心！"（warn，1级）
 * - 生气地说"这是错的！"（error，0级）
 */
export const LogTypes: Record<LogType, Partial<LogObject>> = {
  // 🤫 安静模式
  silent: {
    level: -1,
  },
  
  // ❌ 最严重的错误（0级）
  fatal: {
    level: LogLevels.fatal,
  },
  error: {
    level: LogLevels.error,
  },
  
  // ⚠️ 警告信息（1级）
  warn: {
    level: LogLevels.warn,
  },
  
  // 📝 普通记录（2级）
  log: {
    level: LogLevels.log,
  },
  
  // 📢 常规信息（3级）
  info: {
    level: LogLevels.info,
  },
  success: {
    level: LogLevels.success,
  },
  fail: {
    level: LogLevels.fail,
  },
  ready: {
    level: LogLevels.info,
  },
  start: {
    level: LogLevels.info,
  },
  box: {
    level: LogLevels.info,
  },
  
  // 🔍 调试信息（4级）
  debug: {
    level: LogLevels.debug,
  },
  
  // 🔬 追踪信息（5级）
  trace: {
    level: LogLevels.trace,
  },
  
  // 📚 详细模式
  verbose: {
    level: LogLevels.verbose,
  },
};
