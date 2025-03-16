/**
 * 🗺️ 错误地址整理工具
 * 
 * 想象这个文件是一个地址整理员：
 * - 有时候我们会收到很长很乱的地址（错误堆栈）
 * - 这些地址太长了，不好看
 * - 我们要把它们整理得简单一点
 */

import { sep } from "node:path";

/**
 * 📝 整理错误堆栈
 * 就像整理一堆混乱的地址：
 * 
 * 比如把这样的地址：
 * "file:///home/user/projects/my-app/src/index.ts"
 * 
 * 整理成这样：
 * "src/index.ts"
 * 
 * 整理步骤：
 * 1. 把地址分成一行一行的
 * 2. 去掉第一行（因为它是错误信息）
 * 3. 去掉每行开头和结尾的空格
 * 4. 去掉"file://"这个前缀
 * 5. 去掉当前文件夹的完整路径
 * 
 * @param stack 原始的错误堆栈（像一堆混乱的地址）
 * @returns 整理好的地址列表
 */
export function parseStack(stack: string) {
  // 获取当前工作目录（像获取我们所在的城市）
  const cwd = process.cwd() + sep;

  // 开始整理地址
  const lines = stack
    .split("\n")                    // 把地址分成一行一行的
    .splice(1)                      // 去掉第一行
    .map((l) => l
      .trim()                       // 去掉多余的空格
      .replace("file://", "")       // 去掉"file://"
      .replace(cwd, "")            // 去掉当前目录路径
    );

  return lines;
}
