const fs = require('fs');
async function query() {
  const res = await fetch('https://lcrjlyazydrkhuwsfwor.supabase.co/rest/v1/trek_departures?select=id,status,start_date,is_active,treks!inner(id,published)', {
    headers: {
      'apikey': 'sb_secret_FiMsb230AXxZH4GbNEqthg_l6sYtLq4',
      'Authorization': 'Bearer sb_secret_FiMsb230AXxZH4GbNEqthg_l6sYtLq4'
    }
  });
  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
}
query();
