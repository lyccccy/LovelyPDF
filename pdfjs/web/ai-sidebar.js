/* AI Summary Sidebar Logic */
(function () {
    'use strict';

    const AI_ICON_SVG = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" fill="currentColor"/></svg>`;

    // Use a sparkle icon for AI
    const SPARKLE_ICON = `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2.85 11.1l-.85.6V16h-4v-2.3l-.85-.6C7.8 12.16 7 10.63 7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.63-.8 3.16-2.15 4.1z"/></svg>`;

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

        // 2. Inject Sidebar HTML
        const sidebarHTML = `
      <div id="aiSidebar">
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
        document.body.insertAdjacentHTML('beforeend', sidebarHTML);

        // 3. Bind Events
        document.getElementById('closeAISidebar').addEventListener('click', closeSidebar);
        document.getElementById('startSummaryBtn').addEventListener('click', startSummary);
    }

    function toggleSidebar() {
        const sidebar = document.getElementById('aiSidebar');
        sidebar.classList.toggle('open');
        document.body.classList.toggle('ai-sidebar-active');
    }

    function closeSidebar() {
        const sidebar = document.getElementById('aiSidebar');
        sidebar.classList.remove('open');
        document.body.classList.remove('ai-sidebar-active');
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
