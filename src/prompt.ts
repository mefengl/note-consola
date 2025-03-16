// 小朋友们，这个文件就像是一个友好的对话助手！
// 它可以帮助我们和电脑进行各种有趣的对话 🗣️

import { text, confirm, select, multiselect } from "@clack/prompts";

// 这就像是选择题的选项卡片
type SelectOption = {
  label: string;    // 卡片上显示的文字
  value: string;    // 卡片代表的答案
  hint?: string;    // 额外的小提示
};

// 当我们不想回答问题时的特殊标记
export const kCancel = Symbol.for("cancel");

// 就像是设置对话的基本规则
export type PromptCommonOptions = {
  /**
   * 当我们按下Ctrl+C不想继续对话时，该怎么办呢？
   * 就像是有不同的方式来说"再见"：
   * - "default" - 用默认的答案代替
   * - "undefined" - 轻轻地离开，什么都不说
   * - "null" - 留下一个空白的答案
   * - "symbol" - 留下一个特殊的标记
   * - "reject" - 告诉大家我们中断了对话
   */
  cancel?: "reject" | "default" | "undefined" | "null" | "symbol";
};

// 像是发短信一样，可以输入文字的对话框
export type TextPromptOptions = PromptCommonOptions & {
  /**
   * Specifies the prompt type as text.
   * @optional
   * @default "text"
   */
  type?: "text";

  /**
   * The default text value.
   * @optional
   */
  default?: string;

  /**
   * A placeholder text displayed in the prompt.
   * @optional
   */
  placeholder?: string;

  /**
   * The initial text value.
   * @optional
   */
  initial?: string;
};

// 像是回答"是"或"否"的简单问题
export type ConfirmPromptOptions = PromptCommonOptions & {
  /**
   * Specifies the prompt type as confirm.
   */
  type: "confirm";

  /**
   * The initial value for the confirm prompt.
   * @optional
   */
  initial?: boolean;
};

// 像是从一组选项中选择最喜欢的一个
export type SelectPromptOptions = PromptCommonOptions & {
  /**
   * Specifies the prompt type as select.
   */
  type: "select";

  /**
   * The initial value for the select prompt.
   * @optional
   */
  initial?: string;

  /**
   * The options to select from. See {@link SelectOption}.
   */
  options: (string | SelectOption)[];
};

// 像是在选择多个最喜欢的玩具
export type MultiSelectOptions = PromptCommonOptions & {
  /**
   * Specifies the prompt type as multiselect.
   */
  type: "multiselect";

  /**
   * The options to select from. See {@link SelectOption}.
   */
  initial?: string[];

  /**
   * The options to select from. See {@link SelectOption}.
   */
  options: (string | SelectOption)[];

  /**
   * Whether the prompt requires at least one selection.
   */
  required?: boolean;
};

// 把所有类型的对话方式都收集在一起
export type PromptOptions =
  | TextPromptOptions
  | ConfirmPromptOptions
  | SelectPromptOptions
  | MultiSelectOptions;

// 这些是帮助我们理解对话结果的小助手
type inferPromptReturnType<T extends PromptOptions> =
  T extends TextPromptOptions
    ? string
    : T extends ConfirmPromptOptions
      ? boolean
      : T extends SelectPromptOptions
        ? T["options"][number] extends SelectOption
          ? T["options"][number]["value"]
          : T["options"][number]
        : T extends MultiSelectOptions
          ? T["options"]
          : unknown;

type inferPromptCancalReturnType<T extends PromptOptions> = T extends {
  cancel: "reject";
}
  ? never
  : T extends { cancel: "default" }
    ? inferPromptReturnType<T>
    : T extends { cancel: "undefined" }
      ? undefined
      : T extends { cancel: "null" }
        ? null
        : T extends { cancel: "symbol" }
          ? typeof kCancel
          : inferPromptReturnType<T> /* default */;

/**
 * 这是我们的主要对话功能！就像是一个友好的对话机器人 🤖
 * 它可以：
 * - 让你输入文字（像写日记）
 * - 问你是或否的问题（像选择去不去游乐园）
 * - 让你从列表中选择（像选择最喜欢的冰淇淋口味）
 * - 让你选择多个选项（像选择想要的生日礼物）
 */
export async function prompt<
  _ = any,
  __ = any,
  T extends PromptOptions = TextPromptOptions,
>(
  message: string,
  opts: PromptOptions = {},
): Promise<inferPromptReturnType<T> | inferPromptCancalReturnType<T>> {
  // 当对话被中断时，我们需要一个友好的方式来处理它
  const handleCancel = (value: unknown) => {
    if (
      typeof value !== "symbol" ||
      value.toString() !== "Symbol(clack:cancel)"
    ) {
      return value;
    }

    switch (opts.cancel) {
      case "reject": {
        const error = new Error("Prompt cancelled.");
        error.name = "ConsolaPromptCancelledError";
        if (Error.captureStackTrace) {
          Error.captureStackTrace(error, prompt);
        }
        throw error;
      }
      case "undefined": {
        return undefined;
      }
      case "null": {
        return null;
      }
      case "symbol": {
        return kCancel;
      }
      default:
      case "default": {
        return (opts as TextPromptOptions).default ?? opts.initial;
      }
    }
  };

  // 根据不同的对话类型，选择合适的方式进行交谈
  if (!opts.type || opts.type === "text") {
    return (await text({
      message,
      defaultValue: opts.default,
      placeholder: opts.placeholder,
      initialValue: opts.initial as string,
    }).then(handleCancel)) as any;
  }

  if (opts.type === "confirm") {
    return (await confirm({
      message,
      initialValue: opts.initial,
    }).then(handleCancel)) as any;
  }

  if (opts.type === "select") {
    return (await select({
      message,
      options: opts.options.map((o) =>
        typeof o === "string" ? { value: o, label: o } : o,
      ),
      initialValue: opts.initial,
    }).then(handleCancel)) as any;
  }

  if (opts.type === "multiselect") {
    return (await multiselect({
      message,
      options: opts.options.map((o) =>
        typeof o === "string" ? { value: o, label: o } : o,
      ),
      required: opts.required,
      initialValues: opts.initial,
    }).then(handleCancel)) as any;
  }

  throw new Error(`Unknown prompt type: ${opts.type}`);
}
