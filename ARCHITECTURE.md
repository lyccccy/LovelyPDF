# 🔧 技术架构速查

## 核心问题及解决方案

### 1️⃣ Manifest V3 不支持 webRequest blocking
**解决**: 使用 `webNavigation.onBeforeNavigate` 拦截

### 2️⃣ 本地文件无法访问
**解决**: 
- manifest 添加 `"file:///*"` 权限
- 用户启用"允许访问文件网址"
- 直接 fetch 本地文件

### 3️⃣ 内联脚本违反 CSP
**解决**: 提取为外部 `.js` 文件

### 4️⃣ PDF.js 跨域检查
**解决**: 转换为 blob URL（同源）

### 5️⃣ 远程文件 CORS 限制
**解决**: background script 代理请求（不受 CORS 限制）

---

## 数据流

```
远程 PDF URL
     ↓
viewer-wrapper.js 发送消息
     ↓
background.js fetch（绕过 CORS ✅）
     ↓
返回 ArrayBuffer（通过消息传递）
     ↓
viewer-wrapper.js 转为 blob
     ↓
blob URL → PDF.js
```

---

## 关键代码片段

### background.js - CORS 代理
```javascript
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'FETCH_PDF') {
    fetch(message.url)
      .then(res => res.arrayBuffer())
      .then(buffer => {
        sendResponse({ 
          success: true, 
          data: Array.from(new Uint8Array(buffer)) 
        });
      });
    return true; // 异步响应
  }
});
```

### viewer-wrapper.js - 获取数据
```javascript
// 远程文件通过 background 代理
const arrayBuffer = await fetchViaBackground(url);
const blob = new Blob([arrayBuffer], { type: 'application/pdf' });
const blobUrl = URL.createObjectURL(blob);
```

### 为什么用 Array 传递？
- Chrome 消息 API 不支持 ArrayBuffer/Blob 直接传递
- 转为 Array 后可以序列化
- 接收端再转回 Uint8Array

---

## 权限说明

| 权限 | 用途 |
|------|------|
| `webNavigation` | 拦截 PDF 导航 |
| `tabs` | 更新标签页 URL |
| `storage` | （预留）保存设置 |
| `<all_urls>` | 访问远程 PDF |
| `file:///*` | 访问本地 PDF |

---

## 文件职责

| 文件 | 职责 | 运行环境 |
|------|------|----------|
| `background.js` | 拦截导航、CORS 代理 | Service Worker |
| `content.js` | 检测 PDF Content-Type | 页面上下文 |
| `viewer-wrapper.js` | 加载文件、转 blob | 扩展页面 |
| `viewer-wrapper.html` | UI 容器 | 扩展页面 |

---

## 调试技巧

1. **Service Worker 日志**
   - `chrome://extensions/` → Service Worker
   - 查看拦截和 fetch 日志

2. **查看器页面日志**
   - 右键 PDF 页面 → 检查
   - 查看 blob 创建和加载日志

3. **常见错误**
   - "Failed to fetch" → 检查文件访问权限
   - "file origin does not match" → blob URL 未正确创建
   - CORS error → background 代理未工作

---

## 性能考虑

- **优点**: 可以加载任何远程 PDF（绕过 CORS）
- **缺点**: 需要完整下载文件才能显示（无法流式加载）
- **优化**: 未来可考虑分块传输大文件

---

## 安全性

✅ background script 可以访问任何 URL
✅ 但只在用户主动打开 PDF 时触发
✅ 数据不会被存储或泄露
✅ 符合 Chrome 扩展最佳实践

