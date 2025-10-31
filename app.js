// === ИНИЦИАЛИЗАЦИЯ КАРТЫ ===
const map = L.map("map", {
  center: [49.95, 82.6], // центр Восточно-Казахстанской области
  zoom: 7,
  minZoom: 5,
  maxZoom: 18,
});

// Добавляем слой карты (тёмный современный стиль)
L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> | <a href="https://carto.com/">CARTO</a>',
}).addTo(map);

// === ЭМОДЗИ-МЕТКИ ===
const icons = {
  dealer: L.divIcon({
    html: "🔵",
    className: "emoji-marker",
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  }),
  graffiti: L.divIcon({
    html: "🟡",
    className: "emoji-marker",
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  }),
  den: L.divIcon({
    html: "🔴",
    className: "emoji-marker",
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  }),
};

// === ТЕСТОВЫЕ ДАННЫЕ ===
const incidents = [
  {
    type: "dealer",
    coords: [49.948, 82.606],
    address: "г. Усть-Каменогорск, ул. Казахстан, 12",
    description: "Наблюдена активность, передача пакетов у подъезда.",
    status: "В проверке",
    date: "2025-10-25",
    kui: "KZ-2451",
    erdr: "№154/2025",
  },
  {
    type: "graffiti",
    coords: [50.002, 82.652],
    address: "г. Усть-Каменогорск, пр. Абая, 45",
    description: "Граффити с нарко-ссылками на стене.",
    status: "Подтверждено",
    date: "2025-10-28",
    kui: "KZ-2460",
    erdr: "№160/2025",
  },
  {
    type: "den",
    coords: [49.78, 83.05],
    address: "г. Риддер, ул. Металлургов, 8",
    description: "Подозрение на притон, постоянные визиты одних и тех же лиц.",
    status: "Передано в МВД",
    date: "2025-10-26",
    kui: "KZ-2457",
    erdr: "№157/2025",
  },
];

// === СОЗДАЁМ КЛАСТЕР ===
const markers = L.markerClusterGroup();
const markerList = [];

incidents.forEach((incident) => {
  const marker = L.marker(incident.coords, { icon: icons[incident.type] });
  marker.type = incident.type;
  marker.details = incident;
  marker.on("click", () => showIncidentInfo(incident));
  markers.addLayer(marker);
  markerList.push(marker);
});

map.addLayer(markers);

// === ОТОБРАЖЕНИЕ ДЕТАЛЕЙ ===
function showIncidentInfo(data) {
  document.querySelector("#incident-info .placeholder").style.display = "none";
  const details = document.querySelector("#incident-info .details");
  details.style.display = "block";

  document.getElementById("info-type").textContent = formatType(data.type);
  document.getElementById("info-address").textContent = data.address;
  document.getElementById("info-description").textContent = data.description;
  document.getElementById("info-status").textContent = data.status;
  document.getElementById("info-date").textContent = data.date;
  document.getElementById("info-kui").textContent = data.kui;
  document.getElementById("info-erdr").textContent = data.erdr;
}

function formatType(type) {
  switch (type) {
    case "dealer":
      return "Наркозакладчик";
    case "graffiti":
      return "Наркограффити";
    case "den":
      return "Наркопритон";
    default:
      return type;
  }
}

// === ФИЛЬТРЫ ===
const filterInputs = document.querySelectorAll(
  '.filter-group input[type="checkbox"]'
);
filterInputs.forEach((input) => {
  input.addEventListener("change", updateFilters);
});

function updateFilters() {
  const activeFilters = Array.from(filterInputs)
    .filter((i) => i.checked)
    .map((i) => i.value);

  markers.clearLayers();

  markerList.forEach((m) => {
    if (activeFilters.includes(m.type)) {
      markers.addLayer(m);
    }
  });
}
