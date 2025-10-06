module.exports = async (req, res) => {
  const { candidates } = require("./_utils");
  const fs = require("fs");
  const path = require("path");

  const cands = candidates().map(p => ({
    path: p,
    exists: fs.existsSync(p),
    size: fs.existsSync(p) ? fs.statSync(p).size : null
  }));

  let cwdFiles = [];
  try { cwdFiles = fs.readdirSync(process.cwd()); } catch {}

  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.status(200).end(JSON.stringify({
    cwd: process.cwd(),
    __dirname,
    candidates: cands,
    cwdFiles
  }, null, 2));
};
