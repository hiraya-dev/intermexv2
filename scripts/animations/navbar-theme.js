// navbar-theme.js
// Navbar theme change functionality based on section scrolling

// export function initNavbarThemeChange() {
//     document.querySelectorAll('section[data-theme]').forEach((section) => {
//       const sectionTheme = section.getAttribute('data-theme');
//       const invertedTheme = sectionTheme === 'dark' ? 'light' : 'dark';
    
//       ScrollTrigger.create({
//         trigger: section,
//         start: 'top top',
//         end: 'bottom top',
//         onEnter: () => {
//           document.querySelector('.navbarv2_component').setAttribute('data-theme', invertedTheme);
//         },
//         onEnterBack: () => {
//           document.querySelector('.navbarv2_component').setAttribute('data-theme', invertedTheme);
//         }
//       });
//     });
//   }

export function initNavbarThemeChange() {
  function updateNavbarTheme(theme) {
    const invertedTheme = theme === 'dark' ? 'light' : 'dark';
    document.querySelector('.navbarv2_component').setAttribute('data-theme', invertedTheme);
  }

  function observeSection(section) {
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (
          mutation.type === 'attributes' &&
          mutation.attributeName === 'data-theme'
        ) {
          const target = mutation.target;
          const theme = target.getAttribute('data-theme');
          if (theme) updateNavbarTheme(theme);
        }
      });
    });

    // Observe the section and all descendants for attribute changes
    observer.observe(section, {
      attributes: true,
      attributeFilter: ['data-theme'],
      subtree: true
    });
  }

  document.querySelectorAll('section[data-theme]').forEach(observeSection);
}