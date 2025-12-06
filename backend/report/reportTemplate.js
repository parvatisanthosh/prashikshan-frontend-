import { student } from "../data/student.js";
import { company } from "../data/company.js";
import { college } from "../data/college.js";
import { logs } from "../data/logs.js";
import { projects } from "../data/projects.js";
import { evaluation } from "../data/evaluation.js";
import { performanceAssessment } from "../data/performance.js";

// Default image URLs for figures (can be replaced with real ones later)
const defaultImages = {
  figTechStackUrl:
    "https://via.placeholder.com/800x500?text=Fig+1.1+Tech+Stack+Collage",
  figCorporateUrl:
    "https://via.placeholder.com/900x400?text=Fig+1.2+Corporate+Actions+Table"
};

// Institute logo URL – replace this with the real IIITN logo URL
const INSTITUTE_LOGO_URL =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/IIIT_Nagpur_logo.svg/200px-IIIT_Nagpur_logo.svg.png";

function escapeHtml(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function buildReportHtml() {
  // ---------- Title Page with Logo ----------
  const titlePage = `
  <div class="page title-page">
    <div style="text-align:center; margin-top:8mm;">
      ${
        INSTITUTE_LOGO_URL
          ? `<img src="${INSTITUTE_LOGO_URL}" alt="Institute Logo"
                style="width:40mm; height:auto; margin-bottom:8mm;" />`
          : ""
      }
    </div>

    <div style="text-align:center; margin-top:0;">
      <div style="font-size:18pt; font-weight:bold; text-decoration:underline;">
        FINAL YEAR B.TECH. INTERNSHIP REPORT
      </div>
      <div style="margin-top:10mm; font-size:11pt;">
        A report submitted in partial fulfillment of the requirements for the Award of
      </div>
      <div style="margin-top:4mm; font-size:13pt; font-weight:bold;">
        Degree of
      </div>
      <div style="margin-top:4mm; font-size:14pt; font-weight:bold;">
        BACHELOR OF TECHNOLOGY
      </div>
      <div style="margin-top:4mm; font-size:11pt;">
        in
      </div>
      <div style="margin-top:4mm; font-size:14pt; font-weight:bold;">
        COMPUTER SCIENCE AND ENGINEERING
      </div>
    </div>

    <div style="margin-top:18mm; text-align:center;">
      <div style="font-size:11pt;">By</div>
      <div style="margin-top:4mm; font-size:13pt; font-weight:bold;">
        ${escapeHtml(student.fullName.toUpperCase())}
      </div>
      <div style="margin-top:3mm; font-size:11pt;">
        Enrollment Number: ${escapeHtml(student.enrollmentNumber)}
      </div>
    </div>

    <div style="margin-top:16mm; text-align:center; font-size:11pt;">
      <div>Under the Supervision of</div>
      <div style="margin-top:3mm; font-weight:bold;">
        ${escapeHtml(company.mentorName)}, ${escapeHtml(
    company.mentorDesignation
  )}
      </div>
      <div style="margin-top:3mm;">
        Internship Period: ${escapeHtml(student.internshipStart)} to ${escapeHtml(
    student.internshipEnd
  )}
      </div>
    </div>

    <div style="margin-top:22mm; text-align:center; font-size:11pt;">
      <div>भारतीय सूचना प्रौद्योगिकी संस्थान, नागपुर</div>
      <div style="margin-top:2mm; font-weight:bold;">
        INDIAN INSTITUTE OF INFORMATION TECHNOLOGY, NAGPUR
      </div>
      <div style="margin-top:2mm;">
        (An Institution of National Importance by Act of Parliament)
      </div>
      <div style="margin-top:2mm; max-width:140mm; margin-left:auto; margin-right:auto;">
        Survey No.140,141/1 behind Br.Sheshrao Wankhede Shetkari Sahkari
        Soot Girni, Nagpur, 441108
      </div>
    </div>
  </div>`;

  // ---------- Annexure / Assessment Images Placeholder ----------
  const assessmentPage = `
  <div class="page">
    <h2 class="chapter-title" style="text-align:center;">
      Internship Performance Assessment by employer carrying signature of External Internship Mentor and Organization seal
    </h2>
    <p style="margin-top:10mm; text-align:center; font-size:10pt;">
      [Scanned copy of Internship Performance Assessment by Employer will be inserted here.]
    </p>
    <p style="margin-top:20mm; text-align:center; font-size:10pt;">
      [Scanned copy of Internship Evaluation Sheet will be inserted on the next page.]
    </p>
    <div class="page-footer"></div>
  </div>
  `;

  // ---------- Declaration ----------
  const declarationPage = `
  <div class="page">
    <h2 class="chapter-title" style="text-align:center;">DECLARATION</h2>
    <p>
      I solemnly declare that this internship report is based on work carried out by me during my
      internship at ${escapeHtml(
        company.organizationName
      )}, Mumbai in the PYDEV team, in the capacity
      of ${escapeHtml(
        company.internshipRole
      )}, from ${escapeHtml(student.internshipStart)} to
      ${escapeHtml(student.internshipEnd)}.
    </p>
    <p>
      All the data provided regarding the project is accurate to the best of my knowledge and
      detailed only as much as I am allowed to share.
    </p>
    <p>
      I assert the statements made and conclusions drawn are an outcome of my own work. I
      further certify that
    </p>
    <ol>
      <li>
        The work contained in the report is original and has been done by me under the general
        guidance of my supervisor.
      </li>
      <li>
        I have followed the guidelines provided by the Institute in writing the report.
      </li>
    </ol>
    <div style="margin-top:20mm; text-align:right;">
      <div>${escapeHtml(student.fullName)}</div>
      <div>${escapeHtml(student.enrollmentNumber)}</div>
    </div>
    <div class="page-footer"></div>
  </div>`;

  // ---------- Acknowledgement ----------
  const ackText =
    college.customAcknowledgementText ||
    "I am highly thankful to the honorable Director, Associate Dean and HoD for the facilities provided to accomplish this internship.";
  const acknowledgementPage = `
  <div class="page">
    <h2 class="chapter-title" style="text-align:center;">ACKNOWLEDGEMENT</h2>
    <p>
      I would like to express my gratitude towards ${escapeHtml(
        company.mentorName
      )} for supervising this training
      and providing invaluable advice and feedback throughout the internship.
    </p>
    <p>
      I am highly thankful to the honorable Director, ${escapeHtml(
        college.director
      )}, Associate Dean
      ${escapeHtml(college.dean)}, and HoD, ${escapeHtml(
    college.hod
  )} for the facilities provided
      to accomplish this internship.
    </p>
    <p>
      I would also like to thank ${escapeHtml(
        college.tnpCoordinator
      )}, Training and Placement Coordinator,
      for constant support and advice to complete the internship in the above said organization.
    </p>
    <p>${escapeHtml(ackText)}</p>
    <div style="margin-top:20mm; text-align:right;">
      <div>${escapeHtml(student.fullName)}</div>
      <div>${escapeHtml(student.enrollmentNumber)}</div>
    </div>
    <div class="page-footer"></div>
  </div>`;

  // ---------- Table of Contents ----------
  const tocPage = `
  <div class="page">
    <h2 class="chapter-title" style="text-align:center;">TABLE OF CONTENTS</h2>
    <ol style="line-height:1.6;">
      <li>Internship Performance Assessment Report</li>
      <li>Declaration</li>
      <li>Acknowledgement</li>
      <li>Internship Details</li>
      <li>Introduction of Projects/Modules</li>
      <li>Tools and Technology Learnt</li>
      <li>Technical Details of the Projects or Modules Completed</li>
      <li>Results and Discussion</li>
      <li>Challenges and Learnings from the Internship</li>
      <li>References</li>
    </ol>
    <div class="page-footer"></div>
  </div>
  `;

  // ---------- Chapter 1: Internship Details ----------
  const chapter1 = `
  <div class="page">
    <h2 class="chapter-title">1. INTERNSHIP DETAILS</h2>

    <p><strong>1.1 Organization Name :</strong> ${escapeHtml(
      company.organizationName
    )}</p>
    <p>${escapeHtml(company.addressLine1)}<br/>${escapeHtml(
    company.addressLine2
  )}</p>

    <p><strong>1.2 Business Profile :</strong> Quantitative Trading and Investment firm</p>
    <p>
      ${escapeHtml(
        company.organizationName
      )} is a leading global quantitative trading and
      investment firm that specializes in algorithm based high frequency trading. The firm
      designs and deploys sophisticated algorithmic trading strategies built on advanced
      mathematical and statistical techniques, and trades them across asset classes on multiple
      exchanges worldwide. Alphagrep acts as a major market maker and is consistently among
      the top participants by volume on several exchanges, using ultra low latency trading
      systems and robust risk management frameworks to capture minute market inefficiencies.
      With a team of highly skilled engineers, computer scientists and quantitative researchers
      spread across multiple global offices, the organization focuses on making financial markets
      more transparent and efficient while maintaining a strong culture of technical excellence
      and innovation.
    </p>

    <p><strong>1.3 Internship Profile/Role :</strong> ${escapeHtml(
      company.internshipRole
    )}</p>
    <p>
      During my internship, I worked as a Software Engineering Intern – Python in the PYDEV
      team at Alphagrep Securities Private Limited. The team is responsible for building and
      maintaining several mission critical backend systems that support financial data ingestion,
      transformation, reconciliation and reporting across multiple exchanges and brokers. My
      primary responsibilities included designing and maintaining Python based services and
      scripts that automate key financial workflows, implementing and extending data pipelines
      for price inception, corporate actions and broker specific flows, writing and scheduling
      Apache Airflow DAGs to ensure timely and reliable data availability, and managing
      databases in PostgreSQL, ClickHouse and MongoDB to preserve data integrity at scale.
    </p>
    <div class="page-footer"></div>
  </div>`;

  // ---------- Chapter 2: Introduction of Projects / Modules ----------
  const projectItems = projects
    .map(
      (p, idx) => `
      <p><strong>${idx + 1}. ${escapeHtml(p.title)}</strong></p>
      <p>${escapeHtml(p.objective)}</p>
    `
    )
    .join("");

  const chapter2 = `
  <div class="page">
    <h2 class="chapter-title">2. INTRODUCTION OF PROJECTS/MODULES</h2>
    <p>
      During my internship at Alphagrep Securities Private Limited in the PYDEV team, I worked
      on a set of backend engineering projects that directly support the firm’s high frequency
      trading and post trade workflows. The projects mainly focused on building reliable data
      pipelines, creating granular financial databases, implementing reconciliations against
      broker records, automating operational checks through Slack, and improving the performance
      and maintainability of existing Python services.
    </p>
    <p>The key projects and modules that I contributed to during the internship are:</p>
    ${projectItems}
    <div class="page-footer"></div>
  </div>
  `;

  // ---------- Chapter 3: Tools and Technology Learnt ----------
  const chapter3 = `
  <div class="page">
    <h2 class="chapter-title">3. TOOLS AND TECHNOLOGY LEARNT</h2>
    <p>
      During the internship I worked with a modern backend and data engineering stack commonly
      used in high performance trading and analytics environments.
    </p>
    <p><strong>Programming Languages:</strong> Python (primary), SQL, basic JavaScript / React (exposure).</p>
    <p><strong>Databases and Data Stores:</strong> PostgreSQL, ClickHouse, MongoDB, Redis (exposure).</p>
    <p><strong>Data Engineering and Orchestration:</strong> Apache Airflow for scheduling and monitoring pipelines.</p>
    <p><strong>Operating Systems:</strong> Linux based servers.</p>
    <p><strong>Development Tools and Practices:</strong> Git, internal monitoring and logging tools.</p>
    <p><strong>Communication and Collaboration:</strong> Slack for daily communication and incident alerts.</p>

    <div style="margin-top:10mm; text-align:center;">
      <img src="${defaultImages.figTechStackUrl}"
           alt="Different Technologies Learnt"
           style="max-width:150mm; height:auto;" />
      <div style="margin-top:4mm; font-weight:bold; font-size:10pt;">
        Fig 1.1 Different Technologies learnt
      </div>
    </div>
    <div class="page-footer"></div>
  </div>
  `;

  // ---------- Chapter 4: Technical Details ----------
  const chapter4 = `
  <div class="page">
    <h2 class="chapter-title">4. TECHNICAL DETAILS OF THE PROJECTS / MODULES COMPLETED</h2>
    <p>
      This chapter describes the detailed technical design and implementation of the main modules
      developed during the internship. The work was carried out in the PYDEV team, which owns
      multiple backend systems that support trading, post trade processing and financial reporting.
    </p>
    <p>
      All the projects described here follow a common set of design principles: reliability and
      determinism for financial data flows, auditability of results, ease of monitoring and
      operational control, and extensibility for adding new brokers, exchanges and instruments.
    </p>

    <p><strong>4.1 System Environment and Tech Stack</strong></p>
    <p>
      Python was used for core backend services and Airflow DAGs. PostgreSQL and ClickHouse
      were used for relational and analytical workloads respectively, while MongoDB supported
      semi structured data. Redis was used selectively as an in memory cache. All services ran on
      Linux based servers with Git for version control and Slack for alerts.
    </p>

    <p><strong>4.2 Corporate Actions Database and PnL Integration</strong></p>
    <p>
      Corporate actions such as dividends, stock splits, bonus issues and rights issues have a direct
      effect on positions and PnL. The objective of this module was to build a centralised Corporate
      Actions Database, normalise data from external feeds into a consistent internal format,
      integrate corporate action adjustments into the firm’s core PnL engine, and provide granular
      and auditable data for operations and trading teams.
    </p>
    <p>
      A Python ingestion script reads raw corporate action feeds from external providers or
      exchanges, validates required fields, maps symbols to internal instrument identifiers and
      converts dates into a standard format. Clean records are inserted into a dedicated
      <em>corporate_action_event</em> table with duplicate detection. During PnL calculation, the
      engine queries this table to compute the effect of each corporate action on positions and
      cash, and writes the resulting adjustments into a <em>ca_pnl_adjustment_log</em>.
    </p>
    <p>
      Operations and trading teams use internal tools to view all corporate actions applied on a
      given trading day and their impact on PnL.
    </p>

    <div style="margin-top:8mm; text-align:center;">
      <img src="${defaultImages.figCorporateUrl}"
           alt="Corporate Actions Table Screenshot"
           style="max-width:160mm; height:auto;" />
      <div style="margin-top:4mm; font-weight:bold; font-size:10pt;">
        Fig 1.2 Corporate Actions Table
      </div>
    </div>

    <p style="margin-top:8mm;"><strong>4.3 Reconciliation Framework for Multiple Broker Setups</strong></p>
    <p>
      The reconciliation framework ensures that the internal view of trades, positions and PnL
      matches the external view reported by brokers. Python based reconciliation modules fetch
      internal and broker side datasets, normalise them to a common schema, and compare
      quantities, prices, PnL and fees per symbol and account. Mismatches beyond configured
      tolerances are written to recon tables and surfaced via Slack alerts.
    </p>

    <p><strong>4.4 Slack Based Alerting and Bot Automation</strong></p>
    <p>
      Backend events such as reconciliation status, pipeline failures and data completeness checks
      are integrated with Slack so that important events are visible in real time. A Slack bot also
      allows users to trigger reconciliation jobs or reruns directly from Slack commands.
    </p>

    <p><strong>4.5 Apache Airflow DAGs</strong></p>
    <p>
      Apache Airflow DAGs were defined for price inception and reconciliation workflows,
      capturing dependencies between tasks, retry policies and logging. This ensured that data
      was available in the correct order and within strict timing constraints, while providing a
      central UI for monitoring and reruns.
    </p>
    <div class="page-footer"></div>
  </div>
  `;

  // ---------- Chapter 5 ----------
  const chapter5 = `
  <div class="page">
    <h2 class="chapter-title">5. RESULTS AND DISCUSSION</h2>
    <p>
      The modules developed during the internship improved data quality, system reliability and
      operational workflows at Alphagrep Securities Private Limited. The Corporate Actions
      Database made PnL adjustments traceable and reproducible. Before this work, the impact of
      dividends, splits and bonuses was spread across ad hoc scripts and spreadsheets, making it
      difficult to answer questions such as how much of the PnL on a given day came purely from
      corporate actions for a specific symbol.
    </p>
    <p>
      The reconciliation framework systematically detected mismatches between internal and
      broker views, quantified the differences and alerted relevant teams. The objective was not to
      force mismatches to zero, but to ensure that any difference was detected consistently and
      communicated in time to act on it.
    </p>
    <p>
      Airflow based pipelines provided a central place to view all runs and their status, with task
      level logs and retry mechanisms reducing the need for manual interventions. Slack alerts
      ensured that operational teams were notified quickly about pipeline failures or reconciliation
      issues. Performance optimisations on selected Python modules reduced runtimes and
      stabilised database load during peak periods.
    </p>
    <div class="page-footer"></div>
  </div>
  `;

  // ---------- Chapter 6 ----------
  const chapter6 = `
  <div class="page">
    <h2 class="chapter-title">6. CHALLENGES AND LEARNINGS FROM THE INTERNSHIP</h2>
    <p>
      Key challenges included understanding a large production grade codebase, working with new
      financial domain concepts, handling incomplete or inconsistent data from multiple brokers,
      designing a configuration driven reconciliation framework, debugging timing issues in
      scheduled pipelines, and implementing performance optimisations safely for critical
      financial workflows.
    </p>
    <p>
      Major learnings were: developing a systematic approach to reading complex systems,
      translating business requirements into technical designs, writing robust data pipelines,
      appreciating configuration driven architecture, using Airflow effectively, tuning
      performance in real systems, improving code quality through reviews, collaborating with
      cross functional teams, and managing time and ownership under production deadlines.
    </p>
    <p>
      Overall, the internship strengthened my interest in backend engineering and data intensive
      systems where correctness and performance are critical.
    </p>
    <div class="page-footer"></div>
  </div>
  `;

  // ---------- Chapter 7: References ----------
  const chapter7 = `
  <div class="page">
    <h2 class="chapter-title">7. REFERENCES</h2>
    <ol>
      <li>AlphaGrep Securities Private Limited, Official Website, https://www.alpha-grep.com/</li>
      <li>Python Software Foundation, Python 3 Documentation, https://docs.python.org/3/</li>
      <li>Apache Airflow Documentation, https://airflow.apache.org/docs/</li>
      <li>PostgreSQL Documentation, https://www.postgresql.org/docs/</li>
      <li>ClickHouse Documentation, https://clickhouse.com/docs/</li>
      <li>MongoDB Manual, https://www.mongodb.com/docs/</li>
      <li>Redis Documentation, https://redis.io/docs/</li>
      <li>Slack API Documentation, https://api.slack.com/</li>
    </ol>
    <div class="page-footer"></div>
  </div>
  `;

  // ---------- Final Page: Internal Mentor ----------
  const lastPage = `
  <div class="page">
    <div style="position:absolute; bottom:30mm; left:30mm; font-size:11pt;">
      <p>Name of Internal Mentor: Mrs. Roma Goel</p>
      <p>Signature with Date: ________________________________</p>
    </div>
    <div class="page-footer"></div>
  </div>
  `;

  // ---------- Full HTML ----------
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>Internship Report - ${escapeHtml(student.fullName)}</title>
  <style>
    body {
      font-family: "Times New Roman", serif;
      margin: 0;
      padding: 0;
      counter-reset: pageNumber;
    }
    .page {
      width: 210mm;
      min-height: 297mm;
      padding: 25mm 30mm;
      margin: 10mm auto;
      box-sizing: border-box;
      position: relative;
      counter-increment: pageNumber;
    }
    .title-page { text-align: center; }
    p { text-align: justify; font-size: 11pt; line-height: 1.5; }
    .chapter-title { font-size: 14pt; text-decoration: underline; margin-bottom: 6mm; }
    ol { font-size: 11pt; line-height: 1.5; padding-left: 5mm; }
    em { font-style: italic; }

    .page-footer {
      position: absolute;
      bottom: 15mm;
      right: 30mm;
      font-size: 10pt;
    }
    .page-footer::after {
      content: counter(pageNumber);
    }
  </style>
</head>
<body>
  ${titlePage}
  ${assessmentPage}
  ${declarationPage}
  ${acknowledgementPage}
  ${tocPage}
  ${chapter1}
  ${chapter2}
  ${chapter3}
  ${chapter4}
  ${chapter5}
  ${chapter6}
  ${chapter7}
  ${lastPage}
</body>
</html>`;
}