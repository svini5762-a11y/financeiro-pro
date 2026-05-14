self.addEventListener('fetch', (event) => {
    // Se for para o Supabase, não interfere
    if (event.request.url.includes('supabase.co')) return;

    event.respondWith(
        fetch(event.request).catch(() => caches.match(event.request))
    );
});
