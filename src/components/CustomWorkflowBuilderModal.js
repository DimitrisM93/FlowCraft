import { Storage } from '../services/storage.js';
import { ROLES } from '../data/roles.js';
import { openFieldConfigModal } from './FieldConfigModal.js';
import { showToast } from '../pwa.js';

export function openCustomWorkflowBuilderModal(onSaved, templateToEdit = null) {
  const existing = document.getElementById('builder-modal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'builder-modal';
  modal.className = 'modal-backdrop';

  const allTemplates = Storage.getTemplates();

  // If a template was provided to edit, use its data, otherwise use defaults
  let title = templateToEdit ? templateToEdit.title : 'Client Expansion & Custom SLA';
  let category = templateToEdit ? templateToEdit.category : 'Operations & Commercial';
  let icon = templateToEdit ? templateToEdit.icon : '💼';
  let desc = templateToEdit ? templateToEdit.description : 'Approval pipeline for custom enterprise client agreements and budget commitments.';
  let templateId = templateToEdit ? templateToEdit.id : 'custom-' + Date.now().toString(36);

  let stages = templateToEdit ? JSON.parse(JSON.stringify(templateToEdit.stages)) : [
    {
      stageNumber: 1,
      roleId: 'requester',
      stageTitle: 'Initial Submission',
      requiresSignature: false,
      fields: [
        { id: 'f_title', label: 'Item / Initiative Name', type: 'text', required: true },
        { 
          id: 'f_category', 
          label: 'Request Category / Classification', 
          type: 'select', 
          options: ['Core Infrastructure', 'Cloud SaaS License', 'Consulting Services', 'Hardware Purchase'],
          required: true 
        },
        { id: 'f_amount', label: 'Budget Estimate ($ USD)', type: 'currency', required: true },
        { id: 'f_desc', label: 'Detailed Justification', type: 'textarea', required: true }
      ]
    },
    {
      stageNumber: 2,
      roleId: 'manager',
      stageTitle: 'Management Diligence',
      requiresSignature: true,
      fields: [
        { 
          id: 'f_priority', 
          label: 'Operational Priority Level', 
          type: 'select', 
          options: ['Critical / Blocker (48h)', 'High Priority (14 Days)', 'Medium Standard (30 Days)', 'Low Discretionary'], 
          required: true 
        },
        { 
          id: 'f_dept_impact', 
          label: 'Department Capacity Impact', 
          type: 'select', 
          options: ['Immediate Capacity Unlocked', 'Neutral / Business as Usual', 'Requires Cross-Team Training'], 
          required: true 
        },
        { id: 'f_mgr_comment', label: 'Reviewer Recommendation & Notes', type: 'textarea', required: true }
      ]
    },
    {
      stageNumber: 3,
      roleId: 'finance',
      stageTitle: 'Financial Compliance',
      requiresSignature: true,
      fields: [
        { id: 'f_budget_code', label: 'Budget Code / Account', type: 'text', required: true },
        { 
          id: 'f_payment_schedule', 
          label: 'Payment Terms & Schedule', 
          type: 'select', 
          options: ['Net 30 Days', 'Net 60 Days', '50% Milestone Upfront', '100% On Project Completion'], 
          required: true 
        },
        { id: 'f_audit_note', label: 'Compliance Audit Sign-off', type: 'textarea', required: true }
      ]
    },
    {
      stageNumber: 4,
      roleId: 'ceo',
      stageTitle: 'Executive Final Execution',
      requiresSignature: true,
      fields: [
        { 
          id: 'f_ceo_auth', 
          label: 'Executive Strategic Alignment', 
          type: 'select', 
          options: ['Tier 1 Core Strategic Priority', 'Tier 2 High Operational Value', 'Tier 3 Discretionary Growth'], 
          required: true 
        },
        { id: 'f_exec_seal', label: 'President & CEO Directives', type: 'textarea', required: true }
      ]
    }
  ];

  function render() {
    modal.innerHTML = `
      <div class="modal-content large" style="max-width: 940px;">
        <div class="modal-header">
          <div style="display:flex;align-items:center;gap:0.75rem;">
            <span style="font-size:1.5rem;">⚙️</span>
            <div>
              <h2 style="font-size:1.15rem;margin:0;">${templateToEdit ? 'Edit Workflow Template' : 'Visual Workflow & Form Designer'}</h2>
              <span style="font-size:0.75rem;color:var(--text-muted);">Configure sequential approval stages and customize form fields (including dropdowns with option presets)</span>
            </div>
          </div>
          <button class="icon-btn" id="builder-close" title="Close">✕</button>
        </div>

        <div class="modal-body">
          <!-- Template Loader Quick Bar -->
          <div style="background:rgba(99,102,241,0.06);border:1px solid rgba(99,102,241,0.2);border-radius:var(--radius-md);padding:0.75rem 1rem;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:0.5rem;">
            <div style="font-size:0.8rem;color:var(--text-muted);">
              <strong>Template Preset:</strong> Load an existing workflow to customize its fields and dropdowns
            </div>
            <div style="display:flex;gap:0.4rem;flex-wrap:wrap;">
              ${allTemplates.map(t => `
                <button type="button" class="btn btn-outline load-template-btn" data-t-id="${t.id}" style="font-size:0.75rem;padding:0.25rem 0.6rem;">
                  ${t.icon || '📋'} ${t.title.split(' ')[0]}
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Basic Info -->
          <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));gap:1rem;">
            <div class="field-group">
              <label class="field-label" for="wf-title">Workflow Name</label>
              <input type="text" class="form-control" id="wf-title" value="${escapeHtml(title)}" placeholder="e.g. Special Project Authorization" />
            </div>
            <div class="field-group">
              <label class="field-label" for="wf-category">Category</label>
              <input type="text" class="form-control" id="wf-category" value="${escapeHtml(category)}" placeholder="e.g. Human Resources" />
            </div>
            <div class="field-group">
              <label class="field-label" for="wf-icon">Icon Emoji</label>
              <input type="text" class="form-control" id="wf-icon" value="${escapeHtml(icon)}" style="width:70px;text-align:center;" />
            </div>
          </div>

          <div class="field-group">
            <label class="field-label" for="wf-desc">Workflow Purpose / Description</label>
            <input type="text" class="form-control" id="wf-desc" value="${escapeHtml(desc)}" />
          </div>

          <!-- Stages List -->
          <div style="border-top:1px solid var(--border-subtle);padding-top:1.25rem;">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem;">
              <div>
                <h3 style="font-size:1rem;font-weight:700;">Sequential Stages (${stages.length} Stages)</h3>
                <span style="font-size:0.75rem;color:var(--text-muted);">Each stage has dedicated form fields, assigned reviewer persona, and digital signature requirements.</span>
              </div>
              <button type="button" class="btn btn-secondary" id="add-stage-btn" style="font-size:0.8rem;padding:0.35rem 0.75rem;">
                + Add Stage
              </button>
            </div>

            <div style="display:flex;flex-direction:column;gap:1.25rem;">
              ${stages.map((stage, sIdx) => `
                <div class="designer-stage-box" id="builder-stage-${sIdx}">
                  <div class="designer-stage-header">
                    <div style="display:flex;align-items:center;gap:0.5rem;flex-wrap:wrap;">
                      <span class="stage-index-badge" style="width:26px;height:26px;font-size:0.75rem;">${sIdx + 1}</span>
                      <strong style="font-size:0.9rem;">Stage ${sIdx + 1}:</strong>
                      <input type="text" class="form-control stage-title-input" data-stage-idx="${sIdx}" value="${escapeHtml(stage.stageTitle)}" style="font-size:0.85rem;padding:0.3rem 0.6rem;width:240px;" />
                    </div>
                    <div style="display:flex;align-items:center;gap:0.75rem;">
                      <label style="font-size:0.75rem;color:var(--text-muted);display:flex;align-items:center;gap:0.35rem;cursor:pointer;">
                        <input type="checkbox" class="stage-sig-checkbox" data-stage-idx="${sIdx}" ${stage.requiresSignature ? 'checked' : ''} />
                        Require Signature
                      </label>
                      ${stages.length > 2 ? `
                        <button type="button" class="icon-btn remove-stage-btn" data-stage-idx="${sIdx}" title="Remove Stage" style="width:28px;height:28px;font-size:0.8rem;color:#ef4444;">✕</button>
                      ` : ''}
                    </div>
                  </div>

                  <!-- Assigned Role -->
                  <div style="display:flex;align-items:center;gap:0.5rem;font-size:0.8rem;">
                    <span style="color:var(--text-subtle);">Assigned Reviewer Persona:</span>
                    <select class="form-control stage-role-select" data-stage-idx="${sIdx}" style="width:auto;font-size:0.8rem;padding:0.25rem 0.5rem;">
                      ${ROLES.map(r => `
                        <option value="${r.id}" ${r.id === stage.roleId ? 'selected' : ''}>${r.name} (${r.title})</option>
                      `).join('')}
                    </select>
                  </div>

                  <!-- Fields in this Stage -->
                  <div style="background:rgba(0,0,0,0.25);border:1px solid var(--border-subtle);border-radius:var(--radius-md);padding:0.85rem;">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.6rem;">
                      <span style="font-size:0.75rem;font-weight:700;color:var(--text-subtle);text-transform:uppercase;letter-spacing:0.04em;">
                        Stage Form Fields (${stage.fields.length})
                      </span>
                      <button type="button" class="btn btn-primary add-custom-field-btn" data-stage-idx="${sIdx}" style="font-size:0.725rem;padding:0.25rem 0.65rem;">
                        + Add Custom Field / Dropdown
                      </button>
                    </div>

                    <div class="field-pill-list">
                      ${stage.fields.map((f, fIdx) => {
                        const isSelect = f.type === 'select';
                        const optCount = (f.options || []).length;
                        return `
                          <div class="field-pill" style="cursor:pointer;border-color:${isSelect ? 'rgba(56, 189, 248, 0.4)' : 'var(--border-subtle)'};background:${isSelect ? 'rgba(56, 189, 248, 0.08)' : 'rgba(255, 255, 255, 0.05)'};" data-stage-idx="${sIdx}" data-field-idx="${fIdx}" title="Click to edit field">
                            <span style="color:${isSelect ? '#38bdf8' : '#a5b4fc'};font-size:0.85rem;">
                              ${isSelect ? '🔽' : f.type === 'textarea' ? '📄' : f.type === 'currency' ? '💲' : '📝'}
                            </span>
                            <strong style="color:var(--text-main);">${escapeHtml(f.label)}</strong>
                            <span style="color:var(--text-subtle);font-size:0.7rem;font-family:var(--font-mono);">
                              ${isSelect ? `[${optCount} options]` : `(${f.type})`}
                            </span>
                            ${f.required ? '<span style="color:#ef4444;font-size:0.7rem;font-weight:800;">*</span>' : ''}
                            <button type="button" class="remove-field-btn" data-stage-idx="${sIdx}" data-field-idx="${fIdx}" title="Remove Field" style="background:none;border:none;color:var(--text-subtle);cursor:pointer;padding:0 0.25rem;font-size:0.8rem;margin-left:0.2rem;">✕</button>
                          </div>
                        `;
                      }).join('')}
                    </div>
                    <span style="font-size:0.7rem;color:var(--text-subtle);display:block;margin-top:0.4rem;">
                      💡 Tip: Click on any field pill above to edit its label, type, dropdown options, or required status.
                    </span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" id="builder-cancel">Cancel</button>
          <button type="button" class="btn btn-primary" id="builder-save">
            Save Workflow Template & Field Schema
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
          </button>
        </div>
      </div>
    `;

    bindEvents();
  }

  function bindEvents() {
    const close = () => modal.remove();
    modal.querySelector('#builder-close').onclick = close;
    modal.querySelector('#builder-cancel').onclick = close;
    modal.onclick = (e) => {
      if (e.target === modal) close();
    };

    // Load template preset buttons
    modal.querySelectorAll('.load-template-btn').forEach(btn => {
      btn.onclick = () => {
        const tId = btn.getAttribute('data-t-id');
        const tmpl = allTemplates.find(t => t.id === tId);
        if (tmpl) {
          title = tmpl.title + ' (Custom)';
          category = tmpl.category;
          icon = tmpl.icon;
          desc = tmpl.description;
          stages = JSON.parse(JSON.stringify(tmpl.stages));
          render();
          showToast(`Loaded ${tmpl.title} preset into designer.`);
        }
      };
    });

    // Stage inputs
    modal.querySelectorAll('.stage-title-input').forEach(input => {
      input.oninput = (e) => {
        const sIdx = parseInt(e.target.dataset.stageIdx);
        stages[sIdx].stageTitle = e.target.value;
      };
    });

    modal.querySelectorAll('.stage-role-select').forEach(select => {
      select.onchange = (e) => {
        const sIdx = parseInt(e.target.dataset.stageIdx);
        stages[sIdx].roleId = e.target.value;
      };
    });

    modal.querySelectorAll('.stage-sig-checkbox').forEach(cb => {
      cb.onchange = (e) => {
        const sIdx = parseInt(e.target.dataset.stageIdx);
        stages[sIdx].requiresSignature = e.target.checked;
      };
    });

    // Remove Stage
    modal.querySelectorAll('.remove-stage-btn').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const sIdx = parseInt(btn.dataset.stageIdx);
        stages.splice(sIdx, 1);
        stages.forEach((s, i) => s.stageNumber = i + 1);
        render();
      };
    });

    // Add Stage
    const addStageBtn = modal.querySelector('#add-stage-btn');
    if (addStageBtn) {
      addStageBtn.onclick = () => {
        const newNum = stages.length + 1;
        stages.push({
          stageNumber: newNum,
          roleId: ROLES[Math.min(newNum - 1, ROLES.length - 1)].id,
          stageTitle: `Review Stage ${newNum}`,
          requiresSignature: true,
          fields: [
            { 
              id: `f_status_${newNum}`, 
              label: `Stage ${newNum} Review Decision`, 
              type: 'select', 
              options: ['Approved', 'Approved with Contingency', 'Needs Corrections'], 
              required: true 
            },
            { id: `f_notes_${newNum}`, label: `Stage ${newNum} Diligence Comments`, type: 'textarea', required: true }
          ]
        });
        render();
      };
    }

    // Add Custom Field button (opens FieldConfigModal)
    modal.querySelectorAll('.add-custom-field-btn').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const sIdx = parseInt(btn.dataset.stageIdx);
        openFieldConfigModal({
          initialField: null,
          onSave: (newField) => {
            stages[sIdx].fields.push(newField);
            render();
            showToast(`Added field "${newField.label}" to Stage ${sIdx + 1}`);
          }
        });
      };
    });

    // Click Field Pill to edit field
    modal.querySelectorAll('.field-pill').forEach(pill => {
      pill.onclick = (e) => {
        // Ignore if clicking remove button
        if (e.target.classList.contains('remove-field-btn')) return;
        const sIdx = parseInt(pill.dataset.stageIdx);
        const fIdx = parseInt(pill.dataset.fieldIdx);
        const existingField = stages[sIdx].fields[fIdx];
        openFieldConfigModal({
          initialField: existingField,
          onSave: (updatedField) => {
            stages[sIdx].fields[fIdx] = updatedField;
            render();
            showToast(`Updated field "${updatedField.label}"`);
          }
        });
      };
    });

    // Remove Field button
    modal.querySelectorAll('.remove-field-btn').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const sIdx = parseInt(btn.dataset.stageIdx);
        const fIdx = parseInt(btn.dataset.fieldIdx);
        const removed = stages[sIdx].fields.splice(fIdx, 1);
        render();
        if (removed.length > 0) {
          showToast(`Removed field "${removed[0].label}"`);
        }
      };
    });

    // Save Workflow
    modal.querySelector('#builder-save').onclick = () => {
      const finalTitle = modal.querySelector('#wf-title').value.trim() || 'Custom Approval Workflow';
      const finalCat = modal.querySelector('#wf-category').value.trim() || 'General';
      const finalIcon = modal.querySelector('#wf-icon').value.trim() || '📋';
      const finalDesc = modal.querySelector('#wf-desc').value.trim() || 'Custom sequential multi-stage workflow.';

      const updatedTemplate = {
        id: templateId,
        title: finalTitle,
        category: finalCat,
        icon: finalIcon,
        description: finalDesc,
        stages
      };

      Storage.saveCustomTemplate(updatedTemplate);
      close();
      showToast(`🎉 Workflow template "${finalTitle}" saved successfully!`);
      if (onSaved) onSaved(updatedTemplate);
    };
  }

  document.body.appendChild(modal);
  render();
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
}
