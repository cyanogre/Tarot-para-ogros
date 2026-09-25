// ==========================================================================
// Piezas visuales de la tirada: cartas, inclinación 3D, máquina de escribir
// y animación del ogro.
// ==========================================================================

const ROMAN = ['0', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX', 'XXI'];
const HAS_FINE_POINTER = window.matchMedia('(pointer: fine)').matches;
const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function escapeHTML(str) {
    return String(str).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function cardTopLabel(card) {
    if (card.type === 'major') {
        const idx = MAJOR_ARCANA.findIndex(c => c.name === card.name);
        return ROMAN[idx] ?? '';
    }
    if (card.court) return card.court;
    return card.number === 1 ? 'As' : String(card.number);
}

// Crea una carta boca abajo. Se revela con revealCard().
function createCardElement(card, { flat = false } = {}) {
    const el = document.createElement('div');
    el.className = 'tcard';
    if (card.type === 'major') el.classList.add('tcard--major');
    if (card.inverted) el.classList.add('tcard--inverted');
    el.setAttribute('role', 'button');
    el.setAttribute('tabindex', '-1');
    el.setAttribute('aria-label', 'Carta boca abajo');

    const accent = card.type === 'minor' && SUITS[card.suit] ? SUITS[card.suit].color : null;
    el.innerHTML = `
        <div class="tcard__inner">
            <div class="tcard__face tcard__back"></div>
            <div class="tcard__face tcard__front"${accent ? ` style="--accent:${accent}"` : ''}>
                <div class="tcard__frame">
                    <span class="tcard__num">${escapeHTML(cardTopLabel(card))}</span>
                    <span class="tcard__symbol">${card.symbol}</span>
                    <span class="tcard__name">${escapeHTML(card.name)}</span>
                </div>
                <span class="tcard__shine"></span>
            </div>
        </div>`;

    if (flat) setCardFlat(el, card);
    return el;
}

// Tras el giro, la carta pasa a un modo "plano" (sin 3D) que permite la
// inclinación con el ratón y que html2canvas pueda capturarla bien.
function setCardFlat(el, card) {
    el.classList.add('no-anim', 'is-flipped', 'is-flat');
    void el.offsetWidth;
    el.classList.remove('no-anim');
    el.setAttribute('tabindex', '0');
    el.setAttribute('aria-label', `${card.name}${card.inverted ? ' (invertida)' : ''}`);
    enableTilt(el);
}

function revealCard(el, card) {
    return new Promise(resolve => {
        el.classList.add('is-flipped', 'is-revealing');
        if (typeof playCardRevealSound === 'function') playCardRevealSound();
        setTimeout(() => {
            if (window.SiteFX) {
                const major = card.type === 'major';
                window.SiteFX.burstAt(el, major
                    ? { count: 70, speed: 7, size: 2.8, color: undefined }
                    : { count: 28, speed: 4.5, size: 2.2, color: '247,226,179' });
            }
        }, 320);
        setTimeout(() => {
            el.classList.remove('is-revealing');
            setCardFlat(el, card);
            resolve();
        }, REDUCED_MOTION ? 50 : 950);
    });
}

function enableTilt(el, strength = 14) {
    if (!HAS_FINE_POINTER || REDUCED_MOTION || el.dataset.tilt) return;
    el.dataset.tilt = '1';
    el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        el.style.setProperty('--ry', ((px - 0.5) * strength * 2).toFixed(2) + 'deg');
        el.style.setProperty('--rx', ((0.5 - py) * strength * 2).toFixed(2) + 'deg');
        el.style.setProperty('--mx', (px * 100).toFixed(1) + '%');
        el.style.setProperty('--my', (py * 100).toFixed(1) + '%');
    });
    el.addEventListener('pointerleave', () => {
        el.style.setProperty('--rx', '0deg');
        el.style.setProperty('--ry', '0deg');
        el.style.setProperty('--mx', '50%');
        el.style.setProperty('--my', '50%');
    });
}

// Animación FLIP: hace volar un elemento desde un rectángulo de origen a su sitio.
function flyFrom(el, fromRect, { rotate = 0, duration = 650 } = {}) {
    if (REDUCED_MOTION || !el.animate) return Promise.resolve();
    const to = el.getBoundingClientRect();
    const dx = fromRect.left + fromRect.width / 2 - (to.left + to.width / 2);
    const dy = fromRect.top + fromRect.height / 2 - (to.top + to.height / 2);
    const s = fromRect.width / to.width;
    const anim = el.animate([
        { transform: `translate(${dx}px, ${dy}px) rotate(${rotate}deg) scale(${s})` },
        { transform: `translate(${dx * 0.4}px, ${dy * 0.4 - 60}px) rotate(${rotate * 0.3}deg) scale(${(s + 1) / 2 * 1.1})`, offset: 0.55 },
        { transform: 'none' }
    ], { duration, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' });
    return anim.finished.catch(() => {});
}

// ---------- Máquina de escribir sobre HTML ----------
let typingJob = null;

function typeHTML(target, html, { cps = 90 } = {}) {
    finishTyping();
    target.innerHTML = html;
    if (REDUCED_MOTION) return Promise.resolve();

    // Recorremos texto y saltos de línea en orden; los <br> se ocultan hasta
    // llegar a ellos para que el bocadillo crezca a medida que se escribe.
    const walker = document.createTreeWalker(target, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
    const nodes = [];
    while (walker.nextNode()) {
        const n = walker.currentNode;
        if (n.nodeType === Node.TEXT_NODE) {
            nodes.push({ node: n, text: n.nodeValue });
            n.nodeValue = '';
        } else if (n.tagName === 'BR') {
            nodes.push({ node: n, br: true });
            n.style.display = 'none';
        }
    }
    const hint = document.createElement('span');
    hint.className = 'skip-hint';
    hint.textContent = 'Toca para leerlo de golpe';
    target.appendChild(hint);
    target.classList.add('is-typing');

    return new Promise(resolve => {
        let i = 0, pos = 0, last = performance.now(), carry = 0;
        const job = {
            finish() {
                nodes.forEach(n => { if (n.br) n.node.style.display = ''; else n.node.nodeValue = n.text; });
                hint.remove();
                target.classList.remove('is-typing');
                target.removeEventListener('click', job.finish);
                cancelAnimationFrame(job.raf);
                typingJob = null;
                resolve();
            }
        };
        target.addEventListener('click', job.finish);
        // Avance basado en el tiempo (caracteres por segundo), no en fotogramas
        const step = (now) => {
            carry += ((now - last) / 1000) * cps;
            last = now;
            let budget = Math.floor(carry);
            carry -= budget;
            while (budget > 0 && i < nodes.length) {
                const n = nodes[i];
                if (n.br) { n.node.style.display = ''; i++; budget--; continue; }
                const take = Math.min(budget, n.text.length - pos);
                pos += take; budget -= take;
                n.node.nodeValue = n.text.slice(0, pos);
                if (pos >= n.text.length) { i++; pos = 0; }
            }
            if (i >= nodes.length) job.finish();
            else job.raf = requestAnimationFrame(step);
        };
        typingJob = job;
        job.raf = requestAnimationFrame(step);
    });
}

function finishTyping() {
    if (typingJob) typingJob.finish();
}

// ---------- El ogro cobra vida (vídeo) ----------
function playOgreAnimation() {
    const ogreContainer = document.getElementById('ogre-container');
    const ogreImage = document.getElementById('ogre-image');
    if (!ogreContainer || !ogreImage) return;

    fadeAmbientVolume(0.2, 1.0);

    const ogreVideo = document.createElement('video');
    ogreVideo.src = 'Ogro.webm';
    ogreVideo.id = 'ogre-video';
    ogreVideo.autoplay = true;
    ogreVideo.muted = isMuted;
    ogreVideo.playsInline = true;
    ogreVideo.style.opacity = '0';
    ogreContainer.appendChild(ogreVideo);

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            ogreImage.style.opacity = '0';
            ogreVideo.style.opacity = '1';
        });
    });

    const restore = (volumeTime) => {
        fadeAmbientVolume(1.0, volumeTime);
        ogreVideo.style.opacity = '0';
        ogreImage.style.opacity = '1';
        setTimeout(() => ogreVideo.remove(), 300);
    };

    ogreVideo.addEventListener('ended', () => restore(1.5), { once: true });
    ogreVideo.play().catch(error => {
        console.error('Error al reproducir el video del ogro:', error);
        restore(0.5);
    });
}
