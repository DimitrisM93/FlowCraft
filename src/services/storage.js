import { INITIAL_REQUESTS } from '../data/mockRequests.js';
import { DEFAULT_TEMPLATES } from '../data/defaultTemplates.js';
import { ROLES, getRoleById } from '../data/roles.js';

const STORAGE_KEYS = {
  REQUESTS: 'flowcraft_requests_v1',
  TEMPLATES: 'flowcraft_templates_v1',
  CURRENT_ROLE: 'flowcraft_current_role_v1',
  THEME: 'flowcraft_theme_v1'
};

const listeners = new Set();

function notifyListeners() {
  listeners.forEach(cb => {
    try { cb(); } catch (e) { console.error(e); }
  });
}

export const Storage = {
  subscribe(callback) {
    listeners.add(callback);
    return () => listeners.delete(callback);
  },

  init() {
    if (!localStorage.getItem(STORAGE_KEYS.REQUESTS)) {
      localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(INITIAL_REQUESTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.TEMPLATES)) {
      localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(DEFAULT_TEMPLATES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CURRENT_ROLE)) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_ROLE, 'requester');
    }
    if (!localStorage.getItem(STORAGE_KEYS.THEME)) {
      localStorage.setItem(STORAGE_KEYS.THEME, 'dark');
    }
  },

  getRequests() {
    this.init();
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.REQUESTS)) || [];
    } catch {
      return INITIAL_REQUESTS;
    }
  },

  getRequestById(id) {
    const list = this.getRequests();
    return list.find(r => r.id === id) || null;
  },

  saveRequest(newOrUpdated) {
    const list = this.getRequests();
    const idx = list.findIndex(r => r.id === newOrUpdated.id);
    if (idx >= 0) {
      list[idx] = newOrUpdated;
    } else {
      list.unshift(newOrUpdated);
    }
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(list));
    notifyListeners();
    return newOrUpdated;
  },

  getTemplates() {
    this.init();
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.TEMPLATES)) || [];
    } catch {
      return DEFAULT_TEMPLATES;
    }
  },

  getTemplateById(id) {
    const templates = this.getTemplates();
    return templates.find(t => t.id === id) || DEFAULT_TEMPLATES[0];
  },

  saveCustomTemplate(template) {
    const templates = this.getTemplates();
    const idx = templates.findIndex(t => t.id === template.id);
    if (idx >= 0) {
      templates[idx] = template;
    } else {
      templates.push(template);
    }
    localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(templates));
    notifyListeners();
    return template;
  },

  getCurrentRole() {
    this.init();
    const roleId = localStorage.getItem(STORAGE_KEYS.CURRENT_ROLE) || 'requester';
    return getRoleById(roleId);
  },

  setCurrentRole(roleId) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_ROLE, roleId);
    notifyListeners();
  },

  getTheme() {
    this.init();
    return localStorage.getItem(STORAGE_KEYS.THEME) || 'dark';
  },

  setTheme(theme) {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
    document.documentElement.setAttribute('data-theme', theme);
    notifyListeners();
  },

  resetAllData() {
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(INITIAL_REQUESTS));
    localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(DEFAULT_TEMPLATES));
    localStorage.setItem(STORAGE_KEYS.CURRENT_ROLE, 'requester');
    notifyListeners();
  }
};
