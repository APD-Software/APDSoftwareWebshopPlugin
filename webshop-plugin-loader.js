(() => {
  const self = document.currentScript || Array.from(document.scripts).filter((s) => s.src.includes('webshop-plugin-loader.js')).pop();
  const script = document.createElement('script');
  script.type = 'module';
  script.src = 'https://cdn.jsdelivr.net/gh/APD-Software/APDSoftwareWebshopPlugin@0.1.323/dist/webshop-plugin-loader.js';
  for (const { name, value } of self ? self.attributes : []) {
    if (name.startsWith('data-')) script.setAttribute(name, value);
  }
  document.head.append(script);
})();
