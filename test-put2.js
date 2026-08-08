const payload = {
  coverImageUrl: "https://example.com/new-cover.jpg"
};

fetch("http://localhost:8080/api/v1/admin/treks/2dc4f3fd-d1ba-49b1-a03f-b77e64563b7a", {
  method: "PUT",
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
