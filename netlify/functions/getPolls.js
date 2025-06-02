const mysql = require('mysql2/promise');

exports.handler = async (event) => {
  try {
    const { pollId, optionIndex } = JSON.parse(event.body);
    const voter_ip = event.headers['x-forwarded-for'] || 'unknown';

    const connection = await mysql.createConnection({
      host: 'hilley-consultants.com',
      user: 'hilleyco_judge',
      password: '@X991poller',
      database: 'hilleyco_poll',
      port: 3306
    });

    // Check for duplicate vote
    const [existing] = await connection.execute(
      'SELECT id FROM votes WHERE poll_id = ? AND voter_ip = ?',
      [pollId, voter_ip]
    );
    if (existing.length > 0) {
      await connection.end();
      return { statusCode: 403, body: JSON.stringify({ error: 'Duplicate vote detected.' }) };
    }

    // Get poll options
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

    // Update poll and record vote
    await connection.execute('UPDATE polls SET options = ? WHERE id = ?', [JSON.stringify(options), pollId]);
    await connection.execute(
      'INSERT INTO votes (poll_id, voter_ip, option_index) VALUES (?, ?, ?)',
      [pollId, voter_ip, optionIndex]
    );
    await connection.end();

    return { statusCode: 200, body: JSON.stringify({ message: 'Vote recorded' }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};