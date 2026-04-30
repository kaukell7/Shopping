const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// --- Middleware ---
// CORS ကို အစုံဖွင့်ပေးပြီး configuration ပိုသေချာအောင် လုပ်ထားပါတယ်
app.use(cors({
    origin: '*', // Production ရောက်ရင် သင့် GitHub Pages link ကို ပြောင်းပေးနိုင်ပါတယ်
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Payload size ကို Vercel maximum ဖြစ်တဲ့ 4.5MB ပတ်ဝန်းကျင်ပဲ ထားတာ ပိုစိတ်ချရပါတယ်
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));

// --- MongoDB Connection ---
const mongoURI = process.env.MONGODB_URI;

// Connection ထပ်ခါထပ်ခါ မဆောက်အောင် စစ်ဆေးတဲ့ logic
if (!mongoURI) {
    console.error("❌ MONGODB_URI is missing in environment variables!");
}

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Connected Successfully'))
.catch(err => console.log('❌ MongoDB Connection Error:', err));

// --- Database Schema & Model ---
const settingsSchema = new mongoose.Schema({
    agentName: { type: String, required: true, unique: true },
    shopName: String,
    viber: String,
    telegram: String,
    logoUrl: String,
    updatedAt: { type: Date, default: Date.now }
});

// Model ရှိပြီးသားဆိုရင် ပြန်သုံး၊ မရှိရင် အသစ်ဆောက်
const Settings = mongoose.models.Settings || mongoose.model('Settings', settingsSchema);

// --- API Routes ---

// ၁။ အခြေခံ Route
app.get('/', (req, res) => {
    res.send('Spider.io Backend is running perfectly!');
});

// ၂။ Settings သိမ်းဆည်းရန် (POST)
app.post('/api/settings/save', async (req, res) => {
    try {
        const { agentName, shopName, viber, telegram, logoUrl } = req.body;
        
        if (!agentName) {
            return res.status(400).json({ error: "Agent Name is required" });
        }

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
        
        res.status(200).json({ 
            success: true, 
            message: "Settings saved successfully!", 
            data: updatedSettings 
        });
    } catch (error) {
        console.error("Save Error:", error);
        res.status(500).json({ 
            success: false, 
            error: "Internal Server Error", 
            details: error.message 
        });
    }
});

// ၃။ Settings ပြန်ခေါ်ထုတ်ရန် (GET)
app.get('/api/settings/:agentName', async (req, res) => {
    try {
        const settings = await Settings.findOne({ agentName: req.params.agentName });
        if (!settings) {
            return res.status(404).json({ message: "No settings found for this agent" });
        }
        res.status(200).json(settings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Vercel အတွက် Export လုပ်ပေးခြင်း (ဒါမှမဟုတ် server အဖြစ် run ခြင်း)
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}

module.exports = app;
