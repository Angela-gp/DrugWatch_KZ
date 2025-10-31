import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Настройка для работы с __dirname в ES-модулях
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// --- ИЗМЕНЕНО ---
// Сервируем статические файлы (HTML, CSS, JS) из текущей директории
app.use(express.static(__dirname));

// --- MOCK DATABASE ---
// (Та же база данных, что и в прошлый раз)
const mockIncidents = [
  {
    id: 1,
    type: 'graffiti', // 'graffiti', 'dealer', 'den'
    lat: 43.238949,
    lng: 76.889709,
    address: 'ул. Абая, 15',
    description: 'Надпись на стене дома, реклама телеграм-канала.',
    date: '2025-10-29T14:30:00Z',
    kui: '123456789',
    erdr: '987654321',
    status: 'Передано в патрульную службу'
  },
  {
    id: 2,
    type: 'dealer',
    lat: 43.241000,
    lng: 76.891200,
    address: 'Парк 28 Панфиловцев, под лавочкой',
    description: 'Подозрительный человек оставил сверток.',
    date: '2025-10-30T10:15:00Z',
    kui: null,
    erdr: null,
    status: 'Ожидает проверки'
  },
  {
    id: 3,
    type: 'den',
    lat: 43.238000,
    lng: 76.880000,
    address: 'ул. Гоголя, 50, кв. 12',
    description: 'Сильный химический запах из квартиры, постоянный поток людей.',
    date: '2025-10-28T18:00:00Z',
    kui: '123456000',
    erdr: '987654000',
    status: 'Меры приняты, притон ликвидирован'
  },
  {
    id: 4,
    type: 'graffiti',
    lat: 43.239100,
    lng: 76.889900,
    address: 'ул. Абая, 17',
    description: 'Реклама наркотиков на остановке.',
    date: '2025-10-30T11:00:00Z',
    kui: null,
    erdr: null,
    status: 'Ожидает проверки'
  }
];
// ---------------------

// API Эндпоинт для получения всех инцидентов
app.get('/api/incidents', (req, res) => {
  res.json(mockIncidents);
});

// API Эндпоинт для добавления инцидента
app.post('/api/incidents', (req, res) => {
  console.log('Получены новые данные об инциденте:', req.body);
  const newIncident = { ...req.body, id: mockIncidents.length + 1 };
  mockIncidents.push(newIncident);
  res.status(201).json(newIncident);
});

// --- ИЗМЕНЕНО ---
// Отдаем index.html на все остальные запросы
app.get('*', (req, res) => {
  // Проверяем, не запрашивает ли API, чтобы избежать HTML
  if (req.path.startsWith('/api/')) {
    return res.status(404).send('Not Found');
  }
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Сервер DrugWatch KZ запущен на http://localhost:${PORT}`);
});