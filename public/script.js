document.getElementById('searchButton').addEventListener('click', async () => {
    const query = document.getElementById('searchInput').value;
  
    // Kaç sonuç döneceğini seçmek için "resultCount" değerini oku
    const resultCount = document.getElementById('resultCount').value;
  
    if (!query) {
      alert('Please enter a search term!');
      return;
    }
  
    try {
      // Yükleniyor göstergesi
      const loadingDiv = document.getElementById('loading');
      loadingDiv.style.display = 'block';
  
      // API'den veriyi al
      const response = await fetch('http://localhost:3000/search?query=${query}&per_page=${resultCount}');
      const data = await response.json();
  
      // Sonuçları ekrana yazdır
      const resultsDiv = document.getElementById('results');
      resultsDiv.innerHTML = ''; // Önceki sonuçları temizle
      data.results.forEach((image) => {
        console.log("Toplam Sonuç Sayısı:", response.data.results.length);
        console.log("API Yanıtı:", response.data.results);
        console.log("Gelen Veri:", data.results); // Gelen görselleri kontrol et
        console.log('Görsel:', image); // Her bir görsel objesini kontrol et
        const imgContainer = document.createElement('div');
        imgContainer.className = 'image-container';
      
        const img = document.createElement('img');
        img.src = image.urls.small; // Görsel URL'si
        img.alt = image.alt_description || 'Unsplash Image'; // Alternatif metin
      
        imgContainer.appendChild(img);
        resultsDiv.appendChild(imgContainer);
        data.results
  .filter((image) => image.alt_description && image.alt_description.toLowerCase().includes(query.toLowerCase()))
  .forEach((image) => {
    const imgContainer = document.createElement('div');
    imgContainer.className = 'image-container';

    const img = document.createElement('img');
    img.src = image.urls.small;
    img.alt = image.alt_description || 'Unsplash Image';

    imgContainer.appendChild(img);
    resultsDiv.appendChild(imgContainer);
  });

      });
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      // Yükleniyor göstergesini gizle
      const loadingDiv = document.getElementById('loading');
      loadingDiv.style.display = 'none';
    }
  });


  