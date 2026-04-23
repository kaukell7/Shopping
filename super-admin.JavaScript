// super-admin.JavaScript
async function saveAgent() {
    const agentName = document.getElementById('agentName').value;
    const agentId = document.getElementById('agentId').value;
    const agentPass = document.getElementById('agentPass').value;

    if (!agentName || !agentId || !agentPass) {
        alert("ကျေးဇူးပြု၍ အချက်အလက်အားလုံး ဖြည့်သွင်းပါ");
        return;
    }

    // သင်၏ Supabase Project အချက်အလက်များ
    const supabaseUrl = 'https://rxqigyvaxumeszuapfzs.supabase.co'; 
    // အောက်က Key ကို အစအဆုံး သေချာ ကူးပေးပါ (401 error မတက်စေရန်)
    const supabaseKey = 'sb_publishable_DdRPY0oATSou-L929A7p8Q_rhSc0NqG-N5U6l6B6tTfA-vH3R'; 

    const data = {
        "name": agentName,
        "tenantId": agentId, 
        "password": agentPass,
        "created_at": new Date().toISOString() 
    };

    try {
        const response = await fetch(`${supabaseUrl}/rest/v1/agents`, {
            method: 'POST',
            headers: {
                'apikey': supabaseKey, // ဒီနေရာမှာ key မှန်ဖို့ လိုအပ်သည်
                'Authorization': `Bearer ${supabaseKey}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert(agentName + " အတွက် အကောင့်ဖွင့်ခြင်း အောင်မြင်ပါသည်");
            document.getElementById('agentName').value = '';
            document.getElementById('agentId').value = '';
            document.getElementById('agentPass').value = '';
        } else {
            const errorRes = await response.json();
            console.error("Supabase Error Details:", errorRes);
            alert("သော့ချက် (API Key) မမှန်ကန်ပါ။ Supabase Dashboard ထဲက anon key ကို ပြန်စစ်ပေးပါ။");
        }
        
    } catch (error) {
        console.error("Network or Code Error:", error);
        alert("ချိတ်ဆက်မှု အမှားအယွင်း ရှိနေပါသည်။");
    }
}
