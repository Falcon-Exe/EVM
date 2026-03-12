# College Election EVM System

A secure, offline-capable Electronic Voting Machine (EVM) web module for college union elections.

## Features
- Voter authentication by Student ID.
- Prevention of duplicate voting.
- Admin dashboard with live results.
- Export results as CSV.
- Start/Stop election control.

## Multi-Device Network Setup (2 Laptops)

This system is designed to run on a local Wi-Fi network with **two laptops**:
1.  **Laptop 1 (Admin/Verification Desk)**: Runs the server.
2.  **Laptop 2 (Voting Booth)**: Connects to Laptop 1 to allow students to vote.

### Setup Instructions:

1.  **Connect both laptops** to the same Wi-Fi network.
2.  **On Laptop 1 (Admin)**:
    - Get your local IP address (run `ipconfig`).
    - Run the server: `node init-db.js` then `node server.js`.
3.  **On Laptop 1 (Admin Desk)**:
    - Open `http://localhost:3000/admin.html`.
    - Use the **Verification Desk** section to search and click **"Approve"**.
4.  **On Laptop 2 (Voting Booth)**:
    - Open Chrome and go to `http://ADMIN_IP:3000` (Replace `ADMIN_IP` with Laptop 1's IP).
    - Students can login **only after approval**.

## Default Test Data
- **Voter Numbers (CIC/Reg)**: `22934`/`357`, `22935`/`358`, `22936`/`359`
- **Positions**: Chairman, General Secretary, Treasurer, CUC, Fine Arts.
- **Admin Password**: `admin123`

## Reliability & Recovery

The system is built to handle crashes gracefully with **Zero Data Loss**:

### 1. Persistent Storage (SQLite)
All votes, voter approvals, and election statuses are saved instantly to the `database.db` file. If the power goes out or the server crashes, everything stays exactly as it was the moment before the crash.

### 2. Transaction Safety (Atomicity)
The system uses "Atomic Transactions". If a crash happens exactly while a student is clicking "Submit", the system will either:
- **Save everything**: The vote counts go up AND the student is marked as "Voted".
- **Save nothing**: The database remains unchanged. The student can simply log in again and retry their vote once the server is back up.

### 3. How to Recover from a Crash
1.  Simply run `node server.js` again in the terminal.
2.  Refresh the Admin Panel.
3.  The election status (Started/Stopped) and results will be restored automatically.

### 4. Optional: Automatic Restart (Recommended)
For the most stable experience, you can use **PM2** to automatically restart the server if it ever crashes:
```bash
npm install -g pm2
pm2 start server.js --name evm
```
This will ensure the server stays "Alive" even if an error occurs.
