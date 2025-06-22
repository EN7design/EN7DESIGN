const images = document.querySelectorAll('.image');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const closeBtn = document.getElementById('closeBtn');

images.forEach(img => {
  // Desktop click
  img.addEventListener('click', function () {
    lightbox.style.display = 'flex';
    lightboxImg.src = this.src;
  });
  // Mobile tap (distingué du swipe)
  let touchStartX = 0, touchStartY = 0, moved = false;
  img.addEventListener('touchstart', function (e) {
    if (e.touches.length === 1) {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      moved = false;
    }
  });
  img.addEventListener('touchmove', function (e) {
    if (e.touches.length === 1) {
      const dx = Math.abs(e.touches[0].clientX - touchStartX);
      const dy = Math.abs(e.touches[0].clientY - touchStartY);
      if (dx > 10 || dy > 10) moved = true;
    }
  });
  img.addEventListener('touchend', function (e) {
    if (!moved) {
      lightbox.style.display = 'flex';
      lightboxImg.src = this.src;
    }
  });
});

closeBtn.onclick = function () {
  lightbox.style.display = 'none';
  lightboxImg.src = '';
};
lightbox.onclick = function (e) {
  if (e.target === lightbox) {
    lightbox.style.display = 'none';
    lightboxImg.src = '';
  }
};
