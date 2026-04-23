// super-admin.JavaScript
async function saveAgent() {
    const agentName = document.getElementById('agentName').value;
    const agentId = document.getElementById('agentId').value;
    const agentPass = document.getElementById('agentPass').value;

    if (!agentName || !agentId || !agentPass) {
        alert("ကျေးဇူးပြု၍ အချက်အလက်အားလုံး ဖြည့်သွင်းပါ");
        return;
    }

    // MongoDB သို့ ပို့မည့် format
    const data = {
        "collection": "agents",
        "database": "TheShoeHub",
        "dataSource": "Cluster0",
        "document": {
            "name": agentName,
            "tenantId": agentId,
            "password": agentPass,
            "createdAt": new Date()
        }
    };

    try {
        // Data API နဲ့ ချိတ်ဆက်ခြင်း
        const response = await fetch("ဒီနေရာမှာ_URL_ENDPOINT_ကို_သေချာ_အစားထိုးထည့်ပါ", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': 'ဒီနေရာမှာ_API_KEY_ကို_သေချာ_အစားထိုးထည့်ပါ'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert(agentName + " အတွက် အကောင့်ဖွင့်ခြင်း အောင်မြင်ပါသည်");
            
            // Form ကို Clean ပြန်လုပ်ခြင်း
            document.getElementById('agentName').value = '';
            document.getElementById('agentId').value = '';
            document.getElementById('agentPass').value = '';
        } else {
            const errorRes = await response.json();
            console.error("MongoDB Error:", errorRes);
            alert("MongoDB နှင့် ချိတ်ဆက်မှု မအောင်မြင်ပါ။");
        }
        
    } catch (error) {
        console.error("Connection Error:", error);
        alert("Network အမှားအယွင်း ရှိနေပါသည်။");
    }
}
