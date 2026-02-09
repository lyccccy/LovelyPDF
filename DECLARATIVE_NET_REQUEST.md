# declarativeNetRequest 方案探索

## 尝试 1: 使用 regexSubstitution

```json
{
  "id": 1,
  "priority": 1,
  "action": {
    "type": "redirect",
    "redirect": {
      "regexSubstitution": "chrome-extension://xxx/viewer.html?file=\\0"
    }
  },
  "condition": {
    "regexFilter": "^(https?://.*\\.pdf).*$",
    "resourceTypes": ["main_frame"]
  }
}
```

**问题：** `\\0` 会被替换为整个匹配的 URL，但：
1. 不会自动进行 URL 编码
2. 扩展 ID 需要硬编码（无法动态获取）
3. 对于复杂的 URL（带参数）处理困难

## 尝试 2: 使用 transform

```json
{
  "action": {
    "type": "redirect",
    "redirect": {
      "transform": {
        "scheme": "chrome-extension",
        "host": "extension-id",
        "path": "/viewer.html"
      }
    }
  }
}
```

**问题：** `transform` 只能修改 URL 的各个部分，无法：
- 添加自定义查询参数
- 将原始 URL 作为参数传递

## 尝试 3: 静态规则 + 动态参数

理论上可以这样：
1. declarativeNetRequest 阻止 PDF 请求
2. 在 onBeforeRequest 中获取 URL
3. 手动重定向

**但这就回到了 webNavigation 方案，不如直接用它。**

## 结论

`declarativeNetRequest` 的设计目标是：
- 高性能（规则在浏览器层面执行）
- 隐私友好（不给扩展完整的请求数据）

但这些优点恰恰限制了它的灵活性。对于需要：
- ✅ 动态参数传递
- ✅ URL 编码处理
- ✅ 复杂逻辑判断

的场景，`webNavigation` + JavaScript 是更好的选择。

## 我们采用的方案优势

```javascript
// webNavigation - 完全灵活
chrome.webNavigation.onBeforeNavigate.addListener((details) => {
  if (isPdfUrl(details.url)) {
    const viewerUrl = chrome.runtime.getURL(
      `viewer-wrapper.html?file=${encodeURIComponent(details.url)}`  // ✅ 动态编码
    );
    chrome.tabs.update(details.tabId, { url: viewerUrl });
  }
});
```

这样我们可以：
- ✅ 动态获取扩展 ID
- ✅ 正确编码 URL
- ✅ 添加任意逻辑
- ✅ 处理本地和远程文件

## 性能对比

- `declarativeNetRequest` - 更快（浏览器层面）
- `webNavigation` - 稍慢（需要 JS 执行），但对于 PDF 打开这种不频繁的操作完全可以接受

## 最终结论

对于您的 PDF 查看器扩展：
- **不推荐** declarativeNetRequest（限制太多）
- **推荐** 当前方案：webNavigation + 修改 PDF.js 源码

