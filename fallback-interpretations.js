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
    "El Loco": `Un acantilado no es un final, es una <span class="grum-keyword">invitación</span>. El universo te empuja a <span class="grum-keyword">saltar</span>. Deja de mirar abajo con miedo y empieza a <span class="grum-keyword">imaginar</span> cómo volar. El primer paso es el más tonto y el más <span class="grum-keyword">importante</span>.`,
    "El Mago": `No pidas más herramientas, ya las tienes <span class="grum-keyword">todas</span> sobre la mesa. El <span class="grum-keyword">poder</span> no está en lo que tienes, sino en lo que <span class="grum-keyword">haces</span> con ello. Mueve las manos y crea tu propia suerte, criatura.`,
    "La Sacerdotisa": `Hay un saber más profundo que el de los libros. Está en el <span class="grum-keyword">silencio</span>, detrás del velo. Calla la mente y escucha con las <span class="grum-keyword">tripas</span>. La respuesta que buscas <span class="grum-keyword">ya la tienes</span>.`,
    "La Emperatriz": `La tierra es fértil. Es hora de <span class="grum-keyword">plantar</span>, de <span class="grum-keyword">nutrir</span>, de crear vida. No hablo solo de hijos, sino de <span class="grum-keyword">ideas</span>, de proyectos. Cuida de tu jardín y te dará de comer.`,
    "El Emperador": `El caos es agotador. Necesitas <span class="grum-keyword">cimientos</span>, <span class="grum-keyword">reglas</span>, un trono desde el que gobernar tu vida. Construye tus muros para <span class="grum-keyword">proteger</span> lo que importa, no para encerrarte.`,
    "El Hierofante": `Hay sabiduría en las viejas historias, en las <span class="grum-keyword">tradiciones</span>. No tienes que reinventar la rueda. Busca un <span class="grum-keyword">maestro</span> o una enseñanza que te dé la <span class="grum-keyword">llave</span> que te falta.`,
    "Los Enamorados": `Una <span class="grum-keyword">elección</span> te define. No es solo entre dos caminos, es entre quién eres y quién <span class="grum-keyword">quieres ser</span>. Elige con el <span class="grum-keyword">corazón</span>, pero que no se te olvide el cerebro en casa.`,
    "El Carro": `Tu <span class="grum-keyword">voluntad</span> es un carro tirado por bestias opuestas. Si no agarras las riendas con <span class="grum-keyword">fuerza y decisión</span>, te quedarás en el fango. ¡<span class="grum-keyword">Enfócate</span> y avanza!`,
    "La Justicia": `La balanza siempre encuentra su <span class="grum-keyword">equilibrio</span>. Cada acto tiene su eco. Asume tus <span class="grum-keyword">verdades</span>, paga tus <span class="grum-keyword">deudas</span> y la claridad vendrá sola. No puedes engañar al universo.`,
    "El Ermitaño": `Aléjate del <span class="grum-keyword">ruido</span> del mundo. Necesitas tu propia <span class="grum-keyword">luz</span> para ver el camino. La <span class="grum-keyword">soledad</span> no es un castigo, es una oportunidad para <span class="grum-keyword">encontrarte</span>.`,
    "La Fortuna": `La vida <span class="grum-keyword">sube y baja</span>, como una rueda loca. No te aferres a la cima ni te desesperes en el fondo. Aprende a <span class="grum-keyword">bailar con el cambio</span>, pues es lo único que nunca cambia.`,
    "La Fuerza": `La verdadera fuerza no ruge, <span class="grum-keyword">susurra</span>. Es la <span class="grum-keyword">paciencia</span> para domar a tu bestia interior con una caricia, no con un látigo. El <span class="grum-keyword">autocontrol</span> es tu mayor poder.`,
    "El Colgado": `Para ganar una nueva <span class="grum-keyword">perspectiva</span>, a veces tienes que poner tu mundo <span class="grum-keyword">patas arriba</span>. Ríndete, <span class="grum-keyword">suelta el control</span>. La claridad a menudo llega cuando dejas de <span class="grum-keyword">luchar</span>.`,
    "La Muerte": `No temas. No es el final, es la <span class="grum-keyword">poda</span>. Hay que cortar las ramas secas para que el árbol crezca fuerte. Deja <span class="grum-keyword">morir</span> lo que ya no sirve. El <span class="grum-keyword">renacimiento</span> espera.`,
    "La Templanza": `La magia está en la <span class="grum-keyword">mezcla</span>. Ni todo blanco, ni todo negro. Combina los opuestos de tu vida con <span class="grum-keyword">paciencia</span> y encontrarás la <span class="grum-keyword">armonía</span>. Es un arte, no una ciencia.`,
    "El Diablo": `Esas <span class="grum-keyword">cadenas</span> que sientes... míralas bien. Están flojas. Eres <span class="grum-keyword">esclavo</span> de tus deseos y miedos porque quieres. La <span class="grum-keyword">libertad</span> está en reconocer tu propia jaula.`,
    "La Torre": `¡CRACK! La mentira se <span class="grum-keyword">derrumba</span>. Duele, sí. Pero es mejor vivir entre ruinas de <span class="grum-keyword">verdad</span> que en un castillo de <span class="grum-keyword">falsedades</span>. Ahora, a <span class="grum-keyword">reconstruir</span> sobre cimientos sólidos.`,
    "La Estrella": `Tras la tormenta, una luz parpadea. Es la <span class="grum-keyword">esperanza</span>, la fe desnuda. No lo arregla todo de golpe, pero te recuerda que hay un <span class="grum-keyword">camino</span> a casa. <span class="grum-keyword">Síguela</span>.`,
    "La Luna": `Caminas en la penumbra, donde las sombras <span class="grum-keyword">engañan</span>. La lógica no te sirve aquí. Confía en tu <span class="grum-keyword">instinto</span>, te guiará a través del <span class="grum-keyword">miedo</span> hasta el amanecer.`,
    "El Sol": `¡<span class="grum-keyword">Claridad</span>! La verdad sale a la luz y te calienta los huesos. Es un momento de <span class="grum-keyword">alegría pura</span>, de éxito y vitalidad. Sal de la cueva y <span class="grum-keyword">disfruta</span> del día.`,
    "El Juicio": `Una llamada resuena desde lo más profundo. Es tu alma pidiendo <span class="grum-keyword">despertar</span>. <span class="grum-keyword">Perdona</span> tu pasado, acepta tus lecciones y reintégrate. Es hora de tu <span class="grum-keyword">renacimiento</span>.`,
    "El Mundo": `El círculo se ha <span class="grum-keyword">completado</span>. Has llegado, has aprendido, has <span class="grum-keyword">integrado</span> la lección. <span class="grum-keyword">Celebra</span> este final, porque cada final es el glorioso <span class="grum-keyword">comienzo</span> de un nuevo viaje.`,
    "As de Bastos": `Una <span class="grum-keyword">chispa</span>. El potencial puro de una nueva <span class="grum-keyword">pasión</span> o proyecto. Tienes una antorcha en la mano, ahora ve y enciende una <span class="grum-keyword">hoguera</span> con ella.`,
    "2 de Bastos": `Estás en lo alto de tu torre, mirando el mundo. <span class="grum-keyword">Planear</span> está bien, criatura, pero el mapa no es el camino. Es hora de <span class="grum-keyword">actuar</span>.`,
    "3 de Bastos": `Lo que pusiste en marcha empieza a dar <span class="grum-keyword">frutos</span>. Tus barcos regresan. Ten <span class="grum-keyword">paciencia</span> y prepárate para <span class="grum-keyword">expandirte</span>.`,
    "4 de Bastos": `Has construido algo <span class="grum-keyword">estable</span>. Es tiempo de <span class="grum-keyword">celebrar</span>, de encontrar la <span class="grum-keyword">paz</span> en tu hogar y con tu gente. Un respiro merecido.`,
    "5 de Bastos": `Un conflicto de egos, una <span class="grum-keyword">lucha</span> sin sentido. No gastes tu energía en peleas tontas. A veces es mejor ser <span class="grum-keyword">listo</span> que ser el más fuerte.`,
    "6 de Bastos": `La <span class="grum-keyword">victoria</span> es tuya y todos la ven. Disfruta del <span class="grum-keyword">reconocimiento</span>, pero recuerda que el verdadero triunfo es el <span class="grum-keyword">respeto</span> que te tienes a ti mismo.`,
    "7 de Bastos": `<span class="grum-keyword">Defiende</span> tu posición. Lucharás solo contra muchos, pero estás en un terreno más alto. <span class="grum-keyword">Cree</span> en lo que defiendes y mantente <span class="grum-keyword">firme</span>.`,
    "8 de Bastos": `Todo se <span class="grum-keyword">acelera</span>. Noticias que llegan, viajes, progreso <span class="grum-keyword">rápido</span>. No es momento de dudar, es momento de <span class="grum-keyword">actuar</span> y seguir el flujo.`,
    "9 de Bastos": `Estás <span class="grum-keyword">herido pero no vencido</span>. Eres más <span class="grum-keyword">resistente</span> de lo que crees. Esta es la última prueba antes del descanso. <span class="grum-keyword">Aguanta</span>.`,
    "10 de Bastos": `Cargas con el peso de un bosque entero. Admirable, pero estúpido. Aprende a <span class="grum-keyword">delegar</span> o a <span class="grum-keyword">soltar</span> lo que no es tuyo antes de que te partas la espalda.`,
    "As de Copas": `Tu corazón se <span class="grum-keyword">desborda</span> con un nuevo sentimiento. Amor, compasión, alegría... Permite que <span class="grum-keyword">fluya</span>, no construyas una presa.`,
    "2 de Copas": `Un encuentro de almas. Un brindis. Esta <span class="grum-keyword">conexión</span> es genuina y <span class="grum-keyword">recíproca</span>. Cuídala, porque es un tesoro.`,
    "3 de Copas": `La <span class="grum-keyword">alegría compartida</span> es triple alegría. <span class="grum-keyword">Celebra</span> con tu gente, tu tribu. La <span class="grum-keyword">comunidad</span> sana y fortalece.`,
    "4 de Copas": `Te <span class="grum-keyword">aburres</span> en medio de la abundancia. Quizás no estás mirando bien las copas que te ofrecen. Abre los ojos a nuevas <span class="grum-keyword">posibilidades</span>.`,
    "5 de Copas": `Lloras por la leche derramada, sin ver que todavía tienes vino. Acepta la <span class="grum-keyword">pérdida</span>, pero no dejes que te ciegue a lo que <span class="grum-keyword">aún conservas</span>.`,
    "6 de Copas": `El pasado llama. Un regalo de la <span class="grum-keyword">nostalgia</span>. Es bonito recordar, pero no te quedes <span class="grum-keyword">atrapado</span> en un ayer que ya no existe.`,
    "7 de Copas": `Cuidado con los <span class="grum-keyword">castillos en el aire</span>. Tienes muchas opciones, pero la mayoría son <span class="grum-keyword">ilusiones</span>. Enfócate en lo <span class="grum-keyword">real</span> o te perderás en fantasías.`,
    "8 de Copas": `Hay que saber <span class="grum-keyword">cuándo marcharse</span>. Dejar atrás lo conocido para buscar un <span class="grum-keyword">significado más profundo</span>. Tu alma tiene sed de más.`,
    "9 de Copas": `El gato gordo y feliz. Estás <span class="grum-keyword">satisfecho</span>, tus deseos se han <span class="grum-keyword">cumplido</span>. Disfruta de esta <span class="grum-keyword">plenitud</span>, pero cuidado con la autocomplacencia.`,
    "10 de Copas": `La <span class="grum-keyword">armonía perfecta</span> en el hogar y en el corazón. Es un arcoíris emocional. <span class="grum-keyword">Valora</span> este momento de <span class="grum-keyword">paz y amor</span> compartido.`,
    "As de Espadas": `Un momento de <span class="grum-keyword">claridad absoluta</span>. Una idea que <span class="grum-keyword">corta la niebla</span> de la confusión. La <span class="grum-keyword">verdad</span> puede doler, pero <span class="grum-keyword">libera</span>. Empuña esta espada.`,
    "2 de Espadas": `Estás en una <span class="grum-keyword">tregua</span> forzada, negándote a <span class="grum-keyword">ver la realidad</span>. No puedes mantener el equilibrio para siempre. Tarde o temprano, tendrás que <span class="grum-keyword">decidir</span>.`,
    "3 de Espadas": `El <span class="grum-keyword">dolor</span> que parte el alma. No intentes ignorarlo. Esa <span class="grum-keyword">herida</span> necesita aire. Siente la tormenta, solo así el cielo volverá a <span class="grum-keyword">aclararse</span>.`,
    "4 de Espadas": `Tu mente necesita un <span class="grum-keyword">respiro</span>. Retírate del campo de batalla, guarda tus espadas y <span class="grum-keyword">medita</span>. La <span class="grum-keyword">recuperación</span> es una estrategia, no una debilidad.`,
    "5 de Espadas": `Una <span class="grum-keyword">victoria pírrica</span>. Has ganado la batalla, pero has <span class="grum-keyword">perdido</span> el honor o a tus amigos. A veces, la mejor victoria es saber <span class="grum-keyword">cuándo retirarse</span>.`,
    "6 de Espadas": `Dejar atrás las <span class="grum-keyword">aguas turbulentas</span>. Es un viaje mental o físico hacia un lugar más <span class="grum-keyword">tranquilo</span>. La <span class="grum-keyword">lógica</span> y la <span class="grum-keyword">calma</span> te guían ahora.`,
    "7 de Espadas": `Actúas con <span class="grum-keyword">sigilo</span>, quizás no del todo <span class="grum-keyword">honestamente</span>. La estrategia es válida, pero asegúrate de no estar <span class="grum-keyword">engañándote a ti mismo</span>.`,
    "8 de Espadas": `Te sientes <span class="grum-keyword">atrapado</span> por tus propios <span class="grum-keyword">pensamientos</span>. Mira bien, las espadas no te rodean del todo. La <span class="grum-keyword">jaula es mental</span>, y tú tienes la llave para salir.`,
    "9 de Espadas": `La <span class="grum-keyword">angustia</span> nocturna. Los <span class="grum-keyword">miedos</span> que te atormentan en la oscuridad. La mayoría son <span class="grum-keyword">fantasmas</span> de tu propia mente. <span class="grum-keyword">Enciende una luz</span>.`,
    "10 de Espadas": `Has <span class="grum-keyword">tocado fondo</span>. Es el <span class="grum-keyword">final absoluto</span> de una situación dolorosa. No hay más bajo a donde caer. Ahora, solo puedes <span class="grum-keyword">levantarte</span> y empezar de nuevo.`,
    "As de Oros": `Una <span class="grum-keyword">semilla de prosperidad</span>. Una oportunidad <span class="grum-keyword">real y tangible</span>. Plántala en buena tierra, trabájala y verás cómo crece.`,
    "2 de Oros": `La vida es un juego de <span class="grum-keyword">malabares</span>. Tienes que <span class="grum-keyword">adaptarte</span>, ser <span class="grum-keyword">flexible</span> y mantener el <span class="grum-keyword">equilibrio</span> entre tus diferentes responsabilidades.`,
    "3 de Oros": `El <span class="grum-keyword">trabajo en equipo</span> da sus frutos. Tu <span class="grum-keyword">habilidad</span> es reconocida y, <span class="grum-keyword">colaborando</span>, creáis algo de gran calidad. Eres un buen artesano.`,
    "4 de Oros": `Te <span class="grum-keyword">aferras</span> a lo que tienes por <span class="grum-keyword">miedo</span> a perderlo. La seguridad es buena, pero la <span class="grum-keyword">avaricia</span> estanca. Aprende a <span class="grum-keyword">soltar</span> un poco para poder recibir más.`,
    "5 de Oros": `Te sientes <span class="grum-keyword">abandonado</span>, en la pobreza. Pero a veces la <span class="grum-keyword">ayuda</span> está justo al lado. Levanta la cabeza y <span class="grum-keyword">pide ayuda</span>.`,
    "6 de Oros": `El flujo de <span class="grum-keyword">dar y recibir</span>. La <span class="grum-keyword">generosidad</span> crea abundancia para todos. <span class="grum-keyword">Comparte</span> tus recursos, ya sea dinero, tiempo o sabiduría.`,
    "7 de Oros": `Has sembrado y cuidado tu cosecha. Ahora toca <span class="grum-keyword">esperar con paciencia</span>. No arranques la planta cada día para ver si crece. <span class="grum-keyword">Confía</span> en el proceso.`,
    "8 de Oros": `La <span class="grum-keyword">maestría</span> se consigue con <span class="grum-keyword">práctica y dedicación</span>. Concéntrate en tu oficio, pule tus <span class="grum-keyword">habilidades</span>. El trabajo bien hecho es su propia recompensa.`,
    "9 de Oros": `Disfrutas de los frutos de tu trabajo en <span class="grum-keyword">soledad y abundancia</span>. Has logrado la <span class="grum-keyword">independencia</span>. Es un lujo que te has ganado a pulso.`,
    "10 de Oros": `La <span class="grum-keyword">riqueza</span> no es solo dinero, es un <span class="grum-keyword">legado</span>, una <span class="grum-keyword">familia</span>, una <span class="grum-keyword">seguridad</span> que perdura. Has construido algo <span class="grum-keyword">sólido</span> para ti y para los tuyos.`
};