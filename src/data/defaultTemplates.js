/**
 * Default Pre-Built Enterprise Approval Workflow Templates
 */
export const DEFAULT_TEMPLATES = [
  {
    id: 'capex-procurement',
    title: 'Capital Expenditure & Hardware Procurement',
    category: 'Finance & Procurement',
    icon: '🖥️',
    description: 'High-value equipment requisition requiring operational sign-off, budget allocation, and executive authorization.',
    stages: [
      {
        stageNumber: 1,
        roleId: 'requester',
        stageTitle: 'Project Requisition & Scope',
        requiresSignature: false,
        fields: [
          {
            id: 'projectTitle',
            label: 'Project / Asset Title',
            type: 'text',
            required: true,
            placeholder: 'e.g. Next-Gen GPU Compute Cluster for ML Research'
          },
          {
            id: 'vendorName',
            label: 'Preferred Vendor',
            type: 'text',
            required: true,
            placeholder: 'e.g. Supermicro / NVIDIA Enterprise'
          },
          {
            id: 'estimatedBudget',
            label: 'Estimated Budget ($ USD)',
            type: 'currency',
            required: true,
            placeholder: '75,000'
          },
          {
            id: 'urgency',
            label: 'Requisition Urgency',
            type: 'select',
            required: true,
            options: ['Standard (30 Days)', 'High Priority (14 Days)', 'Critical / Production Blocker (48h)']
          },
          {
            id: 'businessJustification',
            label: 'Business & Technical Justification',
            type: 'textarea',
            required: true,
            placeholder: 'Explain why this expenditure is required and expected productivity or revenue gains...'
          }
        ]
      },
      {
        stageNumber: 2,
        roleId: 'manager',
        stageTitle: 'Operational Feasibility & Priority',
        requiresSignature: true,
        fields: [
          {
            id: 'costCenter',
            label: 'Assigned Department Cost Center',
            type: 'text',
            required: true,
            placeholder: 'CC-ENG-4402'
          },
          {
            id: 'operationalImpact',
            label: 'Operational Impact Assessment',
            type: 'select',
            required: true,
            options: ['Accelerates Core Product Roadmap', 'Replaces Failing Hardware', 'Experimental / Pilot Initiative']
          },
          {
            id: 'infrastructureReadiness',
            label: 'Rack / Power / Security Clearance Verified',
            type: 'select',
            required: true,
            options: ['Verified and Ready', 'Requires Auxiliary Cooling/Power Prep', 'Under Audit']
          },
          {
            id: 'managerNotes',
            label: 'Operations & Management Review Notes',
            type: 'textarea',
            required: true,
            placeholder: 'Evaluated team workload, downtime risk, and operational integration.'
          }
        ]
      },
      {
        stageNumber: 3,
        roleId: 'finance',
        stageTitle: 'Financial Audit & Budget Allocation',
        requiresSignature: true,
        fields: [
          {
            id: 'glAccountCode',
            label: 'General Ledger (GL) Asset Code',
            type: 'text',
            required: true,
            placeholder: 'GL-1520-CAPEX-HW'
          },
          {
            id: 'depreciationSchedule',
            label: 'Asset Depreciation Schedule',
            type: 'select',
            required: true,
            options: ['3-Year Straight-Line', '5-Year Modified Accelerated (MACRS)', 'Immediate 100% Expensing']
          },
          {
            id: 'paymentTerms',
            label: 'Vendor Payment Terms',
            type: 'select',
            required: true,
            options: ['Net 30 Days', '50% Deposit / 50% on Delivery Acceptance', 'Annual Installments']
          },
          {
            id: 'financeAuditNotes',
            label: 'CFO Financial Risk & Cash-Flow Impact Note',
            type: 'textarea',
            required: true,
            placeholder: 'Verified allocated Q3 budget headroom; expenditure falls within capital spend limits.'
          }
        ]
      },
      {
        stageNumber: 4,
        roleId: 'ceo',
        stageTitle: 'Executive Ratification & Corporate Authorization',
        requiresSignature: true,
        fields: [
          {
            id: 'strategicPriorityScore',
            label: 'Strategic Alignment Rating',
            type: 'select',
            required: true,
            options: ['Tier 1: Core Company Milestone', 'Tier 2: High Operational Value', 'Tier 3: Discretionary Growth']
          },
          {
            id: 'boardNotificationRequired',
            label: 'Requires Formal Board Notification (> $50k threshold)',
            type: 'select',
            required: true,
            options: ['Yes - Included in next board packet', 'No - Within delegated executive authority']
          },
          {
            id: 'ceoExecutiveMemo',
            label: 'President & CEO Executive Order / Directive',
            type: 'textarea',
            required: true,
            placeholder: 'Expenditure approved. Proceed with procurement purchase order issuance under executive signature.'
          }
        ]
      }
    ]
  },
  {
    id: 'executive-travel',
    title: 'High-Stakes Travel & Conference Authorization',
    category: 'HR & Operations',
    icon: '✈️',
    description: 'International travel and summit delegation authorization with safety, risk, and executive approval.',
    stages: [
      {
        stageNumber: 1,
        roleId: 'requester',
        stageTitle: 'Travel Itinerary & Purpose',
        requiresSignature: false,
        fields: [
          {
            id: 'destination',
            label: 'Destination City & Venue',
            type: 'text',
            required: true,
            placeholder: 'e.g. San Francisco, CA (Moscone Center - AI Global Summit)'
          },
          {
            id: 'travelDates',
            label: 'Departure & Return Dates',
            type: 'text',
            required: true,
            placeholder: 'Nov 12, 2026 – Nov 17, 2026'
          },
          {
            id: 'estimatedCost',
            label: 'Total Estimated Cost (Flight + Hotel + Per Diem)',
            type: 'currency',
            required: true,
            placeholder: '4,850'
          },
          {
            id: 'travelObjectives',
            label: 'Key Business Objectives & Speaking Engagements',
            type: 'textarea',
            required: true,
            placeholder: 'Keynote delivery and 4 high-value enterprise prospect meetings.'
          }
        ]
      },
      {
        stageNumber: 2,
        roleId: 'manager',
        stageTitle: 'Work Coverage & Department Endorsement',
        requiresSignature: true,
        fields: [
          {
            id: 'backupLead',
            label: 'Designated Backup Lead While Away',
            type: 'text',
            required: true,
            placeholder: 'e.g. Jordan Miller (Staff Engineer)'
          },
          {
            id: 'clientDeliverableImpact',
            label: 'Impact on Sprint / Client Deliverables',
            type: 'select',
            required: true,
            options: ['Zero Impact - Pre-planned sprint coverage', 'Minor - Sprint commitments adjusted', 'Remote availability maintained']
          },
          {
            id: 'managerTravelNotes',
            label: 'Department Lead Endorsement',
            type: 'textarea',
            required: true,
            placeholder: 'Confirmed delegation duties and travel calendar alignment.'
          }
        ]
      },
      {
        stageNumber: 3,
        roleId: 'finance',
        stageTitle: 'Per-Diem & Travel Insurance Validation',
        requiresSignature: true,
        fields: [
          {
            id: 'travelInsurancePolicy',
            label: 'Corporate Travel Insurance Policy Code',
            type: 'text',
            required: true,
            placeholder: 'INS-CORP-INTL-902'
          },
          {
            id: 'perDiemTier',
            label: 'Per-Diem Allowance Tier',
            type: 'select',
            required: true,
            options: ['Tier 1 High-Cost Metro ($140/day)', 'Tier 2 Standard Metro ($95/day)', 'Corporate Card Direct Expense']
          },
          {
            id: 'financeApprovalNotes',
            label: 'Travel Expense Policy Compliance Check',
            type: 'textarea',
            required: true,
            placeholder: 'Flight booking complies with standard economy-plus policy. Per-diem cap validated.'
          }
        ]
      },
      {
        stageNumber: 4,
        roleId: 'ceo',
        stageTitle: 'CEO Executive Mission Clearance',
        requiresSignature: true,
        fields: [
          {
            id: 'executiveMissionClearance',
            label: 'CEO Strategic Representation Endorsement',
            type: 'select',
            required: true,
            options: ['Approved as Official Company Representation', 'Conditional on securing partner introductions']
          },
          {
            id: 'ceoDirective',
            label: 'Executive Instructions / Expected Deliverables Post-Trip',
            type: 'textarea',
            required: true,
            placeholder: 'Prepare post-conference debrief presentation for executive leadership team within 5 days of return.'
          }
        ]
      }
    ]
  },
  {
    id: 'contract-review',
    title: 'Strategic Vendor Contract & Master SLA',
    category: 'Legal & Contracts',
    icon: '📜',
    description: 'Multi-party vendor contract review including legal risk, liability caps, and CEO corporate binding execution.',
    stages: [
      {
        stageNumber: 1,
        roleId: 'requester',
        stageTitle: 'Contract Scope & Vendor Details',
        requiresSignature: false,
        fields: [
          {
            id: 'counterpartyLegalName',
            label: 'Counterparty / Vendor Legal Entity Name',
            type: 'text',
            required: true,
            placeholder: 'e.g. CloudScale Data Systems Inc.'
          },
          {
            id: 'contractType',
            label: 'Agreement Type',
            type: 'select',
            required: true,
            options: ['Master Services Agreement (MSA)', 'Enterprise Software License (SaaS)', 'Data Processing Agreement (DPA)', 'Joint Venture NDA']
          },
          {
            id: 'annualContractValue',
            label: 'Annual Contract Value ($ USD)',
            type: 'currency',
            required: true,
            placeholder: '120,000'
          },
          {
            id: 'contractTerm',
            label: 'Contract Duration',
            type: 'select',
            required: true,
            options: ['12 Months with Auto-Renewal', '24 Months Fixed', '36 Months Multi-Year Discount', 'Month-to-Month']
          },
          {
            id: 'scopeDescription',
            label: 'Scope of Services & Key Deliverables',
            type: 'textarea',
            required: true,
            placeholder: 'Enterprise database hosting, 99.99% uptime SLA, and 24/7 dedicated support escalation.'
          }
        ]
      },
      {
        stageNumber: 2,
        roleId: 'manager',
        stageTitle: 'Technical Review & SLA Requirements',
        requiresSignature: true,
        fields: [
          {
            id: 'slaVerification',
            label: 'SLA Minimum Uptime Requirement',
            type: 'select',
            required: true,
            options: ['99.99% (Under 4.3 mins downtime/month)', '99.9% (Under 43 mins downtime/month)', 'Business Hours Only']
          },
          {
            id: 'dataSecurityClass',
            label: 'Data Classification Handled by Vendor',
            type: 'select',
            required: true,
            options: ['Tier 1 Confidential / PII & Customer Financials', 'Tier 2 Internal Business Data', 'Tier 3 Public Marketing Data']
          },
          {
            id: 'opsReviewComment',
            label: 'Technical Diligence Sign-off',
            type: 'textarea',
            required: true,
            placeholder: 'SOC2 Type II report received and reviewed by security lead. Architecture approved.'
          }
        ]
      },
      {
        stageNumber: 3,
        roleId: 'finance',
        stageTitle: 'Legal Liability & Payment Terms Audit',
        requiresSignature: true,
        fields: [
          {
            id: 'liabilityCap',
            label: 'Limitation of Liability Cap Clause',
            type: 'select',
            required: true,
            options: ['12 Months Fees Paid (Standard)', '2x Annual Fees Paid (Enhanced)', 'Uncapped for Data Breach/Indemnity']
          },
          {
            id: 'billingCadence',
            label: 'Billing & Invoicing Cadence',
            type: 'select',
            required: true,
            options: ['Quarterly in Arrears', 'Annual Upfront with 15% Discount', 'Monthly Net 30']
          },
          {
            id: 'legalFinanceNotes',
            label: 'Legal & Fiscal Controller Audit Findings',
            type: 'textarea',
            required: true,
            placeholder: 'Indemnification clause negotiated to mutual standard. Governed under Delaware law with arbitration clause.'
          }
        ]
      },
      {
        stageNumber: 4,
        roleId: 'ceo',
        stageTitle: 'CEO Master Execution & Corporate Seal',
        requiresSignature: true,
        fields: [
          {
            id: 'signingAuthorityScope',
            label: 'Executive Signing Authority Confirmation',
            type: 'select',
            required: true,
            options: ['Full Corporate Authority under Bylaws', 'Authorized via Board Resolution #2026-B']
          },
          {
            id: 'ceoExecutiveMemo',
            label: 'CEO Final Execution Ratification',
            type: 'textarea',
            required: true,
            placeholder: 'Contract terms accepted. Authorized for electronic execution under corporate seal.'
          }
        ]
      }
    ]
  }
];
