/**
 * Mock Requests Initial Data to showcase each approval stage
 */
export const INITIAL_REQUESTS = [
  {
    id: 'REQ-2026-081',
    templateId: 'capex-procurement',
    title: 'High-Throughput ML Training Cluster (8x H100 GPUs)',
    urgency: 'Critical / Production Blocker (48h)',
    amount: '$148,500',
    currentStageNumber: 2, // Waiting for Stage 2 (Marcus Vance / VP Operations)
    status: 'pending_stage_2', // 'draft', 'pending_stage_2', 'pending_stage_3', 'pending_stage_4', 'approved', 'rejected', 'revision_requested'
    createdAt: '2026-10-10T09:15:00.000Z',
    updatedAt: '2026-10-10T09:30:00.000Z',
    requester: {
      id: 'requester',
      name: 'Alice Chen',
      title: 'Lead Product Engineer',
      email: 'alice.chen@enterprise.io'
    },
    stageData: {
      1: {
        completed: true,
        completedAt: '2026-10-10T09:30:00.000Z',
        completedBy: {
          id: 'requester',
          name: 'Alice Chen',
          title: 'Lead Product Engineer'
        },
        values: {
          projectTitle: 'High-Throughput ML Training Cluster (8x H100 GPUs)',
          vendorName: 'NVIDIA Enterprise Direct / Supermicro Systems',
          estimatedBudget: '148,500',
          urgency: 'Critical / Production Blocker (48h)',
          businessJustification: 'Current model training runs take over 96 hours on legacy hardware. This new cluster reduces fine-tuning epochs to 11 hours, unblocking our Q4 Autonomous Workflow release.'
        },
        signature: null
      },
      2: {
        completed: false,
        values: {
          costCenter: 'CC-AI-INFRA-802',
          operationalImpact: 'Accelerates Core Product Roadmap',
          infrastructureReadiness: 'Verified and Ready',
          managerNotes: ''
        },
        signature: null
      },
      3: {
        completed: false,
        values: {
          glAccountCode: 'GL-1520-CAPEX-HW',
          depreciationSchedule: '3-Year Straight-Line',
          paymentTerms: 'Net 30 Days',
          financeAuditNotes: 'Audited against Q3 capital allocation budget. Approved within guidelines.'
        },
        signature: null
      },
      4: {
        completed: false,
        values: {
          strategicPriorityScore: 'Tier 1: Core Company Milestone',
          boardNotificationRequired: 'Yes - Included in next board packet',
          ceoExecutiveMemo: 'High-priority compute cluster approved for immediate purchase order processing.'
        },
        signature: null
      }
    },
    auditTrail: [
      {
        id: 'aud-1',
        timestamp: '2026-10-10T09:15:00.000Z',
        actor: 'Alice Chen (Lead Product Engineer)',
        action: 'Created Requisition Draft',
        details: 'Initial specification of 8x H100 GPU compute rack entered.'
      },
      {
        id: 'aud-2',
        timestamp: '2026-10-10T09:30:00.000Z',
        actor: 'Alice Chen (Lead Product Engineer)',
        action: 'Submitted & Forwarded to Stage 2',
        details: 'Requisition finalized and routed to Marcus Vance (VP Operations) for operational review.'
      }
    ]
  },
  {
    id: 'REQ-2026-082',
    templateId: 'executive-travel',
    title: 'Delegation to Global AI Governance Summit (San Francisco)',
    urgency: 'Standard (30 Days)',
    amount: '$5,420',
    currentStageNumber: 3, // Waiting for Stage 3 (Sarah Jenkins / CFO)
    status: 'pending_stage_3',
    createdAt: '2026-10-09T14:20:00.000Z',
    updatedAt: '2026-10-10T11:45:00.000Z',
    requester: {
      id: 'requester',
      name: 'Alice Chen',
      title: 'Lead Product Engineer',
      email: 'alice.chen@enterprise.io'
    },
    stageData: {
      1: {
        completed: true,
        completedAt: '2026-10-09T14:45:00.000Z',
        completedBy: {
          id: 'requester',
          name: 'Alice Chen',
          title: 'Lead Product Engineer'
        },
        values: {
          destination: 'San Francisco, CA (Moscone Center)',
          travelDates: 'Nov 12, 2026 – Nov 16, 2026',
          estimatedCost: '5,420',
          travelObjectives: 'Invited to deliver a 45-minute keynote on automated compliance pipelines; hosting 3 customer advisory council sessions.'
        },
        signature: null
      },
      2: {
        completed: true,
        completedAt: '2026-10-10T11:45:00.000Z',
        completedBy: {
          id: 'manager',
          name: 'Marcus Vance',
          title: 'VP of Operations'
        },
        values: {
          backupLead: 'Jordan Miller (Staff Architect)',
          clientDeliverableImpact: 'Zero Impact - Pre-planned sprint coverage',
          managerTravelNotes: 'Fully endorsed. Alice\'s keynote gives strong corporate visibility. Jordan Miller will step in for sprint triage during the 4 travel days.'
        },
        signature: {
          type: 'draw',
          signerName: 'Marcus Vance',
          signerRole: 'VP of Operations',
          signedAt: '2026-10-10T11:45:00.000Z',
          hash: 'SHA256: 7f8a3c9b...e4a19d',
          signatureData: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="50"><text x="10" y="35" font-family="Caveat" font-size="28" fill="%2338bdf8">Marcus Vance</text></svg>'
        }
      },
      3: {
        completed: false,
        values: {
          travelInsurancePolicy: 'INS-CORP-INTL-902',
          perDiemTier: 'Tier 1 High-Cost Metro ($140/day)',
          financeApprovalNotes: ''
        },
        signature: null
      },
      4: {
        completed: false,
        values: {
          executiveMissionClearance: '',
          ceoDirective: ''
        },
        signature: null
      }
    },
    auditTrail: [
      {
        id: 'aud-201',
        timestamp: '2026-10-09T14:45:00.000Z',
        actor: 'Alice Chen (Lead Product Engineer)',
        action: 'Travel Form Submitted',
        details: 'Routed to Marcus Vance for team coverage endorsement.'
      },
      {
        id: 'aud-202',
        timestamp: '2026-10-10T11:45:00.000Z',
        actor: 'Marcus Vance (VP Operations)',
        action: 'Approved & Digitally Signed (Stage 2)',
        details: 'Verified backup engineering lead. Forwarded to Sarah Jenkins (CFO) for per-diem and travel insurance clearance.'
      }
    ]
  },
  {
    id: 'REQ-2026-083',
    templateId: 'contract-review',
    title: 'CloudScale SLA & Enterprise Multi-Region Hosting Agreement',
    urgency: 'High Priority (14 Days)',
    amount: '$180,000 / yr',
    currentStageNumber: 4, // Waiting for CEO Elena Rostova!
    status: 'pending_stage_4',
    createdAt: '2026-10-08T10:00:00.000Z',
    updatedAt: '2026-10-11T14:10:00.000Z',
    requester: {
      id: 'requester',
      name: 'Alice Chen',
      title: 'Lead Product Engineer',
      email: 'alice.chen@enterprise.io'
    },
    stageData: {
      1: {
        completed: true,
        completedAt: '2026-10-08T10:30:00.000Z',
        completedBy: {
          id: 'requester',
          name: 'Alice Chen',
          title: 'Lead Product Engineer'
        },
        values: {
          counterpartyLegalName: 'CloudScale Data Systems Inc.',
          contractType: 'Master Services Agreement (MSA)',
          annualContractValue: '180,000',
          contractTerm: '24 Months Fixed',
          scopeDescription: 'Multi-region Kubernetes hosting, guaranteed 99.99% uptime with financial penalties, and SOC2 compliant data storage.'
        },
        signature: null
      },
      2: {
        completed: true,
        completedAt: '2026-10-09T16:20:00.000Z',
        completedBy: {
          id: 'manager',
          name: 'Marcus Vance',
          title: 'VP of Operations'
        },
        values: {
          slaVerification: '99.99% (Under 4.3 mins downtime/month)',
          dataSecurityClass: 'Tier 1 Confidential / PII & Customer Financials',
          opsReviewComment: 'Architecture team completed penetration test report review. Redundancy across US-East and EU-West meets our enterprise standard.'
        },
        signature: {
          type: 'draw',
          signerName: 'Marcus Vance',
          signerRole: 'VP of Operations',
          signedAt: '2026-10-09T16:20:00.000Z',
          hash: 'SHA256: 4e91bc78...a991f2',
          signatureData: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="50"><text x="10" y="35" font-family="Caveat" font-size="28" fill="%2338bdf8">Marcus Vance</text></svg>'
        }
      },
      3: {
        completed: true,
        completedAt: '2026-10-11T14:10:00.000Z',
        completedBy: {
          id: 'finance',
          name: 'Sarah Jenkins',
          title: 'Chief Financial Officer (CFO)'
        },
        values: {
          liabilityCap: '2x Annual Fees Paid (Enhanced)',
          billingCadence: 'Quarterly in Arrears',
          legalFinanceNotes: 'Successfully negotiated liability cap from 1x to 2x annual contract fees. Quarterly billing preserves operational working capital. Legal counsel confirms compliance with GDPR & HIPAA.'
        },
        signature: {
          type: 'draw',
          signerName: 'Sarah Jenkins',
          signerRole: 'Chief Financial Officer',
          signedAt: '2026-10-11T14:10:00.000Z',
          hash: 'SHA256: 9b2d38fa...01c4e7',
          signatureData: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="50"><text x="10" y="35" font-family="Caveat" font-size="28" fill="%2338bdf8">Sarah Jenkins</text></svg>'
        }
      },
      4: {
        completed: false,
        values: {
          signingAuthorityScope: 'Full Corporate Authority under Bylaws',
          ceoExecutiveMemo: ''
        },
        signature: null
      }
    },
    auditTrail: [
      {
        id: 'aud-301',
        timestamp: '2026-10-08T10:30:00.000Z',
        actor: 'Alice Chen (Lead Product Engineer)',
        action: 'Contract Request Initiated',
        details: 'Routed to Marcus Vance for technical & SLA diligence.'
      },
      {
        id: 'aud-302',
        timestamp: '2026-10-09T16:20:00.000Z',
        actor: 'Marcus Vance (VP Operations)',
        action: 'Stage 2 Technical Review Signed',
        details: 'Validated 99.99% uptime guarantee and forwarded to Sarah Jenkins (CFO).'
      },
      {
        id: 'aud-303',
        timestamp: '2026-10-11T14:10:00.000Z',
        actor: 'Sarah Jenkins (CFO)',
        action: 'Stage 3 Fiscal & Legal Audit Signed',
        details: 'Approved enhanced liability cap. Forwarded to Elena Rostova (CEO) for final corporate execution.'
      }
    ]
  },
  {
    id: 'REQ-2026-075',
    templateId: 'capex-procurement',
    title: 'Enterprise Security Operations Center (SOC) Log Ingestion Appliances',
    urgency: 'High Priority (14 Days)',
    amount: '$92,000',
    currentStageNumber: 4,
    status: 'approved', // Completely approved by CEO!
    createdAt: '2026-10-01T08:00:00.000Z',
    updatedAt: '2026-10-04T17:30:00.000Z',
    requester: {
      id: 'requester',
      name: 'Alice Chen',
      title: 'Lead Product Engineer',
      email: 'alice.chen@enterprise.io'
    },
    stageData: {
      1: {
        completed: true,
        completedAt: '2026-10-01T08:30:00.000Z',
        completedBy: {
          id: 'requester',
          name: 'Alice Chen',
          title: 'Lead Product Engineer'
        },
        values: {
          projectTitle: 'Enterprise SOC Log Ingestion Appliances',
          vendorName: 'Palo Alto Networks / Splunk Inc.',
          estimatedBudget: '92,000',
          urgency: 'High Priority (14 Days)',
          businessJustification: 'Mandatory security appliance renewal to preserve ISO 27001 compliance audit trail and real-time intrusion monitoring.'
        },
        signature: null
      },
      2: {
        completed: true,
        completedAt: '2026-10-02T10:15:00.000Z',
        completedBy: {
          id: 'manager',
          name: 'Marcus Vance',
          title: 'VP of Operations'
        },
        values: {
          costCenter: 'CC-SEC-1002',
          operationalImpact: 'Accelerates Core Product Roadmap',
          infrastructureReadiness: 'Verified and Ready',
          managerNotes: 'Operational review confirms urgent hardware refresh. All network switch ports provisioned.'
        },
        signature: {
          type: 'draw',
          signerName: 'Marcus Vance',
          signerRole: 'VP of Operations',
          signedAt: '2026-10-02T10:15:00.000Z',
          hash: 'SHA256: a1b2c3d4...987654',
          signatureData: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="50"><text x="10" y="35" font-family="Caveat" font-size="28" fill="%2338bdf8">Marcus Vance</text></svg>'
        }
      },
      3: {
        completed: true,
        completedAt: '2026-10-03T15:40:00.000Z',
        completedBy: {
          id: 'finance',
          name: 'Sarah Jenkins',
          title: 'Chief Financial Officer (CFO)'
        },
        values: {
          glAccountCode: 'GL-1530-SEC-INFRA',
          depreciationSchedule: '3-Year Straight-Line',
          paymentTerms: 'Net 30 Days',
          financeAuditNotes: 'Audited against annual IT CapEx envelope. Favorable bulk discount secured.'
        },
        signature: {
          type: 'draw',
          signerName: 'Sarah Jenkins',
          signerRole: 'Chief Financial Officer',
          signedAt: '2026-10-03T15:40:00.000Z',
          hash: 'SHA256: d5e6f7a8...123456',
          signatureData: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="50"><text x="10" y="35" font-family="Caveat" font-size="28" fill="%2338bdf8">Sarah Jenkins</text></svg>'
        }
      },
      4: {
        completed: true,
        completedAt: '2026-10-04T17:30:00.000Z',
        completedBy: {
          id: 'ceo',
          name: 'Elena Rostova',
          title: 'Chief Executive Officer (CEO)'
        },
        values: {
          strategicPriorityScore: 'Tier 1: Core Company Milestone',
          boardNotificationRequired: 'Yes - Included in next board packet',
          ceoExecutiveMemo: 'Final executive authorization granted. Compliance and information security are paramount.'
        },
        signature: {
          type: 'draw',
          signerName: 'Elena Rostova',
          signerRole: 'Chief Executive Officer',
          signedAt: '2026-10-04T17:30:00.000Z',
          hash: 'SHA256: 0a9b8c7d...ef1234',
          signatureData: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="50"><text x="10" y="35" font-family="Caveat" font-size="28" fill="%2338bdf8">Elena Rostova</text></svg>'
        }
      }
    },
    auditTrail: [
      {
        id: 'aud-401',
        timestamp: '2026-10-01T08:30:00.000Z',
        actor: 'Alice Chen (Lead Product Engineer)',
        action: 'Requisition Submitted',
        details: 'Routed to Marcus Vance.'
      },
      {
        id: 'aud-402',
        timestamp: '2026-10-02T10:15:00.000Z',
        actor: 'Marcus Vance (VP Operations)',
        action: 'Stage 2 Approved & Signed',
        details: 'Forwarded to Sarah Jenkins.'
      },
      {
        id: 'aud-403',
        timestamp: '2026-10-03T15:40:00.000Z',
        actor: 'Sarah Jenkins (CFO)',
        action: 'Stage 3 Approved & Signed',
        details: 'Forwarded to Elena Rostova.'
      },
      {
        id: 'aud-404',
        timestamp: '2026-10-04T17:30:00.000Z',
        actor: 'Elena Rostova (CEO)',
        action: 'FINAL EXECUTIVE APPROVAL GRANTED',
        details: 'Master Corporate Authorization Seal affixed. Purchase Order issued.'
      }
    ]
  }
];
