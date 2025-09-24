const MAJOR_ARCANA = [
    { name: "El Loco", symbol: "🃏", type: "major" },
    { name: "El Mago", symbol: "🎩", type: "major" },
    { name: "La Sacerdotisa", symbol: "👑", type: "major" },
    { name: "La Emperatriz", symbol: "👸", type: "major" },
    { name: "El Emperador", symbol: "👑", type: "major" },
    { name: "El Hierofante", symbol: "⛪", type: "major" },
    { name: "Los Enamorados", symbol: "💕", type: "major" },
    { name: "El Carro", symbol: "🏇", type: "major" },
    { name: "La Justicia", symbol: "⚖️", type: "major" },
    { name: "El Ermitaño", symbol: "🕯️", type: "major" },
    { name: "La Fortuna", symbol: "🎡", type: "major" },
    { name: "La Fuerza", symbol: "🦁", type: "major" },
    { name: "El Colgado", symbol: "🙃", type: "major" },
    { name: "La Muerte", symbol: "💀", type: "major" },
    { name: "La Templanza", symbol: "🍷", type: "major" },
    { name: "El Diablo", symbol: "😈", type: "major" },
    { name: "La Torre", symbol: "🏰", type: "major" },
    { name: "La Estrella", symbol: "⭐", type: "major" },
    { name: "La Luna", symbol: "🌙", type: "major" },
    { name: "El Sol", symbol: "☀️", type: "major" },
    { name: "El Juicio", symbol: "📯", type: "major" },
    { name: "El Mundo", symbol: "🌍", type: "major" }
];

const SUITS = {
    'Copas': { symbol: '🏆', color: '#4169e1', element: 'agua', theme: 'emociones, relaciones, intuición' },
    'Espadas': { symbol: '⚔️', color: '#c0392b', element: 'aire', theme: 'mente, conflictos, verdad' },
    'Bastos': { symbol: '🏹', color: '#8b4513', element: 'fuego', theme: 'energía, acción, creatividad' },
    'Oros': { symbol: '🪙', color: '#ffd700', element: 'tierra', theme: 'materia, trabajo, recursos' }
};

const COURT_CARDS = ['Sota', 'Caballero', 'Reina', 'Rey'];

const INTERPRETATIONS = {
    "El Loco": { keyword: "Inicio", upright: "Nuevos comienzos, espontaneidad, aventura, fe en el futuro. Es momento de dar un salto de fe.", reversed: "Imprudencia, falta de dirección, decisiones precipitadas. Necesitas más planificación." },
    "El Mago": { keyword: "Acción", upright: "Poder personal, manifestación, recursos disponibles. Tienes todo lo que necesitas para triunfar.", reversed: "Manipulación, falta de energía, recursos desperdiciados. Revisa tus intenciones." },
    "La Sacerdotisa": { keyword: "Intuición", upright: "Sabiduría interior, misterios, intuición, conocimiento oculto. Confía en tu voz interior.", reversed: "Secretos revelados, falta de intuición, conocimiento superficial. Necesitas profundizar más." },
    "La Emperatriz": { keyword: "Creación", upright: "Fertilidad, creatividad, abundancia, naturaleza maternal. Es tiempo de crear y nutrir.", reversed: "Dependencia, creatividad bloqueada, falta de crecimiento. Reconecta con tu poder creativo." },
    "El Emperador": { keyword: "Orden", upright: "Autoridad, estructura, control, liderazgo. Toma las riendas de tu situación.", reversed: "Tiranía, falta de disciplina, abuso de poder. Necesitas equilibrar control y flexibilidad." },
    "El Hierofante": { keyword: "Tradición", upright: "Enseñanzas tradicionales, conformidad, instituciones. Busca guidance en la sabiduría establecida.", reversed: "Rebeldía, nuevas formas, cuestionamiento de normas. Es hora de forjar tu propio camino." },
    "Los Enamorados": { keyword: "Elección", upright: "Amor, relaciones, decisiones importantes, valores personales. Una elección crucial te espera.", reversed: "Desamor, malas decisiones, valores en conflicto. Reflexiona antes de elegir." },
    "El Carro": { keyword: "Voluntad", upright: "Triunfo, determinación, control, avance. Tu fuerza de voluntad te llevará al éxito.", reversed: "Falta de dirección, pérdida de control, agresividad. Necesitas enfocar tu energía." },
    "La Justicia": { keyword: "Equilibrio", upright: "Justicia, equilibrio, verdad, responsabilidad. Las consecuencias de tus actos se manifiestan.", reversed: "Injusticia, desequilibrio, falta de responsabilidad. Busca la equidad en tus decisiones." },
    "El Ermitaño": { keyword: "Búsqueda", upright: "Búsqueda interior, soledad constructiva, guía espiritual. Es tiempo de introspección.", reversed: "Aislamiento, terquedad, rechazo de consejos. No te cierres a la ayuda externa." },
    "La Fortuna": { keyword: "Cambio", upright: "Cambios, ciclos, destino, buena suerte. Los vientos del cambio soplan a tu favor.", reversed: "Mala suerte, resistencia al cambio, ciclos negativos. Acepta que todo es temporal." },
    "La Fuerza": { keyword: "Dominio", upright: "Fuerza interior, valor, paciencia, autocontrol. Tu verdadera fuerza viene de dentro.", reversed: "Debilidad, falta de autocontrol, miedo. Reconecta con tu poder interior." },
    "El Colgado": { keyword: "Rendición", upright: "Sacrificio, nueva perspectiva, pausa, rendición. A veces hay que ceder para avanzar.", reversed: "Martirio, resistencia inútil, retrasos. Deja de luchar contra lo inevitable." },
    "La Muerte": { keyword: "Transformación", upright: "Final de ciclos, transformación, renacimiento. Un capítulo termina, otro comienza.", reversed: "Resistencia al cambio, estancamiento, miedo a la transformación. Abraza el cambio necesario." },
    "La Templanza": { keyword: "Armonía", upright: "Moderación, equilibrio, paciencia, curación. Encuentra el punto medio en todo.", reversed: "Impaciencia, extremos, falta de equilibrio. Necesitas más moderación." },
    "El Diablo": { keyword: "Atadura", upright: "Tentación, ataduras, materialismo, adicciones. Examina qué te tiene prisionero.", reversed: "Liberación, ruptura de cadenas, superación de adicciones. Te estás liberando." },
    "La Torre": { keyword: "Ruptura", upright: "Cambio súbito, revelación, destrucción necesaria. Las falsas estructuras se derrumban.", reversed: "Evitar el cambio, catástrofe personal, resistencia. El cambio es inevitable." },
    "La Estrella": { keyword: "Esperanza", upright: "Esperanza, inspiración, curación, guía espiritual. La luz brilla al final del túnel.", reversed: "Desesperanza, falta de fe, desconexión espiritual. Recupera tu fe interior." },
    "La Luna": { keyword: "Inconsciente", upright: "Ilusiones, subconsciente, miedos, intuición. No todo es lo que parece ser.", reversed: "Claridad, superación de miedos, verdad revelada. La confusión se disipa." },
    "El Sol": { keyword: "Vitalidad", upright: "Éxito, vitalidad, positividad, claridad. Todo se ilumina en tu vida.", reversed: "Falta de energía, optimismo forzado, retrasos en el éxito. Recupera tu vitalidad." },
    "El Juicio": { keyword: "Despertar", upright: "Despertar, llamada superior, renovación, perdón. Es hora de un nuevo amanecer.", reversed: "Falta de perdón, juicio severo, llamada ignorada. Escucha tu voz interior." },
    "El Mundo": { keyword: "Culminación", upright: "Logro, culminación, viaje completado, integración. Has alcançado tu meta.", reversed: "Falta de cierre, objetivos incompletos, retrasos. Te falta poco para completar el ciclo." }
};

const MINOR_INTERPRETATIONS = {
    "Bastos": {
        "As": { keyword: "Impulso", upright: "Nuevo proyecto, inspiración creativa, potencial energético.", reversed: "Falta de dirección, energía desperdiciada, proyectos fallidos." },
        "2": { keyword: "Decisión", upright: "Planificación personal, decisiones futuras, dominio.", reversed: "Falta de planificación, impaciencia, decisiones apresuradas." },
        "3": { keyword: "Expansión", upright: "Expansión, previsión, liderazgo comercial.", reversed: "Falta de previsión, retrasos, expansión fallida." },
        "4": { keyword: "Estabilidad", upright: "Celebración, armonía, hogar estable, logros.", reversed: "Falta de armonía, problemas domésticos, logros incompletos." },
        "5": { keyword: "Conflicto", upright: "Competencia, conflicto, lucha, desacuerdo.", reversed: "Evitar conflictos, competencia desleal, conflictos internos." },
        "6": { keyword: "Victoria", upright: "Victoria, reconocimiento público, progreso, liderazgo.", reversed: "Victoria pírrica, falta de reconocimiento, retrasos en el éxito." },
        "7": { keyword: "Defensa", upright: "Defensa de posición, perseverancia, competencia.", reversed: "Ceder terreno, falta de perseverancia, sentirse abrumado." },
        "8": { keyword: "Movimiento", upright: "Movimiento rápido, progreso acelerado, noticias.", reversed: "Retrasos, frustración, movimiento errado." },
        "9": { keyword: "Resistencia", upright: "Resistencia, persistencia, última defensa.", reversed: "Rigidez, paranoia, falta de flexibilidad." },
        "10": { keyword: "Carga", upright: "Carga pesada, responsabilidad, opresión, pero cerca del final.", reversed: "Liberación de cargas, delegación, soltar responsabilidades." },
        "Sota": { keyword: "Aprendizaje ardiente", upright: "Mensajero entusiasta, nuevas oportunidades de aprendizaje.", reversed: "Inmadurez, impulsividad, mensajes confusos." },
        "Caballero": { keyword: "Movimiento ardiente", upright: "Aventura, impulsividad, viajes, acción rápida.", reversed: "Impaciencia, agresividad, cambios bruscos." },
        "Reina": { keyword: "Madurez ardiente", upright: "Confianza, determinación, independencia, liderazgo femenino.", reversed: "Venganza, celos, manipulación." },
        "Rey": { keyword: "Dominio ardiente", upright: "Liderazgo natural, visión emprendedora, honestidad.", reversed: "Tiranía, impulsividad, liderazgo irresponsable." }
    },
    "Copas": {
        "As": { keyword: "Sentimiento", upright: "Nuevo amor, felicidad emocional, intuición, espiritualidad.", reversed: "Amor bloqueado, emociones reprimidas, vacío espiritual." },
        "2": { keyword: "Unión", upright: "Asociación, amor mutuo, unión, armonía.", reversed: "Desamor, separación, relaciones rotas." },
        "3": { keyword: "Celebración", upright: "Celebración, amistad, creatividad, comunidad.", reversed: "Aislamiento, creatividad bloqueada, pérdida de amistades." },
        "4": { keyword: "Aburrimiento", upright: "Apatía, meditación, reevaluación, aburrimiento.", reversed: "Motivación renovada, nuevas oportunidades, acción." },
        "5": { keyword: "Pérdida", upright: "Pérdida emocional, lamento, duelo, decepción.", reversed: "Recuperación, aceptación, movimiento después de la pérdida." },
        "6": { keyword: "Recuerdo", upright: "Nostalgia, recuerdos del pasado, inocencia, regalos.", reversed: "Vivir en el pasado, negación del presente." },
        "7": { keyword: "Ilusión", upright: "Ilusiones, sueños, opciones fantasiosas, imaginación.", reversed: "Realidad, claridad, determinación, opciones reales." },
        "8": { keyword: "Búsqueda", upright: "Abandono, búsqueda de algo superior, cambio emocional.", reversed: "Regresar, renovación emocional, encontrar lo buscado." },
        "9": { keyword: "Plenitud", upright: "Satisfacción, felicidad, realización de deseos.", reversed: "Insatisfacción, arrogancia, deseos superficiales." },
        "10": { keyword: "Amor pleno", upright: "Felicidad familiar, amor verdadero, armonía emocional.", reversed: "Familia disfuncional, valores perdidos, armonía rota." },
        "Sota": { keyword: "Aprendizaje emocional", upright: "Mensaje de amor, estudio artístico, sensibilidad.", reversed: "Inmadurez emocional, mensaje confuso, bloqueo creativo." },
        "Caballero": { keyword: "Movimiento emocional", upright: "Romance, invitaciones, proposiciones, charm.", reversed: "Moralidad cuestionable, promesas vacías, engaño." },
        "Reina": { keyword: "Madurez emocional", upright: "Intuición, compasión, seguridad emocional, calidez.", reversed: "Dependencia emocional, manipulación, inestabilidad." },
        "Rey": { keyword: "Dominio emocional", upright: "Equilibrio emocional, compasión, control, diplomacia.", reversed: "Volatilidad emocional, manipulación, doble moral." }
    },
    "Espadas": {
        "As": { keyword: "Idea", upright: "Nueva idea, claridad mental, verdad, justicia.", reversed: "Confusión, ideas nubradas, injusticia." },
        "2": { keyword: "Duda", upright: "Decisión difícil, equilibrio tenso, estancamiento.", reversed: "Decisión tomada, fin del estancamiento, claridad." },
        "3": { keyword: "Dolor", upright: "Dolor de corazón, traición, separación, pena.", reversed: "Recuperación del dolor, perdón, curación emocional." },
        "4": { keyword: "Reposo", upright: "Descanso, meditación, recuperación, pausa.", reversed: "Agotamiento, insomnio, retorno a la actividad." },
        "5": { keyword: "Derrota", upright: "Derrota, humillación, pérdida, conflicto.", reversed: "Recuperación de la derrota, lecciones aprendidas." },
        "6": { keyword: "Tránsito", upright: "Transición, viaje, cambio de estado, progreso.", reversed: "Resistencia al cambio, viaje cancelado, estancamiento." },
        "7": { keyword: "Estrategia", upright: "Estrategia, cautela, planificación, escape.", reversed: "Confrontación directa, estrategia fallida, ser descubierto." },
        "8": { keyword: "Atadura", upright: "Restricción, victimización, limitaciones, prisión.", reversed: "Liberación, auto-empoderamiento, escape." },
        "9": { keyword: "Ansiedad", upright: "Ansiedad, pesadillas, culpa, depresión.", reversed: "Esperanza, curación mental, liberación de la ansiedad." },
        "10": { keyword: "Ruina", upright: "Ruina, final doloroso, traición, colapso.", reversed: "Recuperación, nuevo amanecer, resistencia." },
        "Sota": { keyword: "Aprendizaje mental", upright: "Vigilancia, nuevas ideas, curiosidad, mensaje.", reversed: "Chismorreo, imprudencia, mal uso de información." },
        "Caballero": { keyword: "Movimiento mental", upright: "Acción impulsiva, valor, cambios bruscos.", reversed: "Imprudencia, falta de dirección, caos." },
        "Reina": { keyword: "Madurez mental", upright: "Independencia, perspicacia, experiencia, claridad.", reversed: "Crueldad, venganza, amargura." },
        "Rey": { keyword: "Dominio mental", upright: "Autoridad intelectual, verdad, juicio claro.", reversed: "Tiranía, crueldad, abuso de poder." }
    },
    "Oros": {
        "As": { keyword: "Oportunidad", upright: "Nueva oportunidad financiera, prosperidad, manifestación.", reversed: "Oportunidad perdida, codicia, materialismo." },
        "2": { keyword: "Equilibrio", upright: "Balance, adaptabilidad, gestión de tiempo y dinero.", reversed: "Desequilibrio, mala gestión, sobrecarga." },
        "3": { keyword: "Crecimiento", upright: "Trabajo en equipo, habilidad, construcción.", reversed: "Falta de trabajo en equipo, mediocridad, falta de visión." },
        "4": { keyword: "Avaricia", upright: "Seguridad, conservación, posesividad, control.", reversed: "Generosidad, gastos, pérdida de control." },
        "5": { keyword: "Carencia", upright: "Problemas financieros, pobreza, aislamiento.", reversed: "Recuperación financiera, ayuda, mejora." },
        "6": { keyword: "Generosidad", upright: "Generosidad, caridad, compartir, reciprocidad.", reversed: "Egoísmo, deuda, strings attached." },
        "7": { keyword: "Espera", upright: "Evaluación, paciencia, recompensa a largo plazo.", reversed: "Impaciencia, falta de recompensa, trabajo sin frutos." },
        "8": { keyword: "Dedicación", upright: "Artesanía, habilidad, trabajo duro, dedicación.", reversed: "Falta de atención, trabajo de mala calidad, falta de pasión." },
        "9": { keyword: "Logro", upright: "Logro personal, lujo, independencia financiera.", reversed: "Dependencia, pérdida de logros, vacío material." },
        "10": { keyword: "Prosperidad", upright: "Riqueza, herencia, familia, legado, seguridad.", reversed: "Pérdida financiera, problemas familiares, inestabilidad." },
        "Sota": { keyword: "Aprendizaje material", upright: "Oportunidad de estudio, mensaje sobre dinero, manifestación.", reversed: "Falta de concentración, mensajes sobre pérdidas." },
        "Caballero": { keyword: "Movimiento material", upright: "Eficiencia, trabajo duro, responsabilidad.", reversed: "Pereza, falta de compromiso, trabajo incompleto." },
        "Reina": { keyword: "Madurez material", upright: "Practicidad, seguridad, generosidad, abundancia.", reversed: "Codicia, inseguridad, desconfianza." },
        "Rey": { keyword: "Dominio material", upright: "Éxito financiero, liderazgo empresarial, generosidad.", reversed: "Avaricia, corrupción, materialismo excesivo." }
    }
};