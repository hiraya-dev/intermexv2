// gsap-config.js
export function initGSAP() {
  if (typeof gsap === 'undefined') {
    console.error('GSAP is not loaded. Did you forget the <script> tag in Webflow?');
    return;
  }

  gsap.registerPlugin(ScrollTrigger, CustomEase);
  gsap.defaults({ ease: 'power2.out', duration: 0.6 });

  console.log('✅ GSAP plugins registered');
}