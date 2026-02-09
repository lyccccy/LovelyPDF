# 🌙 夜间模式子菜单文字修复说明

## 问题描述

在夜间模式下，高亮、文本等功能打开子菜单后，UI 文字仍为黑色，无法正常显示。

## ✅ 已修复的内容

### 1. 编辑器工具栏
- ✅ 高亮工具参数面板
- ✅ 文本工具参数面板
- ✅ 墨水工具参数面板
- ✅ 印章工具参数面板
- ✅ 所有编辑器参数标签

### 2. 弹出菜单
- ✅ 二级工具栏
- ✅ 下拉菜单（doorHanger）
- ✅ 弹出菜单（popupMenu）
- ✅ 所有菜单项文字

### 3. 输入控件
- ✅ 文本输入框
- ✅ 数字输入框
- ✅ 文本区域（textarea）
- ✅ 选择器（select）
- ✅ 滑块控件
- ✅ 颜色选择器

### 4. 其他元素
- ✅ 标签（label）
- ✅ 侧边栏内容
- ✅ 对话框
- ✅ 查找栏
- ✅ 注释侧边栏

---

## 🎨 夜间模式配色方案

### 背景色
- **主容器**: `#1a1a1a`
- **工具栏/菜单**: `#2a2a2a`
- **输入框**: `#3a3a3a`

### 文字色
- **主要文字**: `#e0e0e0` (浅灰白色)
- **次要文字**: `#a0a0a0` (中灰色)
- **占位符**: `#888888` (深灰色)
- **禁用状态**: `#666666`

### 边框色
- **主要边框**: `#3a3a3a`
- **次要边框**: `#4a4a4a`

### 强调色
- **选中/高亮**: `#667eea` (紫蓝色)
- **悬停效果**: `rgba(255, 255, 255, 0.1)`

---

## 🚀 测试步骤

### 1. 重新加载扩展
```
chrome://extensions/ → 刷新扩展
```

### 2. 打开 PDF 并启用夜间模式
1. 打开任意 PDF 文件
2. 点击右上角月亮图标启用夜间模式
3. 确认整体界面变为深色

### 3. 测试高亮工具
1. 点击高亮工具按钮（工具栏上的荧光笔图标）
2. 打开高亮参数面板
3. **检查**: 所有文字应该为浅色（#e0e0e0）
4. **检查**: 颜色选择器、滑块等控件可见

### 4. 测试文本工具
1. 点击文本工具按钮（T 图标）
2. 打开文本参数面板
3. **检查**: 字体、大小等标签文字清晰可见
4. **检查**: 输入框背景为深色，文字为浅色

### 5. 测试二级工具栏
1. 点击右上角"工具"按钮（⚙️ 或三个点）
2. 打开二级工具栏
3. **检查**: 所有菜单项文字清晰可见
4. **检查**: 悬停时有视觉反馈

### 6. 测试查找功能
1. 按 Ctrl+F（Mac: Cmd+F）打开查找栏
2. **检查**: 查找栏背景深色
3. **检查**: 输入框文字清晰可见
4. **检查**: 按钮和标签正常显示

---

## 📋 覆盖的 CSS 类

### 编辑器相关
```css
.editorParamsToolbar
.editorParamsToolbarContainer
.editorParamsLabel
.editorParamsColor
.editorParamsSlider
#editorHighlightParamsToolbar
#editorFreeTextParamsToolbar
#editorInkParamsToolbar
#editorStampParamsToolbar
```

### 菜单相关
```css
.doorHanger
.doorHangerRight
.menuContainer
.popupMenu
.menuItem
[role="menuitem"]
[role="option"]
#secondaryToolbar
.secondaryToolbarButton
```

### 输入相关
```css
input
textarea
select
button
label
.toolbarField
```

### 其他
```css
.dialog
#findbar
#findInput
.commentCount
#editorCommentsSidebar
```

---

## 🎯 关键 CSS 规则

### 文字颜色强制覆盖
```css
body.custom-night-mode label,
body.custom-night-mode .label,
body.custom-night-mode span:not(.night-mode-icon):not(svg *) {
  color: #e0e0e0 !important;
}
```

### 菜单项颜色
```css
body.custom-night-mode .menuItem,
body.custom-night-mode [role="menuitem"],
body.custom-night-mode [role="option"] {
  color: #e0e0e0 !important;
}
```

### 输入框样式
```css
body.custom-night-mode input,
body.custom-night-mode select,
body.custom-night-mode button {
  background-color: #3a3a3a !important;
  color: #e0e0e0 !important;
  border-color: #4a4a4a !important;
}
```

---

## 🔍 故障排查

### 如果某些文字仍然不可见

1. **打开开发者工具**
   - 按 F12
   - 切换到 Elements 标签

2. **定位问题元素**
   - 使用选择器工具（Ctrl+Shift+C）
   - 点击不可见的文字

3. **检查样式**
   - 查看 Computed 面板
   - 查找 `color` 属性
   - 看是否被其他样式覆盖

4. **检查类名**
   - 记下元素的 class 或 id
   - 在 custom-buttons.css 中添加相应规则：

```css
body.custom-night-mode .你的类名 {
  color: #e0e0e0 !important;
}
```

### 常见问题

**Q: 某个按钮文字看不见**  
A: 确保按钮没有内联样式覆盖，使用 `!important` 强制应用

**Q: 下拉菜单背景是浅色**  
A: 检查是否有其他 CSS 文件冲突，custom-buttons.css 应该最后加载

**Q: 输入框占位符看不见**  
A: 已添加 `::placeholder` 样式，颜色为 #888

---

## ✅ 验证清单

测试完成后，确认以下内容：

- [ ] 高亮工具面板文字清晰
- [ ] 文本工具面板文字清晰
- [ ] 二级工具栏菜单项清晰
- [ ] 所有输入框文字可见
- [ ] 标签和说明文字可见
- [ ] 滑块和颜色选择器可用
- [ ] 查找栏功能正常
- [ ] 侧边栏内容清晰
- [ ] 悬停效果正常显示
- [ ] 选中状态有视觉反馈

---

## 🎨 效果预览

### 日间模式 vs 夜间模式

| 元素 | 日间模式 | 夜间模式 |
|------|---------|---------|
| 背景 | 白色 | #2a2a2a |
| 文字 | 黑色 | #e0e0e0 |
| 输入框背景 | 白色 | #3a3a3a |
| 输入框文字 | 黑色 | #e0e0e0 |
| 边框 | 浅灰 | #4a4a4a |
| 悬停 | rgba(0,0,0,0.1) | rgba(255,255,255,0.1) |

---

**现在所有子菜单和工具面板在夜间模式下都应该清晰可见了！** 🌙✨

