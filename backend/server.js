import express from "express";
import cors from "cors";
import puppeteer from "puppeteer";

import { student } from "./data/student.js";
import { company } from "./data/company.js";
import { college } from "./data/college.js";
import { logs } from "./data/logs.js";
import { projects } from "./data/projects.js";
import { evaluation } from "./data/evaluation.js";
import { performanceAssessment } from "./data/performance.js";
import { buildReportHtml } from "./report/reportTemplate.js";

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// Simple health check
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Internship report backend running" });
});

// API endpoints to fetch data (dummy for now)
app.get("/api/student", (req, res) => res.json(student));
app.get("/api/company", (req, res) => res.json(company));
app.get("/api/college", (req, res) => res.json(college));
app.get("/api/logs", (req, res) => res.json(logs));
app.get("/api/projects", (req, res) => res.json(projects));
app.get("/api/evaluation", (req, res) => res.json(evaluation));
app.get("/api/performance", (req, res) => res.json(performanceAssessment));

// HTML report endpoint (used by Preview)
app.get("/api/report/html", (req, res) => {
  const html = buildReportHtml();
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(html);
});

// PDF generation endpoint (used by Print / Save as PDF)
app.get("/api/report/pdf", async (req, res) => {
  try {
    const html = buildReportHtml();

    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });
    const page = await browser.newPage();

    await page.setContent(html, {
      waitUntil: "networkidle0"
    });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "15mm",
        bottom: "15mm",
        left: "15mm",
        right: "15mm"
      }
    });

    await browser.close();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="Internship_Report.pdf"'
    );
    res.send(pdfBuffer);
  } catch (err) {
    console.error("Error generating PDF:", err);
    res.status(500).json({ error: "Failed to generate PDF" });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});