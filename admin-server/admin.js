require("dotenv").config();  // Load environment variables
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Email = require('./models/Email');

const app = express();
const port = 8006;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log("Connected to MongoDB");
  // Start the server only after successful connection
  app.listen(port, () => {
    console.log(`Admin portal started on port ${port}`);
  });
})
.catch((error) => {
  console.error("Error connecting to MongoDB:", error);
});

// Middleware to authenticate tokens
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401); // Unauthorized

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // Forbidden
    console.log("Token verified:", user); // Add this line
    req.user = user;
    next();
  });
};

// Middleware to check if user is a superadmin
const isSuperAdmin = (req, res, next) => {
  console.log("Checking if user is superadmin:", req.user); // Add this line
  if (req.user && req.user.role === 'superadmin') {
    return next();
  }
  res.sendStatus(403); // Forbidden
};


// Authentication Routes
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    // Generate a token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/reset-password', async (req, res) => {
  const { email, newPassword } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).send('Email not found');

    user.password = newPassword; // Hash the password before saving
    await user.save();

    res.status(200).send('Password updated successfully');
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});


app.post('/api/verify-email', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).send('Email not found');

    res.status(200).send('Email verified');
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});


app.get('/api/users', authenticateToken, async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to grant superadmin access
app.post('/api/access/grant-superadmin', authenticateToken, isSuperAdmin, async (req, res) => {
  console.log('Grant superadmin access route hit'); // Add this line for debugging
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).send('User not found');

    user.role = 'superadmin'; // Grant superadmin access
    await user.save();

    res.status(200).send('Superadmin access granted');
  } catch (error) {
    console.error('Error granting superadmin access:', error);
    res.status(500).send('Server error');
  }
});

// Route to remove superadmin access
app.post('/api/access/remove-superadmin', authenticateToken, isSuperAdmin, async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).send('User not found');

    if (user.role !== 'superadmin') return res.status(400).send('User is not a superadmin');

    user.role = 'user'; // Revoke superadmin access
    await user.save();

    res.status(200).send('Superadmin access removed');
  } catch (error) {
    console.error('Error removing superadmin access:', error);
    res.status(500).send('Server error');
  }
});


// Route to create new users by super admins
app.post('/api/access/create-user', authenticateToken, isSuperAdmin, async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'User already exists' });

    const user = new User({ email, password });
    await user.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to change password
app.post('/api/change-password', authenticateToken, async (req, res) => {
  const { newPassword } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Email Routes
app.get('/api/emails', async (req, res) => {
  try {
    const emails = await Email.find();
    res.json(emails);
  } catch (error) {
    console.error('Error loading emails:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/emails/count', async (req, res) => {
  try {
    const emailCount = await Email.countDocuments();
    res.json({ count: emailCount });
  } catch (error) {
    console.error('Error getting email count:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/api/emails/:id', async (req, res) => {
  try {
    const emailId = req.params.id;
    const deletedEmail = await Email.findByIdAndDelete(emailId);

    if (!deletedEmail) {
      return res.status(404).json({ error: 'Email not found' });
    }

    res.json({ message: 'Email deleted successfully' });
  } catch (error) {
    console.error('Error deleting email:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Function to make a user superadmin - to be used for development
const makeUserSuperAdmin = async (email) => {
  try {
    const user = await User.findOne({ email });
    if (!user) throw new Error('User not found');

    user.role = 'superadmin';
    await user.save();
    console.log(`User ${email} is now a superadmin.`);
  } catch (error) {
    console.error('Error:', error.message);
  }
};

app.delete('/api/users/:id', authenticateToken, isSuperAdmin, async (req, res) => {
  try {
    const userId = req.params.id;
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Uncomment this line for testing or development
makeUserSuperAdmin('vineeth@gmail.com');
