// ==========================================================================
// Tarot de Grum — efectos comunes a todas las páginas:
// cielo estrellado con parallax, estrellas fugaces, chispas del cursor,
// explosiones de partículas, menú móvil y apariciones al hacer scroll.
// ==========================================================================
(function () {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    const coarsePointer = !finePointer;
    const DPR = Math.min(window.devicePixelRatio || 1, 1.5);

    // ---------- Cielo estrellado ----------
    function createSky() {
        const sky = document.createElement('canvas');
        sky.id = 'sky';
        const nebula = document.createElement('div');
        nebula.className = 'nebula';
        const fx = document.createElement('canvas');
        fx.id = 'fx';
        document.body.prepend(fx);
        document.body.prepend(nebula);
        document.body.prepend(sky);
        return { sky, fx };
    }

    const { sky, fx } = createSky();
    const sctx = sky.getContext('2d');
    const fctx = fx.getContext('2d');
    let W = 0, H = 0;
    let stars = [];
    let shooting = [];
    let particles = [];
    let pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    let nextShot = performance.now() + 2500;

    const STAR_COLORS = ['255,255,255', '247,226,179', '169,210,255', '214,196,255'];

    // En móvil, la barra de direcciones aparece y desaparece al hacer scroll y
    // dispara "resize" constantemente. Para que el cielo no parpadee:
    //  - el lienzo se dimensiona a la altura máxima posible de la pantalla,
    //  - las estrellas se guardan en coordenadas relativas (0..1),
    //  - solo se regenera todo si cambia el ancho (p. ej. al girar el móvil).
    function sizeCanvases() {
        [sky, fx].forEach(c => {
            c.width = Math.round(W * DPR);
            c.height = Math.round(H * DPR);
            c.style.width = W + 'px';
            c.style.height = H + 'px';
        });
        sctx.setTransform(DPR, 0, 0, DPR, 0, 0);
        fctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }

    function makeStars() {
        const count = Math.min(coarsePointer ? 220 : 420, Math.round((W * H) / (coarsePointer ? 5200 : 4200)));
        stars = Array.from({ length: count }, () => ({
            nx: Math.random(),
            ny: Math.random(),
            z: Math.random() * 0.9 + 0.1,          // profundidad (parallax)
            r: Math.random() * 1.3 + 0.2,
            tw: Math.random() * Math.PI * 2,       // fase del parpadeo
            ts: Math.random() * 0.02 + 0.004,      // velocidad del parpadeo
            c: STAR_COLORS[Math.random() < 0.7 ? 0 : Math.floor(Math.random() * STAR_COLORS.length)]
        }));
        stars.forEach(st => {
            st.sprite = glowSprite(st.c);
            st.flare = st.r > 1.25 && st.z > 0.7 ? flareSprite(st.c) : null;
        });
    }

    function resize(force) {
        const newW = window.innerWidth;
        const tallest = Math.max(window.innerHeight, coarsePointer ? (window.screen && window.screen.height) || 0 : 0);
        const widthChanged = Math.abs(newW - W) > 1;
        if (!force && !widthChanged && tallest <= H) return; // solo la barra del navegador: no tocamos nada
        W = newW;
        H = widthChanged || force ? tallest : Math.max(H, tallest);
        sizeCanvases();
        if (force || widthChanged || !stars.length) makeStars();
        if (reduceMotion) drawSky(0, 16.67);
    }

    // ---------- Sprites pre-renderizados ----------
    // Dibujar brillos con shadowBlur en cada fotograma es carísimo. En su lugar,
    // se pinta una vez cada destello en un lienzo pequeño y luego se "estampa"
    // con drawImage, que la GPU hace prácticamente gratis.
    const spriteCache = new Map();
    function makeSprite(key, size, paint) {
        if (spriteCache.has(key)) return spriteCache.get(key);
        const c = document.createElement('canvas');
        c.width = c.height = size;
        paint(c.getContext('2d'), size);
        spriteCache.set(key, c);
        return c;
    }
    function glowSprite(color) {
        return makeSprite('glow' + color, 64, (g, n) => {
            const grad = g.createRadialGradient(n / 2, n / 2, 0, n / 2, n / 2, n / 2);
            grad.addColorStop(0, `rgba(${color},1)`);
            grad.addColorStop(0.18, `rgba(${color},0.95)`);
            grad.addColorStop(0.4, `rgba(${color},0.35)`);
            grad.addColorStop(1, `rgba(${color},0)`);
            g.fillStyle = grad;
            g.fillRect(0, 0, n, n);
        });
    }
    function starSprite(color) {
        return makeSprite('star' + color, 64, (g, n) => {
            const c = n / 2, r = n * 0.09;
            g.fillStyle = `rgba(${color},1)`;
            g.shadowColor = `rgba(${color},0.9)`;
            g.shadowBlur = n * 0.12;
            g.beginPath();
            for (let i = 0; i < 8; i++) {
                const rad = i % 2 === 0 ? r * 3.6 : r * 0.8;
                const a = (i * Math.PI) / 4;
                g.lineTo(c + Math.cos(a) * rad, c + Math.sin(a) * rad);
            }
            g.closePath();
            g.fill();
        });
    }
    function flareSprite(color) {
        return makeSprite('flare' + color, 32, (g, n) => {
            const c = n / 2;
            const h = g.createLinearGradient(0, 0, n, 0);
            h.addColorStop(0, `rgba(${color},0)`); h.addColorStop(0.5, `rgba(${color},0.8)`); h.addColorStop(1, `rgba(${color},0)`);
            g.fillStyle = h; g.fillRect(0, c - 0.5, n, 1);
            const v = g.createLinearGradient(0, 0, 0, n);
            v.addColorStop(0, `rgba(${color},0)`); v.addColorStop(0.5, `rgba(${color},0.8)`); v.addColorStop(1, `rgba(${color},0)`);
            g.fillStyle = v; g.fillRect(c - 0.5, 0, 1, n);
        });
    }

    function drawSky(t, dt) {
        sctx.clearRect(0, 0, W, H);
        const scroll = window.scrollY || 0;
        const k = Math.min(dt / 16.67, 3);          // independiente de los Hz del monitor
        pointer.x += (pointer.tx - pointer.x) * 0.05 * k;
        pointer.y += (pointer.ty - pointer.y) * 0.05 * k;

        for (const s of stars) {
            s.tw += s.ts * k;
            const alpha = Math.max(0, Math.min(1, 0.35 + Math.sin(s.tw) * 0.35 + s.z * 0.3));
            if (alpha < 0.03) continue;
            const x = s.nx * W - pointer.x * s.z * 18;
            let y = (s.ny * H - scroll * s.z * 0.15 - pointer.y * s.z * 18) % H;
            if (y < 0) y += H;
            const d = s.r * (0.6 + s.z) * 5;           // el sprite incluye el halo
            sctx.globalAlpha = alpha;
            sctx.drawImage(s.sprite, x - d / 2, y - d / 2, d, d);
            if (s.flare) {
                const f = d * 1.8;
                sctx.globalAlpha = alpha * 0.45;
                sctx.drawImage(s.flare, x - f / 2, y - f / 2, f, f);
            }
        }
        sctx.globalAlpha = 1;

        // Estrellas fugaces
        if (t > nextShot) {
            nextShot = t + 3500 + Math.random() * 6000;
            const fromLeft = Math.random() < 0.5;
            shooting.push({
                x: fromLeft ? Math.random() * W * 0.5 : W * 0.5 + Math.random() * W * 0.5,
                y: Math.random() * window.innerHeight * 0.4,
                vx: (fromLeft ? 1 : -1) * (7 + Math.random() * 5),
                vy: 3 + Math.random() * 2.5,
                life: 1
            });
        }
        if (shooting.length) {
            shooting = shooting.filter(s => s.life > 0);
            sctx.lineWidth = 2;
            sctx.lineCap = 'round';
            for (const s of shooting) {
                s.x += s.vx * k; s.y += s.vy * k; s.life -= 0.012 * k;
                const tail = 18;
                const grad = sctx.createLinearGradient(s.x, s.y, s.x - s.vx * tail, s.y - s.vy * tail);
                grad.addColorStop(0, `rgba(255,244,214,${Math.max(0, s.life)})`);
                grad.addColorStop(1, 'rgba(255,244,214,0)');
                sctx.strokeStyle = grad;
                sctx.beginPath();
                sctx.moveTo(s.x, s.y);
                sctx.lineTo(s.x - s.vx * tail, s.y - s.vy * tail);
                sctx.stroke();
                sctx.globalAlpha = Math.max(0, s.life);
                sctx.drawImage(glowSprite('255,255,255'), s.x - 6, s.y - 6, 12, 12);
                sctx.globalAlpha = 1;
            }
        }
    }

    // ---------- Partículas (chispas del cursor y explosiones) ----------
    const SPARK_COLORS = ['247,226,179', '230,200,142', '169,210,255', '255,255,255', '214,196,255'];
    const MAX_PARTICLES = coarsePointer ? 260 : 600;

    function spawn(x, y, opts = {}) {
        const n = Math.min(opts.count || 1, MAX_PARTICLES - particles.length);
        for (let i = 0; i < n; i++) {
            const a = Math.random() * Math.PI * 2;
            const sp = (opts.speed || 1) * (Math.random() * 0.8 + 0.2);
            const c = opts.color || SPARK_COLORS[Math.floor(Math.random() * SPARK_COLORS.length)];
            const star = Math.random() < (opts.starChance ?? 0.35);
            particles.push({
                x, y,
                vx: Math.cos(a) * sp + (opts.vx || 0),
                vy: Math.sin(a) * sp + (opts.vy || 0),
                g: opts.gravity ?? 0.02,
                life: 1,
                decay: opts.decay || (0.012 + Math.random() * 0.02),
                r: (opts.size || 2) * (Math.random() * 0.7 + 0.5),
                sprite: star ? starSprite(c) : glowSprite(c),
                scale: star ? 11 : 7
            });
        }
    }

    let fxDirty = false;
    function drawFx(dt) {
        if (!particles.length) {
            if (fxDirty) { fctx.clearRect(0, 0, W, H); fxDirty = false; }
            return;
        }
        fctx.clearRect(0, 0, W, H);
        fxDirty = true;
        const k = Math.min(dt / 16.67, 3);
        const drag = Math.pow(0.985, k);
        fctx.globalCompositeOperation = 'lighter';
        let alive = 0;
        for (const p of particles) {
            p.x += p.vx * k; p.y += p.vy * k; p.vy += p.g * k;
            p.vx *= drag; p.vy *= drag;
            p.life -= p.decay * k;
            if (p.life <= 0) continue;
            particles[alive++] = p;
            const d = p.r * p.life * p.scale;
            fctx.globalAlpha = p.life;
            fctx.drawImage(p.sprite, p.x - d / 2, p.y - d / 2, d, d);
        }
        particles.length = alive;
        fctx.globalAlpha = 1;
        fctx.globalCompositeOperation = 'source-over';
    }

    let running = true;
    let lastT = 0;
    function loop(t) {
        if (!running) return;
        const dt = lastT ? t - lastT : 16.67;
        lastT = t;
        drawSky(t, dt);
        drawFx(dt);
        requestAnimationFrame(loop);
    }

    window.addEventListener('resize', () => resize(false));
    resize(true);
    if (!reduceMotion) requestAnimationFrame(loop);

    document.addEventListener('visibilitychange', () => {
        if (reduceMotion) return;
        if (document.hidden) running = false;
        else if (!running) { running = true; lastT = 0; requestAnimationFrame(loop); }
    });

    let lastSpark = 0;
    window.addEventListener('pointermove', (e) => {
        pointer.tx = (e.clientX / W - 0.5) * 2;
        pointer.ty = (e.clientY / H - 0.5) * 2;
        if (!reduceMotion && finePointer) {
            const now = performance.now();
            if (now - lastSpark > 28) {
                lastSpark = now;
                spawn(e.clientX, e.clientY, { count: 1, speed: 0.6, gravity: 0.03, size: 1.6, decay: 0.03, starChance: 0.5 });
            }
        }
    }, { passive: true });

    // API pública para el resto de scripts
    window.SiteFX = {
        reduceMotion,
        burst(x, y, opts = {}) {
            if (reduceMotion) return;
            if (!running) { running = true; lastT = 0; requestAnimationFrame(loop); }
            spawn(x, y, Object.assign({ count: 40, speed: 5, gravity: 0.06, size: 2.4, decay: 0.016 }, opts));
        },
        burstAt(el, opts) {
            if (!el) return;
            const r = el.getBoundingClientRect();
            this.burst(r.left + r.width / 2, r.top + r.height / 2, opts);
        }
    };

    // ---------- Cabecera, menú y apariciones ----------
    document.addEventListener('DOMContentLoaded', () => {
        const header = document.querySelector('.site-header');
        const onScroll = () => header && header.classList.toggle('is-scrolled', window.scrollY > 10);
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();

        const toggle = document.querySelector('.nav-toggle');
        if (toggle) {
            toggle.addEventListener('click', () => {
                const open = document.body.classList.toggle('nav-open');
                toggle.setAttribute('aria-expanded', String(open));
            });
            document.querySelectorAll('.site-nav a').forEach(a => a.addEventListener('click', () => {
                document.body.classList.remove('nav-open');
                toggle.setAttribute('aria-expanded', 'false');
            }));
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && document.body.classList.contains('nav-open')) {
                    document.body.classList.remove('nav-open');
                    toggle.setAttribute('aria-expanded', 'false');
                }
            });
        }

        // Marca el enlace de la página actual
        const here = location.pathname.split('/').pop() || 'index.html';
        document.querySelectorAll('.site-nav a').forEach(a => {
            if (a.getAttribute('href') === here) a.setAttribute('aria-current', 'page');
        });

        observeReveals(document);
    });

    const revealObserver = 'IntersectionObserver' in window
        ? new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' })
        : null;

    function observeReveals(root) {
        root.querySelectorAll('[data-reveal]:not(.is-visible)').forEach(el => {
            if (revealObserver) revealObserver.observe(el);
            else el.classList.add('is-visible');
        });
    }
    window.SiteFX && (window.SiteFX.observeReveals = observeReveals);
})();
