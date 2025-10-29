export function showErrorPopup(e, additionalText) {
  const text = String(e ?? "Unknown Error");
  const fullText = additionalText ? `${text} --- ${additionalText}` : text;
  console.log(fullText);
  const ID = "__error_popup__";

  let existing = document.getElementById(ID);
  if (existing) {
    clearTimeout(existing._hideTimer);
    existing.querySelector(".error-popup__content")?.textContent;
    existing._content.textContent = text;
    existing._copyHint.textContent = "Click to copy";
    existing.classList.remove("error-popup--hidden");
    existing.classList.add("error-popup--visible");

    existing._hideTimer = setTimeout(() => removePopup(existing), 5000);
    return;
  }

  const wrap = document.createElement("div");
  wrap.id = ID;
  wrap.setAttribute("role", "alert");
  wrap.className = "error-popup error-popup--visible";

  const content = document.createElement("div");
  content.className = "error-popup__content";
  content.textContent = fullText;

  const copyHint = document.createElement("div");
  copyHint.className = "error-popup__hint";
  copyHint.textContent = "Click to copy";

  // referencias para reinicio/timers
  wrap._content = content;
  wrap._copyHint = copyHint;

  wrap.appendChild(content);
  wrap.appendChild(copyHint);

  wrap.addEventListener("click", async (ev) => {
    ev.stopPropagation();
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      copyHint.textContent = "Copied";
      copyHint.style.opacity = "1";
      clearTimeout(wrap._hideTimer);
      wrap._hideTimer = setTimeout(() => removePopup(wrap), 700);
    } catch (err) {
      copyHint.textContent = "Failed to copy";
      clearTimeout(wrap._hideTimer);
      wrap._hideTimer = setTimeout(() => removePopup(wrap), 1200);
    }
  });

  document.body.appendChild(wrap);
  // force reflow for transition (same intent as previous)
  /* eslint-disable no-unused-expressions */
  wrap.getBoundingClientRect();

  wrap._hideTimer = setTimeout(() => removePopup(wrap), 5000);

  function removePopup(node) {
    if (!node || !node.parentElement) return;
    node.classList.remove("error-popup--visible");
    node.classList.add("error-popup--hidden");
    clearTimeout(node._hideTimer);
    setTimeout(() => {
      if (node.parentElement) node.parentElement.removeChild(node);
    }, 260);
  }
}
