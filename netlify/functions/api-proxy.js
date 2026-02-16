// Versión corregida de la función Netlify - Corrección de Cuota
exports.handler = async function(event) {
    console.log("[FUNCIÓN v3]: Invocada (Corrección Cuota).");

    if (event.httpMethod !== 'POST') {
        console.log(`[FUNCIÓN v3]: Método no permitido: ${event.httpMethod}`);
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const API_KEY = process.env.API_KEY;

    // --- BLOQUE DE DEPURACIÓN ---
    if (API_KEY && API_KEY.length > 10) {
        console.log(`[FUNCIÓN v3]: Clave API encontrada. Comienza con "${API_KEY.substring(0, 4)}" y termina en "...${API_KEY.slice(-4)}".`);
    } else if (API_KEY) {
        console.error("[FUNCIÓN v3]: ¡ERROR! La variable API_KEY existe pero es muy corta.");
    } else {
        console.error("[FUNCIÓN v3]: ¡ERROR GRAVE! La variable process.env.API_KEY no está configurada.");
        return { 
            statusCode: 500, 
            body: JSON.stringify({ error: 'La API Key del servidor no está configurada.' }) 
        };
    }

    // --- CORRECCIÓN AQUÍ: Usamos gemini-1.5-flash (estable) en lugar de 2.0 (experimental) ---
    // Esto evita los límites de cuota estrictos del modelo preview.
    const modelName = 'gemini-1.5-flash'; 
    
    const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${API_KEY}`;

    try {
        console.log("[FUNCIÓN v3]: Cuerpo de la petición recibida:", event.body);
        
        const response = await fetch(GEMINI_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: event.body,
        });

        console.log(`[FUNCIÓN v3]: Respuesta de la API de Gemini. Status: ${response.status}`);

        if (!response.ok) {
            const errorBody = await response.text();
            console.error(`[FUNCIÓN v3]: Error de la API de Gemini. Status: ${response.status}. Cuerpo:`, errorBody);
            
            return {
                statusCode: response.status,
                body: JSON.stringify({ error: 'Error devuelto por la API de Gemini', details: errorBody }),
            };
        }

        const data = await response.json();
        console.log("[FUNCIÓN v3]: Éxito. Enviando respuesta al cliente.");

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        };

    } catch (error) {
        console.error("[FUNCIÓN v3]: Error catastrófico en el bloque try-catch:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Ocurrió un error interno en el servidor.' }),
        };
    }
};
