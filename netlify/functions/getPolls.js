const fs = require('fs');
const path = require('path');

exports.handler = async () => {
  try {
    // Use path.resolve for absolute path
    const filePath = path.resolve(__dirname, '../../src/data/polls.json');
    if (!fs.existsSync(filePath)) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'polls.json not found', filePath }),
      };
    }
    const polls = JSON.parse(fs.readFileSync(filePath));
    const now = new Date();
    const approved = polls.filter(p => p.approved);
    const active = approved.filter(p => !p.expiresAt || new Date(p.expiresAt) > now);
    const expired = approved.filter(p => p.expiresAt && new Date(p.expiresAt) <= now);

    return {
      statusCode: 200,
      body: JSON.stringify({ active, expired }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};