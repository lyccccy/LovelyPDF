import { t } from './i18n.js';

// 夜间模式功能
(function () {
  'use strict';

  // 图标 SVG
  const sunIconSVG = `<svg class="night-mode-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M12,7c-2.76,0-5,2.24-5,5s2.24,5,5,5s5-2.24,5-5S14.76,7,12,7L12,7z M2,13l2,0c0.55,0,1-0.45,1-1s-0.45-1-1-1l-2,0 c-0.55,0-1,0.45-1,1S1.45,13,2,13z M20,13l2,0c0.55,0,1-0.45,1-1s-0.45-1-1-1l-2,0c-0.55,0-1,0.45-1,1S19.45,13,20,13z M11,2v2 c0,0.55,0.45,1,1,1s1-0.45,1-1V2c0-0.55-0.45-1-1-1S11,1.45,11,2z M11,20v2c0,0.55,0.45,1,1,1s1-0.45,1-1v-2c0-0.55-0.45-1-1-1 C11.45,19,11,19.45,11,20z M5.99,4.58c-0.39-0.39-1.03-0.39-1.41,0c-0.39,0.39-0.39,1.03,0,1.41l1.06,1.06 c0.39,0.39,1.03,0.39,1.41,0s0.39-1.03,0-1.41L5.99,4.58z M18.36,16.95c-0.39-0.39-1.03-0.39-1.41,0c-0.39,0.39-0.39,1.03,0,1.41 l1.06,1.06c0.39,0.39,1.03,0.39,1.41,0c0.39-0.39,0.39-1.03,0-1.41L18.36,16.95z M19.42,5.99c0.39-0.39,0.39-1.03,0-1.41 c-0.39-0.39-1.03-0.39-1.41,0l-1.06,1.06c-0.39,0.39-0.39,1.03,0,1.41s1.03,0.39,1.41,0L19.42,5.99z M7.05,18.36 c0.39-0.39,0.39-1.03,0-1.41c-0.39-0.39-1.03-0.39-1.41,0l-1.06,1.06c-0.39,0.39-0.39,1.03,0,1.41s1.03,0.39,1.41,0L7.05,18.36z"/></svg>`;

  const moonIconSVG = `<svg class="night-mode-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 57 60"><path fill="currentColor" d="M16.6526953,0.0677862861 L16.5088029,0.102819445 C5.31465091,2.87424012 -1.79617386,13.9971537 0.396615042,25.394079 L0.593785487,26.4188638 C2.86209998,38.20833 14.2168197,45.8968587 25.9552619,43.5916732 C32.2673245,42.3521156 37.5983879,38.4173929 40.6995119,32.8959767 C41.6746443,31.1597957 40.1274421,29.0935345 38.1983112,29.5556675 C37.9665023,29.6111984 37.7330425,29.6620637 37.4980143,29.7082183 C28.2243974,31.5293635 19.2539293,25.4552637 17.461913,16.1413367 L17.2647426,15.1165519 L17.2113448,14.8263832 C16.5145013,10.8701018 17.2227741,6.85861994 19.162003,3.40620011 C20.13918,1.6665265 18.5840507,-0.40243658 16.6526953,0.0677862861 Z" transform="translate(8 8)"/></svg>`;

  // 默认状态
  const DEFAULT_STATE = {
    active: false,
    type: 'invert', // 'invert' | 'dim' | 'custom'
    settings: {
      brightness: 100, // %
      contrast: 100, // %
      invert: 0, // %
      hue: 0, // deg
      hue: 0, // deg
      enableBackground: false, // Default disabled
      backgroundImage: 'assets/background_img/pexels-padrinan-255379.jpg', // Default background
      backgroundOpacityLight: 0.8, // 0 to 1 (Light Mode)
      backgroundOpacityDark: 0.4   // 0 to 1 (Night Mode)
    }
  };

  // 预设配置
  const PRESETS = {
    invert: { invert: 80, brightness: 90, contrast: 90, hue: 180 },
    dim: { invert: 0, brightness: 80, contrast: 90, hue: 0 }
  };

  let currentState = JSON.parse(JSON.stringify(DEFAULT_STATE));

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNightMode);
  } else {
    initNightMode();
  }

  function initNightMode() {
    const button = document.getElementById('customNightModeButton');
    if (!button) return;

    // Apply translation to main button
    button.title = t('night_mode_title');
    button.setAttribute('aria-label', t('night_mode_title'));

    // 1. 注入菜单 HTML (注入到按钮的父容器中，而不是按钮内部)
    const wrapper = button.parentElement;
    wrapper.style.position = 'relative'; // 确保菜单绝对定位相对于此容器

    const menuHTML = `
      <div id="nightModeMenu" class="night-mode-menu hidden">
        <div class="menu-item" data-type="invert">
          <span class="menu-icon">◑</span>
          <span class="menu-text">${t('high_contrast')}</span>
          <span class="menu-check" id="check-invert">✓</span>
        </div>
        <div class="menu-item" data-type="dim">
          <span class="menu-icon">👁️</span>
          <span class="menu-text">${t('eye_care')}</span>
          <span class="menu-check" id="check-dim">✓</span>
        </div>
        <div class="menu-separator"></div>
        <div class="menu-item" id="openSettings">
          <span class="menu-icon">⚙️</span>
          <span class="menu-text">${t('custom_settings')}</span>
        </div>
      </div>
    `;
    wrapper.insertAdjacentHTML('beforeend', menuHTML);

    // 2. 注入设置面板 HTML
    const settingsHTML = `
      <div id="nightModeSettings" class="night-mode-settings hidden">
        <div class="settings-header">
          <h3>${t('night_mode_settings')}</h3>
          <button id="closeSettings" class="close-btn">×</button>
        </div>
        <div class="settings-body">
          <div class="setting-row">
            <label>${t('invert')}</label>
            <input type="range" id="slider-invert" min="0" max="100" value="0">
            <span class="value" id="val-invert">0%</span>
          </div>
          <div class="setting-row">
            <label>${t('brightness')}</label>
            <input type="range" id="slider-brightness" min="50" max="150" value="100">
            <span class="value" id="val-brightness">100%</span>
          </div>
          <div class="setting-row">
            <label>${t('contrast')}</label>
            <input type="range" id="slider-contrast" min="50" max="150" value="100">
            <span class="value" id="val-contrast">100%</span>
          </div>
          <div class="setting-row">
            <label>${t('hue')}</label>
            <input type="range" id="slider-hue" min="0" max="360" value="0">
            <span class="value" id="val-hue">0°</span>
          </div>
          
          <div class="menu-separator" style="margin: 12px 0;"></div>
          
          <div class="setting-row">
            <label style="width: auto; flex: 1;">${t('enable_bg_image')}</label>
            <input type="checkbox" id="check-enable-bg" style="flex: 0;">
          </div>

          <div id="bg-settings-container" class="hidden">
            <div class="setting-row full-width">
              <label>${t('bg_image_url')}</label>
              <div style="display: flex; gap: 8px; align-items: center;">
                <input type="text" id="input-bg-image" placeholder="${t('input_bg_placeholder')}" style="flex: 1;">
                <button id="btn-browse-image" class="browse-btn" title="${t('select_local_image')}">📁</button>
              </div>
              <input type="file" id="file-bg-image" accept="image/*" style="display: none;">
            </div>
            <div class="setting-row">
              <label>${t('bg_opacity')}</label>
              <input type="range" id="slider-bg-opacity" min="0" max="100" value="50">
              <span class="value" id="val-bg-opacity">50%</span>
            </div>
          </div>
        </div>
        <div class="settings-footer">
          <button id="resetSettings" class="reset-btn">${t('reset')}</button>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', settingsHTML);

    // 3. 绑定事件 (绑定到 wrapper 而不是 button)
    bindEvents(button, wrapper);

    // 4. 加载状态
    loadNightModeState();
  }

  function bindEvents(button, wrapper) {
    const menu = document.getElementById('nightModeMenu');

    // 按钮点击：切换开关
    button.addEventListener('click', (e) => {
      toggleNightMode();
    });

    // 鼠标悬停显示菜单 (绑定在 wrapper 上，这样鼠标从按钮移到菜单时不会触发mouseleave)
    let timeoutId;

    wrapper.addEventListener('mouseenter', () => {
      clearTimeout(timeoutId);
      menu.classList.remove('hidden');
    });

    wrapper.addEventListener('mouseleave', () => {
      timeoutId = setTimeout(() => {
        menu.classList.add('hidden');
      }, 300);
    });

    // 菜单保持显示 (其实 wrapper 包含了菜单，这一步是双重保险)
    menu.addEventListener('mouseenter', () => {
      clearTimeout(timeoutId);
      menu.classList.remove('hidden');
    });

    menu.addEventListener('mouseleave', () => {
      timeoutId = setTimeout(() => {
        menu.classList.add('hidden');
      }, 300);
    });

    // 菜单项点击
    const items = menu.querySelectorAll('.menu-item[data-type]');
    items.forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        const type = item.dataset.type;
        setNightModeType(type);
      });
    });

    // 设置按钮点击
    document.getElementById('openSettings').addEventListener('click', (e) => {
      e.stopPropagation();
      openSettings();
      menu.classList.add('hidden');
    });

    // 设置面板关闭
    document.getElementById('closeSettings').addEventListener('click', closeSettings);

    // 重置按钮
    document.getElementById('resetSettings').addEventListener('click', () => {
      if (currentState.type === 'custom') {
        // 如果是自定义模式，重置回默认 invert 预设
        setNightModeType('invert');
      } else {
        // 否则重置当前预设的值（虽然预设值是固定的，但UI需要同步）
        setNightModeType(currentState.type);
      }
      updateSliders();
    });

    // 滑块事件
    ['invert', 'brightness', 'contrast', 'hue'].forEach(key => {
      const slider = document.getElementById(`slider-${key}`);
      slider.addEventListener('input', (e) => {
        const value = parseInt(e.target.value);
        updateSetting(key, value);
      });
    });

    // 背景图片开关
    const bgCheck = document.getElementById('check-enable-bg');
    bgCheck.addEventListener('change', (e) => {
      updateSetting('enableBackground', e.target.checked);
      // 更新可见性
      const container = document.getElementById('bg-settings-container');
      if (e.target.checked) {
        container.classList.remove('hidden');
      } else {
        container.classList.add('hidden');
      }
    });

    // 背景透明度滑块
    const bgOpacitySlider = document.getElementById('slider-bg-opacity');
    bgOpacitySlider.addEventListener('input', (e) => {
      const value = parseInt(e.target.value);
      // 根据当前模式决定更新哪个变量
      const key = currentState.active ? 'backgroundOpacityDark' : 'backgroundOpacityLight';
      updateSetting(key, value / 100);
      document.getElementById('val-bg-opacity').textContent = value + '%';
    });

    // 背景图片输入事件
    const bgInput = document.getElementById('input-bg-image');
    bgInput.addEventListener('change', (e) => {
      let imagePath = e.target.value.trim();
      
      // 🔧 如果是本地绝对路径，转换为 file:// 协议
      if (imagePath && !imagePath.startsWith('http://') && 
          !imagePath.startsWith('https://') && 
          !imagePath.startsWith('file://') &&
          !imagePath.startsWith('data:') &&
          !imagePath.startsWith('blob:')) {
        
        // 如果是绝对路径（以 / 或盘符开头），添加 file:// 前缀
        if (imagePath.startsWith('/') || /^[a-zA-Z]:/.test(imagePath)) {
          imagePath = 'file://' + imagePath;
          console.log('✅ 已转换本地路径为 file:// 协议:', imagePath);
        }
      }
      
      updateSetting('backgroundImage', imagePath);
    });

    // 📁 文件选择按钮
    const browseBtn = document.getElementById('btn-browse-image');
    const fileInput = document.getElementById('file-bg-image');
    
    browseBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      fileInput.click();
    });
    
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      // 检查是否是图片文件
      if (!file.type.startsWith('image/')) {
        alert(t('alert_need_image'));
        return;
      }
      
      console.log('📁 已选择文件:', file.name, file.type);
      
      // 方法 1: 使用 file:// 协议（本地路径）
      // 注意：Chrome 扩展可能无法直接访问文件系统路径
      // const filePath = 'file://' + file.path; // file.path 在浏览器中不可用
      
      // 方法 2: 使用 FileReader 转换为 Data URL (推荐)
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target.result;
        console.log('✅ 已转换为 Data URL，大小:', Math.round(dataUrl.length / 1024), 'KB');
        
        // 更新输入框和设置
        document.getElementById('input-bg-image').value = file.name; // 显示文件名
        updateSetting('backgroundImage', dataUrl); // 保存 Data URL
        
        // 提示用户
        if (dataUrl.length > 1000000) { // > 1MB
          console.warn('⚠️ 图片较大，可能影响性能');
        }
      };
      reader.onerror = () => {
        alert('❌ 读取文件失败！');
      };
      reader.readAsDataURL(file); // 转换为 Base64 Data URL
    });
  }

  function toggleNightMode() {
    currentState.active = !currentState.active;
    applyState();
    saveState();
    // showNotification(currentState.active ? '🌙 已开启' + getModeName(currentState.type) : '☀️ 已关闭夜间模式');
  }

  function setNightModeType(type) {
    currentState.active = true;
    currentState.type = type;

    if (PRESETS[type]) {
      // 保留全局设置
      const currentBgImage = currentState.settings.backgroundImage;
      const currentBgOpacityLight = currentState.settings.backgroundOpacityLight;
      const currentBgOpacityDark = currentState.settings.backgroundOpacityDark;
      const currentEnableBg = currentState.settings.enableBackground;

      currentState.settings = { ...PRESETS[type] };

      // 恢复全局设置
      currentState.settings.backgroundImage = currentBgImage;
      currentState.settings.backgroundOpacityLight = currentBgOpacityLight !== undefined ? currentBgOpacityLight : 0.8;
      currentState.settings.backgroundOpacityDark = currentBgOpacityDark !== undefined ? currentBgOpacityDark : 0.4;
      currentState.settings.enableBackground = currentEnableBg !== undefined ? currentEnableBg : false;
    }

    applyState();
    saveState();
    updateSliders();
    // showNotification('已切换至 ' + getModeName(type));
  }

  function updateSetting(key, value) {
    // 一旦手动调整，切换到自定义模式
    const backgroundKeys = ['backgroundImage', 'backgroundOpacityLight', 'backgroundOpacityDark', 'enableBackground'];
    if (!backgroundKeys.includes(key)) {
      if (currentState.type !== 'custom') {
        currentState.type = 'custom';
        // 更新UI显示 custom 被选中
        document.querySelectorAll('.menu-check').forEach(el => el.style.opacity = '0');
      }
    }

    currentState.settings[key] = value;
    if (!backgroundKeys.includes(key)) {
      document.getElementById(`val-${key}`).textContent = key === 'hue' ? `${value}°` : `${value}%`;
    }

    if (!currentState.active && !backgroundKeys.includes(key)) {
      currentState.active = true; // 调整非背景设置时自动开启夜间模式
    }

    applyState();
    saveState();
  }

  function openSettings() {
    const panel = document.getElementById('nightModeSettings');
    panel.classList.remove('hidden');
    updateSliders();
  }

  function closeSettings() {
    document.getElementById('nightModeSettings').classList.add('hidden');
  }

  function updateSliders() {
    const s = currentState.settings;
    document.getElementById('slider-invert').value = s.invert;
    document.getElementById('val-invert').textContent = s.invert + '%';

    document.getElementById('slider-brightness').value = s.brightness;
    document.getElementById('val-brightness').textContent = s.brightness + '%';

    document.getElementById('slider-contrast').value = s.contrast;
    document.getElementById('val-contrast').textContent = s.contrast + '%';

    document.getElementById('slider-hue').value = s.hue;
    document.getElementById('val-hue').textContent = s.hue + '°';

    // 背景开关及显示状态
    const enableBg = s.enableBackground || false;
    document.getElementById('check-enable-bg').checked = enableBg;
    const bgContainer = document.getElementById('bg-settings-container');
    if (enableBg) {
      bgContainer.classList.remove('hidden');
    } else {
      bgContainer.classList.add('hidden');
    }

    document.getElementById('input-bg-image').value = s.backgroundImage ? 
      (s.backgroundImage.startsWith('file://') ? s.backgroundImage.substring(7) : s.backgroundImage) : '';

    // 背景透明度滑块
    const bgOpacity = currentState.active
      ? (s.backgroundOpacityDark !== undefined ? s.backgroundOpacityDark : 0.4)
      : (s.backgroundOpacityLight !== undefined ? s.backgroundOpacityLight : 0.8);

    document.getElementById('slider-bg-opacity').value = bgOpacity * 100;
    document.getElementById('val-bg-opacity').textContent = Math.round(bgOpacity * 100) + '%';
  }

  function applyState() {
    const body = document.body;
    const button = document.getElementById('customNightModeButton');
    const root = document.documentElement;
    const s = currentState.settings;

    // 清除固定类，改用 CSS 变量
    body.classList.remove('night-mode-invert', 'night-mode-dim');

    // === 1. 处理背景图片 (全局生效，独立于夜间模式) ===
    if (s.enableBackground && s.backgroundImage) {
      body.classList.add('has-custom-background');
      root.style.setProperty('--pdf-background-image', `url('${s.backgroundImage}')`);

      const opacity = currentState.active
        ? (s.backgroundOpacityDark !== undefined ? s.backgroundOpacityDark : 0.4)
        : (s.backgroundOpacityLight !== undefined ? s.backgroundOpacityLight : 0.8);

      root.style.setProperty('--pdf-background-overlay-opacity', 1 - opacity);
    } else {
      body.classList.remove('has-custom-background');
      root.style.removeProperty('--pdf-background-image');
      root.style.removeProperty('--pdf-background-overlay-opacity');
    }

    // === 2. 处理夜间模式 ===
    if (currentState.active) {
      body.classList.add('custom-night-mode');

      // 设置 CSS 变量 (只针对滤镜等)
      root.style.setProperty('--pdf-invert', s.invert / 100);
      root.style.setProperty('--pdf-brightness', s.brightness / 100);
      root.style.setProperty('--pdf-contrast', s.contrast / 100);
      root.style.setProperty('--pdf-hue', s.hue + 'deg');

      button.innerHTML = sunIconSVG;
      button.title = '关闭夜间模式';
    } else {
      body.classList.remove('custom-night-mode');
      // 清除 CSS 变量
      root.style.removeProperty('--pdf-invert');
      root.style.removeProperty('--pdf-brightness');
      root.style.removeProperty('--pdf-contrast');
      root.style.removeProperty('--pdf-hue');

      button.innerHTML = moonIconSVG;
      button.title = '开启夜间模式';
    }

    // 更新菜单选中状态
    document.querySelectorAll('.menu-check').forEach(el => el.style.opacity = '0');
    if (currentState.type !== 'custom') {
      const activeCheck = document.getElementById(`check-${currentState.type}`);
      if (activeCheck) activeCheck.style.opacity = '1';
    }
  }

  function saveState() {
    chrome.storage.local.set({ nightModeState: currentState });
  }

  function loadNightModeState() {
    chrome.storage.local.get(['nightModeState', 'nightMode'], (result) => {
      // 迁移旧数据
      if (result.nightMode !== undefined && !result.nightModeState) {
        currentState = { ...DEFAULT_STATE, active: result.nightMode };
        // 如果是旧数据，默认用高对比度预设
        currentState.settings = { ...PRESETS.invert };
        saveState();
        chrome.storage.local.remove('nightMode');
      } else if (result.nightModeState) {
        currentState = result.nightModeState;
        // 确保 settings 存在（防止旧版本数据结构问题）
        if (!currentState.settings) {
          currentState.settings = { ...PRESETS.invert };
        }
        // 确保 backgroundImage 存在 (防止旧版本无此字段)
        if (currentState.settings.backgroundImage === undefined) {
          currentState.settings.backgroundImage = DEFAULT_STATE.settings.backgroundImage;
        }
        
        // 🔧 确保本地路径使用 file:// 协议
        if (currentState.settings.backgroundImage) {
          const imgPath = currentState.settings.backgroundImage;
          if (!imgPath.startsWith('http://') && 
              !imgPath.startsWith('https://') && 
              !imgPath.startsWith('file://') &&
              !imgPath.startsWith('data:') &&
              !imgPath.startsWith('blob:') &&
              (imgPath.startsWith('/') || /^[a-zA-Z]:/.test(imgPath))) {
            currentState.settings.backgroundImage = 'file://' + imgPath;
            console.log('✅ 已自动转换历史背景图路径为 file:// 协议');
            saveState(); // 保存修正后的路径
          }
        }
        // 确保 backgroundOpacity 存在 (兼容旧版本)
        if (currentState.settings.backgroundOpacityLight === undefined) {
          // 如果旧版有 backgroundOpacity，尝试迁移，否则用默认
          currentState.settings.backgroundOpacityLight = currentState.settings.backgroundOpacity !== undefined ? currentState.settings.backgroundOpacity : 0.8;
        }
        if (currentState.settings.backgroundOpacityDark === undefined) {
          currentState.settings.backgroundOpacityDark = currentState.settings.backgroundOpacity !== undefined ? currentState.settings.backgroundOpacity : 0.4;
        }
        if (currentState.settings.enableBackground === undefined) {
          currentState.settings.enableBackground = false;
        }
        // 清理旧字段
        delete currentState.settings.backgroundOpacity;
      }
      applyState();
    });
  }

  function getModeName(type) {
    if (type === 'invert') return '高对比度';
    if (type === 'dim') return '护眼模式';
    return '自定义模式';
  }

  function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'custom-notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => {
      notification.classList.add('fade-out');
      setTimeout(() => notification.remove(), 300);
    }, 2000);
  }
})();
