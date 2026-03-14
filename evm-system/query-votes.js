const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');

db.all(`
  SELECT s.name, s.cic_no, s.reg_no,
    GROUP_CONCAT(v.candidate_name || ' (' || v.position || ')', ' | ') as voted_for
  FROM students s
  LEFT JOIN votes v ON s.id = v.student_id
  WHERE s.has_voted = 1
  GROUP BY s.id
  ORDER BY s.name
`, function(err, rows) {
  if (err) { console.error(err.message); db.close(); return; }
  console.log('Total voted: ' + rows.length);
  console.log('');
  rows.forEach(function(r) {
    console.log('> ' + r.name + ' (CIC: ' + r.cic_no + ')');
    console.log('  Voted for: ' + (r.voted_for || 'N/A'));
    console.log('');
  });
  db.close();
});
