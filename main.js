const COOKIE_CONSENT_KEY = 'cookie_consent_ogre_tarot';
const PROXY_URL = '/.netlify/functions/api-proxy';

let currentDeck = [];
let currentReading = [];
let isReading = false;

document.addEventListener('DOMContentLoaded', () => {
    generateStars();
    generateParticles();
    setInterval(createShootingStar, 7000);
    
    document.getElementById('shuffleBtn').addEventListener('click', startReading);
    document.getElementById('deck').addEventListener('click', startReading);
    document.getElementById('exportBtn').addEventListener('click', exportReading);
    document.getElementById('muteBtn').addEventListener('click', toggleMute);
    
    document.querySelectorAll('button, .deck').forEach(el => {
        el.addEventListener('click', playClickSound);
    });

    checkCookieConsent();
    setupHamburgerMenu();
    setupPrivacyModal();
});

function checkCookieConsent() {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (consent === 'granted') {
        loadGoogleAnalytics();
    } else if (consent !== 'denied') {
        document.getElementById('cookie-banner').style.display = 'flex';
    }
}

function handleCookieConsent(consent) {
    localStorage.setItem(COOKIE_CONSENT_KEY, consent);
    document.getElementById('cookie-banner').style.display = 'none';
    if (consent === 'granted') {
        loadGoogleAnalytics();
    }
}

function setupPrivacyModal() {
    const privacyModal = document.getElementById('privacy-modal');
    const openModalLink = document.getElementById('privacy-policy-link');
    const openModalLinkBanner = document.getElementById('privacy-link-banner');
    const closeModalBtn = document.getElementById('modal-close');

    function openPrivacyModal(e) {
        e.preventDefault();
        privacyModal.style.display = 'flex';
    }
    
    openModalLink.addEventListener('click', openPrivacyModal);
    openModalLinkBanner.addEventListener('click', openPrivacyModal);
    closeModalBtn.addEventListener('click', () => privacyModal.style.display = 'none');
    privacyModal.addEventListener('click', (e) => {
        if (e.target === privacyModal) {
            privacyModal.style.display = 'none';
        }
    });

    document.getElementById('cookie-accept').addEventListener('click', () => handleCookieConsent('granted'));
    document.getElementById('cookie-decline').addEventListener('click', () => handleCookieConsent('denied'));
}

function createDeck(majorOnly = false) {
    let deck = [...MAJOR_ARCANA];
    if (!majorOnly) {
        Object.entries(SUITS).forEach(([suitName, suitData]) => {
            for (let i = 1; i <= 10; i++) {
                const cardName = i === 1 ? 'As' : i.toString();
                deck.push({
                    name: `${cardName} de ${suitName}`,
                    symbol: suitData.symbol,
                    type: 'minor',
                    suit: suitName,
                    number: i
                });
            }
            COURT_CARDS.forEach(courtCard => {
                deck.push({
                    name: `${courtCard} de ${suitName}`,
                    symbol: suitData.symbol,
                    type: 'minor',
                    suit: suitName,
                    court: courtCard
                });
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

async function startReading() {
    if (isReading) return;
    isReading = true;
    setupAudio();
    
    const shuffleBtn = document.getElementById('shuffleBtn');
    const deck = document.getElementById('deck');
    const shufflingContainer = document.getElementById('shuffling-container');
    const deckStatus = document.getElementById('deckStatus');
    const resultsDiv = document.getElementById('results');
    const exportBtn = document.getElementById('exportBtn');
    const ogreBubble = document.getElementById('ogre-interpretation');

    shuffleBtn.disabled = true;
    shuffleBtn.innerHTML = '<span class="loading"></span> Barajando...';
    deckStatus.textContent = 'Barajando las cartas...';
    resultsDiv.style.display = 'none';
    exportBtn.style.display = 'none';
    ogreBubble.style.display = 'none';

    playShuffleSound();

    deck.style.display = 'none';
    shufflingContainer.style.display = 'block';

    const numShufflingCards = 20;
    const shuffledCards = [];
    for(let i = 0; i < numShufflingCards; i++) {
        const card = document.createElement('div');
        card.className = 'shuffling-card';
        card.style.transform = `translate3d(0, 0, 0) rotateY(${Math.random() * 360}deg) rotateZ(${Math.random() * 360}deg)`;
        card.style.opacity = '0';
        shufflingContainer.appendChild(card);
        shuffledCards.push(card);
    }

    setTimeout(() => {
        shuffledCards.forEach(card => {
            card.style.transform = `translate3d(${Math.random() * 300 - 150}px, ${Math.random() * 200 - 100}px, ${Math.random() * 200 - 100}px) rotateY(${Math.random() * 720 + 360}deg) rotateZ(${Math.random() * 720 + 360}deg)`;
            card.style.opacity = '1';
        });
    }, 50);

    await new Promise(resolve => setTimeout(resolve, 1500));
    
    shuffledCards.forEach(card => {
        card.style.transform = `translate3d(0, 0, 0) rotateY(0deg) rotateZ(0deg)`;
        card.style.opacity = '0';
    });

    await new Promise(resolve => setTimeout(resolve, 1500));
    shuffledCards.forEach(card => card.remove());
    shufflingContainer.style.display = 'none';
    deck.style.display = 'block';

    deckStatus.textContent = 'Cortando el mazo...';
    
    const deckType = document.getElementById('deckType').value;
    const spreadType = parseInt(document.getElementById('spreadType').value);
    currentDeck = createDeck(deckType === 'major');
    currentDeck = shuffleDeck(currentDeck);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    deckStatus.textContent = 'Extrayendo cartas...';
    const cutPoint = Math.floor(Math.random() * currentDeck.length);
    currentDeck = [...currentDeck.slice(cutPoint), ...currentDeck.slice(0, cutPoint)];
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const positions = getSpreadPositions(spreadType);
    currentReading = [];
    for (let i = 0; i < positions.length; i++) {
        if (currentDeck.length > 0) {
            currentReading.push({
                card: currentDeck.pop(),
                position: positions[i]
            });
        }
    }
    displaySpread();
    shuffleBtn.disabled = false;
    shuffleBtn.innerHTML = '🔮 Nueva Tirada';
    deckStatus.textContent = 'Haz clic en las cartas para revelarlas...';
    isReading = false;
}

function getInterpretation(card, inverted) {
    let interpretation = "";
    if (card.type === 'major') {
        const data = INTERPRETATIONS[card.name];
        interpretation = inverted ? data.reversed : data.upright;
    } else {
        const minorSuit = MINOR_INTERPRETATIONS[card.suit];
        let cardKey = card.number ? (card.number === 1 ? 'As' : card.number.toString()) : card.court;
        if (minorSuit && minorSuit[cardKey]) {
            const data = minorSuit[cardKey];
            interpretation = inverted ? data.reversed : data.upright;
        } else {
            interpretation = "No se encontró interpretación para esta carta.";
        }
    }
    return interpretation;
}

async function getOgreInterpretation(reading) {
    const ogreBubble = document.getElementById('ogre-interpretation');
    ogreBubble.style.display = 'block';
    ogreBubble.innerHTML = '<span class="loading"></span> El Ogro está consultando el cosmos...';
    
    playOgreAnimation();

    const readingSummary = reading.map(item => 
        `${item.position}: ${item.card.name} (${item.card.inverted ? 'Invertida' : 'Derecha'})`
    ).join(', ');

    const systemPrompt = "Actúa como un ogro místico, sabio, gruñón pero con un corazón de oro. Te llamas Grum. Interpreta la siguiente tirada de tarot de una forma muy coloquial, directa y con un toque de humor de ogro. lenguaje de tarotistaprofesional, sé breve, no uses adjetivos de genero llama al lector al lector con sustantivos sin género como criatura humana o similares, no uses género ya que no sabemos si el lector será hombre o mujer. no uses markdown, usa html para las negritas ya que tu texto se reproduce dentro de un index.html.";
    
    const userQuery = `Grum, mi tirada es: ${readingSummary}. ¿Qué ves tú, grandullón?`;

    try {
        const payload = {
            contents: [{ parts: [{ text: userQuery }] }],
            systemInstruction: { parts: [{ text: systemPrompt }] },
        };

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

        if (text) {
            ogreBubble.innerHTML = text.replace(/\n/g, '<br>');
        } else {
            ogreBubble.textContent = "Vaya, el cosmos está tímido hoy. No logro ver nada claro.";
        }

    } catch (error) {
        console.error("Error al contactar con el Ogro:", error);
        ogreBubble.textContent = "¡Argh! Mis visiones se han nublado. He realizado demasiadas predicciones seguidas, tendrás que conformarte con las indicaciones de abajo o probar más tarde.";
    }
}

function loadGoogleAnalytics() {
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-ZFDC8MXKCV';
    document.head.appendChild(script);

    script.onload = () => {
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-ZFDC8MXKCV', {
            'page_title' : 'Tarot del Ogro azul',
            'page_path': '/'
        });
        console.log('Google Analytics cargado.');
    }
}

function setupHamburgerMenu() {
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const navLinks = document.getElementById('nav-links');

    hamburgerBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        navLinks.classList.toggle('open');
    });

    document.body.addEventListener('click', () => {
        if (navLinks.classList.contains('open')) {
            navLinks.classList.remove('open');
        }
    });
}