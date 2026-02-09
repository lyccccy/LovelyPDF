// Viewer wrapper script to handle local and remote PDF files
(function() {
  const urlParams = new URLSearchParams(window.location.search);
  const fileUrl = urlParams.get('file');
  
  if (!fileUrl) {
    showError('未指定文件 URL');
    return;
  }
  
  console.log('Loading PDF:', fileUrl);
  
  const isLocalFile = fileUrl.startsWith('file://');
  
  if (isLocalFile) {
    // 本地文件：显示文件上传界面
    document.getElementById('loading').style.display = 'none';
    document.getElementById('fileUpload').style.display = 'block';
    
    // 监听文件选择
    document.getElementById('fileInput').addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (file && file.type === 'application/pdf') {
        loadFileFromBlob(file);
      }
    });
  } else {
    // 远程文件：直接尝试加载
    loadViewer(fileUrl);
  }
})();

function loadFileFromBlob(file) {
  const reader = new FileReader();
  reader.onload = function(e) {
    const blob = new Blob([e.target.result], { type: 'application/pdf' });
    const blobUrl = URL.createObjectURL(blob);
    loadViewer(blobUrl);
  };
  reader.readAsArrayBuffer(file);
}

function loadViewer(pdfUrl) {
  const viewerUrl = chrome.runtime.getURL(
    `pdfjs/web/viewer.html?file=${encodeURIComponent(pdfUrl)}`
  );
  
  // 隐藏加载和上传界面
  document.getElementById('loading').style.display = 'none';
  document.getElementById('fileUpload').style.display = 'none';
  
  // 创建 iframe 加载 PDF.js viewer
  const iframe = document.createElement('iframe');
  iframe.src = viewerUrl;
  iframe.onload = () => {
    console.log('PDF viewer loaded successfully');
  };
  iframe.onerror = () => {
    showError('PDF 查看器加载失败');
  };
  
  document.body.appendChild(iframe);
}

function showError(message) {
  document.getElementById('loading').style.display = 'none';
  document.getElementById('fileUpload').style.display = 'none';
  document.getElementById('error').style.display = 'block';
  document.getElementById('error-message').innerHTML = message;
}

