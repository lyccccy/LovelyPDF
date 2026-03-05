# Lovely PDF

**[English](#english) | [中文](#中文)**

---

<a name="english"></a>

I spent three days building a Chrome extension for reading papers in the browser — with a PDF viewer that lets you summarize and chat with your paper using AI.

It actually started for a much simpler reason: the blinding white background of academic PDFs. After long reading sessions my eyes would be wrecked, and I couldn't find any tool that fixed this properly. So I forked an open-source PDF reader and added a theme system — adjustable brightness, contrast, color inversion, hue, the works. Then I threw in a custom background image feature too, because why not.

Once that was done, I thought: I already know how to call AI APIs, might as well add paper summarization and Q&A while I'm at it. With AI's help, the whole thing came together way faster than expected. The result is a sidebar chat — like Cursor's, but for PDFs — where you can ask questions about your paper, get streaming responses with a typewriter effect, and even read math formulas rendered correctly.

Next up, I want to let you select text directly in the paper and throw it into the chat with one click, like Cursor's Add to Chat. And I want the whole UI to feel more polished — more Apple, less developer tool. That's kind of why I named the repo *lovely-pdf*.

---

## Getting Started

**1. Configure your API Key**

```bash
cp pdfjs/web/config.example.js pdfjs/web/config.js
```

Edit `pdfjs/web/config.js`:

```js
export const config = {
    API_KEY: "your-api-key-here",   // Get one at https://openrouter.ai/keys
    API_URL: "https://openrouter.ai/api/v1",
    MODEL: "anthropic/claude-3.5-sonnet",
    MAX_TOKENS: 4000,
    TEMPERATURE: 0.7,
    PDF_MAX_PAGES: 20,
    PDF_MAX_CHARS: 200000
};
```

**2. Load the extension**

1. Go to `chrome://extensions` in Chrome
2. Enable **Developer mode** (top-right toggle)
3. Click **Load unpacked** and select this project's root folder

**3. Open any PDF**

Any PDF link you open in Chrome will automatically be redirected to this viewer. Local files are supported too.

---

> ⚠️ `pdfjs/web/config.js` contains your API Key. It's in `.gitignore` and won't be committed — just don't upload it manually to a public repo.

---

---

<a name="中文"></a>

我用了三天时间，做了一个 Chrome 插件，用于在浏览器上阅读论文时，用 PDF 阅览器快速进行 AI 总结和问答。

做这个插件最开始的原因其实很简单：论文的背景是纯白的，长时间盯着看眼睛会很难受。找不到合适的工具，干脆自己改。我基于开源的 PDF.js，加了一套主题系统，可以调整亮度、对比度、反色、色相等等。顺手还加了自定义背景图片的功能。

做完这些，我想着反正我之前有调用 AI API 的经验，不如再加上论文总结和问答功能。有 AI 的帮助，这部分做起来比预想的快很多。最终做出了一个侧边栏对话界面——像 Cursor 那样——可以针对当前论文提问，支持流式输出和打字机效果，数学公式也能正确渲染。

后续我打算让用户能够在论文里直接划选文字，一键丢进对话框，就像 Cursor 的 Add to Chat 一样。另外也想把整体界面做得更好看一些，往苹果那种风格靠——这也是我把这个仓库命名为 *lovely-pdf* 的原因。

---

## 快速开始

**1. 配置 API Key**

```bash
cp pdfjs/web/config.example.js pdfjs/web/config.js
```

编辑 `pdfjs/web/config.js`：

```js
export const config = {
    API_KEY: "your-api-key-here",   // 从 https://openrouter.ai/keys 获取
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

**3. 打开任意 PDF**

在浏览器中打开任意 PDF 链接，扩展会自动接管。本地文件同样支持。

---

> ⚠️ `pdfjs/web/config.js` 包含你的 API Key，已在 `.gitignore` 中，不会被提交。请勿手动上传到公开仓库。
