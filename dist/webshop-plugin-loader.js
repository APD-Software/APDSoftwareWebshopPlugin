const LOADER_RUNTIME_KEY = '__apdsoftwareWebshopPluginLoaderRuntime';
const runtimeScope = globalThis;
const loaderState = runtimeScope[LOADER_RUNTIME_KEY] || (runtimeScope[LOADER_RUNTIME_KEY] = {});
const baseUrl = new URL('./', import.meta.url);
const stylesheetFile = "styles-2EQ4EK4A.css";
const entryModuleFile = "main-XCI2YAW7.js";

ensureStylesheet(baseUrl, stylesheetFile);
await ensureEntryModule(baseUrl, entryModuleFile);

function ensureStylesheet(base, stylesheet) {
  if (typeof document === 'undefined') {
    return;
  }

  const href = new URL('./' + stylesheet, base).href;
  const existing = document.querySelector('link[data-apdsoftware-webshop-style="' + stylesheet + '"]');
  if (existing) {
    return;
  }

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  link.dataset.apdsoftwareWebshopStyle = stylesheet;
  document.head.appendChild(link);
}

async function ensureEntryModule(base, entryFile) {
  const entryUrl = new URL('./' + entryFile, base).href;

  if (!loaderState.entryModulePromise || loaderState.entryModuleUrl !== entryUrl) {
    loaderState.entryModuleUrl = entryUrl;
    loaderState.entryModulePromise = import(entryUrl);
  }

  await loaderState.entryModulePromise;
}
