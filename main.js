// ==========================================================================
// Tarot de Grum — flujo de la tirada
// idle → shuffling → picking → revealing → done
// ==========================================================================

const COOKIE_CONSENT_KEY = 'cookie_consent_ogre_tarot';
const HISTORY_KEY = 'grum_grimoire';
const DAILY_KEY = 'grum_daily_card';
const PROXY_URL = '/.netlify/functions/api-proxy';
const HISTORY_MAX = 12;

const state = {
    phase: 'idle',
    deck: [],
    fanMap: [],
    positions: [],
    reading: [],
    slots: [],
    cardEls: [],
    ogreText: ''
};
// Compatibilidad con el código de compartir
let currentReading = [];

const $ = (id) => document.getElementById(id);
const wait = (ms) => new Promise(r => setTimeout(r, REDUCED_MOTION ? Math.min(ms, 60) : ms));

const store = {
    get(key, fallback) {
        try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
        catch (e) { return fallback; }
    },
    set(key, value) {
        try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* sin almacenamiento */ }
    }
};

// Disposición de cada tirada: grid-area de cada posición (fila / columna)
const LAYOUTS = {
    1: ['1 / 1'],
    3: ['1 / 1', '1 / 2', '1 / 3'],
    5: ['2 / 2', '1 / 2', '2 / 1', '2 / 3', '3 / 2'],
    10: [
        '4 / 2 / span 2 / span 1', '4 / 2 / span 2 / span 1', '4 / 1 / span 2 / span 1', '4 / 3 / span 2 / span 1',
        '2 / 2 / span 2 / span 1', '6 / 2 / span 2 / span 1',
        '7 / 5 / span 2 / span 1', '5 / 5 / span 2 / span 1', '3 / 5 / span 2 / span 1', '1 / 5 / span 2 / span 1'
    ]
};

const GRUM_QUIPS = [
    '¡Eh! Que los cuernos no son para colgar el abrigo.',
    'Las cartas no mienten. Yo a veces, pero ellas no.',
    '¿Otra vez tú? Bueno, venga, baraja.',
    'Llevo 300 años leyendo el tarot y aún me sorprende la Torre.',
    'Si sale la Muerte no te asustes. Casi nunca es literal. Casi.',
    'Mi carta favorita es la Luna. Se parece a mi humor.',
    'No me hagas cosquillas, criatura, que muerdo.',
    'El destino es como un pantano: mejor cruzarlo con botas.',
    'Hoy huele a Copas. O a sopa. No sé, tengo hambre.',
    'Pregúntame algo de verdad. Lo de la lotería no funciona.',
    'Pssst… el Loco siempre tiene la mejor pinta de la baraja.',
    '¡Grrr! Vale, vale. Una tirada. Pero luego me dejas dormir.'
];

// ==========================================================================
// Inicio
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    if (typeof injectGrumStyles === 'function') injectGrumStyles();

    $('ritualForm').addEventListener('submit', (e) => { e.preventDefault(); startReading(); });
    $('deck').addEventListener('click', () => startReading());
    $('newReadingBtn').addEventListener('click', () => startReading());
    $('randomPickBtn').addEventListener('click', autoPick);
    $('exportBtn').addEventListener('click', exportReading);
    $('muteBtn').addEventListener('click', toggleMute);
    $('dailyBtn').addEventListener('click', showDailyCard);
    $('clearHistoryBtn').addEventListener('click', clearHistory);
    $('heroStartBtn').addEventListener('click', () => {
        setTimeout(() => $('userQuestion').focus({ preventScroll: true }), 700);
    });
    $('userQuestion').addEventListener('input', updateQuestionEcho);

    document.querySelectorAll('button:not(#deck):not(#muteBtn)').forEach(el => {
        el.addEventListener('click', () => playClickSound());
    });

    setupHero();
    setupLightbox();
    setupShare();
    renderHistory();
    applyStoredMute();
    checkCookieConsent();
    setupPrivacyModal();
});

function updateQuestionEcho() {
    const q = $('userQuestion').value.trim();
    $('questionEcho').textContent = q ? `«${q}»` : 'Concéntrate en tu pregunta… o deja que el cosmos hable.';
}

// ==========================================================================
// Portada: Grum reacciona
// ==========================================================================
function setupHero() {
    const stage = $('heroStage');
    const ogre = $('heroOgre');
    const quip = $('heroQuip');
    let last = -1;

    ogre.addEventListener('click', () => {
        let i;
        do { i = Math.floor(Math.random() * GRUM_QUIPS.length); } while (i === last && GRUM_QUIPS.length > 1);
        last = i;
        quip.classList.add('is-new');
        quip.textContent = GRUM_QUIPS[i];
        void quip.offsetWidth;
        quip.classList.remove('is-new');
        ogre.classList.remove('is-grumpy');
        void ogre.offsetWidth;
        ogre.classList.add('is-grumpy');
        if (window.SiteFX) window.SiteFX.burstAt(ogre, { count: 30, speed: 5, color: '169,210,255' });
    });

    if (HAS_FINE_POINTER && !REDUCED_MOTION) {
        window.addEventListener('pointermove', (e) => {
            stage.style.setProperty('--px', ((e.clientX / window.innerWidth) - 0.5) * 2);
            stage.style.setProperty('--py', ((e.clientY / window.innerHeight) - 0.5) * 2);
        }, { passive: true });
    }
}

// ==========================================================================
// Mazo
// ==========================================================================
function createDeck(majorOnly = false) {
    let deck = MAJOR_ARCANA.map(c => ({ ...c }));
    if (!majorOnly) {
        Object.entries(SUITS).forEach(([suitName, suitData]) => {
            for (let i = 1; i <= 10; i++) {
                const cardName = i === 1 ? 'As' : i.toString();
                deck.push({ name: `${cardName} de ${suitName}`, symbol: suitData.symbol, type: 'minor', suit: suitName, number: i });
            }
            COURT_CARDS.forEach(courtCard => {
                deck.push({ name: `${courtCard} de ${suitName}`, symbol: suitData.symbol, type: 'minor', suit: suitName, court: courtCard });
            });
        });
    }
    return deck;
}

function shuffleDeck(deck) {
    const shuffled = [...deck];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function getSpreadPositions(spreadType) {
    const positions = {
        1: ['Respuesta'],
        3: ['Pasado', 'Presente', 'Futuro'],
        5: ['Situación actual', 'Desafío', 'Pasado', 'Futuro', 'Resultado'],
        10: ['Situación actual', 'Desafío/Cruz', 'Pasado lejano', 'Futuro posible',
             'Corona/Meta', 'Fundación', 'Tu enfoque', 'Entorno externo',
             'Esperanzas y miedos', 'Resultado final']
    };
    return positions[spreadType] || positions[1];
}

function readOptions() {
    const deckType = document.querySelector('input[name="deckType"]:checked')?.value || 'full';
    const spreadType = parseInt(document.querySelector('input[name="spreadType"]:checked')?.value || '3', 10);
    return { deckType, spreadType };
}

function getInterpretation(card, inverted) {
    const data = getCardData(card);
    if (!data) return 'No se encontró interpretación para esta carta.';
    return inverted ? data.reversed : data.upright;
}

function getCardData(card) {
    if (card.type === 'major') return INTERPRETATIONS[card.name] || null;
    const suit = MINOR_INTERPRETATIONS[card.suit];
    const key = card.number ? (card.number === 1 ? 'As' : String(card.number)) : card.court;
    return suit && suit[key] ? suit[key] : null;
}

// ==========================================================================
// 1. Barajar
// ==========================================================================
async function startReading() {
    if (state.phase === 'shuffling' || state.phase === 'revealing') return;
    if (state.phase === 'picking') { resetTable(); }
    setupAudio();

    const { deckType, spreadType } = readOptions();
    state.phase = 'shuffling';
    state.positions = getSpreadPositions(spreadType);
    state.reading = [];
    currentReading = [];
    state.ogreText = '';

    resetTable();
    $('ritualForm').classList.add('is-locked');
    $('shuffleBtn').disabled = true;
    $('shuffleBtn').innerHTML = '<span class="spinner"></span> Barajando…';
    setStatus('Grum baraja con sus manazas…');
    updateQuestionEcho();
    buildSlots(spreadType);

    $('tapete').scrollIntoView({ behavior: REDUCED_MOTION ? 'auto' : 'smooth', block: 'start' });

    playShuffleSound();
    await shuffleAnimation();

    let deck = shuffleDeck(createDeck(deckType === 'major'));
    const cut = Math.floor(Math.random() * deck.length);
    deck = [...deck.slice(cut), ...deck.slice(0, cut)];
    deck.forEach(c => { c.inverted = Math.random() < 0.5; });
    state.deck = deck;

    openFan();
}

function resetTable() {
    finishTyping();
    const fan = $('fan');
    fan.innerHTML = '';
    fan.classList.remove('is-open', 'is-leaving');
    $('deck-area').classList.remove('is-collapsed', 'is-fanning');
    $('deck').classList.remove('is-hidden');
    $('pickProgress').hidden = true;
    $('pickBar').style.width = '0';
    $('spreadContainer').innerHTML = '';
    $('spreadContainer').className = 'spread';
    $('grumSays').hidden = true;
    $('results').hidden = true;
    $('readingActions').hidden = true;
    $('ritualForm').classList.remove('is-locked');
    $('shuffleBtn').disabled = false;
    $('shuffleBtn').innerHTML = '🔮 Barajar el mazo';
}

async function shuffleAnimation() {
    const container = $('shuffling-container');
    const deck = $('deck');
    if (REDUCED_MOTION || !Element.prototype.animate) { await wait(300); return; }

    deck.classList.add('is-hidden');
    const cards = Array.from({ length: 14 }, (_, i) => {
        const c = document.createElement('div');
        c.className = 'shuffling-card';
        c.style.zIndex = i;
        container.appendChild(c);
        return c;
    });

    const riffle = async () => {
        await Promise.all(cards.map((c, i) => c.animate([
            { transform: 'none' },
            { transform: `translate(${i % 2 ? 78 : -78}px, ${-i}px) rotate(${i % 2 ? 10 : -10}deg)` }
        ], { duration: 320, delay: i * 12, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'forwards' }).finished));
        await Promise.all(cards.map((c, i) => c.animate([
            { transform: `translate(${i % 2 ? 78 : -78}px, ${-i}px) rotate(${i % 2 ? 10 : -10}deg)` },
            { transform: `translate(0, ${-i * 0.6 - 30}px) rotate(${(i % 2 ? 1 : -1) * 3}deg)`, offset: 0.6 },
            { transform: `translate(0, ${-i * 0.5}px)` }
        ], { duration: 420, delay: (cards.length - i) * 22, easing: 'cubic-bezier(.34,1.3,.64,1)', fill: 'forwards' }).finished));
    };

    await riffle();
    await riffle();
    // Puente final: las cartas saltan en arco
    await Promise.all(cards.map((c, i) => c.animate([
        { transform: `translate(0, ${-i * 0.5}px)` },
        { transform: `translate(${(i - 7) * 7}px, ${-60 - Math.abs(i - 7) * -3}px) rotate(${(i - 7) * 5}deg)`, offset: 0.5 },
        { transform: 'none' }
    ], { duration: 650, delay: i * 18, easing: 'ease-in-out', fill: 'forwards' }).finished));

    cards.forEach(c => c.remove());
    deck.classList.remove('is-hidden');
}

// ==========================================================================
// 2. Elegir cartas del abanico
// ==========================================================================
function openFan() {
    state.phase = 'picking';
    const fan = $('fan');
    const zone = $('deck-area');
    const mobile = window.innerWidth < 720;
    const count = Math.min(state.deck.length, mobile ? 15 : (state.deck.length <= 22 ? 22 : 30));
    const width = fan.clientWidth || 320;

    const cw = mobile ? 58 : 80;
    const ch = cw * 1.5;
    const spanDeg = mobile ? 96 : Math.min(84, 40 + width / 22);
    const half = (spanDeg / 2) * Math.PI / 180;
    const radius = (width * (mobile ? 0.34 : 0.42)) / Math.sin(half);
    const drop = radius * (1 - Math.cos(half));

    fan.style.setProperty('--fan-cw', cw + 'px');
    fan.style.setProperty('--fan-origin', ((ch + radius) / ch * 100).toFixed(1) + '%');
    fan.style.setProperty('--fan-bottom', drop.toFixed(0) + 'px');
    fan.style.setProperty('--fan-h', (drop + ch + 40).toFixed(0) + 'px');
    zone.style.setProperty('--fan-hollow', Math.max(0, drop - 40).toFixed(0) + 'px');

    // Cada carta del abanico apunta a una carta del mazo barajado
    state.fanMap = Array.from({ length: count }, (_, i) => i);
    fan.innerHTML = '';
    state.fanMap.forEach((deckIdx, i) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'fan-card';
        b.dataset.idx = deckIdx;
        const rot = count === 1 ? 0 : -spanDeg / 2 + (spanDeg * i) / (count - 1);
        b.style.setProperty('--rot', rot.toFixed(2) + 'deg');
        b.style.setProperty('--i', i);
        b.setAttribute('aria-label', `Carta ${i + 1} del abanico`);
        b.addEventListener('click', () => pickCard(b));
        fan.appendChild(b);
    });

    zone.classList.add('is-fanning');
    $('deck').classList.add('is-hidden');
    requestAnimationFrame(() => requestAnimationFrame(() => fan.classList.add('is-open')));

    $('shuffleBtn').disabled = false;
    $('shuffleBtn').innerHTML = '🔄 Volver a barajar';
    $('ritualForm').classList.remove('is-locked');
    $('pickProgress').hidden = false;
    updatePickStatus();
}

function updatePickStatus() {
    const n = state.positions.length;
    const done = state.reading.length;
    $('pickBar').style.width = `${(done / n) * 100}%`;
    state.slots.forEach((s, i) => s.classList.toggle('is-next', i === done));
    if (done < n) {
        const pos = state.positions[done];
        setStatus(n === 1
            ? 'Deja que tu mano elija <strong>una carta</strong>.'
            : `Elige la carta para <strong>${escapeHTML(pos)}</strong> · ${done + 1} de ${n}`);
    }
}

async function pickCard(btn) {
    if (state.phase !== 'picking' || btn.classList.contains('is-picked')) return;
    if (state.reading.length >= state.positions.length) return;

    const card = state.deck[Number(btn.dataset.idx)];
    const i = state.reading.length;
    const position = state.positions[i];
    state.reading.push({ card, position });

    const fromRect = btn.getBoundingClientRect();
    const rot = parseFloat(btn.style.getPropertyValue('--rot')) || 0;
    btn.classList.add('is-picked');

    const slot = state.slots[i];
    const place = slot.querySelector('.slot__place');
    const el = createCardElement(card);
    place.appendChild(el);
    slot.classList.add('is-filled');
    state.cardEls[i] = el;

    playCardRevealSound();
    updatePickStatus();
    await flyFrom(el, fromRect, { rotate: rot - (slot.classList.contains('slot--cross') ? 90 : 0) });

    if (state.reading.length === state.positions.length && state.phase === 'picking') {
        finishPicking();
    }
}

async function autoPick() {
    if (state.phase !== 'picking') return;
    $('randomPickBtn').disabled = true;
    const available = Array.from(document.querySelectorAll('.fan-card:not(.is-picked)'));
    const need = state.positions.length - state.reading.length;
    const chosen = shuffleDeck(available).slice(0, need);
    for (const b of chosen) {
        if (state.phase !== 'picking') break;
        pickCard(b);
        await wait(260);
    }
    $('randomPickBtn').disabled = false;
}

function buildSlots(spreadType) {
    const container = $('spreadContainer');
    container.className = `spread spread--${spreadType}`;
    container.innerHTML = '';
    state.slots = [];
    state.cardEls = [];
    const areas = LAYOUTS[spreadType] || LAYOUTS[1];
    state.positions.forEach((pos, i) => {
        const slot = document.createElement('div');
        slot.className = 'slot';
        if (spreadType === 10 && i === 1) slot.classList.add('slot--cross');
        slot.style.gridArea = areas[i];
        if (spreadType === 10) slot.style.alignSelf = 'center';
        slot.innerHTML = `<div class="slot__place" data-n="${i + 1}"></div><div class="slot__label" title="${escapeHTML(pos)}"><span class="slot__num">${i + 1}</span><span class="slot__text">${escapeHTML(pos)}</span></div>`;
        container.appendChild(slot);
        state.slots.push(slot);
    });
}

// ==========================================================================
// 3. Revelar
// ==========================================================================
async function finishPicking() {
    state.phase = 'revealing';
    currentReading = state.reading;
    $('pickProgress').hidden = true;
    $('shuffleBtn').disabled = true;
    $('ritualForm').classList.add('is-locked');
    state.slots.forEach(s => s.classList.remove('is-next'));
    setStatus('El destino está echado. Veamos qué dicen…');

    const fan = $('fan');
    fan.classList.add('is-leaving');
    await wait(600);
    $('deck-area').classList.add('is-collapsed');
    await wait(300);

    const reveals = state.reading.map((r, i) => wait(i * 520).then(() => revealCard(state.cardEls[i], r.card)));
    await Promise.all(reveals);

    state.cardEls.forEach((el, i) => {
        el.addEventListener('click', () => openLightbox(state.reading[i].card, { position: state.reading[i].position }));
        el.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); el.click(); } });
    });

    state.phase = 'done';
    $('ritualForm').classList.remove('is-locked');
    $('shuffleBtn').disabled = false;
    $('shuffleBtn').innerHTML = '🔮 Nueva tirada';

    showResults();
    saveHistory();
    renderHistory();
    getOgreInterpretation(state.reading);
}

function setStatus(html) {
    $('deckStatus').innerHTML = html;
}

// ==========================================================================
// 4. Resultados
// ==========================================================================
function showResults() {
    const list = $('resultsContent');
    list.innerHTML = '';
    state.reading.forEach((r, i) => {
        const data = getCardData(r.card);
        const item = document.createElement('article');
        item.className = 'result-item';
        item.setAttribute('data-reveal', '');
        item.style.setProperty('--reveal-delay', `${i * 0.06}s`);
        item.innerHTML = `
            <div class="result-item__thumb"></div>
            <div>
                <span class="result-item__pos">${i + 1} · ${escapeHTML(r.position)}</span>
                <h3>${escapeHTML(r.card.name)} <small class="${r.card.inverted ? 'orientation-tag' : ''}">${r.card.inverted ? '· invertida' : '· al derecho'}</small></h3>
                ${data && data.keyword ? `<span class="keyword">${escapeHTML(data.keyword)}</span>` : ''}
                <p>${escapeHTML(getInterpretation(r.card, r.card.inverted))}</p>
            </div>`;
        const thumb = createCardElement(r.card, { flat: true });
        thumb.setAttribute('tabindex', '-1');
        item.querySelector('.result-item__thumb').appendChild(thumb);
        item.addEventListener('click', () => openLightbox(r.card, { position: r.position }));
        list.appendChild(item);
    });
    $('results').hidden = false;
    $('readingActions').hidden = false;
    if (window.SiteFX && window.SiteFX.observeReveals) window.SiteFX.observeReveals($('results'));
}

// ==========================================================================
// 5. Grum interpreta
// ==========================================================================
async function getOgreInterpretation(reading) {
    const grumSays = $('grumSays');
    const ogreBubble = $('ogre-interpretation');
    grumSays.hidden = false;
    ogreBubble.innerHTML = '<span class="spinner"></span> Grum está consultando el cosmos…';
    setTimeout(() => grumSays.scrollIntoView({ behavior: REDUCED_MOTION ? 'auto' : 'smooth', block: 'center' }), 200);

    playOgreAnimation();

    const userQuestion = $('userQuestion').value.trim();
    const readingSummary = reading.map(item =>
        `${item.position}: ${item.card.name} (${item.card.inverted ? 'Invertida' : 'Derecha'})`
    ).join(', ');

    const systemPrompt = "Actúa como un ogro místico, sabio, gruñón pero con un corazón de oro. Te llamas Grum. Interpreta la siguiente tirada de tarot de una forma muy coloquial, directa y con un toque de humor de ogro. Tu respuesta debe ser HTML. Usa `<br>` para saltos de línea y `<b>` para negritas. Para las palabras clave importantes, envuélvelas en `<span class=\"grum-keyword\">`. No uses adjetivos de género, llama al consultante 'criatura', 'humano' o similar. Si hay una pregunta específica, respóndela usando las cartas.";
    const specificQuestionText = userQuestion
        ? ` La criatura pregunta específicamente: "${userQuestion}". Concéntrate en responder a eso usando las cartas.`
        : ' La criatura no ha preguntado nada en concreto, diles lo que necesitan saber.';
    const userQuery = `Grum, mi tirada es: ${readingSummary}.${specificQuestionText} ¿Qué ves tú, grandullón?`;

    let html;
    try {
        const payload = { contents: [{ parts: [{ text: `${systemPrompt}\n\n${userQuery}` }] }] };
        const response = await fetch(PROXY_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Error de la API: ${response.status} ${response.statusText}. Detalles: ${errorBody}`);
        }
        const result = await response.json();
        const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) throw new Error('Respuesta de la API recibida pero sin texto.');
        html = text.replace(/^\s*```(?:html)?\s*/i, '').replace(/\s*```\s*$/, '');
    } catch (error) {
        console.error('Error al contactar con el Ogro, usando fallback:', error);
        html = '¡Argh! Mis visiones se han nublado. Pero un ogro siempre tiene un plan B. Esto es lo que veo, sin rodeos:<br><br>';
        reading.forEach(item => {
            const card = item.card;
            const f = OGRE_FALLBACKS[card.name];
            const text = f ? (card.inverted ? f.reversed : f.upright) : 'Esta carta es un misterio hasta para mí.';
            html += `<b>${escapeHTML(item.position)} (${escapeHTML(card.name)}${card.inverted ? ', Invertida' : ''}):</b> ${text}<br><br>`;
        });
    }
    state.ogreText = html;
    typeHTML(ogreBubble, html, { cps: 90 });
}

// ==========================================================================
// Lightbox: carta ampliada y carta del día
// ==========================================================================
function setupLightbox() {
    const lb = $('lightbox');
    $('lightboxClose').addEventListener('click', closeLightbox);
    lb.addEventListener('click', (e) => { if (e.target === lb) closeLightbox(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !lb.hidden) closeLightbox(); });
}

function openLightbox(card, { position = '', eyebrow = '', flip = false } = {}) {
    const lb = $('lightbox');
    const holder = $('lightboxCard');
    holder.innerHTML = '';
    const el = createCardElement(card, { flat: !flip });
    holder.appendChild(el);
    enableTilt(el, 18);

    const data = getCardData(card);
    const fallback = OGRE_FALLBACKS[card.name];
    $('lightboxEyebrow').textContent = eyebrow || (position ? `✦ ${position}` : '✦ Carta');
    $('lightboxTitle').textContent = card.name;
    $('lightboxMeta').textContent = [card.inverted ? 'Invertida' : 'Al derecho', data && data.keyword].filter(Boolean).join(' · ');
    $('lightboxText').textContent = getInterpretation(card, card.inverted);
    $('lightboxOgre').innerHTML = fallback ? `Grum dice: ${card.inverted ? fallback.reversed : fallback.upright}` : '';

    lb.hidden = false;
    document.body.style.overflow = 'hidden';
    $('lightboxClose').focus({ preventScroll: true });
    if (flip) setTimeout(() => revealCard(el, card), 500);
}

function closeLightbox() {
    $('lightbox').hidden = true;
    document.body.style.overflow = '';
}

function todayKey() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function showDailyCard() {
    setupAudio();
    const today = todayKey();
    const deck = createDeck(false);
    let saved = store.get(DAILY_KEY, null);
    let fresh = false;
    if (!saved || saved.date !== today || !deck.some(c => c.name === saved.name)) {
        const c = deck[Math.floor(Math.random() * deck.length)];
        saved = { date: today, name: c.name, inverted: Math.random() < 0.3 };
        store.set(DAILY_KEY, saved);
        fresh = true;
    }
    const card = { ...deck.find(c => c.name === saved.name), inverted: saved.inverted };
    openLightbox(card, {
        eyebrow: fresh ? '✦ Tu carta de hoy' : '✦ Tu carta de hoy (vuelve mañana para otra)',
        flip: true
    });
}

// ==========================================================================
// Grimorio (historial local)
// ==========================================================================
function saveHistory() {
    const history = store.get(HISTORY_KEY, []);
    history.unshift({
        date: new Date().toISOString(),
        question: $('userQuestion').value.trim(),
        cards: state.reading.map(r => ({ name: r.card.name, symbol: r.card.symbol, type: r.card.type, inverted: !!r.card.inverted, position: r.position }))
    });
    store.set(HISTORY_KEY, history.slice(0, HISTORY_MAX));
}

function renderHistory() {
    const history = store.get(HISTORY_KEY, []);
    const section = $('grimorio');
    const list = $('historyList');
    if (!Array.isArray(history) || !history.length) { section.hidden = true; return; }
    section.hidden = false;
    const fmt = new Intl.DateTimeFormat('es', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });
    list.innerHTML = history.map(h => `
        <li class="grimoire__item">
            <div class="grimoire__date">${escapeHTML(fmt.format(new Date(h.date)))} · ${h.cards.length} ${h.cards.length === 1 ? 'carta' : 'cartas'}</div>
            <p class="grimoire__q">${h.question ? `«${escapeHTML(h.question)}»` : 'Sin pregunta: que hable el cosmos'}</p>
            <div class="grimoire__cards">
                ${h.cards.map(c => `<span class="grimoire__chip${c.type === 'major' ? ' grimoire__chip--major' : ''}${c.inverted ? ' grimoire__chip--inv' : ''}" title="${escapeHTML(c.position)}">${c.symbol} ${escapeHTML(c.name)}${c.inverted ? ' ↺' : ''}</span>`).join('')}
            </div>
        </li>`).join('');
}

function clearHistory() {
    if (!confirm('¿Seguro que quieres que Grum queme tu grimorio?')) return;
    store.set(HISTORY_KEY, []);
    renderHistory();
}

// ==========================================================================
// Sonido
// ==========================================================================
function applyStoredMute() {
    if (store.get('grum_muted', false) && !isMuted) toggleMute();
}

// ==========================================================================
// Exportar y compartir
// ==========================================================================
async function captureReading() {
    finishTyping();
    const el = $('reading-snapshot');
    return html2canvas(el, {
        backgroundColor: '#0e0822',
        useCORS: true,
        scale: 2,
        onclone: (doc) => {
            const snap = doc.getElementById('reading-snapshot');
            snap.classList.add('is-exporting');
            const title = snap.querySelector('.section-head h2');
            if (title) title.textContent = 'Mi tirada con Grum';
            const eyebrow = snap.querySelector('.section-head .eyebrow');
            if (eyebrow) eyebrow.textContent = `✦ ${new Date().toLocaleDateString('es', { day: 'numeric', month: 'long', year: 'numeric' })}`;
        }
    });
}

async function exportReading() {
    const exportBtn = $('exportBtn');
    exportBtn.disabled = true;
    exportBtn.innerHTML = '<span class="spinner"></span> Pintando…';
    try {
        const canvas = await captureReading();
        const link = document.createElement('a');
        link.download = 'mi-tirada-tarot-ogro.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    } catch (error) {
        console.error('Error al exportar la imagen:', error);
        alert('Hubo un problema al exportar la imagen.');
    } finally {
        exportBtn.disabled = false;
        exportBtn.innerHTML = '📸 Guardar imagen';
    }
}

async function generateShareImage() {
    try {
        const canvas = await captureReading();
        return new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
    } catch (error) {
        console.error('Error al generar imagen:', error);
        return null;
    }
}

function generateReadingText() {
    const cards = currentReading.map(r =>
        `${r.position}: ${r.card.name} (${r.card.inverted ? 'Invertida' : 'Derecha'})`
    ).join(', ');
    return `Acabo de consultar el Tarot del Ogro Azul 🔮\n\nMi tirada: ${cards}\n\n¿Quieres saber qué te depara el destino?`;
}

async function shareWithWebAPI() {
    const shareText = generateReadingText();
    const shareUrl = window.location.href.split('#')[0];
    try {
        const imageBlob = await generateShareImage();
        if (navigator.share) {
            if (imageBlob && navigator.canShare) {
                const file = new File([imageBlob], 'mi-tirada-tarot-ogro.png', { type: 'image/png' });
                const shareData = { title: '🔮 Mi Tirada de Tarot', text: shareText, url: shareUrl, files: [file] };
                if (navigator.canShare(shareData)) { await navigator.share(shareData); return true; }
            }
            await navigator.share({ title: '🔮 Mi Tirada de Tarot', text: shareText, url: shareUrl });
            return true;
        }
        return false;
    } catch (err) {
        if (err.name !== 'AbortError') console.log('Error al compartir:', err);
        return false;
    }
}

function downloadBlob(blob) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'mi-tirada-tarot-ogro.png';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function downloadAndShareToSocial(platform) {
    // Abrimos la ventana antes de esperar a la imagen para que el navegador no la bloquee
    const shareUrl = window.location.href.split('#')[0];
    const shareText = generateReadingText();
    const urls = {
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`,
        whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText + '\n' + shareUrl)}`,
        telegram: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`
    };
    if (urls[platform]) window.open(urls[platform], '_blank', 'noopener');

    const imageBlob = await generateShareImage();
    if (imageBlob) {
        downloadBlob(imageBlob);
        showDownloadMessage(platform);
    }
}

function showDownloadMessage(platform) {
    const names = { twitter: 'Twitter/X', facebook: 'Facebook', whatsapp: 'WhatsApp', telegram: 'Telegram' };
    const modalContent = document.querySelector('.share-modal-content');
    modalContent.querySelector('.download-message')?.remove();
    const messageDiv = document.createElement('div');
    messageDiv.className = 'download-message';
    messageDiv.innerHTML = `<p>✅ Imagen descargada</p><p style="font-size:.9rem;margin-top:6px;font-weight:400">Ahora puedes subirla a ${names[platform] || 'tu red favorita'}.</p>`;
    modalContent.insertBefore(messageDiv, modalContent.querySelector('.share-buttons'));
    setTimeout(() => {
        messageDiv.style.animation = 'fadeOut 0.5s ease-out forwards';
        setTimeout(() => messageDiv.remove(), 500);
    }, 4000);
}

function setupShare() {
    const modal = $('share-modal');
    const close = () => { modal.style.display = 'none'; };

    $('shareBtn').addEventListener('click', () => {
        modal.style.display = 'flex';
        $('share-native').style.display = navigator.share ? 'flex' : 'none';
    });
    $('close-share-modal').addEventListener('click', close);
    modal.addEventListener('click', (e) => { if (e.target === modal) close(); });

    $('share-native').addEventListener('click', async () => { if (await shareWithWebAPI()) close(); });
    ['twitter', 'facebook', 'whatsapp', 'telegram'].forEach(p => {
        $(`share-${p}`).addEventListener('click', (e) => { e.preventDefault(); downloadAndShareToSocial(p); });
    });

    $('download-only').addEventListener('click', async (e) => {
        const btn = e.currentTarget;
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<span class="spinner"></span> Descargando…';
        btn.disabled = true;
        const blob = await generateShareImage();
        if (blob) {
            downloadBlob(blob);
            btn.innerHTML = '<span>✅</span> Descargada';
            setTimeout(() => { btn.innerHTML = originalHTML; btn.disabled = false; }, 2000);
        } else {
            btn.innerHTML = originalHTML;
            btn.disabled = false;
        }
    });

    $('copy-link').addEventListener('click', async () => {
        const shareUrl = window.location.href.split('#')[0];
        const btn = $('copy-link');
        try {
            await navigator.clipboard.writeText(shareUrl);
            const originalHTML = btn.innerHTML;
            btn.innerHTML = '<span>✅</span> ¡Copiado!';
            setTimeout(() => { btn.innerHTML = originalHTML; }, 2000);
        } catch (err) {
            alert('No se pudo copiar el enlace. Por favor, cópialo manualmente: ' + shareUrl);
        }
    });
}

// ==========================================================================
// Cookies, privacidad y analítica
// ==========================================================================
function checkCookieConsent() {
    let consent = null;
    try { consent = localStorage.getItem(COOKIE_CONSENT_KEY); } catch (e) { /* sin almacenamiento */ }
    if (consent === 'granted') {
        loadGoogleAnalytics();
    } else if (consent !== 'denied') {
        $('cookie-banner').style.display = 'flex';
    }
}

function handleCookieConsent(consent) {
    try { localStorage.setItem(COOKIE_CONSENT_KEY, consent); } catch (e) { /* sin almacenamiento */ }
    $('cookie-banner').style.display = 'none';
    if (consent === 'granted') loadGoogleAnalytics();
}

function setupPrivacyModal() {
    const privacyModal = $('privacy-modal');
    const open = (e) => { e.preventDefault(); privacyModal.style.display = 'flex'; };
    $('privacy-policy-link').addEventListener('click', open);
    $('privacy-link-banner').addEventListener('click', open);
    $('modal-close').addEventListener('click', () => { privacyModal.style.display = 'none'; });
    privacyModal.addEventListener('click', (e) => { if (e.target === privacyModal) privacyModal.style.display = 'none'; });
    $('cookie-accept').addEventListener('click', () => handleCookieConsent('granted'));
    $('cookie-decline').addEventListener('click', () => handleCookieConsent('denied'));
}

function loadGoogleAnalytics() {
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-ZFDC8MXKCV';
    document.head.appendChild(script);
    script.onload = () => {
        window.dataLayer = window.dataLayer || [];
        function gtag() { dataLayer.push(arguments); }
        gtag('js', new Date());
        gtag('config', 'G-ZFDC8MXKCV', { 'page_title': 'Tarot del Ogro azul', 'page_path': '/' });
    };
}
