const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgres://postgres.lcrjlyazydrkhuwsfwor:teJas%40664598@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres',
});

async function run() {
  await client.connect();
  const res = await client.query('SELECT email, profile_image_url FROM users');
  console.log(res.rows);
  await client.end();
}

run().catch(console.error);
