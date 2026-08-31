# Concierge Audit OS — Technical Plan & Architecture Blueprint

## Overview
**Concierge Audit OS** is an agentic AI operating system designed for short-term rental (STR) management companies and revenue optimization agencies. It unifies quantitative revenue auditing, algorithmic OTA copywriting, and automated channel manager execution into a deterministic 3-agent pipeline with Human-in-the-Loop (HITL) approval.

---

## Architecture Pipeline

```mermaid
flowchart TD
    A[Property Ingestion / Form] --> B[audit_agent]
    B --> C[Audit Score & Revenue Leakage Calculation]
    C --> D[1-Page A4 PDF Generation WeasyPrint]
    C --> E{Score < 80 or Requested?}
    E -- Yes --> F[solution_agent]
    E -- No --> G[Direct Dashboard Display]
    F --> H[3 Title Variants + Structured Copy + Photo Matrix]
    H --> I[HITL Review Room: Owner / Concierge Approval]
    I -->|Owner Approves| J[execution_agent]
    I -->|Owner Rejects / Modifies| F
    J --> K1[Channel Manager API Push Hostaway/Guesty/Smoobu]
    J --> K2[1-Click Clipboard Checklist]
    J --> K3[Downloadable Onboarding Pack JSON/MD]
```
