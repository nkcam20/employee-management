const jwt = require('jsonwebtoken');
const User = require('../models/User');

const signToken = (user) =>
  jwt.sign(
    { id: user._id, email: user.email, role: user.role, fname: user.fname, lname: user.lname },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Please fill in all fields.' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(401).json({ message: 'Invalid email or password.' });

    const match = await user.comparePassword(password);
    if (!match) return res.status(401).json({ message: 'Invalid email or password.' });

    const token = signToken(user);
    res.json({
      token,
      user: { id: user._id, fname: user.fname, lname: user.lname, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.signup = async (req, res) => {
  try {
    const { fname, lname, email, password } = req.body;
    if (!fname || !lname || !email || !password) return res.status(400).json({ message: 'Please fill in all fields.' });
    if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters.' });

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(400).json({ message: 'Email already registered.' });

    const user = await User.create({ fname, lname, email, password });
    res.status(201).json({ message: 'Account created successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};
