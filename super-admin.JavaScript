// super-admin.JavaScript
async function saveAgent() {
    // HTML input တွေထဲက data ကို ယူခြင်း
    const agentName = document.getElementById('agentName').value;
    const agentId = document.getElementById('agentId').value;
    const agentPass = document.getElementById('agentPass').value;

    // အချက်အလက် မပြည့်စုံပါက အသိပေးခြင်း
    if (!agentName || !agentId || !agentPass) {
        alert("ကျေးဇူးပြု၍ အချက်အလက်အားလုံး ဖြည့်သွင်းပါ");
        return;
    }

    // သင်၏ Supabase Project အချက်အလက်များ
    const supabaseUrl = 'https://rxqigyvaxumeszuapfzs.supabase.co'; 
    const supabaseKey = 'sb_publishable_DdRPY0oATSou-L929A7p8Q_rhSc0NqG-N5U6l6B6tTfA-vH3R'; 

    // Database ထဲက column name များအတိုင်း ဒေတာပြင်ဆင်ခြင်း
    const data = {
        "name": agentName,
        "tenantId": agentId,
        "password": agentPass,
        "created_at": new Date().toISOString() 
    };

    try {
        // Supabase သို့ API မှတစ်ဆင့် data ပို့ခြင်း
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
            // အောင်မြင်ပါက Alert ပြပြီး input များကို ပြန်ရှင်းထုတ်ခြင်း
            alert(agentName + " အတွက် အကောင့်ဖွင့်ခြင်း အောင်မြင်ပါသည်");
            
            document.getElementById('agentName').value = '';
            document.getElementById('agentId').value = '';
            document.getElementById('agentPass').value = '';
        } else {
            // Error တစ်ခုခုတက်ပါက Console မှာ ပြခြင်း
            const errorRes = await response.json();
            console.error("Supabase Error:", errorRes);
            alert("Database နှင့် ချိတ်ဆက်မှု မအောင်မြင်ပါ။ (RLS Setting ပိတ်ထားလား ပြန်စစ်ပေးပါ)");
        }
        
    } catch (error) {
        console.error("Connection Error:", error);
        alert("Network အမှားအယွင်း ရှိနေပါသည်။");
    }
}
