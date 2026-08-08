const payload = {
  title: "Test Trek Post",
  description: "A beautiful test trek.",
  location: "Test Location",
  difficulty: "MODERATE",
  durationDays: 3
};

fetch("http://localhost:8080/api/v1/admin/treks", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify(payload)
})
.then(r => Math.abs(r.status - 200) < 100 ? r.json() : Promise.reject(r))
.then(data => console.log(data))
.catch(async (e) => {
  console.error("HTTP ERROR", e.status);
  const text = await e.text();
  console.log(text);
});
