module.exports = async (req, res) => {
  const { readDB } = require("./_utils");
  try {
    const db = await readDB();
    const list = Array.isArray(db?.surveys) ? db.surveys : [];
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.status(200).end(JSON.stringify(list));
  } catch (e) {
    console.error("[/api/mock/surveys] ERROR:", e?.stack || e);
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.status(500).end(JSON.stringify({ error: String(e && e.message || e) }));
  }
};
