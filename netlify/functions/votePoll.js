const fs = require('fs');
const path = require('path');

exports.handler = async (event) => {
  const { pollId, optionIndexes, ip } = JSON.parse(event.body);

  const pollFile = path.join(__dirname, '../../src/data/polls.json');
  const voteFile = path.join(__dirname, '../../src/data/submissions.json');
  const polls = JSON.parse(fs.readFileSync(pollFile));
  const submissions = JSON.parse(fs.readFileSync(voteFile));

  const poll = polls.find(p => p.id === pollId);
  if (!poll) return { statusCode: 404, body: 'Poll not found' };

  if (poll.expiresAt && new Date(poll.expiresAt) < new Date()) {
    return { statusCode: 403, body: 'Poll has expired.' };
  }

  if (!submissions[pollId]) submissions[pollId] = [];
  if (submissions[pollId].includes(ip)) {
    return { statusCode: 403, body: 'Duplicate vote detected.' };
  }

  optionIndexes.forEach(i => {
    if (poll.options[i]) poll.options[i].votes++;
  });

  submissions[pollId].push(ip);
  fs.writeFileSync(pollFile, JSON.stringify(polls, null, 2));
  fs.writeFileSync(voteFile, JSON.stringify(submissions, null, 2));

  return {
    statusCode: 200,
    body: JSON.stringify(poll),
  };
};
