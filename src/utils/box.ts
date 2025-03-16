/**
 * 🖼️ 画框框工具
 * 
 * 想象这个文件是一个画相框的工具：
 * - 可以画各种样式的相框（实线、双线、圆角等）
 * - 可以给相框涂上不同的颜色
 * - 可以调整相框的大小和位置
 * - 就像在纸上画一个漂亮的相框！
 */

import { getColor } from "./color";
import { stripAnsi } from "./string";

/**
 * 📏 相框边框样式
 * 就像选择相框的样式：
 */
export type BoxBorderStyle = {
  /**
   * 左上角（像这样：┌）
   */
  tl: string;

  /**
   * 右上角（像这样：┐）
   */
  tr: string;

  /**
   * 左下角（像这样：└）
   */
  bl: string;

  /**
   * 右下角（像这样：┘）
   */
  br: string;

  /**
   * 横线（像这样：─）
   */
  h: string;

  /**
   * 竖线（像这样：│）
   */
  v: string;
};

/**
 * 🎨 预设的相框样式
 * 就像一本相框目录，里面有各种款式：
 */
const boxStylePresets: Record<string, BoxBorderStyle> = {
  // 实线相框（最简单的款式）
  solid: {
    tl: "┌", tr: "┐",
    bl: "└", br: "┘",
    h: "─", v: "│",
  },
  
  // 双线相框（比较花哨的款式）
  double: {
    tl: "╔", tr: "╗",
    bl: "╚", br: "╝",
    h: "═", v: "║",
  },
  
  // 混合相框（横线单，竖线双）
  doubleSingle: {
    tl: "╓", tr: "╖",
    bl: "╙", br: "╜",
    h: "─", v: "║",
  },
  
  // 圆角混合相框（横线单，竖线双，圆角）
  doubleSingleRounded: {
    tl: "╭", tr: "╮",
    bl: "╰", br: "╯",
    h: "─", v: "║",
  },
  
  // 粗线相框
  singleThick: {
    tl: "┏", tr: "┓",
    bl: "┗", br: "┛",
    h: "━", v: "┃",
  },
  
  // 混合相框（横线双，竖线单）
  singleDouble: {
    tl: "╒", tr: "╕",
    bl: "╘", br: "╛",
    h: "═", v: "│",
  },
  
  // 圆角混合相框（横线双，竖线单，圆角）
  singleDoubleRounded: {
    tl: "╭", tr: "╮",
    bl: "╰", br: "╯",
    h: "═", v: "│",
  },
  
  // 圆角相框（最可爱的款式）
  rounded: {
    tl: "╭", tr: "╮",
    bl: "╰", br: "╯",
    h: "─", v: "│",
  },
};

/**
 * ⚙️ 相框的详细设置
 * 就像选择相框时要决定的事情：
 */
export type BoxStyle = {
  /**
   * 相框的颜色（像选择画笔的颜色）
   * 默认是白色
   */
  borderColor: "black" | "red" | "green" | "yellow" | "blue" | 
               "magenta" | "cyan" | "white" | "gray" |
               "blackBright" | "redBright" | "greenBright" | 
               "yellowBright" | "blueBright" | "magentaBright" | 
               "cyanBright" | "whiteBright";

  /**
   * 相框的样式（像选择相框的款式）
   * 默认是圆角款式
   */
  borderStyle: BoxBorderStyle | keyof typeof boxStylePresets;

  /**
   * 文字的上下位置（像决定照片在相框里的位置）
   * - top: 靠上
   * - center: 居中
   * - bottom: 靠下
   */
  valign: "top" | "center" | "bottom";

  /**
   * 内边距（像照片和相框之间的空隙）
   * 默认是2个空格
   */
  padding: number;

  /**
   * 左边距（像相框离纸张左边的距离）
   * 默认是1个空格
   */
  marginLeft: number;

  /**
   * 上边距（像相框离纸张上边的距离）
   * 默认是1个空格
   */
  marginTop: number;

  /**
   * 下边距（像相框离纸张下边的距离）
   * 默认是1个空格
   */
  marginBottom: number;
};

/**
 * 📦 相框的可选设置
 * 就像顾客说明想要的相框样式：
 */
export type BoxOpts = {
  /**
   * 标题（会显示在相框顶部）
   * 就像在相框上写个标签
   */
  title?: string;

  /**
   * 相框样式设置
   */
  style?: Partial<BoxStyle>;
};

/**
 * 🎨 默认的相框样式
 * 就像最基本的相框款式
 */
const defaultStyle: BoxStyle = {
  borderColor: "white",      // 默认白色
  borderStyle: "rounded",    // 默认圆角
  valign: "center",         // 默认居中
  padding: 2,              // 默认内边距2格
  marginLeft: 1,           // 默认左边距1格
  marginTop: 1,            // 默认上边距1格
  marginBottom: 1,         // 默认下边距1格
};

/**
 * 🖼️ 画一个相框
 * 就像画一个漂亮的相框把文字装起来
 * 
 * 比如：
 * ╭────────╮
 * │ Hello! │
 * ╰────────╯
 * 
 * @param text 要装进相框的文字
 * @param _opts 相框的样式设置
 * @returns 画好的相框
 */
export function box(text: string, _opts: BoxOpts = {}) {
  // 准备相框的样式
  const opts = {
    ..._opts,
    style: {
      ...defaultStyle,
      ..._opts.style,
    },
  };

  // 把文字分成一行一行
  const textLines = text.split("\n");

  // 准备画相框
  const boxLines = [];

  // 准备画笔（设置颜色）
  const _color = getColor(opts.style.borderColor);

  // 选择相框样式
  const borderStyle = {
    ...(typeof opts.style.borderStyle === "string"
      ? boxStylePresets[opts.style.borderStyle as keyof typeof boxStylePresets] || boxStylePresets.solid
      : opts.style.borderStyle),
  };

  // 给相框上色
  if (_color) {
    for (const key in borderStyle) {
      borderStyle[key as keyof typeof borderStyle] = _color(
        borderStyle[key as keyof typeof borderStyle],
      );
    }
  }

  // 计算相框的大小
  const paddingOffset = opts.style.padding % 2 === 0 
    ? opts.style.padding 
    : opts.style.padding + 1;
  const height = textLines.length + paddingOffset;
  const width = Math.max(...textLines.map((line) => stripAnsi(line).length)) + paddingOffset;
  const widthOffset = width + paddingOffset;
  const leftSpace = opts.style.marginLeft > 0 
    ? " ".repeat(opts.style.marginLeft) 
    : "";

  // 画上边距
  if (opts.style.marginTop > 0) {
    boxLines.push("".repeat(opts.style.marginTop));
  }

  // 如果有标题，画标题栏
  if (opts.title) {
    const title = _color ? _color(opts.title) : opts.title;
    const left = borderStyle.h.repeat(
      Math.floor((width - stripAnsi(opts.title).length) / 2)
    );
    const right = borderStyle.h.repeat(
      width - stripAnsi(opts.title).length - stripAnsi(left).length + paddingOffset
    );
    boxLines.push(
      `${leftSpace}${borderStyle.tl}${left}${title}${right}${borderStyle.tr}`
    );
  } 
  // 没有标题就画普通的顶边
  else {
    boxLines.push(
      `${leftSpace}${borderStyle.tl}${borderStyle.h.repeat(widthOffset)}${borderStyle.tr}`
    );
  }

  // 计算文字的位置
  const valignOffset = opts.style.valign === "center"
    ? Math.floor((height - textLines.length) / 2)
    : opts.style.valign === "top"
      ? height - textLines.length - paddingOffset
      : height - textLines.length;

  // 画中间的内容
  for (let i = 0; i < height; i++) {
    // 空行（上下的空白）
    if (i < valignOffset || i >= valignOffset + textLines.length) {
      boxLines.push(
        `${leftSpace}${borderStyle.v}${" ".repeat(widthOffset)}${borderStyle.v}`
      );
    }
    // 文字行
    else {
      const line = textLines[i - valignOffset];
      const left = " ".repeat(paddingOffset);
      const right = " ".repeat(width - stripAnsi(line).length);
      boxLines.push(
        `${leftSpace}${borderStyle.v}${left}${line}${right}${borderStyle.v}`
      );
    }
  }

  // 画底边
  boxLines.push(
    `${leftSpace}${borderStyle.bl}${borderStyle.h.repeat(widthOffset)}${borderStyle.br}`
  );

  // 画下边距
  if (opts.style.marginBottom > 0) {
    boxLines.push("".repeat(opts.style.marginBottom));
  }

  // 把所有行连起来
  return boxLines.join("\n");
}
