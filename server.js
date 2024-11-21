// server.js
require('dotenv').config(); // .env dosyasını yükler

console.log('Unsplash Access Key:', process.env.UNSPLASH_ACCESS_KEY);


require('dotenv').config(); // Çevre değişkenlerini yükle
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 3000; // Sunucunun çalışacağı port

// CORS'u etkinleştir
app.use(cors());

// Ana rota
app.get('/', (req, res) => {
  res.send('Unsplash Image Search API çalışıyor!');
});

// Arama rotası
app.get('/search', async (req, res) => {
  const query = req.query.query; // İstekten "query" parametresini al
  if (!query) {
    return res.status(400).json({ error: 'Arama sorgusu gerekli!' });
  }

  try {
    const response = await axios.get('https://api.unsplash.com/search/photos', {
      params: {
        query: query,
        per_page: 10, // Her istekte 10 sonuç döner
      },
      headers: {
        Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
      },
    });

    // Gelen veriyi istemciye döndür
    res.json(response.data);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Unsplash API isteğinde bir hata oluştu.' });
  }
});

// Sunucuyu başlat
app.listen(PORT, () => {
  console.log(`Sunucu http://localhost:${PORT} üzerinde çalışıyor`);
});
