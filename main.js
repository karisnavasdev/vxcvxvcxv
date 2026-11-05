(function () {
  const cfg = window.OSSOFF || {};
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  const toast = $("#toast");
  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.classList.remove("show"), 1600);
  }

  async function copyCA(e) {
    const text = cfg.caDisplay || cfg.ca || "0xcomingsoon";
    const btn = e?.currentTarget;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    showToast("CA copied · " + text);
    if (btn && btn.classList.contains("ca__copy")) {
      btn.classList.add("is-copied");
      setTimeout(() => btn.classList.remove("is-copied"), 1400);
    }
  }
  $$("[data-copy]").forEach((btn) => btn.addEventListener("click", copyCA));

  const desc = cfg.description || "";
  const setText = (sel, val) => {
    const el = $(sel);
    if (el) el.textContent = val;
  };
  setText("#heroDesc", desc);
  setText("#ballotDesc", desc);
  setText("#tagline", cfg.tagline || "Georgia's quiet bet · 2028 ballot desk");
  setText("#feeNote", cfg.feeNote || "");
  setText("#caText", cfg.caDisplay || cfg.ca || "0xcomingsoon");
  setText("#caText2", cfg.caDisplay || cfg.ca || "0xcomingsoon");

  const steps = $("#steps");
  if (steps && Array.isArray(cfg.howToBuy)) {
    steps.innerHTML = cfg.howToBuy
      .map(
        (s) => `<article class="step reveal">
        <div class="step-num">${s.step}</div>
        <h3>${s.title}</h3>
        <p>${s.body}</p>
      </article>`
      )
      .join("");
  }

  const tok = $("#tokGrid");
  if (tok && Array.isArray(cfg.tokenomics)) {
    tok.innerHTML = cfg.tokenomics
      .map(
        (t) => `<div class="tok-card reveal"><span>${t.label}</span><strong>${t.value}</strong></div>`
      )
      .join("");
  }

  const tw = $("#twLink");
  const tg = $("#tgLink");
  const heroX = $("#heroX");
  if (cfg.twitter) {
    [tw, heroX].forEach((el) => {
      if (!el) return;
      el.href = cfg.twitter;
      el.classList.remove("is-disabled");
      el.removeAttribute("aria-disabled");
    });
    if (tw) tw.querySelector("strong").textContent = "Follow";
    if (heroX) heroX.textContent = "Follow X";
  }
  if (cfg.telegram) {
    tg.href = cfg.telegram;
    tg.classList.remove("is-disabled");
    tg.removeAttribute("aria-disabled");
    tg.querySelector("strong").textContent = "Join chat";
  }

  // Etherscan link (footer brand or socials if present)
  let scan = $("#scanLink");
  if (!scan && cfg.etherscanUrl) {
    const socials = document.querySelector(".socials");
    if (socials) {
      scan = document.createElement("a");
      scan.className = "social";
      scan.id = "scanLink";
      scan.target = "_blank";
      scan.rel = "noopener";
      scan.innerHTML = "<span>Etherscan</span><strong>View CA</strong>";
      socials.appendChild(scan);
    }
  }
  if (scan && cfg.etherscanUrl) {
    scan.href = cfg.etherscanUrl;
    scan.classList.remove("is-disabled");
    scan.removeAttribute("aria-disabled");
    scan.target = "_blank";
    scan.rel = "noopener";
  }

  const live = Boolean(cfg.caReady && cfg.ca && !/comingsoon/i.test(cfg.ca));
  const navBuy = $("#navBuy");
  const heroBuy = $("#heroBuy");
  const chart = $("#heroChart");
  if (live && cfg.buyUrl) {
    if (navBuy) {
      navBuy.disabled = false;
      navBuy.textContent = "Buy $OSSOFF";
      navBuy.onclick = () => window.open(cfg.buyUrl, "_blank", "noopener");
    }
    if (heroBuy) {
      heroBuy.disabled = false;
      heroBuy.textContent = "Buy on Uniswap";
      heroBuy.onclick = () => window.open(cfg.buyUrl, "_blank", "noopener");
    }
  }
  if (live && cfg.dexscreenerPair && chart) {
    chart.href = "https://dexscreener.com/ethereum/" + cfg.dexscreenerPair;
    chart.classList.remove("is-disabled");
    chart.removeAttribute("aria-disabled");
    chart.textContent = "Live chart";
  }

  const burger = $("#burger");
  const drawer = $("#drawer");
  if (burger && drawer) {
    burger.addEventListener("click", () => {
      const open = drawer.classList.toggle("open");
      burger.classList.toggle("is-open", open);
    });
    $$("a", drawer).forEach((a) =>
      a.addEventListener("click", () => {
        drawer.classList.remove("open");
        burger.classList.remove("is-open");
      })
    );
  }

  const nav = $("#nav");
  const onScrollNav = () => {
    if (!nav) return;
    nav.classList.toggle("is-scrolled", window.scrollY > 18);
  };
  onScrollNav();
  window.addEventListener("scroll", onScrollNav, { passive: true });

  const fill = $("#scrollFill");
  const label = $("#scrollLabel");
  function updateMeter() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const p = max > 0 ? Math.min(100, Math.round((window.scrollY / max) * 100)) : 0;
    if (fill) fill.style.height = p + "%";
    if (label) label.textContent = p + "%";
  }
  updateMeter();
  window.addEventListener("scroll", updateMeter, { passive: true });

  // Magnetic buttons
  $$(".magnetic").forEach((btn) => {
    btn.addEventListener("pointermove", (e) => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      btn.style.setProperty("--mx", x * 0.18 + "px");
      btn.style.setProperty("--my", y * 0.22 + "px");
    });
    btn.addEventListener("pointerleave", () => {
      btn.style.setProperty("--mx", "0px");
      btn.style.setProperty("--my", "0px");
    });
  });

  // Lightbox
  const lb = $("#lightbox");
  const lbImg = $("#lightboxImg");
  const lbCap = $("#lightboxCap");
  function openLb(src, title) {
    if (!lb) return;
    lbImg.src = src;
    lbCap.textContent = title || "";
    lb.hidden = false;
    document.body.style.overflow = "hidden";
  }
  function closeLb() {
    if (!lb) return;
    lb.hidden = true;
    lbImg.removeAttribute("src");
    document.body.style.overflow = "";
  }
  $$(".gal").forEach((card) => {
    card.addEventListener("click", () => {
      const img = card.querySelector("img");
      openLb(img.src, card.dataset.title || card.querySelector("figcaption")?.textContent);
    });
  });
  $("#lightboxClose")?.addEventListener("click", closeLb);
  lb?.addEventListener("click", (e) => {
    if (e.target === lb) closeLb();
  });
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLb();
  });

  // Soft USA flag background
  (function flagBackground() {
    const canvas = $("#flagCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w, h, raf, t0 = performance.now();
    const RED = "#B22234";
    const WHITE = "#F8F8F8";
    const NAVY = "#3C3B6E";
    const off = document.createElement("canvas");
    const octx = off.getContext("2d");

    function paintBase(phase) {
      const tw = off.width;
      const th = off.height;
      octx.clearRect(0, 0, tw, th);
      const stripes = 13;
      const sh = th / stripes;
      for (let i = 0; i < stripes; i++) {
        octx.fillStyle = i % 2 === 0 ? RED : WHITE;
        octx.fillRect(0, Math.floor(i * sh), tw, Math.ceil(sh) + 1);
      }
      const cantonW = tw * 0.4;
      const cantonH = sh * 7;
      octx.fillStyle = NAVY;
      octx.fillRect(0, 0, cantonW, cantonH);
      const starR = Math.min(cantonW / 12, cantonH / 10) * 0.35;
      octx.fillStyle = WHITE;
      for (let row = 0; row < 9; row++) {
        const odd = row % 2 === 1;
        const count = odd ? 5 : 6;
        for (let col = 0; col < count; col++) {
          const cx = (cantonW / (odd ? 6 : 7)) * (col + 1);
          const cy = (cantonH / 10) * (row + 1);
          const pulse = reduceMotion ? 1 : 0.82 + 0.18 * Math.sin(phase * 1.6 + row * 0.7 + col);
          octx.globalAlpha = pulse;
          octx.beginPath();
          for (let i = 0; i < 10; i++) {
            const ang = -Math.PI / 2 + (i * Math.PI) / 5;
            const r = i % 2 === 0 ? starR : starR * 0.4;
            const x = cx + Math.cos(ang) * r;
            const y = cy + Math.sin(ang) * r;
            if (i === 0) octx.moveTo(x, y);
            else octx.lineTo(x, y);
          }
          octx.closePath();
          octx.fill();
          octx.globalAlpha = 1;
        }
      }
    }

    function resize() {
      w = canvas.width = Math.max(640, Math.floor(window.innerWidth * (window.devicePixelRatio > 1.5 ? 0.7 : 0.85)));
      h = canvas.height = Math.max(360, Math.floor(window.innerHeight * (window.devicePixelRatio > 1.5 ? 0.7 : 0.85)));
      off.width = 640;
      off.height = 360;
    }

    function draw(now) {
      const t = (now - t0) / 1000;
      paintBase(t);
      ctx.clearRect(0, 0, w, h);
      if (reduceMotion) {
        ctx.drawImage(off, 0, 0, w, h);
        return;
      }
      const cols = 48;
      const rows = 28;
      const cw = w / cols;
      const ch = h / rows;
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const wave =
            Math.sin(x * 0.28 + t * 1.6) * 4 +
            Math.sin(y * 0.35 + t * 1.1) * 3 +
            Math.sin((x + y) * 0.12 + t * 2.1) * 2;
          const sx = (x / cols) * off.width;
          const sy = (y / rows) * off.height;
          const sw = off.width / cols;
          const sh = off.height / rows;
          ctx.drawImage(
            off,
            sx, sy, sw, sh,
            x * cw, y * ch + wave, cw + 1.2, ch + 1.2
          );
        }
      }
      raf = requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener("resize", () => {
      resize();
      if (reduceMotion) {
        paintBase(0);
        ctx.drawImage(off, 0, 0, w, h);
      }
    });
    if (reduceMotion) {
      paintBase(0);
      ctx.drawImage(off, 0, 0, w, h);
    } else {
      raf = requestAnimationFrame(draw);
    }
  })();

  // GSAP motion
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    gsap.set(".reveal", { opacity: 0, y: 28 });
    ScrollTrigger.batch(".reveal", {
      start: "top 88%",
      onEnter: (batch) =>
        gsap.to(batch, {
          opacity: 1,
          y: 0,
          duration: 0.75,
          stagger: 0.06,
          ease: "power3.out",
          overwrite: true,
        }),
    });
    gsap.from(".hero__name", {
      y: 40, opacity: 0, duration: 1, ease: "power4.out", delay: 0.1,
    });
    gsap.from(".hero__ticker", {
      scale: 0.7, rotate: -12, opacity: 0, duration: 0.8, ease: "back.out(1.7)", delay: 0.35,
    });
    const frame = $("#heroParallax");
    if (frame) {
      gsap.to(frame, {
        yPercent: 8,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }
  } else {
    $$(".reveal").forEach((el) => {
      el.style.opacity = "1";
      el.style.transform = "none";
    });
  }
})();
