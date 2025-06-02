const mysql = require('mysql2/promise');
const { v4: uuidv4 } = require('uuid');

exports.handler = async (event) => {
  const body = JSON.parse(event.body);
  const newPoll = {
    id: uuidv4(),
    question: body.question,
    options: JSON.stringify(body.options.map(opt => ({ text: opt, votes: 0 }))),
    approved: false,
    multi: body.multi || false,
    county: body.county || 'Unknown',
    expiresAt: body.expiresAt || null
  };

  // Connect to MySQL
  const connection = await mysql.createConnection({
    host: 'hilley-consultants.com',
    user: 'hilleyco_judge',
    password: '@X991poller',
    database: 'hilleyco_poll',
    port: 3306
  });

  await connection.execute(
    'INSERT INTO polls (id, question, options, approved, multi, county, expiresAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [newPoll.id, newPoll.question, newPoll.options, newPoll.approved, newPoll.multi, newPoll.county, newPoll.expiresAt]
  );
  await connection.end();

  return {
    statusCode: 201,
    body: JSON.stringify({ message: "Poll submitted for moderation." }),
  };
};
