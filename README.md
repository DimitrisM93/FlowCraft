# FlowCraft ✍️⚡

> **Progressive Web App for Sequential Multi-Stage Form Approvals & Cryptographic Digital Sign-Offs**

FlowCraft is an enterprise-grade PWA designed for strict hierarchical approval pipelines. Requisitions move sequentially across defined organizational stages—from Initiator to Department Lead, Finance Controller, and Executive/CEO—with stage-partitioned field ownership, interactive digital signatures, custom fields with dropdown options, and an immutable audit trail.

---

## 🌟 Key Features

- **Sequential Stage Progression**: Forms move forward step-by-step:
  $$\text{Requester} \longrightarrow \text{VP of Operations} \longrightarrow \text{Chief Financial Officer (CFO)} \longrightarrow \text{Chief Executive Officer (CEO)}$$
- **Stage-Partitioned Field Permissions**:
  - **Completed Stages**: Past inputs are locked into tamper-proof read-only cards bearing certified digital seals and cryptographic hashes.
  - **Active Stage**: Inputs are unlocked and interactive only when viewing as the assigned approver persona.
  - **Future Stages**: Dimmed and locked until preceding reviews are fully executed.
- **Interactive Digital Signature Pad**:
  - Touch/mouse/stylus drawing on canvas with cubic bezier smoothing.
  - Certified cursive typed signature mode.
  - 1-click **Auto-Stamp Cursive Seal** using authenticated corporate credentials.
  - Cryptographic verification hashing (`SHA-256`) and UTC timestamps.
- **Custom Fields & Dynamic Dropdown Builder**:
  - Build custom fields per stage with types: Dropdown (Select), Single-line Text, Multi-line Text Area, Currency ($ USD), Number, Date.
  - Dedicated **Dropdown Options Manager** with quick preset packs (*Urgency, Decisions, Payment Terms, Compliance*) and live preview.
  - Add custom fields on the fly in the Visual Workflow Designer, during new request creation, or right on an active review card.
- **Instant Role Switcher Dock**:
  - Switch on the fly between **Alice Chen** (Requester), **Marcus Vance** (VP Operations), **Sarah Jenkins** (CFO), and **Elena Rostova** (CEO) with real-time pending task counter badges.
- **Official Executive Certificate & Audit Ledger**:
  - Generate official corporate governance ratification documents formatted for executive presentation and PDF print generation.
- **PWA & Offline First**:
  - Native standalone installation prompt.
  - Service worker caching for offline access.
  - Dark and light theme switcher with responsive modern design.

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/DimitrisM93/FlowCraft.git
cd FlowCraft

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
npm run build
npm run preview
```

---

## 🏢 Pre-Built Workflow Templates

1. **Capital Expenditure (Capex) & Hardware Procurement**:
   - High-throughput GPU compute clusters, network appliances, and infrastructure requisitions.
2. **High-Stakes Travel & Conference Authorization**:
   - Delegation trips, client meetings, travel insurance validation, and per-diem allowances.
3. **Strategic Vendor Contract & Master SLA**:
   - Multi-year enterprise SaaS/MSA agreements, limitation of liability clauses, and CEO execution authority.
4. **Custom Workflow Designer**:
   - Create custom sequential workflows with any number of stages, custom fields, and dropdown select menus.

---

## 📄 License

MIT License. Designed and built with FlowCraft.
