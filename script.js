
  const LANG_STORAGE_KEY = "lang";
  const DEFAULT_LANG = "en";

  async function loadLanguage(language) {
    // ВАЖНО: относительный путь без ведущего слэша
    const url = `lang/${language}.json`;

    let dict;
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status} when loading ${url}`);
      dict = await res.json();
    } catch (err) {
      console.error("Language file load error:", err);
      return; // выходим тихо, чтобы не ломать страницу
    }

    // Тексты
    document.querySelectorAll("[data-translate]").forEach(el => {
      const key = el.getAttribute("data-translate");
      if (dict[key] !== undefined) el.innerHTML = dict[key];
    });

    // Плейсхолдеры
    document.querySelectorAll("[data-translate-placeholder]").forEach(el => {
      const key = el.getAttribute("data-translate-placeholder");
      if (dict[key] !== undefined) el.setAttribute("placeholder", dict[key]);
    });

    // html lang + подпись на кнопке
    document.documentElement.lang = language;
    const label = document.getElementById("langLabel");
    if (label) label.textContent = language.toUpperCase();

    // сохранить выбор
    localStorage.setItem(LANG_STORAGE_KEY, language);
  }

  document.addEventListener("DOMContentLoaded", async () => {
    // безопасно ставим год (элемент уже в DOM)
    const y = document.getElementById("y");
    if (y) y.textContent = new Date().getFullYear();

    // инициализация языка
    const saved = localStorage.getItem(LANG_STORAGE_KEY) || DEFAULT_LANG;
    await loadLanguage(saved);

    // обработчик переключателя
    const toggle = document.getElementById("langToggle");
    if (toggle) {
      toggle.addEventListener("click", async () => {
        const current = localStorage.getItem(LANG_STORAGE_KEY) || DEFAULT_LANG;
        const next = current === "en" ? "ru" : "en";
        await loadLanguage(next);
      });
    } else {
      console.warn('langToggle button not found in DOM');
    }
  });
