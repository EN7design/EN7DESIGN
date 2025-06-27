const images = document.querySelectorAll('.image');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const closeBtn = document.getElementById('closeBtn');

// Utilise une référence directe à l'élément vidéo du lightbox
const lightboxVideo = document.getElementById('lightbox-video');

let lastPlayedVideo = null;

function showLightboxMedia(src, isVideo, originVideo = null) {
  if (isVideo) {
    lightboxImg.style.display = 'none';
    lightboxImg.src = '';
    lightboxVideo.style.display = 'block';
    lightboxVideo.src = src;
    lightboxVideo.load();
    lightboxVideo.play();
    lastPlayedVideo = originVideo; // mémorise la vidéo d'origine
  } else {
    if (lastPlayedVideo) {
      lastPlayedVideo.pause();
      lastPlayedVideo.currentTime = 0;
      lastPlayedVideo = null;
    }
    lightboxVideo.pause();
    lightboxVideo.currentTime = 0;
    lightboxVideo.style.display = 'none';
    lightboxVideo.src = '';
    lightboxImg.style.display = 'block';
    lightboxImg.src = src;
  }
  lightbox.style.display = 'flex';
}

images.forEach(media => {
  // Desktop click
  media.addEventListener('click', function () {
    // Pause toutes les vidéos d'origine avant d'ouvrir le lightbox
    document.querySelectorAll('video.image').forEach(v => { v.pause(); v.currentTime = 0; });
    if (media.tagName.toLowerCase() === 'video') {
      showLightboxMedia(
        media.querySelector('source') ? media.querySelector('source').src : media.src,
        true,
        media
      );
    } else {
      showLightboxMedia(media.src, false);
    }
  });
  // Mobile tap (distingué du swipe)
  let touchStartX = 0, touchStartY = 0, moved = false;
  media.addEventListener('touchstart', function (e) {
    if (e.touches.length === 1) {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      moved = false;
    }
  });
  media.addEventListener('touchmove', function (e) {
    if (e.touches.length === 1) {
      const dx = Math.abs(e.touches[0].clientX - touchStartX);
      const dy = Math.abs(e.touches[0].clientY - touchStartY);
      if (dx > 10 || dy > 10) moved = true;
    }
  });
  media.addEventListener('touchend', function (e) {
    if (!moved) {
      document.querySelectorAll('video.image').forEach(v => { v.pause(); v.currentTime = 0; });
      if (media.tagName.toLowerCase() === 'video') {
        showLightboxMedia(
          media.querySelector('source') ? media.querySelector('source').src : media.src,
          true,
          media
        );
      } else {
        showLightboxMedia(media.src, false);
      }
    }
  });
});

function closeLightbox() {
  lightbox.style.display = 'none';
  lightboxImg.src = '';
  lightboxImg.style.display = 'block';
  lightboxVideo.pause();
  lightboxVideo.currentTime = 0;
  lightboxVideo.style.display = 'none';
  lightboxVideo.src = '';
  // Met aussi en pause la vidéo d'origine si besoin
  if (lastPlayedVideo) {
    lastPlayedVideo.pause();
    lastPlayedVideo.currentTime = 0;
    lastPlayedVideo = null;
  }
}

closeBtn.onclick = closeLightbox;
lightbox.onclick = function (e) {
  if (e.target === lightbox) {
    closeLightbox();
  }
};
