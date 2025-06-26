// bento-features.js
// Bento grid features animation with advanced state management

export function initBentoFeaturesAnimation() {
    // Animation State Manager - moved inside function for proper scoping
    class BentoAnimationState {
      constructor() {
        this.columns = new Map();
        this.activeColumn = null;
        this.isGloballyAnimating = false;
        this.hoverTimeout = null;
        this.animationDurations = {
          hover: 0, // Will be calculated dynamically
          reset: 0, // Will be calculated dynamically
          collapse: 0 // Will be calculated dynamically
        };
      }
  
      // Calculate total duration of a timeline
      calculateTimelineDuration(timeline) {
        return timeline ? timeline.totalDuration() : 0;
      }
  
      // Set animation duration for tracking
      setAnimationDuration(type, duration) {
        this.animationDurations[type] = duration;
      }
  
      // Get animation duration
      getAnimationDuration(type) {
        return this.animationDurations[type] || 0;
      }
  
      // Initialize a column's state
      initColumn(columnElement) {
        if (!this.columns.has(columnElement)) {
          this.columns.set(columnElement, {
            element: columnElement,
            timeline: null,
            state: 'default', // 'default', 'hovered', 'collapsed', 'animating'
            elements: null, // cached DOM elements
            isAnimating: false
          });
        }
        return this.columns.get(columnElement);
      }
  
      // Set column state
      setColumnState(columnElement, newState) {
        const columnData = this.columns.get(columnElement);
        if (columnData) {
          columnData.state = newState;
          columnData.isAnimating = newState === 'animating';
          columnElement.dataset.bentoState = newState; // For CSS styling/debugging
        }
      }
  
      // Get column state
      getColumnState(columnElement) {
        const columnData = this.columns.get(columnElement);
        return columnData ? columnData.state : null;
      }
  
      // Check if any animation is running
      isAnyAnimating() {
        return this.isGloballyAnimating || Array.from(this.columns.values()).some(col => col.isAnimating);
      }
  
      // Set global animation state
      setGlobalAnimating(isAnimating) {
        this.isGloballyAnimating = isAnimating;
      }
  
      // Get/Set timeline for a column
      setTimeline(columnElement, timeline) {
        const columnData = this.columns.get(columnElement);
        if (columnData) {
          // Kill existing timeline
          if (columnData.timeline) {
            columnData.timeline.kill();
          }
          columnData.timeline = timeline;
        }
      }
  
      getTimeline(columnElement) {
        const columnData = this.columns.get(columnElement);
        return columnData ? columnData.timeline : null;
      }
  
      // Cache elements for a column
      cacheElements(columnElement, elements) {
        const columnData = this.columns.get(columnElement);
        if (columnData) {
          columnData.elements = elements;
        }
      }
  
      getCachedElements(columnElement) {
        const columnData = this.columns.get(columnElement);
        return columnData ? columnData.elements : null;
      }
  
      // Clean up a column's animation
      cleanupColumn(columnElement) {
        const columnData = this.columns.get(columnElement);
        if (columnData) {
          if (columnData.timeline) {
            columnData.timeline.kill();
            columnData.timeline = null;
          }
          columnData.isAnimating = false;
          columnData.state = 'default';
          columnElement.style.pointerEvents = "auto";
          delete columnElement.dataset.bentoState;
        }
      }
  
      // Clean up all animations
      cleanupAll() {
        this.columns.forEach((columnData, columnElement) => {
          if (columnData.timeline) {
            columnData.timeline.kill();
          }
          columnElement.style.pointerEvents = "auto";
          delete columnElement.dataset.bentoState;
        });
        this.columns.clear();
        this.activeColumn = null;
        this.isGloballyAnimating = false;
        clearTimeout(this.hoverTimeout);
        this.hoverTimeout = null;
      }
    }
  
    const animationState = new BentoAnimationState();
    
    // Throttle function for performance optimization
    function throttle(func, limit) {
      let inThrottle;
      return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
          func.apply(context, args);
          inThrottle = true;
          setTimeout(() => inThrottle = false, limit);
        }
      }
    }
  
    gsap.matchMedia().add("(min-width: 992px)", () => {
      // Initialize all columns
      document.querySelectorAll(".home-features_column").forEach((column) => {
        animationState.initColumn(column);
        // Cache elements for each column
        const elements = getElements(column);
        animationState.cacheElements(column, elements);
        
        column.addEventListener("mouseenter", (e) => handleColumnEnter(e, column));
        column.addEventListener("mouseleave", handleReset);
        // Throttle mousemove to run at most every 16ms (~60fps)
        column.addEventListener("mousemove", throttle((e) => handleColumnMove(e, column), 16));
      });
    });
  
    function handleColumnEnter(e, column) {
      // Check if we're over the card wrapper specifically
      const cardWrapper = e.target.closest(".home-features-card_wrapper");
      if (cardWrapper && cardWrapper.closest(".home-features_column") === column) {
        handleHover(column);
      }
    }
  
    function handleColumnMove(e, column) {
      // Early return if we shouldn't process this event
      if (animationState.isAnyAnimating()) return;
      
      // Continuously check if we're over the card during mouse movement
      const cardWrapper = e.target.closest(".home-features-card_wrapper");
      const currentState = animationState.getColumnState(column);
      
      if (cardWrapper && cardWrapper.closest(".home-features_column") === column) {
        // We're over the card - trigger hover if not already active
        if (animationState.activeColumn !== column && currentState !== 'hovered') {
          handleHover(column);
        }
      } else {
        // We're in the column but not over the card - reset if this column was active
        if (animationState.activeColumn === column && currentState === 'hovered') {
          handleReset();
        }
      }
    }
  
    function handleHover(hoveredColumn) {
      // Prevent animations if already animating or already active
      if (animationState.isAnyAnimating() || animationState.activeColumn === hoveredColumn) {
        return;
      }
      
      clearTimeout(animationState.hoverTimeout);
  
      animationState.hoverTimeout = setTimeout(() => {
        animationState.setGlobalAnimating(true);
        animationState.activeColumn = hoveredColumn;
  
        document.querySelectorAll(".home-features_column").forEach((column) => {
          const elements = animationState.getCachedElements(column);
          
          // Clean up existing animation
          animationState.cleanupColumn(column);
          animationState.setColumnState(column, 'animating');
  
          if (column === hoveredColumn) {
            animateHover(column, elements);
          } else {
            animateCollapse(column, elements);
          }
        });
  
        // Disable pointer events on other columns during animation
        document.querySelectorAll(".home-features_column").forEach((col) => {
          if (col !== hoveredColumn) {
            col.style.pointerEvents = "none";
          }
        });
      }, 150);
    }
  
    function handleReset() {
      // Don't reset if we're in the middle of animating
      if (animationState.isAnyAnimating()) return;
      
      clearTimeout(animationState.hoverTimeout);
      
      // Use actual reset animation duration instead of fixed timeout
      const resetDuration = animationState.getAnimationDuration('reset');
      const bufferTime = Math.max(100, resetDuration * 100); // 10% buffer or 100ms minimum
      
      animationState.hoverTimeout = setTimeout(() => {
        animationState.setGlobalAnimating(true);
        
        document.querySelectorAll(".home-features_column").forEach((column) => {
          const elements = animationState.getCachedElements(column);
          
          // Clean up existing animation
          animationState.cleanupColumn(column);
          animationState.setColumnState(column, 'animating');
          
          animateReset(column, elements);
        });
    
        animationState.activeColumn = null;
      }, bufferTime);
    }
  
    function getElements(column) {
      //Small bento
      const smallBentoWrapper = column.querySelector('.home-features_small');
      const smallBentoTextWrapper = column.querySelector('.home-features-text_wrapper');
      const smallBentoHeading = column.querySelector('.feature-text-heading');
  
      //Big bento
      const bigBentoWrapper = column.querySelector('.home-features-card_wrapper');
      const bigBentoContentWrapper = column.querySelector('.home-features-card_content');
      const bigBentoContentChildren = bigBentoContentWrapper ? bigBentoContentWrapper.children : [];
      const bigBentoIcon = column.querySelector('.home-features-card_icon');
      const bigBentoIconOuter = column.querySelector('.home-features_svg-outer');
      const bigBentoIconInner = bigBentoIconOuter ? bigBentoIconOuter.querySelectorAll(".home-features_svg-inner") : [];
      const bigBentoTextWrapper = column.querySelector('.home-feature-card_text-wrapper');
      const bigBentoTextChildren = bigBentoTextWrapper ? bigBentoTextWrapper.children : [];
      const bigBentoHeading = column.querySelector('.feature-card-title');
      const bigBentoParagraphShort = column.querySelector('.feature-paragraph.is-short');
      const bigBentoParagraphLong = column.querySelector('.feature-paragraph.is-long');
      const bigBentoParagraphWrapper = column.querySelector('.feature-paragraph_wrapper');
      const bigBentoCTAWrapper = column.querySelector('.home-features_cta-component');
      const bigBentoCTAChildren = bigBentoCTAWrapper ? bigBentoCTAWrapper.children : [];
      const bigBentoCTABubble = column.querySelector('.home-features_cta-message-bubble');
      const bigBentoCTABtn = column.querySelector('.home-features_cta-component .btn')
  
      return { 
        smallBentoWrapper, 
        smallBentoTextWrapper,
        smallBentoHeading, 
        bigBentoWrapper, 
        bigBentoContentWrapper, 
        bigBentoContentChildren,
        bigBentoIcon, 
        bigBentoIconOuter, 
        bigBentoIconInner,
        bigBentoTextWrapper, 
        bigBentoTextChildren,
        bigBentoHeading, 
        bigBentoParagraphShort, 
        bigBentoParagraphLong, 
        bigBentoParagraphWrapper,
        bigBentoCTAWrapper,
        bigBentoCTAChildren,
        bigBentoCTABubble, 
        bigBentoCTABtn 
      };
    }
  
    function animateHover(column, els) {
      const tl = gsap.timeline({ 
        defaults: { ease: "power3.out", duration: 0.3 },
        onComplete: () => {
          animationState.setColumnState(column, 'hovered');
          animationState.setGlobalAnimating(false);
        }
      });
      
      // Store timeline in state manager
      animationState.setTimeline(column, tl);
  
      tl.to(els.smallBentoWrapper, { height: 0, opacity: 0, duration: 0.5 })
      .to(els.bigBentoWrapper, { height: "54rem", backgroundColor: "var(--base-color-brand--light-green)", duration: 1 })
      .to(els.bigBentoContentWrapper, { opacity: 0 }, ">-0.75")
      .to(column, { flexGrow: 5, duration: 1 }, ">-0.8")
      .to(els.bigBentoIconOuter, { color: "var(--base-color-brand--black)" }, "<")
      .to(els.bigBentoIconInner, { color: "var(--base-color-brand--light-green)", stagger: 0.05 }, "<")
      .to(els.bigBentoHeading, { color: "var(--base-color-brand--black)", fontSize: "5.5rem" }, "<")
      .to(els.bigBentoParagraphWrapper, {
        color: "var(--base-color-brand--black)",
        alignItems: "flex-start",
        justifyContent: "flex-start"
      }, "<")
      .to(els.bigBentoTextWrapper, {
        alignItems: "flex-start",
        justifyContent: "flex-start",
        rowGap: "3rem"
      }, "<") 
      .set(els.bigBentoParagraphShort, { display: "none", opacity: 0 }, )
      .set(els.bigBentoParagraphLong, { display: "block", opacity: 1, maxWidth: "65%" })
      .to(els.bigBentoContentWrapper, {
        opacity: 1,
        justifyContent: "flex-end",
        alignItems: "flex-start",
        textAlign: "left",
        rowGap: "2rem",
        padding: "4rem"
      }, "<")
      .set(els.bigBentoContentChildren, { opacity: 0, y: 20 })
      .from(els.bigBentoContentChildren, { opacity: 0, y: 20, stagger: 0.1 }, "<")
      .set(els.bigBentoCTAWrapper, { display: "flex" })
      .set(els.bigBentoCTAChildren, { opacity: 0, y: 20 })
      .from(els.bigBentoCTAChildren, { opacity: 0, y: 20, stagger: 0.1 }, "<");
  
      // Calculate and store the actual duration
      const actualHoverDuration = animationState.calculateTimelineDuration(tl);
      animationState.setAnimationDuration('hover', actualHoverDuration);
      console.log("Hover duration:", actualHoverDuration);
    }
  
    function animateReset(column, els) {
      const tl = gsap.timeline({ 
        defaults: { ease: "power2.inOut", duration: 0.3 },
        onComplete: () => {
          animationState.setColumnState(column, 'default');
          animationState.setGlobalAnimating(false);
          // Re-enable pointer events
          column.style.pointerEvents = "auto";
        }
      });
      
      // Store timeline in state manager
      animationState.setTimeline(column, tl);
    
      tl.to(els.bigBentoCTAWrapper, { y: 20, opacity: 0 })
        .to(els.bigBentoContentWrapper, { y: 20, opacity: 0})
        .set(els.bigBentoCTAWrapper, { display: "none", opacity: 1 })
        .to(els.bigBentoContentWrapper, {
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          rowGap: "",
          padding: ""
        }, "<")
        .to(column, { flexGrow: 1 })
        .to(els.bigBentoWrapper, { height: "26rem", backgroundColor: "" }, ">+0.5")
        .to(els.smallBentoWrapper, { height: "auto", opacity: 1 }, "<")
        .set(els.bigBentoContentWrapper, { display: "flex", justifyContent: "center", alignItems: "center", textAlign: "center" })
        .set(els.bigBentoHeading, { color: "", fontSize: "" })
        .set(els.bigBentoParagraphWrapper, { color: "", alignItems: "", justifyContent: ""})
        .set(els.bigBentoTextWrapper, { alignItems: "", justifyContent: "", rowGap: ""})
        .set(els.bigBentoParagraphShort, { display: "block", opacity: 1})
        .set(els.bigBentoParagraphLong, { display: "none", opacity: 0})
        .set(els.bigBentoIconOuter, { color: "" })
        .set(els.bigBentoIconInner, { color: "" })
        .to(els.bigBentoContentWrapper, { opacity: 1, y: 0 });
  
      // Calculate and store the actual duration
      const actualResetDuration = animationState.calculateTimelineDuration(tl);
      animationState.setAnimationDuration('reset', actualResetDuration);
      console.log("Reset duration:", actualResetDuration);
    }
  
    function animateCollapse(column, els) {
      const tl = gsap.timeline({ 
        defaults: { ease: "none" },
        onComplete: () => {
          animationState.setColumnState(column, 'collapsed');
          animationState.setGlobalAnimating(false);
        }
      });
      
      // Store timeline in state manager
      animationState.setTimeline(column, tl);
  
      tl.to(column, { flexGrow: 0.0625 })
        .to(els.bigBentoWrapper, { height: "26rem" }, "<")
        .to(els.smallBentoWrapper, { height: 0, opacity: 0 }, "<")
        .to(els.bigBentoContentWrapper, { opacity: 0 }, "<");
  
      // Calculate and store the actual duration
      const actualDuration = animationState.calculateTimelineDuration(tl);
      animationState.setAnimationDuration('collapse', actualDuration);
    }
  
    // Cleanup function (call this if you need to destroy the animation system)
    function destroy() {
      animationState.cleanupAll();
    }
  
    // Return public API
    return {
      destroy,
      getState: () => animationState // For debugging
    };
  }