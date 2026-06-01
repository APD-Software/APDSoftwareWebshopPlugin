const LOADER_RUNTIME_KEY = '__apdsoftwareWebshopPluginLoaderRuntime';
const runtimeScope = globalThis;
const loaderState = runtimeScope[LOADER_RUNTIME_KEY] || (runtimeScope[LOADER_RUNTIME_KEY] = {});
const baseUrl = new URL('./', import.meta.url);
const stylesheetFile = "styles-YHLL7HTF.css";
const entryModuleFile = "main-ZIWIWFTN.js";

loaderState.defaultConfig = mergeDefinedConfig(loaderState.defaultConfig, readScriptConfig());

ensureStylesheet(baseUrl, stylesheetFile);
await ensureEntryModule(baseUrl, entryModuleFile);
applyRuntimeConfig(loaderState.defaultConfig);

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

function applyRuntimeConfig(config) {
  if (!config || typeof config !== 'object') {
    return;
  }

  const pluginApi = runtimeScope.APDSoftwareWebshopPlugin;
  if (!pluginApi || typeof pluginApi.configure !== 'function') {
    return;
  }

  pluginApi.configure(config);
}

function readScriptConfig() {
  if (typeof document === 'undefined') {
    return {};
  }

  const loaderScript = resolveLoaderScriptElement();
  if (!loaderScript || typeof loaderScript !== 'object' || !('dataset' in loaderScript)) {
    return {};
  }

  const {
    apiBaseUrl,
    redirectUrl,
    title,
    theme,
    locale,
    currency,
    storageKeyPrefix,
    testMode,
    openOnMount,
  } = loaderScript.dataset || {};

  return compactConfig({
    apiBaseUrl: sanitizeString(apiBaseUrl),
    redirectUrl: sanitizeString(redirectUrl),
    title: sanitizeString(title),
    theme: normalizeTheme(theme),
    locale: sanitizeString(locale),
    currency: sanitizeString(currency),
    storageKeyPrefix: sanitizeString(storageKeyPrefix),
    testMode: parseBoolean(testMode),
    openOnMount: parseBoolean(openOnMount),
  });
}

function resolveLoaderScriptElement() {
  if (typeof document === 'undefined') {
    return null;
  }

  const currentScript = document.currentScript;
  if (currentScript && typeof currentScript === 'object' && 'dataset' in currentScript) {
    return currentScript;
  }

  const scriptElements = document.querySelectorAll('script[src]');
  for (const scriptElement of scriptElements) {
    const src = scriptElement.getAttribute('src');
    if (!src) {
      continue;
    }

    try {
      const absoluteScriptUrl = new URL(src, document.baseURI).href;
      if (absoluteScriptUrl === import.meta.url) {
        return scriptElement;
      }
    } catch {
      // Ignore malformed URLs and continue searching.
    }
  }

  return null;
}

function sanitizeString(value) {
  if (typeof value !== 'string') {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}

function normalizeTheme(value) {
  if (value === 'light' || value === 'dark' || value === 'system') {
    return value;
  }

  return undefined;
}

function parseBoolean(value) {
  if (value === 'true') {
    return true;
  }

  if (value === 'false') {
    return false;
  }

  return undefined;
}

function compactConfig(config) {
  const compacted = {};

  for (const [key, value] of Object.entries(config)) {
    if (value !== undefined) {
      compacted[key] = value;
    }
  }

  return compacted;
}

function mergeDefinedConfig(baseConfig, overrideConfig) {
  const merged = { ...(baseConfig || {}) };

  for (const [key, value] of Object.entries(overrideConfig || {})) {
    if (value !== undefined) {
      merged[key] = value;
    }
  }

  return merged;
}
