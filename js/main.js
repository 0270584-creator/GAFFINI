/* ==========================================================
   Gaffini — site behaviour
   ========================================================== */
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const clamp = (n, a = 0, b = 1) => Math.min(b, Math.max(a, n));
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const money = (n) =>
    new Intl.NumberFormat(STORE.locale, { style: "currency", currency: STORE.currency, maximumFractionDigits: 0 }).format(n);

  /* ---------- Colour helper: lighten (+) / darken (−) a hex colour ---------- */
  function shade(hex, amt) {
    let h = hex.replace("#", "");
    if (h.length === 3) h = [...h].map((c) => c + c).join("");
    const n = parseInt(h, 16);
    const mix = (c) => Math.round(amt >= 0 ? c + (255 - c) * amt : c * (1 + amt));
    const r = mix(n >> 16), g = mix((n >> 8) & 255), b = mix(n & 255);
    return `rgb(${r},${g},${b})`;
  }

  /* ---------- Sunglasses illustration (placeholder until real photos) ---------- */
  // Each shape draws the LEFT lens; the right lens is mirrored around x = 200.
  const LENS = {
    round: '<circle cx="118" cy="92" r="58"/>',
    square: '<rect x="50" y="44" width="136" height="98" rx="24"/>',
    aviator: '<path d="M52 62 Q56 42 120 42 Q180 42 184 60 Q188 110 150 138 Q118 156 84 142 Q50 124 52 62 Z"/>',
    cateye: '<path d="M40 46 Q96 42 140 48 Q182 54 184 70 Q184 120 140 136 Q86 150 64 114 Q54 92 40 46 Z"/>',
  };
  const BRIDGE = {
    round: '<path d="M176 82 Q200 64 224 82"/>',
    square: '<path d="M186 76 Q200 64 214 76"/>',
    aviator: '<path d="M184 62 Q200 54 216 62"/><path d="M176 46 L224 46"/>',
    cateye: '<path d="M184 78 Q200 66 216 78"/>',
  };

  let svgId = 0;
  function glassesSVG(shape, { frame, lens }) {
    const id = `g${++svgId}`;
    const metal = shape === "aviator";
    const tx = shape === "cateye" ? 42 : 54;
    return `
<svg viewBox="0 0 400 190" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs>
    <linearGradient id="${id}f" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${shade(frame, metal ? 0.35 : 0.22)}"/>
      <stop offset=".5" stop-color="${frame}"/>
      <stop offset="1" stop-color="${shade(frame, -0.35)}"/>
    </linearGradient>
    <linearGradient id="${id}l" x1="0" y1="0" x2=".35" y2="1">
      <stop offset="0" stop-color="${lens[0]}"/><stop offset="1" stop-color="${lens[1]}"/>
    </linearGradient>
    <linearGradient id="${id}r" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#fff" stop-opacity=".55"/>
      <stop offset=".32" stop-color="#fff" stop-opacity=".06"/>
      <stop offset=".5" stop-color="#fff" stop-opacity="0"/>
    </linearGradient>
    <g id="${id}lens">${LENS[shape]}</g>
    <clipPath id="${id}c"><use href="#${id}lens"/><use href="#${id}lens" transform="translate(400 0) scale(-1 1)"/></clipPath>
  </defs>
  <g fill="none" stroke="url(#${id}f)" stroke-width="${metal ? 3.5 : 8}" stroke-linecap="round">
    <path d="M${tx} 64 Q30 58 6 60"/><path d="M${400 - tx} 64 Q370 58 394 60"/>
  </g>
  <g fill="url(#${id}l)" stroke="url(#${id}f)" stroke-width="${metal ? 4.5 : 11}" stroke-linejoin="round">
    <use href="#${id}lens"/>
    <use href="#${id}lens" transform="translate(400 0) scale(-1 1)"/>
  </g>
  <g clip-path="url(#${id}c)">
    <rect x="0" y="0" width="400" height="190" fill="url(#${id}r)"/>
    <path d="M60 150 L170 30 L190 30 L80 150Z M250 150 L350 40 L360 40 L260 150Z" fill="#fff" opacity=".07"/>
  </g>
  <g fill="none" stroke="${shade(frame, metal ? 0.6 : 0.35)}" stroke-width="1.2" opacity=".55">
    <use href="#${id}lens" transform="translate(0 -1.5)"/>
    <use href="#${id}lens" transform="translate(400 -1.5) scale(-1 1)"/>
  </g>
  <g fill="none" stroke="url(#${id}f)" stroke-width="${metal ? 4.5 : 11}" stroke-linecap="round">${BRIDGE[shape]}</g>
</svg>`;
  }

  const media = (p, cw) =>
    cw.image ? `<img src="${cw.image}" alt="${p.name} in ${cw.name}" loading="lazy">` : glassesSVG(p.shape, cw);

  /* ---------- Static visuals ---------- */
  $("#heroGlasses").innerHTML = glassesSVG("square", { frame: "#141414", lens: ["#1a1208", "#8a6236"] });
  const storyLooks = [
    { shape: "square", frame: "#3a2412", lens: ["#c9b79a", "#e9dcc6"] },   // raw acetate, clear lens
    { shape: "square", frame: "#5a3418", lens: ["#3a2412", "#6d4826"] },   // polished havana
    { shape: "square", frame: "#141414", lens: ["#1a1208", "#9a6a38"] },   // finished, tinted
  ];
  $$(".story__frame").forEach((el, i) => { el.innerHTML = glassesSVG(storyLooks[i].shape, storyLooks[i]); });
  $("#year").textContent = new Date().getFullYear();

  /* ---------- Product grid ---------- */
  const grid = $("#productGrid");
  const selected = {}; // product id -> colourway index
  const byId = (id) => PRODUCTS.find((x) => x.id === id);

  function swatchesHTML(p, active) {
    return p.colorways.map((c, i) => `
      <button class="swatch${i === active ? " is-active" : ""}" style="background:${c.frame}"
        data-action="swatch" data-index="${i}" role="radio" aria-checked="${i === active}"
        aria-label="${c.name}" title="${c.name}"></button>`).join("");
  }

  function renderGrid() {
    grid.innerHTML = PRODUCTS.map((p, n) => {
      const i = selected[p.id] || 0;
      return `
      <article class="card reveal" style="--d:${(n % 3) * 0.08}s" data-id="${p.id}" data-shape="${p.shape}">
        <p class="card__badge">${p.badge || ""}</p>
        <h3 class="card__name">${p.name}</h3>
        <p class="card__tag">${p.tagline}</p>
        <div class="card__media">${media(p, p.colorways[i])}</div>
        <div class="swatches" role="radiogroup" aria-label="Colour">${swatchesHTML(p, i)}</div>
        <p class="card__price">${money(p.price)}</p>
        <div class="card__actions">
          <button class="pill pill--dark" data-action="buy">Add to bag</button>
          <button class="link-arrow" data-action="more">Learn more</button>
        </div>
      </article>`;
    }).join("");
    applyFilter();
    observeReveals();
  }

  grid.addEventListener("click", (e) => {
    const card = e.target.closest(".card");
    if (!card) return;
    const p = byId(card.dataset.id);
    const action = e.target.closest("[data-action]")?.dataset.action;
    if (action === "swatch") {
      const i = +e.target.closest(".swatch").dataset.index;
      selected[p.id] = i;
      const m = $(".card__media", card);
      m.innerHTML = media(p, p.colorways[i]);
      $$(".swatch", card).forEach((s, si) => {
        s.classList.toggle("is-active", si === i);
        s.setAttribute("aria-checked", si === i);
      });
      return;
    }
    if (action === "buy") {
      addToCart(p.id, selected[p.id] || 0);
      toast(`${p.name} added to your bag`);
      return;
    }
    openSheet(p.id);
  });

  /* ---------- Segmented filter ---------- */
  let filter = "all";
  const seg = $("#filters"), thumb = $(".segmented__thumb", seg);
  function moveThumb() {
    const b = $("button.is-active", seg);
    thumb.style.width = `${b.offsetWidth}px`;
    thumb.style.transform = `translateX(${b.offsetLeft}px)`;
  }
  function applyFilter() {
    $$(".card", grid).forEach((c) => c.classList.toggle("is-hidden", filter !== "all" && c.dataset.shape !== filter));
  }
  seg.addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    filter = b.dataset.filter;
    $$("button", seg).forEach((x) => {
      x.classList.toggle("is-active", x === b);
      x.setAttribute("aria-selected", x === b);
    });
    moveThumb();
    applyFilter();
  });
  addEventListener("resize", moveThumb);
  document.fonts?.ready.then(moveThumb);
  moveThumb();

  /* ---------- Product sheet ---------- */
  const sheet = $("#productModal");
  function openSheet(id) {
    const p = byId(id);
    let ci = selected[id] || 0;
    const body = $("#modalBody");
    const draw = () => {
      const cw = p.colorways[ci];
      body.innerHTML = `
        <div class="sheet__media tilt">${media(p, cw)}</div>
        <div class="sheet__info">
          ${p.badge ? `<p class="kicker" style="margin:0">${p.badge}</p>` : ""}
          <h3>${p.name}</h3>
          <p class="sheet__price">${money(p.price)}</p>
          <p class="sheet__desc">${p.description}</p>
          <p class="sheet__label">Colour <strong>${cw.name}</strong></p>
          <div class="swatches" role="radiogroup" aria-label="Colour">${swatchesHTML(p, ci)}</div>
          <button class="pill pill--dark pill--block" id="addToBag" style="margin-top:1rem">Add to bag</button>
          <ul class="sheet__specs">
            <li>${p.tagline}</li>
            <li>Polarized lenses · 100% UV400 protection</li>
            <li>Signature case and microfibre cloth included</li>
            <li>Complimentary shipping and 30-day returns</li>
          </ul>
        </div>`;
      $$(".swatch", body).forEach((s) => s.addEventListener("click", () => { ci = +s.dataset.index; draw(); }));
      $("#addToBag", body).addEventListener("click", () => {
        addToCart(p.id, ci);
        sheet.close();
        openCart();
      });
      bindTilt($(".sheet__media", body));
    };
    draw();
    sheet.showModal();
  }
  $("#modalClose").addEventListener("click", () => sheet.close());
  sheet.addEventListener("click", (e) => { if (e.target === sheet) sheet.close(); });

  /* ---------- Cart ---------- */
  const CART_KEY = "gaffini-cart";
  let cart = [];
  try { cart = JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch { cart = []; }
  cart = cart.filter((l) => byId(l.id)?.colorways[l.ci]);

  const save = () => { try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch {} };

  function addToCart(id, ci) {
    const line = cart.find((l) => l.id === id && l.ci === ci);
    if (line) line.qty++;
    else cart.push({ id, ci, qty: 1 });
    save(); renderCart();
    const count = $("#cartCount");
    count.classList.add("bump");
    setTimeout(() => count.classList.remove("bump"), 300);
  }

  function renderCart() {
    const list = $("#cartItems");
    const qty = cart.reduce((n, l) => n + l.qty, 0);
    const count = $("#cartCount");
    count.textContent = qty;
    count.hidden = qty === 0;
    $("#checkoutBtn").disabled = qty === 0;
    if (!cart.length) {
      list.innerHTML = '<li class="drawer__empty"><strong>Your bag is empty.</strong>Discover the collection to begin.</li>';
      $("#cartTotal").textContent = money(0);
      return;
    }
    let total = 0;
    list.innerHTML = cart.map((l, idx) => {
      const p = byId(l.id);
      const cw = p.colorways[l.ci];
      total += p.price * l.qty;
      return `
        <li class="line">
          <div class="line__img">${media(p, cw)}</div>
          <div>
            <div class="line__name">${p.name}</div>
            <div class="line__variant">${cw.name}</div>
            <div class="qty">
              <button data-act="dec" data-idx="${idx}" aria-label="Decrease quantity">−</button>
              <span>${l.qty}</span>
              <button data-act="inc" data-idx="${idx}" aria-label="Increase quantity">+</button>
            </div>
          </div>
          <div class="line__right">
            <span>${money(p.price * l.qty)}</span>
            <button class="line__remove" data-act="rm" data-idx="${idx}">Remove</button>
          </div>
        </li>`;
    }).join("");
    $("#cartTotal").textContent = money(total);
  }

  $("#cartItems").addEventListener("click", (e) => {
    const b = e.target.closest("[data-act]");
    if (!b) return;
    const l = cart[+b.dataset.idx];
    if (b.dataset.act === "inc") l.qty++;
    if (b.dataset.act === "dec") l.qty--;
    if (b.dataset.act === "rm" || l.qty < 1) cart.splice(+b.dataset.idx, 1);
    save(); renderCart();
  });

  const drawer = $("#cart"), overlay = $("#overlay");
  function openCart() {
    overlay.hidden = false;
    requestAnimationFrame(() => overlay.classList.add("is-visible"));
    drawer.classList.add("is-open");
    drawer.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  function closeCart() {
    overlay.classList.remove("is-visible");
    drawer.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    setTimeout(() => { overlay.hidden = true; }, 400);
  }
  $("#cartOpen").addEventListener("click", openCart);
  $("#cartClose").addEventListener("click", closeCart);
  overlay.addEventListener("click", closeCart);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && drawer.classList.contains("is-open")) closeCart(); });

  // TODO: connect to a real checkout (Shopify / Stripe / Mercado Pago).
  $("#checkoutBtn").addEventListener("click", () => toast("Checkout is coming soon"));

  /* ---------- Forms (placeholder until a form service is connected) ---------- */
  $("#contactForm").addEventListener("submit", (e) => {
    e.preventDefault();
    e.target.reset();
    $("#formNote").textContent = "Thank you. A client advisor will be in touch shortly.";
  });
  $("#newsletter").addEventListener("submit", (e) => {
    e.preventDefault();
    e.target.reset();
    toast("Welcome to Gaffini");
  });

  /* ---------- Toast ---------- */
  let toastTimer;
  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("is-visible"), 2600);
  }

  /* ---------- Nav / mobile menu ---------- */
  const nav = $("#nav");
  const toggle = $("#menuToggle"), links = $("#navLinks");
  const setMenu = (open) => {
    links.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open);
    document.body.style.overflow = open ? "hidden" : "";
  };
  toggle.addEventListener("click", () => setMenu(!links.classList.contains("is-open")));
  links.addEventListener("click", (e) => { if (e.target.matches("a")) setMenu(false); });

  /* ---------- Pointer tilt (desktop micro-interaction) ---------- */
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
  function bindTilt(el, area = el) {
    if (!el || !finePointer || reduceMotion) return;
    const target = el.firstElementChild;
    area.addEventListener("pointermove", (e) => {
      const r = area.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      target.style.transform = `rotateY(${x * 14}deg) rotateX(${-y * 10}deg)`;
    });
    area.addEventListener("pointerleave", () => { target.style.transform = ""; });
    target.style.transition = "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)";
  }
  bindTilt($("#heroGlasses"), $("#hero"));

  /* ---------- Scroll-driven effects ---------- */
  const hero = $("#hero");
  const story = $("#story");
  const steps = $$(".story__step"), frames = $$(".story__frame"), dots = $$(".story__progress span");
  let activeStep = 0;

  function onScroll() {
    const y = scrollY, vh = innerHeight;
    nav.classList.toggle("is-scrolled", y > 8);

    if (!reduceMotion) hero.style.setProperty("--hp", clamp(y / (hero.offsetHeight * 0.9)).toFixed(3));

    const top = story.offsetTop, span = story.offsetHeight - vh;
    const p = clamp((y - top) / span);
    const step = Math.min(steps.length - 1, Math.floor(p * steps.length));
    if (step !== activeStep) {
      activeStep = step;
      [steps, frames, dots].forEach((set) => set.forEach((el, i) => el.classList.toggle("is-active", i === step)));
    }
  }
  let ticking = false;
  addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { onScroll(); ticking = false; });
  }, { passive: true });
  addEventListener("resize", onScroll);

  /* ---------- Reveal on scroll + count-up ---------- */
  function countUp(el) {
    const end = +el.dataset.count;
    if (reduceMotion) return;
    const t0 = performance.now(), dur = 1400;
    const tick = (t) => {
      const k = clamp((t - t0) / dur);
      el.textContent = Math.round(end * (1 - Math.pow(1 - k, 3)));
      if (k < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
  const io = "IntersectionObserver" in window
    ? new IntersectionObserver((entries) => entries.forEach((en) => {
        if (!en.isIntersecting) return;
        en.target.classList.add("is-in");
        $$("[data-count]", en.target).forEach(countUp);
        io.unobserve(en.target);
      }), { threshold: 0.15, rootMargin: "0px 0px -40px 0px" })
    : null;
  function observeReveals() {
    $$(".reveal:not(.is-in)").forEach((el) => (io ? io.observe(el) : el.classList.add("is-in")));
  }

  renderGrid();
  renderCart();
  onScroll();
})();
