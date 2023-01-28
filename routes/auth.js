const express = require('express');
const router = express.Router();
const User = require('../models/user');


router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const user = new User({ name, email, password });
    await user.save();
    res.status(201).json({ message: 'User created' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });
  }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        res.status(401).json({ message: 'Invalid credentials' });
        return;
      }
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        res.status(401).json({ message: 'Invalid credentials' });
        return;
      }
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res.status(200).json({ message: 'Logged in', token });
    } catch (error) {
      res.status(500).json({ message: 'Error logging in', error });
    }
  });

  router.get('/profile', async (req, res) => {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      res.status(200).json({ name: user.name, email: user.email });
    } catch (error) {
      res.status(500).json({ message: 'Error getting profile', error });
    }
  });

  router.get('/logout', (req, res) => {
    req.logout(); 
    res.redirect('/'); 
});

module.exports = router;