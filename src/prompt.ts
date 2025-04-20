// 小朋友们，这个文件就像是一个友好的对话助手！
// 它可以帮助我们的程序和用户进行各种有趣的对话 🗣️
// 比如问问题，让用户输入文字，或者做选择题。

// 我们需要从一个叫做 "@clack/prompts" 的工具箱里拿出一些工具
// 这些工具就像是不同类型的对话框：
// - `text`: 用来输入文字的对话框，像写日记一样 📝
// - `confirm`: 用来回答 "是" 或 "否" 的对话框，像决定要不要吃糖果 🍬
// - `select`: 用来从几个选项里选一个的对话框，像选最喜欢的颜色 🎨
// - `multiselect`: 用来从几个选项里选好几个的对话框，像选想带去野餐的零食 🍎🍌🍪
import { text, confirm, select, multiselect } from "@clack/prompts";

// 这是定义选择题选项的 "卡片" 样式
// 每张卡片上有什么信息呢？
type SelectOption = {
  label: string;    // 卡片上显示的文字，比如 "红色" 或 "蓝色"
  value: string;    // 这张卡片代表的真正答案，可能和显示的不一样，但电脑认识它
  hint?: string;    // 额外的小提示，就像是悄悄话告诉你这个选项是干嘛的 (这个是可选的，可以没有)
};

// 这个是一个特殊的标记，像一个秘密信号 🤫
// 当用户不想回答问题，按下取消键 (比如 Ctrl+C) 时，我们用这个标记来表示 "取消了哦"
export const kCancel = Symbol.for("cancel");

// 这是所有对话框都需要遵守的一些基本规则
export type PromptCommonOptions = {
  /**
   * 当我们按下Ctrl+C不想继续对话时，该怎么办呢？ 🤔
   * 这就像是有不同的方式来说"再见"：
   * - "reject": 直接告诉大家 "对话中断了！"，然后可能会报错 💥 (抛出一个错误)
   * - "default": 就当用户选了默认的那个答案吧 👍 (使用 `default` 或 `initial` 值)
   * - "undefined": 轻轻地离开，什么也不留下，就像没发生过一样 🤷‍♀️ (返回 undefined)
   * - "null": 留下一个空白的答案，表示 "这里空空如也" 👻 (返回 null)
   * - "symbol": 留下我们之前定义的那个秘密取消标记 `kCancel` 🤫 (返回 Symbol.for("cancel"))
   *
   * 如果不设置，默认就是 "default" 方式。
   */
  cancel?: "reject" | "default" | "undefined" | "null" | "symbol";
};

// 这是 "输入文字" 对话框的详细设置卡 📝
export type TextPromptOptions = PromptCommonOptions & { // 它包含了上面定义的通用规则
  /**
   * 明确告诉大家，这是一个 "text" 类型的对话框。
   * 这个通常不用我们自己写，默认就是 "text"。
   * @optional
   * @default "text"
   */
  type?: "text";

  /**
   * 如果用户什么都不输入，就用这个作为默认答案。
   * 比如问题是 "你叫什么名字？"，默认答案可以是 "无名氏"。
   * @optional
   */
  default?: string;

  /**
   * 在输入框里显示的提示文字，告诉用户应该输入什么。
   * 比如 "请输入你的昵称..."
   * @optional
   */
  placeholder?: string;

  /**
   * 一开始就填在输入框里的文字。
   * 比如问题是 "你的邮箱？"，可以预先填上 "@example.com"。
   * @optional
   */
  initial?: string;
};

// 这是 "是/否" 对话框的详细设置卡 🤔
export type ConfirmPromptOptions = PromptCommonOptions & { // 它也包含了通用规则
  /**
   * 必须明确告诉大家，这是一个 "confirm" 类型的对话框。
   */
  type: "confirm";

  /**
   * 一开始默认是选 "是" 还是 "否" 呢？
   * `true` 代表 "是"，`false` 代表 "否"。
   * @optional
   */
  initial?: boolean;
};

// 这是 "单选题" 对话框的详细设置卡 ☝️
export type SelectPromptOptions = PromptCommonOptions & { // 它也包含了通用规则
  /**
   * 必须明确告诉大家，这是一个 "select" 类型的对话框。
   */
  type: "select";

  /**
   * 一开始默认选中哪个选项呢？这里填选项的 `value`。
   * @optional
   */
  initial?: string;

  /**
   * 把所有的选项都列出来，让用户选。
   * 选项可以是简单的文字 (比如 `["苹果", "香蕉"]`)，
   * 也可以是我们之前定义的 [SelectOption](cci:2://file:///Volumes/MI-1T/Developer/GitHub/note-consola/src/prompt.ts:6:0-10:2) 卡片 (`[{ label: "红苹果", value: "apple" }]`)。
   */
  options: (string | SelectOption)[];
};

// 这是 "多选题" 对话框的详细设置卡 ✅✅
export type MultiSelectOptions = PromptCommonOptions & { // 它也包含了通用规则
  /**
   * 必须明确告诉大家，这是一个 "multiselect" 类型的对话框。
   */
  type: "multiselect";

  /**
   * 一开始默认选中哪些选项呢？这里填选项 `value` 组成的列表。
   * 比如 `["apple", "banana"]`。
   * @optional
   */
  initial?: string[];

  /**
   * 把所有的选项都列出来，让用户选。
   * 和单选题一样，可以是简单的文字或 [SelectOption](cci:2://file:///Volumes/MI-1T/Developer/GitHub/note-consola/src/prompt.ts:6:0-10:2) 卡片。
   */
  options: (string | SelectOption)[];

  /**
   * 是不是必须至少选一个选项？
   * 如果是 `true`，用户就不能一个都不选。
   * @optional
   */
  required?: boolean;
};

// 把上面所有类型的对话框设置卡都放在一个大盒子里 📦
// 这样我们用的时候就知道可能会是哪一种了。
export type PromptOptions =
  | TextPromptOptions
  | ConfirmPromptOptions
  | SelectPromptOptions
  | MultiSelectOptions;

// === 下面是一些比较魔法的部分，帮助电脑理解对话结果 ===

// 这个小助手的作用是：根据对话框的设置 (T)，推断出用户回答完之后，我们会得到什么类型的结果？
// 就像是提前知道玩具盒里可能是什么玩具。
type inferPromptReturnType<T extends PromptOptions> =
  // 如果是 "text" 对话框...
  T extends TextPromptOptions
    ? string // ...结果就是一段文字 (string)
  // 如果是 "confirm" 对话框...
  : T extends ConfirmPromptOptions
    ? boolean // ...结果就是 "是" (true) 或 "否" (false)
  // 如果是 "select" 对话框...
  : T extends SelectPromptOptions
    // ...我们得看看选项是什么样的
    ? T["options"][number] extends SelectOption // 如果选项是 SelectOption 卡片...
      ? T["options"][number]["value"] // ...结果就是选中卡片的 value (通常是 string)
      : T["options"][number] // 如果选项只是简单文字... 结果就是那个文字 (string)
  // 如果是 "multiselect" 对话框...
  : T extends MultiSelectOptions
    ? T["options"] // ...结果就是用户选中的所有选项组成的列表
  // 如果都不是上面这些...
  : unknown; // ...那就不知道是啥了 (unknown)

// 这个小助手更厉害一点：它不仅考虑了正常回答的结果，还考虑了用户取消对话的情况！
// 它会根据设置里的 `cancel` 规则，推断取消时我们会得到什么。
type inferPromptCancalReturnType<T extends PromptOptions> = T extends {
  cancel: "reject"; // 如果规则是 "reject"...
}
  ? never // ...那么取消时就不会有正常返回值，因为程序会报错中断 (never)
  : T extends { cancel: "default" } // 如果规则是 "default"...
    ? inferPromptReturnType<T> // ...取消时的结果类型和正常回答一样
    : T extends { cancel: "undefined" } // 如果规则是 "undefined"...
      ? undefined // ...取消时结果是 undefined
      : T extends { cancel: "null" } // 如果规则是 "null"...
        ? null // ...取消时结果是 null
        : T extends { cancel: "symbol" } // 如果规则是 "symbol"...
          ? typeof kCancel // ...取消时结果是我们的秘密标记 `kCancel`
          : inferPromptReturnType<T>; /* default */ // 如果没设置 cancel 或者设置了其他，默认行为和 "default" 一样

/**
 * 这就是我们最重要的对话功能！像一个友好的对话机器人 🤖
 * 它可以根据你给的设置 (opts)，向用户问问题 (message)。
 *
 * @param message 要问用户的问题，比如 "你今天开心吗？"
 * @param opts 对话框的详细设置，决定了这是哪种对话方式以及具体规则 (默认是 {})
 * @returns 返回一个 Promise，表示对话可能需要一点时间。
 *          对话结束后，Promise 会带着用户的回答结果 (或者取消时的特殊结果) 来找你。
 *          结果的类型由上面两个小助手推断得出。
 */
export async function prompt<
  // 这两个 _ 和 __ 是泛型参数的占位符，这里没用到，但写出来是为了保持函数签名的某种一致性或未来扩展性
  _ = any,
  __ = any,
  // T 代表传入的对话框设置类型，默认是 TextPromptOptions
  T extends PromptOptions = TextPromptOptions,
>(
  message: string, // 要显示给用户的消息或问题
  opts: PromptOptions = {}, // 对话框的选项，默认为空对象，会使用文本输入的默认设置
): Promise<inferPromptReturnType<T> | inferPromptCancalReturnType<T>> {
  // 这个内部小函数专门处理用户取消对话的情况
  const handleCancel = (value: unknown) => {
    // 首先检查传进来的 value 是不是那个特殊的 "clack取消" 标记
    // @clack/prompts 库在用户取消时会返回 Symbol.for("clack:cancel")
    if (
      typeof value !== "symbol" || // 如果不是 symbol 类型
      value.toString() !== "Symbol(clack:cancel)" // 或者不是 clack 的取消标记
    ) {
      // 那就说明用户没有取消，或者取消了但我们不需要特殊处理，直接返回原值
      return value;
    }

    // 如果确定是用户按了取消键，就根据我们之前设置的 `opts.cancel` 规则来决定怎么做
    switch (opts.cancel) {
      case "reject": {
        // 规则是 "reject"：创建一个错误对象，告诉大家是用户取消了
        const error = new Error("Prompt cancelled.");
        error.name = "ConsolaPromptCancelledError"; // 给错误取个名字，方便识别
        // 如果环境支持，记录下错误发生的位置，方便调试
        if (Error.captureStackTrace) {
          Error.captureStackTrace(error, prompt);
        }
        // 把错误抛出去！程序可能会因此停止。
        throw error;
      }
      case "undefined": {
        // 规则是 "undefined"：返回 undefined
        return undefined;
      }
      case "null": {
        // 规则是 "null"：返回 null
        return null;
      }
      case "symbol": {
        // 规则是 "symbol"：返回我们自己定义的取消标记 `kCancel`
        return kCancel;
      }
      // 默认情况 (包括 "default" 和没有设置 cancel)
      default:
      case "default": {
        // 返回设置中的默认值 `default`，如果没设置 `default`，就用 `initial` 值
        // 注意这里需要类型断言 `as TextPromptOptions`，因为 `default` 只在 TextPromptOptions 里有
        // 其他类型的 `initial` 会在这里被用到
        return (opts as TextPromptOptions).default ?? opts.initial;
      }
    }
  };

  // 现在，根据用户传入的 `opts.type` 来决定使用哪种对话框工具
  // 如果没有指定 type，或者 type 是 "text"...
  if (!opts.type || opts.type === "text") {
    // ...就使用 @clack/prompts 提供的 `text` 工具
    const result = await text({ // `await` 表示我们要等待用户输入完成
      message, // 要问的问题
      placeholder: opts.placeholder, // 输入框提示
      defaultValue: opts.default, // 默认值
      initialValue: opts.initial, // 初始值
      validate: (value) => {
        // 这里可以添加验证逻辑，比如检查输入是否为空，暂时注释掉
        // if (value.length === 0) return `Value is required!`;
      },
    });
    // 把用户输入的结果交给 [handleCancel](cci:1://file:///Volumes/MI-1T/Developer/GitHub/note-consola/src/prompt.ts:164:2-196:4) 处理一下，以防用户中途取消
    return handleCancel(result);
  }

  // 如果 type 是 "confirm"...
  if (opts.type === "confirm") {
    // ...就使用 `confirm` 工具
    const result = await confirm({
      message, // 要问的问题
      initialValue: opts.initial, // 默认是 "是" 还是 "否"
    });
    // 同样交给 [handleCancel](cci:1://file:///Volumes/MI-1T/Developer/GitHub/note-consola/src/prompt.ts:164:2-196:4) 处理取消情况
    return handleCancel(result);
  }

  // 如果 type 是 "select"...
  if (opts.type === "select") {
    // ...就使用 `select` 工具
    const result = await select({
      message, // 要问的问题
      initialValue: opts.initial, // 默认选中哪个
      options: opts.options.map((opt) => // 处理选项列表
        // 如果选项是简单文字，就把它变成 { value: 文字, label: 文字 } 的格式
        typeof opt === "string" ? { value: opt, label: opt } : opt, // 如果已经是对象格式就直接用
      ),
    });
    // 同样交给 [handleCancel](cci:1://file:///Volumes/MI-1T/Developer/GitHub/note-consola/src/prompt.ts:164:2-196:4) 处理取消情况
    return handleCancel(result);
  }

  // 如果 type 是 "multiselect"...
  if (opts.type === "multiselect") {
    // ...就使用 `multiselect` 工具
    const result = await multiselect({
      message, // 要问的问题
      initialValue: opts.initial, // 默认选中哪些
      options: opts.options.map((opt) => // 处理选项列表
        typeof opt === "string" ? { value: opt, label: opt } : opt,
      ),
      required: opts.required, // 是否至少选一个
    });
    // 同样交给 [handleCancel](cci:1://file:///Volumes/MI-1T/Developer/GitHub/note-consola/src/prompt.ts:164:2-196:4) 处理取消情况
    return handleCancel(result);
  }

  // 如果 `opts.type` 是上面任何一种都不认识的奇怪类型...
  // 就抛出一个错误，告诉大家我们不支持这种对话方式
  throw new Error(`Invalid prompt type: ${(opts as any).type}`);
}
