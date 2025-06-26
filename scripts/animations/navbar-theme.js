// navbar-theme.js
// Navbar theme change functionality based on section scrolling

export function initNavbarThemeChange() {
    document.querySelectorAll('section[data-theme]').forEach((section) => {
      const sectionTheme = section.getAttribute('data-theme');
      const invertedTheme = sectionTheme === 'dark' ? 'light' : 'dark';
    
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: 'bottom top',
        onEnter: () => {
          document.querySelector('.navbarv2_component').setAttribute('data-theme', invertedTheme);
        },
        onEnterBack: () => {
          document.querySelector('.navbarv2_component').setAttribute('data-theme', invertedTheme);
        }
      });
    });
  }