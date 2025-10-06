const { readDB } = require("./_utils");

module.exports = async (req, res) => {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method Not Allowed" });
  }
  try {
    const db = await readDB();
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    return res.status(200).json(db);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Failed to read database" });
  }
};
