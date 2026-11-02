(() => {
  const storageKey = "sumit.cloud.theme";
  const root = document.documentElement;

  const applyTheme = (theme) => {
    const isDark = theme === "dark";
    root.dataset.theme = isDark ? "dark" : "light";
    document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
      const label = isDark ? "Switch to light mode" : "Switch to dark mode";
      button.setAttribute("aria-label", label);
      button.setAttribute("aria-pressed", String(isDark));
      button.querySelector("[data-theme-toggle-label]").textContent = label;
    });
  };

  try {
    applyTheme(localStorage.getItem(storageKey) === "dark" ? "dark" : "light");
  } catch (error) {
    console.error("Could not read the saved color theme.", error);
    applyTheme("light");
  }

  document.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;
    const button = event.target.closest("[data-theme-toggle]");
    if (!button) return;

    const theme = root.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(theme);
    try {
      localStorage.setItem(storageKey, theme);
    } catch (error) {
      console.error("Could not save the selected color theme.", error);
    }
  });
})();
