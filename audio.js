let audioCtx;
let intervalId;
let ambientMasterGain;
let audioUnlocked = false;

const notas = [261.63, 293.66, 311.13, 349.23, 392.00, 440.00, 466.16, 523.25];
let isMuted = false;

function playClickSound() {
    if (isMuted) return;
    setupAudio();
    const clickOsc = audioCtx.createOscillator();
    const clickGain = audioCtx.createGain();
    clickOsc.type = 'sine';
    clickOsc.frequency.setValueAtTime(440, audioCtx.currentTime);
    clickGain.gain.setValueAtTime(0.2, audioCtx.currentTime);
    clickGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
    clickOsc.connect(clickGain);
    clickGain.connect(audioCtx.destination);
    clickOsc.start(audioCtx.currentTime);
    clickOsc.stop(audioCtx.currentTime + 0.1);
}

function playCardRevealSound() {
    if (isMuted) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(500, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(audioCtx.currentTime);
    osc.stop(audioCtx.currentTime + 0.5);
}

function playShuffleSound() {
    if (isMuted) return;
    setupAudio();
    const shuffleBuffer = audioCtx.createBuffer(1, audioCtx.sampleRate * 2, audioCtx.sampleRate);
    const shuffleData = shuffleBuffer.getChannelData(0);
    for (let i = 0; i < shuffleData.length; i++) {
        shuffleData[i] = (Math.random() - 0.5) * 0.1;
    }
    const source = audioCtx.createBufferSource();
    source.buffer = shuffleBuffer;
    const gainNode = audioCtx.createGain();
    gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 2);
    source.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    source.start(audioCtx.currentTime);
}

function setupAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        ambientMasterGain = audioCtx.createGain();
        ambientMasterGain.gain.setValueAtTime(1.0, audioCtx.currentTime);
        ambientMasterGain.connect(audioCtx.destination);
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    if (!intervalId && !isMuted) {
        intervalId = setInterval(generarMelodia, 400);
    }
}

function toggleMute() {
    const muteBtn = document.getElementById('muteBtn');
    isMuted = !isMuted;
    if (isMuted) {
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
        }
        muteBtn.innerHTML = '🔇 Silenciar';
    } else {
        setupAudio();
        muteBtn.innerHTML = '🔊 Sonido';
    }
}

function tocarNota(frecuencia, duracion) {
    if (!audioCtx || isMuted || !ambientMasterGain) return;
    let oscillator = audioCtx.createOscillator();
    let gainNode = audioCtx.createGain();
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(frecuencia, audioCtx.currentTime);
    let reverb = audioCtx.createDelay();
    reverb.delayTime.value = 0.2;
    oscillator.connect(reverb);
    reverb.connect(gainNode);
    
    gainNode.connect(ambientMasterGain); 
    
    gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + duracion);
}

function fadeAmbientVolume(targetVolume, duration) {
    if (ambientMasterGain && audioCtx) {
        const effectiveVolume = Math.max(0.001, targetVolume);
        ambientMasterGain.gain.exponentialRampToValueAtTime(effectiveVolume, audioCtx.currentTime + duration);
    }
}

function generarMelodia() {
    let nota = notas[Math.floor(Math.random() * notas.length)];
    tocarNota(nota, 0.6);
}