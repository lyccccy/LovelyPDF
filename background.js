chrome.runtime.onInstalled.addListener(() => {
  console.log("PDF Extension Installed");
});

// 监听导航开始事件（最早的拦截时机）
chrome.webNavigation.onBeforeNavigate.addListener(
  (details) => {
    // 只处理主框架
    if (details.frameId !== 0) return;
    
    // 忽略扩展自己的页面
    if (details.url.startsWith('chrome-extension://')) return;
    
    // 检查是否是 PDF URL
    if (isPdfUrl(details.url)) {
      // 使用 wrapper 页面来处理文件
      const viewerUrl = chrome.runtime.getURL(
        `viewer-wrapper.html?file=${encodeURIComponent(details.url)}`
      );
      
      chrome.tabs.update(details.tabId, { url: viewerUrl });
      console.log("Redirected PDF:", details.url);
    }
  }
);

// 监听来自 content script 的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'PDF_DETECTED' && sender.tab) {
    const viewerUrl = chrome.runtime.getURL(
      `viewer-wrapper.html?file=${encodeURIComponent(message.url)}`
    );
    
    chrome.tabs.update(sender.tab.id, { url: viewerUrl });
  }
});

// 检查 URL 是否是 PDF
function isPdfUrl(url) {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname.toLowerCase();
    
    // 检查文件扩展名
    return pathname.endsWith('.pdf');
  } catch {
    return false;
  }
}
