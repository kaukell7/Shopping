// admin-script.js
async function saveAgent() {
    const agentName = document.getElementById('agentName').value;
    const agentId = document.getElementById('agentId').value;
    const agentPass = document.getElementById('agentPass').value;

    if (!agentName || !agentId || !agentPass) {
        alert("ကျေးဇူးပြု၍ အချက်အလက်အားလုံး ဖြည့်သွင်းပါ");
        return;
    }

    const agentData = {
        name: agentName,
        tenantId: agentId, // ဥပမာ- ali_001
        password: agentPass,
        createdAt: new Date()
    };

    // ဤနေရာတွင် MongoDB Atlas Data API URL နှင့် API Key ထည့်ရပါမည်
    try {
        console.log("Saving Agent:", agentData);
        // တကယ်ချိတ်ဆက်မည့် Fetch Code များကို ဤနေရာတွင် ထည့်သွင်းပါ
        alert(agentName + " အတွက် အကောင့်ဖွင့်ခြင်း အောင်မြင်ပါသည်");
        
        // Form ကို Clean ပြန်လုပ်ခြင်း
        document.getElementById('agentName').value = '';
        document.getElementById('agentId').value = '';
        document.getElementById('agentPass').value = '';
        
    } catch (error) {
        console.error("Error:", error);
    }
}
