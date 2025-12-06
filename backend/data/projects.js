export const projects = [
  {
    title: "Corporate Actions Database and PnL Integration",
    objective:
      "Build a centralised Corporate Actions Database and integrate it with the firm’s PnL engine.",
    architecture:
      "Python ingestion scripts -> Validation/normalisation layer -> PostgreSQL corporate_action_event -> PnL engine queries and adjustment logs.",
    tools: "Python, PostgreSQL, ClickHouse, Linux",
    implementation:
      "Designed schemas, wrote ingestion scripts, implemented duplicate detection, and wired corporate action adjustments into PnL calculations.",
    results:
      "Corporate action-related PnL became fully traceable and auditable, improving transparency and simplifying audits.",
    futureScope:
      "Extend coverage to more data providers and automate completeness checks.",
    keyLearnings:
      "Data modelling for financial events and auditability requirements in PnL systems."
  },
  {
    title: "Reconciliation Framework for Multiple Broker Setups",
    objective:
      "Ensure that internal trades, positions and PnL match broker statements across exchanges.",
    architecture:
      "Data extractors -> Normalisation layer -> Comparison engine -> Results tables and Slack alerts.",
    tools: "Python, ClickHouse, PostgreSQL, Slack API",
    implementation:
      "Implemented configuration-driven recon modules, row-level and aggregated comparisons, and Slack alerts for mismatches.",
    results:
      "Early detection of discrepancies and higher confidence in firm-wide PnL numbers.",
    futureScope:
      "Add more brokers seamlessly via configuration and improve performance on larger datasets.",
    keyLearnings:
      "Designing reusable frameworks and choosing practical tolerance thresholds."
  }
];