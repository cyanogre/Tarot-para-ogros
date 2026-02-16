function createShootingStar() {
    const star = document.createElement('div');
    star.className = 'shooting-star';
    star.style.top = Math.random() * 100 + '%';
    star.style.left = '-100px';
    star.style.animationDuration = (Math.random() * 2 + 3) + 's';
    document.body.appendChild(star);
    setTimeout(() => {
        star.remove();
    }, 5000);
}

function generateStars() {
    const starsContainer = document.getElementById('stars');
    for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.width = star.style.height = Math.random() * 3 + 1 + 'px';
        star.style.animationDelay = Math.random() * 2 + 's';
        starsContainer.appendChild(star);
    }
}

function generateParticles() {
    const particlesContainer = document.getElementById('particles');
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 3 + 's';
        particlesContainer.appendChild(particle);
    }
}

function createCardElement(card, position, index, isRevealed = false) {
    const cardEl = document.createElement('div');
    cardEl.className = 'card';

    if (card.type === 'major') {
        cardEl.classList.add('card--major-arcana');
    }

    cardEl.style.animationDelay = (index * 0.2) + 's';
    const isInverted = Math.random() < 0.5;
    card.inverted = isInverted;
    cardEl.innerHTML = `
        <div class="card-position">${position}</div>
        <div class="card-content">
            <div class="card-name">${card.name}</div>
            <div class="card-symbol">${card.symbol}</div>
            <div class="card-orientation">${isInverted ? '(Invertida)' : '(Derecha)'}</div>
        </div>
    `;
    if (isInverted) {
        cardEl.classList.add('inverted');
    }
    if (!isRevealed) {
        cardEl.style.transform = 'rotateY(180deg)';
        cardEl.querySelector('.card-content').style.display = 'none';
    }
    cardEl.addEventListener('click', () => {
        if (cardEl.classList.contains('revealed')) {
            cardEl.classList.add('spinning');
            playClickSound(); 
            setTimeout(() => {
                cardEl.classList.remove('spinning');
            }, 1000); 
        } else {
            revealCard(cardEl, card);
        }
    });
    return cardEl;
}

function revealCard(cardEl, card) {
    cardEl.classList.add('flipping');
    cardEl.querySelector('.card-content').style.display = 'flex';
    playCardRevealSound();
    setTimeout(() => {
        cardEl.classList.add('revealed');
        cardEl.style.transform = card.inverted ? 'rotateY(0deg) rotate(180deg)' : 'rotateY(0deg)';
    }, 500);
}

function displaySpread() {
    const container = document.getElementById('spreadContainer');
    container.innerHTML = '';
    currentReading.forEach((reading, index) => {
        const cardEl = createCardElement(reading.card, reading.position, index);
        container.appendChild(cardEl);
        setTimeout(() => {
            cardEl.style.animation = 'fadeInUp 0.6s ease-out forwards';
        }, index * 200);
    });
    setTimeout(() => {
        showAllCards();
    }, currentReading.length * 200 + 2000);
}

function showAllCards() {
    const cards = document.querySelectorAll('.card:not(.revealed)');
    cards.forEach((card, index) => {
        setTimeout(() => {
            if (!card.classList.contains('revealed')) {
                const cardData = currentReading[Array.from(card.parentNode.children).indexOf(card)];
                revealCard(card, cardData.card);
            }
        }, index * 300);
    });
    setTimeout(() => {
        showResults();
    }, cards.length * 300 + 1000);
}

// --- CÓDIGO CORREGIDO ---
function playOgreAnimation() {
    const ogreContainer = document.getElementById('ogre-container');
    const ogreImage = document.getElementById('ogre-image');
    if (!ogreContainer || !ogreImage) return;

    fadeAmbientVolume(0.2, 1.0);

    const ogreVideo = document.createElement('video');
    ogreVideo.src = 'Ogro.webm';
    ogreVideo.id = 'ogre-video';
    ogreVideo.autoplay = true;
    ogreVideo.muted = false;
    ogreVideo.playsInline = true;
    ogreVideo.style.opacity = '0'; // Comienza transparente

    ogreContainer.appendChild(ogreVideo);

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            ogreImage.style.opacity = '0';
            ogreVideo.style.opacity = '1';
        });
    });

    ogreVideo.addEventListener('ended', () => {
        fadeAmbientVolume(1.0, 1.5);
        ogreVideo.style.opacity = '0';
        ogreImage.style.opacity = '1';
        setTimeout(() => {
            if (ogreVideo.parentNode) {
                ogreContainer.removeChild(ogreVideo);
            }
        }, 300); // Coincide con la duración de la transición en CSS
    }, { once: true });

    ogreVideo.play().catch(error => {
         console.error("Error al reproducir el video del ogro:", error);
         if (ogreVideo.parentNode) {
            ogreContainer.removeChild(ogreVideo);
         }
         ogreImage.style.opacity = '1';
         fadeAmbientVolume(1.0, 0.5);
    });
}
// --- FIN DEL CÓDIGO CORREGIDO ---

function showResults() {
    const resultsDiv = document.getElementById('results');
    const resultsContent = document.getElementById('resultsContent');
    const exportBtn = document.getElementById('exportBtn');
    const shareBtn = document.getElementById('shareBtn'); // AÑADIR ESTA LÍNEA
    
    let resultsHTML = '';
    currentReading.forEach((reading, index) => {
        const cardData = reading.card;
        const orientation = cardData.inverted ? 'invertida' : 'derecha';
        const fullInterpretation = getInterpretation(cardData, cardData.inverted);
        resultsHTML += `
            <div class="result-item">
                <h3>Carta ${index + 1} (${reading.position}):</h3>
                <h4>${cardData.name} (${orientation})</h4>
                <p>${fullInterpretation}</p>
            </div>
        `;
    });
    resultsContent.innerHTML = resultsHTML;
    resultsDiv.style.display = 'block';
    exportBtn.style.display = 'inline-block';
    shareBtn.style.display = 'inline-block'; // AÑADIR ESTA LÍNEA
    
    getOgreInterpretation(currentReading);
}

async function exportReading() {
    const exportBtn = document.getElementById('exportBtn');
    exportBtn.disabled = true;
    exportBtn.innerHTML = '<span class="loading"></span> Exportando...';
    const elementToCapture = document.getElementById('reading-snapshot');
    try {
        const canvas = await html2canvas(elementToCapture, {
            backgroundColor: '#1e0c3a',
            useCORS: true,
            scale: 2
        });
        const link = document.createElement('a');
        link.download = 'mi-tirada-tarot-ogro.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    } catch (error) {
        console.error('Error al exportar la imagen:', error);
        alert('Hubo un problema al exportar la imagen.');
    } finally {
         exportBtn.disabled = false;
         exportBtn.innerHTML = '📸 Exportar PNG';
    }
}
// --- CORRECCIÓN MENÚ HAMBURGUESA ---
function setupHamburgerMenu() {
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const navLinks = document.getElementById('nav-links');

    if (hamburgerBtn && navLinks) {
        hamburgerBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Evita clics fantasma
            navLinks.classList.toggle('active');
            
            // Opcional: Si quieres que cambie el icono
            if (navLinks.classList.contains('active')) {
                hamburgerBtn.textContent = '✕'; // Cambia a X al abrir
            } else {
                hamburgerBtn.textContent = '☰'; // Vuelve a hamburguesa
            }
        });

        // Cerrar el menú si se hace clic fuera de él
        document.addEventListener('click', (e) => {
            if (navLinks.classList.contains('active') && 
                !navLinks.contains(e.target) && 
                !hamburgerBtn.contains(e.target)) {
                navLinks.classList.remove('active');
                hamburgerBtn.textContent = '☰';
            }
        });
    }
}

