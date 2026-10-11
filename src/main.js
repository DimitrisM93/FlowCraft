import './style.css';
import { Storage } from './services/storage.js';
import { renderRoleSwitcher } from './components/RoleSwitcher.js';
import { renderDashboard } from './components/Dashboard.js';
import { renderRequestDetail } from './components/RequestDetail.js';
import { initPWA, promptInstall, showToast } from './pwa.js';

// Application State
let currentView = 'dashboard'; // 'dashboard' or 'detail'
let selectedRequestId = null;

function initApp() {
  Storage.init();

  // Apply stored theme
  const theme = Storage.getTheme();
  document.documentElement.setAttribute('data-theme', theme);

  // Initialize PWA
  initPWA();

  // Render Shell
  const app = document.getElementById('app');
  app.innerHTML = `
    <!-- Offline status notification -->
    <div id="offline-banner" class="offline-banner">
      ⚡ Offline Mode Active — Cached workflows and requests are available.
    </div>

    <!-- Application Top Bar -->
    <header class="app-header">
      <div class="brand-wrapper" id="brand-home-btn" title="FlowCraft Home">
        <img src="/flowcraft-logo.png" alt="FlowCraft Logo" class="brand-logo" />
        <div class="brand-text">
          <span class="brand-title">FlowCraft</span>
          <span class="brand-badge">Enterprise Approval PWA</span>
        </div>
      </div>

      <!-- Live Role Simulation Switcher Dock -->
      <div class="role-switcher-container" id="role-switcher-dock"></div>

      <!-- Action Tools (Theme, Install, Reset) -->
      <div class="header-actions">
        <button type="button" class="pwa-install-btn" id="pwa-install-btn" title="Install FlowCraft as Desktop/Mobile PWA">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
          <span>Install PWA</span>
        </button>

        <button type="button" class="icon-btn" id="theme-toggle-btn" title="Toggle Dark/Light Theme">
          ${theme === 'light' ? '🌙' : '☀️'}
        </button>

        <button type="button" class="icon-btn" id="reset-data-btn" title="Reset Demo Data">
          🔄
        </button>
      </div>
    </header>

    <!-- Main Dynamic Content Container -->
    <main class="app-main" id="main-content-view"></main>
  `;

  // Bind Shell Actions
  document.getElementById('brand-home-btn').onclick = () => {
    navigateTo('dashboard');
  };

  document.getElementById('theme-toggle-btn').onclick = () => {
    const nextTheme = Storage.getTheme() === 'light' ? 'dark' : 'light';
    Storage.setTheme(nextTheme);
    document.getElementById('theme-toggle-btn').textContent = nextTheme === 'light' ? '🌙' : '☀️';
    showToast(`Switched to ${nextTheme} theme`);
  };

  document.getElementById('pwa-install-btn').onclick = () => {
    promptInstall();
  };

  document.getElementById('reset-data-btn').onclick = () => {
    if (confirm('Reset all demo approval requests and templates to factory defaults?')) {
      Storage.resetAllData();
      showToast('Demo records reset to default sample workflows.');
      renderCurrentView();
    }
  };

  // Render Role Switcher
  renderHeaderRoleSwitcher();

  // Listen to Storage changes (e.g. role switch, data save)
  Storage.subscribe(() => {
    renderHeaderRoleSwitcher();
    renderCurrentView();
  });

  // Handle URL hash navigation if present
  window.addEventListener('hashchange', handleHashChange);
  handleHashChange();
}

function renderHeaderRoleSwitcher() {
  renderRoleSwitcher('role-switcher-dock', (newRoleId) => {
    const role = Storage.getCurrentRole();
    showToast(`Switched active persona to <strong>${role.name}</strong> (${role.title})`);
    renderCurrentView();
  });
}

function handleHashChange() {
  const hash = window.location.hash;
  if (hash.startsWith('#req-')) {
    const reqId = hash.replace('#req-', '');
    navigateTo('detail', reqId);
  } else {
    navigateTo('dashboard');
  }
}

function navigateTo(view, reqId = null) {
  currentView = view;
  selectedRequestId = reqId;
  if (view === 'detail' && reqId) {
    window.location.hash = `req-${reqId}`;
  } else {
    window.location.hash = '';
  }
  renderCurrentView();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderCurrentView() {
  const containerId = 'main-content-view';
  if (currentView === 'detail' && selectedRequestId) {
    renderRequestDetail(containerId, selectedRequestId, () => {
      navigateTo('dashboard');
    });
  } else {
    renderDashboard(containerId, (reqId) => {
      navigateTo('detail', reqId);
    });
  }
}

// Start Application
initApp();
