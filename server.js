const express = require("express");
const cors = require("cors"); // CORS modülünü dahil et
const axios = require("axios");
require("dotenv").config();

const app = express();
const PORT = 3000;

// CORS'u etkinleştir
app.use(cors());

// Statik dosyaları sunmak için public klasörünü kullan
app.use(express.static("public"));

// API rotaları
app.get("/search", async (req, res) => {
  const query = req.query.query; // İstekten query parametresini al
  if (!query) {
    return res.status(400).json({ error: "Arama sorgusu gerekli!" });
  }

  try {
    const response = await axios.get("https://api.unsplash.com/search/photos", {
      params: {
        query: query, // Arama sorgusu
        per_page: 5 // Döndürülecek sonuç sayısı
      },
      headers: {
        Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error("Unsplash API Hatası:", error.message);

    res.status(500).json({ error: "Unsplash API isteğinde bir hata oluştu." });
  }
});

// Sunucuyu başlat
app.listen(PORT, () => {
  console.log(`Sunucu http://localhost:${PORT} üzerinde çalışıyor`);
});
