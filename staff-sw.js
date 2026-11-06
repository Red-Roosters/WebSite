/* Service Worker لصفحة الطيار والداشبورد (تثبيت كتطبيق). مش بيلمس الـ API ولا موقع العملاء. */
const V = 'rr-staff-v1';
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET' || r.mode !== 'navigate') return;   // صفحات التنقّل بس (شبكة الأول، وآخر نسخة لو النت قطع)
  e.respondWith(fetch(r).then(res => { const cp = res.clone(); caches.open(V).then(c => c.put(r, cp)).catch(() => {}); return res; }).catch(() => caches.match(r).then(m => m || new Response('<meta charset=utf-8><body style="font:600 18px sans-serif;text-align:center;padding:40px" dir=rtl>⚠️ مفيش اتصال بالإنترنت — اتأكد من النت وحاول تاني.', {headers: {'Content-Type': 'text/html;charset=utf-8'}}))));
});
