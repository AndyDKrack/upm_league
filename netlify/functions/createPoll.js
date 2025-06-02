const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

exports.handler = async (event) => {
  // Write to the same file used by getPolls.js
  const filePath = path.join(__dirname, 'polls.json');
  const polls = JSON.parse(fs.readFileSync(filePath));

  const body = JSON.parse(event.body);
  const newPoll = {
    id: uuidv4(),
    question: body.question,
    options: body.options.map(opt => ({ text: opt, votes: 0 })),
    approved: false,
    multi: body.multi || false,
    county: body.county || 'Unknown',
    expiresAt: body.expiresAt || null
  };

  polls.push(newPoll);
  fs.writeFileSync(filePath, JSON.stringify(polls, null, 2));

  return {
    statusCode: 201,
    body: JSON.stringify({ message: "Poll submitted for moderation." }),
  };
};
