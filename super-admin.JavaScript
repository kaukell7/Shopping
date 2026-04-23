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
    // မှတ်ချက် - tenantId သည် Database ထဲတွင် "I" အကြီးဖြစ်သောကြောင့် အတိအကျတူရန်လိုသည်
    const data = {
        "name": agentName,
        "tenantId": agentId, 
        "password": agentPass,
        "created_at": new Date().toISOString() 
    };

    try {
        // Supabase REST API သို့ data ပို့ခြင်း
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
            // အောင်မြင်ပါက အသိပေးချက်ပြပြီး input များကို ရှင်းထုတ်ခြင်း
            alert(agentName + " အတွက် အကောင့်ဖွင့်ခြင်း အောင်မြင်ပါသည်");
            
            document.getElementById('agentName').value = '';
            document.getElementById('agentId').value = '';
            document.getElementById('agentPass').value = '';
        } else {
            // Error တက်ပါက Console တွင် အသေးစိတ်ကြည့်ရန်
            const errorRes = await response.json();
            console.error("Supabase Error Details:", errorRes);
            alert("Database သိမ်းဆည်းမှု မအောင်မြင်ပါ။ RLS Settings နှင့် Table Name ကို ထပ်မံစစ်ဆေးပေးပါ");
        }
        
    } catch (error) {
        console.error("Network or Code Error:", error);
        alert("ချိတ်ဆက်မှု အမှားအယွင်း ရှိနေပါသည်။");
    }
}
