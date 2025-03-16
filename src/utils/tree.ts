/**
 * 🌳 家谱树工具
 * 
 * 想象这个文件是一个画家谱树的工具：
 * - 可以画出一个家族的层级关系
 * - 每个成员可以有自己的颜色
 * - 可以显示谁是谁的孩子
 * - 就像画一棵真正的家谱树！
 */

import { type ColorName, colorize } from "./color";

/**
 * 👤 树节点对象
 * 就像家谱树上的每个人：
 */
export type TreeItemObject = {
  /**
   * 文字内容（就像人的名字）
   */
  text: string;

  /**
   * 子节点列表（就像这个人的孩子们）
   */
  children?: TreeItem[];

  /**
   * 节点的颜色（就像给每个人一个特别的颜色）
   */
  color?: ColorName;
};

/**
 * 👥 树节点
 * 可以是简单的文字，也可以是一个完整的节点对象
 */
export type TreeItem = string | TreeItemObject;

/**
 * ⚙️ 树的配置选项
 * 就像画家谱树时的各种设置：
 */
export type TreeOptions = {
  /**
   * 整棵树的颜色（就像用什么颜色的笔画）
   */
  color?: ColorName;

  /**
   * 每一级的缩进（就像每代人的位置）
   * 默认是两个空格"  "
   */
  prefix?: string;

  /**
   * 最大显示层数（就像最多显示几代人）
   */
  maxDepth?: number;

  /**
   * 超出层数时显示的文字（就像说"等等"）
   * 默认是"..."
   */
  ellipsis?: string;
};

/**
 * 🌳 把列表变成树形结构
 * 就像画一棵家谱树：
 * 
 * 比如这样的数据：
 * [
 *   "爷爷",
 *   { text: "爸爸", children: ["我", "妹妹"] }
 * ]
 * 
 * 会变成这样：
 * └─爷爷
 * └─爸爸
 *   ├─我
 *   └─妹妹
 * 
 * @param items 要画成树的列表（像一个家族的成员列表）
 * @param options 画树的设置（像画画时的各种规则）
 * @returns 画好的树（像画在纸上的家谱树）
 */
export function formatTree(items: TreeItem[], options?: TreeOptions): string {
  // 设置默认值
  options = {
    prefix: "  ",        // 默认缩进两个空格
    ellipsis: "...",     // 超出时显示...
    ...options,
  };

  // 构建树形结构
  const tree = _buildTree(items, options).join("");

  // 如果指定了颜色，就给整棵树上色
  if (options && options.color) {
    return colorize(options.color, tree);
  }
  return tree;
}

/**
 * 🎨 递归构建树
 * 就像一笔一笔地画家谱树
 * 
 * @param items 当前要画的这些人
 * @param options 画画的规则
 * @returns 画好的树枝们
 */
function _buildTree(items: TreeItem[], options?: TreeOptions): string[] {
  const chunks: string[] = [];           // 存放画好的树枝
  const total = items.length - 1;        // 计算一共有几个人

  // 一个一个地画
  for (let i = 0; i <= total; i++) {
    const item = items[i];
    const isItemString = typeof item === "string";    // 是不是简单的名字
    const isLimit = options?.maxDepth != null && options.maxDepth <= 0;  // 是不是画太多层了

    // 如果画太多层了，就画个省略号
    if (isLimit) {
      const ellipsis = `${options.prefix}${options.ellipsis}\n`;
      return [
        isItemString
          ? ellipsis
          : (item.color ? colorize(item.color, ellipsis) : ellipsis)
      ];
    }

    // 判断是不是最后一个人
    const isLast = i === total;
    // 选择树枝的样子：最后一个用"└─"，其他用"├─"
    const prefix = isLast ? `${options?.prefix}└─` : `${options?.prefix}├─`;

    // 如果只是一个名字，直接画出来
    if (isItemString) {
      chunks.push(`${prefix}${item}\n`);
    }
    // 如果是一个完整的人（有名字、颜色、孩子等）
    else {
      // 先画这个人
      const log = `${prefix}${item.text}\n`;
      chunks.push(item.color ? colorize(item.color, log) : log);

      // 如果这个人有孩子，继续画他的孩子们
      if (item.children) {
        const _tree = _buildTree(item.children, {
          ...options,
          // 层数减一（就像下一代）
          maxDepth: options?.maxDepth == null ? undefined : options.maxDepth - 1,
          // 孩子们要多缩进一些，用"│  "或"  "连接
          prefix: `${options?.prefix}${isLast ? "  " : "│  "}`,
        });
        chunks.push(..._tree);
      }
    }
  }
  return chunks;
}
