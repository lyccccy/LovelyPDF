// API 配置示例文件
// 使用说明：
// 1. 复制此文件为 config.js
// 2. 将 "your-api-key-here" 替换为你的真实 API Key
// 3. config.js 不会被提交到 git（已在 .gitignore 中）

export const config = {
    // OpenRouter API Key
    // 获取地址：https://openrouter.ai/keys
    API_KEY: "your-api-key-here",
    
    // API 基础 URL
    API_URL: "https://openrouter.ai/api/v1",
    
    // 使用的模型（可选配置）
    MODEL: "anthropic/claude-3.5-sonnet",
    
    // 最大 token 数（可选配置）
    MAX_TOKENS: 4000,
    
    // 温度参数（可选配置，0-2）
    TEMPERATURE: 0.7,

        // PDF 文本提取配置
    PDF_MAX_PAGES: 10,        // 最多提取多少页
    DF_MAX_CHARS: 20000      // 最多保留多少字符（约 5000 tokens）
};

