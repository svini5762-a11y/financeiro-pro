const cacheName = 'elite-finance-v3';
// Apenas arquivos locais do seu GitHub
const assets = [
  './',
  './index.html',
  './manifest.json',
  './icon.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(cacheName).then((cache) => cache.addAll(assets))
    );
});

// A CORREÇÃO ESTÁ AQUI: Só interfere se o pedido for para o seu próprio site
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);
    
    // Se o pedido for para o Supabase, não faça nada (deixe a rede resolver)
    if (url.hostname.includes('supabase.co')) {
        return; 
    }

    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
