
export function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) {
    console.log('[PWA] Service Workers not supported in this browser.');
    return;
  }


  const swUrl = `${import.meta.env.BASE_URL}sw.js`;


  let hasReloaded = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (hasReloaded) return;
    hasReloaded = true;
    console.log('[PWA] New Service Worker took control — reloading to use fresh content.');
    window.location.reload();
  });

  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register(swUrl)
      .then((registration) => {
        console.log('[PWA] Service Worker registered:', registration.scope);

        if (registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        }

        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker?.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
         
              console.log('[PWA] New content available — activating now.');
              newWorker.postMessage({ type: 'SKIP_WAITING' });
            }
          });
        });

     
        registration.update();
      })
      .catch((err) => {
        console.warn('[PWA] Service Worker registration failed:', err.message);
      });
  });
}
