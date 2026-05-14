const CACHE_NAME = 'elite-finance-v4';

// Arquivos que o app vai salvar para funcionar sem internet (Apenas locais)
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon.png'
];

// Instala os arquivos básicos no celular
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Limpa versões antigas do app quando você atualiza o código
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
});

// GERENCIADOR DE CONEXÃO (O segredo da sincronização)
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // REGRA DE OURO: Se o pedido for para o Supabase, ignore o cache e use a rede.
  // Isso evita o erro "Failed to fetch" no login e nos lançamentos.
  if (url.hostname.includes('supabase.co')) {
    return; 
  }

  // Para o restante (ícone, fontes, layout), tenta o cache primeiro, depois a rede.
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});
