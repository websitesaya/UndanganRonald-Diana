/* ================================================================
   UNDANGAN PERNIKAHAN — RANDI & DIANA
   script.js
   ================================================================ */

/* ── 1. Baca nama tamu dari URL parameter ─────────────────── */
(function () {
  const params = new URLSearchParams(window.location.search);
  const to = params.get('to');
  if (to) {
    document.getElementById('guest-name').textContent = decodeURIComponent(to);
  }
})();


/* ── 2. Buka Undangan ─────────────────────────────────────── */
function openInvitation() {
  const cover    = document.getElementById('cover');
  const main     = document.getElementById('main');
  const musicBtn = document.getElementById('music-btn');

  // Slide cover ke atas
  cover.classList.add('opened');

  // Setelah animasi cover mulai → tampilkan konten & musik
  setTimeout(() => {
    main.classList.add('visible');
    musicBtn.classList.add('show');
    initMusic();
    triggerReveal();
  }, 500);
}


/* ── 3. Musik Background ─────────────────────────────────── */
const audio = document.getElementById('bg-music');
let playing = false;

/**
 * Inisialisasi musik — dipanggil saat undangan dibuka.
 * Fade in volume secara perlahan agar tidak mengejutkan.
 */
function initMusic() {
  audio.volume = 0;
  const promise = audio.play();
  if (promise !== undefined) {
    promise
      .then(() => {
        playing = true;
        document.getElementById('music-btn').classList.add('playing');
        fadeVol(0, 0.5);
      })
      .catch(() => {
        // Browser memblokir autoplay — user bisa klik tombol musik secara manual
      });
  }
}

/**
 * Fade volume dari nilai `from` ke nilai `to` secara bertahap.
 * @param {number} from - volume awal (0–1)
 * @param {number} to   - volume tujuan (0–1)
 */
function fadeVol(from, to) {
  let v = from;
  const step = (to - from) / 30;
  const id = setInterval(() => {
    v += step;
    if ((step > 0 && v >= to) || (step < 0 && v <= to)) {
      v = to;
      clearInterval(id);
    }
    audio.volume = Math.max(0, Math.min(1, v));
  }, 80);
}

/**
 * Toggle play / pause musik.
 * Dipanggil dari tombol 🎵 di pojok kanan bawah.
 */
function toggleMusic() {
  const btn = document.getElementById('music-btn');
  if (playing) {
    fadeVol(audio.volume, 0);
    setTimeout(() => audio.pause(), 2500);
    btn.classList.remove('playing');
    btn.querySelector('.music-icon').textContent = '🔇';
    playing = false;
  } else {
    audio.play();
    btn.classList.add('playing');
    btn.querySelector('.music-icon').textContent = '🎵';
    fadeVol(0, 0.5);
    playing = true;
  }
}

// Event listener tombol musik
document.getElementById('music-btn').addEventListener('click', toggleMusic);


/* ── 4. Countdown ────────────────────────────────────────── */
(function countdownInit() {
  const target = new Date('2026-03-21T18:00:00'); 
  function tick() {
    const diff = target - new Date();
    const pad  = n => String(Math.max(0, n)).padStart(2, '0');

    if (diff <= 0) {
      ['cd-days', 'cd-hours', 'cd-mins', 'cd-secs'].forEach(id => {
        document.getElementById(id).textContent = '00';
      });
      return;
    }

    document.getElementById('cd-days').textContent  = pad(Math.floor(diff / 86400000));
    document.getElementById('cd-hours').textContent = pad(Math.floor(diff % 86400000 / 3600000));
    document.getElementById('cd-mins').textContent  = pad(Math.floor(diff % 3600000  / 60000));
    document.getElementById('cd-secs').textContent  = pad(Math.floor(diff % 60000    / 1000));

    setTimeout(tick, 1000);
  }

  tick();
})();


/* ── 5. Scroll Reveal (IntersectionObserver) ─────────────── */
const revEls = document.querySelectorAll('.reveal, .reveal-l, .reveal-r');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

/**
 * Mulai mengamati semua elemen reveal.
 * Dipanggil setelah undangan dibuka agar elemen langsung terdeteksi.
 */
function triggerReveal() {
  revEls.forEach(el => observer.observe(el));
}

/* ── Lightbox Gallery ── */
const lightboxPhotos = [
  { src: 'Foto1.jpg' },   // ← ganti nama file
  { src: 'Foto2.jpg' },   // ← ganti nama file
  { src: 'Foto3.jpg' },   // ← ganti nama file
  { src: 'Foto4.jpg' },   // ← ganti nama file
  { src: 'Foto5.jpg' },   // ← ganti nama file
];
let currentPhoto = 0;

function openLightbox(index) {
  currentPhoto = index;
  const lb = document.getElementById('lightbox');
  lb.classList.add('open');
  requestAnimationFrame(() => requestAnimationFrame(() => lb.classList.add('visible')));
  loadPhoto(currentPhoto);
  document.addEventListener('keydown', lbKeyHandler);
}

function closeLightbox() {
  const lb = document.getElementById('lightbox');
  lb.classList.remove('visible');
  setTimeout(() => lb.classList.remove('open'), 350);
  document.removeEventListener('keydown', lbKeyHandler);
}

function moveLightbox(dir) {
  currentPhoto = (currentPhoto + dir + lightboxPhotos.length) % lightboxPhotos.length;
  const img = document.getElementById('lb-img');
  img.style.opacity = '0';
  setTimeout(() => { loadPhoto(currentPhoto); img.style.opacity = '1'; }, 200);
}

function loadPhoto(index) {
  document.getElementById('lb-img').src = lightboxPhotos[index].src;
  document.getElementById('lb-caption').textContent = (index + 1) + ' / ' + lightboxPhotos.length;
}

function lbKeyHandler(e) {
  if (e.key === 'ArrowRight') moveLightbox(1);
  if (e.key === 'ArrowLeft')  moveLightbox(-1);
  if (e.key === 'Escape')     closeLightbox();
}

/* ── 6. Pilihan Kehadiran (RSVP) ─────────────────────────── */
let selectedAttendance = 'hadir';

function selectAtt(el, val) {
  document.querySelectorAll('.att-opt').forEach(o => o.classList.remove('sel'));
  el.classList.add('sel');
  selectedAttendance = val;
}


/* ── 7. Kirim Ucapan / Wishes ────────────────────────────── */
function submitWish() {
  const name = document.getElementById('wish-name').value.trim();
  const msg  = document.getElementById('wish-msg').value.trim();

  if (!name || !msg) {
    alert('Mohon lengkapi nama dan ucapan Anda 🙏');
    return;
  }

  const attLabel =
    selectedAttendance === 'hadir' ? '✓ Hadir' :
    selectedAttendance === 'maaf'  ? '✗ Tidak Hadir' :
    '? Masih Ragu';

  const card = document.createElement('div');
  card.className = 'wish-card';
  card.innerHTML = `
    <p class="wc-name">${escHtml(name)}</p>
    <p class="wc-att">${attLabel}</p>
    <p class="wc-msg">${escHtml(msg)}</p>
  `;

  const list = document.getElementById('wish-list');
  list.insertBefore(card, list.firstChild);

  // Reset form
  document.getElementById('wish-name').value = '';
  document.getElementById('wish-msg').value  = '';
  document.querySelectorAll('.att-opt').forEach(o => o.classList.remove('sel'));
  document.querySelectorAll('.att-opt')[0].classList.add('sel');
  selectedAttendance = 'hadir';

  card.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/**
 * Escape karakter HTML untuk mencegah XSS.
 * @param {string} s - string input
 * @returns {string}
 */
function escHtml(s) {
  return s
    .replace(/&/g,  '&amp;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    .replace(/"/g,  '&quot;');
}


/* ── 8. Salin Nomor Rekening ─────────────────────────────── */
function copyText(num, bank) {
  navigator.clipboard.writeText(num)
    .then(()  => alert(`Nomor rekening ${bank} berhasil disalin ✦`))
    .catch(()  => alert(`${bank}: ${num}`));
}
