exports.handler = async function(event) {
    // 1. Registro de invocación
    console.log("[FUNCIÓN]: Invocada.");

    if (event.httpMethod !== 'POST') {
        console.log(`[FUNCIÓN]: Método no permitido: ${event.httpMethod}`);
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const API_KEY = process.env.API_KEY;

    // 2. Verificamos si la API_KEY existe
    if (API_KEY) {
        console.log(`[FUNCIÓN]: Clave API encontrada. Terminando en: ...${API_KEY.slice(-4)}`);
    } else {
        console.error("[FUNCIÓN]: ¡ERROR! La variable de entorno API_KEY no está configurada en Netlify.");
        return { statusCode: 500, body: JSON.stringify({ error: 'La API Key del servidor no está configurada.' }) };
    }

    const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

    try {
        // 3. Mostramos lo que recibimos del cliente
        console.log("[FUNCIÓN]: Cuerpo de la petición recibida del cliente:", event.body);
        
        const response = await fetch(GEMINI_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: event.body,
        });

        // 4. Registramos la respuesta de Gemini ANTES de comprobar si es válida
        console.log(`[FUNCIÓN]: Respuesta recibida de la API de Gemini. Status: ${response.status}`);

        if (!response.ok) {
            const errorBody = await response.text();
            // 5. ¡Este es el registro más importante! Muestra el error exacto de Google.
            console.error(`[FUNCIÓN]: Error de la API de Gemini. Status: ${response.status}. Cuerpo del error:`, errorBody);
            
            return {
                statusCode: response.status,
                body: JSON.stringify({ error: 'Error devuelto por la API de Gemini', details: errorBody }),
            };
        }

        const data = await response.json();
        console.log("[FUNCIÓN]: Éxito. Enviando respuesta de vuelta al cliente.");

        return {
            statusCode: 200,
            body: JSON.stringify(data),
        };

    } catch (error) {
        console.error("[FUNCIÓN]: Error catastrófico en el bloque try-catch:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Ocurrió un error interno en el servidor.' }),
        };
    }
};
