# AI 按钮图标修复说明

## 问题描述

AI 按钮星星图标左边出现大黑框。

## 问题根本原因 ⚠️

**关键发现**：`.toolbarButton::before` 伪元素！

PDF.js 的所有工具栏按钮都使用 `::before` 伪元素来显示图标：

```css
.toolbarButton::before {
    opacity: var(--toolbar-icon-opacity);
    display: inline-block;
    width: var(--icon-size);   /* 默认 16px */
    height: var(--icon-size);
    content: "";               /* 空内容显示为黑框！ */
    /* ... mask-image 用于显示图标 */
}
```

当我们使用自定义 SVG 时，这个默认的 `::before` 伪元素依然存在，显示为一个**黑色方框**！

## 解决方案

### 核心修复：隐藏 ::before 伪元素

```css
/* 隐藏默认的 before 伪元素（这是黑框的原因） */
#viewAI::before {
    display: none !important;
    content: none !important;
}
```

### 完整样式

```css
/* Toggle Button (In Toolbar) */
#viewAI {
    position: relative;
    min-width: 32px !important;
    min-height: 32px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
}

/* 隐藏默认的 before 伪元素 */
#viewAI::before {
    display: none !important;
    content: none !important;
}

/* AI 图标样式优化 */
#viewAI svg {
    width: 18px !important;
    height: 18px !important;
    display: block !important;
    fill: currentColor !important;
}

/* 夜间模式支持 */
body.custom-night-mode #viewAI svg {
    fill: #e0e0e0 !important;
}

/* AI 标签 */
#viewAI::after {
    content: "AI";
    position: absolute;
    top: 1px;
    right: 1px;
    font-size: 7px;
    font-weight: bold;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 2px 3px;
    border-radius: 3px;
    line-height: 1;
    pointer-events: none;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}
```

## 修复效果

### 之前
```
┌──────────────┐
│ ▓▓▓   💡   AI│  ← 左边有黑框，图标显示异常
└──────────────┘
```

### 现在
```
┌──────────────┐
│      ⭐   AI │  ← 图标居中，显示正常
└──────────────┘
```

## 图标特点

### 星星图标
- ✨ 简洁清晰，一笔成形
- ✨ 与 AI/智能助手主题相符
- ✨ viewBox 正确，无黑框问题
- ✨ 支持 currentColor，自动适配主题

### 视觉效果
- 🎨 浅色模式：深色星星 + 紫色渐变标签
- 🎨 夜间模式：浅色星星 (#e0e0e0) + 紫色渐变标签
- 🎨 居中对齐，视觉平衡
- 🎨 18x18px 大小，适中美观

## 技术细节

### Flexbox 居中
使用 flexbox 确保图标完美居中：
```css
display: flex;
align-items: center;      /* 垂直居中 */
justify-content: center;  /* 水平居中 */
```

### fill 属性
- 使用 `fill="currentColor"` 在 SVG 内部
- 通过 CSS 的 `fill: currentColor !important` 确保继承
- 夜间模式下覆盖为浅色

### 盒模型
- 按钮：32x32px（固定）
- 图标：18x18px（居中）
- 标签：右上角绝对定位，不影响布局

## 文件修改

- ✅ `/pdfjs/web/ai-sidebar.js` - 更换为星星图标
- ✅ `/pdfjs/web/ai-sidebar.css` - 优化按钮和图标样式

## 测试建议

1. ✅ 浅色模式下查看按钮
2. ✅ 夜间模式下查看按钮
3. ✅ 鼠标悬停效果
4. ✅ 点击后的视觉反馈
5. ✅ 不同屏幕分辨率下的显示

## 替代图标选项

如果需要更换其他图标，可以使用：

### 选项 1：闪电图标（速度/智能）
```javascript
const ICON = `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M7 2v11h3v9l7-12h-4l4-8z"/></svg>`;
```

### 选项 2：脑部图标（AI/智能）
```javascript
const ICON = `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M13 3C9.2 3 6 6.2 6 10c0 2.4 1.2 4.5 3 5.7V21h6v-5.3c1.8-1.2 3-3.3 3-5.7 0-3.8-3.2-7-7-7z"/></svg>`;
```

### 选项 3：火花图标（创意/灵感）
```javascript
const ICON = `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5L12 2z"/></svg>`;
```

## 推荐

当前的星星图标是最佳选择，因为：
- ✅ 简洁清晰
- ✅ 主题相关（智能助手）
- ✅ 无显示问题
- ✅ 易于识别

