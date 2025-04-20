// 小朋友们，这个文件像是一个大大的工具箱的目录！ 📜
// 它并没有自己制作工具，而是告诉我们去哪里可以找到其他有用的工具。
// 比如，它会说：“画框框的工具？去 `./utils/box` 找！”
// “处理颜色的工具？去 `./utils/color` 找！”
// “让文字对齐的工具？去 `./utils/string` 找！”
// 这样，我们想用这些工具的时候，只需要从这个 `utils.ts` 目录里拿就行了，很方便！👍

export * from "./utils/box"; // 把 `./utils/box` 里的所有工具都放到这个大目录里
export * from "./utils/color"; // 把 `./utils/color` 里的所有工具也放进来
export {
  stripAnsi, // 把文字里的颜色代码去掉的工具
  centerAlign, // 让文字居中对齐的工具
  rightAlign, // 让文字靠右对齐的工具
  leftAlign, // 让文字靠左对齐的工具
  align, // 一个更通用的文字对齐工具
} from "./utils/string"; // 这些特定的文字处理工具来自 `./utils/string`
