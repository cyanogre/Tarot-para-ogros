// Versión corregida v5 - Actualización a Gemini 2.5 Flash (2026)
exports.handler = async function(event) {
    console.log("[FUNCIÓN v5]: Invocada (Actualización Gemini 2.5).");

    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const API_KEY = process.env.API_KEY;

    if (!API_KEY) {
        console.error("[FUNCIÓN v5]: ¡ERROR! No hay API_KEY configurada.");
        return { 
            statusCode: 500, 
            body: JSON.stringify({ error: 'La API Key del servidor no está configurada.' }) 
        };
    }

    // --- CAMBIO CLAVE: Usar Gemini 2.5 Flash ---
    // Gemini 1.5 está obsoleto/retirado. 
    // Gemini 2.5 Flash es el modelo estándar, rápido y eficiente actual.
    const modelName = 'gemini-2.5-flash'; 
    
    // URL para la versión v1beta (compatible con modelos nuevos)
    const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${API_KEY}`;

    try {
        console.log(`[FUNCIÓN v5]: Solicitando al modelo: ${modelName}`);
        
        const response = await fetch(GEMINI_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: event.body,
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error(`[FUNCIÓN v5]: Error API ${response.status}.`, errorBody);
            
            // Si 2.5 falla por cuota (429), el frontend usará el fallback automáticamente.
            return {
                statusCode: response.status,
                body: JSON.stringify({ 
                    error: `Error de la API de Gemini (${modelName})`, 
                    details: errorBody 
                }),
            };
        }

        const data = await response.json();
        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        };

    } catch (error) {
        console.error("[FUNCIÓN v5]: Error interno:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error interno del servidor.' }),
        };
    }
};
