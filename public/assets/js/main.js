

(function() {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.addEventListener('click', mobileNavToogle);
  }

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Navmenu Scrollspy
   */
  let navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    })
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);

})();











/////CUSTOM
//afterLogin

document.addEventListener('DOMContentLoaded', () => {
  const button = document.getElementById('manivestBtn');
  
  button.addEventListener('click', () => {
      document.body.classList.add('afterLogin');
      button.classList.add("hidden");
      document.querySelector("header").classList.remove("hidden")
      document.querySelector(".selain3d").classList.remove("hidden")
      document.querySelector(".typing").classList.remove("hidden")

      // Kirim event custom dengan data
      const event = new CustomEvent('tombolDitekan', { detail: { tombolditekan: true } });
      window.dispatchEvent(event);
  });
});



//typing

function createLinearFunction(x1, y1, x2, y2) {
const m = (y2 - y1) / (x2 - x1); // Gradien
const c = y1 - m * x1; // Konstanta
return function (x) {
    return m * x + c; // Fungsi linear
};
}


var TxtType = function(el, toRotate, period) {
  this.toRotate = toRotate;
  this.el = el;
  this.loopNum = 0;
  this.period = parseInt(period, 10) || 2000;
  this.txt = '';
  this.isDeleting = false;
  this.scrollHandler = this.handleScroll.bind(this);
  window.addEventListener('scroll', this.scrollHandler);
};

TxtType.prototype.handleScroll = function() {
  const bodyHeight = document.body.scrollHeight;
  const scrollPosition = window.scrollY + window.innerHeight;
  const scrollPercent = (scrollPosition / bodyHeight) * 100;

  if (scrollPercent >= 1 && scrollPercent < 50) {
      this.updateText(Math.floor((scrollPercent - 25) / 25 * this.toRotate[0].length));
  } else if (scrollPercent >= 50) {
      this.txt = this.toRotate[0]; // Tampilkan teks penuh
      this.el.innerHTML = '<span class="wrap">' + this.txt + '</span>';
  } else {
      this.txt = ''; // Kosongkan teks jika scroll di bawah 0%
      this.el.innerHTML = '<span class="wrap">' + this.txt + '</span>';
  }

  const calculateY = createLinearFunction(60, 65, 75, -10);

  const typingElement = document.querySelector(".typing");
  if (scrollPercent >= 60 && scrollPercent <= 75) {
    // Persamaan linear: y = -13/3 * scrollPercent + 325
    const newYPosition = calculateY(scrollPercent)
    typingElement.style.top = `${newYPosition}vh`;  
    typingElement.style.opacity = 1
    // console.log(`scroll = ${scrollPercent} posisi y = ${newYPosition || 'fixed at 65vh'}`);
  } else if (scrollPercent > 75) {
      typingElement.style.top = '0vh'; // Setelah scroll 75%
      typingElement.style.opacity = 0
  } else {
      typingElement.style.top = '65vh'; // Sebelum scroll 60%
  }

};

TxtType.prototype.updateText = function(length) {
  this.txt = this.toRotate[0].substring(0, length);
  this.el.innerHTML = '<span class="wrap">' + this.txt + '</span>';
};

window.onload = function() {
  var elements = document.getElementsByClassName('typewrite');
  for (var i = 0; i < elements.length; i++) {
      var toRotate = elements[i].getAttribute('data-type');
      var period = elements[i].getAttribute('data-period');
      if (toRotate) {
          new TxtType(elements[i], JSON.parse(toRotate), period);
      }
  }
  var css = document.createElement("style");
  css.type = "text/css";
  css.innerHTML = ".typewrite > .wrap { border-right: 0.08em solid #fff}";
  document.body.appendChild(css);
};





//banner
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

// Function to close popup
function closePopupHandler() {
  popup.classList.add('closing'); // Tambahkan kelas untuk memicu animasi close

  // Tunggu sampai animasi selesai sebelum menyembunyikan elemen
  popup.addEventListener('animationend', () => {
      popup.style.display = 'none'; // Sembunyikan popup setelah animasi selesai
      popup.classList.remove('closing'); // Hapus kelas closing untuk penggunaan berikutnya
      document.body.style.overflow = ''; // Re-enable scrolling
  }, { once: true }); // Pastikan listener hanya dipanggil sekali
}


// Event listener for items
items.forEach((item) => {
  item.addEventListener('click', () => {
    const img = item.querySelector('img');
    popupImage.src = img.src;
    popup.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Disable scrolling
  });
});

// Event listener for closing popup (close button)
closePopup.addEventListener('click', closePopupHandler);

// Close popup if user clicks outside the popup content
popup.addEventListener('click', (e) => {
  if (e.target === popup) {
    closePopupHandler();
  }
});

// Close popup on scroll
window.addEventListener('scroll', () => {
  if (popup.style.display === 'block') {
    closePopupHandler();
  }
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
