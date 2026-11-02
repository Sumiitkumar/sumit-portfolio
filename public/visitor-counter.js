(() => {
  const counter = document.querySelector("[data-visitor-counter]");
  if (!counter) return;

  const countElement = counter.querySelector("[data-visitor-count]");
  const statusElement = counter.querySelector("[data-visitor-status]");
  const endpoint = counter.dataset.counterEndpoint;
  const storageKey = "sumit.cloud.visitor-id";

  if (!endpoint) {
    statusElement.textContent = "The live counter is not configured yet.";
    console.error("Set PUBLIC_VISITOR_COUNTER_URL to enable the live visitor counter.");
    return;
  }

  const createVisitorId = () => {
    if (crypto.randomUUID) return crypto.randomUUID();
    const bytes = crypto.getRandomValues(new Uint8Array(16));
    return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
  };

  const animateCount = (total) => {
    const format = new Intl.NumberFormat();
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion || total === 0) {
      countElement.textContent = format.format(total);
      return;
    }

    const start = performance.now();
    const duration = 1100;
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      countElement.textContent = format.format(Math.round(total * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const loadCount = async () => {
    let visitorId;
    try {
      visitorId = localStorage.getItem(storageKey);
    } catch (error) {
      statusElement.textContent = "Browser storage is needed to count unique visitors.";
      console.error("Could not read the visitor counter ID from browser storage.", error);
      return;
    }

    const isNewVisitor = !visitorId;
    visitorId ||= createVisitorId();

    const response = await fetch(endpoint, isNewVisitor
      ? {
          method: "POST",
          headers: { "Content-Type": "text/plain" },
          body: JSON.stringify({ visitorId }),
        }
      : { headers: { Accept: "application/json" } });

    if (!response.ok) {
      throw new Error(`Visitor counter returned HTTP ${response.status}.`);
    }

    const result = await response.json();
    if (!Number.isSafeInteger(result.count) || result.count < 0) {
      throw new Error("Visitor counter returned an invalid total.");
    }

    let statusMessage = "One count per browser.";
    if (isNewVisitor) {
      try {
        localStorage.setItem(storageKey, visitorId);
      } catch (error) {
        console.error("Could not save the visitor counter ID in browser storage.", error);
        statusMessage = "Browser storage is unavailable; this browser may be counted again.";
      }
    }

    animateCount(result.count);
    statusElement.textContent = statusMessage;
  };

  loadCount().catch((error) => {
    statusElement.textContent = "The live visitor count is temporarily unavailable.";
    console.error("Could not load the live visitor count.", error);
  });
})();
