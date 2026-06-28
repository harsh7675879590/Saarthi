# Saarthi AI – Agentic MSME Loan Underwriting

Saarthi AI is an enterprise-grade agentic AI platform designed for MSME (Micro, Small, and Medium Enterprises) loan underwriting. Built to reduce approval timelines from several days to minutes, it leverages a custom agentic orchestration engine simulating 10 specialized AI agents working together while maintaining a secure "human-in-the-loop" authorization model.

---

## 🏦 Project Overview

Traditional MSME credit underwriting is slow, paper-heavy, and prone to processing bottlenecks. **Saarthi AI** models a modular agent pipeline using a simulation of the Google Agentic Development Kit (ADK) structure to automate intake, validation, financial analysis, fraud screening, and report generation in real-time.

---

## 🤖 The 10 Specialized Agents

The underwriting workflow is powered by 10 specialized AI agents working in sequence and parallel:

1. **Intake Agent (`intake`)** – Analyzes raw application entries, registers the applicant profile, and determines prioritization status.
2. **Document Intelligence Agent (`doc_intelligence`)** – Performs OCR validation, checks KYC/PAN consistency, and reviews identity verification.
3. **Financials Analyzer (`financial`)** – Extracts key metrics from balance sheets and P&L statements (e.g., revenue growth, margins, DSCR, current ratios).
4. **GST Validator (`gst`)** – Audits GST returns, verifies business vintage, and checks historical sales/tax filing trends.
5. **Bank Statement Analyzer (`bank_statement`)** – Checks average monthly balances, detects transaction anomalies, and flags check bounces.
6. **Fraud & Risk Evaluator (`fraud_detection`)** – Screens applicants against blacklists and calculates risk scoring indexes.
7. **Credit Recommendation Agent (`credit_recommendation`)** – Suggests credit limits, interest tiers, and repayment periods.
8. **Compliance Auditor (`compliance`)** – Verifies legal checks, local/national MSME guidelines, and sector-related regulations.
9. **Communications Agent (`communication`)** – Handles automatic template generation for applicant updates and requests missing files.
10. **Case Summary Orchestrator (`case_summary`)** – Compiles all individual agent reviews into an executive report for human underwriters.

---

## ⚙️ Architecture & Pipeline Processing

The simulation engine implements a robust three-phase pipeline:
- **Phase 1: Intake (Sequential)** – Basic application verification, OCR consistency, and document validity checks.
- **Phase 2: Analysis (Parallel)** – Simultaneous execution of financial audits, GST validations, bank statement checks, and fraud scoring.
- **Phase 3: Decision & Routing** – Analyzes scores and escalates cases to human underwriters or risk managers if risk/fraud metrics cross specific thresholds.

---

## 🛠️ Technology Stack (Devpost Tags)

*   `html5`
*   `css3`
*   `javascript`
*   `vanilla-js`
*   `font-awesome`
*   `google-fonts`
*   `single-page-application`

---

## 📂 Project Structure

```
├── index.html          # Main application skeleton & root element
├── css/
│   ├── main.css        # Pylon style design system token definitions
│   ├── components.css  # UI component layouts (cards, buttons, inputs)
│   ├── animations.css  # Micro-animations, progress, and layout transition styles
│   ├── agents.css      # Custom visual styling for the AI Agent nodes
│   └── dashboard.css   # Main layout for the interactive dashboard panels
├── js/
│   ├── adk-engine.js   # Custom JavaScript simulation engine for the ADK flow
│   ├── app.js          # Core routing, component rendering, and event handlers
│   ├── data.js         # Comprehensive mock datasets, profiles, and case templates
│   └── utils.js        # Helper utility functions for formatting and UI actions
└── assets/             # Asset files and background graphics
```

---

## 🚀 How to Run Locally

Since this application is a client-side Single Page Application (SPA), no build configuration or npm installation is required:

1. Clone or download the repository.
2. Serve the directory using a simple local web server, for example:
   *   **Using Python**: Run `python -m http.server 8000` in the directory root, then visit `http://localhost:8000`.
   *   **Using VS Code**: Use the **Live Server** extension to launch the app.
3. Alternatively, you can open `index.html` directly in any modern browser.
