/* =============================================
   SAARTHI AI – ADK Engine
   Simulates Google ADK root_agent + containers
   ============================================= */

class ADKEngine {
  constructor() {
    this.state = {
      phase: 'idle',      // idle | phase1 | phase2 | phase3 | human_review | complete
      activeAgents: new Set(),
      completedAgents: new Set(),
      agentStatuses: {},  // agentId -> { status, score, duration }
      exceptions: [],
      onUpdate: null,
    };

    // Agent execution timings (ms)
    this.timings = {
      intake:               1200,
      doc_intelligence:     2100,
      financial:            1800,
      gst:                  2300,
      bank_statement:       1500,
      fraud_detection:      2000,
      credit_recommendation:1000,
      compliance:            800,
      communication:         500,
      case_summary:         1200,
    };
  }

  // ── Main Run Method (mirrors ADK LlmAgent) ──
  async run(caseData, onUpdate) {
    this.state.onUpdate = onUpdate;
    this.state.phase = 'starting';
    this.state.activeAgents.clear();
    this.state.completedAgents.clear();
    this.state.agentStatuses = {};
    this.state.exceptions = [];

    this._emit({ type: 'root_activated', message: 'saarthi_orchestrator: Initializing...' });
    await this._sleep(600);

    // ── Phase 1: intake_pipeline (Sequential) ──
    await this._runPhase1(caseData);
    await this._sleep(400);

    // ── Phase 2: analysis_pipeline (Parallel) ──
    await this._runPhase2(caseData);
    await this._sleep(400);

    // ── Routing Decision (LLM logic) ─────────
    const fraudScore = this.state.agentStatuses['fraud_detection']?.score || 0;
    if (fraudScore > 60) {
      this._emit({ type: 'exception', severity: 'critical', agent: 'fraud_detection',
        message: `Fraud score ${fraudScore}/100 exceeds threshold. Escalating to Risk Manager.` });
      this.state.phase = 'escalated';
      this._emit({ type: 'phase_change', phase: 'escalated' });
      return;
    }

    // ── Phase 3: decision_pipeline (Sequential) ──
    await this._runPhase3(caseData);
    await this._sleep(300);

    // ── Human-in-loop trigger ─────────────────
    const lendingScore = this.state.agentStatuses['credit_recommendation']?.score || 0;
    const loanAmount   = caseData.loanAmount || 0;
    const needsHuman   = lendingScore < 750 || loanAmount >= 5000000 || this.state.exceptions.length > 0;

    if (needsHuman) {
      this.state.phase = 'human_review';
      this._emit({ type: 'human_review', message: 'root_agent: Human review required. Routing to Loan Officer.' });
    } else {
      this.state.phase = 'complete';
      this._emit({ type: 'complete', message: 'Case processing complete. Auto-approved.' });
    }
  }

  // ── Phase 1: Sequential ───────────────────
  async _runPhase1(caseData) {
    this.state.phase = 'phase1';
    this._emit({ type: 'phase_change', phase: 'phase1', container: 'intake_pipeline' });

    await this._runAgent('intake', caseData);
  }

  // ── Phase 2: Parallel ─────────────────────
  async _runPhase2(caseData) {
    this.state.phase = 'phase2';
    this._emit({ type: 'phase_change', phase: 'phase2', container: 'analysis_pipeline' });

    const agents = ['doc_intelligence', 'financial', 'gst', 'bank_statement', 'fraud_detection'];

    // Mark all as processing simultaneously
    agents.forEach(id => {
      this.state.activeAgents.add(id);
      this.state.agentStatuses[id] = { status: 'processing', score: null };
    });
    this._emit({ type: 'parallel_start', agents });

    // Run all in parallel using Promise.all
    await Promise.all(agents.map(id => this._runAgent(id, caseData, true)));
  }

  // ── Phase 3: Sequential ───────────────────
  async _runPhase3(caseData) {
    this.state.phase = 'phase3';
    this._emit({ type: 'phase_change', phase: 'phase3', container: 'decision_pipeline' });

    const agents = ['credit_recommendation', 'compliance', 'communication', 'case_summary'];
    for (const id of agents) {
      await this._runAgent(id, caseData);
      await this._sleep(200);
    }
  }

  // ── Run Individual Agent ──────────────────
  async _runAgent(agentId, caseData, alreadyMarked = false) {
    if (!alreadyMarked) {
      this.state.activeAgents.add(agentId);
      this.state.agentStatuses[agentId] = { status: 'processing', score: null };
      this._emit({ type: 'agent_start', agentId });
    }

    // Simulate processing time
    await this._sleep(this.timings[agentId] || 1500);

    // Generate output from demo case data
    const output = this._generateOutput(agentId, caseData);

    this.state.activeAgents.delete(agentId);
    this.state.completedAgents.add(agentId);
    this.state.agentStatuses[agentId] = {
      status: output.warning ? 'warning' : 'completed',
      score:  output.score,
      duration: (this.timings[agentId] / 1000).toFixed(1),
    };

    if (output.exception) {
      this.state.exceptions.push({ agentId, ...output.exception });
      this._emit({ type: 'exception', severity: output.exception.severity, agent: agentId, message: output.exception.message });
    }

    this._emit({ type: 'agent_complete', agentId, output });
    return output;
  }

  // ── Generate Agent Output from Case Data ──
  _generateOutput(agentId, caseData) {
    const ao = caseData?.agentOutputs || {};
    const demoCase = SaarthiData.getDemoCase();

    switch (agentId) {
      case 'intake':
        return { score: ao.intake?.completeness || 87, warning: (ao.intake?.missingDocs?.length > 0) };
      case 'doc_intelligence':
        return { score: ao.doc_intelligence?.confidence || 94 };
      case 'financial':
        return { score: ao.financial?.score || 72 };
      case 'gst':
        return {
          score: ao.gst?.score || 61,
          warning: true,
          exception: { severity: 'warning', message: '⚠️ Q4 FY2023-24 GST return not found. Clarification required.' }
        };
      case 'bank_statement':
        return { score: ao.bank_statement?.score || 81 };
      case 'fraud_detection':
        return { score: ao.fraud_detection?.score || 18 };
      case 'credit_recommendation':
        return { score: ao.credit_recommendation?.lendingScore || 698, verdict: ao.credit_recommendation?.verdict || 'CONDITIONAL_APPROVAL' };
      case 'compliance':
        return { score: 100, status: ao.compliance?.overallStatus || 'CONDITIONAL', warning: ao.compliance?.overallStatus !== 'PASS' };
      case 'communication':
        return { score: 100, messagesSent: 2 };
      case 'case_summary':
        return { score: 100 };
      default:
        return { score: 80 };
    }
  }

  _emit(event) {
    if (this.state.onUpdate) this.state.onUpdate(event);
  }

  _sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getAgentStatus(agentId) {
    return this.state.agentStatuses[agentId] || { status: 'idle' };
  }
}

// Singleton
const adkEngine = new ADKEngine();
