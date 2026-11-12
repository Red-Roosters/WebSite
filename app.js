/* app.js — كل سكريبتات الصفحة بنفس ترتيبها الأصلي. كل جزء متعزل بـ try/catch عشان خطأ في جزء مايوقفش الباقي. */
/* ── جزء 1 ── */
;
    const activeSection = { id: 'home' };
    function showSection(id) {
        document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
        const el = document.getElementById(id);
        if (el) { el.classList.add('active'); activeSection.id = id; window.scrollTo({ top: 0, behavior: 'smooth' }); }
        document.querySelectorAll('#nav-list button').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('onclick') && btn.getAttribute('onclick').includes(`'${id}'`));
        });
    }
    function toggleMobileNav() {
        const nav = document.getElementById('mobileNav');
        const btn = document.getElementById('hamburger');
        nav.classList.toggle('open');
        btn.classList.toggle('open');
    }
    function closeMobileNav() {
        document.getElementById('mobileNav').classList.remove('open');
        document.getElementById('hamburger').classList.remove('open');
    }
    window.addEventListener('scroll', () => {
        document.getElementById('scrollTop').classList.toggle('visible', window.scrollY > 400);
    });
    document.addEventListener('DOMContentLoaded', () => { showSection('home'); });

/* ── جزء 2 ── */
try {
/* تعديلات المنيو من الداشبورد (أسعار / وصف / صور / إخفاء / أصناف جديدة): بتتطبّق على الصفحة قبل ما السلة تجهّز الكروت */
(function () {
  var ov = null; try { ov = JSON.parse(localStorage.getItem('rr_menuov') || 'null'); } catch (e) {}
  window.__ovVer = (ov && ov.ver) || '';
  window.rrMenuOvSync = function (api) {
    try { fetch(api + (api.indexOf('?') > -1 ? '&' : '?') + 'action=menuov').then(function (r) { return r.json(); }).then(function (j) {
      if (!j || !j.ok || (j.ver || '') === window.__ovVer) return;
      localStorage.setItem('rr_menuov', JSON.stringify({ ver: j.ver || '', items: j.items || [] }));
      var cart = []; try { cart = JSON.parse(localStorage.getItem('rr_cart') || '[]'); } catch (e) {}
      if (!cart.length && sessionStorage.getItem('rr_ovr') !== (j.ver || '-')) { sessionStorage.setItem('rr_ovr', j.ver || '-'); location.reload(); }   // السلة فاضية: نحدّث الصفحة مرة واحدة بالأسعار الجديدة
    }).catch(function () {}); } catch (e) {}
  };
  if (!ov || !ov.items || !ov.items.length) return;
  var nz = s => String(s == null ? '' : s).replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d)).toLowerCase().replace(/[\u064B-\u065F\u0670\u0640]/g, '').replace(/[أإآ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه').replace(/\s+/g, ' ').trim();
  var clean = function (el) { var c = el.cloneNode(true); c.querySelectorAll('span').forEach(function (s) { s.remove(); }); return c.textContent.replace(/[\u{1F300}-\u{1FAFF}\u2600-\u27BF]/gu, '').replace(/\s+/g, ' ').trim(); };
  var TY = [['.card', '.card-name', '.price-badge'], ['.siniya-card', '.siniya-card-name', '.siniya-price'], ['.siniya-featured', '.siniya-featured-name', '.siniya-price'], ['.school-featured', '.school-featured-name', '.price-badge'], ['.zsb-banner', 'h2', '.zsb-price'], ['.power-deal-banner', 'h2', '.power-deal-price']];
  var map = {}; ov.items.forEach(function (it) { map[nz(it.n)] = it; });
  var exists = function (n) { var f = false; TY.forEach(function (t) { document.querySelectorAll(t[0]).forEach(function (b) { var e = b.querySelector(t[1]); if (e && nz(clean(e)) === nz(n)) f = true; }); }); return f; };
  ov.items.forEach(function (it) {   /* أصناف جديدة: بتتضاف كارت عادي في القسم المحدد */
    try { if (!it.a || it.h || !it.p.length || exists(it.n)) return; var grid = null;
      document.querySelectorAll('section').forEach(function (s) { var h = s.querySelector('.section-title,h2'); if (h && nz(clean(h)) === nz(it.s)) grid = grid || s.querySelector('.menu-grid'); });
      if (!grid) return;
      var card = document.createElement('div'); card.className = 'card';
      if (it.i) { var im = document.createElement('img'); im.className = 'card-img'; im.loading = 'lazy'; im.alt = it.n; im.src = it.i; card.appendChild(im); }
      var body = document.createElement('div'); body.className = 'card-body';
      var nm = document.createElement('div'); nm.className = 'card-name'; nm.textContent = it.n; body.appendChild(nm);
      if (it.d) { var ds = document.createElement('p'); ds.className = 'card-desc'; ds.textContent = it.d; body.appendChild(ds); }
      var ft = document.createElement('div'); ft.className = 'card-footer'; var pb = document.createElement('span'); pb.className = 'price-badge'; pb.textContent = it.p[0] + ' LE'; ft.appendChild(pb); body.appendChild(ft);
      card.appendChild(body); grid.appendChild(card); } catch (e) {} });
  TY.forEach(function (t) { document.querySelectorAll(t[0]).forEach(function (box) {
    try { var ne = box.querySelector(t[1]); if (!ne) return; var it = map[nz(clean(ne))]; if (!it) return;
      if (it.h) { box.remove(); return; }
      var pe = box.querySelector(t[2]);
      if (pe && it.p.length) { var tx = pe.textContent, cnt = (tx.match(/\d+(?:\.\d+)?/g) || []).length; if (cnt === it.p.length) { var i = 0; pe.textContent = tx.replace(/\d+(?:\.\d+)?/g, function () { return it.p[i++]; }); } }
      if (it.d) { var de = box.querySelector('.card-desc'); if (de) de.textContent = it.d; }
      if (it.i) { var im = box.querySelector('img'); if (im) { im.removeAttribute('srcset'); im.src = it.i; } }
    } catch (e) {} }); });
})();
} catch (e) { console.error("[app.js جزء 2]", e); }

/* ── جزء 3 ── */
try {
(function () {
    /* ═══ إعدادات: عدّل هنا ═══ */
    const CONFIG = {
        phone: '201023278000',
        minOrder: 0,

        // ⏰ ساعات العمل (خليها enabled:true لتفعيلها). لو الإغلاق بعد منتصف الليل اكتب close أصغر من open
        hours: { enabled: true, open: '11:00', close: '05:00', tz: 'Africa/Cairo' },

        // 🌐 رابط سكريبت Google (Apps Script) للتحقق من الكوبون لأول طلب من أي جهاز. سيبه فاضي = تحقق على نفس الجهاز بس
        couponApi: 'https://script.google.com/macros/s/AKfycbzoNNPfliuE1Cp87iylF0GtJGxrYSMRfnatHjIBHefLAwIzvv8T4BQzKfFYp_G2OALr/exec',

        // 🎟️ الكوبونات: percent = نسبة %, fixed = مبلغ ثابت, min = أقل مجموع للطلب (اختياري)
        coupons: {
            'RED20':   { type: 'percent', value: 20, firstOrderOnly: true },
            'WELCOME': { type: 'fixed',   value: 20, min: 150, firstOrderOnly: true, hidden: true }
        },

        // ⏱️ تقدير وقت التوصيل (بالدقايق) — احتياطي لحد ما السيرفر يحسب المتوسط الفعلي من الطلبات اللي اتسلّمت
        eta: { delivery: 45, pickup: 20 },

        areas: [
            { name: 'الطالبية التأمين الصحي', fee: 55 },
            { name: 'العمرانية الشرقية', fee: 65 },
            { name: 'العمرانية الغربية', fee: 55 },
            { name: 'المحولات - الهرم', fee: 40 },
            { name: 'المريوطية - هرم 1', fee: 35 },
            { name: 'المريوطية - هرم 2', fee: 45 },
            { name: 'المريوطية - هرم 3', fee: 55 },
            { name: 'المساحة - فيصل', fee: 50 },
            { name: 'اللبيني - فيصل', fee: 35 },
            { name: 'اللبيني - هرم', fee: 40 },
            { name: 'ترعة عبد العال', fee: 55 },
            { name: 'حدائق الأهرام - بوابة أولى', fee: 55 },
            { name: 'حدائق الأهرام - بوابة ثانية جديدة', fee: 55 },
            { name: 'حدائق الأهرام - بوابة ثالثة (ثانية قديمة)', fee: 55 },
            { name: 'حدائق الأهرام - بوابة رابعة', fee: 65 },
            { name: 'حدائق الأهرام - مساكن الضباط', fee: 55 },
            { name: 'شارع العمدة', fee: 45 },
            { name: 'شارع المستشفى', fee: 30 },
            { name: 'شارع سهل حمزة', fee: 35 },
            { name: 'فيصل - أول فيصل', fee: 55 },
            { name: 'فيصل - آخر فيصل', fee: 35 },
            { name: 'فيصل - التعاون 2', fee: 40 },
            { name: 'فيصل - الطالبية', fee: 45 },
            { name: 'فيصل - الطوابق', fee: 35 },
            { name: 'فيصل - الطوابق التاني', fee: 35 },
            { name: 'فيصل - العشرين 1', fee: 50 },
            { name: 'فيصل - الكوم الأخضر', fee: 35 },
            { name: 'فيصل - الملكة نازلي', fee: 50 },
            { name: 'فيصل - المريوطية 2', fee: 35 },
            { name: 'فيصل - المريوطية 3', fee: 40 },
            { name: 'فيصل - المطبعة 2', fee: 45 },
            { name: 'فيصل - حسن محمد', fee: 40 },
            { name: 'فيصل - حسن محمد 2', fee: 40 },
            { name: 'فيصل - طريق المنشية البكاري', fee: 40 },
            { name: 'فيصل - كعبيش', fee: 35 },
            { name: 'فيصل - كوم بكار 2', fee: 40 },
            { name: 'الهرم - ترسا', fee: 40 },
            { name: 'الهرم - التعاون', fee: 40 },
            { name: 'الهرم - الثلاثيني 2', fee: 40 },
            { name: 'الهرم - العروبة', fee: 45 },
            { name: 'الهرم - العريش', fee: 30 },
            { name: 'الهرم - المجزر الآلي', fee: 45 },
            { name: 'الهرم - المنصورية', fee: 45 },
            { name: 'الهرم - ويمبي', fee: 45 },
            { name: 'الهرم - تربية رياضية', fee: 50 },
            { name: 'الهرم - مشعل', fee: 40 },
            { name: 'الهرم - نزلة السمان', fee: 45 },
            { name: 'الهرم - الرماية', fee: 45 }
        ]
    };

    /* ═══ الإضافات — ضع رابط الصورة في img (لو فاضي بيظهر الإيموجي) ═══ */
    const EXTRA_GROUPS = [
        { key: 'meat',   title: '🍗 قطع الدجاج واللحوم' },
        { key: 'cheese', title: '🧀 الجبن والخضار والإضافات' },
        { key: 'bread',  title: '🍞 الخبز' },
        { key: 'combo',  title: '🔥 كومبو' }
    ];
    const EXTRAS = [
        { id:'strips',       group:'meat',   name:'قطعة استربس',    en:'Strips Piece',     price:35, emoji:'🍗', img:'https://i.ibb.co/NgmmHJ3z/image.jpg' },
        { id:'zinger',       group:'meat',   name:'قطعة زينجر',     en:'Zinger Piece',     price:55, emoji:'🍗', img:'https://i.ibb.co/My6D5s22/image.jpg' },
        { id:'chicken',      group:'meat',   name:'قطعة دجاج',      en:'Chicken Piece',    price:65, emoji:'🍗', img:'https://i.ibb.co/ZzXg9KkX/image.jpg' },
        { id:'burger',       group:'meat',   name:'قطعة برجر',      en:'Burger Piece',     price:55, emoji:'🥩', img:'https://i.ibb.co/5xRM244V/image.jpg' },
        { id:'beefbacon',    group:'meat',   name:'بيف بيكون',      en:'Beef Bacon',       price:25, emoji:'🥓', img:'https://i.ibb.co/PZdQm9jw/image.png' },
        { id:'smokedturkey', group:'meat',   name:'تركي مدخن',      en:'Smoked Turkey',    price:20, emoji:'🦃', img:'https://i.ibb.co/4g0SJMSd/image.png' },
        { id:'roastbeef',    group:'meat',   name:'روست بيف',       en:'Roast Beef',       price:20, emoji:'🥩', img:'https://i.ibb.co/C5zK0hhW/image.png' },

        { id:'cheese',       group:'cheese', name:'جبنة أمريكي',    en:'American Cheese',  price:10, emoji:'🧀', img:'https://i.ibb.co/0Vf0c1vr/image.png' },
        { id:'mozzarella',   group:'cheese', name:'قطعة موتزاريلا', en:'Mozzarella Piece', price:15, emoji:'🧀', img:'https://i.postimg.cc/HxXpCHnt/5.jpg' },
        { id:'cheddar',      group:'cheese', name:'قطعة شيدر',      en:'Cheddar Piece',    price:15, emoji:'🧀', img:'https://i.postimg.cc/4ywRJ3gz/5.jpg' },
        { id:'mushroom',     group:'cheese', name:'مشروم',          en:'Mushroom',         price:20, emoji:'🍄', img:'https://i.ibb.co/0jp3zbP9/image.png' },
        { id:'jalapeno',     group:'cheese', name:'هالبينو',        en:'Jalapeno',         price:10, emoji:'🌶️', img:'https://i.ibb.co/q3WCv2CN/jalipino.jpg' },
        { id:'pickles',      group:'cheese', name:'خيار مخلل',      en:'Pickles',          price:10, emoji:'🥒', img:'https://i.ibb.co/B27tHnLV/picles.png' },

        { id:'bun',          group:'bread',  name:'خبز كايزر',      en:'Bun',              price:5,  emoji:'🍞', img:'https://i.ibb.co/hR7dVyN5/image.jpg' },
        { id:'supreme',      group:'bread',  name:'خبز سوبريم',     en:'Supreme Bread',    price:15, emoji:'🥖', img:'https://i.ibb.co/rfQZ3fQf/image.png' },
        { id:'brioche',      group:'bread',  name:'خبز بريوش',      en:'Brioche Bread',    price:15, emoji:'🍞', img:'https://i.ibb.co/m5DKp2wT/images.jpg' },
        { id:'tortilla',     group:'bread',  name:'خبز تورتيلا',    en:'Tortilla Bread',   price:15, emoji:'🫓', img:'https://i.ibb.co/fz3jNJjK/image.jpg' },

        { id:'combo',        group:'combo',  name:'كومبو (بطاطس + مشروب)', en:'Combo',     price:50, emoji:'🍟', img:'https://i.ibb.co/gBfWM1B/Combo.png' }
    ];
    const getExtra = id => EXTRAS.find(e => e.id === id);

    /* ═══ الصوصات — hot:true = سبايسي. ضع رابط الصورة في img (لو فاضي بيظهر الإيموجي) ═══ */
    const SAUCES = [
        { name:'رانش كب',            en:'Ranch Cup',            price:20, hot:false, img:'https://i.ibb.co/6JWXhXkT/ransh.png' },
        { name:'مايونيز كب',         en:'Mayonnaise Cup',       price:25, hot:false, img:'https://i.ibb.co/Sw473tFD/image.jpg' },
        { name:'بيبر مايونيز كب',    en:'Pepper Mayonnaise Cup',price:25, hot:false, img:'https://i.ibb.co/WvCM8hTp/image.png' },
        { name:'ريد روستر صوص',      en:'Redrooster Sauce',     price:30, hot:false, img:'https://i.ibb.co/SDRwZhvr/image.png' },
        { name:'باربكيو صوص',        en:'Barbecue Sauce',       price:20, hot:false, img:'https://i.ibb.co/21bWFJJn/image.png' },
        { name:'تومية',              en:'Tomia',                price:15, hot:false, img:'https://i.ibb.co/wZYNK0hj/image.jpg' },
        { name:'تكساس كب',           en:'Texas Cup',            price:25, hot:false, img:'https://i.ibb.co/4wbRHXdF/image.jpg' },
        { name:'ثاوزند أيلاند',      en:'Thousand Island',      price:20, hot:false, img:'https://i.ibb.co/FbSQppY7/image.jpg' },
        { name:'مانجو صوص',          en:'Mango Sauce',          price:25, hot:true, img:'', off:false },   // off:true = غير متاح حاليًا (مخفي) — شيل off أو خليه false لإرجاعه

        { name:'شيلي مايونيز كب',    en:'Chili Mayonnaise Cup', price:25, hot:true,  img:'' },
        { name:'تايجر كب',           en:'Tiger Cup',            price:20, hot:true,  img:'' },
        { name:'سويت تشيلي',         en:'Sweet Chili',          price:20, hot:true,  img:'https://i.ibb.co/0y1QbFhD/image.png' },
        { name:'ديناميت صوص',        en:'Dynamite Sauce',       price:25, hot:true,  img:'https://i.ibb.co/Ps9FLRgS/image.png' }
    ];
    // أقسام مفيهاش اختيار "حار/عادي"
    const NO_SPICE_SECTIONS = ['extras', 'sauces', 'drinks', 'appetizers', 'beef-sandwiches', 'kids-meals'];
      const NO_CHIPS_SECTIONS = ['extras', 'sauces', 'drinks'];
    const QUICK_CHIPS = ['بدون صوص', 'بدون خضار', 'بدون مخلل', 'بدون بصل', 'بدون جبنة', 'صوص زيادة'];
    const NASH_LEVELS = [
        { v: 'Mild',  t: '🟢 Mild — خفيف' },
        { v: 'Hot',   t: '🟠 Hot — حار' },
        { v: 'Extra', t: '🔴 Extra — حار جداً' }
    ];

    const $ = id => document.getElementById(id);
    const fmt = n => n + ' ج.م';
    const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const toEn = s => String(s).replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));
    const LS = {
        get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch (e) { return d; } },
        set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); if (k === 'rr_cart') localStorage.setItem('rr_cart_t', String(Date.now())); } catch (e) {} }
    };
    // تطبيع النص العربي للبحث (يتجاهل التشكيل والهمزات والتاء المربوطة)
       const norm = s => toEn(String(s)).toLowerCase()
        .replace(/[\u064B-\u065F\u0670\u0640]/g, '')
        .replace(/[أإآ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه')
        .replace(/\s+/g, ' ').trim();

    // أصناف بيف داخل أقسام تانية (بالاسم)
    const NO_SPICE_NAMES = ['كومبو الروقان', 'عرض الفسحة 3'].map(s => norm(s));
    let cart = LS.get('rr_cart', []);
    let coupon = null; // { code, def }

    /* ═══ أصناف نفدت مؤقتًا — بتتحكم فيها من الداشبورد (تبويب "الأصناف") ═══ */
    const T = (ar, en) => document.documentElement.lang === 'en' ? en : ar;
    let SO = new Set((LS.get('rr_so', []) || []).map(norm));
    const baseName = s => String(s).replace(/\s*\(.*\)\s*$/, '');
    const optName = o => String(o).replace(/^➕\s*/, '').replace(/\s*\(\+\d+\)\s*$/, '').replace(/^[^:]*:\s*/, '');
    const isSO = n => SO.size > 0 && (SO.has(norm(n)) || SO.has(norm(baseName(n))));
    const soItem = i => isSO(i.name) || (i.opts || []).some(x => SO.has(norm(optName(x))));
    const soInCart = () => cart.filter(soItem).map(i => i.name);
    const soTag = i => soItem(i) ? `<div class="rr-so-tag">⛔ ${T('نفد مؤقتًا — احذفه من السلة', 'Sold out — please remove it')}</div>` : '';
    function soEn(n) {
        const k = norm(baseName(n)), el = [...document.querySelectorAll('[data-nm]')].find(b => norm(b.dataset.nm) === k || norm(baseName(b.dataset.nm)) === k);
        return (el && el.dataset.en) || n;
    }
    const soMsg = names => T('⛔ الأصناف دي نفدت مؤقتًا: ', '⛔ These items just sold out: ')
        + [...new Set(names)].map(n => T(n, soEn(n))).join(T('، ', ', '))
        + T(' — احذفها من السلة وكمّل طلبك.', ' — please remove them from your cart and continue.');
    function soBlocked(o) {
        if (isSO(o.name) || (o.opts || []).some(x => SO.has(norm(optName(x))))) {
            toast(T('⛔ الصنف ده نفد مؤقتًا — اختار حاجة تانية', '⛔ This item is currently sold out — please pick something else'), 4000);
            return true;
        }
        return false;
    }
    /* ═══ اختيارات العروض ═══ */
    const CHICKEN  = ['تركي ميلت', 'وايلد مشروم', 'تشيلي جان', 'سموكي تشيكن', 'مانجو فاير']; // كل الدجاج عدا المايتي زينجر
    const BEEF     = ['كلاسيك كينج', 'مشروم كراون', 'بيكون ستار', 'ريد وار', 'رويال بايت', 'ميكسكانو']; // عدا تاستي لورد وبيف تاشيو
    const TWISTER  = ['تويستر تشيكن', 'فاهيتا'];
    const SUPREME  = ['زينجر سوبريم', 'فيليه سوبريم'];
    const CHICKEN_SUP = CHICKEN.concat(SUPREME); // ساندوتشات الدجاج + السوبريم
    const RIZO = ['ريزو استربس باربكيو', 'ريزو فاهيتا باربكيو', 'ريزو استربس سبايسي تايجر', 'ريزو فاهيتا سبايسي'];
    const CHOICES_RAW = {
        'كلاسيك الروقان':   [{ title: 'ساندوتش التشيكن', options: CHICKEN_SUP }, { title: 'اختار كول سلو أو مشروب', options: ['كول سلو', 'مشروب'] }],
        'كومبو الروقان':    [{ title: 'ساندوتش البرجر',  options: BEEF }],
        'عرض الروقان 1':    [{ title: 'اختار نوع الدجاج', options: ['2 قطعة دجاج', '4 قطعة استربس'] }],
        'عرض الروقان 2':    [{ title: 'ساندوتش التشيكن', options: CHICKEN_SUP }],
        'عرض الروقان 3':    [{ title: 'التويستر', options: TWISTER }],
        'عرض الروقان 5':    [{ title: 'التويستر', options: TWISTER }, { title: 'السوبريم', options: SUPREME }],
        'دابل راب':         [{ title: 'الراب الأول', options: TWISTER }, { title: 'الراب التاني', options: TWISTER }],
        'عرض اللانش بوكس 1': [{ title: 'التويستر', options: TWISTER }],
                'عرض الفسحة 2':     [
            { title: 'ساندوتش التشيكن', options: CHICKEN },
            { title: 'التويستر',        options: TWISTER },
            { title: 'السوبريم',        options: SUPREME }
        ],
        'عرض الفسحة 3':     [
            { title: 'ساندوتش البيف الأول',  options: BEEF },
            { title: 'ساندوتش البيف التاني', options: BEEF }
        ],
        'عرض الريزو':       [{ title: 'نوع الريزو', options: RIZO }],
        'عرض الروقان 4':    [{ title: 'نوع الريزو', options: RIZO }],
        'عرض اللانش بوكس 2': [{ title: 'نوع الريزو', options: RIZO }],
        'Red Power Deal':   [
            { title: 'ساندوتش البيف',   options: BEEF },
            { title: 'ساندوتش التشيكن', options: CHICKEN_SUP }
        ],
    };
    // مفاتيح مطبّعة عشان الأرقام العربي (١) والإنجليزي (1) يشتغلوا سوا
    const CHOICES = {};
    Object.keys(CHOICES_RAW).forEach(k => CHOICES[norm(k)] = CHOICES_RAW[k]);
    /* ═══ مسار الطلب (إحصائيات مجهولة: كل جلسة بتتحسب مرة في كل مرحلة) ═══ */
    window.rrEv = function (e) {
        try { const s = sessionStorage, k = 'rr_ev_' + e; if (s.getItem(k)) return; s.setItem(k, '1');
            let sid = s.getItem('rr_sid'); if (!sid) { sid = Array.from(crypto.getRandomValues(new Uint8Array(8)), x => ('0' + x.toString(16)).slice(-2)).join(''); s.setItem('rr_sid', sid); }
            fetch(CONFIG.couponApi, { method: 'POST', keepalive: true, body: JSON.stringify({ action: 'ev', sid, e }) }).catch(() => {}); } catch (x) {}
    };
    rrEv('visit');
    if (window.rrMenuOvSync) rrMenuOvSync(CONFIG.couponApi);
    /* ═══ ساعات العمل ═══ */
    function isOpenNow() {
        const h = CONFIG.hours;
        if (!h.enabled) return true;
        let now;
        try {
            now = new Intl.DateTimeFormat('en-GB', { timeZone: h.tz, hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date());
        } catch (e) { const d = new Date(); now = d.getHours() + ':' + d.getMinutes(); }
        const m = t => { const [a, b] = t.split(':').map(Number); return a * 60 + b; };
        const n = m(now), o = m(h.open), c = m(h.close);
        return o <= c ? (n >= o && n < c) : (n >= o || n < c);
    }
    const t12 = t => { const h = +t.split(':')[0], m = t.split(':')[1], hh = (h % 12) || 12; return hh + (m !== '00' ? ':' + m : '') + ' ' + (h < 6 ? 'فجرًا' : h < 12 ? 'صباحًا' : 'مساءً'); };
    const closedMsg = () => `⏰ المطعم حاليًا مغلق لأنه خارج ساعات العمل، هننتظر تشريفك لينا بطلب في مواعيد العمل من ${t12(CONFIG.hours.open)} إلى ${t12(CONFIG.hours.close)} 🐓`;
    window.rrIsOpen = isOpenNow; window.rrClosedMsg = closedMsg;   /* السكربتات التانية تقرا نفس المواعيد (من الداشبورد) */
    /* شريط "مقفولين دلوقتي" أعلى الصفحة */
    (function closedBar() {
        const bar = document.createElement('div'); bar.className = 'rr-closed-bar';
        bar.style.cssText = 'display:none;background:#9E1B1B;color:#fff;text-align:center;font:800 .92rem Cairo,sans-serif;padding:9px 12px;position:relative;z-index:50';
        document.body.insertBefore(bar, document.body.firstChild);
        const sync = () => { const c = !isOpenNow(); bar.style.display = c ? 'block' : 'none'; if (c) bar.textContent = closedMsg(); };
        sync(); window.rrSync = sync; setInterval(sync, 30000);
    })();
    /* شريط إشعار: وقف التوصيل / وقت الزحمة (بيتحكم فيه المدير من الداشبورد) */
    const rrNotice = document.createElement('div');
    rrNotice.style.cssText = 'display:none;color:#fff;text-align:center;font:800 .9rem Cairo,sans-serif;padding:8px 12px;position:relative;z-index:49';
    document.body.insertBefore(rrNotice, document.body.firstChild);
    function paintNotice() {
        const c = window.RR_CFG || {}, p = c.pause || {}, b = c.busy || {};
        if (p.on) { rrNotice.style.background = '#9E1B1B'; rrNotice.textContent = '⏸️ ' + (p.msg || 'التوصيل متوقف مؤقتًا') + ' — الاستلام من الفرع شغال'; rrNotice.style.display = 'block'; }
        else if ((+b.extra || 0) > 0 || b.msg) { rrNotice.style.background = '#C98200'; rrNotice.textContent = '⏳ ' + (b.msg || 'ضغط كبير دلوقتي') + ((+b.extra || 0) > 0 ? ' — وقت التوصيل زاد حوالي ' + (+b.extra) + ' دقيقة' : ''); rrNotice.style.display = 'block'; }
        else rrNotice.style.display = 'none';
    }

    /* ═══ الحسابات ═══ */
    const subtotal = () => cart.reduce((s, i) => s + i.price * i.qty, 0);
    function discount() {
        if (!coupon) return 0;
        const sub = subtotal(), d = coupon.def;
        if (d.min && sub < d.min) return 0;
        const v = d.type === 'percent' ? Math.round(sub * d.value / 100) : d.value;
        return Math.min(v, sub);
    }

    /* ═══ السلة ═══ */
    function addItem(o) {
        if (soBlocked(o)) return;
        if (window.RR_EDIT_HOOK && window.RR_EDIT_HOOK(o)) return;   // وضع «إضافة صنف لطلب بيتعدّل» — الصنف بيروح للتعديل مش للسلة
        rrEv('cart');
        const full = o.label ? `${o.name} (${o.label})` : o.name;
        const opts = o.opts || [];
        const key = [full, o.price, opts.join(','), o.note || ''].join('|');
        const it = cart.find(i => i.key === key);
        if (it) it.qty += o.qty; else cart.push({ key, name: full, price: o.price, qty: o.qty, opts, note: o.note || '' });
        LS.set('rr_cart', cart); render(); toast('✅ تمت إضافة ' + full);
    }

    /* ═══ اقتراحات في السلة: مشروب / مقبلات لو مش موجودين (من أصناف الموقع نفسها وبأسعارها) ═══ */
    let UP_POOL = [];
    function upPool() {
        if (UP_POOL.length) return UP_POOL;
        ['drinks', 'appetizers'].forEach(sec => document.querySelectorAll('#' + sec + ' [data-cart="1"]').forEach(box => {
            if (box.querySelectorAll('.add-cart-btn').length !== 1) return;
            const pe = box.querySelector('.price-badge, .siniya-price'), price = pe ? parseInt((pe.textContent.match(/\d+/) || [0])[0], 10) : 0, name = box.dataset.nm;
            if (name && price) UP_POOL.push({ name, price, sec });
        }));
        return UP_POOL;
    }
    /* كل الأصناف اللي ليها سعر واحد (تتضاف بضغطة من غير اختيارات) — عشان اقتراحات «ناس كتير بتطلب معاه» */
    let ALL_POOL = null;
    function allPool() {
        if (ALL_POOL) return ALL_POOL; ALL_POOL = {};
        document.querySelectorAll('[data-cart="1"]').forEach(box => {
            if (box.querySelectorAll('.add-cart-btn').length !== 1) return;
            const pe = box.querySelector('.price-badge, .siniya-price'), price = pe ? parseInt((pe.textContent.match(/\d+/) || [0])[0], 10) : 0, name = box.dataset.nm;
            if (name && price) ALL_POOL[norm(baseName(name))] = { name, price };
        });
        return ALL_POOL;
    }
    let upShown = [];
    function upsellHtml() {
        const pool = upPool(); upShown = []; if (!cart.length) return '';
        const inCart = n => cart.some(i => baseName(i.name) === n);
        /* 1) من الطلبات الفعلية: الأصناف اللي بتتطلب مع اللي في السلة (السيرفر بيحسبها) */
        const hot = [], sg = window.RR_SG && window.RR_SG.pairs;
        if (sg) {
            const ap = allPool(), score = {};
            cart.forEach(i => (sg[baseName(i.name)] || []).forEach((n, r) => { const p = ap[norm(baseName(n))]; if (p && !isSO(p.name) && !inCart(p.name)) score[p.name] = (score[p.name] || 0) + (4 - r); }));
            Object.keys(score).sort((a, b) => score[b] - score[a]).slice(0, 3).forEach(n => { const p = Object.values(ap).find(x => x.name === n); if (p) hot.push(p); });
        }
        /* 2) احتياطي: مشروب / مقبلات لو مش موجودين (الأرخص) */
        const has = sec => cart.some(i => pool.some(p => p.sec === sec && p.name === baseName(i.name)));
        const pick = sec => has(sec) ? [] : pool.filter(p => p.sec === sec && !isSO(p.name) && !inCart(p.name)).sort((a, b) => a.price - b.price).slice(0, 2);
        upShown = hot.concat(pick('drinks').concat(pick('appetizers')).filter(p => !hot.some(h => h.name === p.name))).slice(0, 4);
        if (!upShown.length) return '';
        return '<div class="cart-up"><b>' + (hot.length ? '🔥 ناس كتير بتطلب معاه' : '😋 تحب تضيف على طلبك؟') + '</b><div class="row">' + upShown.map((p, i) => '<button type="button" data-up="' + i + '">+ ' + esc(p.name) + ' · ' + fmt(p.price) + '</button>').join('') + '</div></div>';
    }
    $('cartBody').addEventListener('click', e => { const b = e.target.closest('[data-up]'); if (!b) return; const p = upShown[+b.dataset.up]; if (p) addItem({ name: p.name, price: p.price, qty: 1 }); });

    window.rrReorder = function (items) {
        const cur = {}; document.querySelectorAll('.card').forEach(c => { const n = c.querySelector('.card-name'), p = c.querySelectorAll('.price-badge'); if (!n || p.length !== 1) return;
            const nm = (n.__nm !== undefined ? n.__nm : n.textContent).replace(/\s+/g, ' ').trim(), v = parseInt((p[0].textContent.match(/\d+/) || [0])[0], 10); if (nm && v) cur[nm] = v; });
        (items || []).forEach(i => { const nm = String(i.n).replace(/\s+/g, ' ').trim(), fresh = (!(i.o && i.o.length) && cur[nm]) ? cur[nm] : (+i.p || 0);
            addItem({ name: String(i.n), price: fresh, qty: Math.min(99, +i.q || 1), opts: i.o || [], note: i.t || '' }); }); };
    function render() {
        const count = cart.reduce((s, i) => s + i.qty, 0);
        document.querySelectorAll('.cart-count').forEach(e => { e.textContent = count; e.style.display = count ? 'flex' : 'none'; });
        const body = $('cartBody');
        if (!cart.length) {
            body.innerHTML = '<div class="cart-empty"><span>🛒</span>السلة فاضية.. ضيف أكلتك المفضلة!</div>';
            $('cartFoot').style.display = 'none';
            return;
        }
        $('cartFoot').style.display = '';
        const _st = body.scrollTop;
        const norm = s => s.replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d)).replace(/[^\u0600-\u06FFA-Za-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
        if (!window.__rrImgMap) {
            const map = {};
            const add = (nameEl, imgEl) => {
                if (!nameEl || !imgEl) return;
                const src = imgEl.getAttribute('src'); if (!src) return;
                const full = nameEl.textContent, ar = full.split(/[A-Za-z]/)[0];
                [norm(full), norm(ar)].forEach(k => { if (k && !map[k]) map[k] = src; });
            };
            document.querySelectorAll('.card').forEach(c => add(c.querySelector('.card-name'), c.querySelector('.card-img') || c.querySelector('img:not(.rr-fav)')));
            document.querySelectorAll('.siniya-card').forEach(c => add(c.querySelector('.siniya-card-name'), c.querySelector('img')));
            document.querySelectorAll('.school-featured').forEach(c => add(c.querySelector('.school-featured-name'), c.querySelector('img')));
            document.querySelectorAll('.siniya-featured').forEach(c => add(c.querySelector('.siniya-featured-name'), c.querySelector('img')));
            /* احتياطي: أي صورة alt بتطابق الاسم */
            document.querySelectorAll('img[alt]').forEach(im => { const a = norm(im.alt || ''); if (a && !map[a] && im.getAttribute('src')) map[a] = im.getAttribute('src'); });
            window.__rrImgMap = map;
        }
        const imgFor = name => {
            const map = window.__rrImgMap, full = norm(name), base = norm(name.replace(/\s*\(.*\)\s*$/, ''));
            if (map[full]) return map[full]; if (map[base]) return map[base];
            const k = Object.keys(map).find(x => x === base || x.startsWith(base + ' ') || base.startsWith(x + ' '));
            return k ? map[k] : '';
        };
        const rows = cart.map((i, idx) => {
            const extras = [...(i.opts || [])];
            const optsHtml = (extras.length || i.note)
                ? `<div class="cart-line-opts">${extras.length ? '<b>' + esc(extras.join(' • ')) + '</b>' : ''}${i.note ? (extras.length ? '<br>' : '') + '📝 ' + esc(i.note) : ''}</div>` : '';
            const src = imgFor(i.name);
            return `
            <div class="ct-row">
                <div class="ct-img">${src ? `<img src="${esc(src)}" alt="" loading="lazy" decoding="async">` : '🍗'}</div>
                <div class="ct-name"><div class="cart-line-name">${esc(i.name)}</div>${soTag(i)}${optsHtml}</div>
                <div class="ct-unit" data-l="السعر">${fmt(i.price)}</div>
                <div class="ct-qty">
                    <button type="button" data-act="inc" data-i="${idx}" aria-label="زيادة">+</button>
                    <input type="number" inputmode="numeric" min="1" max="99" value="${i.qty}" data-act="set" data-i="${idx}" aria-label="الكمية">
                    <button type="button" data-act="dec" data-i="${idx}" aria-label="نقص">−</button>
                </div>
                <div class="ct-tot" data-l="الإجمالي">${fmt(i.price * i.qty)}</div>
                <button type="button" class="ct-del" data-act="del" data-i="${idx}" aria-label="حذف">🗑️</button>
            </div>`;
        }).join('');
        body.innerHTML = `<div class="ct-head"><span>الصورة</span><span>المنتج</span><span>السعر</span><span>الكمية</span><span>الإجمالي</span><span>مسح</span></div>${rows}
            <button type="button" class="ct-clear" data-act="clear">🗑️ تفريغ السلة</button>`;
        body.insertAdjacentHTML('beforeend', upsellHtml());
        body.scrollTop = _st;
        const d = discount();
        $('cartDiscRow').style.display = d ? '' : 'none';
        $('cartDisc').textContent = '− ' + fmt(d);
        $('cartSubtotal').textContent = fmt(subtotal() - d);
        try { paintFreeBar(); } catch (e) {}
        if (coupon) refreshCouponMsg();
        window.rrSync && window.rrSync();
    }

    $('cartBody').addEventListener('click', e => {
        const b = e.target.closest('[data-act]'); if (!b) return;
        const i = +b.dataset.i, act = b.dataset.act;
        if (act === 'inc') cart[i].qty++;
        if (act === 'dec') { cart[i].qty--; if (cart[i].qty <= 0) cart.splice(i, 1); }
        if (act === 'del') cart.splice(i, 1);
        if (act === 'clear') { if (!confirm('تفريغ السلة بالكامل؟')) return; cart.length = 0; }
        LS.set('rr_cart', cart); render();
    });

    $('cartBody').addEventListener('change', e => {
        const el = e.target.closest('input[data-act="set"]'); if (!el) return;
        const i = +el.dataset.i; let q = parseInt(el.value, 10);
        if (!q || q < 1) q = 1; if (q > 99) q = 99;
        cart[i].qty = q; LS.set('rr_cart', cart); render();
    });

    /* ═══ الكوبون (بيتضاف تلقائي في السلة) ═══ */
    const foot = $('cartFoot');
    const dRow = document.createElement('div');
    dRow.innerHTML = `<div class="sum-row disc" id="cartDiscRow" style="display:none"><span>🎟️ خصم الكوبون</span><span id="cartDisc"></span></div>`;
    foot.insertBefore(dRow, foot.firstChild);
    /* خانة كود الخصم: في صفحة تأكيد الطلب، قبل زرار الإرسال على طول */
    const cBox = document.createElement('div');
    cBox.className = 'coupon-box';
    cBox.innerHTML = `
        <div class="form-title">🎟️ كود الخصم</div>
        <div class="coupon-row"><input id="couponInput" placeholder="اكتب كود الخصم هنا" autocomplete="off"><button type="button" id="couponBtn">تطبيق</button></div>
        <div class="coupon-msg" id="couponMsg"></div>`;
    const subBtn = $('checkoutForm').querySelector('[type=submit]');
    subBtn.parentNode.insertBefore(cBox, subBtn);
    if (!Object.keys(CONFIG.coupons).length) cBox.style.display = 'none';

    const cpList = document.createElement('div'); cpList.className = 'cp-list';
    cBox.insertBefore(cpList, cBox.querySelector('.coupon-row'));
    function buildCpList() {
        const items = Object.keys(CONFIG.coupons).filter(c => !CONFIG.coupons[c].hidden).map(c => { const d = CONFIG.coupons[c];
            return { code: c, txt: (d.type === 'percent' ? 'خصم ' + d.value + '%' : 'خصم ' + d.value + ' ج.م') + (d.min ? ' على طلب ' + d.min + ' ج.م+' : '') + (d.firstOrderOnly ? ' · لأول طلب' : '') + (d.expires ? ' · لحد ' + d.expires : '') }; });
        let mine = []; try { mine = JSON.parse(localStorage.getItem('rr_my_codes') || '[]'); } catch (e) {}
        mine.slice(0, 4).forEach(m => { if (m && m.code) items.push({ code: m.code, txt: '⭐ كود نقاطك — خصم ' + m.value + ' ج.م' }); });
        cpList.innerHTML = items.map(i => { const on = coupon && coupon.code === i.code;
            return '<button type="button" class="cp-item' + (on ? ' on' : '') + '" data-c="' + i.code + '"><span><b>' + i.code + '</b><small>' + i.txt + '</small></span><span class="go">' + (on ? '✓ مطبّق' : 'استخدم') + '</span></button>'; }).join('');
    }
    cpList.addEventListener('click', e => { const b = e.target.closest('.cp-item'); if (!b || b.classList.contains('on')) return; $('couponInput').value = b.dataset.c; $('couponBtn').click(); });
    buildCpList();
    new MutationObserver(buildCpList).observe($('couponMsg'), { childList: true, characterData: true, subtree: true });
    new MutationObserver(buildCpList).observe($('checkoutModal'), { attributes: true, attributeFilter: ['class'] });
    function setCouponMsg(t, ok) { const m = $('couponMsg'); m.textContent = t; m.className = 'coupon-msg ' + (ok ? 'ok' : 'bad'); }
    function refreshCouponMsg() {
        const d = coupon.def;
        if (d.min && subtotal() < d.min) setCouponMsg(`الكوبون يحتاج طلب بقيمة ${fmt(d.min)} أو أكتر`, false);
        else setCouponMsg(`✅ تم تطبيق ${coupon.code} — خصم ${fmt(discount())}`, true);
    }
    /* ═══ الكوبون لأول طلب بس: بنسجّل الكود اللي استخدم (على الجهاز + رقم الموبايل) ═══ */
    const normPhone = p => toEn(p || '').replace(/\D/g, '').replace(/^(0020|20)/, '0').slice(-11);
    const usedCoupons = () => LS.get('rr_used_coupons', {});
    function couponUsed(code, phone) {
        const u = usedCoupons()[code]; if (!u) return false;
        const p = normPhone(phone);
        /* التحقق بالرقم بس — الجهاز مش بيتحسب (قديم: u.device بقى متجاهَل) */
        return p.length === 11 && (u.phones || []).includes(p);
    }
    function markCouponUsed(code, phone, dev = true) {
        const all = usedCoupons(), u = all[code] || { phones: [] }, p = normPhone(phone);
        u.at = new Date().toISOString();
        if (!u.phones) u.phones = [];
        if (p.length === 11 && !u.phones.includes(p)) u.phones.push(p);
        all[code] = u; LS.set('rr_used_coupons', all);
    }
    const CP_ERR = { coupon_invalid: '❌ الكوبون غير صحيح أو متوقّف', coupon_expired: '⌛ الكوبون ده انتهت صلاحيته', coupon_limit: '😕 الكوبون ده العدد المتاح منه خلص', coupon_not_new: '🙋 الخصم ده للعملاء الجداد بس (أول طلب ليك)' };
    const USED_MSG = code => `❌ كود ${code} تم استخدامه من قبل. الخصم متاح لأول طلب بس.`;
    function dropUsedCoupon(phone) {
        if (coupon && coupon.def.firstOrderOnly && couponUsed(coupon.code, phone)) {
            const c = coupon.code; coupon = null; $('couponInput').value = '';
            setCouponMsg(USED_MSG(c), false); render(); renderSummary();
            toast('⚠️ كود ' + c + ' استخدم قبل كده، اتشال من طلبك');
            return true;
        }
        return false;
    }

    /* ═══ التحقق من السيرفر (Google Sheets) ═══ */
    const apiUrl = (q) => CONFIG.couponApi + (CONFIG.couponApi.includes('?') ? '&' : '?') + q;
    async function checkCoupon(code, phone) {
        if (!CONFIG.couponApi) return null;
        try {
            const r = await fetch(apiUrl('action=check&code=' + encodeURIComponent(code) + '&phone=' + normPhone(phone)));
            const j = await r.json(); return j && j.ok ? !!j.used : null;
        } catch (e) { return null; }
    }
    const phoneQ = () => { try { const p = normPhone($('f_phone').value || ''); return p.length === 11 ? '&phone=' + p : ''; } catch (e) { return ''; } };
    async function serverCouponDef(code) {
        if (!CONFIG.couponApi) return null;
        try { const r = await fetch(apiUrl('action=couponDef&code=' + encodeURIComponent(code) + phoneQ())), j = await r.json(); return j && j.ok ? j : null; } catch (e) { return null; }
    }
    async function claimCoupon(code, phone) {
        if (!CONFIG.couponApi) return 'local';
        try {
            const ctl = new AbortController(), to = setTimeout(() => ctl.abort(), 9000);
            const r = await fetch(CONFIG.couponApi, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ action: 'claim', code, phone: normPhone(phone) }), signal: ctl.signal });
            clearTimeout(to); const j = await r.json();
            return j && j.ok ? (j.used ? 'used' : 'ok') : 'error';
        } catch (e) { return 'error'; }
    }
    async function serverDrop(phone) {
        if (!coupon || !coupon.def.firstOrderOnly || !CONFIG.couponApi) return;
        const p = normPhone(phone); if (p.length !== 11) return;
        const code = coupon.code, used = await checkCoupon(code, p);
        if (used === true && coupon && coupon.code === code) { markCouponUsed(code, p); dropUsedCoupon(p); }
    }

    window.RR_API = CONFIG.couponApi;
    window.RR_ETA = CONFIG.eta;
    /* الكوبونات العامة من السيرفر (بتتدار من الداشبورد): بتضيف الجديد وبتشيل المتوقّف/المنتهي + متوسط وقت التوصيل الفعلي */
    (async function syncServerData() {
        if (!CONFIG.couponApi) return;
        try {
            const j = await (await fetch(apiUrl('action=coupons'))).json();
            if (j && j.ok && Array.isArray(j.coupons)) {
                const srv = {}; j.coupons.forEach(c => srv[c.code] = c);
                Object.keys(CONFIG.coupons).forEach(k => { if (!CONFIG.coupons[k].hidden && !srv[k]) delete CONFIG.coupons[k]; });
                j.coupons.forEach(c => { CONFIG.coupons[c.code] = { type: c.type, value: +c.value, min: +c.min || 0, firstOrderOnly: !!c.firstOrderOnly, expires: c.expires || '' }; });
                cBox.style.display = Object.keys(CONFIG.coupons).length ? '' : 'none'; buildCpList();
            }
        } catch (e) {}
        try { const j = await (await fetch(apiUrl('action=eta'))).json(); if (j && j.ok && j.eta) { window.RR_ETA_LIVE = j.eta; renderSummary(); } } catch (e) {}
        try { await loadServerConfig(); } catch (e) {}
        try { const j = await (await fetch(apiUrl('action=suggest'))).json(); if (j && j.ok) { window.RR_SG = j; render(); } } catch (e) {}
    })();
    /* إعدادات من الشيت: مواعيد · مناطق ورسوم · زحمة · وقف التوصيل (لو الشيت فاضي بنكمّل بالقيم المكتوبة في الموقع) */
    async function loadServerConfig() {
        const j = await (await fetch(apiUrl('action=config'))).json(); if (!j || !j.ok) return;
        window.RR_CFG = j;
        try { applyPayCfg(); } catch (e) {}
        try { window.rrSchedShow && rrSchedShow(); } catch (e) {}
        if (j.hours) { CONFIG.hours.enabled = !!j.hours.enabled; if (j.hours.open) CONFIG.hours.open = j.hours.open; if (j.hours.close) CONFIG.hours.close = j.hours.close; if (window.rrSync) window.rrSync(); if (window.rrTick) window.rrTick(); }
        if (Array.isArray(j.areas) && j.areas.length) {
            const cur = areaVal.value !== '' && CONFIG.areas[+areaVal.value] ? CONFIG.areas[+areaVal.value].name : (window.RR_SAVED_AREA || '');
            CONFIG.areas.length = 0; j.areas.forEach(a => CONFIG.areas.push({ name: a.name, fee: +a.fee || 0 }));
            const ni = cur ? CONFIG.areas.findIndex(a => a.name === cur) : -1;
            if (ni >= 0) { areaVal.value = ni; areaQ.value = CONFIG.areas[ni].name; }
            else if (areaVal.value !== '') { areaVal.value = ''; areaQ.value = ''; toast('⚠️ المنطقة اللي اخترتها مش متاحة للتوصيل دلوقتي — اختار منطقة تانية', 6000); }
        }
        paintNotice(); renderSummary(); window.rrSync && window.rrSync();
        try { render(); } catch (e) {}
    }
    async function applyLoyalty(code) {
        setCouponMsg('⏳ بنتحقق من الكود...', true);
        try {
            const r = await fetch(apiUrl('action=validate&code=' + encodeURIComponent(code) + phoneQ())), j = await r.json();
            if (j && j.ok && j.valid) { coupon = { code, def: { type: 'fixed', value: +j.value, loyalty: true } }; render(); renderSummary(); return; }
            coupon = null; setCouponMsg(j && j.ok && j.used ? '❌ كود النقاط ده اتستخدم قبل كده' : '❌ كود النقاط غير صحيح', false); render(); renderSummary();
        } catch (e) { coupon = null; setCouponMsg('⚠️ تعذّر التحقق من الكود، جرّب تاني', false); render(); renderSummary(); }
    }
    $('couponBtn').addEventListener('click', async () => {
        const code = $('couponInput').value.trim().toUpperCase();
        const upd = () => { render(); renderSummary(); };
        if (!code) { coupon = null; setCouponMsg('', true); upd(); return; }
        if (/^RR-/.test(code) && CONFIG.couponApi) { applyLoyalty(code); return; }
        let def = CONFIG.coupons[code];
        if (CONFIG.couponApi) {   /* السيرفر هو المرجع (تفعيل/تاريخ/عدد) — ولو مفيش نت بنستخدم النسخة المحلية */
            setCouponMsg('⏳ بنتحقق من الكود...', true);
            const r = await serverCouponDef(code);
            if (r) {
                if (!r.found) { coupon = null; setCouponMsg(CP_ERR[r.reason] || '❌ الكوبون غير صحيح', false); upd(); return; }
                def = { type: r.def.type, value: +r.def.value, min: +r.def.min || 0, firstOrderOnly: !!r.def.firstOrderOnly };
            }
        }
        if (!def) { coupon = null; setCouponMsg('❌ الكوبون غير صحيح', false); upd(); return; }
        if (def.firstOrderOnly) {
            /* التحقق بالرقم بس: لازم رقم الموبايل يكون مكتوب وصحيح */
            const ph = $('f_phone').value;
            if (!phoneOk(ph)) {
                coupon = null; setCouponMsg('📞 اكتب رقم موبايلك الأول (11 رقم) عشان نتحقق من الكود', false); upd();
                $('f_phone').focus(); return;
            }
            if (couponUsed(code, ph)) { coupon = null; setCouponMsg(USED_MSG(code), false); upd(); return; }
            setCouponMsg('⏳ بنتحقق من الكود...', true);
            const used = await checkCoupon(code, ph);
            if (normPhone($('f_phone').value) !== normPhone(ph)) { setCouponMsg('📞 رقم الموبايل اتغيّر، دوس تطبيق تاني', false); return; }
            if (used === true) { markCouponUsed(code, ph); coupon = null; setCouponMsg(USED_MSG(code), false); upd(); return; }
        }
        coupon = { code, def }; upd();
    });
    $('couponInput').addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); $('couponBtn').click(); } });

    /* ═══ فتح/قفل ═══ */
    function openEl(id) { $(id).classList.add('open'); $('rrOverlay').classList.add('open'); document.body.classList.add('no-scroll'); }
    function closeAll() {
        ['cartDrawer', 'checkoutModal', 'itemModal', 'rrOverlay'].forEach(id => $(id).classList.remove('open'));
        document.body.classList.remove('no-scroll');
    }
    document.querySelectorAll('[data-close]').forEach(b => b.addEventListener('click', closeAll));
    $('rrOverlay').addEventListener('click', closeAll);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAll(); });
    function openCart() { closeAll(); openEl('cartDrawer'); }
    window.rrOpenCart = openCart;

    /* ═══ زراير السلة (عائم + الهيدر) ═══ */
    const fab = document.createElement('button');
    fab.className = 'cart-fab';
    fab.innerHTML = '🛒 السلة <span class="cart-count"></span>';
    fab.onclick = openCart;
    document.body.appendChild(fab);

    const headBtn = document.createElement('button');
    headBtn.className = 'cart-head-btn';
    headBtn.setAttribute('aria-label', 'السلة');
    headBtn.innerHTML = '🛒<span class="cart-count"></span>';
    headBtn.onclick = openCart;
    const hb = $('hamburger');
    hb.parentNode.insertBefore(headBtn, hb);

    /* ═══ بوب أب الصنف ═══ */
    /* ═══ قواعد الاقتراحات: حسب الاسم (أولوية) أو حسب القسم ═══ */
    const SUGGEST_BY_NAME_RAW = {
        'تركي ميلت':        ['smokedturkey', 'beefbacon', 'cheese', 'jalapeno', 'combo'],
        'ناش كول':          ['cheese', 'jalapeno', 'pickles', 'combo'],
        'سويتي هيت ناش':    ['cheese', 'jalapeno', 'pickles', 'combo'],
        'ناش راب':          ['cheese', 'jalapeno', 'combo'],
        'مايتي دبل ناشفيل': ['cheese', 'beefbacon', 'jalapeno', 'pickles', 'combo'],
        'مانجو فاير':       ['cheese', 'mozzarella', 'combo'],
        'مايتي زينجر':      ['beefbacon', 'smokedturkey', 'jalapeno', 'combo']
    };
    const SUGGEST_BY_SECTION = {
        'beef-sandwiches':    ['beefbacon', 'cheese', 'mushroom', 'jalapeno', 'combo'],
        'chicken-sandwiches': ['smokedturkey', 'beefbacon', 'cheese', 'jalapeno', 'combo'],
        'twister-supreme':    ['smokedturkey', 'roastbeef', 'cheese', 'combo']
    };
    const SUGGEST_BY_NAME = {};
    Object.keys(SUGGEST_BY_NAME_RAW).forEach(k => SUGGEST_BY_NAME[norm(k)] = SUGGEST_BY_NAME_RAW[k]);
    const suggestFor = o => (SUGGEST_BY_NAME[norm(o.name)] || SUGGEST_BY_SECTION[o.sec] || [])
        .map(getExtra).filter(Boolean).filter(x => !isSO(x.name));
    let cur = null;
    const imType = $('im_type'), imChips = $('im_chips');
    const imChoices = $('im_choices');
    const imSuggest = $('im_suggest');
    const imNash = $('im_nash');
    const NASH_SAUCE_PRICE = 25;
    let nashN = 0, nashMax = 0, nashLvl = 'Mild';
    const extrasSum = () => [...imSuggest.querySelectorAll('.sg-card.sel')].reduce((t, b) => t + (+b.dataset.price), 0) + nashN * NASH_SAUCE_PRICE;
    // عدد قطع الدجاج + الاستربس في الصنف (من الوصف، أو الاسم لو مفيش وصف)
    const PIECE_WORDS = { 'اربع': 4, 'ثلاث': 3, 'خمس': 5, 'ست': 6 };
    const chickenPieces = o => {
        const t = norm(o.desc || o.name);
        const re = /(\d+|اربع|ثلاث|خمس|ست)?\s*(قطعتين|قطعه|قطع)\s*(?:كرسبي\s*)?(?:دجاج|استربس|استريبس|استرايبس)/g;
        const counts = []; let m;
        while ((m = re.exec(t))) {
            counts.push(m[1] ? (PIECE_WORDS[m[1]] || +m[1]) : (m[2] === 'قطعتين' ? 2 : 1));
        }
        if (!counts.length) return 0;
        return / او /.test(t) ? Math.max(...counts) : counts.reduce((x, y) => x + y, 0);
    };
    function paintNash() {
        const n = $('nsN'); if (!n) return;
        n.textContent = nashN;
        $('nsLvl').style.display = nashN ? '' : 'none';
        $('nsSum').textContent = nashN ? `+${nashN * NASH_SAUCE_PRICE} ج.م` : '';
        paintQty();
    }
    imNash.addEventListener('click', e => {
        const b = e.target.closest('button'); if (!b) return;
        if (b.id === 'nsPlus' && nashN < nashMax) nashN++;
        else if (b.id === 'nsMinus' && nashN > 0) nashN--;
        else if (b.dataset.lvl) {
            nashLvl = b.dataset.lvl;
            imNash.querySelectorAll('[data-lvl]').forEach(x => x.classList.toggle('sel', x === b));
            return;
        }
        paintNash();
    });
    imSuggest.addEventListener('click', e => {
        const b = e.target.closest('.sg-card'); if (!b) return;
        b.classList.toggle('sel'); paintQty();
    });
    imChoices.addEventListener('click', e => {
        const b = e.target.closest('button'); if (!b) return;
        const g = b.closest('.choice-group');
        g.querySelectorAll('button').forEach(x => x.classList.remove('sel'));
        b.classList.add('sel'); g.classList.remove('err');
    });
    function paintQty() {
        $('im_qty').textContent = cur.qty;
        $('im_total').textContent = fmt((cur.price + extrasSum()) * cur.qty);
    }
    function openItem(o) {
        cur = { ...o, qty: 1 };
        $('im_title').textContent = o.label ? `${o.name} (${o.label})` : o.name;
        $('im_price').textContent = fmt(o.price);
        $('im_note').value = '';

        // النوع: ناشفيل (درجة الحرارة) أو حار/عادي أو مفيش
        const list = o.nash ? NASH_LEVELS.map(x => ({ v: x.v, t: x.t }))
                   : o.spice ? [{ v: 'عادي', t: 'عادي' }, { v: 'حار 🌶️', t: 'حار 🌶️' }] : [];
        $('im_type_wrap').style.display = list.length ? '' : 'none';
        $('im_type_title').textContent = o.nash ? '🔥 درجة الناشفيل' : 'النوع';
        imType.innerHTML = list.map((x, i) => `<button type="button" data-v="${esc(x.v)}" class="${i === 0 ? 'sel' : ''}">${esc(x.t)}</button>`).join('');

        const noChips = NO_CHIPS_SECTIONS.includes(o.sec);
imChips.innerHTML = noChips ? '' : QUICK_CHIPS.map(c => `<button type="button" data-v="${esc(c)}">${esc(c)}</button>`).join('');
imChips.previousElementSibling.style.display = noChips ? 'none' : '';
        const groups = CHOICES[norm(o.name)] || [];
        imChoices.innerHTML = groups.map(g => `
            <div class="choice-group" data-title="${esc(g.title)}">
                <div class="form-title">${esc(g.title)} <i class="req">*</i></div>
                <div class="opt-row">${g.options.map(x => `<button type="button" data-v="${esc(x)}"${isSO(x) ? ' class="rr-so-opt" disabled' : ''}>${esc(x)}</button>`).join('')}</div>
            </div>`).join('');
        nashN = 0; nashLvl = 'Mild'; nashMax = o.nash ? 0 : chickenPieces(o);
        imNash.innerHTML = nashMax ? `
            <div class="nash-up">
                <div class="form-title">🔥 عايز الدجاج أو الاستربس ناشفيل؟</div>
                <p class="nash-note">لو حابب الدجاج أو الاستربس ده يبقى ناشفيل، ضيف ناش صوص بـ ${NASH_SAUCE_PRICE} ج.م للقطعة وهتتحول لناشفيل.</p>
                <div class="nash-ctl">
                    <div class="qty"><button type="button" id="nsPlus">+</button><span id="nsN">0</span><button type="button" id="nsMinus">−</button></div>
                    <small>عدد القطع اللي تتحول (لحد ${nashMax})</small>
                    <b id="nsSum"></b>
                </div>
                <div id="nsLvl" style="display:none"><div class="form-title">🌶️ اختار درجة الناشفيل</div><div class="opt-row">${NASH_LEVELS.map(x => `<button type="button" data-lvl="${esc(x.v)}" class="${x.v === 'Mild' ? 'sel' : ''}">${esc(x.t)}</button>`).join('')}</div></div>
            </div>` : '';
        const sg = suggestFor(o);
        imSuggest.innerHTML = sg.length ? `
            <div class="form-title">⭐ زوّد ساندوتشك</div>
            <div class="sg-row">${sg.map(x => `
                <button type="button" class="sg-card" data-price="${x.price}" data-name="${esc(x.name)}">
                    ${x.img ? `<img class="sg-ph" src="${esc(x.img)}" alt="">` : `<span class="sg-ph">${x.emoji}</span>`}
                    <b>${esc(x.name)}</b><small>+${x.price} ج.م</small>
                </button>`).join('')}
            </div>` : '';
        paintQty(); closeAll(); openEl('itemModal');
    }
    imType.addEventListener('click', e => {
        const b = e.target.closest('button'); if (!b) return;
        imType.querySelectorAll('button').forEach(x => x.classList.remove('sel')); b.classList.add('sel');
    });
    imChips.addEventListener('click', e => { const b = e.target.closest('button'); if (b) b.classList.toggle('sel'); });
    $('im_inc').onclick = () => { cur.qty++; paintQty(); };
    $('im_dec').onclick = () => { if (cur.qty > 1) { cur.qty--; paintQty(); } };
    $('im_add').onclick = () => {
        const opts = [];
        let missing = null;
        imChoices.querySelectorAll('.choice-group').forEach(g => {
            const s = g.querySelector('button.sel');
            if (!s) { g.classList.add('err'); missing = missing || g; }
            else opts.push(g.dataset.title + ': ' + s.dataset.v);
        });
        if (missing) {
            toast('من فضلك اختار: ' + missing.dataset.title);
            missing.scrollIntoView({ block: 'center', behavior: 'smooth' });
            return;
        }
        const t = imType.querySelector('button.sel'); if (t) opts.push(cur.nash ? 'ناشفيل ' + t.dataset.v : t.dataset.v);
        imChips.querySelectorAll('button.sel').forEach(b => opts.push(b.dataset.v));
        if (nashN) opts.push(`🔥 ناش صوص × ${nashN} (+${nashN * NASH_SAUCE_PRICE}) — ناشفيل ${nashLvl}`);
        const extraBtns = [...imSuggest.querySelectorAll('.sg-card.sel')];
        extraBtns.forEach(b => opts.push('➕ ' + b.dataset.name + ' (+' + b.dataset.price + ')'));
        addItem({ name: cur.name, label: cur.label, price: cur.price + extrasSum(), qty: cur.qty, opts, note: $('im_note').value.trim() });
        closeAll();
    };
    /* ═══ اختيار المنطقة (بحث) ═══ */
    const areaQ = $('f_area_q'), areaVal = $('f_area'), areaList = $('areaList');
    let hlIdx = -1, shown = [];

    function setArea(i) {
        areaVal.value = i;
        areaQ.value = CONFIG.areas[i].name;
        areaList.classList.remove('open'); areaQ.setAttribute('aria-expanded', 'false');
        areaQ.parentNode.parentNode.classList.remove('err');
        renderSummary();
    }
    function paintList() {
        const q = norm(areaQ.value);
        const words = q.split(' ').filter(Boolean);
        shown = CONFIG.areas.map((a, i) => ({ a, i }))
            .filter(x => { const n = norm(x.a.name); return words.every(w => n.includes(w)); });
        hlIdx = shown.length ? 0 : -1;
        areaList.innerHTML = shown.length
            ? shown.map((x, k) => `<div class="combo-item${k === 0 ? ' hl' : ''}" data-i="${x.i}" role="option"><span>${esc(x.a.name)}</span><b>${x.a.fee} ج.م</b></div>`).join('')
            : '<div class="combo-empty">مفيش منطقة بالاسم ده 🤔</div>';
        areaList.classList.add('open'); areaQ.setAttribute('aria-expanded', 'true');
    }
    function moveHl(d) {
        const items = areaList.querySelectorAll('.combo-item'); if (!items.length) return;
        items[hlIdx]?.classList.remove('hl');
        hlIdx = (hlIdx + d + items.length) % items.length;
        items[hlIdx].classList.add('hl'); items[hlIdx].scrollIntoView({ block: 'nearest' });
    }
    areaQ.addEventListener('focus', paintList);
    areaQ.addEventListener('input', () => { areaVal.value = ''; renderSummary(); paintList(); });
    areaQ.addEventListener('keydown', e => {
        if (e.key === 'ArrowDown') { e.preventDefault(); moveHl(1); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); moveHl(-1); }
        else if (e.key === 'Enter' && areaList.classList.contains('open')) {
            e.preventDefault(); if (shown[hlIdx]) setArea(shown[hlIdx].i);
        }
    });
    // mousedown بدل click عشان الـ blur ما يقفلش القائمة قبل الاختيار
    areaList.addEventListener('mousedown', e => {
        const it = e.target.closest('.combo-item'); if (!it) return;
        e.preventDefault(); setArea(+it.dataset.i);
    });
    document.addEventListener('click', e => { if (!e.target.closest('.combo')) areaList.classList.remove('open'); });

    /* ═══ إتمام الطلب ═══ */
    const fields = ['name', 'phone', 'phone2', 'street', 'station', 'building', 'floor', 'apt', 'landmark'];
    const saved = LS.get('rr_customer', {});
    fields.forEach(f => { if (saved[f]) $('f_' + f).value = saved[f]; });
    { let sn = null; try { sn = localStorage.getItem('rr_area_n'); } catch (e) {} window.RR_SAVED_AREA = sn;
      const si = sn ? CONFIG.areas.findIndex(a => a.name === sn) : (saved.area !== undefined ? +saved.area : -1);
      if (si >= 0 && CONFIG.areas[si]) { areaVal.value = si; areaQ.value = CONFIG.areas[si].name; } }

    const pk = () => $('f_type').value === 'pickup';
    const PAY_NUM = '01062516200';
    function payLines() {
        const p = $('f_pay').value;
        if (p === 'wallet') return ['💳 *الدفع:* محفظة إلكترونية (فودافون كاش)', '📲 التحويل على الرقم: ' + PAY_NUM, '📸 هبعتلكم صورة التحويل هنا على الواتساب لتأكيد الطلب'];
        if (p === 'instapay') return ['💳 *الدفع:* حساب بنكي (إنستا باي)', '📲 التحويل على الرقم: ' + PAY_NUM, '📸 هبعتلكم صورة التحويل هنا على الواتساب لتأكيد الطلب'];
        return ['💵 الدفع: كاش عند الاستلام'];
    }
    let RR_LOC = null;
    (function () { const b = $('locBtn'), m = $('locMsg');
        b.addEventListener('click', () => {
            if (RR_LOC) { RR_LOC = null; b.textContent = '📍 استخدم موقعي الحالي'; m.textContent = ''; return; }
            if (!navigator.geolocation) { m.textContent = 'المتصفح مش بيدعم تحديد الموقع'; return; }
            b.disabled = true; m.textContent = '⏳ بنحدد موقعك...';
            navigator.geolocation.getCurrentPosition(p => { b.disabled = false; RR_LOC = { lat: p.coords.latitude, lon: p.coords.longitude }; b.textContent = '✖ إزالة الموقع'; m.textContent = '✅ تم تحديد موقعك (دقة حوالي ' + Math.round(p.coords.accuracy) + ' متر)'; },
                () => { b.disabled = false; m.textContent = '⚠️ مقدرناش نحدد موقعك — اسمح للمتصفح بالموقع أو كمّل بالعنوان بس'; }, { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 });
        }); })();
    function applyPayCfg() {
        const p = (window.RR_CFG && RR_CFG.pay) || null; if (!p) return;
        const msg = p.msg || 'غير متاحة حاليًا';
        document.querySelectorAll('#paygrid button').forEach(b => {
            const off = p[b.dataset.v] === false, sm = b.querySelector('small');
            b.disabled = off; b.style.opacity = off ? '.45' : ''; b.style.cursor = off ? 'not-allowed' : '';
            if (sm) { if (!b.dataset.t) b.dataset.t = sm.textContent; sm.textContent = off ? msg : b.dataset.t; }
        });
        if (p[$('f_pay').value] === false) { const f = ['cash', 'wallet', 'instapay'].find(k => p[k] !== false); if (f) setPay(f); }
    }
    function setPay(v) {
        $('f_pay').value = v;
        $('payRefBox').style.display = v === 'cash' ? 'none' : '';
        document.querySelectorAll('#paygrid button').forEach(b => b.classList.toggle('on', b.dataset.v === v));
        const n = $('payNote');
        if (v === 'cash') n.innerHTML = '💵 الدفع كاش عند الاستلام. الطلب بيوصلنا مباشرة من الموقع وهنكلمك نأكده.';
        else n.innerHTML = '📲 برجاء التحويل على الرقم التالي: <b class="pay-num" id="payNum">' + PAY_NUM + '</b> <button type="button" id="payCopy">نسخ الرقم</button><br>📸 بعد تأكيد الطلب ابعتلنا <b>صورة التحويل على الواتساب (01023278000)</b> لتأكيده.';
    }
    document.querySelectorAll('#paygrid button').forEach(b => b.addEventListener('click', () => setPay(b.dataset.v)));
    document.addEventListener('click', e => { if (e.target.id === 'payCopy') { (navigator.clipboard ? navigator.clipboard.writeText(PAY_NUM) : Promise.reject()).then(() => toast('✅ تم نسخ الرقم'), () => toast('الرقم: ' + PAY_NUM)); } });
    /* ═══ التوصيل المجاني: لو المطعم مفعّله من الداشبورد، صافي الطلب (بعد الخصم) لما يوصل للحد → التوصيل ببلاش (دليفري بس) ═══ */
    function pkNow() { const t = document.getElementById('f_type'); return !!t && t.value === 'pickup'; }
    function freeCfg() { const f = window.RR_CFG && RR_CFG.free; return (f && f.on && +f.min > 0) ? { on: true, min: +f.min } : { on: false, min: 0 }; }
    function freeApplies() { const f = freeCfg(); return f.on && !pkNow() && (subtotal() - discount()) >= f.min; }
    function freeBarHtml() {
        const f = freeCfg(); if (!f.on || pkNow() || !cart.length) return '';
        const net = Math.max(0, subtotal() - discount()), left = Math.max(0, Math.ceil(f.min - net)), pct = Math.min(100, Math.round(net / f.min * 100));
        return '<div class="free-bar' + (left ? '' : ' ok') + '" role="status"><div class="fb-t">' + (left ? '🛵 فاضل <b>' + fmt(left) + '</b> وتوصيلك ببلاش' : '🎉 مبروك! <b>توصيلك ببلاش</b>') + '</div><div class="fb-track"><i style="width:' + pct + '%"></i></div></div>';
    }
    function paintFreeBar() {
        const f = document.getElementById('cartFoot'); if (!f) return;
        let b = document.getElementById('freeBar'); if (!b) { b = document.createElement('div'); b.id = 'freeBar'; f.insertBefore(b, f.firstChild); }
        b.innerHTML = freeBarHtml();
    }
    const curFee = () => pk() ? 0 : (areaVal.value === '' ? null : (freeApplies() ? 0 : CONFIG.areas[+areaVal.value].fee));
    function setType(v) {
        $('f_type').value = v;
        document.querySelectorAll('#otype button').forEach(b => b.classList.toggle('on', b.dataset.v === v));
        const p = v === 'pickup';
        $('pickupBox').style.display = p ? '' : 'none';
        $('addrTitle').style.display = p ? 'none' : '';
        ['f_area_q', 'f_street', 'f_station', 'f_building', 'f_floor', 'f_apt', 'f_landmark', 'locBtn', 'f_phone2'].forEach(id => { const w = $(id).closest('.field'); if (w) w.style.display = p ? 'none' : ''; });
        document.querySelector('#checkoutModal .drawer-head h3').textContent = p ? '📝 بيانات الاستلام' : '📝 بيانات التوصيل';
        document.querySelectorAll('#checkoutForm .field.err').forEach(f => f.classList.remove('err'));
        renderSummary();
        if (window.rrSchedShow) rrSchedShow();
    }
    document.querySelectorAll('#otype button').forEach(b => b.addEventListener('click', () => setType(b.dataset.v)));
    window.rrArea = { areas: CONFIG.areas, set: setArea, setType: setType, fee: curFee, pk: pk, idx: () => areaVal.value, net: () => subtotal() - discount() };

    /* وقت التوصيل المتوقع: متوسط فعلي للمنطقة المختارة (لو متاح) + زيادة وقت الزحمة */
    function etaMin() {
        const L = window.RR_ETA_LIVE || {}, ar = areaVal.value !== '' && CONFIG.areas[+areaVal.value] ? CONFIG.areas[+areaVal.value].name : '';
        const base = (L.areas && ar && L.areas[ar]) || L.delivery || (CONFIG.eta && CONFIG.eta.delivery) || 45, c = window.RR_CFG || {};
        return { m: base + ((c.busy && +c.busy.extra) || 0), busy: !!(c.busy && +c.busy.extra > 0), area: !!(L.areas && ar && L.areas[ar]) };
    }
    function deliveryNote() {
        const c = window.RR_CFG || {};
        if (c.pause && c.pause.on) return `<div class="delivery-time-note" style="border-color:#9E1B1B;color:#9E1B1B">⏸️ ${esc(c.pause.msg || 'التوصيل متوقف مؤقتًا')} — اختار «استلام من الفرع» لو حابب.</div>`;
        if (typeof SC !== 'undefined' && SC && SC.mode === 'later' && $('f_sched').value) return `<div class="delivery-time-note" style="border-color:#7C3AED;color:#5B21B6">⏰ طلبك محجوز لميعاد <b>النهاردة ${esc(timeLabel(+$('f_sched').value))}</b> — هنكلمك نأكد الحجز.</div>`;
        const e = etaMin();
        return `<div class="delivery-time-note">⏱️ وقت التوصيل المتوقع${e.area ? ' لمنطقتك' : ' حاليًا'} حوالي ${e.m} دقيقة${e.busy || e.m > 55 ? '' : ' — والحد الأقصى 60 دقيقة من تأكيد الأوردر'}${c.busy && c.busy.msg ? '<br><small>' + esc(c.busy.msg) + '</small>' : ''}</div>`;
    }
    function renderSummary() {
        window.rrSync && window.rrSync();
        const fee = curFee(), sub = subtotal(), d = discount();
        $('checkoutSummary').innerHTML =
            cart.map(i => `<div class="mini"><span>${i.qty} × ${esc(i.name)}${(i.opts && i.opts.length) ? ' <small>(' + esc(i.opts.join('، ')) + ')</small>' : ''}${i.note ? ' <small>📝 ' + esc(i.note) + '</small>' : ''}</span><span>${fmt(i.price * i.qty)}</span></div>`).join('') +
            freeBarHtml() +
            `<div class="sum-row" style="margin-top:10px"><span>المجموع</span><span>${fmt(sub)}</span></div>` +
            (d ? `<div class="sum-row disc"><span>🎟️ خصم (${esc(coupon.code)})</span><span>− ${fmt(d)}</span></div>` : '') +
            `<div class="sum-row"><span>${pk() ? 'استلام من الفرع' : 'التوصيل'}</span><span>${pk() ? 'بدون رسوم' : (fee === null ? 'اختار المنطقة' : (fee === 0 && freeApplies() ? '<b class="free-tag">مجاني 🎉</b>' : fmt(fee)))}</span></div>` +
            `<div class="sum-row total"><span>الإجمالي</span><span>${fmt(sub - d + (fee || 0))}</span></div>` +
            (pk() ? '' : deliveryNote());
    }

    $('goCheckout').addEventListener('click', () => {
        if (!isOpenNow() && !schedCfg().on) { toast(closedMsg()); return; }
        if (CONFIG.minOrder && subtotal() < CONFIG.minOrder) { toast(`أقل قيمة للطلب ${fmt(CONFIG.minOrder)}`); return; }
        { const so = soInCart(); if (so.length) { toast(soMsg(so), 6500); return; } refreshSoldout(); }
        closeAll(); renderSummary(); openEl('checkoutModal'); schedShow(); rrEv('checkout');
    });

    const phoneOk = v => /^01[0125]\d{8}$/.test(toEn(v).replace(/\D/g, ''));

    function validate() {
        let ok = true, first = null;
        let need = { name: v => v.trim().length > 1, phone: phoneOk, street: v => v.trim(), building: v => v.trim(), floor: v => v.trim(), apt: v => v.trim(), landmark: v => v.trim() };
        if (pk()) need = { name: need.name, phone: need.phone, ptime: v => v };
        Object.keys(need).forEach(k => {
            const el = $('f_' + k), good = !!need[k](el.value);
            (el.closest('.field') || el.parentNode).classList.toggle('err', !good);
            if (!good) { ok = false; first = first || el; }
        });
        const p2 = $('f_phone2'), p2ok = pk() || !p2.value.trim() || phoneOk(p2.value);
        p2.parentNode.classList.toggle('err', !p2ok);
        if (!p2ok) { ok = false; first = first || p2; }
        const aok = pk() || areaVal.value !== '';
        areaQ.parentNode.parentNode.classList.toggle('err', !aok);
        if (!aok) { ok = false; first = first || areaQ; }
        if (!pk() && SC.mode === 'later' && !$('f_sched').value) { ok = false; toast('اختار ميعاد التوصيل'); }
        if (ok && !pickCheck()) { ok = false; first = first || $('ptText'); }
        if (first) first.focus();
        return ok;
    }

    $('f_phone').addEventListener('change', () => { if (!dropUsedCoupon($('f_phone').value)) serverDrop($('f_phone').value); });

    /* ═══ رسالة فشل الإرسال + زرار "حاول تاني" ═══ */
    const failBox = $('rrFail');
    let failSt = null;
    function paintFail() {
        if (!failSt) { failBox.classList.remove('show'); failBox.innerHTML = ''; return; }
        const so = failSt.k === 'so';
        failBox.innerHTML =
            `<div>${esc(so ? soMsg(failSt.names) : T('⚠️ الطلب ماوصلناش (النت ضعيف). بياناتك محفوظة — اضغط حاول تاني.', '⚠️ Your order didn\'t reach us (weak connection). Your details are saved — tap Try again.'))}</div>` +
            `<div class="fx-row">${so
                ? `<button type="button" class="fx-retry" data-fx="cart">${T('🛒 راجع السلة', '🛒 Review cart')}</button>`
                : `<button type="button" class="fx-retry" data-fx="retry">${T('🔄 حاول تاني', '🔄 Try again')}</button>`}` +
            `<a class="fx-call" href="tel:0237721525">${T('📞 اتصل بينا', '📞 Call us')}</a></div>`;
        failBox.classList.add('show');
    }
    function showFail(k, names) { failSt = { k, names: names || [] }; paintFail(); try { failBox.scrollIntoView({ block: 'center', behavior: 'smooth' }); } catch (e) {} }
    function hideFail() { failSt = null; paintFail(); }
    new MutationObserver(() => { if (failSt) paintFail(); }).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
    failBox.addEventListener('click', e => {
        const b = e.target.closest('[data-fx]'); if (!b) return;
        hideFail();
        if (b.dataset.fx === 'cart') { openCart(); return; }
        const f = $('checkoutForm');
        if (f.requestSubmit) f.requestSubmit(); else f.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    });

    let sending = false, pendingId = null, pendingSig = '';
    /* ═══ أنيميشن زرار تأكيد الطلب (عربية توصيل) — بيشتغل مع الإرسال الحقيقي: بيلف لحد ما السيرفر يرد، وبعدين «تم الطلب ✓» ═══ */
    function rrTruckStart(btn, lbl) {
        if (!btn) return { ok: () => Promise.resolve(), reset: () => {} };
        const rm = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches, T0 = Date.now(), MIN = rm ? 500 : 2300;
        btn.style.height = btn.offsetHeight + 'px'; btn.disabled = true; btn.classList.add('rr-truckbtn');
        btn.innerHTML = '<span class="rt-label">' + (rm ? '⏳ بنبعت طلبك...' : esc(lbl)) + '</span><span class="rt-sr" role="status">بنبعت طلبك</span>'
            + '<span class="rt-scene" aria-hidden="true"><span class="rt-road"></span><span class="rt-box"></span>'
            + '<span class="rt-truck"><span class="rt-cargo"></span><span class="rt-door a"></span><span class="rt-door b"></span><span class="rt-cab"></span><span class="rt-beam"></span></span></span>'
            + '<span class="rt-ok" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="#2ee66b" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg><span>تم الطلب</span></span>';
        requestAnimationFrame(() => requestAnimationFrame(() => btn.classList.add('rr-go')));
        return {
            ok: () => new Promise(res => setTimeout(() => { btn.classList.add('rr-exit'); setTimeout(() => { btn.classList.add('rr-done'); setTimeout(res, 1100); }, rm ? 0 : 480); }, Math.max(0, MIN - (Date.now() - T0)))),
            reset: () => { btn.classList.remove('rr-go', 'rr-exit', 'rr-done', 'rr-truckbtn'); btn.textContent = lbl; btn.style.height = ''; btn.disabled = false; }
        };
    }
    /* ═══ طلب مجدول: ميعاد توصيل لاحق (النهاردة/بكرة) — بيظهر بس لو السيرفر مفعّله ═══ */
    var SC = { mode: 'now' };
    function schedCfg() { const s = window.RR_CFG && RR_CFG.sched; return { on: !!(s && s.on), min: (s && +s.min) || 45 }; }
    function cairoP(ts) {
        const o = {};
        try { new Intl.DateTimeFormat('en-GB', { timeZone: CONFIG.hours.tz, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date(ts)).forEach(p => { o[p.type] = p.value; }); }
        catch (e) { const d = new Date(ts); o.year = d.getFullYear(); o.month = String(d.getMonth() + 1).padStart(2, '0'); o.day = String(d.getDate()).padStart(2, '0'); o.hour = String(d.getHours()).padStart(2, '0'); o.minute = String(d.getMinutes()).padStart(2, '0'); }
        if (o.hour === '24') o.hour = '00';
        return o;
    }
    function schedWindow() {   // الشيفت الحالي (لو شغّالين) أو الجاي (لو مقفولين): من الفتح لحد الإغلاق — المجدول بيتحجز جواه بس
        const h = CONFIG.hours, base = Math.floor(Date.now() / 60000) * 60000, p = cairoP(base), n = +p.hour * 60 + +p.minute;
        if (!h.enabled) return { start: base, end: base + (1440 - n) * 60000 };
        const m = t => { const [a, b] = t.split(':').map(Number); return a * 60 + b; }, o = m(h.open), c = m(h.close), isOpen = o <= c ? (n >= o && n < c) : (n >= o || n < c);
        const st = isOpen ? base : base + ((o - n + 1440) % 1440) * 60000, from = isOpen ? n : o;
        return { start: st, end: st + (((c - from + 1440) % 1440) || 1440) * 60000 };
    }
    function timeLabel(ts) { const p = cairoP(ts); return t12(+p.hour + ':' + p.minute) + (+p.hour < 6 ? ' (بعد منتصف الليل)' : ''); }
    function schedSlots() {
        const c = schedCfg(), w = schedWindow(), out = [];
        for (let t = Math.ceil(Math.max(w.start, Date.now() + (c.min + 2) * 60000) / 9e5) * 9e5; t <= w.end; t += 9e5) out.push(t);   // كل ١٥ دقيقة — آخر ميعاد = وقت الإغلاق
        return out;
    }
    function schedFill() {
        const sl = schedSlots(), st = $('f_stime'), prev = st.value;
        st.innerHTML = sl.map(t => `<option value="${t}">${timeLabel(t)}</option>`).join('');
        if (prev && sl.some(t => String(t) === prev)) st.value = prev;
        $('f_sched').value = sl.length ? st.value : '';
        $('schedHint').textContent = sl.length ? '' : 'مفيش مواعيد متاحة النهاردة — جرّب «أقرب وقت» أو اطلب في وقت تاني';
        renderSummary();
    }
    /* استلام الفرع: وقت الاستلام (ساعة فقط) → توقيت كامل، ولازم يكون بعد pickMin دقيقة على الأقل من دلوقتي (وقت تحضير الطلب) */
    function pickMin() { return (window.RR_CFG && +RR_CFG.pickMin) || 15; }
    function pickTs() {
        const v = $('f_ptime').value; if (!v) return 0;
        const [h, m] = v.split(':').map(Number), p = cairoP(Date.now()), nm = +p.hour * 60 + +p.minute; let diff = h * 60 + m - nm;
        if (diff < -360) diff += 1440;   // وقت صغير بعد منتصف الليل = النهاردة بعد الساعة ١٢
        return Math.floor(Date.now() / 60000) * 60000 + diff * 60000;
    }
    function pickCheck() {
        if (!pk() || !$('f_ptime').value) return true;
        if (pickTs() >= Date.now() + pickMin() * 60000) return true;
        const hint = document.getElementById('ptHint'), e = Date.now() + pickMin() * 60000, p = cairoP(e);
        const msg = '⏰ موعد الاستلام لازم يكون بعد ' + pickMin() + ' دقيقة على الأقل من دلوقتي (وقت تحضير الطلب) — أقرب موعد ' + t12(+p.hour + ':' + p.minute);
        if (hint) { hint.textContent = '⚠️ ' + msg; hint.className = 'ptime-hint'; hint.style.color = '#9E1B1B'; }
        toast(msg, 7000); return false;
    }
    ['ptText', 'f_ptime'].forEach(i => { const el = $(i); if (el) el.addEventListener('input', () => { const h = document.getElementById('ptHint'); if (h) h.style.color = ''; }); });
    function schedMode(v) {
        SC.mode = v;
        document.querySelectorAll('#schedMode button').forEach(b => b.classList.toggle('on', b.dataset.v === v));
        $('schedPick').style.display = v === 'later' ? '' : 'none';
        if (v === 'later') schedFill(); else { $('f_sched').value = ''; renderSummary(); }
    }
    function schedShow() {
        const box = $('schedBox'); if (!box) return;
        const on = schedCfg().on && !pk();
        box.style.display = on ? '' : 'none';
        if (!on) { if (SC.mode !== 'now') schedMode('now'); return; }
        const closed = !isOpenNow(), nb = document.querySelector('#schedMode [data-v="now"]');
        nb.disabled = closed; nb.style.opacity = closed ? '.45' : '';
        $('schedClosed').style.display = closed ? '' : 'none';
        if (closed && SC.mode !== 'later') schedMode('later');
    }
    window.rrSchedShow = schedShow;
    document.querySelectorAll('#schedMode button').forEach(b => b.addEventListener('click', () => { if (!b.disabled) schedMode(b.dataset.v); }));
    $('f_stime').addEventListener('change', () => { $('f_sched').value = $('f_stime').value; renderSummary(); });

    /* ═══ تحقق رقم الموبايل بواتساب ═══
       لو المطعم مفعّل التحقق: العميل بيشوف كود يبعته على واتساب المطعم من نفس رقمه، والموظف بيأكد من الداشبورد.
       الرقم اللي اتحقق (أو اتسلّم له طلب قبل كده) مابيتسألش تاني. */
    const VF = { busy: false };
    async function vfCall(action, phone) {
        const r = await fetch(CONFIG.couponApi, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ action: action, phone: phone }) });
        return r.json();
    }
    function vfBrand() {
        const sb = document.querySelector('#checkoutForm [type=submit]'), cs = sb ? getComputedStyle(sb) : null;
        return { bg: (cs && cs.backgroundColor && cs.backgroundColor !== 'rgba(0, 0, 0, 0)') ? cs.backgroundColor : '#D92B2B', fg: (cs && cs.color) || '#fff' };
    }
    async function rrVerifyGate(phone, force) {
        const cfg = window.RR_CFG && RR_CFG.vf, mode = cfg && cfg.mode;
        if (!force && (!mode || mode === 'off')) return true;
        if (VF.busy) return false;
        try { if (!force && localStorage.getItem('rr_vf_ph') === phone) return true; } catch (e) {}
        VF.busy = true;
        try {
            let j = null;
            try { j = await vfCall('verReq', phone); } catch (e) {}
            if (!j || !j.ok) {
                if (j && j.error === 'blocked') { toast('⚠️ تعذّر تنفيذ الطلب حاليًا. كلّمنا على 0237721525 وهنساعدك.', 9000); return false; }
                if (j && j.error === 'bad_phone') return true;      /* الرقم الغلط بيتمسك في validate */
                if (mode === 'flag') return true;                    /* التحقق اختياري: ماننعش العميل بسبب عطل مؤقت */
                toast('⚠️ مقدرناش نتحقق من الرقم دلوقتي. جرّب تاني.', 6000); return false;
            }
            if (j.mode === 'off' || j.verified) { try { localStorage.setItem('rr_vf_ph', phone); } catch (e) {} return true; }
            return await vfModal(phone, j, j.mode || mode);
        } finally { VF.busy = false; }
    }
    function vfModal(phone, first, mode) {
        return new Promise(resolve => {
            const B = vfBrand(), wa = String(first.wa || ''), shown = wa.replace(/^20/, '0');
            let data = first, timer = null, until = Date.now() + (first.ttl || 1800) * 1000, done = false, state = 'wait';
            const ov = document.createElement('div');
            ov.id = 'rrVf'; ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true');
            ov.style.cssText = 'position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,.62);display:grid;place-items:center;padding:16px;font-family:Cairo,Tajawal,sans-serif;direction:rtl';
            document.body.appendChild(ov);
            const finish = ok => { if (done) return; done = true; clearInterval(timer); ov.remove(); resolve(ok); };
            const btn = 'display:block;width:100%;margin-top:8px;padding:12px;border-radius:14px;border:0;font:900 .95rem Cairo,Tajawal,sans-serif;cursor:pointer;text-decoration:none;box-sizing:border-box;';
            function paint() {
                const waLink = 'https://wa.me/' + wa + '?text=' + encodeURIComponent('كود التحقق: ' + data.code);
                let body;
                if (state === 'wait') {
                    body = '<p style="margin:0 0 12px;color:#6B6B6B;font-size:.92rem;line-height:1.8">عشان نتأكد إن الرقم <b dir="ltr" style="color:#222">' + phone + '</b> بتاعك، ابعت الكود ده على واتساب المطعم <b dir="ltr" style="color:#222">' + shown + '</b> من <b>نفس الرقم</b>.</p>' +
                        '<div dir="ltr" style="font:900 2.1rem Tajawal,Cairo,monospace;letter-spacing:.35em;background:#f6f3f2;color:#222;border-radius:14px;padding:12px 0 12px .35em">' + data.code + '</div>' +
                        '<a href="' + waLink + '" target="_blank" rel="noopener" style="' + btn + 'background:#25D366;color:#fff;margin-top:14px">💬 ابعت الكود على واتساب</a>' +
                        '<div style="margin-top:10px;color:#6B6B6B;font-size:.85rem;line-height:1.7">⏳ بنستنى رسالتك… هنكمّل طلبك أول ما نتأكد (ممكن ياخد دقيقة).<br>لو واتساب مافتحش، ابعت الكود يدويًا للرقم اللي فوق.</div>';
                } else {
                    body = '<p style="margin:0 0 6px;color:#6B6B6B;font-size:.92rem;line-height:1.8">' + (state === 'rej' ? '⚠️ الكود ده اترفض — اتأكد إنك بتبعته من نفس الرقم اللي في الطلب.' : '⌛ الكود انتهى. خد كود جديد وابعته.') + '</p>' +
                        '<button type="button" id="rrVfNew" style="' + btn + 'background:' + B.bg + ';color:' + B.fg + '">🔄 كود جديد</button>';
                }
                ov.innerHTML = '<div style="background:#fff;color:#222;border-radius:22px;max-width:390px;width:100%;padding:22px 20px;text-align:center;box-shadow:0 30px 60px -20px rgba(0,0,0,.5);max-height:94vh;overflow:auto">' +
                    '<div style="font-size:2rem">📱</div><h3 style="margin:6px 0 6px;font:900 1.2rem Tajawal,Cairo,sans-serif">تأكيد رقم موبايلك</h3>' + body +
                    (mode === 'flag' ? '<button type="button" id="rrVfSkip" style="' + btn + 'background:transparent;color:#6B6B6B;border:1.5px solid #ddd">كمّل الطلب من غير تحقق</button>' : '<div style="margin-top:8px;color:#6B6B6B;font-size:.8rem">لازم نتأكد من الرقم قبل تنفيذ الطلب.</div>') +
                    '<button type="button" id="rrVfX" style="' + btn + 'background:transparent;color:#9E1B1B">إلغاء</button></div>';
                const q = id => ov.querySelector(id);
                q('#rrVfX').onclick = () => finish(false);
                if (q('#rrVfSkip')) q('#rrVfSkip').onclick = () => finish(true);
                if (q('#rrVfNew')) q('#rrVfNew').onclick = async () => {
                    try { const j = await vfCall('verReq', phone); if (j && j.ok && j.verified) { try { localStorage.setItem('rr_vf_ph', phone); } catch (e) {} finish(true); return; } if (j && j.ok) { data = j; until = Date.now() + (j.ttl || 1800) * 1000; state = 'wait'; paint(); } else toast('⚠️ مقدرناش نجيب كود جديد، جرّب تاني', 5000); } catch (e) { toast('⚠️ مفيش اتصال، جرّب تاني', 5000); }
                };
            }
            paint();
            timer = setInterval(async () => {
                if (done || state !== 'wait') return;
                if (Date.now() > until) { state = 'exp'; paint(); return; }
                try {
                    const j = await vfCall('verStatus', phone);
                    if (done || !j || !j.ok) return;
                    if (j.verified) { try { localStorage.setItem('rr_vf_ph', phone); } catch (e) {} toast('✅ تم التحقق من رقمك', 4000); finish(true); }
                    else if (j.rejected) { state = 'rej'; paint(); }
                    else if (!j.code) { state = 'exp'; paint(); }
                } catch (e) {}
            }, 4000);
        });
    }

    $('checkoutForm').addEventListener('submit', async e => {
        e.preventDefault();
        if (sending) return;
        if (!cart.length) { toast('السلة فاضية'); return; }
        if (!isOpenNow() && !(schedCfg().on && !pk() && SC.mode === 'later' && $('f_sched').value)) { toast(closedMsg()); return; }
        if (!validate()) return;
        if (!pk() && SC.mode === 'later') { const st0 = +$('f_sched').value; if (!st0 || st0 < Date.now() + (schedCfg().min - 4) * 60000) { schedFill(); toast('⏰ الميعاد اللي اخترته فات — اختار ميعاد تاني', 6000); return; } }
        rrEv('submit');
        if (dropUsedCoupon($('f_phone').value)) return;
        hideFail();
        { const so = soInCart(); if (so.length) { showFail('so', so); return; } }
        if (!window.rrTrackSave) { toast('⚠️ في مشكلة مؤقتة، كلمنا على 0237721525', 6000); return; }
        if (!(await rrVerifyGate(toEn($('f_phone').value.trim())))) return;   /* تحقق الرقم (لو المطعم مفعّله) */

        const v = id => $(id).value.trim();
        const pickup = pk();
        if (!pickup && window.RR_CFG && RR_CFG.pause && RR_CFG.pause.on) { toast('⏸️ ' + (RR_CFG.pause.msg || 'التوصيل متوقف مؤقتًا') + ' — تقدر تختار الاستلام من الفرع', 7000); return; }
        const area = pickup ? { name: 'استلام من الفرع', fee: 0 } : CONFIG.areas[+areaVal.value];
        const fmtT = s => { const [h, m] = s.split(':').map(Number); return ((h % 12) || 12) + ':' + String(m).padStart(2, '0') + ' ' + (h >= 12 ? 'م' : 'ص'); };
        const fee = pickup ? 0 : curFee();   /* بتراعي التوصيل المجاني — والسيرفر بيتحقق منها */
        const sub = subtotal(), d = discount(), total = sub - d + fee;
        const num = id => toEn(v(id));

        /* نفس رقم الطلب لو العميل ضغط تاني بعد فشل (والسيرفر بيمنع التكرار) — ولو السلة اتغيرت بنعمل رقم جديد */
        const sig = JSON.stringify([cart.map(i => [i.key, i.qty]), total, num('f_phone'), $('f_sched').value, $('f_ptime').value]);
        if (!pendingId || sig !== pendingSig) { pendingId = 'RR' + Date.now().toString(36).toUpperCase().slice(-7); pendingSig = sig; }
        const orderId = pendingId;

        const data = pickup ? Object.assign({}, saved, { name: v('f_name'), phone: v('f_phone') }) : { area: +areaVal.value };
        if (!pickup) fields.forEach(f => data[f] = v('f_' + f));
        LS.set('rr_customer', data);

        const addr = pickup ? ('استلام من الفرع — ' + fmtT(v('f_ptime'))) : [area.name, v('f_street'), v('f_station') && ('محطة ' + v('f_station')), 'عمارة ' + v('f_building'), 'دور ' + v('f_floor'), 'شقة ' + v('f_apt'), v('f_landmark') && ('علامة: ' + v('f_landmark'))].filter(Boolean).join(' - ');
        const claim = !!(coupon && coupon.def.firstOrderOnly && d > 0 && CONFIG.couponApi);
        const schedT = (!pickup && SC.mode === 'later' && +$('f_sched').value) || 0, schedTxt = schedT ? 'النهاردة ' + timeLabel(schedT) : '', pickT = pickup ? pickTs() : 0;

        /* الإرسال المباشر للسيرفر — مفيش واتساب. السلة مابتتمسحش غير بعد ما السيرفر يأكد استلام الطلب */
        const sbtn = $('checkoutForm').querySelector('[type=submit]'), lbl = sbtn ? sbtn.textContent : '';
        sending = true; const anim = rrTruckStart(sbtn, lbl);
        let res = 'fail';
        try {
            res = await window.rrTrackSave({ id: orderId, name: v('f_name'), phone: num('f_phone'), phone2: pickup ? '' : num('f_phone2'), type: pickup ? 'pickup' : 'delivery', address: addr, area: pickup ? '' : area.name,
                items: cart.map(i => ({ n: i.name, q: i.qty, p: i.price, o: i.opts || [], t: i.note || '' })), subtotal: sub, discount: d, coupon: d ? coupon.code : '', claim: claim, fee: fee, total: total, payment: $('f_pay').value, payref: $('f_pay').value === 'cash' ? '' : v('f_payref'), notes: v('f_notes'), sched: schedT || undefined, pick: pickT || undefined, lat: !pickup && RR_LOC ? RR_LOC.lat : undefined, lon: !pickup && RR_LOC ? RR_LOC.lon : undefined });
        } catch (err) {}
        if (res === 'ok') { /* السيرفر أكّد: بنكمّل الأنيميشن لحد «تم الطلب» وبعدين نقفل */ } else { sending = false; anim.reset(); }
        if (res === 'ok') rrEv('order');

        if (res === 'coupon_used') {
            pendingId = null;
            if (coupon) markCouponUsed(coupon.code, v('f_phone'));
            dropUsedCoupon(v('f_phone')); return;
        }
        if (res === 'closed') { pendingId = null; toast(closedMsg(), 7000); return; }
        if (res === 'bad_pick') { pendingId = null; loadServerConfig().catch(() => {}); toast('⏰ موعد الاستلام لازم يكون بعد ' + pickMin() + ' دقيقة على الأقل من دلوقتي — اختار موعد تاني', 7000); return; }
        if (res === 'bad_sched') { pendingId = null; loadServerConfig().catch(() => {}); schedFill(); toast('⏰ الميعاد اللي اخترته مبقاش متاح — اختار ميعاد تاني', 7000); return; }
        if (res === 'pay_off') { pendingId = null; loadServerConfig().catch(() => {}); toast('⚠️ طريقة الدفع دي مش متاحة دلوقتي — اختار طريقة تانية', 7000); return; }
        if (res === 'unverified') { pendingId = null; loadServerConfig().catch(() => {}); if (await rrVerifyGate(num('f_phone'), true)) toast('✅ تم التحقق — اضغط تأكيد الطلب تاني', 6000); return; }
        if (res === 'blocked') { pendingId = null; toast('⚠️ تعذّر تنفيذ الطلب حاليًا. كلّمنا على 0237721525 وهنساعدك.', 9000); return; }
        if (/^coupon_(invalid|expired|limit|not_new)$/.test(res)) { pendingId = null; const bad = coupon && coupon.code; coupon = null; $('couponInput').value = ''; setCouponMsg(CP_ERR[res] || '', false); render(); renderSummary(); toast((CP_ERR[res] || '') + (bad ? ' (' + bad + ') — اتشال من طلبك، راجع الإجمالي وأكّد تاني' : ''), 7500); return; }
        if (res === 'busy') { toast('⏳ طلبات كتيرة في وقت قصير. جرّب بعد دقيقة.', 6000); return; }
        if (res === 'delivery_paused') { pendingId = null; loadServerConfig().catch(() => {}); toast('⏸️ التوصيل متوقف مؤقتًا — تقدر تختار الاستلام من الفرع', 7000); return; }
        if (res === 'area_closed' || res === 'bad_area') { pendingId = null; loadServerConfig().catch(() => {}); toast('⚠️ التوصيل لمنطقتك مش متاح دلوقتي — اختار منطقة تانية أو الاستلام من الفرع', 7000); return; }
        if (res === 'bad_price') { pendingId = null; toast('⚠️ أسعار بعض الأصناف اتحدّثت. حدّث الصفحة، فضّي السلة وضيف أصنافك تاني، أو كلمنا على 0237721525', 9000); return; }
        if (res === 'bad_total') { pendingId = null; toast('⚠️ في اختلاف في حسابات الطلب. حدّث الصفحة وجرّب تاني، أو كلمنا على 0237721525', 8000); return; }
        if (res === 'soldout') { pendingId = null; refreshSoldout(); showFail('so', window.rrSoNames && window.rrSoNames.length ? window.rrSoNames : soInCart()); return; }
        if (res !== 'ok') { showFail('net'); return; }
        LS.set('rr_cart', []);   /* الطلب وصل: نفضّي السلة المحفوظة فورًا، عشان لو العميل قفل الصفحة في نص الأنيميشن ماينفعش يطلب تاني بالغلط */
        await anim.ok(); sending = false;

        pendingId = null; hideFail();
        if (coupon && coupon.def.firstOrderOnly && d > 0) markCouponUsed(coupon.code, v('f_phone'));
        if (window.rrOrderHook) rrOrderHook({ orderId: orderId, phone: v('f_phone'), total: Math.max(0, sub - d), code: (coupon && coupon.def.loyalty) ? coupon.code : '' });
        const pay = $('f_pay').value;
        LS.set('rr_last_order', { id: orderId, t: Date.now(), items: cart.map(i => ({ n: i.name, q: i.qty, p: i.price, o: i.opts || [], t: i.note || '' })) });
        document.dispatchEvent(new Event('rr:ordered'));
        $('f_payref').value = ''; if (RR_LOC) $('locBtn').click();
        cart = []; coupon = null; $('couponInput').value = ''; setCouponMsg('', true);
        LS.set('rr_cart', cart); render(); closeAll(); anim.reset(); try { schedMode('now'); } catch (e) {}
        toast(schedT && pay === 'cash' ? '✅ اتحجز طلبك رقم ' + orderId + ' — التوصيل ' + schedTxt + ' 🐓' : pay === 'cash' ? '✅ وصلنا طلبك رقم ' + orderId + ' — هنكلمك نأكده 🐓'
                             : '✅ وصلنا طلبك رقم ' + orderId + ' — ابعت صورة التحويل على واتساب 01023278000 لتأكيده', pay === 'cash' ? 4500 : 8000);
        if (window.rrTrackOpen) setTimeout(() => window.rrTrackOpen(orderId), 1200);
    });

    /* ═══ Toast ═══ */
    let tt;
    function toast(msg, ms) {
        const t = $('rrToast'); t.textContent = msg; t.classList.add('show');
        clearTimeout(tt); tt = setTimeout(() => t.classList.remove('show'), ms || 2600);
    }

    /* ═══ رسم قسم الإضافات ═══ */
    (function buildExtras() {
        const wrap = $('extrasBody'); if (!wrap) return;
        wrap.innerHTML = EXTRA_GROUPS.map(g => `
            <p class="offer-section-title">${g.title}</p>
            <div class="menu-grid">${EXTRAS.filter(e => e.group === g.key).map(e => `
                <div class="card">
                    ${e.img ? `<img loading="lazy" decoding="async" class="card-img" src="${esc(e.img)}" alt="${esc(e.en)}">`
                            : `<div class="card-img-placeholder">${e.emoji}</div>`}
                    <div class="card-body">
                        <div class="card-name">${esc(e.name)} <span class="card-name-en">${esc(e.en)}</span></div>
                        <div class="card-footer"><span class="price-badge">${e.price} LE</span></div>
                    </div>
                </div>`).join('')}
            </div>`).join('');
    })();

    /* ═══ رسم قسم الصوصات ═══ */
    (function buildSauces() {
        const wrap = $('saucesBody'); if (!wrap) return;
        const card = x => `
            <div class="card${x.hot ? ' sauce-hot' : ''}">
                ${x.img ? `<img loading="lazy" decoding="async" class="card-img" src="${esc(x.img)}" alt="${esc(x.en)}">`
                        : `<div class="card-img-placeholder">${x.hot ? '🌶️' : '🥣'}</div>`}
                <div class="card-body">
                    <div class="card-name">${esc(x.name)} <span class="card-name-en">${esc(x.en)}</span></div>
                    <div class="card-footer"><span class="price-badge">${x.price} LE</span></div>
                </div>
            </div>`;
        wrap.innerHTML = `
            <p class="offer-section-title">🥣 صوصات عادية</p>
            <div class="menu-grid">${SAUCES.filter(x => !x.hot && !x.off).map(card).join('')}</div>
            <div class="hot-banner">
                <div class="hot-banner-ico">🌶️🔥</div>
                <div><h3>صوصات سبايسي</h3><p>تنبيه: الصوصات دي حارة — اختار على قد حرارتك!</p></div>
            </div>
            <div class="menu-grid hot-grid">${SAUCES.filter(x => x.hot && !x.off).map(card).join('')}</div>`;
    })();

    /* ═══ زراير "أضف للسلة" على كل الكروت — بتفتح البوب أب ═══ */
    const TYPES = [
        { sel: '.card',              name: '.card-name',             price: '.price-badge',      foot: '.card-footer' },
        { sel: '.siniya-card',       name: '.siniya-card-name',      price: '.siniya-price',     foot: '.siniya-card-footer' },
        { sel: '.siniya-featured',   name: '.siniya-featured-name',  price: '.siniya-price',     foot: '.siniya-card-footer' },
        { sel: '.school-featured',   name: '.school-featured-name',  price: '.price-badge',      foot: '.card-footer' },
        { sel: '.zsb-banner',        name: 'h2',                     price: '.zsb-price',        foot: '.zsb-price-row' },
        { sel: '.power-deal-banner', name: 'h2',                     price: '.power-deal-price', foot: '.power-deal-price-row' }
    ];
    const LABELS = { S: 'صغير', M: 'وسط', L: 'كبير' };
    const cleanName = el => {
        const c = el.cloneNode(true);
        c.querySelectorAll('span').forEach(s => s.remove());
            return c.textContent.replace(/[\u{1F300}-\u{1FAFF}\u2600-\u27BF]/gu, '').replace(/\s+/g, ' ').trim();
    };
    const parsePrices = t => {
        const m = [...t.matchAll(/([A-Za-z]+)\s*(\d+)/g)];
        if (m.length > 1) return m.map(x => ({ label: LABELS[x[1].toUpperCase()] || x[1], price: +x[2] }));
        const n = t.match(/\d+/);
        return n ? [{ label: '', price: +n[0] }] : [];
    };

    TYPES.forEach(T => document.querySelectorAll(T.sel).forEach(box => {
        if (box.dataset.cart) return;
        const nEl = box.querySelector(T.name), pEl = box.querySelector(T.price), ft = box.querySelector(T.foot);
        if (!nEl || !pEl || !ft) return;
        const prices = parsePrices(pEl.textContent);
        if (!prices.length) return;
        box.dataset.cart = '1';
        const name = cleanName(nEl);
        box.dataset.nm = name; { const enEl = box.querySelector('.card-name-en'); if (enEl) box.dataset.en = enEl.textContent.trim(); }
        const desc = ((box.querySelector('.card-desc, .school-featured-includes') || {}).textContent || '').replace(/\s+/g, ' ').trim();
        const sec = (box.closest('section') || {}).id || '';
        const nash = sec === 'nashville' || !!box.querySelector('.nashville') || /ناش/.test(name);
        const spice = !nash && !NO_SPICE_SECTIONS.includes(sec) && !NO_SPICE_NAMES.includes(norm(name));
        ft.querySelectorAll('a[href*="wa.me"]').forEach(a => a.remove());
        prices.forEach(p => {
            const b = document.createElement('button');
            b.type = 'button';
            b.className = 'add-cart-btn';
            b.textContent = '🛒 أضف للسلة' + (p.label ? ' — ' + p.label : ''); b.dataset.lbl = b.textContent;
            b.onclick = () => openItem({ name, price: p.price, label: p.label, nash, spice, sec, desc });
            ft.appendChild(b);
        });
    }));
    /* ═══ تطبيق حالة "نفد" على الكروت + تحديثها من السيرفر كل دقيقة ═══ */
    function applySO() {
        document.querySelectorAll('[data-nm]').forEach(box => {
            const so = isSO(box.dataset.nm);
            box.classList.toggle('rr-so', so);
            let bd = box.querySelector(':scope > .rr-so-badge');
            if (so && !bd) { bd = document.createElement('span'); bd.className = 'rr-so-badge'; box.appendChild(bd); }
            else if (!so && bd) bd.remove();
            box.querySelectorAll('.add-cart-btn').forEach(b => {
                if (so && !b.dataset.so) { b.dataset.so = '1'; b.disabled = true; b.textContent = '⛔ نفد مؤقتًا'; }
                else if (!so && b.dataset.so) { delete b.dataset.so; b.disabled = false; b.textContent = b.dataset.lbl || b.textContent; }
            });
        });
    }
    function refreshSoldout() {
        if (!CONFIG.couponApi) return Promise.resolve();
        return fetch(CONFIG.couponApi + '?action=soldout&t=' + Date.now()).then(r => r.json()).then(j => {
            if (!j || !j.ok || !Array.isArray(j.list)) return;
            const n = new Set(j.list.map(norm)), changed = n.size !== SO.size || [...n].some(x => !SO.has(x));
            SO = n; LS.set('rr_so', j.list);
            if (changed) { applySO(); render(); if (failSt && failSt.k === 'so' && !soInCart().length) hideFail(); }
        }).catch(() => {});
    }
    applySO(); refreshSoldout(); setInterval(refreshSoldout, 60000);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) refreshSoldout(); });
    /* ═══ بوب أب الخصم عند فتح الموقع ═══ */
    const promo = $('promoModal');
    function closePromo() { promo.classList.remove('open'); $('rrOverlay').classList.remove('open'); document.body.classList.remove('no-scroll'); }
    setTimeout(() => { promo.classList.add('open'); $('rrOverlay').classList.add('open'); document.body.classList.add('no-scroll'); }, 600);
    $('promoClose').onclick = closePromo;
    $('promoGo').onclick = closePromo;
    $('rrOverlay').addEventListener('click', closePromo);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closePromo(); });

    /* ═══ نسخ كود الخصم من الشريط ═══ */
    $('promoTicker').addEventListener('click', () => {
        const done = () => toast('✅ تم نسخ كود RED20');
        if (navigator.clipboard) navigator.clipboard.writeText('RED20').then(done, done);
        else done();
    });

    render();
})();
} catch (e) { console.error("[app.js جزء 3]", e); }

/* ── جزء 4 ── */
try {
(function(){
  /* header shadow on scroll */
  var h=document.querySelector('header');
  addEventListener('scroll',function(){h.classList.toggle('scrolled',scrollY>8)},{passive:true});
 
  /* images: lazy-load + fade out the shimmer when ready */
  document.querySelectorAll('img.card-img').forEach(function(i){
    i.loading='lazy'; i.decoding='async';
    if(i.complete) i.classList.add('is-loaded');
    else{i.addEventListener('load',function(){i.classList.add('is-loaded')});
         i.addEventListener('error',function(){i.classList.add('is-loaded')});}
  });
 
  /* cart badge "bump" whenever the count changes */
  document.querySelectorAll('.cart-count').forEach(function(el){
    new MutationObserver(function(){
      el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump');
    }).observe(el,{childList:true,characterData:true,subtree:true});
  });
})();
} catch (e) { console.error("[app.js جزء 4]", e); }

/* ── جزء 5 ── */
try {
(function(){
  var $=function(s,r){return (r||document).querySelector(s)}, $$=function(s,r){return [].slice.call((r||document).querySelectorAll(s))};
  var norm=function(s){return String(s).toLowerCase().replace(/[\u064B-\u065F\u0640]/g,'').replace(/[أإآ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه').replace(/\s+/g,' ').trim()};
 
  /* 1 ─ sticky category chips (built from the existing nav) */
  var SKIP=['home','about','branches','notes'], chips=[];
  var strip=document.createElement('div'); strip.className='cat-strip';
  var inner=document.createElement('div'); inner.className='cat-strip-in'; strip.appendChild(inner);
  $$('#nav-list button').forEach(function(b){
    var m=(b.getAttribute('onclick')||'').match(/'([^']+)'/); if(!m||SKIP.indexOf(m[1])>-1) return;
    var c=document.createElement('button'); c.type='button'; c.className='chip'; c.dataset.id=m[1];
    c.textContent=b.textContent.trim(); c.onclick=function(){clearSearch();showSection(m[1])};
    inner.appendChild(c); chips.push(c);
  });
  $('header').after(strip);
  var _show=window.showSection;
  window.showSection=function(id){
    _show(id);
    chips.forEach(function(c){var on=c.dataset.id===id;c.classList.toggle('on',on);
      if(on) c.scrollIntoView({inline:'center',block:'nearest',behavior:'smooth'});});
  };
 
  /* 2 ─ search across the whole menu */
  var box=document.createElement('div'); box.className='search-box';
  box.innerHTML='<input type="search" placeholder="دوّر على أكلتك... (مثال: زينجر، ناشفيل، ريزو)" aria-label="بحث في المنيو">';
  var empty=document.createElement('div'); empty.className='no-results'; empty.textContent='مفيش نتيجة بالاسم ده 🤔 جرّب كلمة تانية';
  var main=$('main'); main.insertBefore(empty,main.firstChild); main.insertBefore(box,main.firstChild);
  var inp=$('input',box), ITEMS='.card,.siniya-card,.school-featured,.siniya-featured';
  function run(q){
    q=norm(q); document.body.classList.toggle('searching',!!q);
    var total=0;
    $$('.section').forEach(function(s){
      var hits=0;
      $$(ITEMS,s).forEach(function(c){var ok=!q||norm(c.textContent).indexOf(q)>-1;c.style.display=ok?'':'none';if(ok)hits++});
      s.classList.toggle('no-hit',!!q&&!hits); total+=hits;
    });
    document.body.classList.toggle('none',!!q&&!total);
  }
  function clearSearch(){inp.value='';run('')}
  var t; inp.addEventListener('input',function(){clearTimeout(t);t=setTimeout(function(){run(inp.value)},120)});
 
  /* 3 ─ trust strip under the hero */
  var hero=$('#home .hero');
  if(hero){var tr=document.createElement('div');tr.className='trust';
    tr.innerHTML='<div><b>🛵</b>توصيل سريع<small>من 30 ج.م حسب المنطقة</small></div><div><b>💵</b>كاش عند الاستلام<small>من غير أي مصاريف</small></div><div><b>🍗</b>دجاج طازج<small>بتتحضّر لما تطلب</small></div>';
    hero.after(tr);}
 
  /* 4 ─ round "+" buttons need an accessible name */
  $$('.add-cart-btn').forEach(function(b){
    if(b.textContent.indexOf('—')>-1) b.classList.add('has-label'); else b.setAttribute('aria-label','أضف للسلة');
  });
 
  /* 5 ─ cart bar shows live total */
  var fab=$('.cart-fab');
  function sync(){
    var c=[]; try{c=JSON.parse(localStorage.getItem('rr_cart'))||[]}catch(e){}
    var n=0,t=0; c.forEach(function(i){n+=i.qty;t+=i.qty*i.price});
    fab.classList.toggle('empty',!n); fab.dataset.total=t?t+' ج.م':'';
  }
  $$('.cart-count').forEach(function(el){new MutationObserver(sync).observe(el,{childList:true,characterData:true,subtree:true})});
  sync(); showSection('home');
})();
} catch (e) { console.error("[app.js جزء 5]", e); }

/* ── جزء 6 ── */
try {
(function(){
  var $=function(s,r){return (r||document).querySelector(s)}, $$=function(s,r){return [].slice.call((r||document).querySelectorAll(s))};
  var prog=$('#rrProg'), top=$('#rrTop'), hd=$('header');
  window.addEventListener('scroll',function(){
    var h=document.documentElement, p=h.scrollTop/(h.scrollHeight-h.clientHeight||1);
    prog.style.width=(p*100)+'%'; top.classList.toggle('show',h.scrollTop>600);
  },{passive:true});
  top.onclick=function(){window.scrollTo({top:0,behavior:'smooth'})};
  /* ظهور الكروت */
  var io='IntersectionObserver' in window ? new IntersectionObserver(function(es){
    es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target);} });
  },{rootMargin:'0px 0px -6% 0px'}) : null;
  function watch(root){
    $$('.card,.cat-card,.siniya-card',root).forEach(function(el,i){
      if(el.dataset.rv) return; el.dataset.rv=1;
      if(!io){return}
      el.classList.add('rr-rv'); el.style.transitionDelay=((i%6)*45)+'ms'; io.observe(el);
    });
    $$('img.card-img',root).forEach(function(im){
      if(im.complete&&im.naturalWidth) im.classList.add('ld');
      else {im.addEventListener('load',function(){im.classList.add('ld')}); im.addEventListener('error',function(){im.classList.add('ld')});}
    });
  }
  watch(document);
  var wt; new MutationObserver(function(){ clearTimeout(wt); wt=setTimeout(function(){ watch(document) },200); }).observe(document.body,{childList:true,subtree:true});
  /* شريط التنقل السفلي */
  var tabs=$('#rrTabs');
  tabs.addEventListener('click',function(e){
    var b=e.target.closest('button'); if(!b) return; var t=b.dataset.t;
    if(t==='home'){ showSection('home'); window.scrollTo({top:0,behavior:'smooth'}); }
    else if(t==='menu'){ if(typeof toggleMobileNav==='function') toggleMobileNav(); }
    else if(t==='cart'){ var f=$('.cart-fab')||$('.cart-head-btn'); if(f) f.click(); }
    else if(t==='call'){ location.href='tel:0237721525'; }
    if(t==='home'||t==='menu'){ $$('button',tabs).forEach(function(x){x.classList.toggle('on',x===b)}); }
  });
  /* عداد السلة في التاب */
  var badge=$('b',tabs.children[2]);
  setInterval(function(){
    var c=$('.cart-fab .cart-count'); var n=c?parseInt(c.textContent)||0:0;
    badge.textContent=n; badge.style.display=n?'flex':'none';
  },1500);
})();
} catch (e) { console.error("[app.js جزء 6]", e); }

/* ── جزء 7 ── */
try {
(function(){
  var im=document.getElementById('itemModal'); if(!im) return;
  /* صورة الصنف داخل الشيت */
  var body=im.querySelector('.checkout-body'), hero=document.createElement('img');
  hero.id='imHero'; hero.alt=''; body.insertBefore(hero, body.firstChild);
  function setHero(){
    var title=(document.getElementById('im_title').textContent||'').replace(/\s*\(.*\)\s*$/,'').trim(), src='';
    document.querySelectorAll('.card .card-name').forEach(function(n){
      if(!src && n.textContent.trim()===title){ var cc=n.closest('.card'), i=cc.querySelector('.card-img')||cc.querySelector('.school-featured-img')||cc.querySelector('img'); if(i) src=i.currentSrc||i.src; }
    });
    var d=''; document.querySelectorAll('.card').forEach(function(c){ var nm=c.querySelector('.card-name'); if(!d && nm && nm.textContent.trim()===title){ var p=c.querySelector('.card-desc'); if(p) d=p.textContent.trim(); } });
    var de=document.getElementById('imDesc'); if(de){ de.textContent=d; de.style.display=d?'':'none'; }
    hero.classList.toggle('on',!!src); if(src) hero.src=src;
    body.scrollTop=0;
  }
  new MutationObserver(function(){ if(im.classList.contains('open')) setHero(); }).observe(im,{attributes:true,attributeFilter:['class']});
  /* سحب لأسفل للإغلاق */
  var y0=null, dy=0;
  function start(e){ if(!e.target.closest('.drawer-head,.im-grip')) return; y0=(e.touches?e.touches[0]:e).clientY; dy=0; }
  function move(e){ if(y0===null) return; dy=(e.touches?e.touches[0]:e).clientY-y0;
    if(dy>0){ im.classList.add('drag'); im.style.transform='translate(-50%,'+dy+'px)'; } }
  function end(){ if(y0===null) return; y0=null; im.classList.remove('drag'); im.style.transform='';
    if(dy>110){ var x=im.querySelector('[data-close]'); if(x) x.click(); } dy=0; }
  im.addEventListener('touchstart',start,{passive:true}); im.addEventListener('touchmove',move,{passive:true}); im.addEventListener('touchend',end); im.addEventListener('touchcancel',end);
  var grip=document.createElement('div'); grip.className='im-grip'; im.insertBefore(grip, im.firstChild);
  var hd=im.querySelector('.drawer-head'); hd.addEventListener('mousedown',function(e){ start(e); var mv=move, up=function(){ end(); document.removeEventListener('mousemove',mv); document.removeEventListener('mouseup',up); }; document.addEventListener('mousemove',mv); document.addEventListener('mouseup',up); });
  /* المفضلة */
  var KEY='rr_favs', favs=[]; try{ favs=JSON.parse(localStorage.getItem(KEY)||'[]') }catch(e){}
  var KF=function(s){s=s||'';var a=s.split(/[A-Za-z]/)[0];if(!/[\u0600-\u06FF0-9]/.test(a))a=s;return a.replace(/[٠-٩]/g,function(d){return '٠١٢٣٤٥٦٧٨٩'.indexOf(d)}).replace(/[^\u0600-\u06FFA-Za-z0-9 ]/g,' ').replace(/\s+/g,' ').trim()};
  favs=favs.map(KF).filter(function(x,i,a){return x&&a.indexOf(x)===i});
  function save(){ try{ localStorage.setItem(KEY,JSON.stringify(favs)) }catch(e){} bar.textContent='❤️ المفضلة ('+favs.length+')'; }
  var bar=document.createElement('button'); bar.id='rrFavBar'; document.body.appendChild(bar);
  bar.onclick=function(){ var on=document.body.classList.toggle('favonly'); bar.classList.toggle('on',on);
    if(on && !favs.length){ document.body.classList.remove('favonly'); bar.classList.remove('on'); var t=document.getElementById('rrToast'); if(t){t.textContent='اضغط ❤️ على أي صنف لإضافته للمفضلة'; t.classList.add('show'); setTimeout(function(){t.classList.remove('show')},2200);} } };
  function name(c){ var n=c.querySelector('.card-name,.siniya-card-name,.siniya-featured-name,.school-featured-name,.power-deal-content h2'); return n?KF(n.textContent):''; }
  function decorate(){
    document.querySelectorAll('[data-cart="1"]').forEach(function(c){
      if(!c.querySelector('.rr-fav')){
        var b=document.createElement('button'); b.className='rr-fav'; b.type='button'; b.setAttribute('aria-label','المفضلة'); b.textContent='♥';
        b.addEventListener('click',function(e){ e.stopPropagation(); e.preventDefault(); var n=name(c), i=favs.indexOf(n);
          if(i<0) favs.push(n); else favs.splice(i,1); save(); decorate(); }, true);
        c.appendChild(b);
      }
      var f=favs.indexOf(name(c))>-1; c.classList.toggle('isfav',f); c.querySelector('.rr-fav').classList.toggle('on',f);
    });
  }
  save(); decorate();
  new MutationObserver(function(){ clearTimeout(decorate.t); decorate.t=setTimeout(decorate,120); }).observe(document.body,{childList:true,subtree:true});
})();
} catch (e) { console.error("[app.js جزء 7]", e); }

/* ── جزء 8 ── */
try {
(function(){
  var im=document.getElementById('itemModal'); if(!im||document.getElementById('imDesc')) return;
  var body=im.querySelector('.checkout-body'), hero=document.getElementById('imHero');
  var top=document.createElement('div'); top.className='im-top';
  var info=document.createElement('div'); info.className='im-info';
  var pill=document.createElement('span'); pill.className='im-pill'; pill.textContent='متاح';
  var desc=document.createElement('p'); desc.id='imDesc';
  info.appendChild(document.getElementById('im_title')); info.appendChild(pill);
  info.appendChild(document.getElementById('im_price')); info.appendChild(desc);
  top.appendChild(info); if(hero) top.appendChild(hero);
  body.insertBefore(top, body.firstChild);
  /* إخفاء عنوان "الكمية" ونقل الكمية وزرار الإضافة للفوتر */
  body.querySelectorAll('.form-title').forEach(function(f){ if(f.textContent.trim()==='الكمية') f.style.display='none'; });
  var foot=document.createElement('div'); foot.className='im-foot';
  foot.appendChild(document.getElementById('im_add')); foot.appendChild(body.querySelector('.im-qty'));
  im.appendChild(foot);
})();
} catch (e) { console.error("[app.js جزء 8]", e); }

/* ── جزء 9 ── */
try {
(function(){var b=document.getElementById('rrFavBar');if(!b)return;
function u(){var m=(b.textContent.match(/\d+/)||[0])[0];if(b.dataset.n!==m)b.dataset.n=m}
new MutationObserver(u).observe(b,{childList:true,characterData:true,subtree:true});u();})();
} catch (e) { console.error("[app.js جزء 9]", e); }

/* ── جزء 10 ── */
try {
(function(){
  var tabs=document.getElementById('rrTabs'); if(!tabs||typeof showSection!=='function') return;
  var orig=window.showSection;
  function mark(which){ [].forEach.call(tabs.querySelectorAll('button'),function(b){ b.classList.toggle('on', b.dataset.t===which); }); }
  window.showSection=function(id){
    orig.apply(this,arguments);
    mark(id==='home'?'home':'menu');
    setTimeout(function(){
      if(id==='home'){ window.scrollTo({top:0,behavior:'smooth'}); return; }
      var sec=document.getElementById(id); if(!sec) return;
      var tt=sec.querySelector('.section-title')||sec;
      var y=tt.getBoundingClientRect().top+window.pageYOffset-150;
      window.scrollTo({top:Math.max(0,y),behavior:'smooth'});
    },80);
  };
  tabs.addEventListener('click',function(e){
    var b=e.target.closest('button'); if(!b) return;
    var t=b.dataset.t;
    if(t==='home'){ e.stopImmediatePropagation(); closeMobileNav(); showSection('home'); }
    else if(t==='menu'){ e.stopImmediatePropagation(); var nav=document.getElementById('mobileNav'); toggleMobileNav(); mark(nav.classList.contains('open')?'menu':(document.querySelector('#home.active')?'home':'menu')); }
  },true);
  /* لو الدروار اتقفل من برّه، نرجّع التمييز لحالة الصفحة */
  document.getElementById('mobileNav').addEventListener('click',function(){ setTimeout(function(){ mark(document.querySelector('#home.active')?'home':'menu'); },120); });
})();
} catch (e) { console.error("[app.js جزء 10]", e); }

/* ── جزء 11 ── */
try {
(function(){
  var bar=document.getElementById('rrFavBar'), ov=document.getElementById('rrFavOv'), sh=document.getElementById('rrFavSheet'), list=document.getElementById('rrFavList');
  if(!bar) return;
  function favs(){ try{return JSON.parse(localStorage.getItem('rr_favs')||'[]')}catch(e){return []} }
  var KF=function(s){s=s||'';var a=s.split(/[A-Za-z]/)[0];if(!/[\u0600-\u06FF0-9]/.test(a))a=s;return a.replace(/[٠-٩]/g,function(d){return '٠١٢٣٤٥٦٧٨٩'.indexOf(d)}).replace(/[^\u0600-\u06FFA-Za-z0-9 ]/g,' ').replace(/\s+/g,' ').trim()}; function nm(c){var n=c.querySelector('.card-name,.siniya-card-name,.siniya-featured-name,.school-featured-name,.power-deal-content h2');return n?KF(n.textContent):''}
  function close(){ ov.classList.remove('open'); sh.classList.remove('open'); }
  function render(){
    var f=favs(), seen={}, html=0; list.innerHTML='';
    document.querySelectorAll('[data-cart="1"]').forEach(function(c){
      var n=nm(c); if(!n||seen[n]||f.indexOf(n)<0) return; seen[n]=1; html++;
      var im=c.querySelector('.card-img')||c.querySelector('.school-featured-img')||c.querySelector('img'), pr=c.querySelector('.price-badge,.siniya-price,.power-deal-price');
      var r=document.createElement('div'); r.className='fv-row';
      r.innerHTML='<img alt=""><div class="fv-info"><b></b><small></small><div class="fv-act"></div></div>';
      if(im) r.querySelector('img').src=im.currentSrc||im.getAttribute('src')||im.src; r.querySelector('b').textContent=n; if(pr) r.querySelector('small').textContent=pr.textContent.trim();
      var act=r.querySelector('.fv-act');
      c.querySelectorAll('.add-cart-btn').forEach(function(b){
        var x=document.createElement('button'); x.textContent=b.textContent.trim(); x.onclick=function(){ close(); setTimeout(function(){ b.click() },250); }; act.appendChild(x);
      });
      var rm=document.createElement('button'); rm.className='rm'; rm.textContent='إزالة'; rm.onclick=function(){ var h=c.querySelector('.rr-fav'); if(h) h.click(); setTimeout(render,60); }; act.appendChild(rm);
      list.appendChild(r);
    });
    if(!html) list.innerHTML='<div class="fv-empty">لسه مفيش أصناف في المفضلة 💔<br>اضغط ♥ على أي صنف في المنيو وهيظهر هنا</div>';
  }
  bar.onclick=function(e){ e.stopPropagation(); document.body.classList.remove('favonly'); bar.classList.remove('on'); render(); ov.classList.add('open'); sh.classList.add('open'); };
  ov.onclick=close; document.getElementById('rrFavX').onclick=close;
  document.addEventListener('keydown',function(e){ if(e.key==='Escape') close(); });
})();
} catch (e) { console.error("[app.js جزء 11]", e); }

/* ── جزء 12 ── */
try {
(function(){
  var tx=document.getElementById('ptText'), nat=document.getElementById('f_ptime'), ap=document.getElementById('ptAp'), btn=document.getElementById('ptBtn'), hint=document.getElementById('ptHint');
  if(!tx||!nat) return;
  var per='pm', HINT='اكتب الوقت أو اضغط على رمز الساعة 🕒 — أقرب موعد بعد '+(((window.RR_CFG&&+RR_CFG.pickMin)||15)===15?'١٥':((window.RR_CFG&&+RR_CFG.pickMin)||15))+' دقيقة من الطلب (وقت التحضير)';
  function en(s){return s.replace(/[٠-٩]/g,function(d){return '٠١٢٣٤٥٦٧٨٩'.indexOf(d)})}
  function setAp(p){per=p; [].forEach.call(ap.querySelectorAll('button'),function(b){b.classList.toggle('on',b.dataset.v===p)})}
  function show(h,m){ var h12=(h%12)||12, p=h>=12?'م':'ص'; hint.textContent='✔ موعد الاستلام: '+h12+':'+('0'+m).slice(-2)+' '+p; hint.className='ptime-hint ok'; }
  function clear(txt){ nat.value=''; hint.textContent=txt||HINT; hint.className='ptime-hint'; }
  function fromText(){
    var d=en(tx.value).replace(/\D/g,'').slice(0,4);
    tx.value = d.length>2 ? d.slice(0,d.length-2)+':'+d.slice(-2) : d;
    if(!d){ clear(); return; }
    var h,m;
    if(d.length<=2){h=+d;m=0} else {h=+d.slice(0,d.length-2); m=+d.slice(-2)}
    if(h>23||m>59||(d.length<=2&&h===0)){ clear('⚠️ الوقت غير صحيح'); return; }
    if(h>12){ setAp('pm'); } else if(h===0){ setAp('am'); }
    var h24=h; if(h<=12&&h!==0){ h24=(h%12)+(per==='pm'?12:0); } 
    nat.value=('0'+h24).slice(-2)+':'+('0'+m).slice(-2); show(h24,m);
    nat.dispatchEvent(new Event('input',{bubbles:true}));
  }
  tx.addEventListener('input',fromText);
  ap.addEventListener('click',function(e){var b=e.target.closest('button'); if(!b) return; setAp(b.dataset.v); fromText();});
  function fromNative(){
    if(!nat.value){ return; } var p=nat.value.split(':'), h=+p[0], m=+p[1];
    setAp(h>=12?'pm':'am'); tx.value=((h%12)||12)+':'+('0'+m).slice(-2); show(h,m);
  }
  nat.addEventListener('change',fromNative); nat.addEventListener('input',fromNative);
  btn.addEventListener('click',function(){ try{ if(nat.showPicker) nat.showPicker(); }catch(e){} });
})();
} catch (e) { console.error("[app.js جزء 12]", e); }

/* ── جزء 13 ── */
try {
(function(){
  var b=document.body, y=0, locked=false;
  function lock(){ y=window.pageYOffset; b.style.position='fixed'; b.style.top='-'+y+'px'; b.style.left='0'; b.style.right='0'; b.style.width='100%'; locked=true; }
  function unlock(){ b.style.position=''; b.style.top=''; b.style.left=''; b.style.right=''; b.style.width=''; locked=false; window.scrollTo({top:y,left:0,behavior:'instant'}); }
  new MutationObserver(function(){ var on=b.classList.contains('no-scroll'); if(on&&!locked) lock(); else if(!on&&locked) unlock(); })
    .observe(b,{attributes:true,attributeFilter:['class']});
  var fs=document.getElementById('rrFavSheet');
  if(fs) new MutationObserver(function(){ b.classList.toggle('no-scroll', fs.classList.contains('open')); }).observe(fs,{attributes:true,attributeFilter:['class']});
})();
} catch (e) { console.error("[app.js جزء 13]", e); }

/* ── جزء 14 ── */
try {
(function(){
  function ready(){ requestAnimationFrame(function(){ requestAnimationFrame(function(){ document.documentElement.classList.add('rr-ready'); }); }); }
  if(document.readyState==='complete') ready(); else window.addEventListener('load',ready);
  setTimeout(function(){ document.documentElement.classList.add('rr-ready'); },3000);
})();
} catch (e) { console.error("[app.js جزء 14]", e); }

/* ── جزء 15 ── */
try {
(function(){
  var code=document.getElementById('pmCode'), hint=document.getElementById('pmCopyHint'), go=document.getElementById('promoGo');
  if(!code) return;
  code.addEventListener('click',function(){
    var done=function(){ hint.textContent='✅ تم نسخ الكود'; setTimeout(function(){ hint.textContent='اضغط للنسخ 📋'; },2200); };
    try{ navigator.clipboard.writeText('RED20').then(done,done); }catch(e){ done(); }
  });
  /* العميل بيكتب الكود بنفسه في صفحة تأكيد الطلب (مفيش تطبيق تلقائي) */
})();
} catch (e) { console.error("[app.js جزء 15]", e); }

/* ── جزء 16 ── */
try {
(function(){
  var bar=document.getElementById('rrCartBar'), n=document.getElementById('rrCbN'), tt=document.getElementById('rrCbT');
  function upd(){ var c=[]; try{ c=JSON.parse(localStorage.getItem('rr_cart')||'[]') }catch(e){}
    var q=0,s=0; c.forEach(function(i){ q+=i.qty||0; s+=(i.price||0)*(i.qty||0) });
    n.textContent=q; tt.textContent=s+' ج.م'; bar.classList.toggle('show',q>0); }
  bar.onclick=function(){ var f=document.querySelector('.cart-fab')||document.querySelector('#rrTabs [data-t=cart]'); if(f) f.click(); };
  upd(); setInterval(upd,900); window.addEventListener('storage',upd);
})();
} catch (e) { console.error("[app.js جزء 16]", e); }

/* ── جزء 17 ── */
try {
(function(){
  var grid=document.querySelector('#home .category-grid'); if(!grid||document.getElementById('rrHs')) return;
  var wrap=document.createElement('div');
  wrap.innerHTML='<div class="rr-chips"><span>🛵 دليفري</span><span>🏪 استلام من فرع فيصل المريوطية</span><span>💵 كاش</span><span>📱 فودافون كاش</span><span>🏦 إنستا باي</span></div>'+
    '<div class="rr-row-title"><h2>🔥 الأكثر طلباً</h2><small>اسحب ←</small></div><div class="rr-hs" id="rrHs"></div>'+
    '<div class="rr-row-title"><h2>الأقسام</h2></div>';
  grid.parentNode.insertBefore(wrap,grid);
  var hs=document.getElementById('rrHs');
  var picks=[]; ['#new-items','#nashville','#chicken-sandwiches','#beef-sandwiches','#twister-supreme'].forEach(function(s){
    var cs=[].slice.call(document.querySelectorAll(s+' .card[data-cart="1"]')).slice(0,s==='#new-items'?3:2); picks=picks.concat(cs); });
  picks.slice(0,10).forEach(function(c){
    var im=c.querySelector('.card-img'), nm=c.querySelector('.card-name'), pr=c.querySelector('.price-badge'), ad=c.querySelector('.add-cart-btn');
    if(!im||!nm) return;
    var d=document.createElement('div'); d.className='rr-tile';
    d.innerHTML='<img alt="" loading="lazy"><div class="tb"><b></b><div class="tp"><span></span><button type="button" class="plus" aria-label="أضف">+</button></div></div>';
    d.querySelector('img').src=im.getAttribute('src'); d.querySelector('b').textContent=nm.textContent.split(/[A-Za-z]/)[0].trim()||nm.textContent.trim();
    d.querySelector('.tp span').textContent=pr?pr.textContent.trim():'';
    d.addEventListener('click',function(){ (ad||c).click(); });
    hs.appendChild(d);
  });
  /* القسم النشط في الشريط العلوي يتوسّط تلقائياً */
  var o=window.showSection;
  if(typeof o==='function') window.showSection=function(){ o.apply(this,arguments); setTimeout(function(){ var a=document.querySelector('#nav-list button.active'); if(a&&a.scrollIntoView) a.scrollIntoView({inline:'center',block:'nearest',behavior:'smooth'}); },120); };
})();
} catch (e) { console.error("[app.js جزء 17]", e); }

/* ── جزء 18 ── */
try {
(function(){
  var API=window.RR_API, tabs=document.getElementById('rrTabs'); if(!API||!tabs) return;
  var $=function(i){return document.getElementById(i)}, STEP=2000, PER=10;
  function norm(p){return String(p||'').replace(/[٠-٩]/g,function(d){return '٠١٢٣٤٥٦٧٨٩'.indexOf(d)}).replace(/\D/g,'').replace(/^(0020|20)/,'0').slice(-11)}
  function u(q){return API+(API.indexOf('?')>-1?'&':'?')+q}
  function post(b){return fetch(API,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(b)}).then(function(r){return r.json()})}
  var b=document.createElement('button'); b.setAttribute('data-t','pts'); b.innerHTML='<span>⭐</span>نقاطي'; tabs.insertBefore(b,tabs.children[3]);
  function open(){ var ph=''; try{ph=(JSON.parse(localStorage.getItem('rr_customer')||'{}')||{}).phone||''}catch(e){} if(!$('ptPhone').value) $('ptPhone').value=norm(ph); $('rrPtsOv').classList.add('open'); $('rrPtsSheet').classList.add('open'); if(norm($('ptPhone').value).length===11) load(); }
  function close(){ $('rrPtsOv').classList.remove('open'); $('rrPtsSheet').classList.remove('open'); }
  b.addEventListener('click',open); $('rrPtsOv').onclick=close; $('rrPtsX').onclick=close; $('ptGo').onclick=load;
  function mine(){try{return JSON.parse(localStorage.getItem('rr_my_codes')||'[]')}catch(e){return []}}
  function refBlock(r){
    var fd=r.friend?('خصم '+(r.friend.type==='percent'?r.friend.value+'%':r.friend.value+' جنيه')+(r.friend.min?' على طلب '+r.friend.min+' جنيه فأكتر':'')):'خصم على أول طلب';
    return '<div class="pt-h">🎁 ادعُ صاحبك</div><div class="pt-card" style="text-align:right"><small>صاحبك بياخد '+fd+' على أول طلب، وانت بتاخد <b>'+r.reward+' نقطة</b> لما طلبه يتسلّم.</small>'+(r.invited?'<small style="display:block;margin-top:6px">دعواتك: '+r.invited+' · نقاط اتأكدت: '+r.earned+(r.pending?' · قيد التأكيد: '+r.pending:'')+'</small>':'')+'<button class="pt-btn" data-ref="'+r.code+'" style="margin-top:10px;width:100%">📤 ابعت الدعوة لصاحبك</button></div>';
  }
  function load(){
    var ph=norm($('ptPhone').value), out=$('ptOut'); if(ph.length!==11){ out.innerHTML='<p class="pt-note">⚠️ اكتب رقم موبايل صحيح (11 رقم)</p>'; return; }
    out.innerHTML='<p class="pt-note">⏳ جاري التحميل...</p>';
    fetch(u('action=points&phone='+ph+'&did='+(window.rrDid?window.rrDid():''))).then(function(r){return r.json()}).then(function(j){
      if(!j||!j.ok) throw 0;
      if(j.locked){ out.innerHTML='<div class="pt-card"><small>🔒 رصيد النقاط</small><b style="font-size:1.05rem;display:block;margin:6px 0">بيظهر من الجهاز اللي طلبت منه</b><small>حفاظًا على نقاطك، الرصيد والاستبدال متاحين بس من المتصفح اللي عملت منه طلب بالرقم ده. لو غيّرت جهازك أو مسحت بيانات المتصفح: اعمل طلب من الجهاز الجديد وهيتربط تلقائيًا، أو كلّمنا على 0237721525.</small></div>'; return; }
      var p=j.points, next=(Math.floor(p/STEP)+1)*STEP, pct=Math.min(100,Math.round((p%STEP)/STEP*100));
      var h='<div class="pt-card"><small>رصيدك الحالي</small><b>'+p+'</b><small>نقطة · قيمة تعادل '+(p/PER).toFixed(0)+' جنيه</small><div class="pt-bar"><i style="width:'+pct+'%"></i></div><small style="display:block;margin-top:6px">باقي '+(next-p)+' نقطة للحصول على خصم '+(next/PER)+' جنيه</small></div>';
      if(j.pending>0) h+='<p class="pt-note">⏳ نقاط قيد التأكيد: '+j.pending+' (بتتضاف بعد ما المطعم يأكد استلامك للطلب)</p>';
      if(j.ref) h+=refBlock(j.ref);
      h+='<div class="pt-h">🛍️ متجر النقاط</div>';
      [2000,4000,6000,10000].forEach(function(t){ h+='<div class="pt-tier"><span>خصم '+(t/PER)+' ج<small>'+t+' نقطة</small></span><button class="pt-btn" data-p="'+t+'"'+(p>=t?'':' disabled')+'>استبدل</button></div>'; });
      var m=mine().filter(function(c){return c.phone===ph});
      if(m.length){ h+='<div class="pt-h">🎟️ أكوادي</div>'; m.forEach(function(c){ h+='<div class="pt-code"><span><strong>'+c.code+'</strong><br><small>خصم '+c.value+' ج</small></span><button class="pt-btn" data-use="'+c.code+'">استخدم</button></div>'; }); }
      out.innerHTML=h+'<p class="pt-note">الكود صالح لاستخدام واحد، وبتكتبه في خانة كود الخصم في صفحة تأكيد الطلب.</p>';
    }).catch(function(){ out.innerHTML='<p class="pt-note">⚠️ تعذّر تحميل النقاط، جرّب تاني بعد شوية</p>'; });
  }
  $('ptOut').addEventListener('click',function(e){
    var r=e.target.closest('[data-p]'), us=e.target.closest('[data-use]');
    if(r){ r.disabled=true; r.textContent='...'; post({action:'redeem',phone:norm($('ptPhone').value),points:+r.dataset.p,did:window.rrDid?window.rrDid():''}).then(function(j){
        if(j&&j.ok){ var a=mine(); a.unshift({code:j.code,value:j.value,phone:norm($('ptPhone').value)}); localStorage.setItem('rr_my_codes',JSON.stringify(a)); } load(); }).catch(load); }
    if(us){ var i=document.getElementById('couponInput'), cb=document.getElementById('couponBtn'); if(i&&cb){ i.value=us.dataset.use; cb.click(); } close(); }
  });
  /* بعد كل طلب: نسجّل النقاط (قيد التأكيد) ونحرق كود النقاط المستخدم */
  window.rrOrderHook=function(o){ var ph=norm(o.phone); if(ph.length!==11) return;
    if(o.total>0) post({action:'order',phone:ph,total:o.total,orderId:o.orderId||('RR'+Date.now())}).catch(function(){});
  };
})();
} catch (e) { console.error("[app.js جزء 18]", e); }

/* ── جزء 19 ── */
try {
(function(){
  var hb=document.querySelector('.cart-head-btn'), tab=document.querySelector('#rrTabs [data-t=pts]');
  if(!hb||!tab||document.querySelector('.pts-head')) return;
  var b=document.createElement('button'); b.type='button'; b.className='pts-head'; b.innerHTML='⭐ نقاطي';
  b.onclick=function(){ tab.click(); };
  hb.parentNode.insertBefore(b,hb);
})();
} catch (e) { console.error("[app.js جزء 19]", e); }

/* ── جزء 20 ── */
try {
(function(){
  var nav=document.getElementById('mobileNav'); if(!nav) return;
  var y=0, locked=false;
  function lock(){ if(locked) return; locked=true; y=window.pageYOffset||document.documentElement.scrollTop||0;
    document.body.style.top=(-y)+'px'; document.body.classList.add('nav-locked'); }
  function unlock(){ if(!locked) return; locked=false;
    document.body.classList.remove('nav-locked'); document.body.style.top='';
    window.scrollTo(0,y); }
  new MutationObserver(function(){ nav.classList.contains('open') ? lock() : unlock(); })
    .observe(nav,{attributes:true,attributeFilter:['class']});
  /* لو الشاشة اتكبرت لديسكتوب والقائمة مفتوحة */
  window.addEventListener('resize',function(){ if(window.innerWidth>900 && nav.classList.contains('open') && typeof closeMobileNav==='function') closeMobileNav(); });
})();
} catch (e) { console.error("[app.js جزء 20]", e); }

/* ── جزء 21 ── */
try {
(function(){
  var hero=document.querySelector('#home .hero'), grid=document.querySelector('#home .category-grid');
  if(hero&&!document.querySelector('.pro-benefits')){
    var b=document.createElement('div'); b.className='pro-benefits';
    b.innerHTML='<div><i>🛵</i><span><b>توصيل سريع</b><small>حتى 60 دقيقة من التأكيد</small></span></div><div><i>🍗</i><span><b>دجاج طازج</b><small>بيتحضّر لما تطلب</small></span></div><div><i>⭐</i><span><b>نقاط مع كل طلب</b><small>بدّلها بخصومات</small></span></div><div><i>💳</i><span><b>كاش أو تحويل</b><small>فودافون كاش وإنستا باي</small></span></div>';
    hero.after(b);
  }
  if(grid&&!document.querySelector('.pro-loyal')){
    var l=document.createElement('div'); l.className='pro-loyal';
    l.innerHTML='<div class="pl-top"><span class="pl-star">⭐</span><div class="pl-txt"><span class="pl-tag">برنامج الولاء</span><h3>اجمع نقاط مع كل طلب</h3><p><b>50%</b> من قيمة كل طلب بتتحول لنقاط، وبدّلها بكود خصم على طلبك الجاي.</p></div><button type="button">⭐ شوف نقاطي</button></div><div class="pl-steps"><div><i>1</i><span><b>اطلب</b><small>من الموقع أو الفرع</small></span></div><div><i>2</i><span><b>اجمع</b><small>50% من الطلب نقاط</small></span></div><div><i>3</i><span><b>بدّل</b><small>بكود خصم لطلبك الجاي</small></span></div></div>';
    l.querySelector('button').onclick=function(){ var t=document.querySelector('#rrTabs [data-t=pts]'); if(t) t.click(); };
    grid.parentNode.insertBefore(l,grid);
  }
  var f=document.querySelector('footer');
  if(f&&!f.classList.contains('pro-foot')){
    f.classList.add('pro-foot');
    var logo=(document.querySelector('.logo-wrap img')||{}).src||'';
    f.innerHTML='<div class="pf-in"><div><div class="pf-brand"><img src="'+logo+'" alt="">Red Roosters</div><p>أروق ديك في مصر 🐓 دجاج مقرمش وساندوتشات وبرجر وصواني بجودة عالية وأسعار تنافسية.</p></div>'+
      '<div><h4>المنيو</h4><button class="l" data-s="offers">العروض</button><button class="l" data-s="nashville">ناشڤيل</button><button class="l" data-s="siniya">الصواني</button><button class="l" data-s="family-meals">الوجبات العائلية</button></div>'+
      '<div><h4>خدماتنا</h4><button class="l" data-s="branches">الفروع</button><button class="l" data-s="notes">ملحوظات هامة</button><button class="l" data-s="about">عنّا</button><button class="l" data-pts="1">⭐ نقاطي</button></div>'+
      '<div><h4>تواصل معنا</h4><a href="tel:0237721525">📞 0237721525</a><a href="https://wa.me/201023278000" target="_blank" rel="noopener">💬 واتساب 01023278000</a><a href="https://www.facebook.com/redrooster.eg/" target="_blank" rel="noopener">📘 فيسبوك</a><div class="pf-pay"><span>💵 كاش</span><span>📱 فودافون كاش</span><span>🏦 إنستا باي</span></div></div></div>'+
      '<div class="pf-copy"><span>&copy; 2026 <strong>Red Roosters</strong> — جميع الحقوق محفوظة</span><span>فرع فيصل المريوطية</span></div>';
    f.addEventListener('click',function(e){ var b=e.target.closest('button.l'); if(!b) return;
      if(b.dataset.s){ showSection(b.dataset.s); } else if(b.dataset.pts){ var t=document.querySelector('#rrTabs [data-t=pts]'); if(t) t.click(); } });
  }
})();
} catch (e) { console.error("[app.js جزء 21]", e); }

/* ── جزء 22 ── */
try {
(function(){
  var nav=document.querySelector('#mobileNav .mobile-nav-inner'); if(!nav||nav.dataset.pro) return; nav.dataset.pro=1;
  var EM=/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u2139\u{2B00}-\u{2BFF}\uFE0F\u200D]+/gu;
  var clean=function(s){return s.replace(EM,'').replace(/\s+/g,' ').trim()};
  var svg=function(p){return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">'+p+'</svg>'};
  var IC={home:'<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>',
    grid:'<rect x="3.5" y="3.5" width="7" height="7" rx="2"/><rect x="13.5" y="3.5" width="7" height="7" rx="2"/><rect x="3.5" y="13.5" width="7" height="7" rx="2"/><rect x="13.5" y="13.5" width="7" height="7" rx="2"/>',
    cart:'<path d="M3 4h2l2.4 11h10.2l2-8H6.2"/><circle cx="9.5" cy="19.5" r="1.4"/><circle cx="17" cy="19.5" r="1.4"/>',
    star:'<path d="M12 3.5l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17.5 6.6 20.4l1-6.1L3.2 10l6.1-.9z"/>',
    phone:'<path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A15 15 0 013 6a2 2 0 012-2z"/>',
    info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><circle cx="12" cy="7.8" r=".6"/>',
    pin:'<path d="M12 21s7-6.2 7-11.5A7 7 0 005 9.5C5 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.4"/>',
    note:'<path d="M6 3h9l4 4v14H6z"/><path d="M14 3v5h5"/><path d="M9 13h7M9 17h5"/>',
    dish:'<path d="M4 15h16"/><path d="M5 15a7 7 0 0114 0"/><path d="M3 19h18"/><path d="M12 6V4"/>',
    chev:'<path d="M9 5l7 7-7 7"/>'};
  var GROUPS=[['',['home']],['العروض والجديد',['back-to-school','new-items','siniya','offers','nashville']],
    ['المنيو',['beef-sandwiches','chicken-sandwiches','twister-supreme','individual-meals','family-meals','kids-meals','appetizers','extras','sauces','drinks']],
    ['المزيد',['about','branches','notes']]];
  var label={};
  [].forEach.call(nav.querySelectorAll('button'),function(b){var m=(b.getAttribute('onclick')||'').match(/showSection\('([^']+)'\)/); if(m) label[m[1]]=clean(b.textContent)});
  label.home='الرئيسية';
  var MORE={home:'home',about:'info',branches:'pin',notes:'note'};
  function thumb(id){
    var IMG={extras:'https://i.ibb.co/gBfWM1B/Combo.png',sauces:'https://i.ibb.co/6JWXhXkT/ransh.png',drinks:'https://i.ibb.co/PssjBFrY/image.webp',about:((document.querySelector('.logo-wrap img')||{}).src||'')};
    if(IMG[id]) return '<img src="'+IMG[id]+'" alt="" loading="lazy">';
    var im=document.querySelector('.cat-card[onclick*="\''+id+'\'"] img'); if(im) return '<img src="'+im.getAttribute('src')+'" alt="" loading="lazy">';
    return svg(IC[MORE[id]||'dish']);
  }
  function count(id){var s=document.getElementById(id); if(!s||MORE[id]) return ''; var n=s.querySelectorAll('[data-cart="1"]').length; return n?n+' صنف':''}
  var h='<div class="mn-head"><h3>القائمة</h3><button type="button" class="mn-x" aria-label="إغلاق">'+svg('<path d="M6 6l12 12M18 6L6 18"/>')+'</button></div><div class="mn-body">';
  GROUPS.forEach(function(g){
    if(g[0]) h+='<div class="mn-grp">'+g[0]+'</div>';
    g[1].forEach(function(id){ if(!label[id]) return;
      var c=count(id);
      h+='<button type="button" class="mn-row" data-id="'+id+'"><span class="mn-th">'+thumb(id)+'</span><span class="mn-t">'+label[id]+(c?'<small>'+c+'</small>':'')+'</span><span class="mn-ch">'+svg(IC.chev)+'</span></button>';
    });
  });
  nav.innerHTML=h+'</div>';
  nav.addEventListener('click',function(e){
    if(e.target.closest('.mn-x')){ closeMobileNav(); return; }
    var r=e.target.closest('.mn-row'); if(!r) return; showSection(r.dataset.id); closeMobileNav();
  });
  var mn=document.getElementById('mobileNav');
  new MutationObserver(function(){ if(!mn.classList.contains('open')) return;
    [].forEach.call(nav.querySelectorAll('.mn-row'),function(r){ r.classList.toggle('on', r.dataset.id===((typeof activeSection!=='undefined')?activeSection.id:'')); }); }).observe(mn,{attributes:true,attributeFilter:['class']});
  /* شيل الإيموشن من شريط الأقسام + أيقونات خطية للتابات السفلية */
  [].forEach.call(document.querySelectorAll('#nav-list button'),function(b){ b.textContent=clean(b.textContent); });
  var T={home:'home',menu:'grid',cart:'cart',pts:'star',call:'phone'};
  [].forEach.call(document.querySelectorAll('#rrTabs button'),function(b){ var s=b.querySelector('span'); if(s&&T[b.dataset.t]) s.innerHTML=svg(IC[T[b.dataset.t]]); });
})();
} catch (e) { console.error("[app.js جزء 22]", e); }

/* ── جزء 23 ── */
try {
(function(){
  var RING='<svg class="pl-ring" viewBox="0 0 200 200" aria-hidden="true"><defs><path id="plc" d="M100,100 m-93,0 a93,93 0 1,1 186,0 a93,93 0 1,1 -186,0"/></defs>'+
    '<g class="r1"><text><textPath href="#plc">RED ROOSTERS ★ FRIED CHICKEN &amp; BURGER ★ RED ROOSTERS ★ FRIED CHICKEN &amp; BURGER ★</textPath></text></g></svg>';
  var io='IntersectionObserver' in window?new IntersectionObserver(function(es){es.forEach(function(e){e.target.classList.toggle('spin',e.isIntersecting)})},{rootMargin:'120px'}):null;
  ['beef-sandwiches','chicken-sandwiches','twister-supreme'].forEach(function(id){
    var sec=document.getElementById(id); if(!sec) return;
    [].forEach.call(sec.querySelectorAll('.card'),function(c,i){
      if(c.classList.contains('plate-card')) return;
      var img=c.querySelector('img.card-img'); if(!img) return;
      c.classList.add('plate-card');
      var w=document.createElement('div'); w.className='pl-wrap'; w.innerHTML=RING.replace('id="plc"','id="plc'+id+i+'"').replace('#plc"','#plc'+id+i+'"');
      w.appendChild(img); c.insertBefore(w,c.firstChild);
      var tag=c.classList.contains('new-item')?'جديد':(i===0?'مميز':'');
      if(tag){ var s=document.createElement('span'); s.className='pl-tag'; s.textContent=tag; c.appendChild(s); }
      if(io) io.observe(w); else w.classList.add('spin');
    });
  });
})();
} catch (e) { console.error("[app.js جزء 23]", e); }

/* ── جزء 24 ── */
try {
(function(){
  var tabs=document.getElementById('rrTabs'); if(!tabs||tabs.dataset.v3) return; tabs.dataset.v3=1;
  var $=function(i){return document.getElementById(i)};
  var ind=document.createElement('i'); ind.className='tb-ind'; tabs.appendChild(ind);
  var cs=$('rrCallSheet'), co=$('rrCallOv');
  function openCall(){ cs.classList.add('open'); co.classList.add('open'); sync(); }
  function closeCall(){ cs.classList.remove('open'); co.classList.remove('open'); sync(); }
  co.onclick=closeCall; document.addEventListener('keydown',function(e){ if(e.key==='Escape') closeCall(); });
  /* "اتصل" بقت نافذة خيارات بدل اتصال مباشر */
  tabs.addEventListener('click',function(e){
    var b=e.target.closest('button'); if(!b) return;
    if(navigator.vibrate) try{navigator.vibrate(8)}catch(x){}
    if(b.dataset.t==='call'){ e.stopImmediatePropagation(); e.preventDefault(); openCall(); return; }
    setTimeout(sync,60); setTimeout(sync,400);
  },true);
  var open=function(id,cls){var el=$(id);return !!el&&el.classList.contains(cls||'open')};
  function current(){
    if(open('rrPtsSheet')) return 'pts';
    if(open('rrCallSheet')) return 'call';
    if(open('cartDrawer')) return 'cart';
    if(open('mobileNav')) return 'menu';
    var s=(typeof activeSection!=='undefined')?activeSection.id:'home'; return (!s||s==='home')?'home':'menu';
  }
  function sync(){
    var cur=current(), on=null;
    [].forEach.call(tabs.querySelectorAll('button'),function(b){ var is=b.dataset.t===cur; b.classList.toggle('on',is); if(is) on=b; });
    if(on&&on.dataset.t!=='cart'){ ind.classList.remove('off'); ind.style.left=(on.offsetLeft+(on.offsetWidth-28)/2)+'px'; } else ind.classList.add('off');
  }
  ['rrPtsSheet','rrCallSheet','cartDrawer','mobileNav'].forEach(function(id){ var el=$(id); if(el) new MutationObserver(sync).observe(el,{attributes:true,attributeFilter:['class']}); });
  var o=window.showSection; if(typeof o==='function') window.showSection=function(){ var r=o.apply(this,arguments); setTimeout(sync,30); return r; };
  window.addEventListener('resize',sync); window.addEventListener('load',sync); sync(); setTimeout(sync,500);
  /* يختفي مع النزول ويرجع مع الطلوع */
  var ly=window.pageYOffset, tk=false;
  window.addEventListener('scroll',function(){ if(tk) return; tk=true; requestAnimationFrame(function(){
    var y=window.pageYOffset, d=y-ly, nearEnd=y+innerHeight>document.documentElement.scrollHeight-80;
    if(document.body.classList.contains('no-scroll')||y<120||d<-6||nearEnd) document.body.classList.remove('tabs-hide');
    else if(d>10) document.body.classList.add('tabs-hide');
    if(Math.abs(d)>4) ly=y; tk=false; }); },{passive:true});
})();
} catch (e) { console.error("[app.js جزء 24]", e); }

/* ── جزء 25 ── */
try {
(function(){
  /* لو عندك صور من فوق (top-view) حطها هنا: اسم الصنف بالعربي (زي ما هو في المنيو) : رابط الصورة */
  window.RR_TOPVIEW=window.RR_TOPVIEW||{};
  var RING='<svg class="pl-ring" viewBox="0 0 200 200" aria-hidden="true"><defs><path id="plc" d="M100,100 m-93,0 a93,93 0 1,1 186,0 a93,93 0 1,1 -186,0"/></defs>'+
    '<g class="r1"><text><textPath href="#plc">RED ROOSTERS ★ FRIED CHICKEN &amp; BURGER ★ RED ROOSTERS ★ FRIED CHICKEN &amp; BURGER ★</textPath></text></g></svg>';
  var io='IntersectionObserver' in window?new IntersectionObserver(function(es){es.forEach(function(e){e.target.classList.toggle('spin',e.isIntersecting)})},{rootMargin:'120px'}):null;
  ['nashville','individual-meals','family-meals','kids-meals'].forEach(function(id){
    var sec=document.getElementById(id); if(!sec) return;
    [].forEach.call(sec.querySelectorAll('.card'),function(c,i){
      if(c.classList.contains('plate-card')) return;
      var img=c.querySelector('img.card-img'); if(!img) return;
      c.classList.add('plate-card');
      var w=document.createElement('div'); w.className='pl-wrap'; w.innerHTML=RING.replace('id="plc"','id="plc'+id+i+'"').replace('#plc"','#plc'+id+i+'"');
      w.appendChild(img); c.insertBefore(w,c.firstChild);
      var tag=c.classList.contains('new-item')?'جديد':(i===0?'مميز':'');
      if(tag){ var s=document.createElement('span'); s.className='pl-tag'; s.textContent=tag; c.appendChild(s); }
      if(io) io.observe(w); else w.classList.add('spin');
    });
  });
  /* ربط صور top-view بالأصناف (لو اتحطت) */
  document.querySelectorAll('.plate-card').forEach(function(c){
    var n=c.querySelector('.card-name'); if(!n) return;
    var cl=n.cloneNode(true); cl.querySelectorAll('.card-name-en').forEach(function(x){x.remove()});
    var key=cl.textContent.replace(/\s+/g,' ').trim(), url=window.RR_TOPVIEW[key];
    if(url){ var im=c.querySelector('.pl-wrap img.card-img'); if(im){ im.src=url; c.querySelector('.pl-wrap').classList.add('topview'); } }
  });
})();
} catch (e) { console.error("[app.js جزء 25]", e); }

/* ── جزء 26 ── */
try {
(function(){
  /* 0) كود تتبع اختياري: حط معرّف جوجل أناليتكس هنا (مثال G-XXXXXXX) */
  var GA_ID='';
  if(GA_ID){ var g=document.createElement('script'); g.async=true; g.src='https://www.googletagmanager.com/gtag/js?id='+GA_ID; document.head.appendChild(g);
    window.dataLayer=window.dataLayer||[]; window.gtag=function(){dataLayer.push(arguments)}; gtag('js',new Date()); gtag('config',GA_ID); }
  function track(n,p){ try{ if(window.gtag) gtag('event',n,p||{}); }catch(e){} }

  /* 1) روابط مباشرة لكل قسم + عنوان صفحة لكل قسم + زرار رجوع شغال */
  var base=document.title, o=window.showSection;
  function label(id){ var s=document.getElementById(id); if(!s) return ''; var t=s.querySelector('.section-title,h2'); return t?t.textContent.replace(/[^\u0600-\u06FFA-Za-z0-9 ڤ]/g,' ').replace(/\s+/g,' ').trim():''; }
  if(typeof o==='function'){
    window.showSection=function(id){
      var r=o.apply(this,arguments);
      try{
        var h=(id&&id!=='home')?'#'+id:'';
        if((location.hash||'')!==h) history.pushState({s:id||'home'},'',h||location.pathname+location.search);
        var l=h?label(id):''; document.title=l?l+' | ريد روستر':base;
        track('view_section',{section:id||'home'});
      }catch(e){}
      return r;
    };
    window.addEventListener('popstate',function(){ var id=(location.hash||'').slice(1)||'home'; var s=document.getElementById(id); if(s&&s.classList.contains('section')){ o(id); document.title=id==='home'?base:(label(id)?label(id)+' | ريد روستر':base); } });
    var first=(location.hash||'').slice(1), fs=first&&document.getElementById(first);
    if(fs&&fs.classList.contains('section')&&first!=='home') setTimeout(function(){ o(first); document.title=label(first)?label(first)+' | ريد روستر':base; },60);
  }

  /* 2) إمكانية الوصول: كل كارت يتفتح بالكيبورد */
  function a11y(root){ [].forEach.call((root||document).querySelectorAll('.cat-card,.card,.rr-tile,.siniya-card'),function(el){
    if(el.hasAttribute('tabindex')||el.matches('button,a')) return; el.setAttribute('tabindex','0'); el.setAttribute('role','button');
    var n=el.querySelector('h3,.card-name,b'); if(n&&!el.getAttribute('aria-label')) el.setAttribute('aria-label',n.textContent.replace(/\s+/g,' ').trim()); }); }
  a11y(); window.addEventListener('load',function(){a11y()});
  document.addEventListener('keydown',function(e){
    if(e.key!=='Enter'&&e.key!==' ') return; var t=e.target;
    if(!t||!t.matches||!t.matches('.cat-card,.card,.rr-tile,.siniya-card')||t.matches('button,a,input,select,textarea')) return;
    e.preventDefault(); t.click(); });

  /* 3) أداء: فك تشفير الصور بعيداً عن الخيط الرئيسي */
  [].forEach.call(document.querySelectorAll('img:not([decoding])'),function(i){ i.decoding='async'; });

  /* 4) تنبيه انقطاع الإنترنت */
  var off=document.getElementById('rrOffline');
  function net(){ off.classList.toggle('show',!navigator.onLine); }
  window.addEventListener('online',net); window.addEventListener('offline',net); net();

  /* 5) تثبيت الموقع على الشاشة الرئيسية (manifest) */
  try{
    var logo=(document.querySelector('.logo-wrap img')||{}).src||'';
    var m={name:'ريد روستر',short_name:'Red Roosters',lang:'ar',dir:'rtl',display:'standalone',start_url:location.href.split('#')[0],scope:location.href.split('#')[0].replace(/[^\/]*$/,''),background_color:'#FAF6F1',theme_color:'#1E1411'};
    if(logo) m.icons=[{src:logo,sizes:'192x192',type:'image/png',purpose:'any'}];
    var l=document.createElement('link'); l.rel='manifest'; l.href=URL.createObjectURL(new Blob([JSON.stringify(m)],{type:'application/manifest+json'})); document.head.appendChild(l);
    if(logo){ var ti=document.createElement('link'); ti.rel='apple-touch-icon'; ti.href=logo; document.head.appendChild(ti); }
  }catch(e){}

  /* 6) تتبع أحداث الطلب (لو التتبع شغال) */
  document.addEventListener('click',function(e){ var b=e.target.closest&&e.target.closest('.add-cart-btn'); if(b) track('add_to_cart'); },true);
})();
} catch (e) { console.error("[app.js جزء 26]", e); }

/* ── جزء 27 ── */
try {
(function(){
  /* وسم 🌶️ حار على الأصناف الحارة (بالاسم فقط) */
  var RX=/حار|سبايسي|هالبينو|زينجر|ساخن|spicy|zinger|chili|jalape|hot/i;
  [].forEach.call(document.querySelectorAll('.card'),function(c){
    var n=c.querySelector('.card-name'), b=c.querySelector('.card-body'); if(!n||!b||c.querySelector('.rr-hot')) return;
    if(!RX.test(n.textContent)) return;
    var t=document.createElement('span'); t.className='rr-hot'; t.textContent='🌶️ حار'; b.insertBefore(t,b.firstChild);
  });
  /* "عرض الكل" في صف الأكثر طلباً: ينزل لكل الأقسام */
  [].forEach.call(document.querySelectorAll('#home .rr-row-title'),function(r){
    var h=r.querySelector('h2'), s=r.querySelector('small');
    if(!h||!s||h.textContent.indexOf('الأكثر')<0) return;
    var b=document.createElement('button'); b.type='button'; b.className='rr-all'; b.textContent='كل الأقسام ←';
    b.onclick=function(){ var g=document.querySelector('#home .category-grid'); if(g) g.scrollIntoView({behavior:'smooth',block:'start'}); };
    s.replaceWith(b);
  });
})();
} catch (e) { console.error("[app.js جزء 27]", e); }

/* ── جزء 28 ── */
try {
(function(){
  var hdr=document.querySelector('header'); if(!hdr||document.getElementById('rrDeliv')) return;
  function LSg(k){ try{ return localStorage.getItem(k); }catch(e){ return null; } }
  function LSs(k,v){ try{ localStorage.setItem(k,v); }catch(e){} }
  var norm=function(s){ return String(s||'').toLowerCase().replace(/[\u064B-\u0652\u0640]/g,'').replace(/[أإآ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه').replace(/\s+/g,' ').trim(); };
  var bar=document.createElement('div'); bar.id='rrDeliv';
  bar.innerHTML='<button type="button" id="rrDelivBtn" aria-haspopup="dialog"><span class="dv-ic" id="rrDelivIc">🛵</span><span class="dv-t"><small>التوصيل إلى</small><b id="rrDelivName">اختار منطقتك</b></span><span class="dv-fee" id="rrDelivFee"></span><span class="dv-ch">تغيير</span></button>';
  var mq=window.matchMedia('(min-width:901px)');
  function place(){ var hi=hdr.querySelector('.header-inner'), lw=hi&&hi.querySelector('.logo-wrap');
    if(mq.matches&&hi&&lw){ if(bar.parentNode!==hi) lw.after(bar); } else if(bar.parentNode!==hdr.parentNode||bar.previousElementSibling!==hdr) hdr.after(bar); }
  place(); (mq.addEventListener?mq.addEventListener('change',place):mq.addListener(place));
  var ov=document.createElement('div'); ov.id='rrAreaOv';
  var sh=document.createElement('div'); sh.id='rrAreaSheet'; sh.setAttribute('role','dialog'); sh.setAttribute('aria-label','اختيار منطقة التوصيل');
  sh.innerHTML='<div class="as-grip"></div><h3>طلبك هيوصل فين؟</h3><div class="as-seg"><button type="button" data-t="delivery">🛵 دليفري</button><button type="button" data-t="pickup">🏪 استلام من الفرع</button></div><input id="rrAreaQ" type="text" placeholder="اكتب أول حروف المنطقة... (مثال: طوابق)" autocomplete="off"><div id="rrAreaList"></div>';
  document.body.appendChild(ov); document.body.appendChild(sh);
  var q=document.getElementById('rrAreaQ'), list=document.getElementById('rrAreaList');
  function A(){ return window.rrArea; }
  function paint(){
    var a=A(); if(!a) return; var cur=a.idx(), pk=a.pk();
    [].forEach.call(sh.querySelectorAll('.as-seg button'),function(b){ b.classList.toggle('on',b.dataset.t===(pk?'pickup':'delivery')); });
    q.style.display=list.style.display=pk?'none':'';
    if(pk){ list.innerHTML=''; return; }
    var ws=norm(q.value).split(' ').filter(Boolean), out='';
    a.areas.forEach(function(x,i){ var n=norm(x.name); if(ws.every(function(w){return n.indexOf(w)>-1})) out+='<button type="button" class="as-item'+(String(i)===String(cur)?' sel':'')+'" data-i="'+i+'"><span>'+x.name+'</span><b>'+x.fee+' ج.م</b></button>'; });
    list.innerHTML=out||'<div class="as-empty">مفيش منطقة بالاسم ده 🤔</div>';
  }
  function openS(){ paint(); ov.classList.add('open'); sh.classList.add('open'); if(!A()||!A().pk()) setTimeout(function(){ try{q.focus({preventScroll:true})}catch(e){} },350); }
  function closeS(){ ov.classList.remove('open'); sh.classList.remove('open'); }
  window.rrOpenArea=openS;
  document.getElementById('rrDelivBtn').onclick=openS; ov.onclick=closeS;
  document.addEventListener('keydown',function(e){ if(e.key==='Escape') closeS(); });
  q.addEventListener('input',paint);
  sh.querySelector('.as-seg').addEventListener('click',function(e){ var b=e.target.closest('button'); if(!b||!A()) return; A().setType(b.dataset.t); if(b.dataset.t==='pickup') closeS(); else paint(); });
  list.addEventListener('click',function(e){ var b=e.target.closest('.as-item'); if(!b||!A()) return; if(A().pk()) A().setType('delivery'); A().set(+b.dataset.i); LSs('rr_area',b.dataset.i); closeS(); });
  /* مزامنة الشريط وسلة الطلب مع اختيار المنطقة (بتتنادى من render و renderSummary) */
  var fmt=function(n){ return n+' ج.م'; };
  function cartRows(){
    var foot=document.getElementById('cartFoot'), go=document.getElementById('goCheckout'); if(!foot||!go) return null;
    var f=document.getElementById('rrCartFee');
    if(!f){ f=document.createElement('div'); f.id='rrCartFee'; f.className='sum-row'; f.innerHTML='<span></span><span></span>'; foot.insertBefore(f,go);
      var t=document.createElement('div'); t.id='rrCartTot'; t.className='sum-row total'; t.innerHTML='<span>الإجمالي بعد التوصيل</span><span></span>'; foot.insertBefore(t,go);
      f.addEventListener('click',function(e){ if(e.target.closest('.rr-link')) openS(); }); }
    return {f:f,t:document.getElementById('rrCartTot')};
  }
  window.rrSync=function(){
    var a=A(); if(!a) return;
    var pk=a.pk(), i=a.idx(), has=i!==''&&a.areas[+i], fee=pk?0:(has?a.fee():null);
    document.getElementById('rrDelivIc').textContent=pk?'🏪':'🛵';
    document.querySelector('#rrDeliv small').textContent=pk?'الاستلام من':'التوصيل إلى';
    document.getElementById('rrDelivName').textContent=pk?'فرع فيصل المريوطية':(has?a.areas[+i].name:'اختار منطقتك');
    document.getElementById('rrDelivFee').textContent=pk?'بدون رسوم':(has?(fee===0?'توصيل مجاني 🎉':'رسوم '+fmt(fee)):'');
    if(has){ LSs('rr_area',String(i)); LSs('rr_area_n',a.areas[+i].name); window.RR_SAVED_AREA=a.areas[+i].name; }
    var r=cartRows(); if(!r) return;
    r.f.firstChild.textContent=pk?'🏪 استلام من الفرع':'🛵 التوصيل'+(has?' ('+a.areas[+i].name+')':'');
    if(fee===null){ r.f.lastChild.innerHTML='<b class="rr-link">اختار منطقتك</b>'; r.t.style.display='none'; }
    else{ r.f.lastChild.textContent=pk?'بدون رسوم':(fee===0?'مجاني 🎉':fmt(fee)); r.t.style.display=''; r.t.lastChild.textContent=fmt(a.net()+fee); }
  };
  /* استرجاع آخر منطقة اختارها العميل */
  var a0=A(); if(a0){ var sn0=LSg('rr_area_n'), sv=LSg('rr_area'), si0=sn0?a0.areas.findIndex(function(x){return x.name===sn0}):(sv!==null?+sv:-1); if(a0.idx()===''&&si0>=0&&a0.areas[si0]) a0.set(si0); }
  window.rrSync();
})();
} catch (e) { console.error("[app.js جزء 28]", e); }

/* ── جزء 29 ── */
try {
(function(){
  var API=window.RR_API; if(!API) return;
  var $=function(i){return document.getElementById(i)};
  var KEY='rr_orders', QKEY='rr_order_queue', FINAL={delivered:1,cancelled:1}, cache={}, timer=null;
  var norm=function(p){return String(p||'').replace(/[٠-٩]/g,function(d){return '٠١٢٣٤٥٦٧٨٩'.indexOf(d)}).replace(/\D/g,'').replace(/^(0020|20)/,'0').slice(-11)};
  var esc=function(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
  var get=function(k){try{return JSON.parse(localStorage.getItem(k)||'[]')||[]}catch(e){return []}};
  var put=function(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
  var url=function(q){return API+(API.indexOf('?')>-1?'&':'?')+q};
  var PAY={cash:'كاش عند الاستلام',wallet:'محفظة إلكترونية',instapay:'إنستا باي'};
  function steps(type){return [['new','تم الاستلام','🧾'],['confirmed','تم التأكيد','✅'],['preparing','بنجهّزه','👨‍🍳'],['out',type==='pickup'?'جاهز للاستلام':'خرج للتوصيل',type==='pickup'?'🏪':'🛵'],['delivered','تم التسليم','🎉']];}
  function etaHtml(o,type,st){
    if(!o||o.sched||type==='pickup'||st==='delivered'||st==='cancelled') return '';
    var m=o.eta||(window.RR_ETA&&window.RR_ETA.delivery)||0; if(!m) return '';
    var target=o.time+m*60000, left=Math.round((target-Date.now())/60000), clk=''; try{ clk=new Date(target).toLocaleTimeString('ar-EG',{hour:'numeric',minute:'2-digit'}); }catch(x){}
    if(st==='out'&&left<=0) return '<div class="tk-eta">🛵 الطيار في الطريق ليك — قربنا نوصل 🙏</div>';
    return left>1?'<div class="tk-eta">⏱️ الوصول المتوقع حوالي <b>'+clk+'</b> <small>(بعد '+left+' دقيقة تقريبًا)</small></div>':'<div class="tk-eta late">⏱️ اتأخرنا شوية عن الميعاد المتوقع، بنسرّع عشان نوصلك 🙏</div>';
  }
  function when(t){try{return new Date(t).toLocaleString('ar-EG',{day:'numeric',month:'short',hour:'numeric',minute:'2-digit'})}catch(e){return ''}}

  /* ── حفظ الأوردر على السيرفر (مع إعادة المحاولة لو النت فصل) ── */
  function send(o){return fetch(API,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(Object.assign({action:'newOrder'},o)),keepalive:true})
    .then(function(r){return r.json()}).then(function(j){ if(!j||!j.ok) throw 0; });}
  function flush(){ var q=get(QKEY); if(!q.length) return; put(QKEY,[]);
    q.forEach(function(o){ send(o).catch(function(){ var n=get(QKEY); n.push(o); put(QKEY,n.slice(-10)); }); }); }
  function post1(o,ms){ var ctl=window.AbortController?new AbortController():null, to=ctl?setTimeout(function(){ctl.abort()},ms):0;
    return fetch(API,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(Object.assign({action:'newOrder'},o)),signal:ctl?ctl.signal:undefined})
      .then(function(r){return r.json()}).then(function(j){clearTimeout(to);return j},function(e){clearTimeout(to);throw e}); }
  /* بيرجّع 'ok' | 'coupon_used' | 'fail' — محاولتين (السيرفر بيتجاهل التكرار بنفس رقم الطلب) */
  window.rrTrackSave=function(o){
    if(!o.did&&window.rrDid) o.did=window.rrDid();
    if(o.coupon==='FRIEND'&&!o.ref){ try{ o.ref=localStorage.getItem('rr_ref')||''; }catch(e){} }   // كود دعوة الصاحب
    function attempt(n){ return post1(o,18000).then(function(j){
        if(j&&j.ok) return 'ok'; if(j&&j.error==='coupon_used') return 'coupon_used'; if(j&&j.error==='closed') return 'closed'; if(j&&j.error==='pay_off') return 'pay_off'; if(j&&/^coupon_(invalid|expired|limit|not_new)$/.test(j.error)) return j.error; if(j&&j.error==='blocked') return 'blocked'; if(j&&j.error==='unverified') return 'unverified'; if(j&&j.error==='bad_sched') return 'bad_sched'; if(j&&j.error==='bad_pick') return 'bad_pick'; if(j&&j.error==='busy') return 'busy'; if(j&&j.error==='bad_total') return 'bad_total'; if(j&&(j.error==='bad_price'||j.error==='bad_item')) return 'bad_price'; if(j&&/^(delivery_paused|area_closed|bad_area)$/.test(j.error)) return j.error; if(j&&j.error==='soldout'){ window.rrSoNames=j.items||[]; return 'soldout'; }
        return n<2?attempt(n+1):'fail';
      },function(){ return n<2?attempt(n+1):'fail'; }); }
    return attempt(1).then(function(r){
      if(r==='ok'){ var a=get(KEY); if(!a.some(function(e){return e.id===o.id})){ a.unshift({id:o.id,phone:norm(o.phone),t:Date.now(),status:'new',type:o.type}); put(KEY,a.slice(0,10)); } updatePill(); }
      return r; });
  };

  /* ── جلب الحالة ── */
  function track(e){return fetch(url('action=track&id='+encodeURIComponent(e.id)+'&phone='+e.phone)).then(function(r){return r.json()})
    .then(function(j){ if(!j||!j.ok) throw 0; if(j.found&&j.order) j.order._exp=Date.now()+(+j.order.winLeft||0); return j.found?j.order:null; });}
  function refresh(force){
    var a=get(KEY), jobs=a.filter(function(e){return force||!FINAL[e.status]}).slice(0,5).map(function(e){
      return track(e).then(function(o){ if(o){ cache[e.id]=o; e.status=o.status; e.type=o.type; } else if(cache[e.id]===undefined) cache[e.id]=null; }).catch(function(){}); });
    return Promise.all(jobs).then(function(){ put(KEY,a); updatePill(); if($('rrTkSheet').classList.contains('open')) render(); });
  }

  /* ── تتبع الطيار (OwnTracks) على خريطة ── */
  var DRV={}, drvMaps={}, drvT=0;
  function drvLoad(cb){ if(window.L) return cb(); if(drvLoad.q) return drvLoad.q.push(cb); drvLoad.q=[cb];
    var l=document.createElement('link'); l.rel='stylesheet'; l.href='https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css'; document.head.appendChild(l);
    var s=document.createElement('script'); s.src='https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js'; s.onload=function(){ var q=drvLoad.q; drvLoad.q=null; q.forEach(function(f){ f(); }); }; document.head.appendChild(s); }
  function drvFetch(){ get(KEY).filter(function(e){ var o=cache[e.id]; return o&&o.status==='out'&&o.type!=='pickup'; }).slice(0,3).forEach(function(e){
    fetch(url('action=drvpos&id='+encodeURIComponent(e.id)+'&phone='+e.phone)).then(function(r){return r.json()}).then(function(j){ if(j&&j.ok){ DRV[e.id]=j; drvPaint(); } }).catch(function(){}); }); }
  var drvHide=false; try{ drvHide=localStorage.getItem('rr_drvhide')==='1'; }catch(x){}
  (function(){ var st=document.createElement('style'); st.textContent='.rr-dm{width:46px;height:46px;border-radius:50%;background:#9E1B1B;border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center;font-size:24px;line-height:1;position:relative}.rr-dm:after{content:"";position:absolute;inset:-6px;border-radius:50%;border:2px solid rgba(158,27,27,.5);animation:rrdm 1.6s ease-out infinite}@keyframes rrdm{from{transform:scale(.8);opacity:1}to{transform:scale(1.5);opacity:0}}.rr-dm.h{background:#1d3f8f}.rr-dm.h:after{display:none}.tk-dmb{border:1px solid #c9d8f5;background:#fff;color:#1d3f8f;border-radius:999px;padding:6px 14px;font:700 .8rem Cairo,sans-serif;margin-top:6px;cursor:pointer}'; document.head.appendChild(st);
    document.addEventListener('click',function(ev){ var b=ev.target.closest&&ev.target.closest('[data-dm]'); if(!b) return; drvHide=!drvHide; try{ localStorage.setItem('rr_drvhide',drvHide?'1':''); }catch(x){} drvPaint(); }); })();
  function drvIcon(){ return L.divIcon({className:'',iconSize:[46,46],iconAnchor:[23,23],html:'<div class="rr-dm"><span>🛵</span></div>'}); }
  function drvKm(a,b,c,d){ var R=6371,x=(c-a)*Math.PI/180,y=(d-b)*Math.PI/180,q=Math.sin(x/2)*Math.sin(x/2)+Math.cos(a*Math.PI/180)*Math.cos(c*Math.PI/180)*Math.sin(y/2)*Math.sin(y/2); return 2*R*Math.asin(Math.sqrt(q)); }
  function drvRoute(m,d){ if(d.dlat==null||(m.rt&&Date.now()-m.rt<30000)) return; m.rt=Date.now();
    fetch('https://router.project-osrm.org/route/v1/driving/'+d.lon+','+d.lat+';'+d.dlon+','+d.dlat+'?overview=full&geometries=geojson').then(function(r){return r.json()}).then(function(j){ var r=j&&j.routes&&j.routes[0]; if(!r) return;
      m.info={km:r.distance/1000,min:Math.max(1,Math.round(r.duration/60))};
      if(m.map){ if(m.line) m.map.removeLayer(m.line); m.line=L.polyline(r.geometry.coordinates.map(function(c){return [c[1],c[0]]}),{color:'#9E1B1B',weight:5,opacity:.85}).addTo(m.map); }
      drvPaint(); }).catch(function(){}); }
  function drvPaint(){ document.querySelectorAll('.tk-drv').forEach(function(box){ var id=box.getAttribute('data-id'), d=DRV[id]; if(!d||!d.on) return;
    var nm=d.name?esc(d.name):'الطيار';
    if(d.lat==null){ box.innerHTML='<div class="tk-eta">🛵 '+nm+' خرج بطلبك — بنستنى إشارة الموقع...</div>'; return; }
    var ago=d.age<60?'دلوقتي':'من '+Math.round(d.age/60)+' د', m=drvMaps[id], hasD=d.dlat!=null, inf=m&&m.info;
    var dist=inf?' · باقي حوالي <b>'+inf.min+'</b> دقيقة ('+inf.km.toFixed(1)+' كم)':(hasD?' · يبعد حوالي '+drvKm(d.lat,d.lon,d.dlat,d.dlon).toFixed(1)+' كم':'');
    box.innerHTML='<div class="tk-eta">🛵 <b>'+nm+'</b> في الطريق ليك'+dist+'<br><small>آخر تحديث للموقع '+ago+'</small></div><button type="button" class="tk-dmb" data-dm="1">'+(drvHide?'🗺️ إظهار الخريطة':'🗺️ إخفاء الخريطة')+'</button>';
    if(drvHide) return;
    if(!m){ m=drvMaps[id]={el:document.createElement('div')}; m.el.style.cssText='height:220px;border-radius:12px;margin-top:8px;overflow:hidden;direction:ltr'; }
    box.appendChild(m.el);
    drvLoad(function(){ if(!m.map){ m.map=L.map(m.el).setView([d.lat,d.lon],15); L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'© OpenStreetMap'}).addTo(m.map); m.mk=L.marker([d.lat,d.lon],{icon:drvIcon()}).addTo(m.map); }
      else m.mk.setLatLng([d.lat,d.lon]);
      setTimeout(function(){ m.map.invalidateSize();
        if(hasD){ if(!m.dk) m.dk=L.marker([d.dlat,d.dlon],{icon:L.divIcon({className:'',iconSize:[46,46],iconAnchor:[23,23],html:'<div class="rr-dm h"><span>🏠</span></div>'})}).addTo(m.map);
          if(!m.info){ if(m.line) m.map.removeLayer(m.line); m.line=L.polyline([[d.lat,d.lon],[d.dlat,d.dlon]],{color:'#9E1B1B',weight:3,dashArray:'6 8'}).addTo(m.map); }
          m.map.fitBounds([[d.lat,d.lon],[d.dlat,d.dlon]],{padding:[40,40],maxZoom:17}); drvRoute(m,d); }
        else m.map.panTo([d.lat,d.lon]); },60); }); }); }

  /* ── تعديل / إلغاء الطلب: مباشر خلال المدة، وبعدها بيتبعت «طلب» للمطعم وبنستنى رده ── */
  var EDIT={}, ERR={expired:'عدّت مدة التعديل المباشر — ابعت طلب للمطعم.',locked:'الطلب اتجهّز أو خرج — ابعت طلب للمطعم.',closed:'الطلب خلص أو اتلغى.',pending:'عندك طلب لسه مستني رد المطعم.',busy:'محاولات كتير، جرّب بعد شوية.',nochange:'ماغيّرتش حاجة في الطلب.',bad_items:'في مشكلة في الأصناف، جرّب تاني.',empty:'لو عايز تلغي الطلب كله استخدم «إلغاء الطلب».',coupon_min:'التعديل ده هيخلّي الكوبون ميتطبّقش (الحد الأدنى). ابعت طلب للمطعم.',free_min:'التعديل ده هيلغي التوصيل المجاني (الحد الأدنى). ابعت طلب للمطعم.',not_found:'مش لاقيين الطلب ده.',soldout:'في صنف مش متاح دلوقتي.',bad_price:'سعر صنف مش مظبوط — حدّث الصفحة وجرّب تاني.',bad_item:'في صنف مش معروف — حدّث الصفحة وجرّب تاني.'};
  function postJ(o){ var ctl=window.AbortController?new AbortController():null, to=ctl?setTimeout(function(){ctl.abort()},30000):0;
    return fetch(API,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(o),signal:ctl?ctl.signal:undefined}).then(function(r){return r.json()}).then(function(j){clearTimeout(to);return j},function(e){clearTimeout(to);throw e}); }
  function direct(o){return !!(o&&o.canEdit&&o._exp>Date.now());}
  function mmss(ms){var s=Math.max(0,Math.ceil(ms/1000)),m=Math.floor(s/60);return m+':'+('0'+(s%60)).slice(-2);}
  function sumQ(o,ed){var s=0;(o.items||[]).forEach(function(i,k){s+=i.p*(ed.q[k]|0);});(ed.adds||[]).forEach(function(a){s+=a.p*a.q;});return s;}
  function actHtml(e,o,st){
    if(!o||st==='delivered'||st==='cancelled') return '';
    var ch=o.chg, ed=EDIT[e.id], dr=direct(o), h='', id=esc(e.id);
    if(ch&&ch.s==='pending') return '<div class="tk-chg wait">⏳ طلب '+(ch.k==='cancel'?'الإلغاء':'التعديل')+' وصل المطعم — مستني تأكيدهم، وهنبلّغك أول ما يردّوا.</div>';
    if(ch&&ch.s==='no') h+='<div class="tk-chg no">❌ المطعم مقدرش ينفّذ طلبك '+(ch.k==='cancel'?'للإلغاء':'للتعديل')+(ch.r?'<br>السبب: '+esc(ch.r):'')+'</div>';
    if(ch&&ch.s==='ok'&&ch.k==='edit'&&Date.now()-ch.t<36e5) h+='<div class="tk-chg ok">✅ المطعم وافق ونفّذ التعديل على طلبك.</div>';
    if(ed&&ed.mode==='edit'&&!dr){ ed.mode='reqedit'; ed.note=ed.note||''; }   // خلصت مدة التعديل المباشر: نحوّل التعديل لطلب للمطعم ونحافظ على اللي اختاره
    if(!ed){
      if(dr) return h+'<div class="tk-act"><div class="tk-win">⏱️ تقدر تعدّل أو تلغي طلبك بنفسك لمدة <b data-cd data-exp="'+o._exp+'">'+mmss(o._exp-Date.now())+'</b></div><div class="row"><button type="button" data-ed="edit" data-id="'+id+'">✏️ تعديل الأصناف</button><button type="button" class="neg" data-ed="cancel" data-id="'+id+'">❌ إلغاء الطلب</button></div></div>';
      return h+'<div class="tk-act"><div class="tk-win late">عدّت مدة التعديل المباشر. لو لسه محتاج تعدّل أو تلغي ابعت طلب للمطعم وهيراجعوه ويردّوا عليك.</div><div class="row"><button type="button" data-ed="reqedit" data-id="'+id+'">📨 طلب تعديل</button><button type="button" class="neg" data-ed="reqcancel" data-id="'+id+'">📨 طلب إلغاء</button></div></div>';
    }
    var isReq=ed.mode!=='edit', body='<h5>'+(ed.mode==='edit'?'✏️ عدّل طلبك':ed.mode==='reqedit'?'📨 طلب تعديل للمطعم':'📨 طلب إلغاء للمطعم')+'</h5>';
    if(ed.mode!=='reqcancel'){
      body+=(o.items||[]).map(function(i,k){var q=ed.q[k]|0;return '<div class="tk-ed-r'+(q?'':' z')+'"><span>'+esc(i.n)+(i.o&&i.o.length?'<small>'+esc(i.o.join('، '))+'</small>':'')+'<small>'+i.p+' ج للواحد</small></span><span class="tk-stp"><button type="button" data-ed="q" data-id="'+id+'" data-k="'+k+'" data-d="-1" aria-label="أقل">−</button><b>'+q+'</b><button type="button" data-ed="q" data-id="'+id+'" data-k="'+k+'" data-d="1" aria-label="أكتر">+</button></span></div>';}).join('');
      body+=(ed.adds||[]).map(function(a,k){return '<div class="tk-ed-r"><span>➕ '+esc(a.n)+(a.o&&a.o.length?'<small>'+esc(a.o.join('، '))+'</small>':'')+(a.t?'<small>📝 '+esc(a.t)+'</small>':'')+'<small>'+a.p+' ج للواحد — صنف جديد</small></span><span class="tk-stp"><button type="button" data-ed="aq" data-id="'+id+'" data-k="'+k+'" data-d="-1" aria-label="أقل">−</button><b>'+a.q+'</b><button type="button" data-ed="aq" data-id="'+id+'" data-k="'+k+'" data-d="1" aria-label="أكتر">+</button></span></div>';}).join('');
      body+='<div class="row" style="margin-top:8px"><button type="button" data-ed="addmenu" data-id="'+id+'">➕ إضافة صنف من المنيو</button></div>';
      body+='<div class="tk-meta">المجموع الجديد (قبل الخصم والتوصيل): <b>'+sumQ(o,ed)+'</b> ج.م — الإجمالي النهائي بيتحسب تلقائي. ('+'الكمية 0 = شيل الصنف)</div>';
      body+='<textarea class="tk-ed" data-f="notes" maxlength="400" placeholder="ملاحظات على الطلب (اختياري)">'+esc(ed.notes)+'</textarea>';
    }
    if(isReq) body+='<textarea class="tk-ed" data-f="note" maxlength="300" placeholder="'+(ed.mode==='reqcancel'?'سبب الإلغاء (اختياري)':'قولنا محتاج تعدّل إيه (اختياري)')+'">'+esc(ed.note||'')+'</textarea>';
    body+='<div class="row" style="margin-top:8px"><button type="button" class="pri" data-ed="'+(isReq?'sendreq':'save')+'" data-id="'+id+'">'+(isReq?'📨 ابعت الطلب للمطعم':'💾 حفظ التعديل')+'</button><button type="button" data-ed="close" data-id="'+id+'">رجوع</button></div><div class="tk-ed-m" data-m></div>';
    return h+'<div class="tk-act" data-edbox="'+id+'">'+body+(dr&&!isReq?'<div class="tk-win" style="margin:8px 0 0">⏱️ باقي <b data-cd data-exp="'+o._exp+'">'+mmss(o._exp-Date.now())+'</b></div>':'')+'</div>';
  }
  function edClick(b){
    var id=b.getAttribute('data-id'), act=b.getAttribute('data-ed'), o=cache[id], ent=get(KEY).filter(function(x){return x.id===id})[0], ed=EDIT[id];
    if(!o||!ent) return;
    if(act==='edit'||act==='reqedit'||act==='reqcancel'){ EDIT[id]={mode:act,q:(o.items||[]).map(function(i){return i.q}),notes:o.notes||'',note:'',adds:[]}; render(true); return; }
    if(act==='close'){ delete EDIT[id]; render(true); return; }
    var box=b.closest('.tk-act'), m=box&&box.querySelector('[data-m]'), say=function(t){ if(m) m.textContent=t||''; };
    function done(msg){ delete EDIT[id]; if(window.toast) toast(msg,4500); refresh(true).then(function(){ render(true); }); }
    function fail(j){ b.disabled=false; say(j&&j.error==='soldout'&&j.items&&j.items.length?'الصنف ده مش متاح دلوقتي: '+j.items.map(String).join('، ')+' — شيله وكمّل.':(j?(ERR[j.error]||'⚠️ تعذّر الإرسال، جرّب تاني'):'⚠️ النت بطيء أو الاتصال فصل — اتأكد من حالة طلبك قبل ما تحاول تاني.')); if(j&&(j.error==='expired'||j.error==='locked'||j.error==='pending'||j.error==='closed')) refresh(true).then(function(){ render(true); }); }
    if(act==='q'){ if(!ed) return; var k=+b.getAttribute('data-k'), d=+b.getAttribute('data-d'); ed.q[k]=Math.max(0,Math.min(30,(ed.q[k]|0)+d)); render(true); return; }
    if(act==='aq'){ if(!ed||!ed.adds) return; var ak=+b.getAttribute('data-k'), ad=+b.getAttribute('data-d'), a=ed.adds[ak]; if(!a) return; a.q=Math.min(30,a.q+ad); if(a.q<=0) ed.adds.splice(ak,1); render(true); return; }
    if(act==='addmenu'){ if(!ed) return; ADD=id; close(); try{ closeAll&&closeAll(); }catch(x){} addBar(); if(window.toast) toast('🍽️ اختار الصنف من المنيو وهيتضاف لتعديل طلبك',3500); return; }
    if(act==='cancel'){
      if(!confirm('متأكد إنك عايز تلغي الطلب #'+id+'؟ مينفعش ترجع فيها بعد كده.')) return;
      b.disabled=true; postJ({action:'custCancel',id:id,phone:ent.phone}).then(function(j){ if(j&&j.ok) done('❌ اتلغى طلبك #'+id); else fail(j); },function(){ fail(null); }); return; }
    if(!ed) return;
    var items=ed.q.map(function(q,i){return {i:i,q:q};}), any=ed.q.some(function(q){return q>0;})||(ed.adds&&ed.adds.length>0), adds=(ed.adds||[]).map(function(a){return {n:a.n,q:a.q,p:a.p,o:a.o,t:a.t};});
    if(act==='save'){
      if(!any){ say(ERR.empty); return; }
      b.disabled=true; say('⏳ بنحفظ...');
      postJ({action:'custEdit',id:id,phone:ent.phone,items:items,add:adds,notes:ed.notes}).then(function(j){ if(j&&j.ok) done('✅ اتعدّل طلبك — الإجمالي الجديد '+j.total+' ج.م'); else fail(j); },function(){ fail(null); }); return; }
    if(act==='sendreq'){
      var kind=ed.mode==='reqcancel'?'cancel':'edit';
      if(kind==='edit'&&!any){ say(ERR.empty); return; }
      b.disabled=true; say('⏳ بنبعت...');
      postJ({action:'custReq',id:id,phone:ent.phone,kind:kind,items:kind==='edit'?items:undefined,add:kind==='edit'?adds:undefined,notes:kind==='edit'?ed.notes:undefined,note:ed.note||''}).then(function(j){ if(j&&j.ok) done('📨 طلبك وصل المطعم — مستني تأكيدهم'); else fail(j); },function(){ fail(null); }); return; }
  }
  setInterval(function(){ var els=document.querySelectorAll('[data-cd]'); if(!els.length) return; var again=false;
    [].forEach.call(els,function(el){ var l=(+el.getAttribute('data-exp'))-Date.now(); if(l<=0) again=true; else el.textContent=mmss(l); });
    if(again&&$('rrTkSheet').classList.contains('open')) render(); },1000);

  /* ── وضع «إضافة صنف من المنيو لطلب بيتعدّل»: الصنف بيتضاف لمسودة التعديل بدل السلة ── */
  var ADD=null;
  function addBar(){
    var b=$('rrAddBar');
    if(!ADD){ if(b) b.style.display='none'; document.documentElement.classList.remove('rr-adding'); return; }
    if(!b){ b=document.createElement('div'); b.id='rrAddBar';
      b.style.cssText='position:fixed;left:10px;right:10px;bottom:max(12px,env(safe-area-inset-bottom));z-index:99999;background:#1E1411;color:#fff;border-radius:16px;padding:10px 12px;display:flex;gap:10px;align-items:center;box-shadow:0 6px 24px rgba(0,0,0,.4);font:700 .9rem Cairo,sans-serif';
      b.addEventListener('click',function(ev){ if(!ev.target.closest('[data-ab]')) return; var id=ADD; ADD=null; addBar(); if(id) open(id); });
      document.body.appendChild(b); }
    var n=(EDIT[ADD]&&EDIT[ADD].adds||[]).length;
    b.innerHTML='<span style="flex:1;line-height:1.5">✏️ بتضيف أصناف لطلب <b dir="ltr">#'+esc(ADD)+'</b>'+(n?' — ضفت '+n:'')+'</span><button type="button" data-ab="1" style="border:0;border-radius:12px;padding:10px 14px;background:#D92B2B;color:#fff;font:800 .9rem Cairo,sans-serif;cursor:pointer">✅ تم — ارجع للتعديل</button>';
    b.style.display='flex';
    document.documentElement.classList.add('rr-adding');
    /* على الموبايل: الشريط يقعد فوق القائمة السفلية (المنيو/السلة) مش فوقها */
    var off=12, t=$('rrTabs');
    try{
      if(t&&getComputedStyle(t).display!=='none'){
        var r=t.getBoundingClientRect(), vh=window.innerHeight||document.documentElement.clientHeight;
        if(r.height>0 && r.top>0 && r.top<vh) off=Math.round(vh-r.top)+8+30;   /* +30 = زرار السلة البارز */
      }
    }catch(e){}
    off=Math.min(Math.max(off,12),130);                                         /* حدود آمنة */
    b.style.bottom=off+'px';
    var h=off+(b.offsetHeight||60)+12; h=Math.min(h,Math.round((window.innerHeight||700)*0.4));
    document.documentElement.style.setProperty('--rr-addbar-h',h+'px'); }
  window.addEventListener('resize',function(){ if(ADD) addBar(); });
  window.RR_EDIT_HOOK=function(o){
    if(!ADD) return false; var ed=EDIT[ADD]; if(!ed){ ADD=null; addBar(); return false; }
    var n=o.label?o.name+' ('+o.label+')':o.name, opts=(o.opts||[]).slice(), t=o.note||'', hit=null;
    ed.adds=ed.adds||[]; ed.adds.forEach(function(a){ if(a.n===n&&a.p===o.price&&a.t===t&&a.o.join('|')===opts.join('|')) hit=a; });
    if(hit) hit.q=Math.min(30,hit.q+(o.qty||1)); else ed.adds.push({n:n,p:o.price,q:Math.min(30,o.qty||1),o:opts,t:t});
    addBar(); if(window.toast) toast('✅ اتضاف لتعديل طلبك: '+n,2500); return true; };

  /* ── الرسم ── */
  var LBL=['','سيئ 😞','مش كويس 😕','عادي 🙂','حلو 😋','ممتاز 🤩'], draft={},
      STAR='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.8l2.9 6 6.5.9-4.7 4.6 1.1 6.5L12 17.7l-5.8 3.1 1.1-6.5L2.6 9.7l6.5-.9z"/></svg>';
  function rateHTML(e){
    if(get('rr_rated').indexOf(e.id)>=0) return '<div class="tk-rate done">شكرًا على تقييمك 💛</div>';
    var d=draft[e.id]||(draft[e.id]={s:0,c:''});
    return '<div class="tk-rate'+(d.s?' open':'')+'" data-rbox="'+esc(e.id)+'" data-ph="'+esc(e.phone)+'"><div class="rt-h">⭐ قيّم تجربتك مع ريد روسترز</div><div class="rt-sub">رأيك بيفرق معانا</div>'
      +'<div class="rt-stars" role="radiogroup" aria-label="التقييم">'+[1,2,3,4,5].map(function(n){return '<button type="button" role="radio" aria-checked="'+(d.s===n)+'" aria-label="'+n+' من 5" data-star="'+n+'" class="'+(n<=d.s?'on':'')+'">'+STAR+'</button>'}).join('')+'</div>'
      +'<div class="rt-lbl'+(d.s?' set':'')+'">'+(d.s?LBL[d.s]:'دوس على النجوم')+'</div>'
      +'<textarea class="tk-cm" maxlength="200" rows="3" placeholder="احكيلنا تجربتك: الأكل، التوصيل، الخدمة... (اختياري)">'+esc(d.c)+'</textarea>'
      +'<div class="rt-foot"><small><span class="rt-n">'+d.c.length+'</span>/200</small><button type="button" class="rt-send" data-send="1">إرسال التقييم</button></div><div class="rt-msg"></div></div>';
  }
  function card(e){
    var o=cache[e.id], type=(o&&o.type)||e.type||'delivery', st=o?o.status:(e.status||'new'), S=steps(type);
    var lbl=st==='cancelled'?'ملغي':(S.filter(function(x){return x[0]===st})[0]||S[0])[1];
    var h='<div class="tk-card"><div class="tk-top"><span class="tk-id">#'+esc(e.id)+'</span><span class="tk-badge '+(st==='delivered'?'done':st==='cancelled'?'bad':'')+'">'+esc(lbl)+'</span></div>';
    h+='<div class="tk-meta">'+when(o?o.time:e.t)+(o?' · '+o.total+' ج.م':'')+(type==='pickup'?' · استلام من الفرع':' · دليفري')+'</div>';
    if(o&&o.sched&&st!=='delivered'&&st!=='cancelled') h+='<div class="tk-eta">⏰ ميعاد التوصيل المحجوز: <b>'+when(o.sched)+'</b></div>';
    if(o&&o.payment&&o.payment!=='cash'&&st!=='cancelled') h+='<div class="tk-pay '+(o.paid?'ok':'wait')+'">'+(o.paid?'✅ تم استلام التحويل':'⏳ في انتظار تأكيد التحويل'+(o.hasRef?'':' — ابعت صورة التحويل على واتساب 01023278000'))+'</div>';
    if(o===undefined) h+='<div class="tk-wait">⏳ بنجيب حالة الطلب...</div>';
    else if(o===null) h+='<div class="tk-wait">'+(Date.now()-e.t<600000?'⏳ بنسجّل طلبك.. ثواني ويظهر هنا.':'مش لاقيين الطلب ده. لو محتاج مساعدة كلمنا على الواتساب.')+'</div>';
    else if(st==='cancelled') h+='<div class="tk-cancel">❌ الطلب ده اتلغى'+(o.reason?'<br>السبب: '+esc(o.reason):'')+'<br><small>لو محتاج مساعدة أو ده غلط كلمنا على الواتساب.</small></div>';
    else{
      var idx=S.map(function(x){return x[0]}).indexOf(st);
      var MSG={new:['استلمنا طلبك','هنكلمك دلوقتي نأكده معاك'],confirmed:['طلبك اتأكد','بدأنا نجهّز الطلب'],preparing:['بنجهّز طلبك دلوقتي','الدجاج بيتحضّر طازج'],out:type==='pickup'?['طلبك جاهز','تقدر تستلمه من الفرع']:['طلبك في الطريق','الطيار هيوصلك قريب'],delivered:['تم التسليم','بالهنا والشفا 🐓']}[st]||['',''];
      var pct=Math.max(6,Math.round((idx<0?0:idx)/(S.length-1)*100));
      h+='<div class="tk-now"><span class="e">'+(idx<0?'':S[idx][2])+'</span><div><b>'+MSG[0]+'</b><small>'+MSG[1]+'</small></div></div><div class="tk-bar'+(st==='delivered'?' fin':'')+'"><i style="width:'+pct+'%"></i></div>';
      h+='<div class="tk-steps">'+S.map(function(x,i){return '<div class="tk-step'+(i<=idx?' on':'')+(i===idx?' cur':'')+'"><i>'+x[2]+'</i>'+esc(x[1])+'</div>'}).join('')+'</div>';
      h+=etaHtml(o,type,st);
      if(st==='out'&&type!=='pickup') h+='<div class="tk-drv" data-id="'+esc(e.id)+'"></div>';
      if(o.updated) h+='<div class="tk-meta">آخر تحديث: '+when(o.updated)+'</div>';
    }
    if(o&&o.items&&o.items.length){
      h+='<details class="tk-more"><summary>تفاصيل الطلب</summary>'+o.items.map(function(i){return '<div class="ln"><span>'+i.q+' × '+esc(i.n)+(i.o&&i.o.length?' <small>('+esc(i.o.join('، '))+')</small>':'')+'</span><span>'+(i.p*i.q)+'</span></div>'}).join('')
        +'<div class="ln"><span>المجموع</span><span>'+o.subtotal+'</span></div>'+(o.discount?'<div class="ln"><span>خصم</span><span>− '+o.discount+'</span></div>':'')
        +'<div class="ln"><span>'+(type==='pickup'?'استلام':'التوصيل')+'</span><span>'+(o.fee?o.fee:'بدون رسوم')+'</span></div>'
        +'<div class="ln sum"><span>الإجمالي</span><span>'+o.total+' ج.م</span></div><div class="ln"><span>الدفع</span><span>'+esc(PAY[o.payment]||o.payment)+'</span></div></details>';
    }
    h+=actHtml(e,o,st);
    if(st==='delivered'&&o&&e.phone){ h+=rateHTML(e); }
    if(o&&o.items&&o.items.length) h+='<button type="button" class="tk-re" data-re="'+esc(e.id)+'">🔁 اطلب نفس الطلب تاني</button>';
    return h+'</div>';
  }
  function render(force){ var ae=document.activeElement; if(!force&&ae&&ae.classList&&(ae.classList.contains('tk-cm')||ae.classList.contains('tk-ed'))&&$('tkList').contains(ae)) return; var a=get(KEY), ch=false; a.forEach(function(e){ if(e.status==='cancelled'&&!e.seen){ e.seen=true; ch=true; } }); $('tkList').innerHTML=a.length?a.map(card).join(''):'<div class="tk-empty">مفيش طلبات على الجهاز ده لسه 🍗<br>اطلب دلوقتي، أو تتبّع طلب برقمه من تحت.</div>'; if(ch){ put(KEY,a); updatePill(); } try{ drvPaint(); }catch(x){} }

  /* ── زرار التتبع في الهيدر: بيبان أوضح لما يكون فيه طلب شغال ── */
  function updatePill(){ try{ window.rrPushSync&&rrPushSync(); }catch(x){}
    var b=$('rrTkBtn'); if(!b) return; var t=b.querySelector('.tx');
    var all=get(KEY), now=Date.now();
    var a=all.filter(function(e){return !FINAL[e.status]&&now-e.t<864e5});
    var c=all.filter(function(e){return e.status==='cancelled'&&!e.seen&&now-e.t<864e5});
    if(c.length){ b.classList.add('act'); t.textContent='طلبك اتلغى · اعرف السبب'; b.title='اضغط لمعرفة سبب الإلغاء'; return; }
    if(!a.length){ b.classList.remove('act'); t.textContent='تتبع طلبي'; b.title='تتبع طلبي'; return; }
    var e=a[0], S=steps(e.type).filter(function(x){return x[0]===e.status})[0];
    var nt='طلبك: '+(S?S[1]:'قيد المراجعة'); if(t.textContent!==nt&&b.classList.contains('act')){ b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump'); if(navigator.vibrate) try{navigator.vibrate([30,40,30])}catch(x){} } if(!window.rrPushOn&&window.Notification&&Notification.permission==='granted'&&document.hidden&&t.textContent!==nt&&b.classList.contains('act')){ try{ new Notification('Red Roosters 🐓',{body:nt}); }catch(x){} } b.classList.add('act'); t.textContent=nt; b.title='اضغط لمتابعة طلبك';
  }
  if($('rrTkBtn')) $('rrTkBtn').onclick=function(){ open(); if(!window.RR_ONESIGNAL){ try{ if(window.Notification&&Notification.permission==='default') Notification.requestPermission(); }catch(x){} } };

  /* ── فتح/قفل ── */
  function open(id){
    try{ window.rrPushUI&&rrPushUI(); }catch(x){}
    $('rrTkOv').classList.add('open'); $('rrTkSheet').classList.add('open'); render();
    if(id&&!get(KEY).some(function(e){return e.id===id})){ $('tkId').value=id; try{ var c=JSON.parse(localStorage.getItem('rr_customer')||'{}'); if(c&&c.phone) $('tkPh').value=norm(c.phone); }catch(x){} }
    refresh(true).then(drvFetch); clearInterval(timer); timer=setInterval(function(){ refresh(false); },30000); clearInterval(drvT); drvT=setInterval(function(){ if(!document.hidden) drvFetch(); },15000);
  }
  function close(){ $('rrTkOv').classList.remove('open'); $('rrTkSheet').classList.remove('open'); clearInterval(timer); clearInterval(drvT); }
  window.rrTrackOpen=open;
  $('tkList').addEventListener('click',function(ev){var eb=ev.target.closest('[data-ed]'); if(eb){ edClick(eb); return; } var s=ev.target.closest('[data-star]'), box=ev.target.closest('[data-rbox]');
    if(s&&box){ var id=box.dataset.rbox, d=draft[id]||(draft[id]={s:0,c:''}); d.s=+s.dataset.star;
      [].forEach.call(box.querySelectorAll('[data-star]'),function(x){ x.classList.toggle('on',+x.dataset.star<=d.s); x.setAttribute('aria-checked',String(+x.dataset.star===d.s)); });
      var l=box.querySelector('.rt-lbl'); l.textContent=LBL[d.s]; l.classList.add('set'); box.classList.add('open');
      if(navigator.vibrate) try{navigator.vibrate(8)}catch(x){} return; }
    var sd=ev.target.closest('[data-send]');
    if(sd&&box){ var id2=box.dataset.rbox, d2=draft[id2]; if(!d2||!d2.s) return; var msg=box.querySelector('.rt-msg'); sd.disabled=true; sd.textContent='⏳ بنبعت...'; msg.textContent='';
      fetch(API,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify({action:'rate',id:id2,phone:box.dataset.ph,stars:d2.s,comment:String(d2.c||'').trim()})}).then(function(r){return r.json()})
        .then(function(j){ if(j&&j.ok){ var a=get('rr_rated'); a.push(id2); put('rr_rated',a.slice(-30)); delete draft[id2]; render(true); } else throw 0; })
        .catch(function(){ sd.disabled=false; sd.textContent='إرسال التقييم'; msg.textContent='⚠️ تعذّر الإرسال، جرّب تاني'; }); return; }
    var b=ev.target.closest('[data-re]');if(!b)return;var o=cache[b.dataset.re];if(!o||!o.items||!window.rrReorder)return;window.rrReorder(o.items);close();var f=document.querySelector('.cart-fab')||document.querySelector('#rrTabs [data-t=cart]');if(f)setTimeout(function(){f.click()},350);});
  $('tkList').addEventListener('input',function(ev){ var t=ev.target; if(t.classList&&t.classList.contains('tk-ed')){ var ab=t.closest('[data-edbox]'), eid=ab&&ab.getAttribute('data-edbox'); if(eid&&EDIT[eid]) EDIT[eid][t.getAttribute('data-f')]=t.value; return; } if(!t.classList||!t.classList.contains('tk-cm')) return; var bx=t.closest('[data-rbox]'); if(!bx) return;
    var d=draft[bx.dataset.rbox]||(draft[bx.dataset.rbox]={s:0,c:''}); d.c=t.value; var n=bx.querySelector('.rt-n'); if(n) n.textContent=t.value.length; });
  $('rrTkOv').onclick=close; $('rrTkX').onclick=close;
  document.addEventListener('keydown',function(e){ if(e.key==='Escape') close(); });

  /* ── تتبّع برقم الطلب ── */
  $('tkGo').onclick=function(){
    var id=$('tkId').value.trim().toUpperCase().replace(/[^A-Z0-9]/g,''), ph=norm($('tkPh').value), m=$('tkMsg');
    if(!id||ph.length!==11){ m.textContent='اكتب رقم الطلب ورقم الموبايل (11 رقم)'; return; }
    m.textContent='⏳ بندوّر...';
    track({id:id,phone:ph}).then(function(o){
      if(!o){ m.textContent='❌ مفيش طلب بالبيانات دي، اتأكد من الرقم'; return; }
      m.textContent=''; var a=get(KEY).filter(function(x){return x.id!==id}); a.unshift({id:id,phone:ph,t:o.time,status:o.status,type:o.type}); put(KEY,a.slice(0,10)); cache[id]=o; render();
    }).catch(function(){ m.textContent='⚠️ تعذّر الاتصال، جرّب تاني'; });
  };

  /* ── تشغيل ── */
  flush(); updatePill(); refresh(false);
  setInterval(function(){ if(!document.hidden) refresh(false); },40000);
  document.addEventListener('visibilitychange',function(){ if(!document.hidden){ flush(); if($('rrTkSheet').classList.contains('open')) refresh(false); } });
  window.addEventListener('online',flush);
  var hm=/^#track=([A-Za-z0-9]+)/.exec(location.hash||''); if(hm) setTimeout(function(){ open(hm[1].toUpperCase()); },400);
})();
} catch (e) { console.error("[app.js جزء 29]", e); }

/* ── جزء 30 ── */
try {
(function(){
  var tabs=document.getElementById('rrTabs'); if(!tabs||tabs.dataset.nf) return; tabs.dataset.nf=1;
  var svg=function(p){return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">'+p+'</svg>'};
  var IC={
    home:'<path d="M3.5 11L12 3.5 20.5 11"/><path d="M5.5 9.5V20h13V9.5"/><path d="M10 20v-5.5h4V20"/>',
    menu:'<path d="M4 7h16M4 12h16M4 17h16"/>',
    heart:'<path d="M12 20.5s-7.5-4.6-7.5-10.2A4.3 4.3 0 0112 7.6a4.3 4.3 0 017.5 2.7c0 5.6-7.5 10.2-7.5 10.2z"/>',
    bag:'<path d="M5.5 8h13l-1 12h-11z"/><path d="M9 10V7a3 3 0 016 0v3"/>',
    user:'<circle cx="12" cy="8" r="4"/><path d="M4.5 20.5c.8-3.8 3.8-5.8 7.5-5.8s6.7 2 7.5 5.8"/>'};
  var fav=document.createElement('button'); fav.type='button'; fav.setAttribute('data-t','fav');
  fav.innerHTML='<span></span>المفضلة<b class="rr-fb"></b>'; tabs.appendChild(fav);
  var fb=fav.querySelector('b'); fb.style.display='none';
  fav.addEventListener('click',function(e){ e.stopImmediatePropagation(); var bar=document.getElementById('rrFavBar'); if(bar) bar.click(); },true);
  var map={home:'home',menu:'menu',fav:'heart',cart:'bag',pts:'user'};
  [].forEach.call(tabs.querySelectorAll('button'),function(b){ var k=map[b.dataset.t], s=b.querySelector('span'); if(k&&s) s.innerHTML=svg(IC[k]); });
  /* عدّاد المفضلة */
  function fn(){ var bar=document.getElementById('rrFavBar'), n=bar?(parseInt(bar.dataset.n)||((bar.textContent.match(/\d+/)||[0])[0]|0)):0; fb.textContent=n; fb.style.display=n?'flex':'none'; }
  fn(); setInterval(fn,1200);
  /* القائمة: صف "تواصل معنا" (بديل تاب اتصل) */
  var mb=document.querySelector('#mobileNav .mn-body');
  if(mb&&!mb.querySelector('.mn-call')){
    var r=document.createElement('button'); r.type='button'; r.className='mn-row mn-call';
    r.innerHTML='<span class="mn-th">'+svg('<path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A15 15 0 013 6a2 2 0 012-2z"/>')+'</span><span class="mn-t">تواصل معنا</span>';
    r.onclick=function(){ if(typeof closeMobileNav==='function') closeMobileNav(); var c=tabs.querySelector('[data-t="call"]'); if(c) setTimeout(function(){c.click()},150); };
    mb.appendChild(r);
  }
})();
} catch (e) { console.error("[app.js جزء 30]", e); }

/* ── جزء 31 ── */
try {
(function(){
  var D={"نفد مؤقتًا":"Sold out","حاول تاني":"Try again","اتصل بينا":"Call us","راجع السلة":"Review cart","تتبع طلبي":"Track my order","صواني ريد روستر":"Red Roosters Trays","العروض":"Offers","ناشڤيل":"Nashville","برجر اللحم":"Beef Burgers","ساندوتشات الدجاج":"Chicken Sandwiches","تويستر وسوبريم":"Twister & Supreme","فردية":"Individual","عائلية":"Family","أطفال":"Kids","مقبلات":"Appetizers","إضافات":"Extras","صوصات":"Sauces","مشروبات":"Drinks","عنّا":"About us","الفروع":"Branches","ملحوظات":"Notes","نقاطي":"My points","اختار منطقتك":"Choose your area","تغيير":"Change","جديد":"New","القائمة":"Menu","الرئيسية":"Home","المفضلة":"Favorites","السلة":"Cart","اتصل":"Call","العروض والجديد":"Offers & New","المنيو":"Menu","برجر اللحم البقري":"Beef Burgers","الوجبات الفردية":"Individual Meals","الوجبات العائلية":"Family Meals","وجبات الأطفال":"Kids Meals","المقبلات":"Appetizers","الإضافات":"Extras","الصوصات":"Sauces","المشروبات":"Drinks","المزيد":"More","ملحوظات هامة":"Important notes","تواصل معنا":"Contact us","عرض الافتتاح":"Opening offer","اتصل بنا":"Call us","دليفري":"Delivery","استلام من الفرع":"Pickup from branch","كاش":"Cash","فودافون كاش":"Vodafone Cash","إنستا باي":"InstaPay","الأكثر طلباً":"Most ordered","الأقسام":"Sections","اجمع نقاط مع كل طلب":"Earn points with every order","شوف نقاطي":"See my points","أضف للسلة":"Add to cart","أضف":"Add","أضف للسلة — صغير":"Add to cart — Small","أضف للسلة — كبير":"Add to cart — Large","العروض الحصرية":"Exclusive offers","منيو ناشڤيل":"Nashville Menu","الجودة أولاً":"Quality first","ليه ريد روستر؟":"Why Red Roosters?","فروعنا":"Our branches","سلة الطلبات":"Your cart","السلة فاضية.. ضيف أكلتك المفضلة!":"Your cart is empty.. add your favorites!","خصم الكوبون":"Coupon discount","الإجمالي (بدون التوصيل)":"Total (before delivery)","التوصيل":"Delivery","الإجمالي بعد التوصيل":"Total with delivery","متابعة الطلب ←":"Continue →","بيانات التوصيل":"Delivery details","طريقة الاستلام":"Order type","بيانات العميل":"Your details","الاسم بالكامل":"Full name","رقم الموبايل":"Mobile number","رقم إضافي":"Extra number","موعد استلام الطلب من الفرع":"Pickup time","العنوان بالتفصيل":"Full address","المنطقة":"Area","اسم الشارع":"Street name","رقم العمارة":"Building no.","الدور":"Floor","الشقة":"Apartment","علامة مميزة":"Landmark","ملاحظات على الطلب":"Order notes","طريقة الدفع":"Payment method","محفظة إلكترونية":"E-wallet","حساب بنكي":"Bank account","كود الخصم":"Discount code","خصم الكوبون":"Coupon discount","تطبيق":"Apply","تأكيد الطلب":"Place order","الكمية":"Quantity","النوع":"Type","تعديلات سريعة":"Quick edits","خصم":"Discount","يلا نطلب أول طلب":"Order now","خدماتنا":"Our services","عرض السلة":"View cart","عرض نقاطي":"Show my points","طلبك هيوصل فين؟":"Where should we deliver?","تتبّع":"Track","هدية أول طلب":"First-order gift","خصم 20% لأول طلب ليك":"20% off your first order","الخصم لأول طلب بس لكل عميل":"Discount valid on first order only","اضغط للنسخ":"Tap to copy","يلا نطلب أول طلب":"Order now","اطلب نفس الطلب تاني":"Reorder this order","تتبّع طلب برقمه":"Track by order number","إغلاق":"Close","استخدم":"Use","✓ مطبّق":"✓ Applied","تم الاستلام":"Received","تم التأكيد":"Confirmed","بنجهّزه":"Preparing","خرج للتوصيل":"Out for delivery","جاهز للاستلام":"Ready for pickup","تم التسليم":"Delivered","استلمنا طلبك":"We got your order","طلبك اتأكد":"Order confirmed","بنجهّز طلبك دلوقتي":"Preparing your order","طلبك في الطريق":"On the way","طلبك جاهز":"Order ready","تفاصيل الطلب":"Order details","الإجمالي":"Total","الدفع":"Payment","المجموع":"Subtotal","طلبك":"Your order","طلبك اتلغى · اعرف السبب":"Order cancelled · see why","بحث في المنيو":"Search the menu","دوّر على أكلتك... (مثال: زينجر، ناشفيل، ريزو)":"Search for your meal… (e.g. Zinger, Nashville)","رقم الطلب RRxxxxxxx":"Order no. RRxxxxxxx","رقم موبايلك":"Your mobile","اكتب رقم موبايلك":"Your mobile"};
  var DESC={"خس + قطعة من صدور دجاج زنجر + صوص مانجو + أصابع موتزريلا": "Lettuce + zinger chicken breast piece + mango sauce + mozzarella sticks", "شريحة جبنة أمريكي + خس + قطعتين من صدور دجاج زينجر + مايونيز + تشيلي مايونيز": "American cheese slice + lettuce + two zinger chicken breast pieces + mayonnaise + chili mayonnaise", "ساندوتش تويستر 🌯 + قطعة دجاج 🍗 + بطاطس صغير 🍟": "Twister sandwich 🌯 + chicken piece 🍗 + small fries 🍟", "ريزو 🍚 + قطعة دجاج 🍗 + بطاطس صغير 🍟": "Rizo 🍚 + chicken piece 🍗 + small fries 🍟", "أرز مبهر 🍚 + قطعة دجاج 🍗 + قطعة كريسبي 🍗": "Spiced rice 🍚 + chicken piece 🍗 + crispy piece 🍗", "7 قطع دجاج 🍗 + بطاطس وسط 🍟 + 2 كايزر 🍔 + 2 كول سلو صغير 🥗": "7 chicken pieces 🍗 + medium fries 🍟 + 2 Kaiser buns 🍔 + 2 small coleslaw 🥗", "ساندوتش تويستر 🌯 + ساندوتش سوبريم 🥪 + ساندوتش تشيكن 🍔 + بطاطس وسط 🍟 + 2 كول سلو صغير 🥗": "Twister sandwich 🌯 + supreme sandwich 🥪 + chicken sandwich 🍔 + medium fries 🍟 + 2 small coleslaw 🥗", "2 ساندوتش بيف 🥩🍔 + بطاطس وسط فريسكس 🍟": "2 beef sandwiches 🥩🍔 + medium Frisks fries 🍟", "اتنين ساندوتش سوبريم (فيلية أو زينجر) من اختيار العميل": "Two supreme sandwiches (fillet or zinger) of your choice", "أرز كبير + 2 قطعة دجاج أو 4 قطعة استربس + صوص + مشروب": "Large rice + 2 chicken pieces or 4 strips + sauce + drink", "قطعة دجاج + ساندوتش تشيكن (عدا المايتي زينجر) أو زينجر سوبريم أو فيليه سوبريم + 1 مشروب": "Chicken piece + chicken sandwich (except Mighty Zinger) or Zinger Supreme or Fillet Supreme + 1 drink", "قطعة دجاج + تويستر تشيكن أو فاهيتا + كول سلو + مشروب": "Chicken piece + chicken twister or fajita + coleslaw + drink", "قطعة دجاج + قطعة كرسبي + خبز + ريزو + 1 مشروب": "Chicken piece + crispy piece + bread + rizo + 1 drink", "تويستر تشيكن أو فاهيتا + سوبريم + كول سلو": "Chicken twister or fajita + supreme + coleslaw", "قطعتين دجاج + قطعتين كرسبي استربس + أرز + 1 خبز": "2 chicken pieces + 2 crispy strips + rice + 1 bread", "طبق ريزو كبير": "Large rizo plate", "3 قطع دجاج + 1 خبز": "3 chicken pieces + 1 bread", "5 قطع استربس + 1 خبز": "5 strips + 1 bread", "ارز كبير (400) جرام + 3 قطع استريبس + كب صوص": "Large rice (400 g) + 3 strips + sauce cup", "ساندوتش تشيكن (من اختيار العميل) (عدا المايتي زينجر) أو زينجر سوبريم أو فيليه سوبريم + كول سلو أو مشروب (من اختيار العميل)": "Chicken sandwich of your choice (except Mighty Zinger) or Zinger Supreme or Fillet Supreme + coleslaw or a drink (your choice)", "2 ساندوتش راب (تويستر عادي أو فاهيتا)": "2 wrap sandwiches (regular twister or fajita)", "ساندوتش برجر (120 جرام) + فرايز + مشروب": "Burger sandwich (120 g) + fries + drink", "6 قطع دجاج + 3 أرز + 3 خبز كايزر": "6 chicken pieces + 3 rice + 3 Kaiser buns", "10 قطع دجاج + 2 أرز + كول سلو فاملي + 5 خبز + مشروب لتر": "10 chicken pieces + 2 rice + family coleslaw + 5 bread + 1 L drink", "أربع قطع استريبس بالإضافة إلى بطاطس وخبز وصوص كب": "Four strips plus fries, bread and a sauce cup", "2 قطعة دجاج + خبز + 1 كول سلو + 1 فرايز وسط": "2 chicken pieces + bread + 1 coleslaw + 1 medium fries", "3 قطعة دجاج + خبز + 1 كول سلو + 1 فرايز وسط": "3 chicken pieces + bread + 1 coleslaw + 1 medium fries", "2 قطعة استربس + 1 خبز + 1 كول سلو + 1 فرايز وسط": "2 strips + 1 bread + 1 coleslaw + 1 medium fries", "3 قطعة استربس + 1 خبز + 1 كول سلو + 1 فرايز وسط": "3 strips + 1 bread + 1 coleslaw + 1 medium fries", "أرز مبهر + صوص سبايسي روستر + دجاج ناشفيل": "Spiced rice + Rooster spicy sauce + Nashville chicken", "صوص سويت شيلي + فرايز + دجاج ناشفيل": "Sweet chili sauce + fries + Nashville chicken", "صوص روستر الخاص + فرايز + دجاج ناشفيل": "Rooster special sauce + fries + Nashville chicken", "عيش التورتيلا + قطع السبايسي ناشفيل + خس وصوص خاص": "Tortilla bread + spicy Nashville pieces + lettuce and special sauce", "زينجر + سلو + روستر الميز + خس + خيار": "Zinger + slaw + Rooster mayo sauce + lettuce + cucumber", "زينجر + جبنة أمريكي + سويت شيلي + خس + خيار": "Zinger + American cheese + sweet chili + lettuce + cucumber", "شريحة من الجبن الأمريكي المذاب، وخس طازج، وقطعتان من فيليه صدور دجاج \"ناش\" المقرمش، مع طبقات من المايونيز الكريمي ومايونيز الفلفل الحار.": "Melted American cheese slice, fresh lettuce, and two crispy \"Nash\" chicken breast fillets, layered with creamy mayonnaise and spicy pepper mayonnaise.", "صوص تكساس + خيار مخلل + خس + قطعة برجر + بصل + جبنة أمريكي": "Texas sauce + pickles + lettuce + burger patty + onion + American cheese", "صوص مايونيز + خيار مخلل + خس + قطعة برجر + بصل + جبنة أمريكي + مشروم فريش": "Mayonnaise + pickles + lettuce + burger patty + onion + American cheese + fresh mushrooms", "صوص بوسطن + خيار مخلل + خس + قطعة برجر + صوص ساور كريم + بيف بيكون": "Boston sauce + pickles + lettuce + burger patty + sour cream sauce + beef bacon", "صوص تكساس + خيار مخلل + خس + قطعة برجر + بصل + صوص بصل فرنسي": "Texas sauce + pickles + lettuce + burger patty + onion + French onion sauce", "صوص ديناميت + فلفل هالبينو + خس + قطعة برجر + بصل + صوص روستر + أصابع شيدر هالبينو": "Dynamite sauce + jalapeño peppers + lettuce + burger patty + onion + Rooster sauce + jalapeño cheddar sticks", "صوص باربكيو + خيار مخلل + خس + قطعة برجر + بصل + بيف بيكون + حلقات بصل + صوص بوسطن": "BBQ sauce + pickles + lettuce + burger patty + onion + beef bacon + onion rings + Boston sauce", "صوص بوسطن + خيار مخلل + قطعة برجر + بصل + جبنة أمريكي + ناتشوز + فلفل ألوان سوتية": "Boston sauce + pickles + burger patty + onion + American cheese + nachos + sautéed bell peppers", "صوص تكساس + خيار مخلل + قطعة برجر + بصل + جبنة أمريكي + صوص بستاشيو": "Texas sauce + pickles + burger patty + onion + American cheese + pistachio sauce", "صوص الرانش + خيار مخلل + خس + صدور دجاج كريسبي + لحم تركي مدخن + صوص الجبنة": "Ranch sauce + pickles + lettuce + crispy chicken breast + smoked turkey + cheese sauce", "صوص الروستر + خيار مخلل + خس + صدور دجاج كريسبي + جبنة أمريكي + مشروم فريش + صوص رانش": "Rooster sauce + pickles + lettuce + crispy chicken breast + American cheese + fresh mushrooms + ranch sauce", "صوص دناميت + هالبينو + خس + صدور دجاج كريسبي + أصابع شيدر هالبينو + صوص شيلي مايونيز": "Dynamite sauce + jalapeño + lettuce + crispy chicken breast + jalapeño cheddar sticks + chili mayonnaise", "صوص باربكيو + خيار مخلل + خس + صدور دجاج كريسبي + مايونيز + حلقات بصل": "BBQ sauce + pickles + lettuce + crispy chicken breast + mayonnaise + onion rings", "صوص مايونيز + خيار مخلل + خس + قطعة زينجر + سويت شيلي + تركي مدخن + جبنة أمريكي": "Mayonnaise + pickles + lettuce + zinger piece + sweet chili + smoked turkey + American cheese", "صوص مايونيز + خيار مخلل + خس + قطعة دجاج كريسبي + صوص روستر + روست بيف + جبنة أمريكي": "Mayonnaise + pickles + lettuce + crispy chicken piece + Rooster sauce + roast beef + American cheese", "فاهيتا + باربكيو (حار أو عادي)": "Fajita + BBQ (spicy or regular)", "2 قطعة كرسبي استربس + طماطم + خس + مايونيز حار": "2 crispy strips + tomato + lettuce + spicy mayonnaise", "2 قطعة كرسبي استربس + طماطم + خس + مايونيز بالفلفل الأسود": "2 crispy strips + tomato + lettuce + black pepper mayonnaise", "2 قطعة دجاج + فرايز + كايزر": "2 chicken pieces + fries + Kaiser bun", "2 قطعة دجاج + فرايز + كايزر + كول سلو + مشروب": "2 chicken pieces + fries + Kaiser bun + coleslaw + drink", "3 قطعة دجاج + فرايز + كايزر + كول سلو": "3 chicken pieces + fries + Kaiser bun + coleslaw", "4 قطعة دجاج + فرايز + كايزر + كول سلو + مشروب": "4 chicken pieces + fries + Kaiser bun + coleslaw + drink", "2 قطعة دجاج + 2 قطعة استربس + فرايز + كايزر + كول سلو + مشروب": "2 chicken pieces + 2 strips + fries + Kaiser bun + coleslaw + drink", "3 قطعة استربس + فرايز + كايزر": "3 strips + fries + Kaiser bun", "5 قطعة استربس + فرايز + كايزر + كول سلو": "5 strips + fries + Kaiser bun + coleslaw", "5 قطع دجاج + 5 قطع استريبس + فرايز فاملي + كايزر + كول سلو فاملي + لتر مشروب": "5 chicken pieces + 5 strips + family fries + Kaiser bun + family coleslaw + 1 L drink", "9 قطع دجاج + فرايز فاملي + 3 كايزر + كول سلو فاملي + لتر مشروب": "9 chicken pieces + family fries + 3 Kaiser buns + family coleslaw + 1 L drink", "12 قطع دجاج + فرايز فاملي + 4 كايزر + كول سلو فاملي + لتر مشروب": "12 chicken pieces + family fries + 4 Kaiser buns + family coleslaw + 1 L drink", "15 قطع دجاج + فرايز فاملي + 5 كايزر + كول سلو فاملي + لتر مشروب": "15 chicken pieces + family fries + 5 Kaiser buns + family coleslaw + 1 L drink", "18 قطع دجاج + فرايز فاملي + 6 كايزر + كول سلو فاملي + لتر مشروب": "18 chicken pieces + family fries + 6 Kaiser buns + family coleslaw + 1 L drink", "قطعة دجاج + فرايز + كايزر + عصير + لعبة 🧸": "Chicken piece + fries + Kaiser bun + juice + toy 🧸", "5 قطع ناجتس + فرايز + صوص باربكيو + عصير + لعبة 🧸": "5 nuggets + fries + BBQ sauce + juice + toy 🧸", "ساندوتش تشيكن + فرايز + عصير + لعبة 🧸": "Chicken sandwich + fries + juice + toy 🧸", "برجر + فرايز + عصير + لعبة 🧸": "Burger + fries + juice + toy 🧸", "كولا / رمان / برتقال": "Cola / pomegranate / orange", "بيبسي / سفن أب / ميرندا": "Pepsi / 7Up / Mirinda", "مياه معبأة": "Bottled water", "عصير معلب": "Canned juice"};
  var EM={"ج.م":"EGP"}, RX=[[/ج\.م/g,'EGP'],[/(\d+)\s*صنف/g,'$1 items'],[/جنيه/g,'EGP']];
  var LEAD=/^[^\u0600-\u06FFA-Za-z0-9]*/, TRAIL=/[^\u0600-\u06FFA-Za-z0-9]*$/, en=false;
  function conv(s){
    var l=LEAD.exec(s)[0], r=TRAIL.exec(s.slice(l.length))[0], c=s.slice(l.length,s.length-r.length).replace(/\s+/g,' ');
    if(!c||!/[\u0600-\u06FF]/.test(s)) return s;
    if(D[c]) return l+D[c]+r;
    var o=s; RX.forEach(function(x){o=o.replace(x[0],x[1])}); return o;
  }
  function tn(n){ var v=n.nodeValue; if(n.__en===v) return; var o=conv(v); if(o!==v){ n.__ar=v; n.__en=o; n.nodeValue=o; } }
  function ta(el){ ['placeholder','title','aria-label'].forEach(function(a){ var v=el.getAttribute&&el.getAttribute(a); if(!v) return; var k='data-ar-'+a; if(el.hasAttribute(k)&&el.getAttribute(a)===el.__e2) return; var o=conv(v); if(o!==v){ el.setAttribute(k,v); el.__e2=o; el.setAttribute(a,o); } }); }
  function names(root){ (root.querySelectorAll?root.querySelectorAll('.card-name'):[]).forEach(function(n){ if(n.__nm!==undefined) return; var e=n.parentElement&&n.parentElement.querySelector('.card-name-en'); var s=e&&e.textContent.trim(); if(s){ n.__nm=n.textContent; n.textContent=s; n.__nv=s; } }); }
  var DSEL='.card-desc';
  function d1(n){ if(n.__dd!==undefined) return; var e=DESC[n.textContent.replace(/\s+/g,' ').trim()]; if(e){ n.__dd=n.innerHTML; n.textContent=e; } }
  function descs(root){ if(root.matches&&root.matches(DSEL)) d1(root); (root.querySelectorAll?root.querySelectorAll(DSEL):[]).forEach(d1); }
  function walk(root){
    if(root.nodeType===3){ if(!/^(SCRIPT|STYLE)$/.test(root.parentNode.nodeName)&&!(root.parentNode.closest&&root.parentNode.closest('.card-desc'))) tn(root); return; }
    if(root.nodeType!==1||/^(SCRIPT|STYLE)$/.test(root.nodeName)) return;
    ta(root); names(root); descs(root);
    var w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT|NodeFilter.SHOW_ELEMENT,null),n; 
    while(n=w.nextNode()){ if(n.nodeType===3){ var p=n.parentNode; if(/^(SCRIPT|STYLE)$/.test(p.nodeName)||(p.closest&&p.closest('.card-desc'))) continue; tn(n); } else ta(n); }
  }
  function restore(){
    var w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT),n; while(n=w.nextNode()){ if(n.__ar!==undefined&&n.nodeValue===n.__en){ n.nodeValue=n.__ar; } n.__en=undefined; }
    document.querySelectorAll('[data-ar-placeholder],[data-ar-title],[data-ar-aria-label]').forEach(function(e){ ['placeholder','title','aria-label'].forEach(function(a){ var k='data-ar-'+a; if(e.hasAttribute(k)){ e.setAttribute(a,e.getAttribute(k)); e.removeAttribute(k); } }); e.__e2=undefined; });
    document.querySelectorAll('.card-name').forEach(function(n){ if(n.__nm!==undefined){ n.textContent=n.__nm; n.__nm=undefined; } });
    document.querySelectorAll(DSEL).forEach(function(n){ if(n.__dd!==undefined){ n.innerHTML=n.__dd; n.__dd=undefined; } });
  }
  var pend=[], raf=0;
  var mo=new MutationObserver(function(ms){ if(!en) return; ms.forEach(function(m){ if(m.type==='characterData') pend.push(m.target); else m.addedNodes.forEach(function(a){ pend.push(a); }); });
    if(!raf) raf=requestAnimationFrame(function(){ raf=0; var p=pend; pend=[]; p.forEach(function(x){ if(document.body.contains(x)) walk(x); }); }); });
  mo.observe(document.body,{childList:true,subtree:true,characterData:true});
  function set(on){ en=on; var h=document.documentElement; h.lang=on?'en':'ar'; h.dir=on?'ltr':'rtl';
    try{ localStorage.setItem('rr_lang',on?'en':'ar'); }catch(e){}
    if(on) walk(document.body); else restore();
    [].forEach.call(document.querySelectorAll('#rrLang'),function(b){ b.textContent=on?'عربي':'EN'; }); }
  function mk(){ var b=document.createElement('button'); b.type='button'; b.id='rrLang'; b.textContent=en?'عربي':'EN'; b.setAttribute('aria-label','Language'); b.onclick=function(){ set(!en); }; return b; }
  var hi=document.querySelector('header .header-inner'); if(hi) hi.insertBefore(mk(),document.getElementById('hamburger'));
  function mnHook(){ var h=document.querySelector('#mobileNav .mn-head'); if(h&&!h.querySelector('#rrLang')) h.insertBefore(mk(),h.querySelector('.mn-x')); }
  mnHook(); new MutationObserver(mnHook).observe(document.getElementById('mobileNav'),{childList:true,subtree:true});
  try{ if(localStorage.getItem('rr_lang')==='en') setTimeout(function(){ set(true); },300); }catch(e){}
})();
} catch (e) { console.error("[app.js جزء 31]", e); }

/* ── جزء 32 ── */
try {
(function(){
  try{ if('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js'); }catch(e){}
  function isOpen(){ try{ if(window.rrIsOpen) return window.rrIsOpen(); var p=new Intl.DateTimeFormat('en-GB',{timeZone:'Africa/Cairo',hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date()); return p>='11:00'||p<'05:00'; }catch(e){ return true; } }
  var f=document.getElementById('checkoutForm'); if(!f) return;
  var msg=document.createElement('div'); msg.id='rrClosed'; msg.textContent='🕙 المطعم مقفول دلوقتي — بنفتح 11 صباحًا. تقدر تجهّز طلبك وتبعته بعد الفتح.';
  function tick(){ var b=f.querySelector('[type=submit]'); if(!b) return; if(!msg.parentNode) b.parentNode.insertBefore(msg,b);
    var c=!isOpen(); msg.style.display=c?'block':'none'; if(c&&window.rrClosedMsg) msg.textContent=window.rrClosedMsg();
    if(c){ if(!b.dataset.okt) b.dataset.okt=b.textContent; b.disabled=true; b.textContent='مقفول حاليًا'; }
    else if(b.dataset.okt&&b.textContent==='مقفول حاليًا'){ b.disabled=false; b.textContent=b.dataset.okt; delete b.dataset.okt; } }
  tick(); window.rrTick=tick; setInterval(tick,20000);
})();
} catch (e) { console.error("[app.js جزء 32]", e); }

/* ── جزء 33 ── */
;
/* ═══ إشعارات حالة الطلب (بتوصل حتى لو الموقع/التطبيق مقفول) — OneSignal ═══
   1) اعمل حساب مجاني على onesignal.com ▸ New App ▸ Web ▸ Custom Code، وحط رابط موقعك.
   2) انسخ الـ App ID وحطه هنا بين العلامتين. (فاضي = الإشعارات مقفولة). */
window.RR_ONESIGNAL='24f07a03-ba83-4261-9f12-689fded386be';
/* معرّف عشوائي للجهاز (بدل رقم الموبايل): بيتبعت مع الطلب، والإشعارات بتتبعت عليه — محدش يقدر يستقبل إشعارات طلبات غيره بمجرد معرفة رقمه */
window.rrDid=function(){try{var d=localStorage.getItem('rr_did');if(!/^[a-f0-9]{32}$/.test(d||'')){var a=new Uint8Array(16);(window.crypto||window.msCrypto).getRandomValues(a);d=Array.prototype.map.call(a,function(x){return('0'+x.toString(16)).slice(-2)}).join('');localStorage.setItem('rr_did',d);}return d;}catch(e){return '';}};
(function(){
  var APP=window.RR_ONESIGNAL, OS=null, lastP='', $=function(i){return document.getElementById(i)};
  var norm=function(p){return String(p||'').replace(/[٠-٩]/g,function(d){return '٠١٢٣٤٥٦٧٨٩'.indexOf(d)}).replace(/\D/g,'').replace(/^(0020|20)/,'0').slice(-11)};
  function phone(){ try{ var a=JSON.parse(localStorage.getItem('rr_orders')||'[]'); for(var i=0;i<a.length;i++) if(a[i]&&a[i].phone) return norm(a[i].phone); }catch(e){}
    try{ var c=JSON.parse(localStorage.getItem('rr_customer')||'{}'); if(c&&c.phone) return norm(c.phone); }catch(e){} return ''; }
  function ui(){
    var b=$('tkPush'), t=$('tkPushT'), g=$('tkPushGo'); if(!b) return;
    if(!APP){ b.className='tk-push'; return; }
    var ios=/iphone|ipad|ipod/i.test(navigator.userAgent), sa=(window.matchMedia&&matchMedia('(display-mode: standalone)').matches)||navigator.standalone;
    var sup=('Notification' in window)&&('serviceWorker' in navigator)&&('PushManager' in window);
    g.style.display='none';
    if(!sup){ if(ios&&!sa){ t.textContent='🔔 عشان توصلك إشعارات الطلب على الآيفون: دوس زرار المشاركة ثم Add to Home Screen، وافتح التطبيق من الأيقونة.'; b.className='tk-push show'; } else b.className='tk-push'; return; }
    if(Notification.permission==='denied'){ t.textContent='🔕 الإشعارات مقفولة. فعّلها من إعدادات الموقع في المتصفح عشان توصلك حالة طلبك.'; b.className='tk-push show'; return; }
    if(window.rrPushOn){ t.textContent='🔔 الإشعارات شغّالة — هتوصلك كل خطوة في طلبك حتى لو قفلت الموقع.'; b.className='tk-push show ok'; return; }
    t.textContent='🔔 فعّل الإشعارات عشان توصلك كل خطوة في طلبك حتى لو قفلت الموقع.'; g.style.display=''; b.className='tk-push show';
  }
  function sync(){
    if(!OS) return;
    var p=window.rrDid?window.rrDid():''; try{ if(p&&p!==lastP&&OS.User.externalId!==p){ lastP=p; OS.login(p); } }catch(e){}
    try{ window.rrPushOn=!!(OS.User.PushSubscription.optedIn&&window.Notification&&Notification.permission==='granted'); }catch(e){ window.rrPushOn=false; }
    ui();
  }
  window.rrPushSync=sync; window.rrPushUI=ui;
  if(!APP){ return; }
  var g=$('tkPushGo');
  if(g) g.onclick=function(){
    if(!OS){ $('tkPushT').textContent='⏳ استنى ثانية وجرّب تاني...'; return; }
    g.disabled=true;
    Promise.resolve(OS.Notifications.requestPermission()).then(function(){ return OS.User.PushSubscription.optIn(); }).catch(function(){}).then(function(){ g.disabled=false; sync(); });
  };
  var s=document.createElement('script'); s.src='https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js'; s.defer=true; document.head.appendChild(s);
  window.OneSignalDeferred=window.OneSignalDeferred||[];
  var scope=location.pathname.replace(/[^\/]*$/,'');
  OneSignalDeferred.push(async function(O){
    await O.init({appId:APP, serviceWorkerPath:scope+'sw.js', serviceWorkerParam:{scope:scope}, notifyButton:{enable:false}, allowLocalhostAsSecureOrigin:true});
    OS=O; sync();
    try{ O.Notifications.addEventListener('permissionChange',sync); O.User.PushSubscription.addEventListener('change',sync); }catch(e){}
  });
})();

/* ── جزء 34 ── */
;
/* تحليلات اختيارية: حط رقم Google Analytics هنا (مثال G-XXXXXXX) — فاضي = مقفول */
window.RR_GA='';
(function(){
  if(window.RR_GA){ var s=document.createElement('script'); s.async=true; s.src='https://www.googletagmanager.com/gtag/js?id='+window.RR_GA; document.head.appendChild(s);
    window.dataLayer=window.dataLayer||[]; window.gtag=function(){dataLayer.push(arguments)}; gtag('js',new Date()); gtag('config',window.RR_GA); }
  var bar=document.getElementById('rrInst'), ev=null, KEY='rr_inst_x';
  var standalone=(window.matchMedia&&matchMedia('(display-mode: standalone)').matches)||navigator.standalone;
  try{ if(standalone||localStorage.getItem(KEY)) return; }catch(e){}
  var ios=/iphone|ipad|ipod/i.test(navigator.userAgent);
  window.addEventListener('beforeinstallprompt',function(e){ e.preventDefault(); ev=e; setTimeout(function(){ bar.classList.add('show'); },4000); });
  if(ios){ document.getElementById('rrInstT').textContent='📲 للتثبيت: دوس زرار المشاركة ثم Add to Home Screen'; document.getElementById('rrInstGo').style.display='none'; setTimeout(function(){ bar.classList.add('show'); },6000); }
  document.getElementById('rrInstGo').onclick=function(){ if(!ev) return; ev.prompt(); ev.userChoice.finally(function(){ bar.classList.remove('show'); ev=null; }); };
  document.getElementById('rrInstX').onclick=function(){ bar.classList.remove('show'); try{ localStorage.setItem(KEY,'1'); }catch(e){} };
})();

/* ── جزء 35 ── */
try {
/* ═══ مشاركة · كرر آخر طلب · إشعارات حالة الطلب ═══ */
(function(){
  var $=function(i){return document.getElementById(i)};
  var lsg=function(k){try{return localStorage.getItem(k)}catch(e){return null}}, lss=function(k,v){try{localStorage.setItem(k,v)}catch(e){}};
  function say(m){ var t=$('rrToast')||$('toast'); if(t){ t.textContent=m; t.classList.add('show'); clearTimeout(say.t); say.t=setTimeout(function(){t.classList.remove('show')},2600); } else { try{ alert(m); }catch(e){} } }
  var SITE=location.origin+location.pathname;
  function share(title,text){
    var data={title:title,text:text,url:SITE};
    if(navigator.share){ navigator.share(data).catch(function(){}); return; }
    var full=text+'\n'+SITE;
    if(navigator.clipboard&&navigator.clipboard.writeText) navigator.clipboard.writeText(full).then(function(){say('✅ اتنسخ الرابط — ابعته لصحابك')},function(){say(SITE)});
    else say(SITE);
  }
  /* الفوتر بيتعاد بناؤه بسكريبت تاني، فبنضيف الزرار تاني لو اتمسح */
  function ensureShareBtn(){ var f=document.querySelector('footer'); if(!f||$('rrShareSite')) return; var cols=f.querySelectorAll('.pf-in > div'), host=cols.length?cols[cols.length-1]:f, b=document.createElement('button'); b.type='button'; b.id='rrShareSite'; b.className=cols.length?'l':'rr-share-btn'; b.textContent='📤 شارك الموقع مع صحابك'; host.appendChild(b); }
  ensureShareBtn(); setTimeout(ensureShareBtn,800); setTimeout(ensureShareBtn,2500);
  var ftEl=document.querySelector('footer'); if(ftEl&&window.MutationObserver) new MutationObserver(ensureShareBtn).observe(ftEl,{childList:true});
  document.addEventListener('click',function(e){ if(e.target.closest&&e.target.closest('#rrShareSite')) share('Red Roosters 🐓','جرّب ريد روستر 🍗 ساندوتشات كرسبي وناشفيل طازة — اطلب أونلاين وتوصيلك لحد البيت:'); });
  if($('imShare')) $('imShare').onclick=function(){ var n=($('im_title')||{}).textContent||'', p=($('im_price')||{}).textContent||''; share(n+' — Red Roosters','🍗 '+n+(p?' — '+p:'')+' من ريد روستر. اطلبه أونلاين:'); };

  /* كرر آخر طلب: شريط بيظهر لو فيه طلب سابق على الجهاز والسلة فاضية */
  var re=$('rrRe'), main=document.querySelector('main');
  function lastOrder(){ try{ var o=JSON.parse(lsg('rr_last_order')||'null'); return o&&o.items&&o.items.length&&Date.now()-o.t<60*864e5?o:null; }catch(e){ return null; } }
  function cartEmpty(){ try{ return !(JSON.parse(lsg('rr_cart')||'[]')||[]).length; }catch(e){ return true; } }
  function paintRe(){
    var o=lastOrder(); if(!o||!cartEmpty()||lsg('rr_re_hide')===String(o.id)||!window.rrReorder){ re.style.display='none'; return; }
    var n=o.items.reduce(function(s,i){return s+(+i.q||1)},0), tot=o.items.reduce(function(s,i){return s+(+i.p||0)*(+i.q||1)},0);
    $('rrReS').textContent=o.items.slice(0,2).map(function(i){return i.q+'× '+String(i.n).replace(/\s*\(.*\)\s*$/,'')}).join('، ')+(o.items.length>2?' …':'')+' · '+tot+' ج.م'; $('rrReT').textContent='🔁 كرر طلبك الأخير ('+n+' صنف)';
    re.style.display='flex';
  }
  if(re&&main){ main.insertAdjacentElement('afterbegin',re); paintRe(); setInterval(paintRe,4000);
    $('rrReGo').onclick=function(){ var o=lastOrder(); if(!o) return; window.rrReorder(o.items); re.style.display='none'; var f=document.querySelector('.cart-fab')||document.querySelector('#rrTabs [data-t=cart]'); if(f) setTimeout(function(){f.click()},350); };
    $('rrReX').onclick=function(){ var o=lastOrder(); if(o) lss('rr_re_hide',String(o.id)); re.style.display='none'; };
    document.addEventListener('rr:ordered',function(){ setTimeout(paintRe,300); }); }

})();
} catch (e) { console.error("[app.js جزء 35]", e); }

/* ── جزء 36 ── */
try {
/* ═══ دعوة صديق + عناوين محفوظة ═══ */
(function(){
  var $=function(i){return document.getElementById(i)};
  var lsg=function(k){try{return localStorage.getItem(k)}catch(e){return null}}, lss=function(k,v){try{localStorage.setItem(k,v)}catch(e){}};
  function say(m){ var t=$('rrToast')||$('toast'); if(t){ t.textContent=m; t.classList.add('show'); clearTimeout(say.t); say.t=setTimeout(function(){t.classList.remove('show')},3200); } else { try{ alert(m); }catch(e){} } }
  var SITE=location.origin+location.pathname;

  /* مشاركة الدعوة (من شاشة نقاطي) */
  document.addEventListener('click',function(e){
    var b=e.target.closest&&e.target.closest('[data-ref]'); if(!b) return;
    var code=b.dataset.ref, url=SITE+'?ref='+code, text='🎁 جرّب ريد روستر 🍗 ساندوتشات كرسبي وناشفيل طازة — ادخل من اللينك ده وخد خصم على أول طلب:';
    if(navigator.share){ navigator.share({title:'Red Roosters 🐓',text:text,url:url}).catch(function(){}); }
    else if(navigator.clipboard&&navigator.clipboard.writeText){ navigator.clipboard.writeText(text+'\n'+url).then(function(){say('✅ اتنسخت الدعوة — ابعتها لصاحبك')},function(){say(url)}); }
    else say(url);
  });

  /* الصاحب اللي جه من لينك دعوة: شريط خصم أول طلب */
  var m=/[?&]ref=([A-Za-z0-9]{7})(?:&|#|$)/.exec(location.search); if(m) lss('rr_ref',m[1].toUpperCase());
  var ref=lsg('rr_ref'), rf=$('rrRf'), mainEl=document.querySelector('main'), API=window.RR_API;
  function hasOrders(){ try{ if((JSON.parse(lsg('rr_orders')||'[]')||[]).length) return true; }catch(e){} return !!lsg('rr_last_order'); }
  if(ref&&rf&&mainEl&&API&&!hasOrders()&&lsg('rr_ref_hide')!==ref){
    fetch(API+(API.indexOf('?')>-1?'&':'?')+'action=couponDef&code=FRIEND').then(function(r){return r.json()}).then(function(j){
      if(!j||!j.ok||!j.found) return; var d=j.def, v=d.type==='percent'?d.value+'%':d.value+' جنيه';
      $('rrRfT').textContent='🎁 صاحبك بعتلك خصم '+v+' على أول طلب'; $('rrRfS').textContent=d.min?('لأي طلب '+d.min+' جنيه فأكتر'):'';
      mainEl.insertAdjacentElement('afterbegin',rf); rf.style.display='flex';
    }).catch(function(){});
    $('rrRfGo').onclick=function(){
      var i=$('couponInput'), cb=$('couponBtn'); if(!i||!cb) return; i.value='FRIEND'; cb.click(); rf.style.display='none';
      var f=document.querySelector('.cart-fab')||document.querySelector('#rrTabs [data-t=cart]'); if(f) setTimeout(function(){f.click()},300);
    };
    $('rrRfX').onclick=function(){ rf.style.display='none'; lss('rr_ref_hide',ref); };
    document.addEventListener('rr:ordered',function(){ rf.style.display='none'; });
  }

  /* عناوين محفوظة (لحد ١٠) — من غير prompt/confirm عشان بيتقفلوا في متصفحات فيسبوك وإنستجرام وواتساب */
  var AK='rr_addrs', MAX=10, F=['street','station','building','floor','apt','landmark'], title=$('addrTitle');
  var NAMES={area:'المنطقة',street:'اسم الشارع',building:'رقم العمارة',floor:'الدور',apt:'الشقة',landmark:'علامة مميزة'};
  function book(){ try{ var a=JSON.parse(lsg(AK)||'[]'); return Array.isArray(a)?a:[]; }catch(e){ return []; } }
  function store(a){ lss(AK,JSON.stringify(a.slice(0,MAX))); }
  function cur(){ var ar=window.rrArea, a={}, i=ar?ar.idx():''; F.forEach(function(f){ a[f]=(($('f_'+f)||{}).value||'').trim(); }); a.area=(i!==''&&ar&&ar.areas[+i])?ar.areas[+i].name:''; return a; }
  function same(x,y){ return x.area===y.area&&x.street===y.street&&x.building===y.building&&x.floor===y.floor&&x.apt===y.apt; }
  function complete(a){ return a.area&&a.street&&a.building&&a.floor&&a.apt&&a.landmark; }
  function missing(a){ return Object.keys(NAMES).filter(function(k){ return !a[k]; }).map(function(k){ return NAMES[k]; }); }
  function esc(t){ return String(t).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]}); }
  var box=null, naming=false, draft='', delIdx=-1, activeIdx=-1, filling=false;
  function defName(){ var n=book().length; return n===0?'البيت':n===1?'الشغل':'عنوان '+(n+1); }
  function paint(){
    if(!box) return; var a=book(), h='<small>📍 عناويني المحفوظة'+(a.length?' ('+a.length+'/'+MAX+')':'')+'</small>';
    if(naming){
      h+='<div class="ab-new"><div class="ab-q">اسم العنوان ده إيه؟</div><div class="ab-pick">'+['البيت','الشغل','عند الأهل'].map(function(n){ return '<button type="button" data-nm="'+n+'" class="'+(draft===n?'on':'')+'">'+n+'</button>'; }).join('')+'</div>'
        +'<input id="abName" maxlength="20" placeholder="أو اكتب اسم تاني (مثال: عند صحبي)" value="'+esc(draft)+'" autocomplete="off">'
        +'<div class="ab-hint">لو الاسم ده محفوظ قبل كده، هيتحدّث بالعنوان الحالي.</div>'
        +'<div class="ab-act"><button type="button" class="ab-ok" id="abOk">💾 حفظ</button><button type="button" id="abCancel">إلغاء</button></div></div>';
    } else {
      h+='<div class="ab-chips">'+a.map(function(x,i){ var d=i===delIdx; return '<button type="button" class="ab-chip'+(i===activeIdx?' on':'')+(d?' del':'')+'" data-use="'+i+'">'+(d?'مسح «'+esc(x.label)+'»؟ اضغط للتأكيد':esc(x.label))+'<i data-del="'+i+'" title="مسح" role="button">'+(d?'✔':'✕')+'</i></button>'; }).join('')
        +(a.length<MAX?'<button type="button" class="ab-save" id="abSave">💾 احفظ العنوان ده</button>':'<small style="margin:0">وصلت للحد الأقصى ('+MAX+') — امسح عنوان عشان تضيف جديد</small>')+'</div>';
    }
    box.innerHTML=h; box.style.display=(title&&title.style.display==='none')?'none':'';
  }
  function fill(x){
    var ar=window.rrArea, i=ar?ar.areas.findIndex(function(z){return z.name===x.area}):-1;
    filling=true;
    if(i<0){ say('⚠️ المنطقة دي مش متاحة للتوصيل دلوقتي — اختار منطقة تانية'); } else ar.set(i);
    F.forEach(function(f){ var el=$('f_'+f); if(el){ el.value=x[f]||''; el.dispatchEvent(new Event('input',{bubbles:true})); } });
    filling=false; say('✅ اتحمّل عنوان "'+x.label+'"');
  }
  function add(label,a){ var l=book().filter(function(x){return x.label!==label&&!same(x,a)}); l.unshift(Object.assign({label:label},a)); store(l); paint(); }
  if(title&&title.parentNode){
    box=document.createElement('div'); box.className='ab'; title.insertAdjacentElement('afterend',box); paint();
    box.addEventListener('input',function(e){ if(e.target.id==='abName') draft=e.target.value; });
    box.addEventListener('keydown',function(e){ if(e.key==='Enter'&&e.target.id==='abName'){ e.preventDefault(); var ok=$('abOk'); if(ok) ok.click(); } });
    box.addEventListener('click',function(e){
      var t=e.target, del=t.closest('[data-del]'), use=t.closest('[data-use]'), nm=t.closest('[data-nm]');
      if(nm){ draft=nm.dataset.nm; paint(); return; }
      if(t.id==='abCancel'){ naming=false; draft=''; paint(); return; }
      if(t.id==='abOk'){
        var name=(draft||'').trim().slice(0,20); if(!name){ say('اكتب اسم للعنوان'); return; }
        var c=cur(), m=missing(c); if(m.length){ say('⚠️ كمّل بيانات العنوان الأول: '+m.join('، ')); return; }
        var rep=book().some(function(x){return x.label===name});
        add(name,c); naming=false; draft=''; activeIdx=0; paint(); say(rep?'✅ اتحدّث عنوان "'+name+'"':'✅ اتحفظ العنوان "'+name+'"'); return;
      }
      if(t.id==='abSave'){
        var m2=missing(cur()); if(m2.length){ say('⚠️ كمّل بيانات العنوان الأول: '+m2.join('، ')); return; }
        naming=true; draft=defName(); paint(); var inp=$('abName'); if(inp){ try{ inp.focus(); inp.select(); }catch(x){} } return;
      }
      if(del||use){
        var i=+((del||use).dataset.del!==undefined?(del||use).dataset.del:(del||use).dataset.use);
        if(del){ e.stopPropagation(); }
        if(i===delIdx){ var a=book(); a.splice(i,1); store(a); delIdx=-1; activeIdx=-1; paint(); return; }   // تأكيد المسح (بدون confirm)
        if(del){ delIdx=i; paint(); setTimeout(function(){ if(delIdx===i){ delIdx=-1; paint(); } },4000); return; }
        var x=book()[i]; if(x){ delIdx=-1; fill(x); activeIdx=i; paint(); }
      }
    });
    F.forEach(function(f){ var el=$('f_'+f); if(el) el.addEventListener('input',function(){ if(!filling&&activeIdx>=0){ activeIdx=-1; paint(); } }); });
    if(window.MutationObserver) new MutationObserver(paint).observe(title,{attributes:true,attributeFilter:['style']});
    /* أول طلب توصيل: بنحفظ العنوان تلقائيًا باسم "البيت" */
    document.addEventListener('rr:ordered',function(){ var c=cur(); if(!book().length&&complete(c)&&title.style.display!=='none') add('البيت',c); });
  }
})();
} catch (e) { console.error("[app.js جزء 36]", e); }

/* ═══ سلة متروكة: العميل رجع وسلته لسه محفوظة → رسالة «كمّل طلبك» ═══ */
(function(){
  var T0 = Date.now(), DAY = 864e5;
  function readCart(){ try{ var c = JSON.parse(localStorage.getItem('rr_cart') || '[]'); return Array.isArray(c) ? c : []; }catch(e){ return []; } }
  function esc(x){ return String(x).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
  function show(){
    var cart = readCart(); if(!cart.length) return;
    try{ if(sessionStorage.getItem('rr_back_shown')) return; }catch(e){}
    var t = +localStorage.getItem('rr_cart_t') || 0;
    if(!t){ try{ localStorage.setItem('rr_cart_t', String(Date.now())); }catch(e){} }
    else if(Date.now() - t > 7 * DAY){ try{ localStorage.setItem('rr_cart', '[]'); }catch(e){} return; }   /* سلة أقدم من أسبوع: الأصناف والأسعار ممكن تكون اتغيّرت */
    if(t > T0) return;                                         /* العميل ضاف حاجة في الزيارة دي: مايحتاجش تذكير */
    var n = 0, total = 0; cart.forEach(function(i){ n += +i.qty || 0; total += (+i.price || 0) * (+i.qty || 0); });
    var b = document.createElement('div'); b.id = 'rrBack'; b.setAttribute('role', 'status');
    b.innerHTML = '<div class="bk-t"><b>👋 أهلاً بعودتك! سلتك لسه محفوظة</b><small>' + n + ' صنف · ' + Math.round(total) + ' ج.م</small></div><button type="button" class="bk-go">كمّل طلبك ←</button><button type="button" class="bk-x" aria-label="إغلاق">✕</button>';
    document.body.appendChild(b);
    try{ sessionStorage.setItem('rr_back_shown', '1'); }catch(e){}
    requestAnimationFrame(function(){ b.classList.add('show'); });
    function close(){ b.classList.remove('show'); setTimeout(function(){ b.remove(); }, 400); }
    b.querySelector('.bk-x').onclick = close;
    b.querySelector('.bk-go').onclick = function(){ close(); if(window.rrOpenCart) window.rrOpenCart(); };
    setTimeout(close, 20000);
  }
  /* بنستنى بوب أب الخصم يتقفل الأول عشان مانغطّيش على بعض */
  var tries = 0, iv = setInterval(function(){
    tries++; var pm = document.getElementById('promoModal');
    if(tries > 40){ clearInterval(iv); return; }
    if(tries < 3 || (pm && pm.classList.contains('open'))) return;
    clearInterval(iv); show();
  }, 600);
})();

/* ═══ الثيم الداكن (أسود × ذهبي) ═══ */
(function(){
  var KEY = 'rr_theme', root = document.documentElement, btn = document.getElementById('rrThemeBtn');
  function isDark(){ return root.getAttribute('data-theme') === 'dark'; }
  function paint(){
    var d = isDark();
    document.querySelectorAll('meta[name="theme-color"]').forEach(function(m){ if(!m.dataset.l) m.dataset.l = m.getAttribute('content'); m.setAttribute('content', d ? '#000000' : m.dataset.l); });
    if(btn){ btn.textContent = d ? '☀️' : '🌙'; btn.setAttribute('aria-pressed', d ? 'true' : 'false'); btn.title = d ? 'الوضع العادي' : 'الوضع الداكن'; btn.setAttribute('aria-label', btn.title); }
  }
  if(btn) btn.addEventListener('click', function(){
    var d = !isDark(); if(d) root.setAttribute('data-theme', 'dark'); else root.removeAttribute('data-theme');
    try{ localStorage.setItem(KEY, d ? 'dark' : 'light'); }catch(e){}
    paint();
  });
  paint();
})();
