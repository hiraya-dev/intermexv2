// modal-prefetch.js
// Modal functionality with prefetching capabilities

export function initModalAndPrefetch() {
  // Global load (optional — if you want to load 'list' manually on first load)
  window.FinsweetAttributes = window.FinsweetAttributes || [];
  window.onload = function () {
    console.log('Window has loaded!');
    window.FinsweetAttributes.load('list');
  };

  // Step 1: Modal & AJAX Setup
  const countryElements = document.querySelectorAll('.home-send_country');
  const regionBlocks = document.querySelectorAll('[data-region-block]');
  const modal = document.querySelector('.section_modal');
  const modalWrapper = document.querySelector('.modal_wrapper');
  const modalClose = document.querySelector('.modal-close');
  const sectionSelector = '.section_region';

  const prefetchedPages = new Map(); // cache for prefetched HTML

  // Step 2: Prefetch URLs during idle time
  document.addEventListener('DOMContentLoaded', function () {
    const buttons = document.querySelectorAll('.home-send_country-btn');

    const prefetch = (url) => {
      if (!url || prefetchedPages.has(url)) return;

      fetch(url, { cache: 'force-cache' })
        .then(res => res.text())
        .then(html => {
          prefetchedPages.set(url, html);
          console.log('[Prefetch] Stored:', url);
        })
        .catch(err => {
          console.warn('[Prefetch] Failed:', url, err);
        });
    };

    const queuePrefetch = () => {
      buttons.forEach((button, index) => {
        const url = button.getAttribute('data-url');
        if (!url) return;
        setTimeout(() => prefetch(url), index * 150); // staggered prefetching
      });
    };

    if ('requestIdleCallback' in window) {
      requestIdleCallback(queuePrefetch, { timeout: 2000 });
    } else {
      setTimeout(queuePrefetch, 2000);
    }
  });

  // Step 3: Handle active states and modal AJAX
  countryElements.forEach((country) => {
    const buttonEl = country.querySelector('.home-send_country-btn');

    country.addEventListener('mouseenter', () => {
      const selectedRegion = country.getAttribute('data-region');
    
      // Skip if this country is already active — avoid reset
      if (country.classList.contains('is-active')) return;
    
      // Remove active states from all countries
      countryElements.forEach(c => {
        c.classList.remove('is-active');
        const title = c.querySelector('.home-send-card-title');
        if (title) gsap.to(title, { scale: 1, duration: 0.3, ease: 'power2.out' });
      });
    
      // Remove all region block actives
      regionBlocks.forEach(block => block.classList.remove('is-active'));
    
      // Activate selected country and region
      country.classList.add('is-active');
    
      regionBlocks.forEach((block) => {
        const isMatch = block.getAttribute('data-region-block') === selectedRegion;
        block.classList.toggle('is-active', isMatch);
      });
    
      const title = country.querySelector('.home-send-card-title');
      if (title) gsap.to(title, { scale: 1.2, duration: 0.3, ease: 'power2.out' });
    });

    // Load AJAX content + open modal
    if (buttonEl) {
      buttonEl.addEventListener('click', async (e) => {
        e.stopPropagation();
        if (!modal || !modalWrapper) return;

        const url = buttonEl.getAttribute('data-url');
        if (!url) return;

        // Step 4: Show modal shell and overlay loader
        gsap.set(modalWrapper, { y: '100%', opacity: 0 });
        modalWrapper.innerHTML = '';

        const loaderOverlay = document.createElement('div');
        loaderOverlay.className = 'modal-loader-overlay';
        loaderOverlay.innerHTML = '<div class="loader"></div>';
        modal.appendChild(loaderOverlay);

        gsap.fromTo(modal, { autoAlpha: 0, display: 'block' }, {
          autoAlpha: 1,
          duration: 0.2
        });

        try {
          const html = prefetchedPages.get(url) || await (await fetch(url)).text();
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = html;

          const section = tempDiv.querySelector(sectionSelector);
          if (section) {
            modalWrapper.appendChild(section);

            if (window.FinsweetAttributes?.modules?.list) {
              window.FinsweetAttributes.modules.list.restart();
              console.log('✅ Modal list restarted!');
            } else {
              window.FinsweetAttributes.load('list');
              console.log('✅ Modal list loaded for the first time!');
            }

            // ✅ Generate hrefs for partner buttons
            section.querySelectorAll('.region-partners_list .btn').forEach(function (btn) {
              const item = btn.closest('.region-partners_item');
              if (!item) return;

              const partnerHeading = item.querySelector('.region-partner-heading');
              const countryEl = item.querySelector('[data-country-name]');

              const partnerName = partnerHeading?.getAttribute('data-partner-name');
              const country = countryEl?.getAttribute('data-country-name');

              if (partnerName && country) {
                const message = `Hi Lola, can you help me send money to ${partnerName} in ${country}?`;
                const encodedMessage = encodeURIComponent(message);
                btn.setAttribute('href', `/redirect?message=${encodedMessage}`);
              }
            });

            gsap.to(modalWrapper, {
              y: '0%',
              opacity: 1,
              duration: 0.4,
              ease: 'power3.out'
            });
          } else {
            modalWrapper.innerHTML = '<p>Content section not found.</p>';
          }
        } catch (err) {
          console.error('Failed to load modal content:', err);
          modalWrapper.innerHTML = '<p>Error loading content.</p>';
        }

        // Remove loader
        const loader = document.querySelector('.modal-loader-overlay');
        if (loader) {
          gsap.to(loader, {
            opacity: 0,
            duration: 0.2,
            onComplete: () => loader.remove()
          });
        }
      });
    }
  });

  // Step 5: Modal close
  if (modalClose && modal) {
    modalClose.addEventListener('click', () => {
      gsap.to(modalWrapper, {
        y: '100%',
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in'
      });

      gsap.to(modal, {
        autoAlpha: 0,
        duration: 0.3,
        delay: 0.2,
        onComplete: () => {
          modal.style.display = 'none';
          modalWrapper.innerHTML = '';
          gsap.set(modalWrapper, { clearProps: 'all' });
        }
      });
    });
  }
}