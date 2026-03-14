const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join(__dirname, 'database.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    console.log("Starting database migration...");
    
    // Check if column already exists to avoid errors
    db.all("PRAGMA table_info(students)", (err, rows) => {
        if (err) {
            console.error("Error checking table info:", err.message);
            db.close();
            return;
        }

        const hasSecurePin = rows.some(row => row.name === 'secure_pin');
        
        if (!hasSecurePin) {
            console.log("Adding 'secure_pin' column to 'students' table...");
            db.run("ALTER TABLE students ADD COLUMN secure_pin TEXT", (err) => {
                if (err) {
                    console.error("Error adding column:", err.message);
                } else {
                    console.log("Migration successful: 'secure_pin' column added.");
                }
                db.close();
            });
        } else {
            console.log("'secure_pin' column already exists. Skipping.");
            db.close();
        }
    });
});
