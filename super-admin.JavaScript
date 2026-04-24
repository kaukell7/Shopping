// super-admin.JavaScript

// သင်၏ Firebase Configuration အချက်အလက်များ
const firebaseConfig = {
  apiKey: "AIzaSyCt1SMVSMqdX3u2viQ-n_BVwp6KgQwDLOM",
  authDomain: "my-shop-admin-cedb1.firebaseapp.com",
  projectId: "my-shop-admin-cedb1",
  storageBucket: "my-shop-admin-cedb1.firebasestorage.app",
  messagingSenderId: "1073972515996",
  appId: "1:1073972515996:web:28049f5e5977e3a8e74959",
  measurementId: "G-2470TWK85R"
};

// Firebase ကို စတင်ချိတ်ဆက်ခြင်း
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

async function saveAgent() {
    const agentName = document.getElementById('agentName').value;
    const agentId = document.getElementById('agentId').value;
    const agentPass = document.getElementById('agentPass').value;

    // အချက်အလက် ပြည့်စုံမှု ရှိမရှိ စစ်ဆေးခြင်း
    if (!agentName || !agentId || !agentPass) {
        alert("ကျေးဇူးပြု၍ အချက်အလက်အားလုံး ဖြည့်သွင်းပါ");
        return;
    }

    try {
        // Firebase Firestore ထဲရှိ 'agents' collection ထဲသို့ ဒေတာ သိမ်းဆည်းခြင်း
        await db.collection("agents").add({
            name: agentName,
            tenantId: agentId,
            password: agentPass,
            created_at: firebase.firestore.FieldValue.serverTimestamp() // server အချိန်အတိုင်း သိမ်းရန်
        });

        // အောင်မြင်ကြောင်း အသိပေးချက်
        alert(agentName + " အတွက် အကောင့်ဖွင့်ခြင်း အောင်မြင်ပါသည်");
        
        // Input အကွက်များကို ပြန်ရှင်းခြင်း
        document.getElementById('agentName').value = '';
        document.getElementById('agentId').value = '';
        document.getElementById('agentPass').value = '';

    } catch (error) {
        // အကယ်၍ error တက်ခဲ့လျှင် (ဥပမာ- RLS ပိတ်ထားခြင်း မရှိလျှင်)
        console.error("Firebase Error Details:", error);
        alert("ဒေတာသိမ်းဆည်းမှု မအောင်မြင်ပါ။ Firestore Rules ကို 'Test Mode' ဖွင့်ထားသလား ပြန်စစ်ပေးပါ။");
    }
}
