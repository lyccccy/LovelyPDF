/* AI Summary Sidebar Logic */
(function () {
    'use strict';

    // 使用灯泡图标
    const SPARKLE_ICON = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path fill="currentColor" d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2.85 11.1l-.85.6V16h-4v-2.3l-.85-.6C7.8 12.16 7 10.63 7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.63-.8 3.16-2.15 4.1z"/>
    </svg>`;

    let isResizing = false;
    let startX = 0;
    let startWidth = 0;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAISidebar);
    } else {
        initAISidebar();
    }

    function initAISidebar() {
        console.log('Initializing AI Sidebar...');

        // 1. Inject Toolbar Button
        const toolbarRight = document.getElementById('toolbarViewerRight');
        if (!toolbarRight) return;

        // Create wrapper for button to match existing structure if needed, or just insert button
        const aiButton = document.createElement('button');
        aiButton.id = 'viewAI';
        aiButton.className = 'toolbarButton';
        aiButton.title = 'AI 摘要';
        aiButton.innerHTML = SPARKLE_ICON;
        aiButton.addEventListener('click', toggleSidebar);

        // Insert before the opening menu (or at the start of right toolbar)
        toolbarRight.prepend(aiButton);

        // 2. Inject Sidebar HTML (插入到 outerContainer 内)
        const outerContainer = document.getElementById('outerContainer');
        if (!outerContainer) return;

        const sidebarHTML = `
      <div id="aiSidebar">
        <div class="sidebarResizer" tabindex="0"></div>
        <div class="ai-sidebar-header">
          <h3>✨ AI 助手</h3>
          <button class="ai-sidebar-close" id="closeAISidebar">×</button>
        </div>
        <div class="ai-sidebar-content">
          <div style="text-align: center; color: var(--ui-text); opacity: 0.8; font-size: 13px;">
            点击下方按钮，生成当前文档的智能摘要。
          </div>
          <button id="startSummaryBtn" class="ai-btn">
            <span>⚡ 开始总结</span>
          </button>
          <div id="aiSummaryResult" class="hidden"></div>
        </div>
      </div>
    `;
        outerContainer.insertAdjacentHTML('beforeend', sidebarHTML);

        // 3. Bind Events
        document.getElementById('closeAISidebar').addEventListener('click', closeSidebar);
        document.getElementById('startSummaryBtn').addEventListener('click', startSummary);

        // 4. Setup Resizer
        setupResizer();
    }

    function toggleSidebar() {
        const outerContainer = document.getElementById('outerContainer');
        if (outerContainer.classList.contains('aiSidebarOpen')) {
            closeSidebar();
        } else {
            openSidebar();
        }
    }

    function openSidebar() {
        const outerContainer = document.getElementById('outerContainer');
        outerContainer.classList.add('aiSidebarOpen');
    }

    function closeSidebar() {
        const outerContainer = document.getElementById('outerContainer');
        outerContainer.classList.remove('aiSidebarOpen');
    }

    function setupResizer() {
        const sidebar = document.getElementById('aiSidebar');
        const resizer = sidebar.querySelector('.sidebarResizer');
        const outerContainer = document.getElementById('outerContainer');

        resizer.addEventListener('mousedown', startResize);
        resizer.addEventListener('keydown', handleResizerKeyDown);

        function startResize(e) {
            isResizing = true;
            startX = e.clientX;
            startWidth = sidebar.offsetWidth;

            sidebar.classList.add('resizing');
            outerContainer.classList.add('aiSidebarResizing');

            document.addEventListener('mousemove', resize);
            document.addEventListener('mouseup', stopResize);

            e.preventDefault();
        }

        function resize(e) {
            if (!isResizing) return;

            const deltaX = startX - e.clientX; // 从右边拖动，所以是反向
            let newWidth = startWidth + deltaX;

            // 获取最小和最大宽度
            const minWidth = parseInt(getComputedStyle(sidebar).getPropertyValue('--sidebar-min-width')) || 200;
            const maxWidth = window.innerWidth * 0.5; // 50vw

            newWidth = Math.max(minWidth, Math.min(newWidth, maxWidth));

            sidebar.style.setProperty('--sidebar-width', `${newWidth}px`);
            sidebar.style.width = `${newWidth}px`;
        }

        function stopResize() {
            if (!isResizing) return;

            isResizing = false;
            sidebar.classList.remove('resizing');
            outerContainer.classList.remove('aiSidebarResizing');

            document.removeEventListener('mousemove', resize);
            document.removeEventListener('mouseup', stopResize);
        }

        function handleResizerKeyDown(e) {
            const step = 10;
            let currentWidth = sidebar.offsetWidth;

            if (e.key === 'ArrowLeft') {
                currentWidth += step;
                e.preventDefault();
            } else if (e.key === 'ArrowRight') {
                currentWidth -= step;
                e.preventDefault();
            } else {
                return;
            }

            const minWidth = parseInt(getComputedStyle(sidebar).getPropertyValue('--sidebar-min-width')) || 200;
            const maxWidth = window.innerWidth * 0.5;

            currentWidth = Math.max(minWidth, Math.min(currentWidth, maxWidth));

            sidebar.style.setProperty('--sidebar-width', `${currentWidth}px`);
            sidebar.style.width = `${currentWidth}px`;
        }
    }

    async function startSummary() {
        const btn = document.getElementById('startSummaryBtn');
        const resultDiv = document.getElementById('aiSummaryResult');

        btn.disabled = true;
        btn.innerHTML = '<span>⏳ 正在分析...</span>';
        resultDiv.classList.remove('hidden');
        resultDiv.innerHTML = '正在读取文档内容...';

        try {
            // 1. Get Text from PDF
            const text = await getPDFText();
            resultDiv.innerHTML = '正在生成摘要...';

            // 2. Simulate AI Delay & Streaming
            await simulateAIStream(resultDiv);

            btn.innerHTML = '<span>🔄 重新生成</span>';
        } catch (err) {
            console.error(err);
            resultDiv.innerHTML = '❌ 生成失败: ' + err.message;
            btn.innerHTML = '<span>⚡ 开始总结</span>';
        } finally {
            btn.disabled = false;
        }
    }

    async function getPDFText() {
        // Access PDF.js internal API
        const pdfApp = window.PDFViewerApplication;
        if (!pdfApp || !pdfApp.pdfDocument) {
            throw new Error('PDF document not loaded');
        }

        const pdf = pdfApp.pdfDocument;
        const maxPages = Math.min(pdf.numPages, 5); // Read first 5 pages for demo
        let fullText = '';

        for (let i = 1; i <= maxPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            const strings = content.items.map(item => item.str);
            fullText += strings.join(' ') + '\n';
        }

        return fullText;
    }

    function simulateAIStream(container) {
        return new Promise(resolve => {
            const summaryText = `📄 **文档摘要**\n\n这是一个模拟的 AI 摘要结果。\n\n1. **主要内容**：文档似乎包含了一些技术细节或文本内容（基于前5页提取）。\n2. **关键点**：\n   - 支持夜间模式\n   - PDF 渲染优化\n   - 用户体验改进\n\n(这是一个演示功能，尚未连接真实的大模型 API。)`;

            container.innerHTML = '';
            let i = 0;
            const interval = setInterval(() => {
                container.innerHTML += summaryText.charAt(i);
                container.scrollTop = container.scrollHeight;
                i++;
                if (i >= summaryText.length) {
                    clearInterval(interval);
                    resolve();
                }
            }, 30); // Typing effect
        });
    }

})();
