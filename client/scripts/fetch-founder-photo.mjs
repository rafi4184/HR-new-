// Pulls the founder photo from GitHub at build time instead of shipping the
// binary through the manual deploy pipeline (avoids corrupting it in transit).
import { writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dest = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "public",
  "images",
  "hasanur-rahman.jpg",
);

if (existsSync(dest)) {
  process.exit(0);
}

const url =
  "https://raw.githubusercontent.com/rafi4184/hr-new-/claude/website-access-ali496/client/public/images/hasanur-rahman.jpg";

try {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`fetch failed: ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await mkdir(path.dirname(dest), { recursive: true });
  await writeFile(dest, buf);
  console.log(`Fetched founder photo (${buf.length} bytes)`);
} catch (err) {
  console.warn(`Skipping founder photo fetch: ${err.message}`);
}
