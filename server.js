const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const mongoURI = process.env.MONGODB_URI;

mongoose.connect(mongoURI)
    .then(() => console.log('✅ MongoDB Connected...'))
    .catch(err => console.log('❌ Connection Error:', err));

// အခြေခံ Route တစ်ခု စမ်းကြည့်ရန်
app.get('/', (req, res) => {
    res.send('Server is running!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server started on port ${PORT}`);
});
