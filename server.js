// Gerekli kütüphaneleri dahil ediyoruz
require("dotenv").config(); // Çevre değişkenlerini kullanmak için dotenv
const express = require("express"); // Express.js
const cors = require("cors"); // CORS modülü
const axios = require("axios"); // HTTP istekleri için Axios

// Express uygulaması oluşturuluyor
const app = express();
const PORT = process.env.PORT || 3000; // PORT çevre değişkeni veya 3000

// CORS'u etkinleştiriyoruz (Tüm kaynaklara izin ver)
app.use(cors());

// Statik dosyaları sunmak için "public" klasörünü kullanıyoruz
app.use(express.static("public"));

// Arama rotası - Unsplash API ile görsel arama
app.get("/search", async (req, res) => {
  const query = req.query.query; // Kullanıcıdan gelen "query" parametresi
  const perPage = req.query.per_page || 5; //Varsayılan sonuç

  // Eğer arama sorgusu yoksa hata döndür
  if (!query) {
    return res.status(400).json({ error: "Arama sorgusu gerekli!" });
  }

  try {
    // Unsplash API'ye HTTP GET isteği yapıyoruz
    const response = await axios.get("https://api.unsplash.com/search/photos", {
      params: {
        query: query, // Kullanıcının arama sorgusu
        per_page: req.query.per_page || 5, // Sonuç sayısı (Varsayılan 5)
        orientation: req.query.orientation || "landscape" // Yönlendirme (Varsayılan landscape)
      },
      headers: {
        Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}` // API anahtarı
      }
    });
    console.log(
      `API Yanıtı: (${query}, ${perPage} sonuç):`,
      response.data.results.lenght
    );
    // API'den dönen yanıtı istemciye gönderiyoruz
    res.json(response.data);
  } catch (error) {
    // Hata oluşursa bunu yakalıyoruz ve logluyoruz
    if (error.response) {
      console.error("Unsplash API Hatası:", error.response.data);
      return res
        .status(error.response.status)
        .json({ error: error.response.data.errors });
    } else {
      console.error("Sunucu Hatası:", error.message);
      return res
        .status(500)
        .json({ error: "Sunucu tarafında bir hata oluştu." });
    }
  }
});

// Sunucuyu başlatıyoruz
app.listen(PORT, () => {
  console.log(`Sunucu http://localhost:${PORT} üzerinde çalışıyor`);
});
