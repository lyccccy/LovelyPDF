# Lovely PDF

A Chrome extension that makes reading papers actually comfortable.

**[English](#english) | [中文](#中文)**

---

<a name="english"></a>

## Why I Built This

Staring at the pure white background of academic papers for hours destroys your eyes.

I wanted a PDF reader that could dim the background and switch to an eye-friendly theme — couldn't find one that fit, so I built it myself. Based on the open-source Mozilla PDF.js, it went from idea to usable in three days.

Once the eye-care features were done, I figured I'd throw in my prior experience with AI APIs and add paper summarization and Q&A. With AI's help, the whole thing came together surprisingly fast.

---

## Features

### Eye-Care Themes

- **High Contrast**: Color inversion + hue rotation, great for late-night reading
- **Dim Mode**: Reduced brightness and contrast to ease eye strain
- **Custom Mode**: Individually adjust inversion, brightness, contrast, and hue — what you see is what you get

### Custom Background Image

- Supports network URLs, local file paths, and Base64
- Separate opacity settings for light and dark modes
- Ships with a default background; swap it for anything you like

### AI Paper Assistant

- Sidebar chat, similar to Cursor's interaction model
- Automatically extracts the full PDF text as context
- Supports paper summarization and content Q&A
- Streaming output with typewriter animation
- Correctly renders Markdown and LaTeX math formulas

### Automatic PDF Interception

- Any PDF link opened in the browser is automatically redirected to the custom reader
- No manual steps needed; local files are supported too

---

## Getting Started

**1. Configure your API Key**

```bash
cp pdfjs/web/config.example.js pdfjs/web/config.js
```

Edit `pdfjs/web/config.js` and fill in your API Key:

```js
export const config = {
    API_KEY: "your-api-key-here",       // Get one at https://openrouter.ai/keys
    API_URL: "https://openrouter.ai/api/v1",
    MODEL: "anthropic/claude-3.5-sonnet",
    MAX_TOKENS: 4000,
    TEMPERATURE: 0.7,
    PDF_MAX_PAGES: 20,
    PDF_MAX_CHARS: 200000
};
```

**2. Load the extension**

1. Open Chrome and go to `chrome://extensions`
2. Enable **Developer mode** in the top-right corner
3. Click **Load unpacked** and select the project root directory

**3. Start reading**

Open any PDF link in your browser — the extension will automatically take over and open it in the custom reader.

---

## Tech Stack

| Module | Technology |
|--------|-----------|
| Extension Framework | Chrome Extension Manifest V3 |
| PDF Rendering | Mozilla PDF.js |
| AI Chat | OpenAI-compatible API (OpenRouter) |
| Markdown Rendering | marked.js |
| Math Formulas | KaTeX |

---

## Roadmap

- [ ] Select text in a paper and add it to the chat with one click (like Cursor's Add to Chat)
- [ ] Full UI redesign toward Apple's design language — the repo is called lovely-pdf after all
- [ ] Better AI context handling for longer papers

---

## Note

`pdfjs/web/config.js` contains your API Key and is listed in `.gitignore`. It will not be committed. Please do not upload it to any public repository manually.

---

---

<a name="中文"></a>

# Lovely PDF （中文）

一个让论文阅读变得舒适的 Chrome 扩展。

## 起因

长时间盯着论文的纯白背景，眼睛会很难受。

我想要一个能调暗背景、换个护眼主题的 PDF 阅读器——但找不到合适的，于是干脆自己做了一个。基于开源的 Mozilla PDF.js，三天内从想法到可用。

做完护眼功能后，顺手把之前调用 AI API 的经验也用上了，加入了论文总结和问答功能。有 AI 的帮助，这一切都来得很快。

---

## 功能

### 护眼主题

- **高对比度模式**：反色 + 色相旋转，适合深夜阅读
- **护眼模式**：降低亮度与对比度，减少视觉疲劳
- **自定义模式**：独立调节反色、亮度、对比度、色相，所见即所得

### 自定义背景图片

- 支持网络 URL、本地路径、Base64 三种方式
- 日间与夜间模式下分别维护透明度配置
- 默认内置一张背景图，也可以换成你喜欢的

### AI 论文助手

- 侧边栏对话，类似 Cursor 的交互方式
- 自动提取当前 PDF 全文作为上下文
- 支持论文总结、内容问答
- 流式输出 + 打字机动效
- 正确渲染 Markdown 和 LaTeX 数学公式

### PDF 自动拦截

- 浏览器中打开任意 PDF 链接，自动跳转到自定义阅读器
- 无需手动操作，本地文件同样支持

---

## 快速开始

**1. 配置 API Key**

```bash
cp pdfjs/web/config.example.js pdfjs/web/config.js
```

编辑 `pdfjs/web/config.js`，填入你的 API Key：

```js
export const config = {
    API_KEY: "your-api-key-here",       // 从 https://openrouter.ai/keys 获取
    API_URL: "https://openrouter.ai/api/v1",
    MODEL: "anthropic/claude-3.5-sonnet",
    MAX_TOKENS: 4000,
    TEMPERATURE: 0.7,
    PDF_MAX_PAGES: 20,
    PDF_MAX_CHARS: 200000
};
```

**2. 加载扩展**

1. 打开 Chrome，进入 `chrome://extensions`
2. 开启右上角「开发者模式」
3. 点击「加载已解压的扩展程序」，选择本项目根目录

**3. 开始使用**

在浏览器中打开任意 PDF 链接，扩展会自动接管并用自定义阅读器打开。

---

## 技术栈

| 模块 | 技术 |
|------|------|
| 扩展框架 | Chrome Extension Manifest V3 |
| PDF 渲染 | Mozilla PDF.js |
| AI 对话 | OpenAI 兼容 API（OpenRouter） |
| Markdown 渲染 | marked.js |
| 数学公式 | KaTeX |

---

## 后续计划

- [ ] 划选论文中的文字后，一键追加到对话（类似 Cursor 的 Add to Chat）
- [ ] UI 整体重设计，向 Apple 设计语言靠拢——毕竟这个仓库叫 lovely-pdf
- [ ] 进一步优化 AI 上下文处理，支持更长的论文

---

## 注意

`pdfjs/web/config.js` 包含你的 API Key，已被加入 `.gitignore`，不会被提交。请勿手动将其上传到公开仓库。
