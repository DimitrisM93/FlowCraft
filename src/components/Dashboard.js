import { Storage } from '../services/storage.js';
import { ROLES, getRoleByStageNumber } from '../data/roles.js';
import { openNewRequestModal } from './NewRequestModal.js';
import { openCustomWorkflowBuilderModal } from './CustomWorkflowBuilderModal.js';

export function renderDashboard(containerId, onSelectRequest) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const currentRole = Storage.getCurrentRole();
  const allRequests = Storage.getRequests();

  let activeTab = 'pending_me'; // 'pending_me', 'all', 'mine', 'approved', 'revisions'
  let searchQuery = '';

  function renderView() {
    // Filter requests
    const filtered = allRequests.filter(req => {
      // Search filter
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matches = 
          req.id.toLowerCase().includes(q) ||
          req.title.toLowerCase().includes(q) ||
          req.requester.name.toLowerCase().includes(q) ||
          (req.amount && req.amount.toLowerCase().includes(q));
        if (!matches) return false;
      }

      // Tab filter
      if (activeTab === 'pending_me') {
        if (currentRole.id === 'requester') {
          return req.status === 'revision_requested' || req.status === 'draft';
        }
        return req.currentStageNumber === currentRole.stageNumber && 
               req.status === `pending_stage_${currentRole.stageNumber}`;
      } else if (activeTab === 'mine') {
        return req.requester.id === currentRole.id;
      } else if (activeTab === 'approved') {
        return req.status === 'approved';
      } else if (activeTab === 'revisions') {
        return req.status === 'revision_requested' || req.status === 'rejected';
      }
      return true; // 'all'
    });

    // Calculate metrics
    const pendingMyCount = allRequests.filter(req => {
      if (currentRole.id === 'requester') return req.status === 'revision_requested' || req.status === 'draft';
      return req.currentStageNumber === currentRole.stageNumber && req.status === `pending_stage_${currentRole.stageNumber}`;
    }).length;

    const inFlightCount = allRequests.filter(req => req.status.startsWith('pending_stage_')).length;
    const approvedCount = allRequests.filter(req => req.status === 'approved').length;
    const rejectedCount = allRequests.filter(req => req.status === 'rejected' || req.status === 'revision_requested').length;

    container.innerHTML = `
      <div>
        <!-- Active Persona Banner -->
        <div class="active-role-banner">
          <div class="banner-left">
            <div class="banner-avatar-lg" style="background:${currentRole.color};">${currentRole.avatar}</div>
            <div class="banner-info">
              <h2>Welcome back, ${currentRole.name}</h2>
              <p>Active Persona: <strong>${currentRole.title}</strong> (${currentRole.department}) • Stage ${currentRole.stageNumber}</p>
            </div>
          </div>
          <div class="banner-actions">
            <button type="button" class="btn btn-secondary" id="dash-designer-btn">
              ⚙️ Custom Workflow Designer
            </button>
            <button type="button" class="btn btn-primary" id="dash-new-btn">
              + New Approval Request
            </button>
          </div>
        </div>

        <!-- Key Metrics Cards -->
        <div class="stats-grid">
          <div class="stat-card" style="${pendingMyCount > 0 ? 'border-color:rgba(245, 158, 11, 0.4);background:rgba(245, 158, 11, 0.05);' : ''}">
            <div class="stat-icon" style="background:rgba(245, 158, 11, 0.15);color:#f59e0b;">⏳</div>
            <div class="stat-content">
              <span class="stat-value" style="color:#f59e0b;">${pendingMyCount}</span>
              <span class="stat-label">Action Items Awaiting You</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon" style="background:rgba(99, 102, 241, 0.15);color:#6366f1;">🔄</div>
            <div class="stat-content">
              <span class="stat-value">${inFlightCount}</span>
              <span class="stat-label">In-Flight Approval Chains</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon" style="background:rgba(16, 185, 129, 0.15);color:#10b981;">✓</div>
            <div class="stat-content">
              <span class="stat-value" style="color:#10b981;">${approvedCount}</span>
              <span class="stat-label">Final CEO Approvals</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon" style="background:rgba(56, 189, 248, 0.15);color:#38bdf8;">⚡</div>
            <div class="stat-content">
              <span class="stat-value">1.4 Days</span>
              <span class="stat-label">Avg Chain Turnaround</span>
            </div>
          </div>
        </div>

        <!-- Controls & Filter Tabs -->
        <div class="control-bar">
          <div class="tabs-group">
            <button type="button" class="tab-btn ${activeTab === 'pending_me' ? 'active' : ''}" data-tab="pending_me">
              Pending My Action
              <span class="tab-count">${pendingMyCount}</span>
            </button>
            <button type="button" class="tab-btn ${activeTab === 'all' ? 'active' : ''}" data-tab="all">
              All Requests
              <span class="tab-count">${allRequests.length}</span>
            </button>
            <button type="button" class="tab-btn ${activeTab === 'mine' ? 'active' : ''}" data-tab="mine">
              My Submissions
            </button>
            <button type="button" class="tab-btn ${activeTab === 'approved' ? 'active' : ''}" data-tab="approved">
              Approved (${approvedCount})
            </button>
            <button type="button" class="tab-btn ${activeTab === 'revisions' ? 'active' : ''}" data-tab="revisions">
              Revisions / Rejected (${rejectedCount})
            </button>
          </div>

          <div class="filter-actions">
            <div class="search-input-wrapper">
              <span class="search-icon">🔍</span>
              <input type="text" class="search-input" id="dash-search-input" placeholder="Search by title, ID, requester..." value="${escapeHtml(searchQuery)}" />
            </div>
          </div>
        </div>

        <!-- Requests Grid -->
        <div class="request-grid">
          ${filtered.length === 0 ? `
            <div style="text-align:center;padding:3.5rem 1rem;background:var(--bg-card);border:1px dashed var(--border-medium);border-radius:var(--radius-lg);">
              <div style="font-size:2.5rem;margin-bottom:0.75rem;">📭</div>
              <h3 style="font-size:1.1rem;margin-bottom:0.25rem;">No requests match this view</h3>
              <p style="font-size:0.85rem;color:var(--text-muted);margin-bottom:1.25rem;">
                ${activeTab === 'pending_me' 
                  ? 'You have completed all pending approvals assigned to your role! Switch roles in the top bar to test other stages.' 
                  : 'Try adjusting your search terms or create a new approval request.'}
              </p>
              <button type="button" class="btn btn-primary" id="empty-new-btn">+ Initiate New Request</button>
            </div>
          ` : filtered.map(req => {
            const template = Storage.getTemplateById(req.templateId);
            const isWaitingOnMe = !req.status.startsWith('app') && 
              ((currentRole.id === 'requester' && (req.status === 'revision_requested' || req.status === 'draft')) ||
               (req.currentStageNumber === currentRole.stageNumber && req.status === `pending_stage_${currentRole.stageNumber}`));

            return `
              <div class="request-card ${req.urgency?.includes('Critical') ? 'urgent' : ''}" data-req-id="${req.id}">
                <div class="card-header-row">
                  <div class="card-title-group">
                    <div class="card-meta-line" style="margin-bottom:0.25rem;">
                      <span class="card-id">${req.id}</span>
                      <span>${template.icon || '📋'} ${template.title}</span>
                      <span>•</span>
                      <span>${new Date(req.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                    </div>
                    <h3>${escapeHtml(req.title)}</h3>
                  </div>
                  <div>
                    <span class="status-badge ${getStatusBadgeClass(req.status)}">
                      ${formatStatusLabel(req.status)}
                    </span>
                  </div>
                </div>

                <!-- Mini Progress Stepper -->
                <div class="card-stepper">
                  ${(template.stages || []).map((stage, idx) => {
                    const num = stage.stageNumber;
                    const stageInfo = req.stageData[num] || {};
                    const isCompleted = req.status === 'approved' || Boolean(stageInfo.completed);
                    const isActive = req.status !== 'approved' && req.status !== 'rejected' && num === req.currentStageNumber;
                    const role = getRoleByStageNumber(num);

                    return `
                      <div class="mini-step ${isCompleted ? 'completed' : (isActive ? 'active' : '')}" title="Stage ${num}: ${role.name}">
                        <div class="mini-step-dot">${isCompleted ? '✓' : num}</div>
                        <span style="font-size:0.7rem;font-weight:600;white-space:nowrap;">${role.name.split(' ')[0]}</span>
                      </div>
                      ${idx < template.stages.length - 1 ? '<div class="mini-step-divider"></div>' : ''}
                    `;
                  }).join('')}
                </div>

                <!-- Footer Row -->
                <div class="card-footer-row">
                  <div class="card-author-info">
                    <span class="role-avatar" style="background:#3b82f6;width:22px;height:22px;font-size:0.65rem;">
                      ${req.requester.name.split(' ').map(n => n[0]).join('')}
                    </span>
                    <span>Requested by <strong>${escapeHtml(req.requester.name)}</strong></span>
                  </div>
                  <div style="display:flex;align-items:center;gap:1rem;">
                    ${req.amount ? `<span class="card-amount-tag">${req.amount}</span>` : ''}
                    <button type="button" class="btn ${isWaitingOnMe ? 'btn-primary' : 'btn-secondary'}" style="padding:0.35rem 0.85rem;font-size:0.8rem;">
                      ${isWaitingOnMe ? '✍️ Review & Sign' : 'Inspect Details'}
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </button>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    bindEvents();
  }

  function bindEvents() {
    // New Request & Builder Modals
    const newBtn = container.querySelector('#dash-new-btn');
    const emptyNewBtn = container.querySelector('#empty-new-btn');
    const designerBtn = container.querySelector('#dash-designer-btn');

    if (newBtn) {
      newBtn.onclick = () => {
        openNewRequestModal((created) => {
          onSelectRequest(created.id);
        });
      };
    }
    if (emptyNewBtn) {
      emptyNewBtn.onclick = () => {
        openNewRequestModal((created) => {
          onSelectRequest(created.id);
        });
      };
    }
    if (designerBtn) {
      designerBtn.onclick = () => {
        openCustomWorkflowBuilderModal(() => {
          renderView();
        });
      };
    }

    // Tabs
    container.querySelectorAll('.tab-btn').forEach(btn => {
      btn.onclick = () => {
        activeTab = btn.getAttribute('data-tab');
        renderView();
      };
    });

    // Search
    const searchInput = container.querySelector('#dash-search-input');
    if (searchInput) {
      searchInput.oninput = (e) => {
        searchQuery = e.target.value;
        renderView();
      };
    }

    // Card click
    container.querySelectorAll('.request-card').forEach(card => {
      card.onclick = () => {
        const reqId = card.getAttribute('data-req-id');
        onSelectRequest(reqId);
      };
    });
  }

  renderView();
}

function getStatusBadgeClass(status) {
  if (status === 'approved') return 'approved';
  if (status === 'rejected') return 'rejected';
  if (status === 'revision_requested') return 'revision';
  return 'pending';
}

function formatStatusLabel(status) {
  switch (status) {
    case 'approved': return '✓ Fully Approved by CEO';
    case 'rejected': return '✕ Rejection Finalized';
    case 'revision_requested': return '↺ Revisions Requested';
    case 'pending_stage_2': return '⏳ Pending Stage 2 (Operations)';
    case 'pending_stage_3': return '⏳ Pending Stage 3 (CFO / Finance)';
    case 'pending_stage_4': return '👑 Pending Stage 4 (CEO)';
    default: return 'Draft';
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
}
