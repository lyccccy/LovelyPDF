/* AI Chat Sidebar Logic */
(function () {
    'use strict';

    const SPARKLE_ICON = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2.85 11.1l-.85.6V16h-4v-2.3l-.85-.6C7.8 12.16 7 10.63 7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.63-.8 3.16-2.15 4.1z"/></svg>`;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAISidebar);
    } else {
        initAISidebar();
    }

    function initAISidebar() {
        console.log('Initializing AI Chat Sidebar...');

        // 1. 注入工具栏按钮 (这是你之前“消失”的部分)
        const toolbarRight = document.getElementById('toolbarViewerRight');
        if (!toolbarRight || document.getElementById('viewAI')) return;

        const aiButton = document.createElement('button');
        aiButton.id = 'viewAI';
        aiButton.className = 'toolbarButton';
        aiButton.title = 'AI 助手';
        aiButton.innerHTML = SPARKLE_ICON;
        aiButton.addEventListener('click', toggleSidebar);
        toolbarRight.prepend(aiButton);

        // 2. 注入侧边栏 HTML
        const outerContainer = document.getElementById('outerContainer');
        if (!outerContainer || document.getElementById('aiSidebar')) return;

        const sidebarHTML = `
          <div id="aiSidebar">
            <div class="sidebarResizer" tabindex="0"></div>
            <div class="ai-sidebar-header">
              <div class="ai-header-title">✨ AI Assistant</div>
              <button class="ai-sidebar-close" id="closeAISidebar">×</button>
            </div>
            
            <div class="ai-chat-container" id="aiChatContainer">
                <div class="chat-message ai-msg">
                    你好！我是你的 AI 助手，你可以问我关于这份 PDF 的任何问题。
                </div>
            </div>

            <div class="ai-input-wrapper">
              <div class="ai-input-container">
                <textarea id="aiInput" placeholder="问问 AI..." rows="1"></textarea>
                <button id="aiSendBtn">
                    <svg viewBox="0 0 24 24"><path fill="currentColor" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
                </button>
              </div>
              <div class="ai-input-footer">Powered by Gemini</div>
            </div>
          </div>
        `;
        outerContainer.insertAdjacentHTML('beforeend', sidebarHTML);

        // 3. 绑定事件
        document.getElementById('closeAISidebar').addEventListener('click', closeSidebar);
        document.getElementById('aiSendBtn').addEventListener('click', handleSendMessage);
        
        const aiInput = document.getElementById('aiInput');
        aiInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
            }
        });

        // 自动伸缩输入框
        aiInput.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
        });

        // 4. 启用拖动缩放 (调用你原有的 setupResizer)
        setupResizer();
    }

    // --- 逻辑控制函数 ---

    function toggleSidebar() {
        const outerContainer = document.getElementById('outerContainer');
        outerContainer.classList.toggle('aiSidebarOpen');
    }

    function closeSidebar() {
        document.getElementById('outerContainer').classList.remove('aiSidebarOpen');
    }

    async function handleSendMessage() {
        const input = document.getElementById('aiInput');
        const text = input.value.trim();
        if (!text) return;

        appendMessage('user', text);
        input.value = '';
        input.style.height = 'auto';

        // 模拟 AI 响应
        const aiMsgDiv = appendMessage('ai', '...');
        await simulateAIStream(aiMsgDiv, "正在分析文档以回答您的提问：" + text);
    }

    function appendMessage(role, content) {
        const container = document.getElementById('aiChatContainer');
        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-message ${role}-msg`;
        msgDiv.innerText = content;
        container.appendChild(msgDiv);
        container.scrollTop = container.scrollHeight;
        return msgDiv;
    }

    function simulateAIStream(element, fullText) {
        return new Promise(resolve => {
            element.innerText = '';
            let i = 0;
            const interval = setInterval(() => {
                element.innerText += fullText.charAt(i);
                document.getElementById('aiChatContainer').scrollTop = document.getElementById('aiChatContainer').scrollHeight;
                i++;
                if (i >= fullText.length) {
                    clearInterval(interval);
                    resolve();
                }
            }, 20);
        });
    }

    // 复用你之前的拖拽逻辑
    function setupResizer() {
        const sidebar = document.getElementById('aiSidebar');
        const resizer = sidebar.querySelector('.sidebarResizer');
        const outerContainer = document.getElementById('outerContainer');
        let isResizing = false;

        resizer.addEventListener('mousedown', (e) => {
            isResizing = true;
            document.addEventListener('mousemove', resize);
            document.addEventListener('mouseup', () => {
                isResizing = false;
                document.removeEventListener('mousemove', resize);
            });
        });

        function resize(e) {
            if (!isResizing) return;
            let newWidth = window.innerWidth - e.clientX;
            newWidth = Math.max(250, Math.min(newWidth, window.innerWidth * 0.6));
            sidebar.style.width = `${newWidth}px`;
            sidebar.style.setProperty('--sidebar-width', `${newWidth}px`);
        }
    }

})();