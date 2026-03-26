/**
 * Seed script: populates the database with default admin user + sample employees.
 * Run once: node backend/seed.js
 * Requires MONGODB_URI in .env
 */
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('./models/User');
const Employee = require('./models/Employee');

const MONGO_URI = process.env.MONGODB_URI;
if (!MONGO_URI) { console.error('MONGODB_URI not set in .env'); process.exit(1); }

const seedUsers = [
  { fname:'Admin', lname:'User',  email:'admin@company.com', password:'admin123', role:'admin' },
  { fname:'Jane',  lname:'Smith', email:'user@company.com',  password:'user123',  role:'user'  },
];

const seedEmployees = [
  { fname:'Alex',   lname:'Thompson', email:'alex.t@company.com',   dept:'Engineering', position:'Senior Engineer',    role:'admin', status:'active',   salary:95000, joined:'2022-03-15' },
  { fname:'Maya',   lname:'Patel',    email:'maya.p@company.com',   dept:'Design',       position:'UX Designer',        role:'user',  status:'active',   salary:78000, joined:'2022-07-20' },
  { fname:'Jordan', lname:'Williams', email:'jordan.w@company.com', dept:'Marketing',    position:'Marketing Lead',     role:'user',  status:'active',   salary:72000, joined:'2021-11-05' },
  { fname:'Sam',    lname:'Chen',     email:'sam.c@company.com',    dept:'Finance',      position:'Financial Analyst',  role:'user',  status:'active',   salary:85000, joined:'2023-01-12' },
  { fname:'Riley',  lname:'Johnson',  email:'riley.j@company.com',  dept:'HR',           position:'HR Manager',         role:'admin', status:'active',   salary:82000, joined:'2022-06-01' },
  { fname:'Morgan', lname:'Lee',      email:'morgan.l@company.com', dept:'Operations',   position:'Ops Specialist',     role:'user',  status:'inactive', salary:68000, joined:'2021-08-20' },
  { fname:'Casey',  lname:'Brown',    email:'casey.b@company.com',  dept:'Engineering',  position:'Frontend Dev',       role:'user',  status:'active',   salary:88000, joined:'2023-04-10' },
  { fname:'Taylor', lname:'Davis',    email:'taylor.d@company.com', dept:'Design',       position:'Graphic Designer',   role:'user',  status:'active',   salary:70000, joined:'2023-09-01' },
];

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  await User.deleteMany({});
  await Employee.deleteMany({});

  for (const u of seedUsers) await User.create(u);
  await Employee.insertMany(seedEmployees);

  console.log('Seeded', seedUsers.length, 'users and', seedEmployees.length, 'employees.');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
