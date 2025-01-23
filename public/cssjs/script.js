//afterLogin

document.addEventListener('DOMContentLoaded', () => {
    console.log("loaded")
    const button = document.getElementById('manivestBtn');
    
    button.addEventListener('click', () => {
        console.log("add")
        document.body.classList.add('afterLogin');
        button.classList.add("hidden");
        document.querySelector("header").classList.remove("hidden")
        document.querySelector(".selain3d").classList.remove("hidden")

        // Kirim event custom dengan data
        const event = new CustomEvent('tombolDitekan', { detail: { tombolditekan: true } });
        window.dispatchEvent(event);
    });
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

