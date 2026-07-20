const mysql = require('mysql2/promise');
(async () => {
    const conn = await mysql.createConnection({host: 'localhost', user: 'root', password: 'root123', database: 'pavithra_erp_db'});
    const [tables] = await conn.execute("SELECT table_name, column_name, is_nullable FROM information_schema.columns WHERE table_schema = 'pavithra_erp_db' AND data_type IN ('date', 'datetime', 'timestamp')");
    for (const row of tables) {
        let query;
        if (row.IS_NULLABLE === 'YES') {
            query = `UPDATE \`${row.TABLE_NAME}\` SET \`${row.COLUMN_NAME}\` = NULL WHERE CAST(\`${row.COLUMN_NAME}\` AS CHAR) LIKE '0000-00-00%'`;
        } else {
            query = `UPDATE \`${row.TABLE_NAME}\` SET \`${row.COLUMN_NAME}\` = '2026-06-30 00:00:00' WHERE CAST(\`${row.COLUMN_NAME}\` AS CHAR) LIKE '0000-00-00%'`;
        }
        try {
            const [res] = await conn.execute(query);
            if (res.affectedRows > 0) console.log(`Fixed ${res.affectedRows} in ${row.TABLE_NAME}.${row.COLUMN_NAME}`);
        } catch(e) {}
    }
    await conn.end();
})();
