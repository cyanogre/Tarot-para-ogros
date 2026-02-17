const COOKIE_CONSENT_KEY = 'cookie_consent_ogre_tarot';
const PROXY_URL = '/.netlify/functions/api-proxy';

let currentDeck = [];
let currentReading = [];
let isReading = false;

document.addEventListener('DOMContentLoaded', () => {
    // Lanza el hechizo de Grum para asegurar que los estilos de las palabras clave estén listos.
    if (typeof injectGrumStyles === 'function') {
        injectGrumStyles();
    }

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

// --- INICIO DE LOS CAMBIOS ---
    
    // 1. Capturamos la pregunta del HTML (si existe)
    const questionInput = document.getElementById('userQuestion');
    const userQuestion = questionInput ? questionInput.value.trim() : '';

    // 2. Preparamos el resumen de las cartas
    const readingSummary = reading.map(item => 
        `${item.position}: ${item.card.name} (${item.card.inverted ? 'Invertida' : 'Derecha'})`
    ).join(', ');

    // 3. Modificamos el prompt para que sepa manejar preguntas
    const systemPrompt = "Actúa como un ogro místico, sabio, gruñón pero con un corazón de oro. Te llamas Grum. Interpreta la siguiente tirada de tarot de una forma muy coloquial, directa y con un toque de humor de ogro. Tu respuesta debe ser HTML. Usa `<br>` para saltos de línea y `<b>` para negritas. Para las palabras clave importantes, envuélvelas en `<span class=\"grum-keyword\">`. No uses adjetivos de género, llama al consultante 'criatura', 'humano' o similar. Si hay una pregunta específica, respóndela usando las cartas.";
    
    // 4. Construimos la petición incluyendo la pregunta si el usuario escribió algo
    let specificQuestionText = "";
    if (userQuestion) {
        specificQuestionText = ` La criatura pregunta específicamente: "${userQuestion}". Concéntrate en responder a eso usando las cartas.`;
    } else {
        specificQuestionText = " La criatura no ha preguntado nada en concreto, diles lo que necesitan saber.";
    }

    const userQuery = `Grum, mi tirada es: ${readingSummary}.${specificQuestionText} ¿Qué ves tú, grandullón?`;

    try {
        const fullPrompt = `${systemPrompt}\n\n${userQuery}`;
        const payload = { contents: [{ parts: [{ text: fullPrompt }] }] };

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
            ogreBubble.innerHTML = text;
        } else {
            throw new Error("Respuesta de la API recibida pero sin texto.");
        }

    } catch (error) {
        console.error("Error al contactar con el Ogro, usando fallback:", error);
        
        let fallbackHTML = "¡Argh! Mis visiones se han nublado. Pero un ogro siempre tiene un plan B. Esto es lo que veo, sin rodeos:<br><br>";
        
        reading.forEach(item => {
            const card = item.card;
            const cardInterpretations = OGRE_FALLBACKS[card.name];
            
            let fallbackText = "Esta carta es un misterio hasta para mí.";

            if (cardInterpretations) {
                fallbackText = card.inverted ? cardInterpretations.reversed : cardInterpretations.upright;
            }

            fallbackHTML += `<b>${item.position} (${card.name}${card.inverted ? ', Invertida' : ''}):</b> ${fallbackText}<br><br>`;
        });

        ogreBubble.innerHTML = fallbackHTML;
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

// Función para generar imagen de la tirada
async function generateShareImage() {
    const elementToCapture = document.getElementById('reading-snapshot');
    try {
        const canvas = await html2canvas(elementToCapture, {
            backgroundColor: '#1e0c3a',
            useCORS: true,
            scale: 2
        });
        
        // Convertir canvas a blob
        return new Promise((resolve) => {
            canvas.toBlob((blob) => {
                resolve(blob);
            }, 'image/png');
        });
    } catch (error) {
        console.error('Error al generar imagen:', error);
        return null;
    }
}

// Función para generar el texto de la tirada
function generateReadingText() {
    const cards = currentReading.map(r => 
        `${r.position}: ${r.card.name} (${r.card.inverted ? 'Invertida' : 'Derecha'})`
    ).join(', ');
    
    return `Acabo de consultar el Tarot del Ogro Azul 🔮\n\nMi tirada: ${cards}\n\n¿Quieres saber qué te depara el destino?`;
}

// Función para compartir con Web Share API (móviles)
async function shareWithWebAPI() {
    const shareText = generateReadingText();
    const shareUrl = window.location.href;
    
    try {
        // Generar la imagen
        const imageBlob = await generateShareImage();
        
        if (imageBlob && navigator.share && navigator.canShare) {
            const file = new File([imageBlob], 'mi-tirada-tarot-ogro.png', { type: 'image/png' });
            
            const shareData = {
                title: '🔮 Mi Tirada de Tarot',
                text: shareText,
                url: shareUrl,
                files: [file]
            };
            
            // Verificar si se pueden compartir archivos
            if (navigator.canShare(shareData)) {
                await navigator.share(shareData);
                return true;
            } else {
                // Si no se pueden compartir archivos, compartir solo texto
                await navigator.share({
                    title: '🔮 Mi Tirada de Tarot',
                    text: shareText,
                    url: shareUrl
                });
                return true;
            }
        }
        return false;
    } catch (err) {
        if (err.name !== 'AbortError') {
            console.log('Error al compartir:', err);
        }
        return false;
    }
}

// Función para descargar la imagen y compartir en redes
async function downloadAndShareToSocial(platform) {
    const imageBlob = await generateShareImage();
    
    if (imageBlob) {
        // Crear URL temporal para la imagen
        const imageUrl = URL.createObjectURL(imageBlob);
        
        // Crear enlace de descarga
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = 'mi-tirada-tarot-ogro.png';
        link.click();
        
        // Mostrar mensaje al usuario
        showDownloadMessage(platform);
        
        // Limpiar URL temporal después de un momento
        setTimeout(() => {
            URL.revokeObjectURL(imageUrl);
        }, 1000);
    }
    
    // Abrir la red social correspondiente
    const shareUrl = window.location.href;
    const shareText = generateReadingText();
    
    let socialUrl = '';
    switch(platform) {
        case 'twitter':
            socialUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
            break;
        case 'facebook':
            socialUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
            break;
        case 'whatsapp':
            socialUrl = `https://wa.me/?text=${encodeURIComponent(shareText + '\n' + shareUrl)}`;
            break;
        case 'telegram':
            socialUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
            break;
    }
    
    if (socialUrl) {
        window.open(socialUrl, '_blank');
    }
}

// Función para mostrar mensaje de descarga
function showDownloadMessage(platform) {
    const modal = document.getElementById('share-modal');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'download-message';
    messageDiv.innerHTML = `
        <p>✅ Imagen descargada</p>
        <p style="font-size: 0.9rem; margin-top: 10px;">Ahora puedes subirla manualmente a ${platform === 'twitter' ? 'Twitter/X' : platform === 'facebook' ? 'Facebook' : platform === 'whatsapp' ? 'WhatsApp' : 'Telegram'}</p>
    `;
    
    const modalContent = modal.querySelector('.share-modal-content');
    
    // Eliminar mensaje anterior si existe
    const oldMessage = modalContent.querySelector('.download-message');
    if (oldMessage) {
        oldMessage.remove();
    }
    
    modalContent.insertBefore(messageDiv, modalContent.querySelector('.share-buttons'));
    
    setTimeout(() => {
        messageDiv.style.animation = 'fadeOut 0.5s ease-out';
        setTimeout(() => messageDiv.remove(), 500);
    }, 4000);
}

// Función para mostrar el modal de compartir
async function showShareModal() {
    const modal = document.getElementById('share-modal');
    modal.style.display = 'flex';
    
    const shareUrl = window.location.href;
    
    // Botón de compartir nativo (móviles principalmente)
    const nativeShareBtn = document.getElementById('share-native');
    if (nativeShareBtn) {
        // Verificar si el dispositivo soporta Web Share API
        if (navigator.share) {
            nativeShareBtn.style.display = 'flex';
            nativeShareBtn.onclick = async () => {
                const shared = await shareWithWebAPI();
                if (shared) {
                    modal.style.display = 'none';
                }
            };
        } else {
            nativeShareBtn.style.display = 'none';
        }
    }
    
    // Twitter/X
    document.getElementById('share-twitter').onclick = (e) => {
        e.preventDefault();
        downloadAndShareToSocial('twitter');
    };
    
    // Facebook
    document.getElementById('share-facebook').onclick = (e) => {
        e.preventDefault();
        downloadAndShareToSocial('facebook');
    };
    
    // WhatsApp
    document.getElementById('share-whatsapp').onclick = (e) => {
        e.preventDefault();
        downloadAndShareToSocial('whatsapp');
    };
    
    // Telegram
    document.getElementById('share-telegram').onclick = (e) => {
        e.preventDefault();
        downloadAndShareToSocial('telegram');
    };
    
    // Solo descargar imagen
    document.getElementById('download-only').onclick = async (e) => {
        e.preventDefault();
        const btn = e.currentTarget;
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<span class="loading"></span> Descargando...';
        btn.disabled = true;
        
        const imageBlob = await generateShareImage();
        if (imageBlob) {
            const imageUrl = URL.createObjectURL(imageBlob);
            const link = document.createElement('a');
            link.href = imageUrl;
            link.download = 'mi-tirada-tarot-ogro.png';
            link.click();
            URL.revokeObjectURL(imageUrl);
            
            btn.innerHTML = '<span>✅</span> Descargada';
            setTimeout(() => {
                btn.innerHTML = originalHTML;
                btn.disabled = false;
            }, 2000);
        } else {
            btn.innerHTML = originalHTML;
            btn.disabled = false;
        }
    };
    
    // Copiar enlace
    document.getElementById('copy-link').onclick = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            const btn = document.getElementById('copy-link');
            const originalHTML = btn.innerHTML;
            btn.innerHTML = '<span>✅</span> ¡Copiado!';
            setTimeout(() => {
                btn.innerHTML = originalHTML;
            }, 2000);
        } catch (err) {
            alert('No se pudo copiar el enlace. Por favor, cópialo manualmente: ' + shareUrl);
        }
    };
}

// Event listeners para el modal de compartir
document.addEventListener('DOMContentLoaded', () => {
    // ... tu código existente ...
    
    // Añadir event listener para el botón de compartir
    const shareBtn = document.getElementById('shareBtn');
    if (shareBtn) {
        shareBtn.addEventListener('click', () => {
            playClickSound();
            showShareModal();
        });
    }
    
    // Cerrar modal
    const closeShareModal = document.getElementById('close-share-modal');
    if (closeShareModal) {
        closeShareModal.addEventListener('click', () => {
            document.getElementById('share-modal').style.display = 'none';
        });
    }
    
    // Cerrar modal al hacer clic fuera
    const shareModal = document.getElementById('share-modal');
    if (shareModal) {
        shareModal.addEventListener('click', (e) => {
            if (e.target === shareModal) {
                shareModal.style.display = 'none';
            }
        });
    }
});

