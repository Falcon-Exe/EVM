const fs = require('fs');
const path = require('path');

const BACKUP_DIR = path.join(__dirname, 'backups');
const DB_FILE = path.join(__dirname, 'database.db');
const RESULTS_FILE = path.join(__dirname, 'results.csv');
const AUDIT_FILE = path.join(__dirname, 'audit_logs.csv');
const MAX_BACKUPS = 20;
const INTERVAL = 5 * 60 * 1000; // 5 minutes

function ensureDirectoryExists(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

function getTimestamp() {
    const now = new Date();
    return now.toISOString().replace(/[:.]/g, '-').slice(0, 19);
}

function rotateBackups() {
    const files = fs.readdirSync(BACKUP_DIR)
        .filter(f => f.startsWith('backup-'))
        .map(f => ({ name: f, time: fs.statSync(path.join(BACKUP_DIR, f)).mtime.getTime() }))
        .sort((a, b) => b.time - a.time);

    if (files.length > MAX_BACKUPS) {
        const toDelete = files.slice(MAX_BACKUPS);
        toDelete.forEach(f => {
            const dirPath = path.join(BACKUP_DIR, f.name);
            fs.rmSync(dirPath, { recursive: true, force: true });
            console.log(`[BACKUP] Deleted old backup: ${f.name}`);
        });
    }
}

function createBackup() {
    console.log('[BACKUP] Starting periodic backup...');
    const timestamp = getTimestamp();
    const currentBackupDir = path.join(BACKUP_DIR, `backup-${timestamp}`);
    
    ensureDirectoryExists(currentBackupDir);

    try {
        // Backup Database
        if (fs.existsSync(DB_FILE)) {
            fs.copyFileSync(DB_FILE, path.join(currentBackupDir, 'database.db'));
        }

        // Backup Results if they exist
        if (fs.existsSync(RESULTS_FILE)) {
            fs.copyFileSync(RESULTS_FILE, path.join(currentBackupDir, 'results.csv'));
        }
        
        if (fs.existsSync(AUDIT_FILE)) {
            fs.copyFileSync(AUDIT_FILE, path.join(currentBackupDir, 'audit_logs.csv'));
        }

        console.log(`[BACKUP] Successfully saved to: backups/backup-${timestamp}`);
        rotateBackups();
    } catch (err) {
        console.error('[BACKUP] Error during backup:', err.message);
    }
}

function start() {
    ensureDirectoryExists(BACKUP_DIR);
    console.log(`[BACKUP] Backup System Active. Interval: ${INTERVAL/1000/60} mins`);
    
    // Create immediate backup on start
    createBackup();
    
    // Set interval for future backups
    setInterval(createBackup, INTERVAL);
}

module.exports = { start };
