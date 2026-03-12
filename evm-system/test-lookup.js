const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join(__dirname, 'database.db');
const db = new sqlite3.Database(dbPath);

const testId = 'S101';
db.get("SELECT * FROM students WHERE id = ?", [testId], (err, row) => {
    if (err) console.error(err);
    console.log(`Searching for '${testId}':`, row);

    const testIdLower = 's101';
    db.get("SELECT * FROM students WHERE id = ?", [testIdLower], (err, row) => {
        console.log(`Searching for '${testIdLower}':`, row);
        db.close();
    });
});
