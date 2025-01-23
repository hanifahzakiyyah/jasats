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





const banners = document.querySelectorAll('.banner');

banners.forEach((banner) => {
  const slider = banner.querySelector('.slider');
  const quantity = parseInt(getComputedStyle(slider).getPropertyValue('--quantity'));
  let currentRotation = 0;

  const prevButton = banner.querySelector('.control-prev');
  const nextButton = banner.querySelector('.control-next');
  const popup = banner.querySelector('.popup');
  const popupImage = banner.querySelector('.popup-image');
  const closePopup = banner.querySelector('.popup-close');
  const items = banner.querySelectorAll('.item');

  // Update rotation
  function updateRotation() {
    slider.style.transform = `perspective(1000px) rotateX(-10deg) rotateY(${currentRotation}deg)`;
  }

  // Event listener for navigation
  prevButton.addEventListener('click', () => {
    currentRotation += 360 / quantity;
    updateRotation();
  });

  nextButton.addEventListener('click', () => {
    currentRotation -= 360 / quantity;
    updateRotation();
  });

  // Event listener for items
  items.forEach((item) => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      popupImage.src = img.src;
      popup.style.display = 'block';
    });
  });

  // Event listener for closing popup
  closePopup.addEventListener('click', () => {
    popup.style.display = 'none';
  });

  // Swipe functionality
  let startX;

  banner.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
  }, { passive: false });

  banner.addEventListener('touchmove', (e) => {
    const moveX = e.touches[0].clientX;
    const diff = startX - moveX;

    if (Math.abs(diff) > 10) {
      e.preventDefault();
    }
  }, { passive: false });

  banner.addEventListener('touchend', (e) => {
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextButton.click();
      } else {
        prevButton.click();
      }
    }
  }, { passive: false });
});
