let users = [
  {id:1,fname:'Admin',lname:'User',email:'admin@company.com',password:'admin123',role:'admin',created:new Date('2024-01-01')},
  {id:2,fname:'Jane',lname:'Smith',email:'user@company.com',password:'user123',role:'user',created:new Date('2024-02-01')},
];
let nextUserId = 3;

exports.login = (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ message: 'Invalid email or password.' });
  res.json({ user });
};

exports.signup = (req, res) => {
  const { fname, lname, email, password } = req.body;
  if (!fname || !lname || !email || !password) return res.status(400).json({ message: 'Please fill in all fields.' });
  if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters.' });
  if (users.find(u => u.email === email)) return res.status(400).json({ message: 'Email already registered.' });
  
  const newUser = { id: nextUserId++, fname, lname, email, password, role: 'user', created: new Date() };
  users.push(newUser);
  res.status(201).json({ message: 'User created', user: newUser });
};
