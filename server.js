const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
// JSON data တွေကို လက်ခံနိုင်ဖို့နဲ့ တခြား domain တွေကနေ ခေါ်သုံးနိုင်ဖို့ standard limit ကို တိုးထားပေးပါတယ်
app.use(cors());
app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// MongoDB Connection
const mongoURI = process.env.MONGODB_URI;

mongoose.connect(mongoURI)
    .then(() => console.log('✅ MongoDB Connected...'))
    .catch(err => console.log('❌ Connection Error:', err));

// --- Database Schema & Model ---
// MongoDB မှာ data သိမ်းမယ့် ပုံစံကို သတ်မှတ်ခြင်း
const settingsSchema = new mongoose.Schema({
    agentName: { type: String, required: true, unique: true },
    shopName: String,
    viber: String,
    telegram: String,
    logoUrl: String,
    updatedAt: { type: Date, default: Date.now }
});

const Settings = mongoose.model('Settings', settingsSchema);

// --- API Routes ---

// ၁။ အခြေခံ Route (Server အလုပ်လုပ်မလုပ် စစ်ရန်)
app.get('/', (req, res) => {
    res.send('Server is running and ready for Spider.io!');
});

// ၂။ Settings သိမ်းဆည်းရန် Route (POST)
app.post('/api/settings/save', async (req, res) => {
    try {
        const { agentName, shopName, viber, telegram, logoUrl } = req.body;
        
        // အရင်ရှိပြီးသားဆိုရင် Update လုပ်မယ်၊ မရှိသေးရင် အသစ်ဆောက်မယ် (upsert: true)
        const updatedSettings = await Settings.findOneAndUpdate(
            { agentName: agentName },
            { 
                shopName, 
                viber, 
                telegram, 
                logoUrl, 
                updatedAt: Date.now() 
            },
            { upsert: true, new: true }
        );
        
        res.status(200).json({ message: "Settings saved successfully!", data: updatedSettings });
    } catch (error) {
        console.error("Save Error:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});

// ၃။ Settings ပြန်ခေါ်ထုတ်ရန် Route (GET)
app.get('/api/settings/:agentName', async (req, res) => {
    try {
        const settings = await Settings.findOne({ agentName: req.params.agentName });
        if (!settings) {
            return res.status(404).json({ message: "No settings found for this agent" });
        }
        res.json(settings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Server အထိုင်ချခြင်း
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server started on port ${PORT}`);
});
