// bento-marquee.js
// Marquee animation functionality for bento components

export function initBentoMarquee() {
    const mm = gsap.matchMedia();
  
    mm.add("(min-width: 992px)", () => {
      const marqueeTracks = document.querySelectorAll('.steps-marquee_track');
  
      marqueeTracks.forEach(track => {
        // Remove previously cloned lists (keep only the first)
        const lists = track.querySelectorAll('.steps-marquee_list');
        lists.forEach((list, index) => {
          if (index > 0) list.remove();
        });
  
        const firstList = track.querySelector('.steps-marquee_list');
        if (!firstList) return;
  
        const clone = firstList.cloneNode(true);
        track.appendChild(clone);
  
        // Recalculate total height
        const updatedLists = track.querySelectorAll('.steps-marquee_list');
        let totalHeight = 0;
        updatedLists.forEach(list => {
          totalHeight += list.offsetHeight;
        });
  
        track.style.setProperty('--marquee-height', `${totalHeight}px`);
        const duration = totalHeight / 50;
        track.style.animationDuration = `${duration}s`;
  
        // Add pause on hover functionality
        const handleMouseEnter = () => {
          track.style.animationPlayState = 'paused';
        };
  
        const handleMouseLeave = () => {
          track.style.animationPlayState = 'running';
        };
  
        // Add event listeners
        track.addEventListener('mouseenter', handleMouseEnter);
        track.addEventListener('mouseleave', handleMouseLeave);
  
        // Store event handlers for cleanup
        track._hoverHandlers = {
          mouseenter: handleMouseEnter,
          mouseleave: handleMouseLeave
        };
      });
  
      // Cleanup on resize below 992px
      return () => {
        const marqueeTracks = document.querySelectorAll('.steps-marquee_track');
        marqueeTracks.forEach(track => {
          const lists = track.querySelectorAll('.steps-marquee_list');
          lists.forEach((list, index) => {
            if (index > 0) list.remove();
          });
  
          // Remove hover event listeners
          if (track._hoverHandlers) {
            track.removeEventListener('mouseenter', track._hoverHandlers.mouseenter);
            track.removeEventListener('mouseleave', track._hoverHandlers.mouseleave);
            delete track._hoverHandlers;
          }
  
          track.style.removeProperty('--marquee-height');
          track.style.removeProperty('animation-duration');
          track.style.removeProperty('animation-play-state');
        });
      };
    });
  }