// ==========================================================================
// Tarot de Grum — efectos comunes a todas las páginas:
// cielo estrellado con parallax, estrellas fugaces, chispas del cursor,
// explosiones de partículas, menú móvil y apariciones al hacer scroll.
// ==========================================================================
(function () {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    const DPR = Math.min(window.devicePixelRatio || 1, 2);

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

    function resize() {
        W = window.innerWidth;
        H = window.innerHeight;
        [sky, fx].forEach(c => {
            c.width = W * DPR;
            c.height = H * DPR;
            c.style.width = W + 'px';
            c.style.height = H + 'px';
        });
        sctx.setTransform(DPR, 0, 0, DPR, 0, 0);
        fctx.setTransform(DPR, 0, 0, DPR, 0, 0);
        const count = Math.min(420, Math.round((W * H) / 4200));
        stars = Array.from({ length: count }, () => ({
            x: Math.random() * W,
            y: Math.random() * H,
            z: Math.random() * 0.9 + 0.1,          // profundidad (parallax)
            r: Math.random() * 1.3 + 0.2,
            tw: Math.random() * Math.PI * 2,       // fase del parpadeo
            ts: Math.random() * 0.02 + 0.004,      // velocidad del parpadeo
            c: STAR_COLORS[Math.random() < 0.7 ? 0 : Math.floor(Math.random() * STAR_COLORS.length)]
        }));
        if (reduceMotion) drawSky(0);
    }

    function drawSky(t) {
        sctx.clearRect(0, 0, W, H);
        const scroll = window.scrollY || 0;
        pointer.x += (pointer.tx - pointer.x) * 0.05;
        pointer.y += (pointer.ty - pointer.y) * 0.05;

        for (const s of stars) {
            s.tw += s.ts;
            const alpha = 0.35 + Math.sin(s.tw) * 0.35 + s.z * 0.3;
            let x = s.x - pointer.x * s.z * 18;
            let y = (s.y - scroll * s.z * 0.15 - pointer.y * s.z * 18) % H;
            if (y < 0) y += H;
            const r = s.r * (0.6 + s.z);
            sctx.beginPath();
            sctx.fillStyle = `rgba(${s.c},${Math.max(0, Math.min(1, alpha))})`;
            sctx.arc(x, y, r, 0, Math.PI * 2);
            sctx.fill();
            if (s.r > 1.25 && s.z > 0.7) {
                // Destello en cruz para las estrellas más brillantes
                sctx.strokeStyle = `rgba(${s.c},${alpha * 0.35})`;
                sctx.lineWidth = 0.6;
                sctx.beginPath();
                sctx.moveTo(x - r * 4, y); sctx.lineTo(x + r * 4, y);
                sctx.moveTo(x, y - r * 4); sctx.lineTo(x, y + r * 4);
                sctx.stroke();
            }
        }

        // Estrellas fugaces
        if (t > nextShot) {
            nextShot = t + 3500 + Math.random() * 6000;
            const fromLeft = Math.random() < 0.5;
            shooting.push({
                x: fromLeft ? Math.random() * W * 0.5 : W * 0.5 + Math.random() * W * 0.5,
                y: Math.random() * H * 0.4,
                vx: (fromLeft ? 1 : -1) * (7 + Math.random() * 5),
                vy: 3 + Math.random() * 2.5,
                life: 1
            });
        }
        shooting = shooting.filter(s => s.life > 0);
        for (const s of shooting) {
            s.x += s.vx; s.y += s.vy; s.life -= 0.012;
            const tail = 18;
            const grad = sctx.createLinearGradient(s.x, s.y, s.x - s.vx * tail, s.y - s.vy * tail);
            grad.addColorStop(0, `rgba(255,244,214,${s.life})`);
            grad.addColorStop(1, 'rgba(255,244,214,0)');
            sctx.strokeStyle = grad;
            sctx.lineWidth = 2;
            sctx.lineCap = 'round';
            sctx.beginPath();
            sctx.moveTo(s.x, s.y);
            sctx.lineTo(s.x - s.vx * tail, s.y - s.vy * tail);
            sctx.stroke();
            sctx.beginPath();
            sctx.fillStyle = `rgba(255,255,255,${s.life})`;
            sctx.arc(s.x, s.y, 1.8, 0, Math.PI * 2);
            sctx.fill();
        }
    }

    // ---------- Partículas (chispas del cursor y explosiones) ----------
    const SPARK_COLORS = ['247,226,179', '230,200,142', '169,210,255', '255,255,255', '214,196,255'];

    function spawn(x, y, opts = {}) {
        const n = opts.count || 1;
        for (let i = 0; i < n; i++) {
            const a = Math.random() * Math.PI * 2;
            const sp = (opts.speed || 1) * (Math.random() * 0.8 + 0.2);
            particles.push({
                x, y,
                vx: Math.cos(a) * sp + (opts.vx || 0),
                vy: Math.sin(a) * sp + (opts.vy || 0),
                g: opts.gravity ?? 0.02,
                life: 1,
                decay: opts.decay || (0.012 + Math.random() * 0.02),
                r: (opts.size || 2) * (Math.random() * 0.7 + 0.5),
                c: opts.color || SPARK_COLORS[Math.floor(Math.random() * SPARK_COLORS.length)],
                star: Math.random() < (opts.starChance ?? 0.35)
            });
        }
    }

    function drawStarShape(ctx, x, y, r) {
        ctx.beginPath();
        for (let i = 0; i < 8; i++) {
            const rad = i % 2 === 0 ? r * 2.4 : r * 0.55;
            const a = (i * Math.PI) / 4;
            ctx.lineTo(x + Math.cos(a) * rad, y + Math.sin(a) * rad);
        }
        ctx.closePath();
        ctx.fill();
    }

    function drawFx() {
        fctx.clearRect(0, 0, W, H);
        if (!particles.length) return;
        fctx.globalCompositeOperation = 'lighter';
        particles = particles.filter(p => p.life > 0);
        for (const p of particles) {
            p.x += p.vx; p.y += p.vy; p.vy += p.g;
            p.vx *= 0.985; p.vy *= 0.985;
            p.life -= p.decay;
            const a = Math.max(0, p.life);
            fctx.fillStyle = `rgba(${p.c},${a})`;
            fctx.shadowColor = `rgba(${p.c},${a})`;
            fctx.shadowBlur = 8;
            if (p.star) drawStarShape(fctx, p.x, p.y, p.r * a);
            else {
                fctx.beginPath();
                fctx.arc(p.x, p.y, p.r * a, 0, Math.PI * 2);
                fctx.fill();
            }
        }
        fctx.shadowBlur = 0;
        fctx.globalCompositeOperation = 'source-over';
    }

    let running = true;
    function loop(t) {
        if (!running) return;
        drawSky(t);
        drawFx();
        requestAnimationFrame(loop);
    }

    window.addEventListener('resize', resize);
    resize();
    if (!reduceMotion) requestAnimationFrame(loop);

    document.addEventListener('visibilitychange', () => {
        if (reduceMotion) return;
        if (document.hidden) running = false;
        else if (!running) { running = true; requestAnimationFrame(loop); }
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
            if (!running) { running = true; requestAnimationFrame(loop); }
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
