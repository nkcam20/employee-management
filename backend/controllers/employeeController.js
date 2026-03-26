let employees = [
  {id:1,fname:'Alex',lname:'Thompson',email:'alex.t@company.com',dept:'Engineering',position:'Senior Engineer',role:'admin',status:'active',salary:95000,joined:'2022-03-15'},
  {id:2,fname:'Maya',lname:'Patel',email:'maya.p@company.com',dept:'Design',position:'UX Designer',role:'user',status:'active',salary:78000,joined:'2022-07-20'},
  {id:3,fname:'Jordan',lname:'Williams',email:'jordan.w@company.com',dept:'Marketing',position:'Marketing Lead',role:'user',status:'active',salary:72000,joined:'2021-11-05'},
  {id:4,fname:'Sam',lname:'Chen',email:'sam.c@company.com',dept:'Finance',position:'Financial Analyst',role:'user',status:'active',salary:85000,joined:'2023-01-12'},
  {id:5,fname:'Riley',lname:'Johnson',email:'riley.j@company.com',dept:'HR',position:'HR Manager',role:'admin',status:'active',salary:82000,joined:'2022-06-01'},
  {id:6,fname:'Morgan',lname:'Lee',email:'morgan.l@company.com',dept:'Operations',position:'Ops Specialist',role:'user',status:'inactive',salary:68000,joined:'2021-08-20'},
  {id:7,fname:'Casey',lname:'Brown',email:'casey.b@company.com',dept:'Engineering',position:'Frontend Dev',role:'user',status:'active',salary:88000,joined:'2023-04-10'},
  {id:8,fname:'Taylor',lname:'Davis',email:'taylor.d@company.com',dept:'Design',position:'Graphic Designer',role:'user',status:'active',salary:70000,joined:'2023-09-01'},
];
let nextEmpId = 9;

exports.getEmployees = (req, res) => {
  res.json({ employees });
};

exports.addEmployee = (req, res) => {
  const { fname, lname, email, dept, position, role, status, salary } = req.body;
  if(!fname||!lname||!email||!dept||!position) return res.status(400).json({message: 'Missing fields'});
  
  const newEmp = { 
    id: nextEmpId++, 
    fname, lname, email, dept, position, role, status, salary, 
    joined: new Date().toISOString().split('T')[0] 
  };
  employees.push(newEmp);
  res.status(201).json({ message: 'Employee added', employee: newEmp });
};

exports.updateEmployee = (req, res) => {
  const id = parseInt(req.params.id);
  const idx = employees.findIndex(e => e.id === id);
  if(idx === -1) return res.status(404).json({ message: 'Employee not found' });
  
  const { fname, lname, email, dept, position, role, status, salary } = req.body;
  employees[idx] = { ...employees[idx], fname, lname, email, dept, position, role, status, salary };
  res.json({ message: 'Employee updated', employee: employees[idx] });
};

exports.deleteEmployee = (req, res) => {
  const id = parseInt(req.params.id);
  employees = employees.filter(e => e.id !== id);
  res.json({ message: 'Employee deleted' });
};
