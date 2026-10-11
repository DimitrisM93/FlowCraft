/**
 * FlowCraft Team Personas for Role Simulation
 */
export const ROLES = [
  {
    id: 'requester',
    name: 'Alice Chen',
    title: 'Lead Product Engineer',
    department: 'Engineering & R&D',
    email: 'alice.chen@enterprise.io',
    avatar: 'AC',
    color: '#3b82f6',
    stageNumber: 1,
    roleTitle: 'Requester / Initiator',
    description: 'Fills out project requirements, justification, and estimated costs to submit requests.'
  },
  {
    id: 'manager',
    name: 'Marcus Vance',
    title: 'VP of Operations',
    department: 'Operations & Facilities',
    email: 'marcus.vance@enterprise.io',
    avatar: 'MV',
    color: '#8b5cf6',
    stageNumber: 2,
    roleTitle: 'Department Head / VP',
    description: 'Reviews operational viability, assigns cost center, evaluates risks, and signs.'
  },
  {
    id: 'finance',
    name: 'Sarah Jenkins',
    title: 'Chief Financial Officer (CFO)',
    department: 'Corporate Finance & Tax',
    email: 'sarah.jenkins@enterprise.io',
    avatar: 'SJ',
    color: '#06b6d4',
    stageNumber: 3,
    roleTitle: 'Finance & Compliance Director',
    description: 'Audits GL accounts, payment schedules, tax compliance, and approves budget lines.'
  },
  {
    id: 'ceo',
    name: 'Elena Rostova',
    title: 'Chief Executive Officer (CEO)',
    department: 'Executive Office & Board',
    email: 'elena.rostova@enterprise.io',
    avatar: 'ER',
    color: '#f59e0b',
    stageNumber: 4,
    roleTitle: 'Chief Executive Officer',
    description: 'Reviews all prior approvals, adds strategic alignment notes, and executes final authorization seal.'
  }
];

export function getRoleById(roleId) {
  return ROLES.find(r => r.id === roleId) || ROLES[0];
}

export function getRoleByStageNumber(stageNumber) {
  return ROLES.find(r => r.stageNumber === stageNumber) || ROLES[ROLES.length - 1];
}
