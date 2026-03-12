const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 3000;
const dbPath = path.join(__dirname, 'database.db');
const db = new sqlite3.Database(dbPath);

const DEBUG = process.env.DEBUG === 'true';
console.log(`[SYS] Debug Mode: ${DEBUG ? 'ACTIVE' : 'OFF'}`);

// Simple Rate Limiter for Logins
const loginAttempts = {};
const rateLimit = (req, res, next) => {
    if (DEBUG) return next(); // Bypass rate limit in debug mode
    const ip = req.ip;
    const now = Date.now();
    if (loginAttempts[ip] && (now - loginAttempts[ip].lastAttempt < 2000)) { // 2 second delay between attempts
        return res.status(429).json({ error: 'Too many requests. Please wait.' });
    }
    loginAttempts[ip] = { lastAttempt: now };
    next();
};

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'evm-secure-' + Math.random().toString(36).substring(2, 15),
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
        secure: false, // Set to true if using HTTPS
        maxAge: 1000 * 60 * 60 * 2 // 2 hour session
    }
}));

app.use('/api/login', rateLimit);
app.use('/api/admin/login', rateLimit);

// Route Middlewares
const voteRoutes = require('./routes/vote')(db, DEBUG);
const adminRoutes = require('./routes/admin')(db, DEBUG);

app.use('/api', voteRoutes);
app.use('/api/admin', adminRoutes);

// Helper for checking election status
app.get('/api/status', (req, res) => {
    db.get("SELECT value FROM config WHERE key = 'election_status'", (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ status: row ? row.value : 'stopped' });
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`EVM Server running at http://localhost:${PORT}`);
    console.log(`Also accessible via network IP at http://0.0.0.0:${PORT}`);
});
