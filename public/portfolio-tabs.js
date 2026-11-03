(() => {
  const sections = [...document.querySelectorAll("[data-scroll-section]")];
  const links = [...document.querySelectorAll("[data-section-link]")];
  const updateCurrentLink = (id) => {
    links.forEach((link) => {
      if (link.getAttribute("href") === `#${id}`) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  };

  const observer = new IntersectionObserver((entries) => {
    const currentSection = entries
      .filter((entry) => entry.isIntersecting)
      .sort((first, second) => second.intersectionRatio - first.intersectionRatio)[0];

    if (currentSection) updateCurrentLink(currentSection.target.id);
  }, {
    rootMargin: "-20% 0px -65% 0px",
    threshold: [0, 0.2, 0.5, 0.75],
  });

  sections.forEach((section) => observer.observe(section));

  const initialSection = window.location.hash.slice(1);
  if (sections.some((section) => section.id === initialSection)) {
    updateCurrentLink(initialSection);
  }
})();
