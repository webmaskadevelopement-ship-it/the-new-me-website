/**
 * The New Me - Mobile Responsiveness Scripts
 * Handles: hamburger menu, mobile drawer, scroll lock, sticky header shadow
 */

(function () {
  'use strict';

  // --- DOM references ---
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerBackdrop = document.getElementById('drawerBackdrop');
  const drawerClose = document.getElementById('drawerClose');
  const header = document.querySelector('.header');

  // --- Mobile Drawer Initialization ---
  if (hamburgerBtn && mobileDrawer && drawerBackdrop && drawerClose) {
    let scrollPosition = 0;

    // Drawer open/close
    function openDrawer() {
      scrollPosition = window.pageYOffset;
      mobileDrawer.classList.add('open');
      drawerBackdrop.classList.add('open');
      hamburgerBtn.classList.add('active');
      hamburgerBtn.setAttribute('aria-expanded', 'true');
      
      // Lock body scroll
      document.body.classList.add('drawer-open');
      document.body.style.top = `-${scrollPosition}px`;
    }

    function closeDrawer() {
      mobileDrawer.classList.remove('open');
      drawerBackdrop.classList.remove('open');
      hamburgerBtn.classList.remove('active');
      hamburgerBtn.setAttribute('aria-expanded', 'false');
      
      // Restore body scroll
      document.body.classList.remove('drawer-open');
      document.body.style.top = '';
      window.scrollTo(0, scrollPosition);
    }

    // Event listeners
    hamburgerBtn.addEventListener('click', function () {
      if (mobileDrawer.classList.contains('open')) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });

    drawerClose.addEventListener('click', closeDrawer);
    drawerBackdrop.addEventListener('click', closeDrawer);

    // Close drawer on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileDrawer.classList.contains('open')) {
        closeDrawer();
      }
    });

    // Close drawer when a nav link is clicked
    const drawerLinks = mobileDrawer.querySelectorAll('.drawer-link');
    drawerLinks.forEach(function (link) {
      link.addEventListener('click', closeDrawer);
    });

    // Close drawer on window resize to desktop
    let resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        if (window.innerWidth > 768 && mobileDrawer.classList.contains('open')) {
          closeDrawer();
        }
      }, 150);
    });
  }

  // --- Sticky header shadow on scroll ---
  if (header) {
    let ticking = false;
    function updateHeaderShadow() {
      if (window.pageYOffset > 10) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(updateHeaderShadow);
        ticking = true;
      }
    }, { passive: true });

    // Initial check on load
    updateHeaderShadow();
  }

  // --- Video Modal Logic ---
  const modal = document.getElementById('video-modal');
  const modalClose = document.getElementById('modal-close');
  const videoContainer = document.getElementById('modal-video-container');
  const openButtons = document.querySelectorAll('.js-open-video');

  function openModal(url, type) {
    if (!modal) return;
    videoContainer.innerHTML = ''; // clear previous
    
    // Auto-configure YouTube embeds to enable autoplay
    let finalUrl = url;
    if (url.includes('youtube.com')) {
      finalUrl += (url.includes('?') ? '&' : '?') + 'autoplay=1';
    }
    
    const iframe = document.createElement('iframe');
    iframe.src = finalUrl;
    iframe.allowFullscreen = true;
    iframe.allow = "autoplay; encrypted-media; picture-in-picture";
    videoContainer.appendChild(iframe);
    
    // Set the modal class based on type (vertical or horizontal)
    const modalContent = modal.querySelector('.modal-content');
    modalContent.className = 'modal-content'; // reset
    if (type) modalContent.classList.add(`type-${type}`);
    else modalContent.classList.add('type-horizontal'); // default fallback
    
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // lock scroll
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.add('hidden');
    document.body.style.overflow = ''; // restore scroll
    
    // wipe iframe slightly after fade to prevent visual pop
    setTimeout(() => {
      videoContainer.innerHTML = '';
    }, 300);
  }

  if (modal && modalClose) {
    openButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const url = btn.getAttribute('data-url');
        const type = btn.getAttribute('data-type');
        if (url) openModal(url, type);
      });
    });

    modalClose.addEventListener('click', closeModal);
    
    // Close on backdrop click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
    
    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        closeModal();
      }
    });
  }

  // --- Search Overlay Logic ---
  const searchOverlay = document.getElementById('searchOverlay');
  const searchClose = document.getElementById('searchClose');
  const searchInputDesktop = document.getElementById('searchInputDesktop');
  const openSearchBtns = document.querySelectorAll('.js-open-search');

  if (searchOverlay) {
    function openSearch() {
      searchOverlay.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        if (searchInputDesktop) searchInputDesktop.focus();
      }, 100);
    }

    function closeSearch() {
      searchOverlay.classList.add('hidden');
      document.body.style.overflow = '';
    }

    openSearchBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openSearch();
      });
    });

    if (searchClose) searchClose.addEventListener('click', closeSearch);

    searchOverlay.addEventListener('click', (e) => {
      if (e.target === searchOverlay) closeSearch();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !searchOverlay.classList.contains('hidden')) {
        closeSearch();
      }
    });
  }

  // ==========================================
  // MASTER ANIMATION ENGINE
  // ==========================================

  // 1. Scroll Progress Bar
  let progressBar = document.getElementById('scrollProgressBar');
  if (!progressBar) {
    progressBar = document.createElement('div');
    progressBar.id = 'scrollProgressBar';
    progressBar.className = 'scroll-progress-bar';
    document.body.appendChild(progressBar);
  }

  function updateScrollProgress() {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
    if (progressBar) progressBar.style.width = scrolled + '%';
  }

  window.addEventListener('scroll', updateScrollProgress, { passive: true });

  // 2. IntersectionObserver for Scroll Reveal
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -40px 0px',
    threshold: 0.08
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, observerOptions);

  function initScrollAnimations() {
    // Select elements to auto-reveal across all pages
    const targetSelectors = [
      '.section-title',
      '.section-eyebrow',
      '.section-subtitle',
      '.quote-text',
      '.quote-dark-text',
      '.blog-card',
      '.feature-col',
      '.value-card',
      '.value-card-premium',
      '.mv-card-mission',
      '.mv-card-vision',
      '.about-inner',
      '.brand-story-inner',
      '.faq-card',
      '.contact-card',
      '.newsletter-inner',
      '.book-promo-inner',
      '.author-card-frame',
      '.featured-in',
      '.hero-glass-card',
      '.hero-book-showcase',
      '.video-thumb'
    ];

    targetSelectors.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((el, index) => {
        if (
          !el.classList.contains('reveal') &&
          !el.classList.contains('reveal-up') &&
          !el.classList.contains('reveal-scale') &&
          !el.classList.contains('reveal-left') &&
          !el.classList.contains('reveal-right')
        ) {
          el.classList.add('reveal');
        }

        // Apply staggered delay if inside a grid
        const parent = el.parentElement;
        if (
          parent &&
          (parent.classList.contains('values-grid') ||
            parent.classList.contains('blog-grid') ||
            parent.classList.contains('mv-grid') ||
            parent.classList.contains('feature-grid') ||
            parent.classList.contains('faq-grid') ||
            parent.classList.contains('story-grid-desktop'))
        ) {
          const delayIndex = (index % 4) + 1;
          if (!el.classList.contains('reveal-d1') && !el.classList.contains('reveal-d2') && !el.classList.contains('reveal-d3') && !el.classList.contains('reveal-d4')) {
            el.classList.add(`reveal-d${delayIndex}`);
          }
        }
      });
    });

    // Observe all reveal targets
    const allReveals = document.querySelectorAll('.reveal, .reveal-up, .reveal-scale, .reveal-left, .reveal-right');
    allReveals.forEach((el) => {
      revealObserver.observe(el);
    });
  }

  // Initialize on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollAnimations);
  } else {
    initScrollAnimations();
  }

  // --- Mobile story slider: JS-dragged track -------------------------------
  // The strip must NOT be a native overflow-x scroller. Horizontal native
  // scrollers axis-lock fast vertical flicks that start on them, so a phone
  // user swiping up with a finger over this strip would see the page stop
  // scrolling ("dead" swipe). Instead: the container clips, `touch-action:
  // pan-y` (set in CSS) hands vertical pans straight to the page, and
  // horizontal pans drag a translated inner track.
  function initStorySliderDrag() {
    const slider = document.querySelector('.story-slider-mobile');
    if (!slider || slider.dataset.dragInit) return;
    slider.dataset.dragInit = '1';
    if (typeof slider.setPointerCapture !== 'function') return;

    // Wrap the existing thumbs in a movable track (no markup change needed).
    const track = document.createElement('div');
    track.className = 'story-slider-track';
    while (slider.firstChild) track.appendChild(slider.firstChild);
    slider.appendChild(track);

    let startX = 0;
    let startOffset = 0;
    let offset = 0;
    let maxOffset = 0;
    let step = 1;
    let dragging = false;
    let moved = 0;

    const clamp = (v) => Math.max(0, Math.min(maxOffset, v));
    const apply = () => { track.style.transform = `translateX(${-offset}px)`; };

    function measure() {
      maxOffset = Math.max(0, track.scrollWidth - slider.clientWidth);
      const cards = track.children;
      if (cards.length >= 2) {
        step = cards[1].getBoundingClientRect().left - cards[0].getBoundingClientRect().left;
      } else if (cards.length === 1) {
        step = cards[0].getBoundingClientRect().width;
      }
      offset = clamp(offset);
      apply();
    }
    measure();
    window.addEventListener('resize', measure, { passive: true });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);

    slider.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'mouse') return; // desktop pointers keep native behavior
      dragging = true;
      moved = 0;
      startX = e.clientX;
      startOffset = offset;
      track.classList.remove('is-settling');
      try { slider.setPointerCapture(e.pointerId); } catch (err) { /* released anyway */ }
    });

    slider.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      moved = Math.max(moved, Math.abs(dx));
      offset = clamp(startOffset - dx);
      apply();
    });

    function release() {
      if (!dragging) return;
      dragging = false;
      // Settle onto the nearest card edge (replaces the old scroll-snap feel).
      const idx = Math.round(offset / Math.max(1, step));
      offset = clamp(idx * step);
      track.classList.add('is-settling');
      apply();
    }
    slider.addEventListener('pointerup', release);
    slider.addEventListener('pointercancel', release);

    // A drag is not a tap: swallow the video-modal click after real movement.
    slider.addEventListener('click', (e) => {
      if (moved > 8) {
        e.preventDefault();
        e.stopPropagation();
      }
    }, true);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initStorySliderDrag);
  } else {
    initStorySliderDrag();
  }

})();

