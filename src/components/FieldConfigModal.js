/**
 * Interactive Field Configuration Modal
 * Supports full customization of fields, including Dropdown (Select) with option presets and option management.
 */

export function openFieldConfigModal({ initialField = null, onSave, onCancel }) {
  const existing = document.getElementById('field-config-modal-root');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'field-config-modal-root';
  modal.className = 'modal-backdrop';
  modal.style.zIndex = '200'; // Above parent builder modal

  // State
  let field = initialField ? JSON.parse(JSON.stringify(initialField)) : {
    id: 'f_' + Date.now().toString(36),
    label: '',
    type: 'select', // Default to select / dropdown as requested
    options: ['Option 1', 'Option 2', 'Option 3'],
    required: true,
    placeholder: '',
    defaultValue: ''
  };

  if (!field.options) {
    field.options = ['Option 1', 'Option 2', 'Option 3'];
  }

  function render() {
    const isSelect = field.type === 'select';

    modal.innerHTML = `
      <div class="modal-content" style="max-width: 580px;">
        <div class="modal-header">
          <div style="display:flex;align-items:center;gap:0.75rem;">
            <span style="font-size:1.4rem;">${isSelect ? '🔽' : '⚙️'}</span>
            <div>
              <h2 style="font-size:1.1rem;margin:0;">${initialField ? 'Edit Field' : 'Create Custom Field'}</h2>
              <span style="font-size:0.75rem;color:var(--text-muted);">Configure field parameters, type, and dropdown options</span>
            </div>
          </div>
          <button class="icon-btn" id="field-cfg-close" title="Close">✕</button>
        </div>

        <div class="modal-body" style="gap:1rem;">
          <!-- Field Label -->
          <div class="field-group">
            <label class="field-label" for="cfg-label">
              Field Label / Title
              <span class="required-mark">*</span>
            </label>
            <input 
              type="text" 
              class="form-control" 
              id="cfg-label" 
              value="${escapeHtml(field.label)}" 
              placeholder="e.g. Risk Classification, Payment Terms, Department" 
              autofocus 
            />
          </div>

          <!-- Field Type Selector -->
          <div class="field-group">
            <label class="field-label" for="cfg-type">Field Input Type</label>
            <select class="form-control" id="cfg-type">
              <option value="select" ${field.type === 'select' ? 'selected' : ''}>🔽 Dropdown Select Menu</option>
              <option value="text" ${field.type === 'text' ? 'selected' : ''}>📝 Single Line Text</option>
              <option value="textarea" ${field.type === 'textarea' ? 'selected' : ''}>📄 Multi-line Text Area</option>
              <option value="currency" ${field.type === 'currency' ? 'selected' : ''}>💲 Currency Amount ($ USD)</option>
              <option value="number" ${field.type === 'number' ? 'selected' : ''}>🔢 Numeric Value</option>
              <option value="date" ${field.type === 'date' ? 'selected' : ''}>📅 Date Picker</option>
            </select>
          </div>

          <!-- Dropdown Options Configurator (Visible if type is 'select') -->
          <div id="cfg-select-options-panel" style="${isSelect ? 'display:block;' : 'display:none;'} background:rgba(0,0,0,0.25);border:1px solid var(--border-subtle);border-radius:var(--radius-md);padding:1rem;">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.75rem;">
              <span style="font-size:0.8rem;font-weight:700;color:#38bdf8;text-transform:uppercase;letter-spacing:0.04em;">
                Dropdown Options (${field.options.length})
              </span>
              <span style="font-size:0.7rem;color:var(--text-subtle);">Click preset or add custom</span>
            </div>

            <!-- Quick Preset Chips -->
            <div style="margin-bottom:0.85rem;">
              <div style="font-size:0.7rem;color:var(--text-subtle);margin-bottom:0.35rem;">Load Quick Presets:</div>
              <div style="display:flex;gap:0.4rem;flex-wrap:wrap;">
                <button type="button" class="btn btn-outline preset-btn" data-preset="priority" style="font-size:0.7rem;padding:0.2rem 0.5rem;">
                  Urgency (Critical, High, Medium, Low)
                </button>
                <button type="button" class="btn btn-outline preset-btn" data-preset="status" style="font-size:0.7rem;padding:0.2rem 0.5rem;">
                  Approval (Approved, Conditionally Approved, Rejected)
                </button>
                <button type="button" class="btn btn-outline preset-btn" data-preset="terms" style="font-size:0.7rem;padding:0.2rem 0.5rem;">
                  Terms (Net 30, Net 60, Advance Deposit)
                </button>
                <button type="button" class="btn btn-outline preset-btn" data-preset="yn" style="font-size:0.7rem;padding:0.2rem 0.5rem;">
                  Yes / No / Exemption
                </button>
              </div>
            </div>

            <!-- Add Option Input Bar -->
            <div style="display:flex;gap:0.5rem;margin-bottom:0.75rem;">
              <input 
                type="text" 
                class="form-control" 
                id="cfg-new-opt-input" 
                placeholder="Type new option item..." 
                style="font-size:0.85rem;padding:0.4rem 0.65rem;"
              />
              <button type="button" class="btn btn-primary" id="cfg-add-opt-btn" style="font-size:0.8rem;padding:0.4rem 0.85rem;white-space:nowrap;">
                + Add Option
              </button>
            </div>

            <!-- Active Options List -->
            <div id="cfg-options-list" style="display:flex;flex-direction:column;gap:0.4rem;max-height:160px;overflow-y:auto;padding-right:0.25rem;">
              ${field.options.map((opt, oIdx) => `
                <div style="display:flex;align-items:center;justify-content:space-between;background:rgba(255,255,255,0.04);border:1px solid var(--border-subtle);border-radius:var(--radius-sm);padding:0.35rem 0.65rem;font-size:0.825rem;">
                  <span style="display:flex;align-items:center;gap:0.5rem;">
                    <span style="color:var(--text-subtle);font-family:var(--font-mono);font-size:0.7rem;">${oIdx + 1}.</span>
                    <span>${escapeHtml(opt)}</span>
                  </span>
                  <button type="button" class="icon-btn remove-opt-btn" data-opt-idx="${oIdx}" title="Remove" style="width:24px;height:24px;font-size:0.75rem;color:#ef4444;border:none;">✕</button>
                </div>
              `).join('')}
            </div>

            <!-- Real-time Live Preview -->
            <div style="margin-top:0.85rem;border-top:1px dashed var(--border-subtle);padding-top:0.65rem;">
              <span style="font-size:0.7rem;color:var(--text-subtle);display:block;margin-bottom:0.25rem;">Dropdown Live Preview:</span>
              <select class="form-control" style="font-size:0.85rem;padding:0.4rem 0.65rem;background:var(--bg-input);">
                <option value="">-- Select option --</option>
                ${field.options.map(opt => `<option value="${escapeHtml(opt)}">${escapeHtml(opt)}</option>`).join('')}
              </select>
            </div>
          </div>

          <!-- Placeholder Text -->
          <div class="field-group">
            <label class="field-label" for="cfg-placeholder">Placeholder / Help Cue</label>
            <input 
              type="text" 
              class="form-control" 
              id="cfg-placeholder" 
              value="${escapeHtml(field.placeholder || '')}" 
              placeholder="e.g. Choose appropriate category..." 
            />
          </div>

          <!-- Mandatory Toggle -->
          <div style="display:flex;align-items:center;gap:0.6rem;padding:0.5rem 0;">
            <input 
              type="checkbox" 
              id="cfg-required" 
              style="width:18px;height:18px;accent-color:var(--accent-primary);cursor:pointer;" 
              ${field.required ? 'checked' : ''} 
            />
            <label for="cfg-required" style="font-size:0.85rem;font-weight:600;cursor:pointer;">
              Make this field mandatory (Required before approval)
            </label>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" id="cfg-cancel-btn">Cancel</button>
          <button type="button" class="btn btn-primary" id="cfg-save-btn">
            ${initialField ? 'Update Field' : 'Add to Stage'}
          </button>
        </div>
      </div>
    `;

    bindEvents();
  }

  function bindEvents() {
    const close = () => {
      modal.remove();
      if (onCancel) onCancel();
    };

    modal.querySelector('#field-cfg-close').onclick = close;
    modal.querySelector('#cfg-cancel-btn').onclick = close;
    modal.onclick = (e) => {
      if (e.target === modal) close();
    };

    // Label change
    const labelInput = modal.querySelector('#cfg-label');
    labelInput.oninput = (e) => {
      field.label = e.target.value;
    };

    // Type change
    const typeSelect = modal.querySelector('#cfg-type');
    typeSelect.onchange = (e) => {
      field.type = e.target.value;
      if (field.type === 'select' && (!field.options || field.options.length === 0)) {
        field.options = ['Option 1', 'Option 2', 'Option 3'];
      }
      render();
    };

    // Placeholder change
    const phInput = modal.querySelector('#cfg-placeholder');
    phInput.oninput = (e) => {
      field.placeholder = e.target.value;
    };

    // Required checkbox
    const reqCheckbox = modal.querySelector('#cfg-required');
    reqCheckbox.onchange = (e) => {
      field.required = e.target.checked;
    };

    // Presets
    modal.querySelectorAll('.preset-btn').forEach(btn => {
      btn.onclick = () => {
        const preset = btn.getAttribute('data-preset');
        if (preset === 'priority') {
          field.options = ['Critical / Production Blocker', 'High Priority (14 Days)', 'Medium Standard (30 Days)', 'Low Discretionary'];
        } else if (preset === 'status') {
          field.options = ['Approved without reservation', 'Conditionally Approved with Review', 'Requires Revisions', 'Rejected'];
        } else if (preset === 'terms') {
          field.options = ['Net 30 Days', 'Net 60 Days', '50% Deposit / 50% on Acceptance', 'Annual Advance'];
        } else if (preset === 'yn') {
          field.options = ['Yes - Verified and Compliant', 'No - Non-compliant', 'Waived by Executive Exception'];
        }
        render();
      };
    });

    // Add option
    const addOptInput = modal.querySelector('#cfg-new-opt-input');
    const addOptBtn = modal.querySelector('#cfg-add-opt-btn');

    const handleAddOption = () => {
      if (!addOptInput) return;
      const val = addOptInput.value.trim();
      if (!val) return;
      if (!field.options) field.options = [];
      field.options.push(val);
      render();
    };

    if (addOptBtn) addOptBtn.onclick = handleAddOption;
    if (addOptInput) {
      addOptInput.onkeydown = (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleAddOption();
        }
      };
    }

    // Remove option
    modal.querySelectorAll('.remove-opt-btn').forEach(btn => {
      btn.onclick = () => {
        const oIdx = parseInt(btn.getAttribute('data-opt-idx'));
        field.options.splice(oIdx, 1);
        render();
      };
    });

    // Save field
    modal.querySelector('#cfg-save-btn').onclick = () => {
      const finalLabel = (modal.querySelector('#cfg-label').value || '').trim();
      if (!finalLabel) {
        alert('Please enter a Field Label / Title.');
        modal.querySelector('#cfg-label').focus();
        return;
      }

      field.label = finalLabel;
      field.placeholder = (modal.querySelector('#cfg-placeholder').value || '').trim();
      field.required = modal.querySelector('#cfg-required').checked;

      if (field.type === 'select') {
        if (!field.options || field.options.length === 0) {
          alert('Please add at least one dropdown option.');
          return;
        }
      }

      modal.remove();
      if (onSave) onSave(field);
    };
  }

  document.body.appendChild(modal);
  render();
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
}
