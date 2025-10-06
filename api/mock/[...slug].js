const { readFile } = require('node:fs/promises');
const path = require('node:path');

let cache = null;

module.exports = async (req, res) => {
  try {
    if (!cache) {
      const filePath = path.join(__dirname, '../../../data/db.json');
      const file = await readFile(filePath, 'utf-8');
      cache = JSON.parse(file);
    }

    const slug = (req.query && req.query.slug) || [];
    const [collection, id] = slug;

    if (!collection) return res.status(400).send({ error: 'Missing collection segment' });

    const data = cache[collection];
    if (!data) return res.status(404).send({ error: `Collection '${collection}' not found` });

    if (!id) return res.status(200).send(data);

    const match = Array.isArray(data)
      ? data.find((x) => String(x && x.id) === String(id))
      : (data && typeof data === 'object' ? data[id] : undefined);

    if (match === undefined) return res.status(404).send({ error: `Item '${id}' not found` });

    res.status(200).send(match);
  } catch (e) {
    res.status(500).send({ error: 'Failed to read mock data' });
  }
};
