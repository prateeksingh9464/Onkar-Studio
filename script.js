document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('header');
  const navMenu = document.getElementById('nav-menu');
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.querySelectorAll('.nav-link');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');
  const reviewsTrack = document.getElementById('reviews-track');
  const reviewCards = document.querySelectorAll('.review-card');
  const prevReviewBtn = document.getElementById('prev-review');
  const nextReviewBtn = document.getElementById('next-review');
  const carouselCounter = document.getElementById('carousel-counter');
  const shopStatusEl = document.getElementById('shop-status');
  const imageModal = document.getElementById('image-modal');
  const modalImg = document.getElementById('modal-img');
  const modalClose = document.getElementById('modal-close');
  const modalPrev = document.getElementById('modal-prev');
  const modalNext = document.getElementById('modal-next');
  
  let currentReviewIndex = 0;
  let currentGalleryIndex = 0;
  let activeGalleryItems = [];

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    let current = '';
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      if (window.scrollY >= sectionTop - 120) {
        current = section.getAttribute('id') || '';
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href').substring(1);
      if (href === current || (href === '' && current === '')) {
        link.classList.add('active');
      }
    });
  });

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filterValue = btn.getAttribute('data-filter');

      portfolioItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        if (filterValue === 'all' || itemCategory === filterValue) {
          item.style.display = 'block';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.8)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  function updateReviewSlider() {
    reviewsTrack.style.transform = `translateX(-${currentReviewIndex * 100}%)`;
    if (carouselCounter) {
      carouselCounter.textContent = `0${currentReviewIndex + 1} / 0${reviewCards.length}`;
    }
  }

  prevReviewBtn.addEventListener('click', () => {
    if (currentReviewIndex > 0) {
      currentReviewIndex--;
    } else {
      currentReviewIndex = reviewCards.length - 1;
    }
    updateReviewSlider();
  });

  nextReviewBtn.addEventListener('click', () => {
    if (currentReviewIndex < reviewCards.length - 1) {
      currentReviewIndex++;
    } else {
      currentReviewIndex = 0;
    }
    updateReviewSlider();
  });

  function getActivePortfolioItems() {
    const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
    return Array.from(portfolioItems).filter(item => {
      const category = item.getAttribute('data-category');
      return activeFilter === 'all' || category === activeFilter;
    });
  }

  function openLightbox(index) {
    activeGalleryItems = getActivePortfolioItems();
    if (index < 0) index = activeGalleryItems.length - 1;
    if (index >= activeGalleryItems.length) index = 0;

    currentGalleryIndex = index;
    const item = activeGalleryItems[currentGalleryIndex];
    const img = item.querySelector('img');
    const title = item.querySelector('.portfolio-title').textContent;
    const category = item.querySelector('.portfolio-cat').textContent;

    if (img) {
      modalImg.src = img.src.replace('&w=600', '&w=1200');
      document.getElementById('modal-caption-title').textContent = title;
      document.getElementById('modal-caption-category').textContent = category;
      imageModal.classList.add('active');
    }
  }

  portfolioItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      activeGalleryItems = getActivePortfolioItems();
      const activeIndex = activeGalleryItems.indexOf(item);
      if (activeIndex !== -1) {
        openLightbox(activeIndex);
      }
    });
  });

  modalPrev.addEventListener('click', (e) => {
    e.stopPropagation();
    openLightbox(currentGalleryIndex - 1);
  });

  modalNext.addEventListener('click', (e) => {
    e.stopPropagation();
    openLightbox(currentGalleryIndex + 1);
  });

  document.addEventListener('keydown', (e) => {
    if (!imageModal.classList.contains('active')) return;
    if (e.key === 'ArrowLeft') {
      openLightbox(currentGalleryIndex - 1);
    } else if (e.key === 'ArrowRight') {
      openLightbox(currentGalleryIndex + 1);
    } else if (e.key === 'Escape') {
      imageModal.classList.remove('active');
    }
  });

  modalClose.addEventListener('click', () => {
    imageModal.classList.remove('active');
  });

  imageModal.addEventListener('click', (e) => {
    if (e.target === imageModal || e.target.classList.contains('modal-content')) {
      imageModal.classList.remove('active');
    }
  });

  function checkShopStatus() {
    const now = new Date();
    const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
    const istTime = new Date(utcTime + (3600000 * 5.5));
    
    const currentDay = istTime.getDay();
    const currentHour = istTime.getHours();
    const currentMinute = istTime.getMinutes();
    const currentTime = currentHour * 60 + currentMinute;

    let isOpen = false;
    let statusText = '';

    if (currentDay >= 1 && currentDay <= 6) {
      const openTime = 9 * 60;
      const closeTime = 20 * 60;
      if (currentTime >= openTime && currentTime < closeTime) {
        isOpen = true;
        statusText = 'Open Now (Closes at 8:00 PM)';
      } else {
        statusText = 'Closed Now (Opens at 9:00 AM)';
      }
    } else if (currentDay === 0) {
      const openTime = 12 * 60;
      const closeTime = 18 * 60;
      if (currentTime >= openTime && currentTime < closeTime) {
        isOpen = true;
        statusText = 'Open Now (Closes at 6:00 PM)';
      } else {
        statusText = 'Closed Now (Opens Monday at 9:00 AM)';
      }
    }

    if (isOpen) {
      shopStatusEl.className = 'status-badge open';
      shopStatusEl.innerHTML = `<span class="status-dot"></span>${statusText}`;
    } else {
      shopStatusEl.className = 'status-badge closed';
      shopStatusEl.innerHTML = `<span class="status-dot"></span>${statusText}`;
    }
  }

  checkShopStatus();
  setInterval(checkShopStatus, 60000);

  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    const formResult = document.getElementById('form-result');
    const submitBtn = document.getElementById('form-submit-btn');
    const btnSpinner = submitBtn.querySelector('.btn-spinner');

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      formResult.classList.remove('active', 'success', 'error');
      submitBtn.disabled = true;
      btnSpinner.style.display = 'inline-block';

      const formData = new FormData(contactForm);

      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Accept': 'application/json'
          },
          body: formData
        });

        const data = await response.json();

        if (response.ok && data.success) {
          formResult.className = 'form-result active success';
          formResult.textContent = data.message || 'Your message has been sent successfully!';
          contactForm.reset();
        } else {
          formResult.className = 'form-result active error';
          formResult.textContent = data.message || 'Something went wrong. Please check your credentials and try again.';
        }
      } catch (error) {
        console.error('Submission error:', error);
        formResult.className = 'form-result active error';
        formResult.textContent = 'A connection error occurred. Please verify your internet and try again.';
      } finally {
        submitBtn.disabled = false;
        btnSpinner.style.display = 'none';
      }
    });
  }

  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');

  if (themeToggle && themeIcon) {
    const getThemeChoice = () => localStorage.getItem('theme') || 'light';

    const setTheme = (choice) => {
      localStorage.setItem('theme', choice);
      document.documentElement.setAttribute('data-theme', choice);

      if (choice === 'dark') {
        themeIcon.className = 'fas fa-sun';
      } else {
        themeIcon.className = 'fas fa-moon';
      }
    };

    themeToggle.addEventListener('click', () => {
      const currentTheme = getThemeChoice();
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      setTheme(nextTheme);
    });

    setTheme(getThemeChoice());
  }
});
