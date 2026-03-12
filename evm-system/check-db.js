const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join(__dirname, 'database.db');
const db = new sqlite3.Database(dbPath);

db.all("SELECT * FROM students", (err, rows) => {
    if (err) {
        console.error(err);
    } else {
        console.log("Students in database:");
        console.table(rows);
    }
    db.close();
});
