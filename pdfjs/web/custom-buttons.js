// 夜间模式功能
(function () {
  'use strict';

  // 图标 SVG
  const sunIconSVG = `<svg class="night-mode-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M12,7c-2.76,0-5,2.24-5,5s2.24,5,5,5s5-2.24,5-5S14.76,7,12,7L12,7z M2,13l2,0c0.55,0,1-0.45,1-1s-0.45-1-1-1l-2,0 c-0.55,0-1,0.45-1,1S1.45,13,2,13z M20,13l2,0c0.55,0,1-0.45,1-1s-0.45-1-1-1l-2,0c-0.55,0-1,0.45-1,1S19.45,13,20,13z M11,2v2 c0,0.55,0.45,1,1,1s1-0.45,1-1V2c0-0.55-0.45-1-1-1S11,1.45,11,2z M11,20v2c0,0.55,0.45,1,1,1s1-0.45,1-1v-2c0-0.55-0.45-1-1-1 C11.45,19,11,19.45,11,20z M5.99,4.58c-0.39-0.39-1.03-0.39-1.41,0c-0.39,0.39-0.39,1.03,0,1.41l1.06,1.06 c0.39,0.39,1.03,0.39,1.41,0s0.39-1.03,0-1.41L5.99,4.58z M18.36,16.95c-0.39-0.39-1.03-0.39-1.41,0c-0.39,0.39-0.39,1.03,0,1.41 l1.06,1.06c0.39,0.39,1.03,0.39,1.41,0c0.39-0.39,0.39-1.03,0-1.41L18.36,16.95z M19.42,5.99c0.39-0.39,0.39-1.03,0-1.41 c-0.39-0.39-1.03-0.39-1.41,0l-1.06,1.06c-0.39,0.39-0.39,1.03,0,1.41s1.03,0.39,1.41,0L19.42,5.99z M7.05,18.36 c0.39-0.39,0.39-1.03,0-1.41c-0.39-0.39-1.03-0.39-1.41,0l-1.06,1.06c-0.39,0.39-0.39,1.03,0,1.41s1.03,0.39,1.41,0L7.05,18.36z"/></svg>`;

  const moonIconSVG = `<svg class="night-mode-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 57 60"><path fill="currentColor" d="M16.6526953,0.0677862861 L16.5088029,0.102819445 C5.31465091,2.87424012 -1.79617386,13.9971537 0.396615042,25.394079 L0.593785487,26.4188638 C2.86209998,38.20833 14.2168197,45.8968587 25.9552619,43.5916732 C32.2673245,42.3521156 37.5983879,38.4173929 40.6995119,32.8959767 C41.6746443,31.1597957 40.1274421,29.0935345 38.1983112,29.5556675 C37.9665023,29.6111984 37.7330425,29.6620637 37.4980143,29.7082183 C28.2243974,31.5293635 19.2539293,25.4552637 17.461913,16.1413367 L17.2647426,15.1165519 L17.2113448,14.8263832 C16.5145013,10.8701018 17.2227741,6.85861994 19.162003,3.40620011 C20.13918,1.6665265 18.5840507,-0.40243658 16.6526953,0.0677862861 Z" transform="translate(8 8)"/></svg>`;

  // 默认状态
  const DEFAULT_STATE = {
    active: false,
    type: 'invert' // 'invert' (高对比/反色) or 'dim' (护眼/变暗)
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNightMode);
  } else {
    initNightMode();
  }

  function initNightMode() {
    console.log('初始化夜间模式...');
    const button = document.getElementById('customNightModeButton');
    if (!button) return;

    // 1. 注入菜单 HTML
    const menuHTML = `
      <div id="nightModeMenu" class="night-mode-menu hidden">
        <div class="menu-item" data-type="invert">
          <span class="menu-icon">◑</span>
          <span class="menu-text">高对比度</span>
          <span class="menu-check" id="check-invert">✓</span>
        </div>
        <div class="menu-item" data-type="dim">
          <span class="menu-icon">👁️</span>
          <span class="menu-text">护眼模式</span>
          <span class="menu-check" id="check-dim">✓</span>
        </div>
      </div>
    `;
    button.insertAdjacentHTML('beforeend', menuHTML);

    // 2. 绑定事件
    const menu = document.getElementById('nightModeMenu');

    // 按钮点击：切换开关
    button.addEventListener('click', (e) => {
      // 如果点击的是菜单项，由菜单项逻辑处理
      if (e.target.closest('.menu-item')) return;
      toggleNightMode();
    });

    // 鼠标悬停显示菜单
    let timeoutId;
    button.addEventListener('mouseenter', () => {
      clearTimeout(timeoutId);
      menu.classList.remove('hidden');
    });

    button.addEventListener('mouseleave', () => {
      timeoutId = setTimeout(() => {
        menu.classList.add('hidden');
      }, 300);
    });

    // 菜单保持显示
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
    const items = menu.querySelectorAll('.menu-item');
    items.forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation(); // 阻止冒泡触发按钮点击
        const type = item.dataset.type;
        setNightModeType(type);
      });
    });

    // 3. 加载状态
    loadNightModeState();
  }

  function toggleNightMode() {
    chrome.storage.local.get(['nightModeState'], (result) => {
      const state = result.nightModeState || DEFAULT_STATE;
      const newState = { ...state, active: !state.active };
      applyState(newState);
      saveState(newState);
      showNotification(newState.active ? '🌙 已开启' + getModeName(newState.type) : '☀️ 已关闭夜间模式');
    });
  }

  function setNightModeType(type) {
    const newState = { active: true, type: type };
    applyState(newState);
    saveState(newState);
    showNotification('已切换至 ' + getModeName(type));
    // 关闭菜单
    document.getElementById('nightModeMenu').classList.add('hidden');
  }

  function applyState(state) {
    const body = document.body;
    const button = document.getElementById('customNightModeButton');

    // 清除所有模式类
    body.classList.remove('custom-night-mode', 'night-mode-invert', 'night-mode-dim');

    if (state.active) {
      body.classList.add('custom-night-mode');
      body.classList.add(`night-mode-${state.type}`);

      // 更新按钮图标（激活状态显示太阳，表示点击关闭）
      button.innerHTML = sunIconSVG + document.getElementById('nightModeMenu').outerHTML;
      button.title = '关闭夜间模式';
    } else {
      // 关机状态显示月亮
      button.innerHTML = moonIconSVG + document.getElementById('nightModeMenu').outerHTML;
      button.title = '开启夜间模式';
    }

    // 更新菜单选中状态
    document.querySelectorAll('.menu-check').forEach(el => el.style.opacity = '0');
    const activeCheck = document.getElementById(`check-${state.type}`);
    if (activeCheck) activeCheck.style.opacity = '1';
  }

  function saveState(state) {
    chrome.storage.local.set({ nightModeState: state });
  }

  function loadNightModeState() {
    chrome.storage.local.get(['nightModeState', 'nightMode'], (result) => {
      // 迁移旧数据
      if (result.nightMode !== undefined && !result.nightModeState) {
        const migratedState = {
          active: result.nightMode,
          type: 'invert'
        };
        saveState(migratedState);
        applyState(migratedState);
        chrome.storage.local.remove('nightMode'); // 清理旧键
      } else {
        applyState(result.nightModeState || DEFAULT_STATE);
      }
    });
  }

  function getModeName(type) {
    return type === 'invert' ? '高对比度' : '护眼模式';
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
