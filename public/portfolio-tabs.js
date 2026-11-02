(() => {
  const panels = [...document.querySelectorAll("[data-portfolio-panel]")];
  const links = [...document.querySelectorAll("[data-portfolio-tab]")];
  let activationId = 0;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const typeAboutTitle = (panel, currentActivation) => {
    const lines = [...panel.querySelectorAll("[data-typewriter-text]")];
    const values = lines.map((line) => line.dataset.typewriterText ?? "");

    lines.forEach((line) => {
      line.textContent = "";
      line.classList.remove("is-typing");
    });

    if (reducedMotion.matches) {
      lines.forEach((line, index) => {
        line.textContent = values[index];
      });
      return;
    }

    const typeLine = (lineIndex, characterIndex = 0) => {
      if (currentActivation !== activationId || panel.hidden) return;
      const line = lines[lineIndex];
      const text = values[lineIndex];
      if (!line || text === undefined) return;

      line.classList.add("is-typing");
      if (characterIndex < text.length) {
        line.textContent = text.slice(0, characterIndex + 1);
        window.setTimeout(() => typeLine(lineIndex, characterIndex + 1), 65);
        return;
      }

      line.classList.remove("is-typing");
      window.setTimeout(() => typeLine(lineIndex + 1), 180);
    };

    typeLine(0);
  };

  const activatePanel = (id) => {
    const activePanel = panels.find((panel) => panel.id === id)
      ?? panels.find((panel) => panel.id === "blogs");

    if (!activePanel) return;

    const currentActivation = ++activationId;
    const aboutPanel = panels.find((panel) => panel.id === "about");
    aboutPanel?.classList.remove("about-title-animate");

    panels.forEach((panel) => {
      panel.hidden = panel !== activePanel;
    });

    if (activePanel.id === "about") {
      requestAnimationFrame(() => {
        if (currentActivation === activationId && !activePanel.hidden) {
          activePanel.classList.add("about-title-animate");
          typeAboutTitle(activePanel, currentActivation);
        }
      });
    }

    links.forEach((link) => {
      if (link.getAttribute("href") === `#${activePanel.id}`) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  };

  const activateFromLocation = () => {
    activatePanel(window.location.hash.slice(1) || "blogs");
  };

  document.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;
    const link = event.target.closest("[data-portfolio-tab]");
    if (link instanceof HTMLAnchorElement) {
      activatePanel(link.hash.slice(1));
    }
  });

  window.addEventListener("hashchange", activateFromLocation);
  activateFromLocation();
})();
