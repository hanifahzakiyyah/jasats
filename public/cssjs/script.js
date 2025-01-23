//swiperjs
var swiper = new Swiper("#swiperPertama", {
  effect: "coverflow",
  grabCursor: true,
  centeredSlides: true,
  slidesPerView: "auto",
  coverflowEffect: {
    rotate: 50,
    stretch: 0,
    depth: 100,
    modifier: 1,
    slideShadows: true,
  },
  pagination: {
    el: ".swiper-pagination",
  },
});

var swiper1 = new Swiper("#swiperKedua", {
  effect: "cards",
  grabCursor: true,
});

const slider = document.querySelector('.slider');
const quantity = parseInt(getComputedStyle(slider).getPropertyValue('--quantity'));
let currentRotation = 0;

document.getElementById('prev').addEventListener('click', () => {
    currentRotation += 360 / quantity;
    updateRotation();
});

document.getElementById('next').addEventListener('click', () => {
    currentRotation -= 360 / quantity;
    updateRotation();
});

function updateRotation() {
    slider.style.transform = `perspective(1000px) rotateX(-10deg) rotateY(${currentRotation}deg)`;
}

const items = document.querySelectorAll('.slider .item');
const popup = document.getElementById('popup');
const popupImage = document.getElementById('popupImage');
const closePopup = document.getElementById('closePopup');

items.forEach(item => {
    item.addEventListener('click', () => {
        const img = item.querySelector('img');
        popupImage.src = img.src;
        popup.style.display = 'block';
    });
});

closePopup.addEventListener('click', () => {
    popup.style.display = 'none';
});



//swipe
// let startX;
// let currentX;
// let isSwiping = false;

// const banner = document.querySelector('.banner');

// // Menangkap posisi awal saat sentuhan dimulai
// banner.addEventListener('touchstart', (e) => {
//     startX = e.touches[0].clientX;
//     isSwiping = true;
// });

// // Melacak pergerakan jari saat menyentuh layar
// banner.addEventListener('touchmove', (e) => {
//     if (!isSwiping) return;

//     currentX = e.touches[0].clientX;
//     const diff = currentX - startX;

//     // Perbarui rotasi sementara sesuai pergerakan jari
//     const rotationChange = (diff / window.innerWidth) * 360;
//     slider.style.transform = `perspective(1000px) rotateX(-10deg) rotateY(${currentRotation - rotationChange}deg)`;
// });

// // Menyelesaikan swipe saat sentuhan dilepaskan
// banner.addEventListener('touchend', (e) => {
//     isSwiping = false;
//     const endX = e.changedTouches[0].clientX;
//     const diff = startX - endX;

//     // Tentukan arah swipe berdasarkan ambang batas
//     if (Math.abs(diff) > 50) {
//         const rotationStep = 360 / quantity;
//         if (diff > 0) {
//             // Swipe kiri
//             currentRotation -= rotationStep;
//         } else {
//             // Swipe kanan
//             currentRotation += rotationStep;
//         }
//     }

//     // Perbarui rotasi final
//     updateRotation();
// });







let startX;

const banner = document.querySelector('.banner');

// Event listener untuk touchstart
banner.addEventListener('touchstart', (e) => {
    // Menyimpan posisi sentuhan awal
    startX = e.touches[0].clientX;
}, { passive: false });

// Event listener untuk touchmove
banner.addEventListener('touchmove', (e) => {
    const moveX = e.touches[0].clientX;
    const diff = startX - moveX;

    // Ambang batas untuk mendeteksi swipe horizontal
    if (Math.abs(diff) > 10) {
        e.preventDefault(); // Mencegah navigasi default saat gesture horizontal terdeteksi
    }
}, { passive: false });

// Event listener untuk touchend
banner.addEventListener('touchend', (e) => {
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;

    // Ambang batas 50px untuk mendeteksi swipe
    if (Math.abs(diff) > 50) {
        if (diff > 0) {
            // Swipe kiri, jalankan tombol Next
            document.getElementById('next').click();
        } else {
            // Swipe kanan, jalankan tombol Prev
            document.getElementById('prev').click();
        }
    }
}, { passive: false });

