const fs = require("fs/promises");
const fss = require("fs"); // sync exists checks
const path = require("path");

function candidates() {
  const cwd = process.cwd();
  const here = __dirname;
  const arr = [
    path.join(cwd, "data", "db.json"),
    path.join(here, "..", "..", "data", "db.json"),
    path.join(here, "..", "data", "db.json"),
    path.join(here, "data", "db.json"),
    path.resolve("data/db.json"),
  ];
  // De-dupe
  return [...new Set(arr)];
}

async function resolveDbPath() {
  const list = candidates();
  for (const p of list) {
    if (fss.existsSync(p)) {
      return p;
    }
  }
  const msg = `db.json not found. Checked:\n${list.join("\n")}\n__dirname=${__dirname}\ncwd=${process.cwd()}`;
  throw new Error(msg);
}

async function readDB() {
  const file = await resolveDbPath();
  const raw = await fs.readFile(file, "utf8");
  return JSON.parse(raw);
}

module.exports = { readDB, candidates };
