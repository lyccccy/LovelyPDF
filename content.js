// Content script to detect PDF files by Content-Type
(function() {
  'use strict';
  
  // 检查当前页面是否是 PDF
  const url = window.location.href;
  
  // 如果已经在扩展的 viewer 中，不要重定向
  if (url.includes('chrome-extension://')) {
    return;
  }
  
  // 检查 URL 是否以 .pdf 结尾
  if (url.toLowerCase().endsWith('.pdf') || 
      url.toLowerCase().includes('.pdf?') || 
      url.toLowerCase().includes('.pdf#')) {
    
    // 通知 background script 进行重定向
    chrome.runtime.sendMessage({
      type: 'PDF_DETECTED',
      url: url
    });
  }
  
  // 检查 Content-Type (需要在页面开始加载时检查)
  const observer = new MutationObserver(() => {
    const contentType = document.contentType || '';
    if (contentType.includes('application/pdf')) {
      chrome.runtime.sendMessage({
        type: 'PDF_DETECTED',
        url: url
      });
      observer.disconnect();
    }
  });
  
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });
  
  // 5秒后停止观察
  setTimeout(() => observer.disconnect(), 5000);
})();

