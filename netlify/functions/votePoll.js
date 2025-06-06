


const mysql = require('mysql2/promise');

exports.handler = async (event) => {
  try {
    const { pollId, optionIndex } = JSON.parse(event.body);

    // Connect to MySQL
    const connection = await mysql.createConnection({
      host: 'hilley-consultants.com',
      user: 'hilleyco_judge',
      password: '@X991poller',
      database: 'hilleyco_poll',
      port: 3306
    });

    // Get current poll options
    const [rows] = await connection.execute('SELECT options, expiresAt FROM polls WHERE id = ?', [pollId]);
    if (rows.length === 0) {
      await connection.end();
      return { statusCode: 404, body: JSON.stringify({ error: 'Poll not found' }) };
    }
    const poll = rows[0];
    if (poll.expiresAt && new Date(poll.expiresAt) < new Date()) {
      await connection.end();
      return { statusCode: 403, body: JSON.stringify({ error: 'Poll has expired.' }) };
    }
    const options = JSON.parse(poll.options);

    // Increment the vote
    if (options[optionIndex]) {
      options[optionIndex].votes += 1;
    } else {
      await connection.end();
      return { statusCode: 400, body: JSON.stringify({ error: 'Invalid option index' }) };
    }

    // Update the poll in the database
    await connection.execute('UPDATE polls SET options = ? WHERE id = ?', [JSON.stringify(options), pollId]);
    await connection.end();

    return { statusCode: 200, body: JSON.stringify({ message: 'Vote recorded' }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
