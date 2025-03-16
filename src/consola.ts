/**
 * 🎮 Consola 核心类文件
 * 想象这是一个超级日志游戏机！它可以：
 * 1. 显示不同类型的消息（就像游戏里的提示、警告、错误）
 * 2. 暂停和继续显示消息（就像游戏的暂停功能）
 * 3. 可以装扮消息（让消息显示得更漂亮）
 * 4. 可以控制消息的重要程度（就像游戏里的难度等级）
 */

import { defu } from "defu";
import { LogTypes, LogType, LogLevel } from "./constants";
import { isLogObj } from "./utils/log";
import type {
  ConsolaReporter,
  InputLogObject,
  LogObject,
  ConsolaOptions,
} from "./types";
import type { PromptOptions } from "./prompt";

/**
 * 🎮 全局暂停开关
 * 就像游戏的暂停按钮，当设为true时，所有新的日志都会先存起来，等恢复时再显示
 */
let paused = false;

/**
 * 📦 消息暂存箱
 * 当游戏暂停时，新的消息会被放在这个箱子里
 */
const queue: any[] = [];

/**
 * 🎮 Consola主类
 * 这就像是一台超级日志游戏机，可以显示各种各样的消息！
 */
export class Consola {
  /**
   * ⚙️ 配置选项
   * 就像游戏的设置菜单，可以调整各种功能
   */
  options: ConsolaOptions;

  /**
   * 📝 最后一条日志的记录
   * 记住最后显示的消息，用来控制重复的消息不会刷屏
   */
  _lastLog: {
    serialized?: string;    // 消息的编码版本
    object?: LogObject;     // 完整的消息对象
    count?: number;         // 重复次数
    time?: Date;           // 记录时间
    timeout?: ReturnType<typeof setTimeout>;  // 定时器
  };

  /**
   * 🎭 模拟函数
   * 在测试时使用，就像彩排一样，不是真的显示
   */
  _mockFn?: ConsolaOptions["mockFn"];

  /**
   * 🎮 创建一个新的游戏机实例
   * @param options 游戏机的设置，可以调整显示效果、等级等
   */
  constructor(options: Partial<ConsolaOptions> = {}) {
    // 初始化设置
    const types = options.types || LogTypes;
    this.options = defu(
      <ConsolaOptions>{
        ...options,
        defaults: { ...options.defaults },
        level: _normalizeLogLevel(options.level, types),
        reporters: [...(options.reporters || [])],
      },
      <Partial<ConsolaOptions>>{
        types: LogTypes,
        throttle: 1000,      // 控制消息显示的间隔（毫秒）
        throttleMin: 5,      // 最少显示多少条重复消息
        formatOptions: {
          date: true,        // 显示时间
          colors: false,     // 是否使用彩色
          compact: true,     // 是否紧凑显示
        },
      },
    );

    // 创建各种类型的日志函数
    for (const type in types) {
      const defaults: InputLogObject = {
        type: type as LogType,
        ...this.options.defaults,
        ...types[type as LogType],
      };
      // 创建普通版本的日志函数
      // @ts-expect-error
      (this as unknown as ConsolaInstance)[type as LogType] =
        this._wrapLogFn(defaults);
      // 创建原始版本的日志函数
      // @ts-expect-error
      (this as unknown as ConsolaInstance)[type].raw = this._wrapLogFn(
        defaults,
        true,
      );
    }

    // 如果设置了模拟函数，就启用模拟模式
    if (this.options.mockFn) {
      this.mockTypes();
    }

    // 初始化最后日志记录
    this._lastLog = {};
  }

  /**
   * 📊 获取当前的日志级别
   * 就像获取游戏的难度等级
   */
  get level() {
    return this.options.level;
  }

  /**
   * 📊 设置新的日志级别
   * 就像调整游戏的难度等级
   */
  set level(level) {
    this.options.level = _normalizeLogLevel(
      level,
      this.options.types,
      this.options.level,
    );
  }

  /**
   * 💭 显示交互式提示
   * 就像游戏里和玩家对话，等待玩家的选择
   */
  prompt<T extends PromptOptions>(message: string, opts?: T) {
    if (!this.options.prompt) {
      throw new Error("prompt is not supported!");
    }
    return this.options.prompt<any, any, T>(message, opts);
  }

  /**
   * 🎮 创建一个新的游戏机实例
   * 就像复制一个游戏机，但可以有不同的设置
   */
  create(options: Partial<ConsolaOptions>): ConsolaInstance {
    const instance = new Consola({
      ...this.options,
      ...options,
    }) as ConsolaInstance;
    if (this._mockFn) {
      instance.mockTypes(this._mockFn);
    }
    return instance;
  }

  /**
   * ⚙️ 创建带默认设置的新实例
   * 就像创建一个预设好的游戏存档
   */
  withDefaults(defaults: InputLogObject): ConsolaInstance {
    return this.create({
      ...this.options,
      defaults: {
        ...this.options.defaults,
        ...defaults,
      },
    });
  }

  /**
   * 🏷️ 创建带标签的新实例
   * 就像给游戏角色起个名字，之后的消息都会带着这个名字
   */
  withTag(tag: string): ConsolaInstance {
    return this.withDefaults({
      tag: this.options.defaults.tag
        ? this.options.defaults.tag + ":" + tag
        : tag,
    });
  }

  /**
   * 📺 添加新的显示器
   * 就像给游戏机接上一个新的显示屏
   */
  addReporter(reporter: ConsolaReporter) {
    this.options.reporters.push(reporter);
    return this;
  }

  /**
   * 🔌 移除显示器
   * 就像拔掉一个显示屏
   */
  removeReporter(reporter: ConsolaReporter) {
    if (reporter) {
      const i = this.options.reporters.indexOf(reporter);
      if (i !== -1) {
        return this.options.reporters.splice(i, 1);
      }
    } else {
      this.options.reporters.splice(0);
    }
    return this;
  }

  /**
   * 🔄 替换所有显示器
   * 就像换掉所有的显示屏
   */
  setReporters(reporters: ConsolaReporter[]) {
    this.options.reporters = Array.isArray(reporters) ? reporters : [reporters];
    return this;
  }

  /**
   * 🔗 包装所有输出
   * 让所有消息都通过我们的游戏机显示
   */
  wrapAll() {
    this.wrapConsole();
    this.wrapStd();
  }

  /**
   * 🔙 恢复所有输出
   * 恢复到原来的显示方式
   */
  restoreAll() {
    this.restoreConsole();
    this.restoreStd();
  }

  /**
   * 🎮 接管控制台
   * 让普通的console消息也变得好看
   */
  wrapConsole() {
    for (const type in this.options.types) {
      // 备份原始函数
      if (!(console as any)["__" + type]) {
        (console as any)["__" + type] = (console as any)[type];
      }
      // 替换为我们的函数
      (console as any)[type] = (this as unknown as ConsolaInstance)[
        type as LogType
      ].raw;
    }
  }

  /**
   * 🔙 恢复控制台
   * 恢复普通的console显示方式
   */
  restoreConsole() {
    for (const type in this.options.types) {
      if ((console as any)["__" + type]) {
        (console as any)[type] = (console as any)["__" + type];
        delete (console as any)["__" + type];
      }
    }
  }

  /**
   * 📺 接管标准输出
   * 让系统的输出也变得好看
   */
  wrapStd() {
    this._wrapStream(this.options.stdout, "log");
    this._wrapStream(this.options.stderr, "log");
  }

  /**
   * 🔌 包装输出流
   * 让某个显示通道变得好看
   */
  _wrapStream(stream: NodeJS.WriteStream | undefined, type: LogType) {
    if (!stream) {
      return;
    }
    // 备份原始写入函数
    if (!(stream as any).__write) {
      (stream as any).__write = stream.write;
    }
    // 替换为我们的函数
    (stream as any).write = (data: any) => {
      (this as unknown as ConsolaInstance)[type].raw(String(data).trim());
    };
  }

  /**
   * 🔙 恢复标准输出
   * 恢复系统原来的输出方式
   */
  restoreStd() {
    this._restoreStream(this.options.stdout);
    this._restoreStream(this.options.stderr);
  }

  /**
   * 🔌 恢复输出流
   * 恢复某个显示通道的原始状态
   */
  _restoreStream(stream?: NodeJS.WriteStream) {
    if (!stream) {
      return;
    }
    if ((stream as any).__write) {
      stream.write = (stream as any).__write;
      delete (stream as any).__write;
    }
  }

  /**
   * ⏸️ 暂停日志
   * 就像按下游戏的暂停键
   */
  pauseLogs() {
    paused = true;
  }

  /**
   * ▶️ 恢复日志
   * 就像按下游戏的继续键
   */
  resumeLogs() {
    paused = false;
    // 处理队列中的日志
    const _queue = queue.splice(0);
    for (const item of _queue) {
      item[0]._logFn(item[1], item[2]);
    }
  }

  /**
   * 🎭 启用模拟模式
   * 就像游戏的彩排模式，不会真的显示
   */
  mockTypes(mockFn?: ConsolaOptions["mockFn"]) {
    const _mockFn = mockFn || this.options.mockFn;
    this._mockFn = _mockFn;
    if (typeof _mockFn !== "function") {
      return;
    }
    for (const type in this.options.types) {
      // @ts-expect-error
      (this as unknown as ConsolaInstance)[type as LogType] =
        _mockFn(type as LogType, this.options.types[type as LogType]) ||
        (this as unknown as ConsolaInstance)[type as LogType];
      (this as unknown as ConsolaInstance)[type as LogType].raw = (
        this as unknown as ConsolaInstance
      )[type as LogType];
    }
  }

  /**
   * 📝 包装日志函数
   * 为每种类型的日志创建一个特殊的显示函数
   */
  _wrapLogFn(defaults: InputLogObject, isRaw?: boolean) {
    return (...args: any[]) => {
      if (paused) {
        queue.push([this, defaults, args, isRaw]);
        return;
      }
      return this._logFn(defaults, args, isRaw);
    };
  }

  /**
   * 📝 处理日志
   * 真正执行日志显示的核心函数
   */
  _logFn(defaults: InputLogObject, args: any[], isRaw?: boolean) {
    // 检查日志级别
    if (((defaults.level as number) || 0) > this.level) {
      return false;
    }

    // 创建新的日志对象
    const logObj: Partial<LogObject> = {
      date: new Date(),
      args: [],
      ...defaults,
      level: _normalizeLogLevel(defaults.level, this.options.types),
    };

    // 处理参数
    if (!isRaw && args.length === 1 && isLogObj(args[0])) {
      Object.assign(logObj, args[0]);
    } else {
      logObj.args = [...args];
    }

    // 处理别名
    if (logObj.message) {
      logObj.args!.unshift(logObj.message);
      delete logObj.message;
    }
    if (logObj.additional) {
      if (!Array.isArray(logObj.additional)) {
        logObj.additional = logObj.additional.split("\n");
      }
      logObj.args!.push("\n" + logObj.additional.join("\n"));
      delete logObj.additional;
    }

    // 标准化类型为小写
    logObj.type = (
      typeof logObj.type === "string" ? logObj.type.toLowerCase() : "log"
    ) as LogType;
    logObj.tag = typeof logObj.tag === "string" ? logObj.tag : "";

    /**
     * 📝 显示日志
     * @param newLog 是否是新日志
     */
    const resolveLog = (newLog = false) => {
      // 处理重复的日志
      const repeated = (this._lastLog.count || 0) - this.options.throttleMin;
      if (this._lastLog.object && repeated > 0) {
        const args = [...this._lastLog.object.args];
        if (repeated > 1) {
          args.push(`(repeated ${repeated} times)`);
        }
        this._log({ ...this._lastLog.object, args });
        this._lastLog.count = 1;
      }

      // 显示新日志
      if (newLog) {
        this._lastLog.object = logObj as LogObject;
        this._log(logObj as LogObject);
      }
    };

    // 控制重复日志
    clearTimeout(this._lastLog.timeout);
    const diffTime =
      this._lastLog.time && logObj.date
        ? logObj.date.getTime() - this._lastLog.time.getTime()
        : 0;
    this._lastLog.time = logObj.date;

    // 如果时间间隔太短
    if (diffTime < this.options.throttle) {
      try {
        const serializedLog = JSON.stringify([
          logObj.type,
          logObj.tag,
          logObj.args,
        ]);
        const isSameLog = this._lastLog.serialized === serializedLog;
        this._lastLog.serialized = serializedLog;
        if (isSameLog) {
          this._lastLog.count = (this._lastLog.count || 0) + 1;
          if (this._lastLog.count > this.options.throttleMin) {
            // 自动在节流时间后显示
            this._lastLog.timeout = setTimeout(
              resolveLog,
              this.options.throttle,
            );
            return; // 跳过显示（防止刷屏）
          }
        }
      } catch {
        // 处理循环引用错误
      }
    }

    // 显示日志
    resolveLog(true);
  }

  /**
   * 📺 显示日志
   * 通过所有显示器显示日志
   */
  _log(logObj: LogObject) {
    for (const reporter of this.options.reporters) {
      reporter.log(logObj, {
        options: this.options,
      });
    }
  }
}

/**
 * 📊 标准化日志级别
 * 确保日志级别是一个有效的数字
 */
function _normalizeLogLevel(
  input: LogLevel | LogType | undefined,
  types: any = {},
  defaultLevel = 3,
) {
  if (input === undefined) {
    return defaultLevel;
  }
  if (typeof input === "number") {
    return input;
  }
  if (types[input] && types[input].level !== undefined) {
    return types[input].level;
  }
  return defaultLevel;
}

/**
 * 📝 日志函数类型
 * 定义了日志函数应该是什么样子
 */
export interface LogFn {
  (message: InputLogObject | any, ...args: any[]): void;
  raw: (...args: any[]) => void;
}

/**
 * 🎮 Consola实例类型
 * 组合了Consola类和所有日志类型的函数
 */
export type ConsolaInstance = Consola & Record<LogType, LogFn>;

// 支持旧版本的函数名
// @ts-expect-error
Consola.prototype.add = Consola.prototype.addReporter;
// @ts-expect-error
Consola.prototype.remove = Consola.prototype.removeReporter;
// @ts-expect-error
Consola.prototype.clear = Consola.prototype.removeReporter;
// @ts-expect-error
Consola.prototype.withScope = Consola.prototype.withTag;
// @ts-expect-error
Consola.prototype.mock = Consola.prototype.mockTypes;
// @ts-expect-error
Consola.prototype.pause = Consola.prototype.pauseLogs;
// @ts-expect-error
Consola.prototype.resume = Consola.prototype.resumeLogs;

/**
 * 🎮 创建新的Consola实例
 * 就像买一台新的游戏机
 * 
 * @param options 游戏机的配置选项
 * @returns 一个全新的游戏机实例
 */
export function createConsola(
  options: Partial<ConsolaOptions> = {},
): ConsolaInstance {
  return new Consola(options) as ConsolaInstance;
}
