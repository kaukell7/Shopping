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

// စာမျက်နှာပွင့်လာတာနဲ့ ဒေတာတွေကို စတင်ဖတ်ယူရန်
window.onload = function() {
    loadAgents();
};

// Agent အသစ်သိမ်းဆည်းသည့် Function
async function saveAgent() {
    const agentName = document.getElementById('agentName').value;
    const agentId = document.getElementById('agentId').value;
    const agentPass = document.getElementById('agentPass').value;

    if (!agentName || !agentId || !agentPass) {
        alert("ကျေးဇူးပြု၍ အချက်အလက်အားလုံး ဖြည့်သွင်းပါ");
        return;
    }

    try {
        await db.collection("agents").add({
            name: agentName,
            tenantId: agentId,
            password: agentPass,
            created_at: firebase.firestore.FieldValue.serverTimestamp()
        });

        alert(agentName + " အတွက် အကောင့်ဖွင့်ခြင်း အောင်မြင်ပါသည်");
        
        // Input အကွက်များကို ပြန်ရှင်းခြင်း
        document.getElementById('agentName').value = '';
        document.getElementById('agentId').value = '';
        document.getElementById('agentPass').value = '';

        // စာရင်းကိုချက်ချင်း Update ဖြစ်စေရန် ပြန်ခေါ်ခြင်း
        loadAgents();

    } catch (error) {
        console.error("Firebase Error:", error);
        alert("ဒေတာသိမ်းဆည်းမှု မအောင်မြင်ပါ။ Firestore Rules ကို 'Test Mode' ဖွင့်ထားသလား ပြန်စစ်ပေးပါ။");
    }
}

// ဒေတာများကို Firestore မှ ပြန်ဖတ်ပြီး HTML တွင် ပြသသည့် Function
function loadAgents() {
    const displayArea = document.getElementById('displayAgents');
    
    db.collection("agents").orderBy("created_at", "desc").onSnapshot((querySnapshot) => {
        displayArea.innerHTML = ""; // စာရင်းဟောင်းကို အရင်ရှင်းထုတ်ခြင်း
        querySnapshot.forEach((doc) => {
            const agent = doc.data();
            const agentElement = document.createElement("div");
            agentElement.style.border = "1px solid #ccc";
            agentElement.style.margin = "10px 0";
            agentElement.style.padding = "10px";
            agentElement.style.borderRadius = "5px";
            
            agentElement.innerHTML = `
                <p><strong>Shop Name:</strong> ${agent.name}</p>
                <p><strong>Agent ID:</strong> ${agent.tenantId}</p>
                <p><strong>Password:</strong> ${agent.password}</p>
            `;
            displayArea.appendChild(agentElement);
        });
    });
}
