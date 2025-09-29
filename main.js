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
        // --- CAMBIO IMPORTANTE AQUÍ ---
        // Se ha modificado la estructura del payload para que sea compatible con la API v1
        const payload = {
            contents: [{
                parts: [
                    { text: systemPrompt },
                    { text: userQuery }
                ]
            }]
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
