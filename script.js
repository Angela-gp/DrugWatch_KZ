const map = L.map('map').setView([49.9483, 82.6275], 7); // Центр ВКО

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Добавление маркера по клику
map.on('click', async function(e) {
  const { lat, lng } = e.latlng;
  const marker = L.marker([lat, lng]).addTo(map);
  marker.bindPopup(`Сообщено с карты: ${lat.toFixed(5)}, ${lng.toFixed(5)}`).openPopup();

  // Отправляем на сервер
  await fetch('/report', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ lat, lng, source: 'web' })
  });
});

// Загружаем существующие точки
async function loadReports() {
  const res = await fetch('/reports');
  const data = await res.json();
  data.forEach(r => {
    L.marker([r.lat, r.lng]).addTo(map)
      .bindPopup(`Источник: ${r.source}<br>${r.lat.toFixed(5)}, ${r.lng.toFixed(5)}`);
  });
}
loadReports();
