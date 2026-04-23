// super-admin.JavaScript
async function saveAgent() {
    const agentName = document.getElementById('agentName').value;
    const agentId = document.getElementById('agentId').value;
    const agentPass = document.getElementById('agentPass').value;

    if (!agentName || !agentId || !agentPass) {
        alert("ကျေးဇူးပြု၍ အချက်အလက်အားလုံး ဖြည့်သွင်းပါ");
        return;
    }

    // Supabase အတွက် ပြင်ဆင်ထားသော URL နှင့် Key
    const supabaseUrl = 'https://rxqigyvaxumeszuapfzs.supabase.co'; // သင်၏ Project URL
    const supabaseKey = 'ဒီနေရာမှာ_သင်ကူးထားတဲ့_Publishable_Key_ကို_အစားထိုးပါ'; // Publishable Key (sb_...)

    // Supabase (PostgreSQL) သို့ ပို့မည့် data format
    const data = {
        "name": agentName,
        "tenantId": agentId,
        "password": agentPass,
        "createdAt": new Date()
    };

    try {
        // Supabase REST API နှင့် ချိတ်ဆက်ခြင်း
        const response = await fetch(`${supabaseUrl}/rest/v1/agents`, {
            method: 'POST',
            headers: {
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal' // အောင်မြင်ရင် data ပြန်မတောင်းဘဲ speed မြန်အောင်လုပ်ခြင်း
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
            // အမှားအယွင်းရှိပါက အသေးစိတ်ပြရန်
            const errorRes = await response.json();
            console.error("Supabase Error:", errorRes);
            alert("Database နှင့် ချိတ်ဆက်မှု မအောင်မြင်ပါ။ (RLS Setting ကို စစ်ဆေးပါ)");
        }
        
    } catch (error) {
        console.error("Connection Error:", error);
        alert("Network အမှားအယွင်း ရှိနေပါသည်။");
    }
}
