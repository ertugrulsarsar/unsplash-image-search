document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.getElementById('searchButton');
    const resultCount = document.getElementById('resultCount');
    const resultsDiv = document.getElementById('results');
    const loadingDiv = document.getElementById('loading');
    const modal = document.getElementById('imageModal');
    const modalContent = document.getElementById('modalContent');
    const closeModal = document.getElementById('closeModal');
  
    let page = 1; // Sonsuz kaydırma için başlangıç sayfası
  
    // Arama Yapma Fonksiyonu
    const searchImages = async (query) => {
      try {
        loadingDiv.classList.remove('hidden');
        const response = await fetch(`http://localhost:3000/search?query=${query}&per_page=${resultCount.value}&page=${page}`);
        const data = await response.json();
  
        if (page === 1) resultsDiv.innerHTML = ''; // İlk sayfada önceki sonuçları temizle
  
        data.results.forEach((image) => {
          const card = `
            <div class="image-container cursor-pointer" data-image-url="${image.urls.regular}" data-photographer="${image.user.name}" data-profile-link="${image.user.links.html}">
              <img src="${image.urls.small}" alt="${image.alt_description || 'Unsplash Image'}" class="w-full h-48 object-cover rounded-lg shadow-md">
            </div>`;
          resultsDiv.innerHTML += card;
        });
  
        page++; // Bir sonraki sayfa için artır
      } catch (error) {
        console.error('Görseller alınırken bir hata oluştu:', error);
        alert('Bir hata meydana geldi. Lütfen tekrar deneyin.');
      } finally {
        loadingDiv.classList.add('hidden');
      }
    };
  
    // Modal Açma Fonksiyonu
    resultsDiv.addEventListener('click', (event) => {
      const target = event.target.closest('.image-container');
      if (!target) return;
  
      const imageUrl = target.dataset.imageUrl;
      const photographer = target.dataset.photographer;
      const profileLink = target.dataset.profileLink;
  
      modalContent.innerHTML = `
        <img src="${imageUrl}" class="w-full h-64 object-cover rounded-lg mb-4">
        <p class="text-lg font-semibold">Photo by: <a href="${profileLink}" target="_blank" class="text-blue-500 underline">${photographer}</a></p>
      `;
      modal.classList.remove('hidden');
    });
  
    // Modalı Kapatma
    closeModal.addEventListener('click', () => {
      modal.classList.add('hidden');
    });
    // Modalın dışına tıklanınca kapat
modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.classList.add('hidden');
    }
  });
  
    // Kategori Seçimi
    document.querySelectorAll('.category-btn').forEach((button) => {
      button.addEventListener('click', () => {
        const category = button.dataset.category;
        document.getElementById('searchInput').value = category;
        page = 1; // Yeni kategori için sayfayı sıfırla
        searchImages(category);
      });
    });
  
    // Arama Butonuna Tıklama
    searchButton.addEventListener('click', () => {
      const query = document.getElementById('searchInput').value.trim();
      if (!query) {
        alert('Lütfen bir arama terimi girin!');
        return;
      }
      page = 1; // Yeni arama için sayfayı sıfırla
      searchImages(query);
    });
  
    // Sonsuz Kaydırma
    window.addEventListener('scroll', () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        const query = document.getElementById('searchInput').value.trim();
        if (query) searchImages(query);
      }
    });
  });
  