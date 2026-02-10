# 🧮 数学公式渲染支持

## ✅ 已完成的功能

AI 侧边栏现在支持渲染 LaTeX 数学公式，使用 **KaTeX** 库。

## 📝 支持的公式格式

### 1. 行内公式
使用单个 `$` 包裹：

```
这是一个行内公式：$E = mc^2$，它描述了质能关系。
```

渲染效果：这是一个行内公式：$E = mc^2$，它描述了质能关系。

### 2. 块级公式（居中显示）
使用双 `$$` 包裹：

```
质能方程：

$$E = mc^2$$

这是爱因斯坦的著名公式。
```

### 3. LaTeX 标准语法
也支持 LaTeX 标准语法：

- 行内：`\(...\)`
- 块级：`\[...\]`

## 🎯 示例公式

### 基础公式
```
行内：$x^2 + y^2 = z^2$
块级：$$\int_0^\infty e^{-x^2} dx = \frac{\sqrt{\pi}}{2}$$
```

### 矩阵
```
$$
\begin{bmatrix}
a & b \\
c & d
\end{bmatrix}
$$
```

### 求和与积分
```
$$
\sum_{i=1}^{n} i = \frac{n(n+1)}{2}
$$

$$
\int_a^b f(x)dx = F(b) - F(a)
$$
```

### 分数与根号
```
$$
\frac{a}{b} + \sqrt{c} + \sqrt[3]{d}
$$
```

### 希腊字母
```
$\alpha, \beta, \gamma, \Delta, \Omega$
```

### 复杂公式
```
$$
f(x) = \int_{-\infty}^\infty \hat f(\xi)\,e^{2 \pi i \xi x} \,d\xi
$$
```

## 🔧 技术实现

### 库版本
- **KaTeX**: v0.16.9
- **Marked.js**: 本地版本

### 加载方式
使用 CDN 加载（`viewer.html`）：

```html
<!-- KaTeX CSS -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">

<!-- KaTeX JavaScript -->
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"></script>

<!-- KaTeX Auto-render -->
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js"></script>
```

### 渲染配置
```javascript
renderMathInElement(element, {
    delimiters: [
        {left: '$$', right: '$$', display: true},   // 块级
        {left: '$', right: '$', display: false},    // 行内
        {left: '\\[', right: '\\]', display: true}, // LaTeX 块级
        {left: '\\(', right: '\\)', display: false} // LaTeX 行内
    ],
    throwOnError: false,
    errorColor: '#cc0000'
});
```

## 🎨 样式特性

### 响应式设计
- 块级公式居中显示
- 长公式支持横向滚动
- 自定义滚动条样式

### 夜间模式支持
- 自动适配夜间模式颜色
- 公式文字颜色：`#eee`
- 滚动条深色主题

### CSS 样式
```css
/* 行内公式 */
.assistant-msg .katex {
    font-size: 1.05em;
}

/* 块级公式 */
.assistant-msg .katex-display {
    margin: 16px 0;
    overflow-x: auto;
}
```

## 🚀 使用方法

### 1. 重新加载扩展
在 `chrome://extensions/` 刷新扩展

### 2. 测试公式渲染
在 AI 侧边栏中输入：

```
请用数学公式解释勾股定理
```

AI 应该返回包含 LaTeX 公式的内容，例如：

```
勾股定理表示为：

$$a^2 + b^2 = c^2$$

其中 $a$ 和 $b$ 是直角三角形的两条直角边，$c$ 是斜边。
```

### 3. 查看控制台
应该看到以下日志：

```
✨ Markdown 渲染完成
🧮 数学公式渲染完成
```

## ⚠️ 注意事项

### 1. 转义字符
在 Markdown 中，某些字符需要转义：

```
错误：$f(x) = x_1 + x_2$  // 下划线会被 Markdown 解析为斜体
正确：$f(x) = x\_1 + x\_2$  // 需要转义下划线
```

### 2. 复杂公式
对于非常复杂的公式，建议使用块级显示：

```
$$
\begin{aligned}
f(x) &= (x+1)^2 \\
     &= x^2 + 2x + 1
\end{aligned}
$$
```

### 3. 错误处理
如果公式语法错误，会以红色显示错误提示，不会中断渲染流程。

## 🔍 调试

### 检查 KaTeX 是否加载
在控制台运行：

```javascript
console.log('KaTeX loaded:', !!window.katex);
console.log('renderMathInElement loaded:', !!window.renderMathInElement);
```

应该返回 `true`。

### 常见问题

#### Q: 公式不显示
**A:** 检查控制台是否有 KaTeX 加载错误，确保 CDN 可访问。

#### Q: 部分公式不正确
**A:** 检查 LaTeX 语法是否正确，参考 [KaTeX 支持的函数](https://katex.org/docs/supported.html)。

#### Q: 行内公式和斜体冲突
**A:** 使用 `\(...\)` 代替 `$...$`，或转义下划线。

## 📚 更多资源

- [KaTeX 文档](https://katex.org/docs/)
- [KaTeX 支持的函数](https://katex.org/docs/supported.html)
- [LaTeX 数学符号](https://www.cmor-faculty.rice.edu/~heinken/latex/symbols.pdf)

## 🎯 示例对话

**用户**: "请解释欧拉公式"

**AI 回复**:
```
欧拉公式是数学中最美丽的公式之一：

$$e^{i\pi} + 1 = 0$$

它将五个最重要的数学常数联系在一起：
- $e$ (自然对数的底)
- $i$ (虚数单位)
- $\pi$ (圆周率)
- $1$ (乘法单位)
- $0$ (加法单位)

更一般的形式为：

$$e^{ix} = \cos(x) + i\sin(x)$$

这个公式展示了指数函数与三角函数之间的深刻联系。
```

---

**现在，AI 助手可以完美渲染数学公式了！** 🎉

