const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = 8006;

// Connect to MongoDB
mongoose.connect('mongodb://43.204.231.33:27017/emails', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const emailSchema = new mongoose.Schema({
  email: String,
  name: String,
  mobile: String,
  subject: String,
});

const Email = mongoose.model('Email', emailSchema);

// API endpoint to fetch emails
app.get('/api/emails', async (req, res) => {
  try {
    // Fetch emails from MongoDB
    const emails = await Email.find();

    // Respond with a JSON array of emails
    res.json(emails);
  } catch (error) {
    console.error('Error loading emails:', error);

    // Handle internal server error
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Admin portal started on port ${port}`);
});
