const { readFile } = require('node:fs/promises');
const path = require('node:path');

let cache = null;

module.exports = async (req, res) => {
  try {
    if (!cache) {
      const filePath = path.join(__dirname, '../../data/db.json');
      const file = await readFile(filePath, 'utf-8');
      cache = JSON.parse(file);
    }
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(cache);
  } catch (e) {
    res.status(500).send({ error: 'Failed to read mock data' });
  }
};
