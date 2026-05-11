import axios from "axios";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// * Daftar website yang mau dipantau
const SITES = [
  { name: "Google", url: "https://www.google.com" },
  { name: "GitHub", url: "https://github.com" },
  { name: "Cloudflare", url: "https://1.1.1.1" },
];

async function checkHealth() {
  const dataPath = path.join(__dirname, "health-report.md");
  let report = `### Health Check Report - ${new Date().toLocaleString("id-ID")}\n\n`;
  report += `| Service | Status | Response Time | Timestamp |\n`;
  report += `| --- | --- | --- | --- |\n`;

  console.log("🔍 Sentinel-Zero: Starting health check...");

  for (const site of SITES) {
    const start = Date.now();
    try {
      const response = await axios.get(site.url, { timeout: 5000 });
      const duration = Date.now() - start;
      report += `| ${site.name} | ✅ Online (${response.status}) | ${duration}ms | ${new Date().toISOString()} |\n`;
    } catch (error: any) {
      report += `| ${site.name} | ❌ Offline | - | ${new Date().toISOString()} |\n`;
    }
  }

  // * Tambahkan baris baru di file (Append mode)
  fs.appendFileSync(dataPath, report + "\n---\n");
  console.log("✅ Report updated in health-report.md");
}

checkHealth();
