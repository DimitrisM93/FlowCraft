import { getRoleByStageNumber } from '../data/roles.js';

export function renderWorkflowStepper(stages, currentStageNumber, status, stageData = {}) {
  const isApproved = status === 'approved';
  const isRejected = status === 'rejected';

  return `
    <div class="workflow-stepper-box">
      <div class="stepper-header">
        <h3>Sequential Approval Chain</h3>
        <span class="status-badge ${getStatusBadgeClass(status)}">
          ${formatStatusText(status)}
        </span>
      </div>
      <div class="stepper-track">
        ${stages.map((stage, idx) => {
          const num = stage.stageNumber;
          const assignedRole = getRoleByStageNumber(num);
          const stageInfo = stageData[num] || {};
          const isCompleted = isApproved || Boolean(stageInfo.completed);
          const isActive = !isApproved && !isRejected && num === currentStageNumber;
          const isPastOrCurrent = isCompleted || isActive;
          const isNodeRejected = isRejected && num === currentStageNumber;

          let stateClass = '';
          if (isNodeRejected) stateClass = 'rejected';
          else if (isCompleted) stateClass = 'completed';
          else if (isActive) stateClass = 'active';

          const connectorCompleted = idx < stages.length - 1 && (isApproved || (stageInfo.completed && stageData[num + 1]?.completed));

          return `
            <div class="stepper-node ${stateClass}">
              <div class="node-circle">
                ${isNodeRejected ? '✕' : (isCompleted ? '✓' : num)}
              </div>
              <div class="node-label">Stage ${num}</div>
              <div class="node-role">${assignedRole.roleTitle.split('/')[0]}</div>
              ${stageInfo.completed && stageInfo.completedAt ? `
                <div class="node-time">Signed ${new Date(stageInfo.completedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}</div>
              ` : (isActive ? `<div class="node-time" style="color:var(--accent-primary);font-weight:700;">Active Now</div>` : '')}
            </div>
            ${idx < stages.length - 1 ? `
              <div class="stepper-connector ${isCompleted ? 'completed' : ''}"></div>
            ` : ''}
          `;
        }).join('')}
      </div>
    </div>
  `;
}

function getStatusBadgeClass(status) {
  if (status === 'approved') return 'approved';
  if (status === 'rejected') return 'rejected';
  if (status === 'revision_requested') return 'revision';
  return 'pending';
}

function formatStatusText(status) {
  switch (status) {
    case 'approved': return '✓ Fully Approved by CEO';
    case 'rejected': return '✕ Requisition Rejected';
    case 'revision_requested': return '↺ Revisions Requested';
    case 'pending_stage_2': return '⏳ Pending Stage 2 (Operations)';
    case 'pending_stage_3': return '⏳ Pending Stage 3 (Finance/CFO)';
    case 'pending_stage_4': return '👑 Pending Stage 4 (CEO)';
    default: return 'Draft';
  }
}
