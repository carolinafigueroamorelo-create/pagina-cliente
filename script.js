/* GOLD SERVICES — interacciones
   Edita aquí las propuestas: textos, colores y rutas de imágenes. */

const PROPOSALS = [
  { id: "01", accent: "#c9a227", logo: "assets/Logos/logo-01",
    title: "Una marca sólida<br>construida sobre confianza.",
    text: "Esta dirección explora una identidad visual centrada en la fuerza, la protección y la confiabilidad dentro de la industria del transporte.",
    colors: [["Gold","#C9A227"],["Black","#0B0B0B"],["White","#F5F4F0"]],
    mockups: ["assets/mockups/mockup-01-01","assets/mockups/mockup-01-02","assets/mockups/mockup-01-03"] },
  { id: "02", accent: "#a67c52", logo: "assets/Logos/logo-02",
    title: "Herencia, fuerza<br>y movimiento.",
    text: "Una segunda interpretación del mismo concepto, con un lenguaje visual más tradicional y robusto.",
    colors: [["Gold","#C9A227"],["Brown","#4A3828"],["White","#F5F4F0"]],
    mockups: ["assets/mockups/mockup-02-01","assets/mockups/mockup-02-02","assets/mockups/mockup-02-03"] },
  { id: "03", accent: "#f5f4f0", logo: "assets/Logos/logo-03",
    title: "Protección moderna<br>para el camino que viene.",
    text: "Un enfoque más limpio y contemporáneo, pensado para transmitir confianza, profesionalismo y avance.",
    colors: [["Gold","#C9A227"],["Black","#0B0B0B"],["Gray","#858585"]],
    mockups: ["assets/mockups/mockup-03-01","assets/mockups/mockup-03-02","assets/mockups/mockup-03-03"] }
];

const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

/* ---------- Carga de imágenes tolerante ----------
   GitHub Pages distingue mayúsculas/minúsculas y extensiones.
   Probamos varias combinaciones antes de mostrar el aviso. */
function candidates(base) {
  const parts = base.split("/"), file = parts.pop(), dir = parts.join("/");
  const dirs = new Set([dir, dir.replace(/Logos/i, "Logos"), dir.replace(/Logos/i, "logos"),
                        dir.replace(/mockups/i, "mockups"), dir.replace(/mockups/i, "Mockups")]);
  const list = [];
  dirs.forEach(d => ["png", "jpg", "jpeg", "webp", "svg", "PNG", "JPG"].forEach(e => list.push(`${d}/${file}.${e}`)));
  return list;
}
function loadImage(base, img, box) {
  const list = candidates(base); let i = 0;
  const next = () => {
    if (i >= list.length) {
      console.warn("No se encontró la imagen:", base + ".(png|jpg|webp)");
      img.remove();
      box.insertAdjacentHTML("beforeend",
        `<div class="missing"><b>${base.match(/(\d\d)(-\d\d)?$/)?.[0] || "—"}</b>Falta imagen<br>${base}.png</div>`);
      return;
    }
    img.src = list[i++];
  };
  img.onerror = next;
  img.onload = () => { img.classList.add("loaded"); img.dataset.src = img.src; };
  next();
}

/* ---------- Construcción de propuestas ---------- */
const list = $("#proposal-list");
PROPOSALS.forEach(p => {
  const sec = document.createElement("article");
  sec.className = "proposal-section";
  sec.id = "proposal-" + p.id;
  sec.dataset.color = p.accent;
  sec.dataset.num = p.id;
  sec.style.setProperty("--accent", p.accent);
  sec.innerHTML = `
    <div class="proposal-header">
      <span class="proposal-number">${p.id}</span>
      <span class="proposal-label">Dirección de logo</span>
    </div>
    <div class="logo-stage"><img alt="Propuesta de logo ${p.id} de Gold Services"></div>
    <div class="proposal-info">
      <div><p class="eyebrow">Concepto</p><h3>${p.title}</h3></div>
      <div class="proposal-description"><p>${p.text}</p></div>
    </div>
    <div class="color-section">
      <p class="eyebrow">Colores <small style="color:#666;letter-spacing:1px;text-transform:none">· clic para copiar</small></p>
      <div class="color-palette">
        ${p.colors.map(([n, h]) => `<button class="color-card" style="--swatch:${h}" data-hex="${h}">
          <div class="swatch"></div><span>${n.toUpperCase()}</span><small>${h}</small></button>`).join("")}
      </div>
    </div>
    <div class="mockups-section">
      <p class="eyebrow">Aplicaciones</p>
      <div class="mockup-grid">
        ${p.mockups.map((m, i) => `<div class="mockup" data-src="${m}"><img alt="Mockup ${i + 1} de la propuesta ${p.id}"></div>`).join("")}
      </div>
    </div>`;
  list.appendChild(sec);
  const stage = $(".logo-stage", sec);
  loadImage(p.logo, $("img", stage), stage);
  $$(".mockup", sec).forEach(m => loadImage(m.dataset.src, $("img", m), m));
});

/* ---------- Hero: dividir líneas ---------- */
$$(".split .line").forEach(l => l.innerHTML = `<b>${l.textContent}</b>`);

/* ---------- Loader ---------- */
const count = $("#count"), bar = $(".loader-line i");
let n = 0;
const tick = setInterval(() => {
  n = Math.min(100, n + Math.ceil(Math.random() * 7));
  count.textContent = n; bar.style.width = n + "%";
  if (n >= 100) {
    clearInterval(tick);
    setTimeout(() => { document.body.classList.remove("loading"); document.body.classList.add("ready"); }, 300);
  }
}, 45);

/* ---------- Revelado al hacer scroll ---------- */
const io = (cls, thr) => new IntersectionObserver(es => es.forEach(e => e.isIntersecting && e.target.classList.add(cls)), { threshold: thr });
const revealIO = io("visible", .15), propIO = io("proposal-visible", .15);
$$(".reveal").forEach(el => revealIO.observe(el));
$$(".proposal-section").forEach(el => propIO.observe(el));

/* ---------- Indicador circular (color + número) ---------- */
const ring = $("#ring"), num = $("#scrollNum"), root = document.documentElement;
const colorIO = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) {
    root.style.setProperty("--accent", e.target.dataset.color);
    num.textContent = e.target.dataset.num;
  }
}), { threshold: .5 });
$$("[data-color]").forEach(s => colorIO.observe(s));

/* ---------- Progreso de scroll ---------- */
const progress = $(".progress");
const onScroll = () => {
  const p = scrollY / (document.documentElement.scrollHeight - innerHeight || 1);
  progress.style.width = p * 100 + "%";
  ring.style.strokeDashoffset = 239 * (1 - p);
  $(".hero-content").style.transform = `translateY(${scrollY * .25}px)`;
};
addEventListener("scroll", onScroll, { passive: true }); onScroll();

/* ---------- Cursor personalizado ---------- */
const cursor = $(".cursor");
let cx = 0, cy = 0, tx = 0, ty = 0;
addEventListener("mousemove", e => { tx = e.clientX; ty = e.clientY; cursor.classList.add("on"); });
(function loop() {
  cx += (tx - cx) * .18; cy += (ty - cy) * .18;
  cursor.style.transform = `translate(${cx}px,${cy}px)`;
  requestAnimationFrame(loop);
})();
document.addEventListener("mouseover", e => cursor.classList.toggle("big", !!e.target.closest(".logo-stage,.mockup,a,button")));

/* ---------- Parallax del logo y tilt 3D de los mockups ---------- */
$$(".logo-stage").forEach(s => s.addEventListener("mousemove", e => {
  const r = s.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
  s.style.setProperty("--mx", x * 100 + "%"); s.style.setProperty("--my", y * 100 + "%");
  s.style.setProperty("--px", (x - .5) * -30 + "px"); s.style.setProperty("--py", (y - .5) * -20 + "px");
}));
$$(".mockup").forEach(m => {
  m.addEventListener("mousemove", e => {
    const r = m.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
    m.style.transform = `perspective(900px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-8px)`;
  });
  m.addEventListener("mouseleave", () => m.style.transform = "");
});

/* ---------- Lightbox ---------- */
const lb = $(".lightbox"), lbImg = $("img", lb);
document.addEventListener("click", e => {
  const el = e.target.closest(".mockup img.loaded, .logo-stage img.loaded");
  if (el) { lbImg.src = el.dataset.src; lb.classList.add("open"); }
  else if (e.target.closest(".lightbox")) lb.classList.remove("open");
});
addEventListener("keydown", e => e.key === "Escape" && lb.classList.remove("open"));

/* ---------- Copiar color ---------- */
const toast = $(".toast");
document.addEventListener("click", e => {
  const c = e.target.closest(".color-card"); if (!c) return;
  navigator.clipboard?.writeText(c.dataset.hex);
  toast.textContent = `${c.dataset.hex} copiado`;
  toast.classList.add("show"); setTimeout(() => toast.classList.remove("show"), 1600);
});
