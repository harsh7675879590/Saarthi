/* =============================================
   SAARTHI AI – Mock Data Engine
   All demo data, agent outputs, cases
   ============================================= */

const SaarthiData = {

  // ── Current User ──────────────────────────
  currentUser: null,

  roles: {
    applicant:  { id: 'applicant',  name: 'Raj Mehta',      title: 'Applicant',      emoji: '👤', color: '#0ea5e9', glow: 'rgba(14,165,233,0.2)' },
    officer:    { id: 'officer',    name: 'Priya Sharma',   title: 'Loan Officer',   emoji: '👩‍💼', color: '#7c3aed', glow: 'rgba(124,58,237,0.2)' },
    risk:       { id: 'risk',       name: 'Arjun Kapoor',   title: 'Risk Manager',   emoji: '🛡️', color: '#dc2626', glow: 'rgba(220,38,38,0.2)' },
    admin:      { id: 'admin',      name: 'Harshit Gupta',  title: 'Admin',          emoji: '⚙️', color: '#d97706', glow: 'rgba(217,119,6,0.2)'  },
  },

  // ── Loan Cases ────────────────────────────
  cases: [
    {
      id: 'LOAN-2024-001',
      company: 'ABC Manufacturing Pvt Ltd',
      applicant: 'Rajesh Kumar Gupta',
      pan: 'ABCPG1234R',
      gstin: '27ABCPG1234R1Z5',
      loanAmount: 2500000,
      loanType: 'Working Capital Loan',
      purpose: 'Purchase of raw materials and inventory for upcoming export orders',
      businessVintage: '8 years',
      industry: 'Manufacturing',
      location: 'Pune, Maharashtra',
      status: 'human_review',
      priority: 'high',
      createdAt: '2024-01-15T09:30:00Z',
      updatedAt: '2024-01-15T11:45:00Z',
      demoCase: true,
      documents: {
        pan: { uploaded: true, verified: true },
        aadhaar: { uploaded: true, verified: true },
        gst_certificate: { uploaded: true, verified: true },
        bank_statements: { uploaded: true, verified: true },
        itr_3years: { uploaded: true, verified: true },
        balance_sheet: { uploaded: true, verified: true },
        gst_returns: { uploaded: false, verified: false, missing: 'Q4 FY2023-24' },
      },
      agentOutputs: {
        intake: {
          status: 'completed', duration: 1.2,
          caseId: 'LOAN-2024-001',
          completeness: 87,
          loanType: 'Working Capital Loan',
          priority: 'High',
          missingDocs: ['GST Returns Q4 FY2023-24'],
          validationReport: 'Application validated. 1 document missing.',
        },
        doc_intelligence: {
          status: 'completed', duration: 2.1, confidence: 94,
          profile: {
            name: 'Rajesh Kumar Gupta',
            pan: 'ABCPG1234R',
            aadhaar: 'XXXX-XXXX-7890',
            gstin: '27ABCPG1234R1Z5',
            dob: '15/03/1978',
            address: 'Plot 45, MIDC, Pune 411019',
            directors: ['Rajesh Kumar Gupta', 'Sunita Gupta'],
            businessName: 'ABC Manufacturing Pvt Ltd',
            incorporationDate: '15/06/2016',
          },
          consistencyCheck: 'PASS',
          documentQuality: 'High',
          flags: [],
        },
        financial: {
          status: 'completed', duration: 1.8, score: 72,
          metrics: {
            revenue_fy24: 18500000,
            revenue_fy23: 15200000,
            revenue_fy22: 12800000,
            yoy_growth: 21.7,
            net_profit_margin: 8.4,
            gross_margin: 24.6,
            dscr: 1.42,
            current_ratio: 1.68,
            debt_equity: 1.1,
            working_capital_gap: 3200000,
          },
          observations: [
            { type: 'positive', text: 'Revenue growing at 21.7% YoY — strong upward trend' },
            { type: 'positive', text: 'DSCR of 1.42 indicates comfortable debt servicing capacity' },
            { type: 'neutral',  text: 'Net profit margin of 8.4% is within acceptable range for manufacturing' },
            { type: 'negative', text: 'Debt-to-equity ratio of 1.1 is slightly elevated but manageable' },
          ],
          recommendedLimit: 2800000,
        },
        gst: {
          status: 'warning', duration: 2.3, score: 61,
          gstin: '27ABCPG1234R1Z5',
          registrationStatus: 'Active',
          registrationDate: '01/07/2017',
          filingHistory: {
            gstr1_filed: 11, gstr1_due: 12,
            gstr3b_filed: 11, gstr3b_due: 12,
            lateFilings: 2,
            nillReturns: 0,
          },
          turnovers: {
            fy24_gst: 17800000,
            fy24_itr: 18500000,
            variance_pct: 3.8,
          },
          anomalies: [],
          flags: [{ severity: 'warning', text: 'Q4 FY2023-24 GSTR-3B not filed — pending clarification' }],
          complianceScore: 61,
        },
        bank_statement: {
          status: 'completed', duration: 1.5, score: 81,
          period: 'Apr 2023 – Mar 2024',
          bank: 'HDFC Bank, Pune Main Branch',
          account: 'CA XXXX-XXXX-4521',
          metrics: {
            avg_monthly_balance: 1245000,
            avg_monthly_inflow: 1680000,
            avg_monthly_outflow: 1420000,
            total_credits_annual: 20160000,
            bounce_count: 1,
            bounce_rate: 0.8,
            emi_obligations: 45000,
          },
          observations: [
            { type: 'positive', text: 'Average monthly balance of ₹12.45L — strong liquidity' },
            { type: 'positive', text: 'Consistent credit inflows matching GST turnover (within 8% variance)' },
            { type: 'positive', text: 'Only 1 bounce in 12 months — excellent banking discipline' },
            { type: 'neutral',  text: 'Regular vendor payments indicate active business operations' },
          ],
          recommendedLimit: 2490000,
        },
        fraud_detection: {
          status: 'completed', duration: 2.0, score: 18,
          riskCategory: 'Low',
          documentIntegrity: 'PASS',
          blacklistCheck: 'CLEAR',
          identityVerification: 'VERIFIED',
          panAadhaarLink: 'LINKED',
          crossChecks: [
            { check: 'Name match (PAN ↔ Aadhaar ↔ GST)', result: 'PASS' },
            { check: 'Revenue reconciliation (GST ↔ ITR)', result: 'PASS (3.8% variance)' },
            { check: 'Bank inflow ↔ GST turnover', result: 'PASS (8% variance)' },
            { check: 'CIBIL/RBI defaulter check', result: 'CLEAR' },
            { check: 'Document metadata analysis', result: 'PASS — No tampering detected' },
          ],
          signals: [],
          fraudScore: 18,
        },
        credit_recommendation: {
          status: 'completed', duration: 1.0,
          lendingScore: 698,
          verdict: 'CONDITIONAL_APPROVAL',
          verdictLabel: 'Conditional Approval',
          approvedAmount: 2000000,
          recommendedRate: 13.5,
          tenure: 12,
          conditions: [
            'Submit Q4 FY2023-24 GST returns within 15 days',
            'Personal guarantee from all directors required',
            'Monthly bank statement submission during loan tenure',
          ],
          scoreBreakdown: {
            financial_health:  { score: 72, weight: 30, weighted: 21.6 },
            banking_reliability: { score: 81, weight: 25, weighted: 20.25 },
            gst_compliance:    { score: 61, weight: 20, weighted: 12.2 },
            fraud_inverse:     { score: 82, weight: 15, weighted: 12.3 },
            doc_completeness:  { score: 87, weight: 10, weighted: 8.7 },
          },
          confidence: 87,
        },
        compliance: {
          status: 'completed', duration: 0.8,
          overallStatus: 'CONDITIONAL',
          kyc: { pan: 'VERIFIED', aadhaar: 'VERIFIED', address: 'VERIFIED', business_reg: 'VERIFIED' },
          rbi: { msme_classification: 'MICRO', priority_sector: true, exposure_within_limit: true },
          aml: { pep_check: 'CLEAR', sanctions: 'CLEAR', ubo_verified: true },
          flags: [{ severity: 'warning', text: 'Q4 GST return pending — must be resolved before disbursement' }],
        },
        communication: {
          status: 'completed', duration: 0.5,
          messagesSent: 2,
          lastMessage: 'Clarification request for Q4 GST returns sent via Email & WhatsApp',
          channels: ['email', 'whatsapp'],
          templates: {
            email: `Subject: Action Required – GST Return Submission | LOAN-2024-001

Dear Rajesh Kumar Gupta,

Thank you for your loan application with us for ₹25,00,000 Working Capital Loan.

Our AI underwriting system (Saarthi) has completed the initial analysis of your application. We are pleased to inform you that your application looks promising!

However, to proceed further, we require the following document:

📋 REQUIRED DOCUMENT:
• GSTR-3B for Q4 FY2023-24 (January – March 2024)

Please upload this document within 15 days to avoid delays in processing.

Upload Link: https://saarthi.ai/portal/docs/LOAN-2024-001

Your application summary:
• Loan Amount: ₹25,00,000
• Loan Type: Working Capital Loan
• Current Status: Under Review (Pending Document)
• Case ID: LOAN-2024-001

For queries, contact: support@saarthai.ai | 1800-XXX-XXXX

Regards,
Saarthi AI Underwriting Team`,
            whatsapp: `🏦 *Saarthi AI – Document Required*

Hi Rajesh Kumar! Your loan application (LOAN-2024-001) for ₹25L is under review. 

We need one more document:
📋 GSTR-3B for Q4 FY2023-24

Please upload at: saarthi.ai/portal/docs/LOAN-2024-001

Valid for 15 days. Questions? Reply to this message.`,
            sms: `SAARTHI: Action needed for loan app LOAN-2024-001. Upload GSTR-3B Q4 FY24 at saarthi.ai/portal. Ref: LOAN-2024-001`,
          },
        },
        case_summary: null, // Generated after human decision
      },
      timeline: [
        { time: '09:30 AM', action: 'Application submitted by applicant', actor: 'Raj Mehta (Applicant)', type: 'info' },
        { time: '09:31 AM', action: 'Intake Agent: Case LOAN-2024-001 created', actor: 'Agent 1 – Intake', type: 'success' },
        { time: '09:31 AM', action: 'Analysis pipeline started (5 agents in parallel)', actor: 'root_agent', type: 'info' },
        { time: '09:33 AM', action: 'Document Intelligence: Profile extracted (94% confidence)', actor: 'Agent 2 – DocIntel', type: 'success' },
        { time: '09:33 AM', action: 'Financial Analysis: Score 72/100 — DSCR 1.42', actor: 'Agent 3 – Financial', type: 'success' },
        { time: '09:34 AM', action: '⚠️ GST Intelligence: Q4 returns missing (Score: 61/100)', actor: 'Agent 4 – GST', type: 'warning' },
        { time: '09:34 AM', action: 'Bank Statement Analysis: Score 81/100 — 1 bounce in 12 months', actor: 'Agent 5 – Bank', type: 'success' },
        { time: '09:34 AM', action: 'Fraud Detection: Risk Score 18/100 — LOW RISK', actor: 'Agent 6 – Fraud', type: 'success' },
        { time: '09:35 AM', action: 'Credit Recommendation: Score 698/850 — Conditional Approval', actor: 'Agent 7 – Credit', type: 'info' },
        { time: '09:36 AM', action: 'Compliance Check: CONDITIONAL — GST pending', actor: 'Agent 8 – Compliance', type: 'warning' },
        { time: '09:36 AM', action: 'Communication Agent: Clarification email & WhatsApp sent to applicant', actor: 'Agent 9 – Comms', type: 'info' },
        { time: '09:37 AM', action: 'Human Review Required: Assigned to Priya Sharma (Loan Officer)', actor: 'root_agent', type: 'warning' },
      ],
    },

    // Case 2: Auto-approved
    {
      id: 'LOAN-2024-002',
      company: 'Sunrise Textiles Ltd',
      applicant: 'Meena Patel',
      loanAmount: 1500000,
      loanType: 'Term Loan',
      purpose: 'Purchase of weaving machinery',
      businessVintage: '12 years',
      industry: 'Textiles',
      location: 'Surat, Gujarat',
      status: 'approved',
      priority: 'medium',
      createdAt: '2024-01-14T10:15:00Z',
      updatedAt: '2024-01-14T10:48:00Z',
      agentOutputs: {
        financial:           { score: 88 },
        bank_statement:      { score: 91 },
        gst:                 { score: 84 },
        fraud_detection:     { score: 9 },
        credit_recommendation: { lendingScore: 812, verdict: 'APPROVE', verdictLabel: 'Approved', approvedAmount: 1500000 },
        compliance:          { overallStatus: 'PASS' },
      },
    },

    // Case 3: Rejected – Fraud
    {
      id: 'LOAN-2024-003',
      company: 'Phantom Exports LLC',
      applicant: 'Vikram Singh',
      loanAmount: 5000000,
      loanType: 'Working Capital Loan',
      purpose: 'Export finance',
      businessVintage: '1 year',
      industry: 'Exports',
      location: 'Delhi',
      status: 'rejected',
      priority: 'high',
      createdAt: '2024-01-13T14:22:00Z',
      updatedAt: '2024-01-13T15:10:00Z',
      agentOutputs: {
        financial:           { score: 41 },
        bank_statement:      { score: 35 },
        gst:                 { score: 28 },
        fraud_detection:     { score: 87, riskCategory: 'Critical' },
        credit_recommendation: { lendingScore: 312, verdict: 'REJECT', verdictLabel: 'Rejected', approvedAmount: 0 },
        compliance:          { overallStatus: 'FAIL' },
      },
    },

    // Case 4: Pending clarification
    {
      id: 'LOAN-2024-004',
      company: 'Green Valley Agro Pvt Ltd',
      applicant: 'Suresh Nair',
      loanAmount: 800000,
      loanType: 'Equipment Loan',
      purpose: 'Cold storage equipment',
      businessVintage: '5 years',
      industry: 'Agriculture',
      location: 'Nashik, Maharashtra',
      status: 'clarification',
      priority: 'medium',
      createdAt: '2024-01-12T08:00:00Z',
      updatedAt: '2024-01-12T09:30:00Z',
      agentOutputs: {
        financial:           { score: 65 },
        bank_statement:      { score: 71 },
        gst:                 { score: 55 },
        fraud_detection:     { score: 22 },
        credit_recommendation: { lendingScore: 601, verdict: 'MANUAL_REVIEW', verdictLabel: 'Manual Review', approvedAmount: 0 },
        compliance:          { overallStatus: 'CONDITIONAL' },
      },
    },

    // Case 5: High-value escalated
    {
      id: 'LOAN-2024-005',
      company: 'Metro Steel Industries Pvt Ltd',
      applicant: 'Ramesh Agarwal',
      loanAmount: 7500000,
      loanType: 'Term Loan',
      purpose: 'Greenfield plant expansion',
      businessVintage: '18 years',
      industry: 'Steel',
      location: 'Jamshedpur, Jharkhand',
      status: 'escalated',
      priority: 'high',
      createdAt: '2024-01-11T11:00:00Z',
      updatedAt: '2024-01-11T12:30:00Z',
      agentOutputs: {
        financial:           { score: 79 },
        bank_statement:      { score: 82 },
        gst:                 { score: 76 },
        fraud_detection:     { score: 14 },
        credit_recommendation: { lendingScore: 741, verdict: 'CONDITIONAL_APPROVAL', verdictLabel: 'Conditional Approval', approvedAmount: 6500000 },
        compliance:          { overallStatus: 'CONDITIONAL' },
      },
    },
  ],

  // ── ADK Agent Definitions ─────────────────
  adkAgents: [
    { id: 'intake',         num: 1,  name: 'Intake Agent',       icon: '📋', phase: 1, container: 'intake_pipeline',    type: 'leaf' },
    { id: 'doc_intelligence',num: 2, name: 'Doc Intelligence',   icon: '📄', phase: 2, container: 'analysis_pipeline', type: 'leaf' },
    { id: 'financial',      num: 3,  name: 'Financial Analysis', icon: '📊', phase: 2, container: 'analysis_pipeline', type: 'leaf' },
    { id: 'gst',            num: 4,  name: 'GST Intelligence',   icon: '🧾', phase: 2, container: 'analysis_pipeline', type: 'leaf' },
    { id: 'bank_statement', num: 5,  name: 'Bank Statement',     icon: '🏦', phase: 2, container: 'analysis_pipeline', type: 'leaf' },
    { id: 'fraud_detection',num: 6,  name: 'Fraud Detection',    icon: '🔍', phase: 2, container: 'analysis_pipeline', type: 'leaf' },
    { id: 'credit_recommendation', num: 7, name: 'Credit Rec.', icon: '💳', phase: 3, container: 'decision_pipeline', type: 'leaf' },
    { id: 'compliance',     num: 8,  name: 'Compliance Agent',   icon: '⚖️', phase: 3, container: 'decision_pipeline', type: 'leaf' },
    { id: 'communication',  num: 9,  name: 'Communication',      icon: '📧', phase: 3, container: 'decision_pipeline', type: 'leaf' },
    { id: 'case_summary',   num: 10, name: 'Case Summary',       icon: '📝', phase: 3, container: 'decision_pipeline', type: 'leaf' },
  ],

  // ── Platform Metrics (Admin) ──────────────
  platformMetrics: {
    totalApplications: 1247,
    approvedToday: 23,
    avgProcessingTime: 4.2,
    fraudDetected: 18,
    humanInterventionRate: 34,
    agentSuccessRate: 97.3,
    slaCompliance: 91.4,
    manualEffortReduction: 78,
    pendingReview: 12,
    disbursedToday: 8,
  },

  // ── Agent Performance Metrics ─────────────
  agentMetrics: [
    { id: 'intake',         name: 'Intake',         successRate: 99.1, avgTime: 1.1, executions: 1247, icon: '📋' },
    { id: 'doc_intel',      name: 'Doc Intel',      successRate: 96.8, avgTime: 2.3, executions: 1247, icon: '📄' },
    { id: 'financial',      name: 'Financial',      successRate: 98.2, avgTime: 1.9, executions: 1247, icon: '📊' },
    { id: 'gst',            name: 'GST Intel',      successRate: 94.5, avgTime: 2.1, executions: 1247, icon: '🧾' },
    { id: 'bank',           name: 'Bank Stmt',      successRate: 97.6, avgTime: 1.6, executions: 1247, icon: '🏦' },
    { id: 'fraud',          name: 'Fraud Detect',   successRate: 99.4, avgTime: 2.2, executions: 1247, icon: '🔍' },
    { id: 'credit',         name: 'Credit Rec',     successRate: 98.9, avgTime: 1.0, executions: 1247, icon: '💳' },
    { id: 'compliance',     name: 'Compliance',     successRate: 99.2, avgTime: 0.9, executions: 1247, icon: '⚖️' },
    { id: 'comms',          name: 'Comms',          successRate: 97.8, avgTime: 0.5, executions: 891,  icon: '📧' },
    { id: 'summary',        name: 'Summary',        successRate: 99.8, avgTime: 1.1, executions: 1104, icon: '📝' },
  ],

  // ── Landing Page Data ─────────────────────
  heroSlides: [
    {
      image: 'assets/images/hero-bg.png',
      subtitle: 'Simple & Secure AI-Powered Process',
      title: 'Connecting Your\nLoan Needs',
      btn: 'Apply For Loan',
    },
    {
      image: 'assets/images/service-business.png',
      subtitle: 'Powered by Google ADK + UiPath Maestro',
      title: 'Agentic MSME\nLoan Underwriting',
      btn: 'Get Started',
    },
    {
      image: 'assets/images/service-personal.png',
      subtitle: '10 AI Agents Working In Parallel',
      title: 'Fast & Intelligent\nLoan Decisions',
      btn: 'Learn More',
    },
  ],

  services: [
    {
      icon: 'fa-solid fa-car',
      name: 'Personal Loan',
      desc: 'Get instant personal loan approvals with AI-powered credit assessment. Our 10 specialized agents analyze your profile in minutes, not days.',
      image: 'assets/images/service-personal.png',
    },
    {
      icon: 'fa-solid fa-graduation-cap',
      name: 'Education Loan',
      desc: 'Fund your education with competitive rates and quick approvals. Our automated document intelligence verifies your credentials instantly.',
      image: 'assets/images/service-education.png',
    },
    {
      icon: 'fa-solid fa-briefcase',
      name: 'Business Loan',
      desc: 'MSME business loans processed by agentic AI. GST analysis, financial scoring, and fraud detection — all automated for faster decisions.',
      image: 'assets/images/service-business.png',
    },
  ],

  testimonials: [
    {
      name: 'Rajesh Gupta',
      role: 'CEO, ABC Manufacturing',
      text: 'Saarthi AI processed our ₹25L working capital loan in under 5 minutes. The AI agents found every relevant detail in our documents automatically. Incredible technology!',
      initials: 'RG',
    },
    {
      name: 'Meena Patel',
      role: 'Owner, Sunrise Textiles',
      text: 'The transparent process and real-time tracking gave me confidence throughout. From application to approval, everything was smooth and professional.',
      initials: 'MP',
    },
    {
      name: 'Arjun Kapoor',
      role: 'CFO, Metro Steel Industries',
      text: 'As a risk manager at a lending institution, Saarthi\'s fraud detection is exceptional. It caught suspicious patterns that manual review would have missed.',
      initials: 'AK',
    },
  ],

  blogPosts: [
    {
      title: 'How AI is Transforming MSME Loan Underwriting in India',
      date: '15 Jun 2024',
      author: 'Admin',
      comments: 3,
      image: 'assets/images/service-business.png',
    },
    {
      title: 'Understanding GST Compliance for Faster Loan Approvals',
      date: '12 Jun 2024',
      author: 'Priya Sharma',
      comments: 5,
      image: 'assets/images/service-education.png',
    },
    {
      title: '10 Specialized AI Agents: The Future of Credit Assessment',
      date: '08 Jun 2024',
      author: 'Harshit Gupta',
      comments: 8,
      image: 'assets/images/service-personal.png',
    },
  ],

  processSteps: [
    { num: 1, text: 'Fill out the simple online loan application form with your business details' },
    { num: 2, text: 'Submit required documents and details for AI-powered verification' },
    { num: 3, text: '10 AI agents analyze your application in parallel for instant scoring' },
    { num: 4, text: 'Get your loan approved in minutes with transparent conditions' },
  ],

  // ── Helpers ───────────────────────────────
  formatCurrency(amount) {
    if (amount >= 10000000) return `₹${(amount/10000000).toFixed(1)} Cr`;
    if (amount >= 100000)   return `₹${(amount/100000).toFixed(1)} L`;
    return `₹${amount.toLocaleString('en-IN')}`;
  },

  formatDate(isoStr) {
    const d = new Date(isoStr);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  },

  getStatusBadgeClass(status) {
    const map = {
      approved: 'badge-approved', rejected: 'badge-rejected',
      human_review: 'badge-review', clarification: 'badge-warning',
      escalated: 'badge-danger', in_progress: 'badge-info',
      conditional: 'badge-conditional', pending: 'badge-pending',
    };
    return map[status] || 'badge-pending';
  },

  getStatusLabel(status) {
    const map = {
      approved: '✅ Approved', rejected: '❌ Rejected',
      human_review: '👤 Human Review', clarification: '📋 Clarification',
      escalated: '🚨 Escalated', in_progress: '🔄 In Progress',
      conditional: '⚡ Conditional', pending: '⏳ Pending',
    };
    return map[status] || status;
  },

  getScoreColor(score) {
    if (score >= 75) return 'var(--color-success)';
    if (score >= 50) return 'var(--color-warning)';
    return 'var(--color-danger)';
  },

  getLendingScoreColor(score) {
    if (score >= 750) return 'var(--color-success)';
    if (score >= 650) return 'var(--color-info)';
    if (score >= 550) return 'var(--color-warning)';
    return 'var(--color-danger)';
  },

  getDemoCase() {
    return this.cases.find(c => c.demoCase);
  },

  getCaseById(id) {
    return this.cases.find(c => c.id === id);
  },
};
