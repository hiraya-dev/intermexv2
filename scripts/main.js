// main.js
// Main application entry point - imports and initializes all modules

// Import GSAP configuration
import { initGSAP } from './config/gsap-config.js';

// Import all component modules
import { initNavbarThemeChange } from './animations/navbar-theme.js';
import { initWhatsAppInterface } from './utils/whatsapp-interface.js';
import { initBentoFeaturesAnimation } from './animations/bento-features.js';
import { initBentoMarquee } from './animations/bento-marquee.js';
import { initModalAndPrefetch } from './utils/modal-prefetch.js';
import { initWhatsAppCountryButtons } from './utils/whatsapp-buttons.js';

// Main document ready function to initialize all components
document.addEventListener('DOMContentLoaded', function() {
  // Initialize GSAP first
  initGSAP();
  
  // Initialize all components
  initNavbarThemeChange();
  initWhatsAppInterface();
  initBentoFeaturesAnimation();
  initBentoMarquee();
  initModalAndPrefetch();
  initWhatsAppCountryButtons();
  
  console.log('🚀 All modules initialized successfully');
});