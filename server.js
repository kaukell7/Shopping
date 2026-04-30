const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// --- Middleware ---
app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));

// --- MongoDB Connection ---
const mongoURI = process.env.MONGODB_URI;

if (!mongoURI) {
    console.error("❌ MONGODB_URI is missing in environment variables!");
}

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Connected Successfully'))
.catch(err => console.log('❌ MongoDB Connection Error:', err));

// --- Database Schemas ---

// ၁။ Shop Settings Schema
const settingsSchema = new mongoose.Schema({
    agentName: { type: String, required: true, unique: true },
    shopName: String,
    viber: String,
    telegram: String,
    logoUrl: String,
    updatedAt: { type: Date, default: Date.now }
});

// ၂။ Agent (Account) Schema - Super Admin အတွက်
const agentSchema = new mongoose.Schema({
    shopName: { type: String, required: true },
    contact: { type: String, required: true, unique: true }, // Gmail သို့မဟုတ် Phone
    password: { type: String, required: true },
    status: { type: String, default: 'Active' },
    createdAt: { type: Date, default: Date.now }
});

// Models သတ်မှတ်ခြင်း
const Settings = mongoose.models.Settings || mongoose.model('Settings', settingsSchema);
const Agent = mongoose.models.Agent || mongoose.model('Agent', agentSchema);

// --- API Routes ---

app.get('/', (req, res) => {
    res.send('Spider.io Backend is running perfectly!');
});

// --- Settings APIs ---

app.post('/api/settings/save', async (req, res) => {
    try {
        const { agentName, shopName, viber, telegram, logoUrl } = req.body;
        if (!agentName) return res.status(400).json({ error: "Agent Name is required" });

        const updatedSettings = await Settings.findOneAndUpdate(
            { agentName },
            { shopName, viber, telegram, logoUrl, updatedAt: Date.now() },
            { upsert: true, new: true }
        );
        res.status(200).json({ success: true, data: updatedSettings });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/settings/:agentName', async (req, res) => {
    try {
        const settings = await Settings.findOne({ agentName: req.params.agentName });
        if (!settings) return res.status(404).json({ message: "No settings found" });
        res.status(200).json(settings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- Super Admin (Agent Management) APIs ---

// Agent အသစ်ဖွင့်ရန်
app.post('/api/agents/register', async (req, res) => {
    try {
        const { shopName, contact, password } = req.body;
        const newAgent = new Agent({ shopName, contact, password });
        await newAgent.save();
        res.status(201).json({ success: true, message: "Agent created successfully!" });
    } catch (error) {
        console.error("Register Error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Agent စာရင်းအားလုံးကို ပြန်ယူရန်
app.get('/api/agents/list', async (req, res) => {
    try {
        const agents = await Agent.find().sort({ createdAt: -1 });
        res.status(200).json(agents);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Agent အကောင့်ဖျက်ရန်
app.delete('/api/agents/:id', async (req, res) => {
    try {
        await Agent.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "Agent deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Vercel Deployment Support
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}

module.exports = app;
