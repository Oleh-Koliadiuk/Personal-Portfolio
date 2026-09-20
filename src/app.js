import en from "./locales/en.js";
import uk from "./locales/uk.js";

const STORAGE_KEYS = {
  language: "language",
  theme: "theme",
};

const LANGUAGES = {
  EN: "en",
  UK: "uk",
};

const THEMES = {
  LIGHT: "light",
  DARK: "dark",
};

const translations = {
  [LANGUAGES.EN]: en,
  [LANGUAGES.UK]: uk,
};


const languageToggle = document.querySelector("#language-toggle");
const themeToggle = document.querySelector("#theme-toggle");

const translatableElements = document.querySelectorAll("[data-i18n]");


const getNestedValue = (object, path) => {
  return path.split(".").reduce((current, key) => {
    return current?.[key];
  }, object);
};

const getSystemTheme = () => {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  return prefersDark ? THEMES.DARK : THEMES.LIGHT;
};

const getSavedLanguage = () => {
  const savedLanguage = localStorage.getItem(STORAGE_KEYS.language);

  if (savedLanguage in translations) {
    return savedLanguage;
  }

  return LANGUAGES.EN;
};

const setLanguage = (language) => {
  if (!(language in translations)) {
    return;
  }

  localStorage.setItem(STORAGE_KEYS.language, language);

  document.documentElement.lang = language;

  translatePage(language);
};

const translatePage = (language) => {
  const translation = translations[language];

  if (!translation) {
    return;
  }

  translatableElements.forEach((element) => {
    const key = element.dataset.i18n;
    const value = getNestedValue(translation, key);

    if (value === undefined) {
      console.warn(`Translation not found: "${key}" (${language})`);

      return;
    }

    element.innerHTML = value;
  });

  updateLanguageButton(language);
};

const updateLanguageButton = (language) => {
  if (!languageToggle) {
    return;
  }

  const isEnglish = language === LANGUAGES.EN;

  languageToggle.textContent = isEnglish ? "UA" : "EN";

  languageToggle.setAttribute(
    "aria-label",
    isEnglish ? "Switch to Ukrainian" : "Перемкнути на англійську",
  );

  languageToggle.setAttribute(
    "title",
    isEnglish ? "Switch to Ukrainian" : "Перемкнути на англійську",
  );
};

const getSavedTheme = () => {
  const savedTheme = localStorage.getItem(STORAGE_KEYS.theme);

  if (savedTheme === THEMES.LIGHT || savedTheme === THEMES.DARK) {
    return savedTheme;
  }

  return getSystemTheme();
};

const setTheme = (theme) => {
  if (theme !== THEMES.LIGHT && theme !== THEMES.DARK) {
    return;
  }

  document.documentElement.dataset.theme = theme;

  localStorage.setItem(STORAGE_KEYS.theme, theme);

  updateThemeButton(theme);
};

const updateThemeButton = (theme) => {
  if (!themeToggle) {
    return;
  }

  const isDark = theme === THEMES.DARK;

  themeToggle.textContent = isDark ? "Light" : "Dark";

  themeToggle.setAttribute(
    "aria-label",
    isDark ? "Switch to light theme" : "Switch to dark theme",
  );

  themeToggle.setAttribute(
    "title",
    isDark ? "Switch to light theme" : "Switch to dark theme",
  );
};

const toggleTheme = () => {
  const currentTheme =
    document.documentElement.dataset.theme || getSystemTheme();

  const nextTheme = currentTheme === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK;

  setTheme(nextTheme);
};

const systemThemeMedia = window.matchMedia("(prefers-color-scheme: dark)");

const handleSystemThemeChange = (event) => {
  const savedTheme = localStorage.getItem(STORAGE_KEYS.theme);

  // Don't override the user's manually selected theme.
  if (savedTheme) {
    return;
  }

  const systemTheme = event.matches ? THEMES.DARK : THEMES.LIGHT;

  setTheme(systemTheme);
};


languageToggle?.addEventListener("click", () => {
  const currentLanguage = getSavedLanguage();

  const nextLanguage =
    currentLanguage === LANGUAGES.EN ? LANGUAGES.UK : LANGUAGES.EN;

  setLanguage(nextLanguage);
});

themeToggle?.addEventListener("click", toggleTheme);

systemThemeMedia.addEventListener("change", handleSystemThemeChange);

const initializeApp = () => {
  const initialLanguage = getSavedLanguage();

  const initialTheme = getSavedTheme();

  document.documentElement.lang = initialLanguage;

  setTheme(initialTheme);
  translatePage(initialLanguage);
};

initializeApp();
