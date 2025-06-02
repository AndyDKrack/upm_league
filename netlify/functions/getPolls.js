exports.handler = async () => {
  try {
    // Use require to ensure Netlify bundles polls.json
    const polls = require('./polls.json');
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