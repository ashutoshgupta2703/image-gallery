document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.card');
  const lightbox = document.querySelector('.lightbox');
  const lightboxImg = document.querySelector('.lightbox-img img');
  const closeBtn = document.querySelector('.close');
  const nextBtn = document.querySelector('.nav-btn.next');
  const prevBtn = document.querySelector('.nav-btn.prev');
  const filterBtns = document.querySelectorAll('.btn.filter');
  const searchInput = document.querySelector('.search');
  const effectBtns = document.querySelectorAll('.effects .ef');
  const thumbList = document.querySelector('.thumb-list');
  
  let currentIndex = 0;

  const images = Array.from(cards).map(card => ({
    src: card.querySelector('img').src,
    caption: card.querySelector('.caption').innerText,
    category: card.dataset.category || 'all'
  }));

  function openLightbox(index) {
    currentIndex = index;
    lightbox.classList.add('open');
    updateLightbox();
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
  }

  function updateLightbox() {
    const imgData = images[currentIndex];
    lightboxImg.src = imgData.src;
    lightbox.querySelector('.lightbox-side .caption').innerText = imgData.caption;
    // Update thumbnails
    thumbList.innerHTML = '';
    images.forEach((img, i) => {
      const thumb = document.createElement('img');
      thumb.src = img.src;
      if (i === currentIndex) thumb.classList.add('active');
      thumb.addEventListener('click', () => {
        currentIndex = i;
        updateLightbox();
      });
      thumbList.appendChild(thumb);
    });
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % images.length;
    updateLightbox();
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateLightbox();
  }

  // Event bindings
  cards.forEach((card, index) => {
    card.addEventListener('click', () => openLightbox(index));
  });

  closeBtn.addEventListener('click', closeLightbox);
  nextBtn.addEventListener('click', showNext);
  prevBtn.addEventListener('click', showPrev);

  // Filters
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const category = btn.dataset.category;
      cards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Search
  searchInput.addEventListener('input', () => {
    const term = searchInput.value.toLowerCase();
    cards.forEach(card => {
      const caption = card.querySelector('.caption').innerText.toLowerCase();
      card.style.display = caption.includes(term) ? '' : 'none';
    });
  });

  // Image effects
  effectBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      effectBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const effect = btn.dataset.effect;
      lightboxImg.className = '';
      if (effect) lightboxImg.classList.add(`filter-${effect}`);
    });
  });

  // Close lightbox with ESC
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
  });
});
