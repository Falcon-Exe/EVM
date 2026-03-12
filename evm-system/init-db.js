const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join(__dirname, 'database.db');

const db = new sqlite3.Database(dbPath);

const voters = [
  ['22934', '357', 'MUHAMMED RAJIL SHAN KP'],
  ['22935', '358', 'MUHAMMED SAHNOON PA'],
  ['22936', '359', 'MUHAMMED HUSAIN. P'],
  ['22937', '360', 'ISMAIL S'],
  ['22938', '361', 'MUHAMMED SHAMIL K'],
  ['22939', '362', 'MUHAMMED SABITH A'],
  ['22940', '363', 'ARSAL MARJAN K K'],
  ['22941', '364', 'MUHAMMED AFTHAH'],
  ['22942', '365', 'AMEEN A'],
  ['22943', '366', 'MEHTHAB AHMAD P'],
  ['22944', '367', 'AMAN. M. NEFEEK'],
  ['22945', '368', 'FARZIN FILSUF NAVAS'],
  ['22946', '369', 'MUHAMMED FAJI .MT'],
  ['22947', '370', 'MUHAMMAD HISHAM KK'],
  ['22948', '371', 'FAYAZ MUJEEB'],
  ['22949', '372', 'MOHAMMED SINAN M'],
  ['22950', '373', 'MOHAMMED ISHBIL VK'],
  ['22951', '374', 'MUHAMMAD SIMAK'],
  ['22952', '375', 'MOHAMMED SAJAD PP'],
  ['22953', '376', 'RISHAD P'],
  ['22954', '377', 'MUHAMMED SABITH . N'],
  ['22955', '378', 'MOHAMMED RABIE MK'],
  ['22956', '379', 'SALMAN S'],
  ['22957', '380', 'MUHAMMED NISHAN OPV'],
  ['22958', '381', 'MOHAMMED MURSHID KARADAN'],
  ['22959', '382', 'MUHAMMED IRFAD KK'],
  ['22960', '383', 'MUHAMMED SAVAD KK'],
  ['22961', '384', 'MUHAMMAD SINAN'],
  ['22962', '385', 'MUHYUDHEEN NISHAN K'],
  ['22963', '386', 'MOHAMMED HADHI MM'],
  ['22964', '387', 'SHIBILISHAN TV'],
  ['22965', '388', 'MUHAMMED ZAYAN A'],
  ['22966', '389', 'ABDUL VAHAB KK'],
  ['22967', '390', 'HAMRAS FARIS'],
  ['22968', '391', 'MUHAMMED MUSTHAFA N'],
  ['22969', '392', 'MUHAMMED RAZIN K'],
  ['22970', '393', 'MUHAMMED SHAFEEQ'],
  ['23622', '394', 'FAREED KORADAN'],
  ['22828', '395', 'MUHAMMED RAZAN'],
  ['21724', '293', 'MOHAMMED AFLAH E'],
  ['21759', '292', 'MOHAMMED HISHAM K'],
  ['21760', '294', 'AFLAH PP'],
  ['21761', '295', 'MUHAMMED WAFI K'],
  ['21762', '296', 'ADIL MUHAMMED TP'],
  ['21763', '297', 'AMEEN TA'],
  ['21764', '298', 'MUHAMMED THOUFEEK'],
  ['21765', '299', 'MUHAMMED SUFYAN TK'],
  ['21766', '300', 'MUHAMMAD FAHAD.S'],
  ['21767', '301', 'MOHAMMED SAHAL.K'],
  ['21768', '302', 'MUHAMMED FAHABIN MK'],
  ['21769', '303', 'MUAHMMED RANISH CV'],
  ['21770', '304', 'ANZIF MAHDOOM'],
  ['21771', '305', 'SHAJAHAN KK'],
  ['21772', '306', 'MUHAMMED SHIBLI C'],
  ['21773', '307', 'ANSIF PP'],
  ['21774', '308', 'MUHAMMED RAZEEN'],
  ['21775', '309', 'ANSHAD P'],
  ['21776', '332', 'MOHAMMED RASHAD'],
  ['21777', '310', 'MOHAMMED SAFVAN K'],
  ['21778', '311', 'AHMAD SHAHEER K'],
  ['21779', '312', 'SANEEN N'],
  ['21780', '313', 'MUAHMMED ARSHAD'],
  ['21781', '314', 'MUHAMMED ADEEB'],
  ['21782', '315', 'MUHAMMED SHAMIL .M'],
  ['21783', '316', 'MOHAMMED YASSER VA'],
  ['21784', '317', 'MUHAMMED SHAMIL.KP'],
  ['21785', '318', 'MUHAMMED MINSHAD'],
  ['21786', '319', 'MOHAMMED HAMDAN KP'],
  ['21787', '321', 'ANSHIF ASHRAF'],
  ['21788', '325', 'MUHAMMED SHADIL OK'],
  ['21789', '326', 'ABDUL HAKEEM'],
  ['21790', '328', 'MUHAMMED SINAN'],
  ['21791', '329', 'MUHAMMED ADHIL PK'],
  ['21792', '330', 'SAYYID JAZEEL MUHAMMED'],
  ['21793', '331', 'AHAMMED ZIDHAN PM'],
  ['22466', '322', 'MUHAMMED SAFWAN N'],
  ['22467', '323', 'MOHAMMED NIFAL KV'],
  ['22468', '324', 'JOUHAR MIDLAJ K'],
  ['22469', '327', 'MUHAMMED SALAH'],
  ['22617', '', 'MUHAMMED MUFEED M'],
  ['19475', '350', 'HAFEEF P'],
  ['20962', '235', 'MUHAMMED ZAHIR P'],
  ['20964', '237', 'MUHAMMED YAZEEN S'],
  ['20965', '238', 'MUHAMMED IHZAN'],
  ['21015', '244', 'AJSAL'],
  ['21016', '245', 'ASHMIL OMAR MUHAMMED'],
  ['21017', '246', 'MUHAMMED FASEEH C'],
  ['21018', '247', 'HASHIM MV'],
  ['21022', '251', 'MOHAMMED SANI'],
  ['21023', '252', 'AHAMMED HADHI.K'],
  ['21024', '253', 'MUHAMMED MUJTHABA'],
  ['21031', '260', 'MUHAMMED MAHROOF P'],
  ['21034', '263', 'MUHAMMED SIDAN P'],
  ['21035', '264', 'MOHAMMED AFNAN P'],
  ['21036', '265', 'MOHAMMAD RIZWAN P K'],
  ['21039', '268', 'MOHAMMED SHAMIL'],
  ['21044', '335', 'MUHAMMAD ALI SHIНАВ К Р'],
  ['21049', '336', 'NISAMUDHEEN'],
  ['21053', '337', 'MOHAMMED SHAMIL C'],
  ['21067', '351', 'MUHAMMED HASHIR TN'],
  ['21112', '339', 'MUHAMMED SALI H AT'],
  ['21177', '353', 'MUSFIR'],
  ['21202', '352', 'MUHAMMED SINAN'],
  ['21219', '340', 'MOHAMMED SINAJ'],
  ['21229', '341', 'MUHAMMED NAZIH'],
  ['21231', '396', 'MUHAMMED FAIZ KK'],
  ['21234', '342', 'AFRAD E'],
  ['21278', '343', 'MUHMMED NAJAD P'],
  ['21364', '349', 'MUHAMMED SALMAN'],
  ['21573', '344', 'MUHAMMED RAFI'],
  ['21580', '348', 'MUHAMMED ADNAN TK'],
  ['21582', '345', 'MUHAMMED MARZOOQUE NP'],
  ['21626', '273', 'UMER FALAH'],
  ['22618', '346', 'MUHAMMED FAROOQ'],
  ['23711', '355', 'MUHAMMED HASHIM P'],
  ['20194', '275', 'ABDUL SAMAD S'],
  ['20195', '276', 'AHMAD MIQDAD K P'],
  ['20196', '277', 'MUHAMMAD ARIF'],
  ['20198', '278', 'HARSHAD P'],
  ['20204', '279', 'MUHAMMED SHAHID'],
  ['20206', '280', 'MUHAMMED NIHAL'],
  ['20210', '281', 'SALMANUL FARIS UK'],
  ['20213', '282', 'MUHAMMED MIRAZ P M'],
  ['20214', '283', 'AHAMMED ASHFAK K A'],
  ['20497', '187', 'MUHAMMAD HABEEB S'],
  ['20498', '203', 'MUHAMMED FARIS CA'],
  ['20511', '185', 'MOHAMMED JIRSHAD PK'],
  ['20525', '210', 'MAHMOOD FAYIS E'],
  ['20527', '202', 'MUJEEB RAHMAN K'],
  ['20529', '208', 'DILSHAD MUHAMMED'],
  ['20532', '209', 'MUHAMMED SABIR.C'],
  ['20533', '200', 'MUHAMMED HISHAM'],
  ['20891', '284', 'MUHAMMAD RAFIH'],
  ['20899', '285', 'MARUWAN S'],
  ['20901', '286', 'ALTHAF'],
  ['20905', '287', 'ABDUL RASAK. V'],
  ['20909', '288', 'MUHAMMED MINHAJ MT'],
  ['20911', '289', 'MUHAMMAD AFINAS'],
  ['20915', '290', 'MUHAMMED SINAN'],
  ['20916', '291', 'MUHAMMED SANAD'],
  ['17194', '143', 'SINAN MK'],
  ['17195', '144', 'MUHAMMED MUNEER MV'],
  ['17205', '154', 'MUNZIR - T'],
  ['17208', '157', 'KHALEEL JIBRAN.K.T'],
  ['17209', '158', 'SHIYAS'],
  ['17212', '161', 'ABDULLA ADIL. V P'],
  ['17214', '163', 'NABEEL AHMAD.'],
  ['17243', '164', 'AHMAD ADIL'],
  ['17245', '165', 'ABDUL BASITH'],
  ['18506', '224', 'BASIL KM'],
  ['18528', '225', 'MUHAMMED RAZIN MK'],
  ['18656', '226', 'AHMED SINAN CK'],
  ['18657', '227', 'MUHAMMED ANZAR'],
  ['18664', '228', 'SYE MOHAMED ABIY VP'],
  ['18668', '229', 'MUHAMMED SHIYAF K'],
  ['18673', '230', 'SAED KA'],
  ['18666', '232', 'PA MUHAMMED RAMIL'],
  ['18670', '233', 'ANEESURAHMAN'],
  ['21704', '234', 'MUHAMMED BUJAIR']
];

db.serialize(() => {
  // Clear existing data
  db.run("DROP TABLE IF EXISTS votes");
  db.run("DROP TABLE IF EXISTS candidates");
  db.run("DROP TABLE IF EXISTS students");
  db.run("DROP TABLE IF EXISTS config");

  // Students Table with Approval System
  db.run(`CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cic_no TEXT UNIQUE,
    reg_no TEXT,
    name TEXT NOT NULL,
    approved BOOLEAN DEFAULT 0,
    has_voted BOOLEAN DEFAULT 0
  )`);

  // Candidates Table
  db.run(`CREATE TABLE IF NOT EXISTS candidates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    position TEXT NOT NULL,
    symbol TEXT,
    votes INTEGER DEFAULT 0
  )`);

  // Votes Table
  db.run(`CREATE TABLE IF NOT EXISTS votes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER,
    candidate_name TEXT,
    position TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(student_id) REFERENCES students(id)
  )`);

  // Config Table
  db.run(`CREATE TABLE IF NOT EXISTS config (
    key TEXT PRIMARY KEY,
    value TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event TEXT NOT NULL,
    details TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Voter Dataset
  const voterStmt = db.prepare("INSERT INTO students (cic_no, reg_no, name) VALUES (?, ?, ?)");
  voters.forEach(v => voterStmt.run(v));
  voterStmt.finalize();

  // Candidates with Symbols
  const initialCandidates = [
    ['Habeeb', 'Chairman', '🍎'], ['Hisham', 'Chairman', '⚽'],
    ['Minhaj', 'General Secretary', '🚀'], ['Rasak', 'General Secretary', '📖'],
    ['Faris', 'Treasurer', '🎨'], ['Shahid', 'Treasurer', '📦'],
    ['Sani', 'CUC', '🕶️'], ['Ajsal', 'CUC', '🚴'],
    ['Nizamudheen', 'Fine Arts', '🎭'], ['Hashim MV', 'Fine Arts', '🎹']
  ];
  const candidateStmt = db.prepare("INSERT INTO candidates (name, position, symbol) VALUES (?, ?, ?)");
  initialCandidates.forEach(c => candidateStmt.run(c));
  candidateStmt.finalize();

  db.run("INSERT INTO config (key, value) VALUES ('election_status', 'stopped')");
  db.run("INSERT INTO config (key, value) VALUES ('admin_password', 'admin123')");

  console.log(`Database initialized with ${voters.length} voters.`);
});

db.close();
