const mysql = require('mysql2/promise');

exports.handler = async () => {
  try {
    const connection = await mysql.createConnection({
      host: 'hilley-consultants.com',
      user: 'hilleyco_judge',
      password: '@X991poller',
      database: 'hilleyco_poll',
      port: 3306
    });

    const [rows] = await connection.execute('SELECT * FROM polls WHERE approved = 1');
    await connection.end();

    // Parse options from JSON string
    const now = new Date();
    const active = rows.filter(row => {
      const expiresAt = row.expiresAt ? new Date(row.expiresAt) : null;
      return !expiresAt || expiresAt > now;
    }).map(row => ({ ...row, options: JSON.parse(row.options) }));
    const expired = rows.filter(row => {
      const expiresAt = row.expiresAt ? new Date(row.expiresAt) : null;
      return expiresAt && expiresAt <= now;
    }).map(row => ({ ...row, options: JSON.parse(row.options) }));

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