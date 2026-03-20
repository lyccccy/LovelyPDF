// i18n.js

const translations = {
    "en": {
        // Night Mode Custom Buttons
        "high_contrast": "High Contrast",
        "eye_care": "Eye Care",
        "custom_settings": "Custom Settings...",
        "night_mode_settings": "Night Mode Settings",
        "invert": "Invert",
        "brightness": "Brightness",
        "contrast": "Contrast",
        "hue": "Hue",
        "enable_bg_image": "Enable Background Image",
        "bg_image_url": "Background Image (URL/Path)",
        "input_bg_placeholder": "Enter image URL or select file",
        "select_local_image": "Select local image",
        "bg_opacity": "Background Opacity",
        "reset": "Reset",
        "night_mode_title": "Night Mode",
        "alert_need_image": "⚠️ Please select an image file!",

        // AI Sidebar
        "ai_assistant_title": "AI Assistant",
        "settings": "Settings",
        "clear_history": "Clear Chat History",
        "api_settings": "⚙️ API Settings",
        "model": "Model:",
        "save_settings": "Save Settings",
        "restore_default": "Restore Default",
        "settings_saved_note": "💡 Settings are saved locally and persist after refresh",
        "welcome_message": "Hello! I am your AI assistant. You can ask me any questions about this PDF.",
        "ask_ai_placeholder": "Ask AI...",
        "confirm_clear_history": "Are you sure you want to clear the chat history?",
        "clear_history_success": "Chat history cleared. You can start a new conversation.",
        "confirm_restore_defaults": "Are you sure you want to restore default settings? This will clear your saved API configuration.",
        "alert_save_success": "✅ Settings saved successfully!",
        "alert_save_failed": "❌ Failed to save settings: ",
        "alert_fill_one": "⚠️ Please fill in at least one setting",
        "alert_restore_success": "✅ Default settings restored! Refresh the page to take effect."
    },
    "zh": {
        // Night Mode Custom Buttons
        "high_contrast": "高对比度",
        "eye_care": "护眼模式",
        "custom_settings": "自定义设置...",
        "night_mode_settings": "夜间模式设置",
        "invert": "反色 (Invert)",
        "brightness": "亮度 (Brightness)",
        "contrast": "对比度 (Contrast)",
        "hue": "色相 (Hue)",
        "enable_bg_image": "启用背景图片",
        "bg_image_url": "背景图片 (URL/Path)",
        "input_bg_placeholder": "输入图片地址或选择文件",
        "select_local_image": "选择本地图片",
        "bg_opacity": "背景亮度 (Opacity)",
        "reset": "重置",
        "night_mode_title": "夜间模式",
        "alert_need_image": "⚠️ 请选择图片文件！",

        // AI Sidebar
        "ai_assistant_title": "AI 助手",
        "settings": "设置",
        "clear_history": "清除对话历史",
        "api_settings": "⚙️ API 设置",
        "model": "模型:",
        "save_settings": "保存设置",
        "restore_default": "恢复默认",
        "settings_saved_note": "💡 设置会保存在本地，刷新页面后依然有效",
        "welcome_message": "你好！我是你的 AI 助手，你可以问我关于这份 PDF 的任何问题。",
        "ask_ai_placeholder": "问问 AI...",
        "confirm_clear_history": "确定要清除对话历史吗？",
        "clear_history_success": "对话历史已清除。你可以开始新的对话。",
        "confirm_restore_defaults": "确定要恢复默认设置吗？这将清除您保存的 API 配置。",
        "alert_save_success": "✅ 设置已保存！",
        "alert_save_failed": "❌ 保存设置失败：",
        "alert_fill_one": "⚠️ 请至少填写一项设置",
        "alert_restore_success": "✅ 已恢复默认设置！刷新页面后生效。"
    }
};

/**
 * Detects the user's browser language.
 * Defaults to 'en' if the browser isn't set to Chinese.
 */
function getLanguage() {
    const lang = navigator.language || navigator.userLanguage;
    if (lang && lang.toLowerCase().startsWith('zh')) {
        return 'zh';
    }
    return 'en';
}

const currentLang = getLanguage();

/**
 * Gets the translated string for a given key.
 * @param {string} key 
 * @returns {string}
 */
export function t(key) {
    if (translations[currentLang] && translations[currentLang][key]) {
        return translations[currentLang][key];
    }
    // Fallback to English if translation is missing
    if (translations["en"] && translations["en"][key]) {
        return translations["en"][key];
    }
    return key;
}
