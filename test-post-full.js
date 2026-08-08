const payload = {
  title: "Test Full Payload",
  subtitle: null,
  description: "Test desc",
  location: "Loc",
  state: null,
  country: null,
  difficulty: "MODERATE",
  durationDays: 5,
  distanceKm: null,
  maxAltitude: null,
  summitPoint: null,
  latitude: null,
  longitude: null,
  pickupPoint: null,
  dropPoint: null,
  included: null,
  excluded: null,
  thingsToCarry: null,
  cancellationPolicy: null
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
