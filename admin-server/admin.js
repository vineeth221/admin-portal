require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = 8006;

mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("Connected to MongoDB");
})
.catch((error) => {
  console.error("Error connecting to MongoDB:", error);
});


const emailSchema = new mongoose.Schema({
  email: String,
  name: String,
  mobile: String,
  subject: String,
});

const Email = mongoose.model('Email', emailSchema);

app.get('/emails', async (req, res) => {
  try {
    const emails = await Email.find();
    res.json(emails);
  } catch (error) {
    console.error('Error loading emails:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Handle DELETE request
// Make sure this route is defined before other routes
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


app.listen(port, () => {
  console.log(`Admin portal started on port ${port}`);
});
