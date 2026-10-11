import { Storage } from '../services/storage.js';
import { getRoleByStageNumber } from '../data/roles.js';
import { openFieldConfigModal } from './FieldConfigModal.js';
import { showToast } from '../pwa.js';

export function openNewRequestModal(onCreated) {
  const existing = document.getElementById('new-req-modal');
  if (existing) existing.remove();

  const templates = Storage.getTemplates();
  let selectedTemplate = JSON.parse(JSON.stringify(templates[0]));
  const currentRole = Storage.getCurrentRole();

  const modal = document.createElement('div');
  modal.id = 'new-req-modal';
  modal.className = 'modal-backdrop';

  function renderModalContent() {
    const stage1 = selectedTemplate.stages[0];

    modal.innerHTML = `
      <div class="modal-content large" style="max-width: 860px;">
        <div class="modal-header">
          <div style="display:flex;align-items:center;gap:0.75rem;">
            <span style="font-size:1.5rem;">✨</span>
            <div>
              <h2 style="font-size:1.15rem;margin:0;">Initiate Approval Workflow</h2>
              <span style="font-size:0.75rem;color:var(--text-muted);">Step 1: Fill requisition parameters and route to sequential approvers</span>
            </div>
          </div>
          <button class="icon-btn" id="new-modal-close" title="Close">✕</button>
        </div>

        <div class="modal-body">
          <!-- Template Selection -->
          <div>
            <label class="field-label" style="margin-bottom:0.5rem;font-size:0.85rem;">Select Workflow Template</label>
            <div class="template-cards-grid">
              ${templates.map(tmpl => `
                <div class="template-card ${tmpl.id === selectedTemplate.id ? 'selected' : ''}" data-tmpl-id="${tmpl.id}">
                  <span class="template-icon">${tmpl.icon || '📋'}</span>
                  <h4>${tmpl.title}</h4>
                  <p>${tmpl.description}</p>
                  <span style="font-size:0.7rem;color:var(--accent-primary);margin-top:auto;font-weight:700;">
                    ${tmpl.stages.length} Sequential Stages
                  </span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Sequential Route Preview -->
          <div style="background:rgba(99,102,241,0.06);border:1px solid rgba(99,102,241,0.2);border-radius:var(--radius-md);padding:0.85rem 1rem;">
            <span style="font-size:0.75rem;text-transform:uppercase;font-weight:700;color:#818cf8;letter-spacing:0.05em;">Sequential Approval Route:</span>
            <div style="display:flex;gap:0.75rem;align-items:center;margin-top:0.4rem;flex-wrap:wrap;font-size:0.8rem;">
              ${selectedTemplate.stages.map((st, i) => {
                const r = getRoleByStageNumber(st.stageNumber);
                return `
                  <span style="display:inline-flex;align-items:center;gap:0.35rem;">
                    <strong>Stage ${st.stageNumber}:</strong> ${r.name} (${r.roleTitle.split('/')[0]})
                    ${i < selectedTemplate.stages.length - 1 ? '<span style="color:var(--text-subtle);">➔</span>' : ''}
                  </span>
                `;
              }).join('')}
            </div>
          </div>

          <!-- Stage 1 Fields Form -->
          <div style="border-top:1px solid var(--border-subtle);padding-top:1.25rem;">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem;flex-wrap:wrap;gap:0.5rem;">
              <h3 style="font-size:1rem;font-weight:700;display:flex;align-items:center;gap:0.5rem;margin:0;">
                <span class="stage-index-badge" style="width:24px;height:24px;font-size:0.75rem;">1</span>
                ${stage1.stageTitle}
              </h3>
              <button type="button" class="btn btn-outline" id="add-stage1-field-btn" style="font-size:0.75rem;padding:0.3rem 0.7rem;">
                + Add Custom Field / Dropdown
              </button>
            </div>

            <form id="new-req-form" class="fields-grid">
              ${stage1.fields.map(field => `
                <div class="field-group ${field.type === 'textarea' ? 'full-width' : ''}">
                  <label class="field-label" for="new-${field.id}">
                    <span>${field.label} ${field.type === 'select' ? '<span style="color:#38bdf8;font-size:0.7rem;">(Dropdown)</span>' : ''}</span>
                    ${field.required ? '<span class="required-mark">*</span>' : ''}
                  </label>
                  ${renderFieldInput(field)}
                </div>
              `).join('')}
            </form>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" id="new-cancel-btn">Cancel</button>
          <button type="button" class="btn btn-primary" id="new-submit-btn">
            Initiate & Route to Stage 2
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        </div>
      </div>
    `;

    bindModalEvents();
  }

  function bindModalEvents() {
    const close = () => modal.remove();
    modal.querySelector('#new-modal-close').onclick = close;
    modal.querySelector('#new-cancel-btn').onclick = close;
    modal.onclick = (e) => {
      if (e.target === modal) close();
    };

    // Template selection clicks
    modal.querySelectorAll('.template-card').forEach(card => {
      card.onclick = () => {
        const tmplId = card.getAttribute('data-tmpl-id');
        const found = templates.find(t => t.id === tmplId);
        if (found && found.id !== selectedTemplate.id) {
          selectedTemplate = JSON.parse(JSON.stringify(found));
          renderModalContent();
        }
      };
    });

    // Add ad-hoc custom field / dropdown to stage 1
    const addFieldBtn = modal.querySelector('#add-stage1-field-btn');
    if (addFieldBtn) {
      addFieldBtn.onclick = () => {
        openFieldConfigModal({
          initialField: null,
          onSave: (newField) => {
            selectedTemplate.stages[0].fields.push(newField);
            renderModalContent();
            showToast(`Added custom ${newField.type === 'select' ? 'dropdown' : 'field'} "${newField.label}" to Stage 1`);
          }
        });
      };
    }

    // Form submit
    modal.querySelector('#new-submit-btn').onclick = () => {
      const form = modal.querySelector('#new-req-form');
      const stage1 = selectedTemplate.stages[0];
      const collectedValues = {};
      let hasError = false;

      stage1.fields.forEach(field => {
        const input = form.querySelector(`#new-${field.id}`);
        if (input) {
          const val = input.value.trim();
          if (field.required && !val) {
            hasError = true;
            input.style.borderColor = '#ef4444';
          } else {
            input.style.borderColor = '';
          }
          collectedValues[field.id] = val;
        }
      });

      if (hasError) {
        showToast('⚠️ Please fill out all required fields before initiating.');
        return;
      }

      // Generate request ID
      const reqNum = Math.floor(100 + Math.random() * 900);
      const reqId = `REQ-2026-${reqNum}`;

      // Title & Amount detection
      const title = collectedValues.projectTitle || 
                    collectedValues.destination || 
                    collectedValues.counterpartyLegalName || 
                    collectedValues.f_title || 
                    `Request #${reqId}`;

      const amount = collectedValues.estimatedBudget ? `$${collectedValues.estimatedBudget}` : 
                     collectedValues.estimatedCost ? `$${collectedValues.estimatedCost}` :
                     collectedValues.annualContractValue ? `$${collectedValues.annualContractValue}` : 
                     collectedValues.f_amount ? `$${collectedValues.f_amount}` : '';

      const urgency = collectedValues.urgency || collectedValues.f_priority || 'Standard';
      const nextRole = getRoleByStageNumber(2);

      // Build dynamic stageData
      const stageData = {};
      selectedTemplate.stages.forEach(st => {
        if (st.stageNumber === 1) {
          stageData[1] = {
            completed: true,
            completedAt: new Date().toISOString(),
            completedBy: {
              id: currentRole.id,
              name: currentRole.name,
              title: currentRole.title
            },
            values: collectedValues,
            signature: null
          };
        } else {
          stageData[st.stageNumber] = {
            completed: false,
            values: {}
          };
        }
      });

      const newRequest = {
        id: reqId,
        templateId: selectedTemplate.id,
        title: title,
        urgency: urgency,
        amount: amount,
        currentStageNumber: 2, // Routes immediately to Stage 2 (Manager)
        status: 'pending_stage_2',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        requester: {
          id: currentRole.id,
          name: currentRole.name,
          title: currentRole.title,
          email: currentRole.email
        },
        stageData: stageData,
        auditTrail: [
          {
            id: 'aud-' + Date.now(),
            timestamp: new Date().toISOString(),
            actor: `${currentRole.name} (${currentRole.title})`,
            action: 'Workflow Initiated',
            details: `Created new ${selectedTemplate.title} requisition and forwarded to Stage 2 (${nextRole.name} - ${nextRole.roleTitle}).`
          }
        ]
      };

      Storage.saveRequest(newRequest);
      close();
      showToast(`🎉 Requisition ${reqId} initiated and routed to Stage 2!`);
      if (onCreated) onCreated(newRequest);
    };
  }

  function renderFieldInput(field) {
    if (field.type === 'select') {
      return `
        <select class="form-control" id="new-${field.id}" name="${field.id}" ${field.required ? 'required' : ''}>
          <option value="">-- Select option --</option>
          ${(field.options || []).map(opt => `<option value="${escapeHtml(opt)}">${escapeHtml(opt)}</option>`).join('')}
        </select>
      `;
    }
    if (field.type === 'textarea') {
      return `
        <textarea class="form-control" id="new-${field.id}" name="${field.id}" placeholder="${field.placeholder || ''}" rows="3" ${field.required ? 'required' : ''}></textarea>
      `;
    }
    return `
      <input 
        type="${field.type === 'date' ? 'date' : field.type === 'number' ? 'number' : 'text'}" 
        class="form-control" 
        id="new-${field.id}" 
        name="${field.id}" 
        placeholder="${field.placeholder || ''}" 
        ${field.required ? 'required' : ''} 
      />
    `;
  }

  document.body.appendChild(modal);
  renderModalContent();
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
}
