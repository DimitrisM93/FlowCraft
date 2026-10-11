/**
 * PWA Service Worker Registration & Installation Prompt Manager
 */

let deferredPrompt = null;

export function initPWA() {
  // Register Service Worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((reg) => {
          console.log('[PWA] ServiceWorker registered with scope:', reg.scope);
        })
        .catch((err) => {
          console.warn('[PWA] ServiceWorker registration failed:', err);
        });
    });
  }

  // Setup Install Prompt listener
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    const installBtn = document.getElementById('pwa-install-btn');
    if (installBtn) {
      installBtn.style.display = 'inline-flex';
    }
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    const installBtn = document.getElementById('pwa-install-btn');
    if (installBtn) {
      installBtn.style.display = 'none';
    }
    showToast('🎉 FlowCraft PWA installed successfully!');
  });

  // Offline / Online listeners
  window.addEventListener('online', () => {
    updateOnlineStatus(true);
    showToast('🌐 Connection restored. Online mode active.');
  });

  window.addEventListener('offline', () => {
    updateOnlineStatus(false);
    showToast('⚡ Offline mode active. Cached data available.');
  });
}

export function promptInstall() {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('[PWA] User accepted the install prompt');
      }
      deferredPrompt = null;
    });
  } else {
    showToast('ℹ️ To install: Use browser menu "Add to Home screen" or "Install App".');
  }
}

function updateOnlineStatus(isOnline) {
  const banner = document.getElementById('offline-banner');
  if (banner) {
    if (isOnline) {
      banner.classList.remove('visible');
    } else {
      banner.classList.add('visible');
    }
  }
}

export function showToast(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <span>${message}</span>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
