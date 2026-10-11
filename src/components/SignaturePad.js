/**
 * Interactive Digital Signature Pad Component
 * Supports touch/mouse drawing, one-click Adopt & Sign, and cursive typed signature.
 */
export class SignaturePad {
  constructor({ containerId, signerName, onUpdate }) {
    this.container = document.getElementById(containerId);
    this.signerName = signerName || '';
    this.onUpdate = onUpdate || (() => {});
    this.mode = 'draw'; // 'draw' or 'type'
    this.isDrawing = false;
    this.hasDrawn = false;
    this.points = [];
    this.render();
  }

  render() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="signature-pad-container">
        <div class="signature-header">
          <span class="signature-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>
            Digital Sign-Off Authorization
          </span>
          <div class="signature-tabs">
            <button type="button" class="tab-btn ${this.mode === 'draw' ? 'active' : ''}" id="sig-mode-draw">Draw</button>
            <button type="button" class="tab-btn ${this.mode === 'type' ? 'active' : ''}" id="sig-mode-type">Type</button>
          </div>
        </div>

        <div id="sig-draw-pane" style="${this.mode === 'draw' ? 'display:block' : 'display:none'}">
          <canvas class="signature-canvas" id="sig-canvas" width="600" height="130"></canvas>
          <div class="signature-pad-toolbar">
            <div style="display:flex;align-items:center;gap:0.5rem;">
              <button type="button" class="btn btn-secondary" style="padding:0.3rem 0.75rem;font-size:0.75rem;background:rgba(99,102,241,0.15);border-color:#6366f1;color:#a5b4fc;" id="sig-adopt-btn">
                ✍️ Auto-Stamp Cursive Seal
              </button>
              <span class="signature-helper-text" id="sig-status-msg">Draw or stamp certified signature</span>
            </div>
            <button type="button" class="btn btn-secondary" style="padding:0.25rem 0.6rem;font-size:0.75rem;" id="sig-clear-btn">Clear</button>
          </div>
        </div>

        <div id="sig-type-pane" style="${this.mode === 'type' ? 'display:block' : 'display:none'}">
          <div class="typed-signature-preview" id="sig-typed-preview">${this.escape(this.signerName)}</div>
          <div class="signature-pad-toolbar" style="margin-top:0.5rem;">
            <input type="text" class="form-control" id="sig-type-input" value="${this.escape(this.signerName)}" placeholder="Type full legal name..." style="font-size:0.85rem;padding:0.4rem 0.6rem;" />
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    const drawTab = this.container.querySelector('#sig-mode-draw');
    const typeTab = this.container.querySelector('#sig-mode-type');
    const clearBtn = this.container.querySelector('#sig-clear-btn');
    const adoptBtn = this.container.querySelector('#sig-adopt-btn');
    const typeInput = this.container.querySelector('#sig-type-input');
    const typedPreview = this.container.querySelector('#sig-typed-preview');
    this.canvas = this.container.querySelector('#sig-canvas');

    if (drawTab) {
      drawTab.onclick = () => {
        this.mode = 'draw';
        this.render();
      };
    }

    if (typeTab) {
      typeTab.onclick = () => {
        this.mode = 'type';
        this.render();
      };
    }

    if (clearBtn) {
      clearBtn.onclick = () => {
        this.clearCanvas();
      };
    }

    if (adoptBtn) {
      adoptBtn.onclick = () => {
        this.stampCursiveSignature();
      };
    }

    if (typeInput) {
      typeInput.oninput = (e) => {
        this.signerName = e.target.value;
        if (typedPreview) typedPreview.textContent = this.signerName || '(Type name)';
        this.onUpdate();
      };
    }

    if (this.canvas) {
      this.ctx = this.canvas.getContext('2d');
      this.setupCanvas();
    }
  }

  setupCanvas() {
    const canvas = this.canvas;
    const ctx = this.ctx;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = (rect.width || 560) * dpr;
    canvas.height = 120 * dpr;
    ctx.scale(dpr, dpr);

    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const getPos = (e) => {
      const b = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: clientX - b.left,
        y: clientY - b.top
      };
    };

    const start = (e) => {
      e.preventDefault();
      this.isDrawing = true;
      this.hasDrawn = true;
      const pos = getPos(e);
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
      this.points = [pos];
    };

    const move = (e) => {
      if (!this.isDrawing) return;
      e.preventDefault();
      const pos = getPos(e);
      this.points.push(pos);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    };

    const stop = () => {
      if (!this.isDrawing) return;
      this.isDrawing = false;
      this.onUpdate();
    };

    canvas.addEventListener('mousedown', start);
    canvas.addEventListener('mousemove', move);
    window.addEventListener('mouseup', stop);

    canvas.addEventListener('touchstart', start, { passive: false });
    canvas.addEventListener('touchmove', move, { passive: false });
    window.addEventListener('touchend', stop);
  }

  stampCursiveSignature() {
    if (!this.canvas || !this.ctx) return;
    const ctx = this.ctx;
    const dpr = window.devicePixelRatio || 1;
    ctx.clearRect(0, 0, this.canvas.width / dpr, this.canvas.height / dpr);

    ctx.font = '34px Caveat, cursive';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText(this.signerName || 'Verified Signer', 30, 70);

    // Decorative underline
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(25, 85);
    ctx.bezierCurveTo(120, 95, 200, 75, 300, 88);
    ctx.stroke();

    this.hasDrawn = true;
    const statusMsg = this.container.querySelector('#sig-status-msg');
    if (statusMsg) {
      statusMsg.textContent = '✓ Digital Signature Certified & Affixed';
      statusMsg.style.color = '#10b981';
      statusMsg.style.fontWeight = '700';
    }
    this.onUpdate();
  }

  clearCanvas() {
    if (!this.canvas || !this.ctx) return;
    const dpr = window.devicePixelRatio || 1;
    this.ctx.clearRect(0, 0, this.canvas.width / dpr, this.canvas.height / dpr);
    this.hasDrawn = false;
    const statusMsg = this.container.querySelector('#sig-status-msg');
    if (statusMsg) {
      statusMsg.textContent = 'Draw or stamp certified signature';
      statusMsg.style.color = '';
    }
    this.onUpdate();
  }

  isValid() {
    if (this.mode === 'draw') {
      return this.hasDrawn || Boolean(this.signerName && this.signerName.trim().length >= 2);
    }
    return Boolean(this.signerName && this.signerName.trim().length >= 2);
  }

  getSignatureData() {
    if (this.mode === 'draw') {
      if (!this.hasDrawn) {
        this.stampCursiveSignature();
      }
      return {
        type: 'draw',
        dataUrl: this.canvas ? this.canvas.toDataURL('image/png') : ''
      };
    }
    return {
      type: 'type',
      typedName: this.signerName.trim()
    };
  }

  escape(str) {
    if (!str) return '';
    return str.replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  }
}
