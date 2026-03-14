const express = require('express');

module.exports = (db, DEBUG = false) => {
    const router = express.Router();

    // Voter Login
    router.post('/login', (req, res) => {
        let { studentId } = req.body;
        if (!studentId) return res.status(400).json({ error: 'ID is required' });

        studentId = studentId.trim();

        // Search by CIC No or Reg No
        db.get("SELECT * FROM students WHERE cic_no = ? OR reg_no = ?", [studentId, studentId], (err, student) => {
            if (err) return res.status(500).json({ error: err.message });
            if (!student) return res.status(404).json({ error: 'Voter not found. Check your CIC/Reg No.' });

            if (student.has_voted) {
                return res.status(403).json({ error: 'You have already voted' });
            }

            if (!student.approved) {
                return res.status(403).json({ error: 'You are not approved yet. Please see the election officer.' });
            }

            // Check election status
            db.get("SELECT value FROM config WHERE key = 'election_status'", (err, config) => {
                const status = (config && config.value) || 'stopped';
                if (status !== 'running' && !DEBUG) {
                    return res.status(403).json({ error: 'Election is not currently running' });
                }

                req.session.studentId = student.id;
                res.json({ success: true, name: student.name });
            });
        });
    });

    // Remote Login (Method 1)
    router.post('/remote-login', (req, res) => {
        let { studentId, pin } = req.body;
        if (!studentId || !pin) return res.status(400).json({ error: 'ID and PIN are required' });

        studentId = studentId.trim();
        pin = pin.trim();

        db.get("SELECT * FROM students WHERE cic_no = ? OR reg_no = ?", [studentId, studentId], (err, student) => {
            if (err) return res.status(500).json({ error: err.message });
            if (!student) return res.status(404).json({ error: 'Voter not found.' });

            if (student.has_voted) {
                return res.status(403).json({ error: 'You have already voted' });
            }

            if (!student.secure_pin || student.secure_pin !== pin) {
                return res.status(401).json({ error: 'Invalid PIN or Remote Voting not enabled for this ID.' });
            }

            // Check election status
            db.get("SELECT value FROM config WHERE key = 'election_status'", (err, config) => {
                const status = (config && config.value) || 'stopped';
                if (status !== 'running' && !DEBUG) {
                    return res.status(403).json({ error: 'Election is not currently running' });
                }

                req.session.studentId = student.id;
                req.session.isRemote = true; // Flag for audit
                res.json({ success: true, name: student.name });
            });
        });
    });

    router.get('/session-status', (req, res) => {
        if (req.session.studentId) {
            db.get("SELECT name FROM students WHERE id = ?", [req.session.studentId], (err, student) => {
                if (err || !student) return res.status(401).json({ error: 'Session invalid' });
                res.json({ loggedIn: true, name: student.name });
            });
        } else {
            res.json({ loggedIn: false });
        }
    });

    // Get Candidates
    router.get('/candidates', (req, res) => {
        db.all("SELECT * FROM candidates", (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            const positions = rows.reduce((acc, curr) => {
                if (!acc[curr.position]) acc[curr.position] = [];
                acc[curr.position].push(curr);
                return acc;
            }, {});
            res.json(positions);
        });
    });

    // Submit Vote
    router.post('/submit-vote', (req, res) => {
        const { votes } = req.body; // Array of candidate IDs
        const studentId = req.session.studentId;

        if (!studentId) return res.status(401).json({ error: 'Not authenticated' });

        db.get("SELECT value FROM config WHERE key = 'election_status'", (err, config) => {
            if (!config || config.value !== 'running') return res.status(403).json({ error: 'Election is not running' });

            db.get("SELECT name, approved, has_voted FROM students WHERE id = ?", [studentId], (err, student) => {
                if (!student) return res.status(404).json({ error: 'Student not found' });
                if (student.has_voted) return res.status(403).json({ error: 'Already voted' });
                if (!student.approved) return res.status(403).json({ error: 'Not approved' });

                db.run("BEGIN TRANSACTION", (err) => {
                    const recordVotes = (index) => {
                        if (index >= votes.length) {
                            db.run("UPDATE students SET has_voted = 1, approved = 0 WHERE id = ?", [studentId], (err) => {
                                if (err) {
                                    db.run("ROLLBACK");
                                    return res.status(500).json({ error: 'Final update failed' });
                                }

                                db.run("INSERT INTO audit_logs (event, details) VALUES (?, ?)",
                                    ['VOTE_CAST', `Student: ${student.name} (ID: ${studentId})`], (err) => {
                                        db.run("COMMIT", () => {
                                            req.session.destroy();
                                            res.json({ success: true });
                                        });
                                    }
                                );
                            });
                            return;
                        }

                        const candidateId = votes[index];
                        db.get("SELECT name, position FROM candidates WHERE id = ?", [candidateId], (err, row) => {
                            if (err || !row) {
                                db.run("ROLLBACK");
                                return res.status(500).json({ error: 'Candidate validation failed' });
                            }

                            db.run("UPDATE candidates SET votes = votes + 1 WHERE id = ?", [candidateId], (err) => {
                                db.run("INSERT INTO votes (student_id, candidate_name, position) VALUES (?, ?, ?)",
                                    [studentId, row.name, row.position], (err) => {
                                        recordVotes(index + 1);
                                    }
                                );
                            });
                        });
                    };

                    recordVotes(0);
                });
            });
        });
    });

    return router;
};
