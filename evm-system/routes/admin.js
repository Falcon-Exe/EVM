const express = require('express');
const { createObjectCsvWriter } = require('csv-writer');
const path = require('path');

module.exports = (db, DEBUG = false) => {
    const router = express.Router();

    // Simple admin auth middleware
    const adminAuth = (req, res, next) => {
        if (req.session.adminLoggedIn || DEBUG) {
            next();
        } else {
            res.status(401).json({ error: 'Unauthorized' });
        }
    };

    router.post('/login', (req, res) => {
        const { password } = req.body;
        db.get("SELECT value FROM config WHERE key = 'admin_password'", (err, row) => {
            if (row.value === password) {
                req.session.adminLoggedIn = true;
                db.run("INSERT INTO audit_logs (event, details) VALUES (?, ?)", ['ADMIN_LOGIN', 'Success']);
                res.json({ success: true });
            } else {
                db.run("INSERT INTO audit_logs (event, details) VALUES (?, ?)", ['ADMIN_LOGIN', 'Failed Attempt']);
                res.status(401).json({ error: 'Invalid password' });
            }
        });
    });

    router.get('/status-check', adminAuth, (req, res) => {
        res.json({ isAdmin: true });
    });

    router.get('/results', adminAuth, (req, res) => {
        db.all("SELECT * FROM candidates ORDER BY position, votes DESC", (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(rows);
        });
    });

    router.post('/toggle-election', adminAuth, (req, res) => {
        const { status } = req.body;
        db.run("UPDATE config SET value = ? WHERE key = 'election_status'", [status], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            db.run("INSERT INTO audit_logs (event, details) VALUES (?, ?)", ['ELECTION_STATUS_CHANGE', `New Status: ${status}`]);
            res.json({ success: true, status });
        });
    });

    router.get('/voter-stats', adminAuth, (req, res) => {
        db.get(`SELECT 
          (SELECT COUNT(*) FROM students) as total,
          (SELECT COUNT(*) FROM students WHERE has_voted = 1) as casted`, (err, row) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(row);
        });
    });

    router.get('/voters/:query', adminAuth, (req, res) => {
        const query = req.params.query;
        console.log(`Searching for voter: ${query}`);
        db.all("SELECT * FROM students WHERE cic_no = ? OR reg_no = ?", [query, query], (err, rows) => {
            if (err) {
                console.error(`Search error: ${err.message}`);
                return res.status(500).json({ error: err.message });
            }
            console.log(`Found ${rows.length} results for: ${query}`);
            res.json(rows);
        });
    });

    router.post('/approve-voter', adminAuth, (req, res) => {
        const { id } = req.body;
        db.get("SELECT name FROM students WHERE id = ?", [id], (err, student) => {
            db.run("UPDATE students SET approved = 1 WHERE id = ?", [id], (err) => {
                if (err) return res.status(500).json({ error: err.message });
                db.run("INSERT INTO audit_logs (event, details) VALUES (?, ?)", ['VOTER_APPROVED', `Student: ${student ? student.name : 'Unknown'} (ID: ${id})`]);
                res.json({ success: true });
            });
        });
    });

    router.get('/export', adminAuth, (req, res) => {
        const exportPath = path.join(__dirname, '../results.csv');
        db.all("SELECT * FROM candidates ORDER BY position, votes DESC", (err, rows) => {
            const csvWriter = createObjectCsvWriter({
                path: exportPath,
                header: [
                    { id: 'position', title: 'POSITION' },
                    { id: 'name', title: 'CANDIDATE' },
                    { id: 'votes', title: 'VOTES' }
                ]
            });

            csvWriter.writeRecords(rows)
                .then(() => {
                    res.download(exportPath);
                });
        });
    });

    router.get('/export-audit', adminAuth, (req, res) => {
        const exportPath = path.join(__dirname, '../audit_logs.csv');
        db.all("SELECT * FROM audit_logs ORDER BY timestamp DESC", (err, rows) => {
            const csvWriter = createObjectCsvWriter({
                path: exportPath,
                header: [
                    { id: 'timestamp', title: 'TIMESTAMP' },
                    { id: 'event', title: 'EVENT' },
                    { id: 'details', title: 'DETAILS' }
                ]
            });

            csvWriter.writeRecords(rows)
                .then(() => {
                    res.download(exportPath);
                });
        });
    });

    router.post('/reset-all', adminAuth, (req, res) => {
        const { password } = req.body;
        db.get("SELECT value FROM config WHERE key = 'admin_password'", (err, row) => {
            if (row.value === password) {
                db.serialize(() => {
                    db.run("UPDATE candidates SET votes = 0");
                    db.run("UPDATE students SET has_voted = 0, approved = 0");
                    db.run("DELETE FROM votes");
                    db.run("INSERT INTO audit_logs (event, details) VALUES (?, ?)", ['MASTER_RESET', 'All data cleared for live election']);
                });
                res.json({ success: true });
            } else {
                res.status(401).json({ error: 'Invalid master password' });
            }
        });
    });

    router.get('/network-info', adminAuth, (req, res) => {
        const { networkInterfaces } = require('os');
        const nets = networkInterfaces();
        const results = {};

        for (const name of Object.keys(nets)) {
            for (const net of nets[name]) {
                if (net.family === 'IPv4' && !net.internal) {
                    if (!results[name]) results[name] = [];
                    results[name].push(net.address);
                }
            }
        }
        res.json(results);
    });

    // --- DEBUG ROUTES ---
    router.post('/debug/approve-all', (req, res) => {
        if (!DEBUG) return res.status(403).json({ error: 'Debug mode disabled' });
        db.run("UPDATE students SET approved = 1 WHERE has_voted = 0", (err) => {
            if (err) return res.status(500).json({ error: err.message });
            db.run("INSERT INTO audit_logs (event, details) VALUES (?, ?)", ['DEBUG_COMMAND', 'All voters approved instantly']);
            res.json({ success: true, message: 'All 159 voters are now approved for testing.' });
        });
    });

    router.get('/debug/config', (req, res) => {
        res.json({ debug: DEBUG });
    });

    router.get('/debug/all-voters', adminAuth, (req, res) => {
        if (!DEBUG) return res.status(403).json({ error: 'Debug mode disabled' });
        db.all("SELECT * FROM students ORDER BY name ASC", (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(rows);
        });
    });

    router.post('/debug/update-voter', (req, res) => {
        if (!DEBUG) return res.status(403).json({ error: 'Debug mode disabled' });
        const { id, name, cic_no, reg_no } = req.body;
        db.run("UPDATE students SET name = ?, cic_no = ?, reg_no = ? WHERE id = ?",
            [name, cic_no, reg_no, id], (err) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ success: true });
            });
    });

    router.post('/debug/update-candidate', (req, res) => {
        if (!DEBUG) return res.status(403).json({ error: 'Debug mode disabled' });
        const { id, name, symbol } = req.body;
        db.run("UPDATE candidates SET name = ?, symbol = ? WHERE id = ?",
            [name, symbol, id], (err) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ success: true });
            });
    });

    router.post('/debug/delete-voter', (req, res) => {
        if (!DEBUG) return res.status(403).json({ error: 'Debug mode disabled' });
        const { id } = req.body;
        db.serialize(() => {
            db.run("DELETE FROM students WHERE id = ?", [id]);
            db.run("DELETE FROM votes WHERE student_id = ?", [id]);
            db.run("INSERT INTO audit_logs (event, details) VALUES (?, ?)", ['DEBUG_COMMAND', `Student ID ${id} deleted permanently`]);
        });
        res.json({ success: true });
    });

    return router;
};
