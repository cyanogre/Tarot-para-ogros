// Este archivo ahora es autocontenido. Define los textos y los estilos para las palabras clave.

function injectGrumStyles() {
    // No te preocupes por este trozo de código, criatura.
    // Es solo un hechizo para que mis palabras brillen un poco.
    const styleId = 'grum-fallback-styles';
    if (document.getElementById(styleId)) return; // El hechizo ya fue lanzado.

    const style = document.createElement('style');
    style.id = styleId;
    style.innerHTML = `
        @keyframes grum-glow {
            0% {
                text-shadow: 0 0 3px rgba(230, 200, 142, 0.7), 0 0 5px rgba(230, 200, 142, 0.5);
                color: #f0e6d2;
            }
            50% {
                text-shadow: 0 0 6px rgba(255, 239, 197, 1), 0 0 12px rgba(255, 239, 197, 0.7);
                color: #ffffff;
            }
            100% {
                text-shadow: 0 0 3px rgba(230, 200, 142, 0.7), 0 0 5px rgba(230, 200, 142, 0.5);
                color: #f0e6d2;
            }
        }

        .grum-keyword {
            color: #f0e6d2;
            font-weight: bold;
            animation: grum-glow 3s ease-in-out infinite;
        }
    `;
    document.head.appendChild(style);
}

const OGRE_FALLBACKS = {
    // --- ARCANOS MAYORES ---
    "El Loco": {
        upright: `Un acantilado no es un final, es una <span class="grum-keyword">invitación</span>. El universo te empuja a <span class="grum-keyword">saltar</span>. Deja de mirar abajo con miedo y empieza a <span class="grum-keyword">imaginar</span> cómo volar. El primer paso es el más tonto y el más <span class="grum-keyword">importante</span>.`,
        reversed: `¡Eh, para el carro! Estás a punto de saltar, pero con los ojos cerrados y a un charco de barro. Un poco de <span class="grum-keyword">planificación</span> no te vendría mal. No confundas <span class="grum-keyword">valentía</span> con <span class="grum-keyword">estupidez</span>.`
    },
    "El Mago": {
        upright: `No pidas más herramientas, ya las tienes <span class="grum-keyword">todas</span> sobre la mesa. El <span class="grum-keyword">poder</span> no está en lo que tienes, sino en lo que <span class="grum-keyword">haces</span> con ello. Mueve las manos y crea tu propia suerte, criatura.`,
        reversed: `Tienes todo para triunfar, pero usas el martillo para espantarte las moscas. Estás <span class="grum-keyword">desperdiciando</span> tu poder o, peor, <span class="grum-keyword">manipulando</span>. Aclara tus <span class="grum-keyword">intenciones</span>.`
    },
    "La Sacerdotisa": {
        upright: `Hay un saber más profundo que el de los libros. Está en el <span class="grum-keyword">silencio</span>, detrás del velo. Calla la mente y escucha con las <span class="grum-keyword">tripas</span>. La respuesta que buscas <span class="grum-keyword">ya la tienes</span>.`,
        reversed: `Estás ignorando tu <span class="grum-keyword">intuición</span> a gritos. O quizás hay <span class="grum-keyword">secretos</span> y chismes nublando tu juicio. No te fíes de las apariencias y busca la <span class="grum-keyword">verdad</span> oculta.`
    },
    "La Emperatriz": {
        upright: `La tierra es fértil. Es hora de <span class="grum-keyword">plantar</span>, de <span class="grum-keyword">nutrir</span>, de crear vida. No hablo solo de hijos, sino de <span class="grum-keyword">ideas</span>, de proyectos. Cuida de tu jardín y te dará de comer.`,
        reversed: `Tu jardín se está secando. O estás <span class="grum-keyword">bloqueado</span> creativamente o dependes demasiado de otros. Reconecta con tu <span class="grum-keyword">propio poder</span> de dar vida.`
    },
    "El Emperador": {
        upright: `El caos es agotador. Necesitas <span class="grum-keyword">cimientos</span>, <span class="grum-keyword">reglas</span>, un trono desde el que gobernar tu vida. Construye tus muros para <span class="grum-keyword">proteger</span> lo que importa, no para encerrarte.`,
        reversed: `Te has pasado de rey a <span class="grum-keyword">tirano</span>. Demasiado control, cero flexibilidad. O quizás es al revés, y tu vida es un caos sin <span class="grum-keyword">disciplina</span>. Busca el equilibrio.`
    },
    "El Hierofante": {
        upright: `Hay sabiduría en las viejas historias, en las <span class="grum-keyword">tradiciones</span>. No tienes que reinventar la rueda. Busca un <span class="grum-keyword">maestro</span> o una enseñanza que te dé la <span class="grum-keyword">llave</span> que te falta.`,
        reversed: `Las viejas reglas ya no te sirven. Es hora de <span class="grum-keyword">cuestionarlo todo</span> y forjar tu <span class="grum-keyword">propio camino</span>. Rompe las normas, pero hazlo con <span class="grum-keyword">sabiduría</span>, no por simple rebeldía.`
    },
     "Los Enamorados": {
        upright: `Una <span class="grum-keyword">elección</span> te define. No es solo entre dos caminos, es entre quién eres y quién <span class="grum-keyword">quieres ser</span>. Elige con el <span class="grum-keyword">corazón</span>, pero que no se te olvide el cerebro en casa.`,
        reversed: `Hay <span class="grum-keyword">conflicto</span> en tus relaciones o en tus valores. Una mala decisión te ha llevado a un punto de <span class="grum-keyword">desarmonía</span>. Toca reevaluar qué es lo que de verdad <span class="grum-keyword">importa</span>.`
    },
    "El Carro": {
        upright: `Tu <span class="grum-keyword">voluntad</span> es un carro tirado por bestias opuestas. Si no agarras las riendas con <span class="grum-keyword">fuerza y decisión</span>, te quedarás en el fango. ¡<span class="grum-keyword">Enfócate</span> y avanza!`,
        reversed: `Vas <span class="grum-keyword">sin rumbo</span>, a toda velocidad y sin frenos. Esa energía sin control te va a estrellar. <span class="grum-keyword">Para</span>, respira y define un <span class="grum-keyword">destino claro</span>.`
    },
    "La Justicia": {
        upright: `La balanza siempre encuentra su <span class="grum-keyword">equilibrio</span>. Cada acto tiene su eco. Asume tus <span class="grum-keyword">verdades</span>, paga tus <span class="grum-keyword">deudas</span> y la claridad vendrá sola. No puedes engañar al universo.`,
        reversed: `Sientes que el mundo es <span class="grum-keyword">injusto</span> contigo. Quizás no estás siendo honesto contigo mismo sobre tu parte de <span class="grum-keyword">responsabilidad</span>. La <span class="grum-keyword">verdad</span>, aunque duela, es el único camino.`
    },
    "El Ermitaño": {
        upright: `Aléjate del <span class="grum-keyword">ruido</span> del mundo. Necesitas tu propia <span class="grum-keyword">luz</span> para ver el camino. La <span class="grum-keyword">soledad</span> no es un castigo, es una oportunidad para <span class="grum-keyword">encontrarte</span>.`,
        reversed: `Una cosa es buscar la soledad y otra <span class="grum-keyword">aislarse</span> por miedo o terquedad. Estás rechazando ayuda valiosa. <span class="grum-keyword">Sal</span> un poco de la cueva, criatura.`
    },
    "La Fortuna": {
        upright: `La vida <span class="grum-keyword">sube y baja</span>, como una rueda loca. No te aferres a la cima ni te desesperes en el fondo. Aprende a <span class="grum-keyword">bailar con el cambio</span>, pues es lo único que nunca cambia.`,
        reversed: `Parece que la rueda se ha atascado en el <span class="grum-keyword">barro</span>. Te resistes a un cambio necesario y eso solo trae <span class="grum-keyword">mala suerte</span>. <span class="grum-keyword">Suelta</span> y deja que la rueda gire.`
    },
    "La Fuerza": {
        upright: `La verdadera fuerza no ruge, <span class="grum-keyword">susurra</span>. Es la <span class="grum-keyword">paciencia</span> para domar a tu bestia interior con una caricia, no con un látigo. El <span class="grum-keyword">autocontrol</span> es tu mayor poder.`,
        reversed: `Tu bestia interior te está dominando. La <span class="grum-keyword">duda</span>, el <span class="grum-keyword">miedo</span> o la <span class="grum-keyword">ira</span> te controlan. Respira hondo y recuerda la <span class="grum-keyword">fuerza serena</span> que hay en ti.`
    },
    "El Colgado": {
        upright: `Para ganar una nueva <span class="grum-keyword">perspectiva</span>, a veces tienes que poner tu mundo <span class="grum-keyword">patas arriba</span>. Ríndete, <span class="grum-keyword">suelta el control</span>. La claridad a menudo llega cuando dejas de <span class="grum-keyword">luchar</span>.`,
        reversed: `Te estás <span class="grum-keyword">sacrificando</span> para nada. Tu esfuerzo es inútil porque te resistes a la lección. Deja de hacerte la <span class="grum-keyword">víctima</span> y aprende lo que tengas que aprender.`
    },
    "La Muerte": {
        upright: `No temas. No es el final, es la <span class="grum-keyword">poda</span>. Hay que cortar las ramas secas para que el árbol crezca fuerte. Deja <span class="grum-keyword">morir</span> lo que ya no sirve. El <span class="grum-keyword">renacimiento</span> espera.`,
        reversed: `Te <span class="grum-keyword">aferras</span> a lo muerto, por miedo a lo nuevo. El <span class="grum-keyword">estancamiento</span> huele a podrido. Acepta el <span class="grum-keyword">cambio</span> de una vez, es inevitable.`
    },
    "La Templanza": {
        upright: `La magia está en la <span class="grum-keyword">mezcla</span>. Ni todo blanco, ni todo negro. Combina los opuestos de tu vida con <span class="grum-keyword">paciencia</span> y encontrarás la <span class="grum-keyword">armonía</span>. Es un arte, no una ciencia.`,
        reversed: `Te has ido a un <span class="grum-keyword">extremo</span>. Demasiado de algo, demasiado poco de otra cosa. Este <span class="grum-keyword">desequilibrio</span> te está pasando factura. Vuelve al <span class="grum-keyword">centro</span>.`
    },
    "El Diablo": {
        upright: `Esas <span class="grum-keyword">cadenas</span> que sientes... míralas bien. Están flojas. Eres <span class="grum-keyword">esclavo</span> de tus deseos y miedos porque quieres. La <span class="grum-keyword">libertad</span> está en reconocer tu propia jaula.`,
        reversed: `¡Estás <span class="grum-keyword">rompiendo las cadenas</span>! Te estás dando cuenta de tus ataduras y buscando la <span class="grum-keyword">libertad</span>. Es un proceso duro, pero vas por buen camino. Sigue así.`
    },
    "La Torre": {
        upright: `¡CRACK! La mentira se <span class="grum-keyword">derrumba</span>. Duele, sí. Pero es mejor vivir entre ruinas de <span class="grum-keyword">verdad</span> que en un castillo de <span class="grum-keyword">falsedades</span>. Ahora, a <span class="grum-keyword">reconstruir</span> sobre cimientos sólidos.`,
        reversed: `Sabes que la torre se va a caer, pero te <span class="grum-keyword">niegas a salir</span>. Evitar el desastre solo hará que la caída sea peor. <span class="grum-keyword">Acepta</span> la crisis y sálvate.`
    },
    "La Estrella": {
        upright: `Tras la tormenta, una luz parpadea. Es la <span class="grum-keyword">esperanza</span>, la fe desnuda. No lo arregla todo de golpe, pero te recuerda que hay un <span class="grum-keyword">camino</span> a casa. <span class="grum-keyword">Síguela</span>.`,
        reversed: `Has perdido la <span class="grum-keyword">fe</span>. Te sientes desconectado y sin guía. La estrella sigue ahí, pero la <span class="grum-keyword">desesperanza</span> te impide verla. Levanta la vista, criatura.`
    },
    "La Luna": {
        upright: `Caminas en la penumbra, donde las sombras <span class="grum-keyword">engañan</span>. La lógica no te sirve aquí. Confía en tu <span class="grum-keyword">instinto</span>, te guiará a través del <span class="grum-keyword">miedo</span> hasta el amanecer.`,
        reversed: `La <span class="grum-keyword">confusión</span> se disipa. Los miedos se revelan como simples sombras y la <span class="grum-keyword">verdad</span> empieza a salir a la luz. Estás saliendo del bosque oscuro.`
    },
    "El Sol": {
        upright: `¡<span class="grum-keyword">Claridad</span>! La verdad sale a la luz y te calienta los huesos. Es un momento de <span class="grum-keyword">alegría pura</span>, de éxito y vitalidad. Sal de la cueva y <span class="grum-keyword">disfruta</span> del día.`,
        reversed: `El sol brilla, pero tú te quedas en la sombra. Un <span class="grum-keyword">optimismo forzado</span> o un éxito que se siente vacío. Busca la <span class="grum-keyword">auténtica</span> fuente de tu alegría.`
    },
    "El Juicio": {
        upright: `Una llamada resuena desde lo más profundo. Es tu alma pidiendo <span class="grum-keyword">despertar</span>. <span class="grum-keyword">Perdona</span> tu pasado, acepta tus lecciones y reintégrate. Es hora de tu <span class="grum-keyword">renacimiento</span>.`,
        reversed: `Te juzgas con demasiada <span class="grum-keyword">dureza</span> o ignoras la llamada para cambiar. La <span class="grum-keyword">duda</span> y el <span class="grum-keyword">autocastigo</span> te impiden avanzar. Es hora de <span class="grum-keyword">perdonarte</span>.`
    },
    "El Mundo": {
        upright: `El círculo se ha <span class="grum-keyword">completado</span>. Has llegado, has aprendido, has <span class="grum-keyword">integrado</span> la lección. <span class="grum-keyword">Celebra</span> este final, porque cada final es el glorioso <span class="grum-keyword">comienzo</span> de un nuevo viaje.`,
        reversed: `Te falta algo para <span class="grum-keyword">cerrar el ciclo</span>. Un cabo suelto, una lección a medias. No busques atajos, vuelve atrás y termina lo que empezaste. Solo así podrás <span class="grum-keyword">avanzar</span> de verdad.`
    },

    // --- ARCANOS MENORES ---
    "As de Bastos": {
        upright: `Una <span class="grum-keyword">chispa</span>. El potencial puro de una nueva <span class="grum-keyword">pasión</span> o proyecto. Tienes una antorcha en la mano, ahora ve y enciende una <span class="grum-keyword">hoguera</span> con ella.`,
        reversed: `Esa chispa se apagó antes de empezar. Falta de <span class="grum-keyword">energía</span>, <span class="grum-keyword">retrasos</span> o una idea que no era tan buena. Espera a que sople el viento de nuevo.`
    },
    "2 de Bastos": {
        upright: `Estás en lo alto de tu torre, mirando el mundo. <span class="grum-keyword">Planear</span> está bien, criatura, pero el mapa no es el camino. Es hora de <span class="grum-keyword">actuar</span>.`,
        reversed: `Miedo a lo desconocido. Te quedas en tu torre por <span class="grum-keyword">inseguridad</span>. Los planes no sirven de nada si no te atreves a <span class="grum-keyword">explorar</span>.`
    },
    "3 de Bastos": {
        upright: `Lo que pusiste en marcha empieza a dar <span class="grum-keyword">frutos</span>. Tus barcos regresan. Ten <span class="grum-keyword">paciencia</span> y prepárate para <span class="grum-keyword">expandirte</span>.`,
        reversed: `Los barcos se han retrasado. <span class="grum-keyword">Obstáculos</span> inesperados o mala planificación. Toca <span class="grum-keyword">revisar</span> la estrategia.`
    },
    "4 de Bastos": {
        upright: `Has construido algo <span class="grum-keyword">estable</span>. Es tiempo de <span class="grum-keyword">celebrar</span>, de encontrar la <span class="grum-keyword">paz</span> en tu hogar y con tu gente. Un respiro merecido.`,
        reversed: `Hay <span class="grum-keyword">problemas</span> en casa. La celebración se cancela por ahora. Busca la raíz del <span class="grum-keyword">conflicto</span> y arréglala.`
    },
    "5 de Bastos": {
        upright: `Un conflicto de egos, una <span class="grum-keyword">lucha</span> sin sentido. No gastes tu energía en peleas tontas. A veces es mejor ser <span class="grum-keyword">listo</span> que ser el más fuerte.`,
        reversed: `Estás <span class="grum-keyword">evitando</span> un conflicto necesario, o la lucha interna te está agotando. A veces hay que <span class="grum-keyword">chocar</span> para encontrar una solución.`
    },
    "6 de Bastos": {
        upright: `La <span class="grum-keyword">victoria</span> es tuya y todos la ven. Disfruta del <span class="grum-keyword">reconocimiento</span>, pero recuerda que el verdadero triunfo es el <span class="grum-keyword">respeto</span> que te tienes a ti mismo.`,
        reversed: `Una victoria vacía o el <span class="grum-keyword">miedo</span> a que te quiten el puesto. La <span class="grum-keyword">arrogancia</span> puede hacer que te caigas del caballo.`
    },
    "7 de Bastos": {
        upright: `<span class="grum-keyword">Defiende</span> tu posición. Lucharás solo contra muchos, pero estás en un terreno más alto. <span class="grum-keyword">Cree</span> en lo que defiendes y mantente <span class="grum-keyword">firme</span>.`,
        reversed: `Te sientes <span class="grum-keyword">abrumado</span> y a punto de rendirte. Quizás estás luchando una batalla que no puedes ganar o has perdido la <span class="grum-keyword">confianza</span>.`
    },
    "8 de Bastos": {
        upright: `Todo se <span class="grum-keyword">acelera</span>. Noticias que llegan, viajes, progreso <span class="grum-keyword">rápido</span>. No es momento de dudar, es momento de <span class="grum-keyword">actuar</span> y seguir el flujo.`,
        reversed: `Las cosas se <span class="grum-keyword">frenan</span> en seco. <span class="grum-keyword">Retrasos</span>, frustración y mala comunicación. <span class="grum-keyword">Paciencia</span>, no puedes empujar un río.`
    },
    "9 de Bastos": {
        upright: `Estás <span class="grum-keyword">herido pero no vencido</span>. Eres más <span class="grum-keyword">resistente</span> de lo que crees. Esta es la última prueba antes del descanso. <span class="grum-keyword">Aguanta</span>.`,
        reversed: `Estás a la defensiva, <span class="grum-keyword">paranoico</span>. Te rindes antes de la última batalla o te niegas a bajar la guardia cuando ya no hay peligro.`
    },
    "10 de Bastos": {
        upright: `Cargas con el peso de un bosque entero. Admirable, pero estúpido. Aprende a <span class="grum-keyword">delegar</span> o a <span class="grum-keyword">soltar</span> lo que no es tuyo antes de que te partas la espalda.`,
        reversed: `¡Por fin! Estás <span class="grum-keyword">soltando</span> esa carga tan pesada. Te das cuenta de que no tienes que hacerlo todo tú. <span class="grum-keyword">Liberación</span> a la vista.`
    },
     "Sota de Bastos": {
        upright: `Un estallido de <span class="grum-keyword">energía</span> para explorar algo nuevo. Sé <span class="grum-keyword">curioso</span>, aventúrate. Llegan mensajes que invitan a la <span class="grum-keyword">acción</span>.`,
        reversed: `Una idea que no arranca. <span class="grum-keyword">Indecisión</span>, falta de pasión. No sabes por dónde empezar, así que no empiezas. <span class="grum-keyword">Aclárate</span>.`
    },
    "Caballero de Bastos": {
        upright: `Pura <span class="grum-keyword">acción</span> y <span class="grum-keyword">pasión</span>. Lánzate a la aventura, muévete, viaja. Pero cuidado, este caballero a veces es más rápido que listo.`,
        reversed: `<span class="grum-keyword">Impulsividad</span> sin control. Empiezas muchas cosas y no terminas ninguna. <span class="grum-keyword">Frustración</span> y energía desperdiciada. <span class="grum-keyword">Frena</span> un poco.`
    },
    "Reina de Bastos": {
        upright: `Una persona <span class="grum-keyword">carismática</span>, segura y llena de vida. Sé como ella: <span class="grum-keyword">independiente</span>, <span class="grum-keyword">creativa</span> y con una energía que contagia.`,
        reversed: `Una energía <span class="grum-keyword">exigente</span> o <span class="grum-keyword">celosa</span>. Puedes ser tú o alguien cercano. Cuidado con el <span class="grum-keyword">drama</span> y la <span class="grum-keyword">intolerancia</span>.`
    },
    "Rey de Bastos": {
        upright: `Un <span class="grum-keyword">líder</span> nato, con una visión clara y la energía para llevarla a cabo. Es el momento de <span class="grum-keyword">tomar el mando</span> de tu vida con <span class="grum-keyword">audacia</span>.`,
        reversed: `Un líder que se ha convertido en <span class="grum-keyword">déspota</span>. Impaciente, <span class="grum-keyword">autoritario</span>. No impongas tu voluntad, <span class="grum-keyword">inspira</span> a otros a seguirte.`
    },
    "As de Copas": {
        upright: `Tu corazón se <span class="grum-keyword">desborda</span> con un nuevo sentimiento. Amor, compasión, alegría... Permite que <span class="grum-keyword">fluya</span>, no construyas una presa.`,
        reversed: `Estás <span class="grum-keyword">bloqueando</span> tus emociones. Un amor no correspondido o miedo a sentir. Tu copa está volcada, no dejes que se vacíe del todo.`
    },
    "2 de Copas": {
        upright: `Un encuentro de almas. Un brindis. Esta <span class="grum-keyword">conexión</span> es genuina y <span class="grum-keyword">recíproca</span>. Cuídala, porque es un tesoro.`,
        reversed: `Hay <span class="grum-keyword">desequilibrio</span> en la relación. Uno da más que el otro. <span class="grum-keyword">Falta de confianza</span> o una <span class="grum-keyword">ruptura</span> dolorosa.`
    },
    "3 de Copas": {
        upright: `La <span class="grum-keyword">alegría compartida</span> es triple alegría. <span class="grum-keyword">Celebra</span> con tu gente, tu tribu. La <span class="grum-keyword">comunidad</span> sana y fortalece.`,
        reversed: `Una celebración que acaba mal o te sientes <span class="grum-keyword">excluido</span> del grupo. El <span class="grum-keyword">cotilleo</span> o la <span class="grum-keyword">juerga</span> excesiva te están aislando.`
    },
    "4 de Copas": {
        upright: `Te <span class="grum-keyword">aburres</span> en medio de la abundancia. Quizás no estás mirando bien las copas que te ofrecen. Abre los ojos a nuevas <span class="grum-keyword">posibilidades</span>.`,
        reversed: `¡Por fin! Sales de tu <span class="grum-keyword">apatía</span>. Te das cuenta de las oportunidades que estabas ignorando y te pones en <span class="grum-keyword">marcha</span>.`
    },
    "5 de Copas": {
        upright: `Lloras por la leche derramada, sin ver que todavía tienes vino. Acepta la <span class="grum-keyword">pérdida</span>, pero no dejes que te ciegue a lo que <span class="grum-keyword">aún conservas</span>.`,
        reversed: `Estás empezando a <span class="grum-keyword">perdonar</span> y a <span class="grum-keyword">aceptar</span> el pasado. Te das la vuelta y ves las copas que aún están llenas. El <span class="grum-keyword">duelo</span> está terminando.`
    },
    "6 de Copas": {
        upright: `El pasado llama. Un regalo de la <span class="grum-keyword">nostalgia</span>. Es bonito recordar, pero no te quedes <span class="grum-keyword">atrapado</span> en un ayer que ya no existe.`,
        reversed: `Estás <span class="grum-keyword">atrapado en el pasado</span>, idealizándolo y sin querer avanzar. Suelta la <span class="grum-keyword">nostalgia</span> que te frena.`
    },
    "7 de Copas": {
        upright: `Cuidado con los <span class="grum-keyword">castillos en el aire</span>. Tienes muchas opciones, pero la mayoría son <span class="grum-keyword">ilusiones</span>. Enfócate en lo <span class="grum-keyword">real</span> o te perderás en fantasías.`,
        reversed: `Se acabaron las ensoñaciones. Tienes los <span class="grum-keyword">pies en la tierra</span> y ves las cosas con <span class="grum-keyword">claridad</span>. Es hora de tomar una <span class="grum-keyword">decisión</span> basada en la realidad.`
    },
    "8 de Copas": {
        upright: `Hay que saber <span class="grum-keyword">cuándo marcharse</span>. Dejar atrás lo conocido, aunque duela, para buscar un <span class="grum-keyword">significado más profundo</span>. Tu alma tiene sed de más.`,
        reversed: `Tienes <span class="grum-keyword">miedo</span> de marcharte. Te quedas en una situación insatisfactoria por comodidad o por temor a lo desconocido. ¿<span class="grum-keyword">Vale la pena</span>?`
    },
    "9 de Copas": {
        upright: `El gato gordo y feliz. Estás <span class="grum-keyword">satisfecho</span>, tus deseos se han <span class="grum-keyword">cumplido</span>. Disfruta de esta <span class="grum-keyword">plenitud</span>, pero cuidado con la autocomplacencia.`,
        reversed: `Tu deseo se ha cumplido, pero no te sientes lleno. <span class="grum-keyword">Insatisfacción</span>, <span class="grum-keyword">codicia</span>. Quizás lo que deseabas no era lo que <span class="grum-keyword">necesitabas</span>.`
    },
    "10 de Copas": {
        upright: `La <span class="grum-keyword">armonía perfecta</span> en el hogar y en el corazón. Es un arcoíris emocional. <span class="grum-keyword">Valora</span> este momento de <span class="grum-keyword">paz y amor</span> compartido.`,
        reversed: `La imagen de familia feliz está <span class="grum-keyword">rota</span>. <span class="grum-keyword">Conflictos</span> en casa o valores que no se alinean. Hay que <span class="grum-keyword">trabajar</span> para recuperar la armonía.`
    },
    "Sota de Copas": {
        upright: `Un <span class="grum-keyword">soñador</span> con el corazón abierto. Sé <span class="grum-keyword">receptivo</span> a los mensajes de tu intuición y a las nuevas <span class="grum-keyword">emociones</span> que llegan.`,
        reversed: `Andas con el corazón <span class="grum-keyword">bloqueado</span> por una herida pasada. <span class="grum-keyword">Inmadurez emocional</span> o miedo a ser vulnerable. Toca <span class="grum-keyword">sanar</span>.`
    },
    "Caballero de Copas": {
        upright: `El <span class="grum-keyword">romántico</span> del mazo. Sigue a tu corazón, haz una oferta de paz, sé el <span class="grum-keyword">mensajero del amor</span>. La acción es guiada por la <span class="grum-keyword">emoción</span>.`,
        reversed: `Un Casanova de tres al cuarto. <span class="grum-keyword">Promesas vacías</span>, celos y <span class="grum-keyword">mal humor</span>. Cuidado con el <span class="grum-keyword">engaño emocional</span>, ya sea tuyo o de otro.`
    },
    "Reina de Copas": {
        upright: `La <span class="grum-keyword">maestra de la intuición</span> y la compasión. Conecta con tu lado <span class="grum-keyword">empático</span> y sanador. Escucha a los demás y a ti mismo con el <span class="grum-keyword">corazón</span>.`,
        reversed: `Tus emociones te <span class="grum-keyword">desbordan</span>. Te ahogas en un vaso de agua. O te has vuelto <span class="grum-keyword">dependiente</span> o <span class="grum-keyword">manipulador</span>. Necesitas poner límites.`
    },
    "Rey de Copas": {
        upright: `El <span class="grum-keyword">equilibrio</span> perfecto entre corazón y mente. Eres <span class="grum-keyword">compasivo pero firme</span>, diplomático y calmado. Domina tus emociones sin reprimirlas.`,
        reversed: `Un torbellino emocional. <span class="grum-keyword">Chantaje emocional</span>, <span class="grum-keyword">mal humor</span> o frialdad para esconder tu vulnerabilidad. Tus emociones te controlan.`
    },
    "As de Espadas": {
        upright: `Un momento de <span class="grum-keyword">claridad absoluta</span>. Una idea que <span class="grum-keyword">corta la niebla</span> de la confusión. La <span class="grum-keyword">verdad</span> puede doler, pero <span class="grum-keyword">libera</span>. Empuña esta espada.`,
        reversed: `<span class="grum-keyword">Confusión</span> total. Una mala decisión o una idea que no lleva a ninguna parte. No tomes decisiones importantes hasta que se aclare el <span class="grum-keyword">panorama</span>.`
    },
    "2 de Espadas": {
        upright: `Estás en una <span class="grum-keyword">tregua</span> forzada, negándote a <span class="grum-keyword">ver la realidad</span>. No puedes mantener el equilibrio para siempre. Tarde o temprano, tendrás que <span class="grum-keyword">decidir</span>.`,
        reversed: `La decisión te está <span class="grum-keyword">desbordando</span>. Te sientes <span class="grum-keyword">paralizado</span> por la duda. A veces, no decidir es la peor decisión de todas.`
    },
    "3 de Espadas": {
        upright: `El <span class="grum-keyword">dolor</span> que parte el alma. No intentes ignorarlo. Esa <span class="grum-keyword">herida</span> necesita aire. Siente la tormenta, solo así el cielo volverá a <span class="grum-keyword">aclararse</span>.`,
        reversed: `Estás empezando a <span class="grum-keyword">sacar las espadas</span>. El proceso de <span class="grum-keyword">sanación</span> y <span class="grum-keyword">perdón</span> ha comenzado. Aún duele, pero ya ves la luz.`
    },
    "4 de Espadas": {
        upright: `Tu mente necesita un <span class="grum-keyword">respiro</span>. Retírate del campo de batalla, guarda tus espadas y <span class="grum-keyword">medita</span>. La <span class="grum-keyword">recuperación</span> es una estrategia, no una debilidad.`,
        reversed: `O te niegas a descansar y vas directo al <span class="grum-keyword">agotamiento</span>, o el descanso se ha convertido en <span class="grum-keyword">estancamiento</span>. Es hora de volver a la <span class="grum-keyword">acción</span>.`
    },
    "5 de Espadas": {
        upright: `Una <span class="grum-keyword">victoria pírrica</span>. Has ganado la batalla, pero has <span class="grum-keyword">perdido</span> el honor o a tus amigos. A veces, la mejor victoria es saber <span class="grum-keyword">cuándo retirarse</span>.`,
        reversed: `El conflicto está llegando a su fin. Hay una oportunidad para el <span class="grum-keyword">perdón</span> y la <span class="grum-keyword">reconciliación</span>. Guarda la espada y tiende un puente.`
    },
    "6 de Espadas": {
        upright: `Dejar atrás las <span class="grum-keyword">aguas turbulentas</span>. Es un viaje mental o físico hacia un lugar más <span class="grum-keyword">tranquilo</span>. La <span class="grum-keyword">lógica</span> y la <span class="grum-keyword">calma</span> te guían ahora.`,
        reversed: `El viaje se ha <span class="grum-keyword">estancado</span>. Te sientes <span class="grum-keyword">atrapado</span> entre la orilla que dejaste y la que no alcanzas. Quizás el problema no está fuera, sino <span class="grum-keyword">dentro</span>.`
    },
    "7 de Espadas": {
        upright: `Actúas con <span class="grum-keyword">sigilo</span>, quizás no del todo <span class="grum-keyword">honestamente</span>. La estrategia es válida, pero asegúrate de no estar <span class="grum-keyword">engañándote a ti mismo</span>.`,
        reversed: `Es hora de <span class="grum-keyword">confesar</span>. Los secretos y las mentiras te pesan. La <span class="grum-keyword">honestidad</span>, aunque sea difícil, te liberará.`
    },
    "8 de Espadas": {
        upright: `Te sientes <span class="grum-keyword">atrapado</span> por tus propios <span class="grum-keyword">pensamientos</span>. Mira bien, las espadas no te rodean del todo. La <span class="grum-keyword">jaula es mental</span>, y tú tienes la llave para salir.`,
        reversed: `¡Estás <span class="grum-keyword">abriendo los ojos</span>! Te das cuenta de que tus <span class="grum-keyword">limitaciones</span> son autoimpuestas y empiezas a buscar la <span class="grum-keyword">salida</span>. La libertad está cerca.`
    },
    "9 de Espadas": {
        upright: `La <span class="grum-keyword">angustia</span> nocturna. Los <span class="grum-keyword">miedos</span> que te atormentan en la oscuridad. La mayoría son <span class="grum-keyword">fantasmas</span> de tu propia mente. <span class="grum-keyword">Enciende una luz</span>.`,
        reversed: `La <span class="grum-keyword">pesadilla</span> está terminando. Buscas ayuda, enfrentas tus miedos y la <span class="grum-keyword">esperanza</span> empieza a filtrarse. La <span class="grum-keyword">luz</span> del día llega.`
    },
    "10 de Espadas": {
        upright: `Has <span class="grum-keyword">tocado fondo</span>. Es el <span class="grum-keyword">final absoluto</span> de una situación dolorosa. No hay más bajo a donde caer. Ahora, solo puedes <span class="grum-keyword">levantarte</span> y empezar de nuevo.`,
        reversed: `Has sobrevivido a la catástrofe y estás en proceso de <span class="grum-keyword">recuperación</span>. La herida es profunda, pero no fue mortal. Estás <span class="grum-keyword">sanando</span>.`
    },
    "Sota de Espadas": {
        upright: `Mucha <span class="grum-keyword">energía mental</span>, curiosidad y ganas de aprender. Pero también puede ser un chismoso. Usa esa espada para <span class="grum-keyword">buscar la verdad</span>, no para meter cizaña.`,
        reversed: `Hablar por hablar. Cuidado con lo que dices, o con la <span class="grum-keyword">información</span> que recibes. Las palabras pueden ser más afiladas que una espada.`
    },
    "Caballero de Espadas": {
        upright: `Se lanza a la <span class="grum-keyword">acción</span> sin pensar, armado de lógica y convicción. Es <span class="grum-keyword">directo</span> y eficaz, pero puede ser un poco bestia.`,
        reversed: `Un <span class="grum-keyword">fanfarrón</span> que va de listo. Su agresividad y falta de tacto causan más problemas de los que resuelven. <span class="grum-keyword">Piensa antes de atacar</span>.`
    },
    "Reina de Espadas": {
        upright: `Una mente <span class="grum-keyword">aguda</span> y honesta. No se anda con rodeos. Usa la <span class="grum-keyword">verdad</span> y la <span class="grum-keyword">inteligencia</span> para cortar por lo sano. Valora su independencia.`,
        reversed: `Una persona <span class="grum-keyword">fría</span>, amargada y criticona. Puede que seas tú o alguien que te rodea. La inteligencia sin <span class="grum-keyword">corazón</span> es un arma peligrosa.`
    },
    "Rey de Espadas": {
        upright: `El <span class="grum-keyword">estratega</span> maestro. Su juicio es <span class="grum-keyword">claro</span>, <span class="grum-keyword">ético</span> e <span class="grum-keyword">imparcial</span>. Es la autoridad de la <span class="grum-keyword">verdad</span> y la <span class="grum-keyword">ley</span>.`,
        reversed: `Un <span class="grum-keyword">tirano intelectual</span>. Abusa de su poder y su inteligencia para <span class="grum-keyword">manipular</span> y controlar. Su juicio es <span class="grum-keyword">frío</span> y <span class="grum-keyword">cruel</span>.`
    },
    "As de Oros": {
        upright: `Una <span class="grum-keyword">semilla de prosperidad</span>. Una oportunidad <span class="grum-keyword">real y tangible</span>. Plántala en buena tierra, trabájala y verás cómo crece.`,
        reversed: `Una mala <span class="grum-keyword">inversión</span> o una oportunidad perdida. Quizás estás demasiado centrado en el dinero y no ves el <span class="grum-keyword">valor real</span> de las cosas.`
    },
    "2 de Oros": {
        upright: `La vida es un juego de <span class="grum-keyword">malabares</span>. Tienes que <span class="grum-keyword">adaptarte</span>, ser <span class="grum-keyword">flexible</span> y mantener el <span class="grum-keyword">equilibrio</span> entre tus diferentes responsabilidades.`,
        reversed: `Se te han caído las pelotas. Estás <span class="grum-keyword">desbordado</span> y has tomado malas decisiones financieras. Es hora de <span class="grum-keyword">reorganizar</span> tus prioridades.`
    },
    "3 de Oros": {
        upright: `El <span class="grum-keyword">trabajo en equipo</span> da sus frutos. Tu <span class="grum-keyword">habilidad</span> es reconocida y, <span class="grum-keyword">colaborando</span>, creáis algo de gran calidad. Eres un buen artesano.`,
        reversed: `Falta de <span class="grum-keyword">cooperación</span> o un trabajo mediocre. No estás poniendo todo tu <span class="grum-keyword">esfuerzo</span> o el equipo no funciona. Hay que mejorar.`
    },
    "4 de Oros": {
        upright: `Te <span class="grum-keyword">aferras</span> a lo que tienes por <span class="grum-keyword">miedo</span> a perderlo. La seguridad es buena, pero la <span class="grum-keyword">avaricia</span> estanca. Aprende a <span class="grum-keyword">soltar</span> un poco para poder recibir más.`,
        reversed: `Estás empezando a <span class="grum-keyword">soltar</span>. Te arriesgas a gastar, a invertir, a ser más <span class="grum-keyword">generoso</span>. El miedo al cambio material se va.`
    },
    "5 de Oros": {
        upright: `Te sientes <span class="grum-keyword">abandonado</span>, en la pobreza. Pero a veces la <span class="grum-keyword">ayuda</span> está justo al lado. Levanta la cabeza y <span class="grum-keyword">pide ayuda</span>.`,
        reversed: `La <span class="grum-keyword">recuperación</span> ha comenzado. Sales del frío, encuentras ayuda y tu situación material empieza a <span class="grum-keyword">mejorar</span>. Hay luz al final del túnel.`
    },
    "6 de Oros": {
        upright: `El flujo de <span class="grum-keyword">dar y recibir</span>. La <span class="grum-keyword">generosidad</span> crea abundancia para todos. <span class="grum-keyword">Comparte</span> tus recursos, ya sea dinero, tiempo o sabiduría.`,
        reversed: `Cuidado con las <span class="grum-keyword">deudas</span> o con una generosidad que esconde <span class="grum-keyword">intereses ocultos</span>. El equilibrio entre dar y recibir está <span class="grum-keyword">roto</span>.`
    },
    "7 de Oros": {
        upright: `Has sembrado y cuidado tu cosecha. Ahora toca <span class="grum-keyword">esperar con paciencia</span>. No arranques la planta cada día para ver si crece. <span class="grum-keyword">Confía</span> en el proceso.`,
        reversed: `<span class="grum-keyword">Impaciencia</span>. Inviertes en algo que no da frutos y te frustras. Quizás es hora de <span class="grum-keyword">cambiar de estrategia</span> y plantar en otro sitio.`
    },
    "8 de Oros": {
        upright: `La <span class="grum-keyword">maestría</span> se consigue con <span class="grum-keyword">práctica y dedicación</span>. Concéntrate en tu oficio, pule tus <span class="grum-keyword">habilidades</span>. El trabajo bien hecho es su propia recompensa.`,
        reversed: `Estás haciendo las cosas de forma <span class="grum-keyword">chapucera</span>. <span class="grum-keyword">Perfeccionismo</span> que te paraliza o falta de <span class="grum-keyword">atención</span> a los detalles. No hay orgullo en tu trabajo.`
    },
    "9 de Oros": {
        upright: `Disfrutas de los frutos de tu trabajo en <span class="grum-keyword">soledad y abundancia</span>. Has logrado la <span class="grum-keyword">independencia</span>. Es un lujo que te has ganado a pulso.`,
        reversed: `Trabajas mucho, pero no <span class="grum-keyword">disfrutas</span> de tus logros. O quizás estás viviendo por encima de tus <span class="grum-keyword">posibilidades</span>. Cuidado con las apariencias.`
    },
    "10 de Oros": {
        upright: `La <span class="grum-keyword">riqueza</span> no es solo dinero, es un <span class="grum-keyword">legado</span>, una <span class="grum-keyword">familia</span>, una <span class="grum-keyword">seguridad</span> que perdura. Has construido algo <span class="grum-keyword">sólido</span> para ti y para los tuyos.`,
        reversed: `Riesgo de <span class="grum-keyword">pérdida</span> financiera o <span class="grum-keyword">conflictos</span> familiares por dinero. La base de tu seguridad se está <span class="grum-keyword">tambaleando</span>. Asegura los cimientos.`
    },
    "Sota de Oros": {
        upright: `Una <span class="grum-keyword">oportunidad</span> para aprender algo práctico y nuevo. Es un estudiante aplicado. Pon tu energía en <span class="grum-keyword">manifestar</span> tus ideas en el mundo real.`,
        reversed: `Falta de <span class="grum-keyword">planificación</span> y de sentido común. Estás perezoso o tus planes no son realistas. Toca <span class="grum-keyword">estudiar</span> más antes de actuar.`
    },
    "Caballero de Oros": {
        upright: `El más <span class="grum-keyword">trabajador</span> y fiable de todos. Avanza lento pero <span class="grum-keyword">seguro</span>. Es la rutina, la <span class="grum-keyword">persistencia</span> y el trabajo duro que da resultados.`,
        reversed: `Estás <span class="grum-keyword">estancado</span> en la rutina. Aburrimiento, <span class="grum-keyword">pereza</span>. El trabajo se vuelve una carga. Necesitas un nuevo <span class="grum-keyword">estímulo</span>.`
    },
    "Reina de Oros": {
        upright: `Una persona <span class="grum-keyword">práctica</span>, generosa y que sabe crear un hogar. Conecta con la <span class="grum-keyword">naturaleza</span> y disfruta de los placeres sencillos de la vida.`,
        reversed: `Preocupación excesiva por lo material o <span class="grum-keyword">desorden</span> en tu vida y en tu casa. Has perdido la <span class="grum-keyword">conexión</span> con lo que de verdad importa.`
    },
    "Rey de Oros": {
        upright: `Has alcanzado la <span class="grum-keyword">cima</span> del éxito material. Eres un líder <span class="grum-keyword">fiable</span>, <span class="grum-keyword">generoso</span> y seguro de sí mismo. Disfruta de tu reino.`,
        reversed: `Un materialista <span class="grum-keyword">obstinado</span>. Tacaño o corrupto. Cuidado con un jefe así. El éxito se te ha subido a la cabeza.`
    }
};
