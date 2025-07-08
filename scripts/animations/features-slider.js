export function initHomeFeaturesSlider() {
    gsap.matchMedia().add('(max-width: 767px)', () => {
      document.querySelectorAll('.home-features_slider-component').forEach(function (component) {
        const swiperEl = component.querySelector('.swiper');
        const paginationEl = component.querySelector('.swiper-bullet-wrapper');
  
        new Swiper(swiperEl, {
          speed: 300,
          loop: true,
          autoHeight: true,
          centeredSlides: false,
          followFinger: true,
          freeMode: false,
          slideToClickedSlide: false,
          slidesPerView: 1,
          spaceBetween: '4%',
          rewind: false,
          mousewheel: {
            forceToAxis: true
          },
          keyboard: {
            enabled: true,
            onlyInViewport: true
          },
          pagination: {
            el: paginationEl,
            bulletActiveClass: 'is-active',
            bulletClass: 'swiper-bullet',
            bulletElement: 'button',
            clickable: true
          }
        });
      });
    });
  }