// navbar-theme.js
// Navbar theme change functionality based on section scrolling

export function initNavbarThemeChange() {
  const navbar = document.querySelector('.navbarv2_component');
  let currentTheme = 'light';

  document.querySelectorAll('[data-theme]').forEach((el) => {
    const elTheme = el.getAttribute('data-theme');
    const invertedTheme = elTheme === 'dark' ? 'light' : 'dark';

    ScrollTrigger.create({
      trigger: el,
      start: 'top top',
      end: 'bottom top',
      onEnter: () => {
        navbar.setAttribute('data-theme', invertedTheme);
        currentTheme = invertedTheme;
      },
      onEnterBack: () => {
        navbar.setAttribute('data-theme', invertedTheme);
        currentTheme = invertedTheme;
      },
      onLeaveBack: () => {
        navbar.setAttribute('data-theme', 'light');
        currentTheme = 'light';
      }
    });
  });

  gsap.matchMedia().add('(max-width: 991px)', () => {
    const menuButton = document.querySelector('.navbarv2_menu-button');
    if (!menuButton) return;

    const observer = new MutationObserver(() => {
      if (menuButton.classList.contains('w--open')) {
        navbar.setAttribute('data-theme', 'light');
      } else {
        navbar.setAttribute('data-theme', currentTheme);
      }
    });
    observer.observe(menuButton, { attributes: true, attributeFilter: ['class'] });
  });
}