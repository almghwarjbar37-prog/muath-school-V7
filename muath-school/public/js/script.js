/* ============================================================
   MUATH SCHOOL — Shared JavaScript
   ============================================================ */

// ── API Helper ─────────────────────────────────────────────
const API = {
  token: () => localStorage.getItem('token'),
  user:  () => JSON.parse(localStorage.getItem('user') || 'null'),
  headers() {
    const h = { 'Content-Type': 'application/json' };
    if (this.token()) h['Authorization'] = `Bearer ${this.token()}`;
    return h;
  },
  async get(url) {
    try { const r = await fetch(url, { headers: this.headers() }); return r.json(); }
    catch(e) { return { success: false, message: 'خطأ في الاتصال بالخادم' }; }
  },
  async post(url, data) {
    try { const r = await fetch(url, { method:'POST', headers:this.headers(), body:JSON.stringify(data) }); return r.json(); }
    catch(e) { return { success: false, message: 'خطأ في الاتصال بالخادم' }; }
  },
  async put(url, data) {
    try { const r = await fetch(url, { method:'PUT', headers:this.headers(), body:JSON.stringify(data) }); return r.json(); }
    catch(e) { return { success: false, message: 'خطأ في الاتصال بالخادم' }; }
  },
  async delete(url) {
    try { const r = await fetch(url, { method:'DELETE', headers: this.headers() }); return r.json(); }
    catch(e) { return { success: false, message: 'خطأ في الاتصال بالخادم' }; }
  },
  async postForm(url, formData) {
    try { const h = {}; if (this.token()) h['Authorization'] = `Bearer ${this.token()}`; const r = await fetch(url, { method:'POST', headers:h, body:formData }); return r.json(); }
    catch(e) { return { success: false, message: 'خطأ في الاتصال بالخادم' }; }
  },
  async putForm(url, formData) {
    try { const h = {}; if (this.token()) h['Authorization'] = `Bearer ${this.token()}`; const r = await fetch(url, { method:'PUT', headers:h, body:formData }); return r.json(); }
    catch(e) { return { success: false, message: 'خطأ في الاتصال بالخادم' }; }
  }
};

// ── Auth helpers ───────────────────────────────────────────
function isLoggedIn()  { return !!API.token(); }
function isAdmin()     { return API.user()?.role === 'admin'; }
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  API.post('/api/auth/logout', {});
  window.location.href = '/login';
}

// ── Notification ───────────────────────────────────────────
function showNotif(msg, type = 'success') {
  let n = document.getElementById('notification');
  if (!n) {
    n = document.createElement('div');
    n.id = 'notification';
    document.body.appendChild(n);
  }
  n.textContent = msg;
  n.className = 'notif show ' + type;
  clearTimeout(n._t);
  n._t = setTimeout(() => n.classList.remove('show'), 3500);
}

// ── Navbar build ───────────────────────────────────────────
function buildNav() {
  const el = document.getElementById('navAuth');
  if (!el) return;
  if (isLoggedIn()) {
    const u = API.user();
    el.innerHTML = `
      <span style="font-size:.85rem;color:var(--gray);margin-left:10px">أهلاً، ${u?.name || ''}</span>
      ${isAdmin() ? '<a href="/admin" class="btn btn-sm btn-green" style="margin-left:8px">لوحة التحكم</a>' : ''}
      <button class="btn btn-sm btn-outline" onclick="logout()">خروج</button>`;
  } else {
    el.innerHTML = `<a href="/login" class="btn btn-sm btn-green">تسجيل الدخول</a>`;
  }
}

// ── Scroll reveal ──────────────────────────────────────────
function initReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); e.target.classList.add('revealed'); } });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

// ── Active nav link ────────────────────────────────────────
function setActiveNav() {
  const path = window.location.pathname;
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.classList.remove('active');
    const href = a.getAttribute('href');
    if (href === path || (path === '/' && href === '/')) a.classList.add('active');
    else if (href !== '/' && href !== '#' && path.startsWith(href)) a.classList.add('active');
  });
}

// ── Mobile nav toggle ──────────────────────────────────────
function initMobileNav() {
  const btn = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (btn && links) {
    btn.addEventListener('click', () => {
      links.classList.toggle('open');
      btn.classList.toggle('active');
    });
    // Close on link click
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        links.classList.remove('open');
        btn.classList.remove('active');
      });
    });
  }
}

// ── Scroll to top ──────────────────────────────────────────
function initScrollTop() {
  const btn = document.getElementById('scrollTop');
  if (!btn) return;
  window.addEventListener('scroll', () => btn.classList.toggle('show', window.scrollY > 400));
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ── Init ───────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  buildNav();
  initReveal();
  setActiveNav();
  initMobileNav();
  initScrollTop();
});

// ── Custom cursor ──────────────────────────────────────────
(function initCursor() {
  if (window.matchMedia('(max-width:768px)').matches) return;
  const dot  = document.createElement('div'); dot.id  = 'cursorDot';
  const ring = document.createElement('div'); ring.id = 'cursorRing';
  document.body.append(dot, ring);
  let rx = 0, ry = 0;
  document.addEventListener('mousemove', e => {
    dot.style.left  = e.clientX + 'px';
    dot.style.top   = e.clientY + 'px';
    rx += (e.clientX - rx) * 0.12;
    ry += (e.clientY - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
  });
  setInterval(() => {
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
  }, 16);
  document.querySelectorAll('a,button,[onclick]').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
  });
})();

// ── Custom cursor ──────────────────────────────────────────
(function initCursor() {
  if (window.matchMedia('(max-width:768px)').matches) return;
  const dot  = document.createElement('div'); dot.id  = 'cursorDot';
  const ring = document.createElement('div'); ring.id = 'cursorRing';
  document.body.append(dot, ring);
  let rx = 0, ry = 0;
  document.addEventListener('mousemove', e => {
    dot.style.left  = e.clientX + 'px';
    dot.style.top   = e.clientY + 'px';
    rx += (e.clientX - rx) * 0.12;
    ry += (e.clientY - ry) * 0.12;
  });
  setInterval(() => {
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
  }, 16);
  document.querySelectorAll('a,button,[onclick]').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
  });
})();
