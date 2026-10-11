import { Storage } from '../services/storage.js';
import { getRoleByStageNumber, getRoleById } from '../data/roles.js';
import { renderWorkflowStepper } from './WorkflowStepper.js';
import { SignaturePad } from './SignaturePad.js';
import { generateVerificationHash } from '../utils/crypto.js';
import { openOfficialCertificateModal } from './OfficialCertificateModal.js';
import { openFieldConfigModal } from './FieldConfigModal.js';
import { showToast } from '../pwa.js';

export function renderRequestDetail(containerId, requestId, onBack) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const request = Storage.getRequestById(requestId);
  if (!request) {
    container.innerHTML = `
      <div style="text-align:center;padding:4rem;">
        <h3>Request not found</h3>
        <button class="btn btn-secondary" id="detail-back-btn">Return to Requests</button>
      </div>
    `;
    container.querySelector('#detail-back-btn').onclick = onBack;
    return;
  }

  const template = Storage.getTemplateById(request.templateId);
  const currentRole = Storage.getCurrentRole();
  const stages = template.stages;
  const currentStageNumber = request.currentStageNumber;
  const isFinalStage = currentStageNumber === stages.length;
  const isApproved = request.status === 'approved';
  const isRejected = request.status === 'rejected';

  const assignedRoleForActiveStage = getRoleByStageNumber(currentStageNumber);
  const canUserActOnActiveStage = !isApproved && !isRejected && currentRole.stageNumber === currentStageNumber;

  container.innerHTML = `
    <div class="detail-view">
      <!-- Top Navigation & Action Bar -->
      <div class="detail-nav-bar">
        <button type="button" class="btn btn-secondary" id="detail-back-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Back to Dashboard
        </button>
        <div style="display:flex;gap:0.5rem;align-items:center;">
          <button type="button" class="btn btn-outline" id="detail-cert-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
            Official Certificate & Audit
          </button>
        </div>
      </div>

      <!-- Header Summary Card -->
      <div class="detail-header-card">
        <div class="detail-title-row">
          <div class="detail-title-group">
            <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:0.4rem;">
              <span class="card-id">${request.id}</span>
              <span style="font-size:0.85rem;color:var(--text-muted);">${template.icon} ${template.title}</span>
            </div>
            <h1>${request.title}</h1>
            <div class="card-meta-line" style="margin-top:0.5rem;">
              <span>Initiated by <strong>${request.requester.name}</strong> (${request.requester.title})</span>
              <span>•</span>
              <span>${new Date(request.createdAt).toLocaleDateString()}</span>
              ${request.amount ? `<span>•</span><span class="card-amount-tag">${request.amount}</span>` : ''}
            </div>
          </div>
          <div class="detail-badges">
            <span class="status-badge ${getStatusBadgeClass(request.status)}">
              ${formatStatusLabel(request.status)}
            </span>
          </div>
        </div>
      </div>

      <!-- Visual Stage Stepper -->
      ${renderWorkflowStepper(stages, currentStageNumber, request.status, request.stageData)}

      <!-- Active Stage Role Callout if User is NOT the assigned role -->
      ${!isApproved && !isRejected && !canUserActOnActiveStage ? `
        <div class="active-role-banner" style="background:rgba(245, 158, 11, 0.1);border-color:rgba(245, 158, 11, 0.3);">
          <div class="banner-left">
            <div class="banner-avatar-lg" style="background:${assignedRoleForActiveStage.color};">${assignedRoleForActiveStage.avatar}</div>
            <div class="banner-info">
              <h2>Stage ${currentStageNumber} is waiting for ${assignedRoleForActiveStage.name} (${assignedRoleForActiveStage.roleTitle})</h2>
              <p>You are viewing as <strong>${currentRole.name}</strong>. Switch role to fill fields, sign, and forward this request.</p>
            </div>
          </div>
          <button type="button" class="btn btn-warning" id="switch-to-active-role-btn">
            Switch to ${assignedRoleForActiveStage.name.split(' ')[0]} Now
          </button>
        </div>
      ` : ''}

      <!-- Stage Cards (Forms & Digital Signatures) -->
      <div class="stage-cards-container">
        ${stages.map((stage) => {
          const num = stage.stageNumber;
          const assignedRole = getRoleByStageNumber(num);
          const stageInfo = request.stageData[num] || { values: {} };
          const isCompleted = isApproved || Boolean(stageInfo.completed);
          const isActive = !isApproved && !isRejected && num === currentStageNumber;
          const canEditThisStage = isActive && canUserActOnActiveStage;

          let cardClass = 'stage-card';
          if (isCompleted) cardClass += ' is-completed';
          if (isActive) cardClass += ' is-active-stage';
          if (canEditThisStage) cardClass += ' can-edit';

          return `
            <div class="${cardClass}" id="stage-card-${num}">
              <div class="stage-card-header">
                <div class="stage-title-wrap">
                  <div class="stage-index-badge">${isCompleted ? '✓' : num}</div>
                  <div>
                    <div class="stage-name">Stage ${num}: ${stage.stageTitle}</div>
                    <div class="stage-target-role">Assigned to: <strong>${assignedRole.name}</strong> (${assignedRole.roleTitle})</div>
                  </div>
                </div>
                <div style="display:flex;align-items:center;gap:0.5rem;flex-wrap:wrap;">
                  ${canEditThisStage ? `
                    <button type="button" class="btn btn-outline add-stage-field-live-btn" data-stage-num="${num}" style="font-size:0.75rem;padding:0.25rem 0.65rem;border-color:rgba(56, 189, 248, 0.4);color:#38bdf8;">
                      + Add Custom Field / Dropdown
                    </button>
                  ` : ''}
                  ${isCompleted ? `
                    <span class="status-badge approved">✓ Completed & Signed</span>
                  ` : (isActive ? `
                    <span class="status-badge pending">● In Progress</span>
                  ` : `
                    <span class="status-badge" style="background:rgba(255,255,255,0.05);color:var(--text-subtle);">Locked</span>
                  `)}
                </div>
              </div>

              <div class="stage-card-body">
                ${renderStageFields(stage, stageInfo.values, canEditThisStage, isCompleted)}

                <!-- Completed Signature Box -->
                ${isCompleted && stageInfo.signature ? `
                  <div class="verified-seal-box" style="margin-top:1.5rem;">
                    <div class="seal-left">
                      <div class="seal-icon-badge">✓</div>
                      <div class="seal-info">
                        <h4>Digitally Verified Signature</h4>
                        <p>Signer: <strong>${stageInfo.signature.signerName}</strong> (${stageInfo.signature.signerRole})</p>
                        <p style="font-size:0.75rem;color:var(--text-subtle);">Timestamp: ${new Date(stageInfo.signature.signedAt).toLocaleString()}</p>
                      </div>
                    </div>
                    <div class="seal-signature-display">
                      ${stageInfo.signature.type === 'draw' && stageInfo.signature.dataUrl ? `
                        <img src="${stageInfo.signature.dataUrl}" alt="Signature" class="seal-rendered-img" />
                      ` : `
                        <div class="seal-rendered-text">${stageInfo.signature.signerName || stageInfo.signature.typedName}</div>
                      `}
                      <div class="seal-hash">${stageInfo.signature.hash || 'Verified SHA256'}</div>
                    </div>
                  </div>
                ` : ''}

                <!-- Active Signature Pad for Current Approver -->
                ${canEditThisStage && stage.requiresSignature ? `
                  <div class="signature-section">
                    <div id="sig-pad-mount-stage-${num}"></div>
                  </div>
                ` : ''}
              </div>

              <!-- Action Bar Footer (Only on Active Stage when current user has permissions) -->
              ${canEditThisStage ? `
                <div class="stage-actions-footer">
                  <div class="approver-helper-notice">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                    <span>Complete the required fields and apply your digital signature to proceed.</span>
                  </div>
                  <div class="approval-btn-group">
                    ${num > 1 ? `
                      <button type="button" class="btn btn-outline" id="action-send-back-btn" style="color:#ec4899;">
                        ↺ Request Changes
                      </button>
                    ` : ''}
                    <button type="button" class="btn btn-danger" id="action-reject-btn">
                      ✕ Reject
                    </button>
                    <button type="button" class="btn btn-primary" id="action-approve-btn">
                      ${isFinalStage ? '👑 Grant Final CEO Approval' : `Approve & Forward to Stage ${num + 1}`}
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </button>
                  </div>
                </div>
              ` : ''}
            </div>
          `;
        }).join('')}
      </div>

      <!-- Audit Trail Timeline -->
      <div class="audit-trail-container">
        <div class="audit-trail-header">
          <h3 style="font-size:0.95rem;font-weight:700;display:flex;align-items:center;gap:0.5rem;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            Audit Trail & Execution Log
          </h3>
          <span style="font-size:0.75rem;color:var(--text-subtle);">${(request.auditTrail || []).length} recorded events</span>
        </div>
        <div class="timeline-list">
          ${(request.auditTrail || []).slice().reverse().map(item => `
            <div class="timeline-item">
              <div class="timeline-dot ${getTimelineDotClass(item.action)}"></div>
              <div class="timeline-title">
                <span>${item.action}</span>
                <span class="timeline-time">${new Date(item.timestamp).toLocaleString()}</span>
              </div>
              <div style="font-size:0.75rem;color:var(--text-main);font-weight:600;">${item.actor}</div>
              <div class="timeline-desc">${item.details}</div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  // Attach Navigation & Modal Handlers
  container.querySelector('#detail-back-btn').onclick = onBack;
  container.querySelector('#detail-cert-btn').onclick = () => {
    openOfficialCertificateModal(request, template);
  };

  const switchBtn = container.querySelector('#switch-to-active-role-btn');
  if (switchBtn) {
    switchBtn.onclick = () => {
      Storage.setCurrentRole(assignedRoleForActiveStage.id);
      renderRequestDetail(containerId, requestId, onBack);
    };
  }

  // Mount Signature Pad if active stage can be edited and requires signature
  let activeSigPad = null;
  const currentStageDef = stages.find(s => s.stageNumber === currentStageNumber);
  if (canUserActOnActiveStage && currentStageDef?.requiresSignature) {
    activeSigPad = new SignaturePad({
      containerId: `sig-pad-mount-stage-${currentStageNumber}`,
      signerName: currentRole.name
    });
  }

  // Attach Approval Action Handlers
  if (canUserActOnActiveStage) {
    const approveBtn = container.querySelector('#action-approve-btn');
    const rejectBtn = container.querySelector('#action-reject-btn');
    const sendBackBtn = container.querySelector('#action-send-back-btn');

    if (approveBtn) {
      approveBtn.onclick = () => {
        handleApproveAndForward(request, template, currentStageNumber, currentRole, activeSigPad, () => {
          renderRequestDetail(containerId, requestId, onBack);
        });
      };
    }

    if (rejectBtn) {
      rejectBtn.onclick = () => {
        handleReject(request, currentRole, () => {
          renderRequestDetail(containerId, requestId, onBack);
        });
      };
    }

    if (sendBackBtn) {
      sendBackBtn.onclick = () => {
        handleSendBack(request, currentRole, () => {
          renderRequestDetail(containerId, requestId, onBack);
        });
      };
    }
  }

  // Live Add Custom Field / Dropdown button handler
  container.querySelectorAll('.add-stage-field-live-btn').forEach(btn => {
    btn.onclick = () => {
      const stageNum = parseInt(btn.dataset.stageNum);
      const stageDef = template.stages.find(s => s.stageNumber === stageNum);
      if (!stageDef) return;

      openFieldConfigModal({
        initialField: null,
        onSave: (newField) => {
          stageDef.fields.push(newField);
          Storage.saveCustomTemplate(template);
          showToast(`Added custom ${newField.type === 'select' ? 'dropdown' : 'field'} "${newField.label}" to Stage ${stageNum}!`);
          renderRequestDetail(containerId, requestId, onBack);
        }
      });
    };
  });
}

function renderStageFields(stage, values = {}, canEdit, isCompleted) {
  return `
    <div class="fields-grid">
      ${stage.fields.map(field => {
        const val = values[field.id] || '';
        const isFullWidth = field.type === 'textarea';

        if (!canEdit) {
          // Read-only presentation
          return `
            <div class="field-group ${isFullWidth ? 'full-width' : ''}">
              <span class="field-label">${field.label}</span>
              <div class="readonly-field-box ${isFullWidth ? 'long-text' : ''}">
                ${val ? escapeHtml(val) : '<span style="color:var(--text-subtle);font-style:italic;">Pending input</span>'}
              </div>
            </div>
          `;
        }

        // Editable form control
        return `
          <div class="field-group ${isFullWidth ? 'full-width' : ''}">
            <label class="field-label" for="field-${field.id}">
              ${field.label}
              ${field.required ? '<span class="required-mark">*</span>' : ''}
            </label>
            ${renderFormControl(field, val)}
          </div>
        `;
      }).join('')}
    </div>
  `;
}

function renderFormControl(field, val) {
  if (field.type === 'select') {
    return `
      <select class="form-control" id="field-${field.id}" name="${field.id}" ${field.required ? 'required' : ''}>
        <option value="">-- Select option --</option>
        ${(field.options || []).map(opt => `
          <option value="${escapeHtml(opt)}" ${val === opt ? 'selected' : ''}>${escapeHtml(opt)}</option>
        `).join('')}
      </select>
    `;
  }

  if (field.type === 'textarea') {
    return `
      <textarea class="form-control" id="field-${field.id}" name="${field.id}" placeholder="${field.placeholder || ''}" ${field.required ? 'required' : ''}>${escapeHtml(val)}</textarea>
    `;
  }

  return `
    <input 
      type="${field.type === 'currency' ? 'text' : field.type}" 
      class="form-control" 
      id="field-${field.id}" 
      name="${field.id}" 
      value="${escapeHtml(val)}" 
      placeholder="${field.placeholder || ''}" 
      ${field.required ? 'required' : ''} 
    />
  `;
}

function handleApproveAndForward(request, template, stageNumber, currentRole, sigPad, callback) {
  const stageDef = template.stages.find(s => s.stageNumber === stageNumber);
  const card = document.getElementById(`stage-card-${stageNumber}`);
  if (!card) return;

  // Gather values from inputs
  const collectedValues = {};
  let hasMissingRequired = false;

  stageDef.fields.forEach(field => {
    const input = card.querySelector(`#field-${field.id}`);
    if (input) {
      const val = input.value.trim();
      if (field.required && !val) {
        hasMissingRequired = true;
        input.style.borderColor = '#ef4444';
      } else {
        input.style.borderColor = '';
      }
      collectedValues[field.id] = val;
    }
  });

  if (hasMissingRequired) {
    showToast('⚠️ Please complete all required fields marked with * before approving.');
    return;
  }

  // Check signature if required
  let signatureRecord = null;
  if (stageDef.requiresSignature) {
    if (sigPad && !sigPad.isValid()) {
      sigPad.stampCursiveSignature();
    }
    const sigData = sigPad ? sigPad.getSignatureData() : { type: 'type', typedName: currentRole.name };
    const timestamp = new Date().toISOString();
    const hash = generateVerificationHash(currentRole.name, currentRole.title, request.id, timestamp);

    signatureRecord = {
      type: sigData.type,
      signerName: currentRole.name,
      signerRole: currentRole.title,
      signedAt: timestamp,
      hash: hash,
      dataUrl: sigData.dataUrl || '',
      typedName: sigData.typedName || currentRole.name
    };
  }

  // Update request stage data
  if (!request.stageData) request.stageData = {};
  request.stageData[stageNumber] = {
    completed: true,
    completedAt: new Date().toISOString(),
    completedBy: {
      id: currentRole.id,
      name: currentRole.name,
      title: currentRole.title
    },
    values: collectedValues,
    signature: signatureRecord
  };

  const isFinalStage = stageNumber === template.stages.length;

  if (isFinalStage) {
    request.status = 'approved';
    request.auditTrail.push({
      id: 'aud-' + Date.now(),
      timestamp: new Date().toISOString(),
      actor: `${currentRole.name} (${currentRole.title})`,
      action: 'FINAL EXECUTIVE APPROVAL GRANTED',
      details: 'CEO completed Stage 4 review and executed master corporate authorization seal.'
    });
    showToast('👑 FINAL CEO APPROVAL GRANTED! Requisition is fully executed.');
  } else {
    const nextStageNum = stageNumber + 1;
    request.currentStageNumber = nextStageNum;
    request.status = `pending_stage_${nextStageNum}`;
    const nextRole = getRoleByStageNumber(nextStageNum);
    request.auditTrail.push({
      id: 'aud-' + Date.now(),
      timestamp: new Date().toISOString(),
      actor: `${currentRole.name} (${currentRole.title})`,
      action: `Stage ${stageNumber} Approved & Signed`,
      details: `Forwarded to Stage ${nextStageNum} (${nextRole.name} - ${nextRole.roleTitle}).`
    });
    showToast(`✓ Stage ${stageNumber} approved & forwarded to ${nextRole.name.split(' ')[0]}!`);
  }

  request.updatedAt = new Date().toISOString();
  Storage.saveRequest(request);
  callback();
}

function handleReject(request, currentRole, callback) {
  const reason = prompt('Please enter the reason for rejecting this request:');
  if (reason === null) return;
  if (!reason.trim()) {
    alert('A rejection reason is required.');
    return;
  }

  request.status = 'rejected';
  request.auditTrail.push({
    id: 'aud-' + Date.now(),
    timestamp: new Date().toISOString(),
    actor: `${currentRole.name} (${currentRole.title})`,
    action: 'Requisition Rejected',
    details: `Rejection rationale: "${reason.trim()}"`
  });
  request.updatedAt = new Date().toISOString();
  Storage.saveRequest(request);
  callback();
}

function handleSendBack(request, currentRole, callback) {
  const feedback = prompt('Please explain what revisions or corrections are requested:');
  if (feedback === null) return;
  if (!feedback.trim()) {
    alert('Feedback explanation is required.');
    return;
  }

  request.currentStageNumber = 1;
  request.status = 'revision_requested';
  if (request.stageData[1]) {
    request.stageData[1].completed = false; // Reopen stage 1 for editing
  }
  request.auditTrail.push({
    id: 'aud-' + Date.now(),
    timestamp: new Date().toISOString(),
    actor: `${currentRole.name} (${currentRole.title})`,
    action: 'Revisions Requested / Sent Back to Initiator',
    details: `Returned to ${request.requester.name} with feedback: "${feedback.trim()}"`
  });
  request.updatedAt = new Date().toISOString();
  Storage.saveRequest(request);
  callback();
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

function getTimelineDotClass(action) {
  if (action.includes('FINAL') || action.includes('Approved')) return 'approved';
  if (action.includes('Rejected')) return 'rejected';
  if (action.includes('Revisions')) return 'revision';
  return '';
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
}
