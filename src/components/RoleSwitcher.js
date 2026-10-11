import { ROLES } from '../data/roles.js';
import { Storage } from '../services/storage.js';

export function getPendingCountsForRoles() {
  const requests = Storage.getRequests();
  const counts = {
    requester: 0,
    manager: 0,
    finance: 0,
    ceo: 0
  };

  requests.forEach(req => {
    if (req.status === 'revision_requested' || req.status === 'draft') {
      counts.requester++;
    } else if (req.status === 'pending_stage_2' && req.currentStageNumber === 2) {
      counts.manager++;
    } else if (req.status === 'pending_stage_3' && req.currentStageNumber === 3) {
      counts.finance++;
    } else if (req.status === 'pending_stage_4' && req.currentStageNumber === 4) {
      counts.ceo++;
    }
  });

  return counts;
}

export function renderRoleSwitcher(containerId, onRoleChanged) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const currentRole = Storage.getCurrentRole();
  const counts = getPendingCountsForRoles();

  container.innerHTML = `
    <span class="role-switcher-label">Simulate Role:</span>
    ${ROLES.map(role => {
      const isActive = role.id === currentRole.id;
      const count = counts[role.id] || 0;
      return `
        <button 
          type="button" 
          class="role-btn ${isActive ? 'active' : ''}" 
          data-role-id="${role.id}"
          title="${role.name} (${role.title})"
        >
          <span class="role-avatar" style="background:${role.color};">${role.avatar}</span>
          <span class="role-name-text">${role.name.split(' ')[0]}</span>
          ${count > 0 ? `<span class="role-pending-badge">${count}</span>` : ''}
        </button>
      `;
    }).join('')}
  `;

  container.querySelectorAll('.role-btn').forEach(btn => {
    btn.onclick = () => {
      const roleId = btn.getAttribute('data-role-id');
      if (roleId !== currentRole.id) {
        Storage.setCurrentRole(roleId);
        if (onRoleChanged) onRoleChanged(roleId);
      }
    };
  });
}
