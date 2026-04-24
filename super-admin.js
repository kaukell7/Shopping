// super-admin.JavaScript

// Firebase Configuration အချက်အလက်များ
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

// စာမျက်နှာပွင့်လာသည်နှင့် ရှိပြီးသား Agent စာရင်းကို ဖတ်ယူရန်
window.onload = function() {
    loadAgents();
};

// Agent အသစ်သိမ်းဆည်းသည့် Function
async function saveAgent() {
    const agentName = document.getElementById('agentName').value;
    const agentId = document.getElementById('agentId').value;
    const agentPass = document.getElementById('agentPass').value;

    // အချက်အလက် စစ်ဆေးခြင်း
    if (!agentName || !agentId || !agentPass) {
        alert("ကျေးဇူးပြု၍ အချက်အလက်အားလုံး ဖြည့်သွင်းပါ");
        return;
    }

    try {
        // Firebase 'agents' collection ထဲသို့ ဒေတာထည့်ခြင်း
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

    } catch (error) {
        console.error("Firebase Error:", error);
        alert("ဒေတာသိမ်းဆည်းမှု မအောင်မြင်ပါ။ Firestore Rules ကို ပြန်စစ်ပေးပါ။");
    }
}

// ဒေတာများကို Firestore မှ Real-time ဖတ်ပြီး ပြသသည့် Function
function loadAgents() {
    const displayArea = document.getElementById('displayAgents');
    
    // onSnapshot သုံးထားသဖြင့် Refresh လုပ်စရာမလိုဘဲ ဒေတာတန်းပေါ်မည်
    db.collection("agents").orderBy("created_at", "desc").onSnapshot((querySnapshot) => {
        displayArea.innerHTML = ""; 
        querySnapshot.forEach((doc) => {
            const agent = doc.data();
            const agentElement = document.createElement("div");
            
            // UI ပိုလှအောင် ပြင်ဆင်ထားသည့် Style
            agentElement.style.background = "#f4f4f4";
            agentElement.style.padding = "15px";
            agentElement.style.marginBottom = "10px";
            agentElement.style.borderRadius = "8px";
            agentElement.style.borderLeft = "5px solid #2196F3";
            
            agentElement.innerHTML = `
                <p style="margin: 5px 0;"><strong>Shop Name:</strong> ${agent.name}</p>
                <p style="margin: 5px 0;"><strong>Agent ID:</strong> ${agent.tenantId}</p>
                <p style="margin: 5px 0;"><strong>Password:</strong> ${agent.password}</p>
            `;
            displayArea.appendChild(agentElement);
        });
    });
}
