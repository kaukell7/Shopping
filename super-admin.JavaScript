// super-admin.JavaScript
async function saveAgent() {
    const agentName = document.getElementById('agentName').value;
    const agentId = document.getElementById('agentId').value;
    const agentPass = document.getElementById('agentPass').value;

    if (!agentName || !agentId || !agentPass) {
        alert("ကျေးဇူးပြု၍ အချက်အလက်အားလုံး ဖြည့်သွင်းပါ");
        return;
    }

    // Supabase အတွက် အချက်အလက်များ
    const supabaseUrl = 'https://rxqigyvaxumeszuapfzs.supabase.co'; 
    const supabaseKey = 'sb_publishable_DdRPY0oATSou-L929A7p8Q_rhSc0NqG-N5U6l6B6tTfA-vH3R'; // သင့်ပုံထဲက Key ကို ထည့်ပေးထားသည်

    // Supabase (PostgreSQL) သို့ ပို့မည့် data format
    const data = {
        "name": agentName,
        "tenantId": agentId,
        "password": agentPass,
        "created_at": new Date().toISOString() // Database ထဲက column name အတိုင်း ပြင်ထားသည်
    };

    try {
        // Supabase REST API နှင့် ချိတ်ဆက်ခြင်း
        const response = await fetch(`${supabaseUrl}/rest/v1/agents`, {
            method: 'POST',
            headers: {
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert(agentName + " အတွက် အကောင့်ဖွင့်ခြင်း အောင်မြင်ပါသည်");
            
            // Form ကို ပြန်ရှင်းခြင်း
            document.getElementById('agentName').value = '';
            document.getElementById('agentId').value = '';
            document.getElementById('agentPass').value = '';
        } else {
            const errorRes = await response.json();
            console.error("Supabase Error:", errorRes);
            alert("Database နှင့် ချိတ်ဆက်မှု မအောင်မြင်ပါ။ (RLS Setting ပိတ်ထားလား ပြန်စစ်ပေးပါ)");
        }
        
    } catch (error) {
        console.error("Connection Error:", error);
        alert("Network အမှားအယွင်း ရှိနေပါသည်။");
    }
}
