# AI 侧边栏优化总结

## 修复的问题

### 1. ✅ AI 按钮图标显示异常

**问题**：
- AI 标签位置不对
- 图标大小不一致
- 整体显示不够美观

**修复**：
```css
#viewAI {
    position: relative;
    min-width: 32px !important;
    min-height: 32px !important;
}

#viewAI svg {
    width: 20px !important;
    height: 20px !important;
    display: block !important;
}

#viewAI::after {
    content: "AI";
    position: absolute;
    top: 0px;
    right: 0px;
    font-size: 7px;
    font-weight: bold;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 2px 3px;
    border-radius: 3px;
    line-height: 1;
    pointer-events: none;
}
```

**改进点**：
- ✨ 使用渐变色背景，更有科技感
- ✨ 调整 AI 标签位置到右上角
- ✨ 固定图标大小为 20x20px
- ✨ 添加 `pointer-events: none` 防止点击冲突

### 2. ✅ 同时打开两个侧边栏时动画消失

**问题**：
- 打开 outline menu（左侧）后再打开 AI sidebar（右侧），动画消失
- 关闭时也没有动画
- `viewerContainer` 的 `transition-property` 被覆盖

**修复**：
```css
/* AI Sidebar 打开时 */
#outerContainer.aiSidebarOpen #viewerContainer:not(.pdfPresentationMode) {
    right: var(--sidebar-width);
    transition-property: right, left;  /* 同时支持左右过渡 */
    transition-duration: 200ms;
}

/* viewsManager 打开时 */
#outerContainer.viewsManagerOpen #viewerContainer:not(.pdfPresentationMode) {
    transition-property: left, right;  /* 同时支持左右过渡 */
    transition-duration: 200ms;
}

/* 同时打开两个侧边栏 */
#outerContainer.viewsManagerOpen.aiSidebarOpen #viewerContainer:not(.pdfPresentationMode) {
    left: var(--viewsManager-width, 230px);
    right: var(--sidebar-width);
    transition-property: left, right;  /* 两个方向都有动画 */
}
```

**改进点**：
- ✨ `transition-property` 同时包含 `left` 和 `right`
- ✨ 无论打开/关闭哪个侧边栏都有平滑动画
- ✨ 同时打开两个侧边栏时，PDF 内容区域被两边夹住，依然有动画

### 3. ✅ Outline Menu 打开时没有动画

**问题**：
- 原本的 PDF.js outline menu 打开时是有动画的
- 被我们的 CSS 覆盖导致动画消失

**修复**：
```css
/* 确保 viewsManager 打开时也有动画 */
#outerContainer.viewsManagerOpen #viewerContainer:not(.pdfPresentationMode) {
    transition-property: left, right;
    transition-duration: var(--sidebar-transition-duration, 200ms);
    transition-timing-function: var(--sidebar-transition-timing-function, ease);
}

/* 调整大小时禁用过渡（性能优化） */
#outerContainer.viewsManagerResizing #viewerContainer {
    transition-duration: 0s !important;
}
```

**改进点**：
- ✨ 明确添加过渡属性，确保不会被覆盖
- ✨ 使用原有的 CSS 变量保持一致性
- ✨ 拖动调整大小时禁用动画（避免卡顿）

## 动画效果对比

### 之前
- ❌ AI 按钮图标显示异常
- ❌ 同时打开两个侧边栏后，关闭时没有动画
- ❌ Outline menu 打开时直接弹出，无动画

### 现在
- ✅ AI 按钮图标美观，渐变背景
- ✅ 任何情况下打开/关闭侧边栏都有平滑动画
- ✅ Outline menu 打开/关闭有 200ms 平滑动画
- ✅ 两个侧边栏可以同时打开，互不影响

## 技术细节

### 关键 CSS 属性

1. **transition-property**
   - 使用 `left, right` 而不是单独的 `left` 或 `right`
   - 确保两个方向的变化都有动画

2. **transition-duration**
   - 统一使用 `var(--sidebar-transition-duration, 200ms)`
   - 调整大小时设为 `0s` 提升性能

3. **选择器优先级**
   - 使用组合选择器确保正确的优先级
   - 必要时使用 `!important` 覆盖

### 测试场景

✅ **场景 1**：只打开 AI Sidebar
- 侧边栏从右侧滑入 ✓
- PDF 内容向左移动 ✓
- 关闭时动画流畅 ✓

✅ **场景 2**：只打开 Outline Menu
- 侧边栏从左侧滑入 ✓
- PDF 内容向右移动 ✓
- 关闭时动画流畅 ✓

✅ **场景 3**：同时打开两个侧边栏
- 左侧 outline menu + 右侧 AI sidebar ✓
- PDF 内容被两边夹住 ✓
- 依次关闭都有动画 ✓

✅ **场景 4**：拖动调整宽度
- AI sidebar 拖动流畅 ✓
- Outline menu 拖动流畅 ✓
- 拖动时无动画延迟 ✓

## 文件修改

- ✅ `/pdfjs/web/ai-sidebar.css` - 修复图标样式和动画冲突

## 视觉效果

### AI 按钮
- 🎨 渐变紫色背景 (#667eea → #764ba2)
- 🎨 白色 "AI" 文字标签
- 🎨 位于按钮右上角
- 🎨 圆角 3px

### 动画效果
- ⏱️ 200ms 平滑过渡
- ⏱️ ease 缓动函数
- ⏱️ 支持左右两个方向同时动画

