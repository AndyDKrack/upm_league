const fs = require('fs');
const path = require('path');

exports.handler = async () => {
  const filePath = path.join(__dirname, '../../src/data/polls.json');
  const polls = JSON.parse(fs.readFileSync(filePath));
  const now = new Date();
  const approved = polls.filter(p => p.approved);
  const active = approved.filter(p => !p.expiresAt || new Date(p.expiresAt) > now);
  const expired = approved.filter(p => p.expiresAt && new Date(p.expiresAt) <= now);

  return {
    statusCode: 200,
    body: JSON.stringify({ active, expired }),
  };
};
