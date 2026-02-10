/* AI Chat Sidebar Logic */
import { config } from './config.js';

(function () {
    'use strict';

    const SPARKLE_ICON = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2.85 11.1l-.85.6V16h-4v-2.3l-.85-.6C7.8 12.16 7 10.63 7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.63-.8 3.16-2.15 4.1z"/></svg>`;

    // 💬 对话历史存储（用于上下文记忆）
    let conversationHistory = [];
    
    // 📁 LocalStorage 键名（根据当前 PDF 文件生成唯一标识）
    let currentPdfKey = '';

    // 🔄 从 localStorage 加载历史记录
    function loadConversationHistory() {
        try {
            // 获取当前 PDF 的唯一标识（使用 URL 或文件名）
            const pdfApp = window.PDFViewerApplication;
            if (pdfApp && pdfApp.url) {
                currentPdfKey = 'ai_chat_history_' + btoa(pdfApp.url).substring(0, 50);
            } else {
                currentPdfKey = 'ai_chat_history_default';
            }
            
            const saved = localStorage.getItem(currentPdfKey);
            if (saved) {
                conversationHistory = JSON.parse(saved);
                console.log('📂 已加载历史记录，共', conversationHistory.length, '条消息');
                return true;
            }
        } catch (error) {
            console.error('❌ 加载历史记录失败:', error);
        }
        return false;
    }

    // 💾 保存历史记录到 localStorage
    function saveConversationHistory() {
        try {
            if (currentPdfKey) {
                localStorage.setItem(currentPdfKey, JSON.stringify(conversationHistory));
                console.log('💾 已保存历史记录');
            }
        } catch (error) {
            console.error('❌ 保存历史记录失败:', error);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAISidebar);
    } else {
        initAISidebar();
    }

    function initAISidebar() {
        console.log('Initializing AI Chat Sidebar...');

        // 检查 marked.js 是否加载
        if (window.marked) {
            console.log('✅ Marked.js 已加载，版本:', marked.version || 'unknown');
        } else {
            console.warn('⚠️ Marked.js 未加载，Markdown 渲染将不可用');
        }

        // 1. 注入工具栏按钮 (这是你之前"消失"的部分)
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
              <div class="ai-header-actions">
                <button class="ai-clear-btn" id="clearAIHistory" title="清除对话历史">🗑️</button>
                <button class="ai-sidebar-close" id="closeAISidebar">×</button>
              </div>
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
        document.getElementById('clearAIHistory').addEventListener('click', clearHistory);
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

        // 5. 📂 加载历史记录并恢复 UI
        if (loadConversationHistory()) {
            restoreChatUI();
        }

        // 🧪 开发者工具：在控制台提供测试函数
        window.testThinkingAnimation = function() {
            const container = document.getElementById('aiChatContainer');
            const testDiv = document.createElement('div');
            testDiv.className = 'chat-message assistant-msg thinking';
            testDiv.innerHTML = '<span class="thinking-dots"><span>.</span><span>.</span><span>.</span></span>';
            container.appendChild(testDiv);
            container.scrollTop = container.scrollHeight;
            console.log('✅ 测试思考动画已添加，应该能看到三个跳动的点');
            return testDiv;
        };
        
        console.log('🧪 调试命令：在控制台运行 testThinkingAnimation() 来测试动画');
    }

    // 🔄 恢复聊天界面（显示历史消息）
    function restoreChatUI() {
        const container = document.getElementById('aiChatContainer');
        
        // 清空欢迎消息
        container.innerHTML = '';
        
        // 如果有历史记录，显示历史消息
        if (conversationHistory.length > 0) {
            conversationHistory.forEach(msg => {
                const msgDiv = document.createElement('div');
                msgDiv.className = `chat-message ${msg.role}-msg`;
                
                if (msg.role === 'assistant' && window.marked) {
                    msgDiv.innerHTML = marked.parse(msg.content);
                } else {
                    msgDiv.innerText = msg.content;
                }
                
                container.appendChild(msgDiv);
            });
            
            // 滚动到底部
            container.scrollTop = container.scrollHeight;
            console.log('✅ 已恢复', conversationHistory.length, '条历史消息');
        } else {
            // 显示欢迎消息
            const welcomeDiv = document.createElement('div');
            welcomeDiv.className = 'chat-message assistant-msg';
            welcomeDiv.innerText = '你好！我是你的 AI 助手，你可以问我关于这份 PDF 的任何问题。';
            container.appendChild(welcomeDiv);
        }
    }

    // --- 逻辑控制函数 ---

    function toggleSidebar() {
        const outerContainer = document.getElementById('outerContainer');
        const viewerContainer = document.getElementById('viewerContainer');
        const sidebar = document.getElementById('aiSidebar');
        
        const isOpen = outerContainer.classList.toggle('aiSidebarOpen');
        
        if (isOpen) {
            // 获取当前定义的 CSS 变量值
            const currentWidth = parseInt(getComputedStyle(sidebar).width);
            viewerContainer.style.paddingRight = `${currentWidth + 24}px`;
        } else {
            viewerContainer.style.paddingRight = '0px';
        }
    
        // 延时等待 CSS 过渡结束后重新计算 PDF 布局
        setTimeout(() => {
            if (window.PDFViewerApplication) {
                window.PDFViewerApplication.eventBus.dispatch('resize', { source: window });
            }
        }, 310);
    }

    function closeSidebar() {
        document.getElementById('outerContainer').classList.remove('aiSidebarOpen');
    }

    function clearHistory() {
        conversationHistory = [];
        
        // 从 localStorage 删除
        if (currentPdfKey) {
            localStorage.removeItem(currentPdfKey);
            console.log('🗑️ 已从 localStorage 删除历史记录');
        }
        
        const container = document.getElementById('aiChatContainer');
        container.innerHTML = '<div class="chat-message assistant-msg">对话历史已清除。你可以开始新的对话。</div>';
        console.log('✅ 对话历史已清除');
    }

    async function handleSendMessage() {
        const input = document.getElementById('aiInput');
        const text = input.value.trim();
        if (!text) return;

        appendMessage('user', text);
        input.value = '';
        input.style.height = 'auto';

        // 显示思考中的占位符（带动画）
        const aiMsgDiv = appendMessage('assistant', '');
        aiMsgDiv.classList.add('thinking');
        aiMsgDiv.innerHTML = '<span class="thinking-dots"><span>.</span><span>.</span><span>.</span></span>';
        
        console.log('💭 显示思考动画，classList:', aiMsgDiv.classList.toString());
        console.log('💭 思考动画 HTML:', aiMsgDiv.innerHTML);
        console.log('💭 元素样式:', window.getComputedStyle(aiMsgDiv).display);
        
        // 强制滚动到底部，确保看到思考动画
        const container = document.getElementById('aiChatContainer');
        container.scrollTop = container.scrollHeight;
        
        // 强制重绘以确保动画显示
        aiMsgDiv.offsetHeight;
        
        try {
            console.log('📄 正在提取 PDF 文本...');
            
            // 3. 获取 PDF 文本上下文 (建议取前 10 页或全文)
            const pdfContext = await getPDFText(); 
            
            console.log('📝 PDF 文本提取完成，开始调用 API...');
    
            // 4. 调用真实的 API (这里以 fetch 流式请求为例)
            await callAIStreamAPI(text, pdfContext, aiMsgDiv);
    
        } catch (err) {
            aiMsgDiv.classList.remove('thinking');
            aiMsgDiv.innerText = "❌ 抱歉，处理您的请求时出错：" + err.message;
            console.error("AI Error:", err);
        }
    }
    async function callAIStreamAPI(userQuery, context, displayElement) {
        // 从配置文件获取 API 配置
        const API_URL = config.API_URL;
        const API_KEY = config.API_KEY; // ⚠️ 注意：前端直接写 Key 有风险，生产环境建议走后端中转
    
        // 构建消息数组：系统提示词 + 历史对话 + 当前问题
        const messages = [
            { 
                role: "system", 
                content: `你是一个专业的 PDF 助手。以下是文档内容：

${context}

请根据文档内容回答用户的问题。如果问题与文档内容无关，请礼貌地提醒用户。`
            },
            ...conversationHistory, // 📝 插入历史对话
            { 
                role: "user", 
                content: userQuery 
            }
        ];

        console.log('📤 发送消息到 API，历史对话数量:', conversationHistory.length);
    
        const response = await fetch(API_URL + '/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: config.MODEL,
                messages: messages,
                stream: true // 启用流式传输
            })
        });
    
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
        console.log('✅ 收到 API 响应，等待第一个字...');
    
        // 处理流式数据 - 打字机效果
        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let fullContent = "";
        let displayBuffer = ""; // 用于打字机效果的缓冲区
        let isTyping = false;
        let isFirstChar = true; // 标记是否是第一个字符
        let isStreamFinished = false; // 标记流是否结束
    
        // 🚀 自适应速度的打字机效果函数
        const typeWriter = () => {
            if (displayBuffer.length > 0 && !isTyping) {
                isTyping = true;
                
                // 💡 第一个字符时移除思考动画
                if (isFirstChar) {
                    displayElement.classList.remove('thinking');
                    displayElement.innerHTML = '';
                    displayElement.innerText = '';
                    isFirstChar = false;
                    console.log('✨ 开始显示第一个字，移除思考动画');
                }
                
                const char = displayBuffer.charAt(0);
                displayBuffer = displayBuffer.substring(1);
                
                // 更新显示内容
                displayElement.innerText += char;
                
                // 自动滚动到底部
                const container = document.getElementById('aiChatContainer');
                container.scrollTop = container.scrollHeight;
                
                // 🎯 动态调整打字速度：根据缓冲区大小自适应
                let delay;
                const bufferSize = displayBuffer.length;
                
                if (bufferSize > 50) {
                    // 缓冲区很大，加速打字
                    delay = char === '\n' ? 2 : (char.match(/[，。！？,.!?]/) ? 10 : 5);
                } else if (bufferSize > 20) {
                    // 缓冲区较大，中速打字
                    delay = char === '\n' ? 5 : (char.match(/[，。！？,.!?]/) ? 30 : 15);
                } else if (bufferSize > 5) {
                    // 缓冲区适中，正常速度
                    delay = char === '\n' ? 10 : (char.match(/[，。！？,.!?]/) ? 50 : 25);
                } else {
                    // 缓冲区较小，慢速打字（更有打字机感觉）
                    delay = char === '\n' ? 10 : (char.match(/[，。！？,.!?]/) ? 100 : 40);
                }
                
                setTimeout(() => {
                    isTyping = false;
                    typeWriter();
                }, delay);
            } else if (isStreamFinished && displayBuffer.length === 0) {
                // 流结束且缓冲区清空，停止打字机
                return;
            }
        };

        // 启动打字机效果
        const typingInterval = setInterval(typeWriter, 10); // 更频繁地检查

        while (true) {
            const { done, value } = await reader.read();
            if (done) {
                isStreamFinished = true;
                break;
            }
    
            const chunk = decoder.decode(value);
            const lines = chunk.split('\n').filter(line => line.trim() !== '');
    
            for (const line of lines) {
                const message = line.replace(/^data: /, '');
                if (message === '[DONE]') break;
                
                try {
                    const parsed = JSON.parse(message);
                    const content = parsed.choices[0].delta.content || "";
                    fullContent += content;
                    displayBuffer += content; // 添加到打字机缓冲区
                } catch (e) {
                    // 忽略非 JSON 行
                }
            }
        }

        // 等待打字机效果完成
        while (displayBuffer.length > 0 || isTyping) {
            await new Promise(resolve => setTimeout(resolve, 50));
        }
        
        clearInterval(typingInterval);

        // 🎨 打字完成后，将纯文本转换为 Markdown 渲染
        console.log('🔍 检查 Markdown 渲染条件:', {
            'window.marked': !!window.marked,
            'fullContent': fullContent.substring(0, 100) + '...',
            'fullContent.length': fullContent.length
        });

        if (window.marked && fullContent) {
            try {
                const htmlContent = marked.parse(fullContent);
                displayElement.innerHTML = htmlContent;
                console.log('✨ Markdown 渲染完成');
                console.log('📝 渲染后的 HTML 长度:', htmlContent.length);
            } catch (err) {
                console.error('❌ Markdown 渲染失败:', err);
                console.error('错误详情:', err.message);
                // 如果渲染失败，保持原始文本
            }
        } else {
            console.warn('⚠️ Markdown 未渲染:', {
                'marked 加载': !!window.marked,
                '内容存在': !!fullContent
            });
        }

        // 💾 将本轮对话添加到历史记录
        conversationHistory.push(
            { role: "user", content: userQuery },
            { role: "assistant", content: fullContent }
        );
        console.log('📝 已保存到对话历史，当前历史长度:', conversationHistory.length);

        // 🧹 可选：限制历史记录长度（避免 token 超限）
        const MAX_HISTORY_MESSAGES = 20; // 保留最近 10 轮对话（20 条消息）
        if (conversationHistory.length > MAX_HISTORY_MESSAGES) {
            conversationHistory = conversationHistory.slice(-MAX_HISTORY_MESSAGES);
            console.log('🔄 历史记录已裁剪到最近', MAX_HISTORY_MESSAGES, '条消息');
        }

        // 💾 保存到 localStorage
        saveConversationHistory();
    }

    function appendMessage(role, content) {
        const container = document.getElementById('aiChatContainer');
        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-message ${role}-msg`;
        
        // 只有在有内容时才设置
        if (content) {
            // 如果是 AI 消息且引入了 marked，则解析 Markdown
            if (role === 'assistant' && window.marked) {
                msgDiv.innerHTML = marked.parse(content);
            } else {
                msgDiv.innerText = content;
            }
        }
        
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

    /**
     * 从当前 PDF 中提取文本内容
     * @param {number} maxPages - 最多提取多少页（默认从配置文件读取）
     * @returns {Promise<string>} - 返回提取的文本内容
     */
    async function getPDFText(maxPages = config.PDF_MAX_PAGES) {
        try {
            // 获取 PDF.js 的应用实例
            const pdfApp = window.PDFViewerApplication;
            if (!pdfApp || !pdfApp.pdfDocument) {
                console.warn('⚠️ PDF 文档未加载');
                return '（无法获取 PDF 内容，请确保文档已加载）';
            }

            const pdfDoc = pdfApp.pdfDocument;
            const numPages = Math.min(pdfDoc.numPages, maxPages);
            
            console.log(`📄 正在提取 PDF 文本，共 ${pdfDoc.numPages} 页，提取前 ${numPages} 页...`);
            
            let fullText = '';
            
            // 遍历每一页提取文本
            for (let pageNum = 1; pageNum <= numPages; pageNum++) {
                try {
                    const page = await pdfDoc.getPage(pageNum);
                    const textContent = await page.getTextContent();
                    
                    // 将文本项拼接成字符串
                    const pageText = textContent.items
                        .map(item => item.str)
                        .join(' ');
                    
                    fullText += `\n\n===== 第 ${pageNum} 页 =====\n${pageText}`;
                    
                } catch (pageError) {
                    console.error(`❌ 提取第 ${pageNum} 页失败:`, pageError);
                    fullText += `\n\n===== 第 ${pageNum} 页 =====\n（提取失败）`;
                }
            }
            
            console.log(`✅ PDF 文本提取完成，共 ${fullText.length} 字符`);
            
            // 如果文本太长，进行截断
            const MAX_CHARS = config.PDF_MAX_CHARS;
            if (fullText.length > MAX_CHARS) {
                console.log(`⚠️ 文本过长，截断到 ${MAX_CHARS} 字符`);
                fullText = fullText.substring(0, MAX_CHARS) + '\n\n...(文本过长，已截断)';
            }
            
            return fullText || '（PDF 内容为空或无法识别）';
            
        } catch (error) {
            console.error('❌ 提取 PDF 文本失败:', error);
            return '（提取 PDF 内容时发生错误：' + error.message + '）';
        }
    }

    // 复用你之前的拖拽逻辑
    function setupResizer() {
        const sidebar = document.getElementById('aiSidebar');
        const resizer = sidebar.querySelector('.sidebarResizer');
        const outerContainer = document.getElementById('outerContainer');
        const viewerContainer = document.getElementById('viewerContainer');
    
        let isResizing = false;
    
        resizer.addEventListener('mousedown', (e) => {
            isResizing = true;
            // 增加类名以禁用过渡动画（防止拖拽滞后）和文本选择
            outerContainer.classList.add('aiSidebarResizing');
            document.body.style.cursor = 'ew-resize';
    
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', stopResizing);
            e.preventDefault();
        });
    
        function handleMouseMove(e) {
            if (!isResizing) return;
    
            // 计算新宽度：屏幕宽度 - 当前鼠标位置 - 右边距(如果有)
            // 因为侧边栏是固定在右边的，所以鼠标越往左移，宽度越大
            let newWidth = window.innerWidth - e.clientX - 12; // 12 是我们在 CSS 中设置的 right 边距
    
            // 限制最小和最大宽度
            const minWidth = 250;
            const maxWidth = window.innerWidth * 0.6;
            newWidth = Math.max(minWidth, Math.min(newWidth, maxWidth));
    
            // 1. 更新侧边栏宽度
            sidebar.style.width = `${newWidth}px`;
            sidebar.style.setProperty('--sidebar-width', `${newWidth}px`);
    
            // 2. 更新 PDF 容器的右内边距，确保滚动条靠边但内容不被遮挡
            // 这里 +24 是为了留出侧边栏两边的间隙感
            viewerContainer.style.paddingRight = `${newWidth + 24}px`;
    
            // 3. 实时通知 PDF.js 调整页面缩放（解决 PDF 内容偏移）
            if (window.PDFViewerApplication) {
                window.PDFViewerApplication.eventBus.dispatch('resize', { source: window });
            }
        }
    
        function stopResizing() {
            if (!isResizing) return;
            isResizing = false;
            outerContainer.classList.remove('aiSidebarResizing');
            document.body.style.cursor = 'default';
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', stopResizing);
        }
    }

})();