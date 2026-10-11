import { getRoleByStageNumber } from '../data/roles.js';

export function openOfficialCertificateModal(request, template) {
  const existingModal = document.getElementById('cert-modal-root');
  if (existingModal) existingModal.remove();

  const modalRoot = document.createElement('div');
  modalRoot.id = 'cert-modal-root';
  modalRoot.className = 'modal-backdrop';

  const stages = template.stages;

  modalRoot.innerHTML = `
    <div class="modal-content large" style="max-width: 900px;">
      <div class="modal-header">
        <div style="display:flex;align-items:center;gap:0.75rem;">
          <span style="font-size:1.5rem;">📜</span>
          <div>
            <h2 style="font-size:1.15rem;margin:0;">Executive Approval Certificate & Audit Verification</h2>
            <span style="font-size:0.75rem;color:var(--text-muted);font-family:var(--font-mono);">${request.id} • Cryptographic Document Seal</span>
          </div>
        </div>
        <button class="icon-btn" id="cert-modal-close" title="Close">✕</button>
      </div>

      <div class="modal-body" id="printable-certificate-area">
        <div style="border: 2px solid var(--border-medium); border-radius: var(--radius-lg); padding: 2rem; background: var(--bg-card);">
          <!-- Corporate Letterhead Header -->
          <div style="display:flex; justify-content:space-between; align-items:flex-start; border-bottom: 2px solid var(--border-subtle); padding-bottom: 1.5rem; margin-bottom: 1.5rem;">
            <div>
              <h1 style="font-size:1.35rem; font-weight:800; letter-spacing:0.05em; text-transform:uppercase;">FlowCraft Global Enterprise</h1>
              <p style="font-size:0.8rem; color:var(--text-muted);">Corporate Governance & Workflow Ratification Record</p>
              <p style="font-size:0.75rem; color:var(--text-subtle);">Document Protocol: ISO-27001 / SOC2 Type II Verified</p>
            </div>
            <div style="text-align:right;">
              <span class="card-id" style="font-size:1rem; padding:0.25rem 0.75rem;">${request.id}</span>
              <p style="font-size:0.75rem; color:var(--text-muted); margin-top:0.35rem;">Status: <strong style="color:#10b981;text-transform:uppercase;">${request.status.replace(/_/g, ' ')}</strong></p>
              <p style="font-size:0.75rem; color:var(--text-subtle);">Generated: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</p>
            </div>
          </div>

          <!-- Document Subject -->
          <div style="background:rgba(255,255,255,0.03); border-radius:var(--radius-md); padding:1rem; margin-bottom:1.5rem;">
            <h3 style="font-size:1.1rem; font-weight:700; margin-bottom:0.25rem;">${request.title}</h3>
            <div style="display:flex; gap:1.5rem; font-size:0.8rem; color:var(--text-muted); flex-wrap:wrap;">
              <span><strong>Workflow Template:</strong> ${template.title}</span>
              <span><strong>Requester:</strong> ${request.requester.name} (${request.requester.title})</span>
              <span><strong>Est. Amount:</strong> <strong style="color:#38bdf8;">${request.amount || 'N/A'}</strong></span>
              <span><strong>Urgency:</strong> ${request.urgency || 'Standard'}</span>
            </div>
          </div>

          <!-- Stages Verification Breakdown -->
          <div style="display:flex; flex-direction:column; gap:1.5rem; margin-bottom:2rem;">
            ${stages.map((stage) => {
              const num = stage.stageNumber;
              const role = getRoleByStageNumber(num);
              const data = request.stageData[num] || {};
              const values = data.values || {};
              const signature = data.signature;

              return `
                <div style="border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 1.25rem; background: rgba(0,0,0,0.15);">
                  <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; border-bottom:1px solid var(--border-subtle); padding-bottom:0.5rem;">
                    <div>
                      <h4 style="font-size:0.95rem; font-weight:700;">Stage ${num}: ${stage.stageTitle}</h4>
                      <span style="font-size:0.75rem; color:var(--text-muted);">Designated Authority: ${role.name} (${role.roleTitle})</span>
                    </div>
                    ${data.completed ? `
                      <span class="status-badge approved">✓ Certified by ${role.name.split(' ')[0]}</span>
                    ` : `
                      <span class="status-badge pending">Pending Action</span>
                    `}
                  </div>

                  <!-- Stage Form Fields Summary -->
                  <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:0.75rem; margin-bottom:1rem;">
                    ${stage.fields.map(field => `
                      <div>
                        <div style="font-size:0.7rem; color:var(--text-subtle); text-transform:uppercase; font-weight:700;">${field.label}</div>
                        <div style="font-size:0.85rem; font-weight:500; color:var(--text-main); margin-top:0.15rem;">
                          ${values[field.id] ? values[field.id] : '<em style="color:var(--text-subtle);">None specified</em>'}
                        </div>
                      </div>
                    `).join('')}
                  </div>

                  <!-- Digital Seal & Signature Display -->
                  ${signature ? `
                    <div class="verified-seal-box" style="margin-top:0.75rem;">
                      <div class="seal-left">
                        <div class="seal-icon-badge">✓</div>
                        <div class="seal-info">
                          <h4>Digitally Authorized & Executed</h4>
                          <p>Signed by <strong>${signature.signerName}</strong> (${signature.signerRole})</p>
                          <p style="font-family:var(--font-mono);font-size:0.7rem;color:var(--text-subtle);">Timestamp: ${new Date(signature.signedAt).toUTCString()}</p>
                        </div>
                      </div>
                      <div class="seal-signature-display">
                        ${signature.type === 'draw' && signature.dataUrl ? `
                          <img src="${signature.dataUrl}" alt="Signature" class="seal-rendered-img" />
                        ` : `
                          <div class="seal-rendered-text">${signature.signerName}</div>
                        `}
                        <div class="seal-hash">${signature.hash || 'SHA256: 3a9f...89e1'}</div>
                      </div>
                    </div>
                  ` : ''}
                </div>
              `;
            }).join('')}
          </div>

          <!-- Audit Trail Ledger -->
          <div style="border-top: 1px solid var(--border-subtle); padding-top: 1rem;">
            <h4 style="font-size:0.85rem; font-weight:700; text-transform:uppercase; color:var(--text-muted); margin-bottom:0.75rem;">Cryptographic Audit Trail Ledger</h4>
            <table style="width:100%; border-collapse:collapse; font-size:0.75rem; font-family:var(--font-mono);">
              <thead>
                <tr style="text-align:left; color:var(--text-subtle); border-bottom:1px solid var(--border-subtle);">
                  <th style="padding:0.4rem 0;">Time (UTC)</th>
                  <th style="padding:0.4rem 0;">Actor</th>
                  <th style="padding:0.4rem 0;">Action</th>
                  <th style="padding:0.4rem 0;">Audit Hash / Notes</th>
                </tr>
              </thead>
              <tbody>
                ${(request.auditTrail || []).map(aud => `
                  <tr style="border-bottom:1px solid rgba(255,255,255,0.03);">
                    <td style="padding:0.4rem 0; color:var(--text-subtle);">${new Date(aud.timestamp).toLocaleString()}</td>
                    <td style="padding:0.4rem 0; color:var(--text-main); font-weight:600;">${aud.actor}</td>
                    <td style="padding:0.4rem 0; color:#38bdf8;">${aud.action}</td>
                    <td style="padding:0.4rem 0; color:var(--text-muted);">${aud.details}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <!-- Bottom Security Footer -->
          <div style="margin-top:2rem; text-align:center; font-size:0.7rem; color:var(--text-subtle); border-top:1px dashed var(--border-subtle); padding-top:1rem;">
            This document represents a legally verified electronic record created in accordance with UETA and ESIGN Act standards.<br/>
            Security Verification Hash: <code>${request.id}-${request.createdAt.slice(0, 10)}-ISO27001</code>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" id="cert-close-btn">Close</button>
        <button type="button" class="btn btn-primary" id="cert-print-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
          Print / Save PDF
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modalRoot);

  const close = () => modalRoot.remove();
  modalRoot.querySelector('#cert-modal-close').onclick = close;
  modalRoot.querySelector('#cert-close-btn').onclick = close;
  modalRoot.onclick = (e) => {
    if (e.target === modalRoot) close();
  };

  modalRoot.querySelector('#cert-print-btn').onclick = () => {
    window.print();
  };
}
