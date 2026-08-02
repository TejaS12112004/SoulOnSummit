const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const { Client } = require('pg');

async function run() {
  const client = new Client({
    connectionString: 'postgres://postgres.lcrjlyazydrkhuwsfwor:teJas%40664598@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres'
  });

  try {
    const email = `testuser_${Date.now()}@example.com`;
    // 1. Register
    console.log("Registering...", email);
    await axios.post('http://localhost:8080/api/v1/auth/register', {
      firstName: 'Test',
      lastName: 'User',
      email: email,
      password: 'Password123!',
      confirmPassword: 'Password123!',
      roles: ['USER']
    });

    // 2. Mark verified
    await client.connect();
    await client.query('UPDATE users SET email_verified = true WHERE email = $1', [email]);
    await client.end();
    console.log("Marked verified");

    // 3. Login
    console.log("Logging in...");
    const loginRes = await axios.post('http://localhost:8080/api/v1/auth/login', {
      email: email,
      password: 'Password123!'
    });
    
    const token = loginRes.data.data.accessToken;
    console.log("Got token");

    // 4. Create dummy file
    fs.writeFileSync('dummy.jpg', 'fake image content');

    // 5. Upload
    console.log("Uploading...");
    const form = new FormData();
    form.append('file', fs.createReadStream('dummy.jpg'));

    const uploadRes = await axios.put('http://localhost:8080/api/v1/users/profile-image', form, {
      headers: {
        ...form.getHeaders(),
        Authorization: `Bearer ${token}`
      }
    });

    console.log("Upload Success:", uploadRes.data);

  } catch (err) {
    if (err.response) {
      console.log("API Error:", err.response.status, err.response.data);
    } else {
      console.log("Error:", err.message);
    }
  }
}
run();
