export type ShowcaseApprovalState = "draft" | "pending" | "approved" | "rejected";

export type ShowcaseItem = {
  id: string;
  name: string;
  type: "record" | "document" | "repo" | "link";
  project: string;
  source: string;
  status: "active" | "draft" | "pending" | "archived";
  approvalState: ShowcaseApprovalState;
  retentionPolicy?: string;
  legalHold: boolean;
  complianceTags: string[];
  lastUpdated: string;
  url?: string;
};

export type ShowcaseAuditEvent = {
  time: string;
  action: string;
  itemId: string;
  env: string;
  actor: string;
};

export type ShowcaseEnvironment = {
  id: string;
  name: string;
  sector: string;
  items: ShowcaseItem[];
  audit: ShowcaseAuditEvent[];
};

export const SHOWCASE_ROLES = ["viewer", "clerk", "chair", "auditor"] as const;

export const SHOWCASE_ENVIRONMENTS: ShowcaseEnvironment[] = [
  {
    id: "municipal",
    name: "Municipal Demo",
    sector: "Town Governance",
    items: [
      {
        id: "m-1",
        name: "BoardMinutes_2026-01-10",
        type: "record",
        project: "Governance",
        source: "SharePoint",
        status: "active",
        approvalState: "approved",
        retentionPolicy: "7y",
        legalHold: false,
        complianceTags: ["OpenMeeting"],
        lastUpdated: "2026-01-10T16:30:00Z"
      },
      {
        id: "m-2",
        name: "Procurement_RFP_Roadwork",
        type: "document",
        project: "Procurement",
        source: "Drive",
        status: "pending",
        approvalState: "pending",
        retentionPolicy: "10y",
        legalHold: false,
        complianceTags: ["Procurement"],
        lastUpdated: "2026-02-02T14:05:00Z"
      },
      {
        id: "m-3",
        name: "GovernancePolicy",
        type: "repo",
        project: "Core",
        source: "GitHub",
        status: "active",
        approvalState: "approved",
        retentionPolicy: "permanent",
        legalHold: false,
        complianceTags: ["Policy"],
        url: "https://github.com/97n8/PL",
        lastUpdated: "2026-02-05T11:42:00Z"
      }
    ],
    audit: [
      {
        time: "2026-02-05T11:43:00Z",
        action: "UPDATED",
        itemId: "m-3",
        env: "Municipal Demo",
        actor: "clerk@town.example"
      },
      {
        time: "2026-02-02T14:06:00Z",
        action: "SUBMITTED",
        itemId: "m-2",
        env: "Municipal Demo",
        actor: "procurement@town.example"
      }
    ]
  },
  {
    id: "nonprofit",
    name: "Nonprofit Demo",
    sector: "Board Governance",
    items: [
      {
        id: "n-1",
        name: "Bylaws_2026",
        type: "document",
        project: "Board",
        source: "Drive",
        status: "active",
        approvalState: "approved",
        retentionPolicy: "permanent",
        legalHold: false,
        complianceTags: ["Policy"],
        lastUpdated: "2026-01-12T09:10:00Z"
      },
      {
        id: "n-2",
        name: "Grant_Allocation_FY26",
        type: "document",
        project: "Finance",
        source: "SharePoint",
        status: "pending",
        approvalState: "pending",
        retentionPolicy: "7y",
        legalHold: false,
        complianceTags: ["Finance"],
        lastUpdated: "2026-02-01T17:45:00Z"
      },
      {
        id: "n-3",
        name: "BoardPacket_July",
        type: "link",
        project: "Board",
        source: "Drive",
        status: "active",
        approvalState: "approved",
        retentionPolicy: "3y",
        legalHold: false,
        complianceTags: ["Agenda"],
        lastUpdated: "2026-02-04T13:25:00Z"
      }
    ],
    audit: [
      {
        time: "2026-02-04T13:26:00Z",
        action: "APPROVED",
        itemId: "n-3",
        env: "Nonprofit Demo",
        actor: "chair@nonprofit.example"
      },
      {
        time: "2026-02-01T17:46:00Z",
        action: "FLAGGED",
        itemId: "n-2",
        env: "Nonprofit Demo",
        actor: "auditor@nonprofit.example"
      }
    ]
  },
  {
    id: "corporate",
    name: "Corporate Demo",
    sector: "Board Ops",
    items: [
      {
        id: "c-1",
        name: "VendorAgreement_2025",
        type: "document",
        project: "Legal",
        source: "SharePoint",
        status: "active",
        approvalState: "approved",
        retentionPolicy: "7y",
        legalHold: false,
        complianceTags: ["Contract"],
        lastUpdated: "2026-01-20T15:15:00Z"
      },
      {
        id: "c-2",
        name: "QuarterlyReport_Q3",
        type: "document",
        project: "Finance",
        source: "Drive",
        status: "draft",
        approvalState: "draft",
        retentionPolicy: "5y",
        legalHold: false,
        complianceTags: ["Finance", "Audit"],
        lastUpdated: "2026-02-03T10:30:00Z"
      },
      {
        id: "c-3",
        name: "Security_Incident_Review",
        type: "record",
        project: "Security",
        source: "GitHub",
        status: "pending",
        approvalState: "pending",
        retentionPolicy: "10y",
        legalHold: true,
        complianceTags: ["Security"],
        lastUpdated: "2026-02-06T08:55:00Z"
      }
    ],
    audit: [
      {
        time: "2026-02-06T08:56:00Z",
        action: "LEGAL_HOLD_APPLIED",
        itemId: "c-3",
        env: "Corporate Demo",
        actor: "legal@corp.example"
      },
      {
        time: "2026-02-03T10:31:00Z",
        action: "UPDATED",
        itemId: "c-2",
        env: "Corporate Demo",
        actor: "finance@corp.example"
      }
    ]
  },
  {
    id: "oss-foundation",
    name: "Open Source Foundation Demo",
    sector: "Foundation Governance",
    items: [
      {
        id: "o-1",
        name: "GovernancePolicy.md",
        type: "repo",
        project: "Policy",
        source: "GitHub",
        status: "active",
        approvalState: "approved",
        retentionPolicy: "permanent",
        legalHold: false,
        complianceTags: ["Policy"],
        url: "https://github.com/97n8/PL",
        lastUpdated: "2026-01-30T12:00:00Z"
      },
      {
        id: "o-2",
        name: "SecurityIncident_2026",
        type: "record",
        project: "Security",
        source: "SharePoint",
        status: "active",
        approvalState: "pending",
        retentionPolicy: "10y",
        legalHold: true,
        complianceTags: ["Security"],
        lastUpdated: "2026-02-07T07:20:00Z"
      },
      {
        id: "o-3",
        name: "Maintainer_Charter",
        type: "document",
        project: "Governance",
        source: "Drive",
        status: "draft",
        approvalState: "draft",
        retentionPolicy: "5y",
        legalHold: false,
        complianceTags: ["Policy"],
        lastUpdated: "2026-02-01T09:40:00Z"
      }
    ],
    audit: [
      {
        time: "2026-02-07T07:21:00Z",
        action: "ESCALATED",
        itemId: "o-2",
        env: "Open Source Foundation Demo",
        actor: "security@foundation.example"
      },
      {
        time: "2026-02-01T09:41:00Z",
        action: "DRAFTED",
        itemId: "o-3",
        env: "Open Source Foundation Demo",
        actor: "maintainer@foundation.example"
      }
    ]
  },
  {
    id: "university",
    name: "University Demo",
    sector: "Department Governance",
    items: [
      {
        id: "u-1",
        name: "CurriculumChangeProposal",
        type: "document",
        project: "Academic Affairs",
        source: "SharePoint",
        status: "pending",
        approvalState: "pending",
        retentionPolicy: "5y",
        legalHold: false,
        complianceTags: ["Committee", "Education"],
        lastUpdated: "2026-02-08T15:10:00Z"
      },
      {
        id: "u-2",
        name: "DeptHeads_Minutes",
        type: "record",
        project: "Operations",
        source: "Drive",
        status: "active",
        approvalState: "approved",
        retentionPolicy: "5y",
        legalHold: false,
        complianceTags: ["OpenMeeting"],
        lastUpdated: "2026-02-03T11:05:00Z"
      },
      {
        id: "u-3",
        name: "Lab_Safety_Exception",
        type: "record",
        project: "Safety",
        source: "SharePoint",
        status: "active",
        approvalState: "approved",
        retentionPolicy: "7y",
        legalHold: true,
        complianceTags: ["Safety"],
        lastUpdated: "2026-02-06T18:15:00Z"
      }
    ],
    audit: [
      {
        time: "2026-02-08T15:11:00Z",
        action: "SUBMITTED",
        itemId: "u-1",
        env: "University Demo",
        actor: "chair@university.example"
      },
      {
        time: "2026-02-06T18:16:00Z",
        action: "LEGAL_HOLD_APPLIED",
        itemId: "u-3",
        env: "University Demo",
        actor: "compliance@university.example"
      }
    ]
  }
];
