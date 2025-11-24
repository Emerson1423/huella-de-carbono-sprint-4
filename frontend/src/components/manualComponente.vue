<template>
<div class="main-container">
<div class="container-content main-grid-wrapper">
<div class="main-grid">
<aside class="sidebar-area">
<div class="sidebar-sticky">
<div class="sidebar-search-group">
<h3 class="sidebar-title">Índice</h3>
<div class="search-input-wrapper">
<input
    v-model="searchTerm"
    type="text"
    placeholder="Buscar sección..."
    class="search-input"
/>
</div>
</div>
<nav>
<ul class="menu-list">
<li v-for="item in filteredMenuItems" :key="item.key">
    <button
        @click="setActiveSection(item.key)"
        :class="['menu-button', { 'menu-button-active': activeSection === item.key }]"
    >
        <span class="menu-icon">{{ item.icon }}</span>
        <span>{{ item.label }}</span>
    </button>
</li>
</ul>
</nav>
</div>
</aside>
<main class="content-area">
<div class="content-box">
<div class="section-content">
</div>
<section v-if="activeSection === 'inicio'" class="animate-fadeIn">
<h2 class="section-title text-green">
Manual de Usuario
</h2>

<div class="intro-box">
<p class="intro-text-lg">
    ¡Bienvenido a <strong class="text-green">SalvAmbiente</strong>! 
</p>
<p class="intro-text-base">
    Tu plataforma integral para el cuidado del medio ambiente.
    Este manual te guiará paso a paso en el uso de todas las funcionalidades del sitio web.
    Gracias por unirte a nuestra misión de crear un futuro más verde y sostenible.
</p>
</div>

<h3 class="section-subtitle">Nuestras Secciones</h3>
<div class="cards-grid">
<div
  v-for="item in sectionCards"
  :key="item.key"
  class="section-card"
  :style="{'--card-color': getBaseColor(item.color)}"
  @click="setActiveSection(item.key)"
>
  <div class="card-icon">
    <img v-if="iconMap[item.key]" :src="iconMap[item.key]" :alt="item.title + ' icon'" class="card-icon-img" />
    <span v-else>{{ item.icon }}</span>
  </div>
  <h3 class="card-title">{{ item.title }}</h3>
  <p class="card-description">{{ item.desc }}</p>
</div>
</div>

<div class="info-box-blue">
<h4 class="info-title-green">
  Navegación Rápida
</h4>
<p class="info-text">
  Utiliza el menú lateral para acceder directamente a la sección que necesitas.
  También puedes usar la búsqueda para encontrar la sección específica.
</p>
</div>
</section>

<!-- Sección Noticias -->
<section v-else-if="activeSection === 'noticias'" class="animate-fadeIn">
<h2 class="section-title text-green">
Sección de Noticias
</h2>
<div class="content-summary-box text-green summary-green">
<h3 class="summary-title">¿Qué encontrarás?</h3>
<p class="summary-text">
  La sección de noticias te mantiene informado sobre los últimos acontecimientos
  relacionados con el medio ambiente a nivel local y global. Información actualizada
  sobre cambio climático, conservación, energías renovables y más.
</p>
</div>

<h3 class="section-subtitle">Cómo usar esta sección</h3>
<div class="steps-list">
<div v-for="item in newsSteps" :key="item.step" 
  class="step-item"
  :style="{'--step-color': getBaseColor(item.color), '--step-bg-color': getLightBgColor(item.color)}">
  <div class="step-icon">
      {{ item.step }}
  </div>
  <div class="step-content">
      <h4 class="step-title">{{ item.title }}</h4>
      <p class="step-description">{{ item.desc }}</p>
  </div>
</div>
</div>
</section>

<!-- Sección Artículos -->
<section v-else-if="activeSection === 'articulos'" class="animate-fadeIn">
<h2 class="section-title text-green">
Artículos Educativos
</h2>

<div class="content-summary-box text-blue summary-blue">
<h3 class="summary-title">¿Qué encontrarás?</h3>
<p class="summary-text">
  Artículos detallados sobre temas ambientales y análisis profundos de problemáticas ecológicas.
</p>
</div>

<h3 class="section-subtitle">Pasos de Uso</h3>
<div class="steps-list">
<div v-for="(item, idx) in articuloSteps" :key="idx" 
  class="calc-step-card"
  :style="{'--card-color': getBaseColor(item.color)}">
  <h4 class="calc-step-title" :style="{'color': getBaseColor(item.color)}">{{ item.title }}</h4>
  <p class="calc-step-description">{{ item.desc }}</p>
</div>
</div>
</section>

<!-- Sección Videos -->
<section v-else-if="activeSection === 'videos'" class="animate-fadeIn">
<h2 class="section-title text-lime">
Videos Educativos
</h2>

<div class="content-summary-box text-green summary-purple">
<h3 class="summary-title">¿Qué encontrarás?</h3>
<p class="summary-text">
  Una biblioteca de contenido audiovisual sobre medio ambiente. Cortometrajes ambientales entretenidos y educativos que puedes ver en cualquier momento.
</p>
</div>

<div class="grid-2-cols gap-6">
<div class="minigame-card border-green">
  <h4 class="minigame-title text-lime">Ve el video principal</h4>
  <p class="minigame-desc">Puedes reproducir el video destacado ("Campaña de concienciación...") directamente haciendo clic en él o haciendo clic en "Ver en YouTube" para verlo en la plataforma original.</p>
</div>
<div class="minigame-card border-green">
  <h4 class="minigame-title text-lime">Lee el contexto</h4>
  <p class="minigame-desc">Revisa el texto junto al video para entender la historia y el mensaje central del material audiovisual.</p>
</div>
<div class="minigame-card border-green">
  <h4 class="minigame-title text-green">Explora otros cortometrajes</h4>
  <p class="minigame-desc">Desplázate hacia abajo para ver la galería de "Más Cortometrajes Ambientales". Haz clic en la miniatura de cualquiera de ellos para ir a su página y reproducirlo.</p>
</div>
</div>

</section>

<!-- Sección datos curiosos -->
<section v-else-if="activeSection === 'curiosos'" class="animate-fadeIn">
<h2 class="section-title text-green">
Datos Curiosos sobre el Medio Ambiente
</h2>

<div class="content-summary-box text-green summary-yellow">
<p class="summary-text">
  Datos fascinantes sobre la naturaleza, animales, oceanos, etc. Puedes ver también las curiosidades usando el filtro.
</p>
</div>
<h3 class="section-subtitle">Cómo usar esta sección</h3>
<div class="steps-list">
<div v-for="item in curiososSteps" :key="item.step" 
  class="step-item"
  :style="{'--step-color': getBaseColor(item.color), '--step-bg-color': getLightBgColor(item.color)}">
  <div class="step-content">
      <h4 class="step-title">{{ item.title }}</h4>
      <p class="step-description">{{ item.desc }}</p>
  </div>
</div>
</div>
</section>

<!-- Sección huella-->
<section v-else-if="activeSection === 'calculadora'" class="animate-fadeIn">
<h2 class="section-title text-emerald">
Calculadora de Huella de Carbono
</h2>

<div class="content-summary-box text-emerald summary-emerald">
<h3 class="summary-title">Mide tu Impacto</h3>
<p class="summary-text">
  Calcula tu huella ecológica mensual basándose en tus hábitos de transporte,
  consumo de energía, alimentación y reciclaje.
</p>
</div>

<h3 class="section-subtitle">Guía Paso a Paso</h3>
<div class="steps-list">
<div v-for="(item, idx) in calculatorSteps" :key="idx" 
  class="calc-step-card"
  :style="{'--card-color': getBaseColor(item.color)}">
  <h4 class="calc-step-title" :style="{'color': getBaseColor(item.color)}">{{ item.title }}</h4>
  <p class="calc-step-description">{{ item.desc }}</p>
</div>
</div>

<div class="info-box-green">
<h4 class="info-title-green">
  Resultados y Recomendaciones
</h4>
<p class="info-text">
  Al completar todos los pasos, obtendrás tu huella de carbono total en kg CO₂/mes.
</p>
</div>
</section>

<!-- Sección Minijuegos -->
<section v-else-if="activeSection === 'entretenimiento'" class="animate-fadeIn">
<h2 class="section-title text-lime">
Minijuegos Educativos
</h2>

<div class="content-summary-box text-green summary-orange">
<h3 class="summary-title">Aprende Jugando</h3>
<p class="summary-text">
  Los minijuegos combinan diversión y educación ambiental. Ideal para todas las edades.
</p>
</div>

<div class="grid-2-cols gap-6">
<div class="minigame-card border-green">
  <h4 class="minigame-title text-lime">Recicla ¿Y esto dónde va?</h4>
  <p class="minigame-desc">Clasifica residuos correctamente teniendo un limite de intentos.</p>
  <span class="minigame-tag tag-blue">Acción</span>
</div>
<div class="minigame-card border-green">
  <h4 class="minigame-title text-lime">Planta Virtual</h4>
  <p class="minigame-desc">Pon a prueba tus conocimientos sobre medio ambiente respondiendo y ve tu planta crecer.</p>
  <span class="minigame-tag tag-purple">Quiz</span>
</div>
</div>
<div class="minigame-card border-green">
  <h4 class="minigame-title text-green">Título del Minijuego</h4>
  <p class="minigame-desc">Descripción del minijuego de aventura</p>
  <span class="minigame-tag tag-green">Aventura</span>
</div>
</section>

<!-- Sección Hábitos -->
<section v-else-if="activeSection === 'habitos'" class="animate-fadeIn">
  <h2 class="section-title text-teal">
    Hábitos 
  </h2>

  <div class="content-summary-box summary-teal">
    <h3 class="summary-title">Pequeñas acciones, gran impacto</h3>
    <p class="summary-text">
      Descubre hábitos diarios que puedes adoptar para reducir tu huella ecológica y contribuir a un planeta más saludable.
    </p>
  </div>

    <h3 class="section-subtitle">Guía Paso a Paso</h3>
    <div class="steps-list">
    <div v-for="(item, idx) in habitoSteps" :key="idx" 
    class="calc-step-card"
    :style="{'--card-color': getBaseColor(item.color)}">
    <h4 class="calc-step-title" :style="{'color': getBaseColor(item.color)}">{{ item.title }}</h4>
    <p class="calc-step-description">{{ item.desc }}</p>
    </div>
    </div>

</section>

<!-- Sección Eventos -->
<section v-else-if="activeSection === 'eventos'" class="animate-fadeIn">
  <h2 class="section-title text-lime">
    Eventos 
  </h2>

  <div class="content-summary-box summary-lime">
    <h3 class="summary-title">Participa y aprende</h3>
    <p class="summary-text">
      Consulta y participa en eventos locales: limpiezas comunitarias, talleres de reciclaje, charlas y ferias ambientales.
    </p>
  </div>
  <div v-for="item in eventoSteps" :key="item.step" 
  class="step-item"
  :style="{'--step-color': getBaseColor(item.color), '--step-bg-color': getLightBgColor(item.color)}">
  <div class="step-icon">
      {{ item.step }}
  </div>
  <div class="step-content">
      <h4 class="step-title">{{ item.title }}</h4>
      <p class="step-description">{{ item.desc }}</p>
  </div>
</div>
</section>
</div>
</main>
        </div>
    </div>
</div>
</template>

<script setup>
import { ref, computed } from 'vue';

const activeSection = ref('inicio');
const searchTerm = ref('');

const colorMap = {
  'green': '#10B981',      
  'blue': '#059669',      
  'purple': '#16A34A',    
  'yellow': '#22C55E',     
  'emerald': '#047857',    
  'orange': '#16A34A',     
  'teal': '#34D399',      
  'cyan': '#34D399',       
  'lime': '#84CC16',      
};

const menuItems = [
{ key: 'inicio', label: 'Inicio' },
{ key: 'noticias', label: 'Noticias'},
{ key: 'articulos', label: 'Artículos'},
{ key: 'curiosos', label: 'Datos Curiosos' },
{ key: 'videos', label: 'Videos'},
{ key: 'calculadora', label: 'Calculadora CO₂'},
{ key: 'habitos', label: 'Hábitos'},
{ key: 'eventos', label: 'Eventos'},
{ key: 'entretenimiento', label: 'Entretenimiento'},
];

// Propiedad computada para el filtro (equivalente a useMemo)
const filteredMenuItems = computed(() =>
menuItems.filter(item => item.label.toLowerCase().includes(searchTerm.value.toLowerCase()))
);

// Función para cambiar la sección activa
const setActiveSection = (key) => {
activeSection.value = key;
};

const iconMap = {
  noticias: require('@/assets/icons/Noticias.png'),
  articulos: require('@/assets/icons/Articulo.png'),
  videos: require('@/assets/icons/video.png'),
  curiosos : require('@/assets/icons/curiosos.png'),
  calculadora: require('@/assets/icons/Huella.png'),
  entretenimiento: require('@/assets/icons/juego.png'),
  habitos: require('@/assets/icons/habito.png'),
  eventos: require('@/assets/icons/evento.png')
};

const sectionCards = [
  { key: 'noticias', title: 'Noticias', desc: 'Actualidad ambiental', color: 'green' },
  { key: 'articulos', title: 'Artículos', desc: 'Contenido educativo', color: 'blue' },
  { key: 'curiosos', title: 'Datos Curiosos', desc: 'Datos interesantes', color: 'yellow' },
  { key: 'videos', title: 'Videos', desc: 'Material audiovisual', color: 'purple' },
  { key: 'calculadora', title: 'Calculadora CO₂', desc: 'Mide tu huella', color: 'emerald' },
  { key: 'habitos', title: 'Hábitos', desc: 'Pequeñas acciones diarias', color: 'teal' },
  { key: 'eventos', title: 'Eventos', desc: 'Actividades y participaciones', color: 'lime' },
  { key: 'entretenimiento', title: 'Minijuegos', desc: 'Aprende jugando', color: 'orange' }

];

const habitoSteps = [
{ title: 'Paso 1: Revisa la información clave', desc: 'Lee la introducción que explica por qué es importante reducir el plástico.', color: 'emerald' },
{ title: 'Paso 2: Explora recursos informativos', desc: 'Haz clic en los botones de resumen para una lectura rápida: "Beneficios" "Consejos prácticos"', color: 'teal' },
{ title: 'Paso 3: Lee más a fondo', desc: 'La sección "Lee más información" proporciona enlaces a artículos externos. Haz clic en "Leer aquí" para acceder a la fuente.', color: 'cyan' },
{ title: 'Paso 4: Mira el video educativo', desc: 'Reproduce el video al final de la página para obtener instrucciones visuales y consejos adicionales.', color: 'green' },
{ title: 'Paso 5: Gestiona tu progreso', desc: 'Usa los botones inferiores para interactuar con la acción hábito. Puedes agregar tu hábito a tu perfil para incluir esta acción en tu seguimiento personal', color: 'lime' }
];
const calculatorSteps = [
{ title: 'Paso 1: Kilómetros Recorridos', desc: 'Usa el deslizador para indicar cuántos kilómetros recorres aproximadamente al mes.', color: 'emerald' },
{ title: 'Paso 2: Medio de Transporte', desc: 'Selecciona tu principal medio de transporte del menú desplegable.', color: 'teal' },
{ title: 'Paso 3: Consumo de Energía', desc: 'Indica tu consumo mensual de electricidad en tu hogar.', color: 'cyan' },
{ title: 'Paso 4: Energía Renovable', desc: 'Selecciona si utilizas energía renovable', color: 'green' },
{ title: 'Paso 5: Reciclaje', desc: 'Indica qué materiales reciclas eligiendo los iconos.', color: 'lime' },
{ title: 'Paso 6: Calcular', desc: 'Realiza tu calculo dandole clic al botón inferior que dice "Calcular"', color: 'yellow' }
];
const articuloSteps = [
{ title: 'Revisa los títulos y resúmenes', desc: 'Puedes leer el titulo y el pequeño resumen que ofrecemos.', color: 'emerald' },
{ title: 'Accede al artículo completo', desc: 'Haz clic en el botón "Ver más..." en el recuadro que te interese para leer el artículo completo.', color: 'teal' },
{ title: 'Desplázate', desc: 'Simplemente deslízate hacia abajo para ver más artículos en el listado.', color: 'cyan' }
];
const eventoSteps = [
{
    step: '1',
    title: 'Filtra por tema',
    desc: 'Utiliza los botones bajo "Filtrar por tipo de evento" para ver solo los eventos de tu interés.',
    color: 'green'
},
{
    step: '2',
    title: 'Revisa los eventos listados',
    desc: 'Debajo de los filtros, verás el listado. Cada evento muestra su estado "Finalizado" o "Próximo", un título y una descripción.',
    color: 'green'
},
{
    step: '3',
    title: 'Obtén detalles',
    desc: 'Haz clic en el botón "Ver detalles" junto al evento que te interese para conocer la agenda completa, fecha, hora y requisitos de participación. Puedes revisar los eventos en su sitio oficial si está disponible.',
    color: 'green'
}
];
const curiososSteps = [
{
    title: 'Filtra las curiosidades',
    desc: 'Utiliza los botones de categoría en la parte superior para ordenar el contenido según tus intereses.',
    color: 'green'
},
{
    title: 'Lee las curiosidades',
    desc: 'Puedes deslizarte hacia abajo para ver más datos curiosos sobre el medio ambiente.',
    color: 'green'
}
];

const newsSteps = [
{
    step: '1',
    title: 'Accede a la sección',
    desc: 'Desde el menú principal, haz clic en "Noticias" para ingresar a la sección dedicada a las últimas novedades ambientales.',
    color: 'green'
},
{
    step: '2',
    title: 'Selecciona una noticia para leer más',
    desc: 'Para obtener el contenido completo de una noticia que te interese, haz clic en el enlace "Leer más" que se encuentra al final de cada resumen. Esto te llevará a la página o artículo completo.',
    color: 'green'
},
{
    step: '3',
    title: 'Navega por las páginas de noticias',
    desc: 'Si deseas ver diferentes a las tres destacadas, usa los controles de paginación que se encuentran en la parte inferior.',
    color: 'green'
}
];

const getBaseColor = (colorName) => colorMap[colorName] || '#000000';
const getLightBgColor = (colorName) => {
switch(colorName) {
    case 'green': return '#D1FAE5';
    case 'blue': return '#DBEAFE';
    case 'purple': return '#F3E8FF';
    case 'yellow': return '#FFFBEB';
    case 'emerald': return '#ECFDF5';
    case 'teal': return '#CCFBF1';
    case 'cyan': return '#CFFAFE';
    default: return '#F9FAFB';
}
};
</script>

    <style scoped>
    /* Variables de Color (scope local al componente) */
      .main-container {
      --c-green-700: #047857;
      --c-green-600: #059669;
      --c-green-500: #10B981;
      --c-green-100: #D1FAE5;
      --c-green-50: #F0FDF4;

      --c-emerald-600: #047857; /* usado en gradientes */
      --c-emerald-700: #047857;
      --c-emerald-50: #ECFDF5;
      --c-teal-600: #0D9488;
      --c-teal-50: #F0FDFA;

      --c-blue-700: #1D4ED8;
      --c-blue-500: #3B82F6;
      --c-blue-100: #DBEAFE;

      --c-purple-700: #6B21A8;
      --c-purple-500: #9333EA;
      --c-purple-100: #F3E8FF;

      --c-yellow-600: #D97706;
      --c-yellow-50: #FFFBEB;

      --c-orange-600: #EA580C;
      --c-orange-50: #FFF7ED;

      --c-cyan-50: #CFFAFE;
      min-height: 100vh;
      font-family: "Inter", sans-serif;
      background: linear-gradient(to bottom right, var(--c-green-50), var(--c-emerald-50), var(--c-teal-50));
      }

    .container-content {
    max-width: 1280px;
    margin-left: auto;
    margin-right: auto;
    padding-left: 1rem; 
    padding-right: 1rem;
    }

    .main-grid-wrapper {
      padding-top: 5rem; 
      padding-bottom: 2rem;
    }
    .header {
    position: sticky;
    top: 0;
    z-index: 50;
    background: linear-gradient(to right, var(--c-green-600), var(--c-emerald-600), var(--c-teal-600));
    color: white;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.04); /* shadow-2xl */
    }

    .header-inner {
    padding-top: 1.25rem;
    padding-bottom: 1.25rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    }

    .header-logo-group {
    display: flex;
    align-items: center;
    gap: 1rem; 
    }

    .logo-circle {
    background-color: white;
    border-radius: 9999px; 
    padding: 0.75rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); /* shadow-lg */
    transition: transform 0.3s ease;
    }

    .logo-circle:hover {
    transform: scale(1.1);
    }

    .logo-emoji {
    font-size: 1.875rem;
    }

    .header-title {
    font-size: 1.875rem;
    font-weight: 700;
    letter-spacing: -0.025em;
    }

    .header-subtitle {
    color: var(--c-green-100);
    font-size: 0.875rem; 
    }

    .header-icon-book {
    font-size: 2.25rem;
    animation: bounce 1s infinite;
    }
    .main-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem; 
    }
    @media (min-width: 1024px) { 
    .main-grid {
        grid-template-columns: repeat(4, minmax(0, 1fr));
    }
    }

    .sidebar-area {
    grid-column: span 1 / span 1;
    }
    @media (min-width: 1024px) {
    .sidebar-area {
        grid-column: span 1 / span 1;
    }
    }

    .content-area {
    grid-column: span 1 / span 1;
    }
    @media (min-width: 1024px) { 
    .content-area {
        grid-column: span 3 / span 3;
    }
    }

    .sidebar-sticky {
      position: sticky;
      top: 9rem;
    background-color: white;
    border-radius: 1rem; 
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); /* shadow-xl */
    padding: 1.5rem; 
    border: 1px solid var(--c-green-100);
    }
    @media (max-width: 768px) {
      .sidebar-sticky {
        top: 6rem;
      }
    }

    .sidebar-search-group {
    margin-bottom: 1.5rem;
    }

    .sidebar-title {
    font-size: 1.125rem; /* text-lg */
    font-weight: 700; /* font-bold */
    color: #1F2937; /* text-gray-800 */
    margin-bottom: 0.75rem; /* mb-3 */
    }

    .search-input-wrapper {
    position: relative;
    }

    .search-icon {
    position: absolute;
    left: 0.75rem; /* left-3 */
    top: 50%;
    transform: translateY(-50%);
    color: #9CA3AF; /* text-gray-400 */
    }

    .search-input {
    width: 100%;
    padding: 0.75rem 1rem 0.75rem 2.5rem; /* pl-10 pr-4 py-3 */
    font-size: 0.875rem; /* text-sm */
    border: 2px solid #E5E7EB; /* border-2 border-gray-200 */
    border-radius: 0.75rem; /* rounded-xl */
    transition: border-color 0.3s, box-shadow 0.3s;
    }

    .search-input:focus {
    outline: none;
    border-color: transparent;
    box-shadow: 0 0 0 2px var(--c-green-500); /* focus:ring-2 focus:ring-green-500 */
    }

    .menu-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem; /* space-y-2 */
    list-style: none;
    margin: 0;
    padding: 0;
    }

    .menu-button {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 0.75rem; /* space-x-3 */
    padding: 0.75rem 1rem; /* px-4 py-3 */
    border-radius: 0.75rem; /* rounded-xl */
    transition: all 0.3s ease;
    font-size: 0.875rem; /* text-sm */
    font-weight: 500; /* font-medium */
    text-align: left;
    color: #374151; /* text-gray-700 */
    cursor: pointer;
    border: none;
    }

    .menu-button:hover {
    background-color: #F0FDF4; /* hover:bg-green-50 */
    color: #047857; /* hover:text-green-700 */
    transform: scale(1.02);
    }

    .menu-button-active {
    /* bg-gradient-to-r from-green-500 to-emerald-600 */
    background: linear-gradient(to right, var(--c-green-500), var(--c-emerald-600));
    color: white;
    box-shadow: 0 10px 15px -3px rgba(16, 185, 129, 0.3), 0 4px 6px -2px rgba(16, 185, 129, 0.03); /* shadow-lg shadow-green-500/30 */
    transform: scale(1.05);
    }

    .menu-icon {
    font-size: 1.25rem; /* text-xl */
    }

    /* ------------------- Main Content Area ------------------- */
    .content-box {
    background-color: white;
    border-radius: 1rem; /* rounded-2xl */
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); /* shadow-xl */
    padding: 2rem; /* p-8 */
    border: 1px solid var(--c-green-100);
    }

    .section-title {
    font-size: 2.25rem; /* text-4xl */
    font-weight: 700; /* font-bold */
    margin-bottom: 1.5rem; /* mb-6 */
    display: flex;
    align-items: center;
    }

    .section-icon {
    margin-right: 0.75rem; /* mr-3 */
    }

    .section-subtitle {
    font-size: 1.5rem; /* text-2xl */
    font-weight: 700; /* font-bold */
    color: #1F2937; /* text-gray-800 */
    margin-bottom: 1.5rem; /* mb-6 */
    }

    /* Colores de texto */
    .text-green { color: var(--c-green-700); }
    .text-blue { color: var(--c-blue-700); }
    .text-purple { color: var(--c-purple-700); }
    .text-yellow { color: var(--c-yellow-600); }
    .text-emerald { color: var(--c-emerald-700); }
    .text-orange { color: var(--c-orange-600); }
    .text-gray { color: #4B5563; } /* text-gray-700 */

    /* --- Intro Box (Inicio) --- */
    .intro-box {
    /* bg-gradient-to-r from-green-100 via-emerald-100 to-teal-100 */
    background: linear-gradient(to right, var(--c-green-100), #E6FFFA, var(--c-teal-50));
    padding: 2rem; /* p-8 */
    border-radius: 1rem; /* rounded-2xl */
    margin-bottom: 2rem; /* mb-8 */
    border-left: 4px solid var(--c-green-500);
    }

    .intro-text-lg {
    font-size: 1.125rem; /* text-lg */
    color: #1F2937; /* text-gray-800 */
    line-height: 1.625; /* leading-relaxed */
    margin-bottom: 0.5rem; /* mb-2 */
    }

    .intro-text-base {
    font-size: 1rem; /* text-base */
    color: #374151; /* text-gray-700 */
    line-height: 1.625; /* leading-relaxed */
    }

    /* --- Cards Grid (Inicio) --- */
    .cards-grid {
    display: grid;
    grid-template-columns: repeat(1, minmax(0, 1fr));
    gap: 1.25rem; /* gap-5 */
    }
    @media (min-width: 768px) { /* md */
    .cards-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    }
    @media (min-width: 1024px) { /* lg */
    .cards-grid {
        grid-template-columns: repeat(3, minmax(0, 1fr));
    }
    }

    .section-card {
    background-color: white;
    padding: 1.5rem; /* p-6 */
    border-radius: 0.75rem; /* rounded-xl */
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.06); /* shadow-md */
    border-left: 4px solid var(--card-color); /* Borde dinámico */
    transition: all 0.3s ease;
    cursor: pointer;
    }

    .section-card:hover {
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); /* hover:shadow-2xl */
    transform: translateY(-0.5rem); /* hover:-translate-y-2 */
    }

    .card-icon {
    font-size: 2.25rem; /* text-4xl */
    margin-bottom: 0.75rem; /* mb-3 */
    }

    .card-icon-img {
    width: 48px;
    height: 48px;
    object-fit: contain;
    display: block;
    margin-bottom: 0.5rem;
    }

    .card-title {
    font-weight: 700; /* font-bold */
    font-size: 1.125rem; /* text-lg */
    color: #1F2937; /* text-gray-800 */
    margin-bottom: 0.25rem; /* mb-1 */
    }

    .card-description {
    font-size: 0.875rem; /* text-sm */
    color: #4B5563; /* text-gray-600 */
    }

    /* --- Info Box (Navegación Rápida) --- */
    .info-box-blue {
    /* convertida a tonos verdes */
    background: linear-gradient(to right, var(--c-green-50), var(--c-emerald-50));
    border-left: 4px solid var(--c-green-500);
    padding: 1.5rem; /* p-6 */
    border-radius: 0.75rem; /* rounded-xl */
    margin-top: 2rem; /* mt-8 */
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.06); /* shadow-md */
    }

    .info-box-green {
    background: linear-gradient(to right, var(--c-green-100), var(--c-emerald-50));
    padding: 1.5rem;
    border-radius: 0.75rem;
    margin-top: 2rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.06);
    }

    .summary-teal { background-color: #CCFBF1; border-color: #14B8A6; }
    .summary-lime { background-color: #F7FEE7; border-color: #84CC16; }
    .habits-grid { display: grid; grid-template-columns: repeat(1, minmax(0,1fr)); gap: 1rem; }
    @media (min-width: 768px) { .habits-grid { grid-template-columns: repeat(3, minmax(0,1fr)); } }
    .habit-card { background: white; padding: 1rem; border-radius: 0.75rem; box-shadow: 0 6px 18px rgba(0,0,0,0.06);} 
    .habit-title { font-weight:700; margin-bottom:0.5rem; }
    .habit-desc { color: #374151; }
    .events-list { display: flex; flex-direction: column; gap: 1rem; }
    .event-card { background: white; padding: 1rem; border-radius: 0.75rem; box-shadow: 0 6px 18px rgba(0,0,0,0.06); }
    .event-title { font-weight:700; }
    .event-desc { color: #374151; }

    .info-title-blue, .info-title-green {
    font-weight: 700; /* font-bold */
    color: #1E40AF; /* text-blue-800 */
    margin-bottom: 0.75rem; /* mb-3 */
    display: flex;
    align-items: center;
    font-size: 1.125rem; /* text-lg */
    }

    .info-title-green {
    color: var(--c-green-700);
    }

    .info-text {
    color: #374151; /* text-gray-700 */
    }
    .content-summary-box {
    padding: 1.5rem;
    border-radius: 0.75rem;
    margin-bottom: 2rem;
    border-left: 4px solid;
    }

    .summary-title {
    font-size: 1.25rem; /* text-xl */
    font-weight: 700;
    margin-bottom: 0.75rem;
    }

    .summary-text {
    color: #374151;
    line-height: 1.625;
    }

    .summary-green { background-color: var(--c-green-50); border-color: var(--c-green-500); }
    .summary-blue { background-color: var(--c-green-50); border-color: var(--c-green-500); }
    .summary-purple { background-color: var(--c-green-50); border-color: var(--c-green-600); }
    .summary-yellow { background-color: var(--c-green-50); border-color: var(--c-green-600); }
    .summary-emerald { background-color: var(--c-emerald-50); border-color: var(--c-emerald-700); }
    .summary-orange { background-color: var(--c-green-50); border-color: var(--c-green-600); }
    .summary-gray { background-color: #F3F4F6; border-color: #9CA3AF; }

    .steps-list {
    display: flex;
    flex-direction: column;
    gap: 1.25rem; /* space-y-5 */
    }

    .step-item {
    display: flex;
    align-items: flex-start;
    padding: 1.5rem;
    border-radius: 0.75rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.06);
    transition: box-shadow 0.3s;

    background: linear-gradient(to right, var(--step-bg-color), #FFF);
    }

    .step-item:hover {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    }

    .step-icon {
    background-color: var(--step-color); /* Color de fondo dinámico */
    color: white;
    border-radius: 9999px; /* rounded-full */
    width: 3rem; /* w-12 h-12 */
    height: 3rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700; /* font-bold */
    font-size: 1.25rem; /* text-xl */
    margin-right: 1.25rem; /* mr-5 */
    flex-shrink: 0;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); /* shadow-lg */
    }

    .step-content {
    flex-grow: 1;
    }

    .step-title {
    font-weight: 700;
    color: #1F2937;
    margin-bottom: 0.5rem;
    font-size: 1.125rem;
    }

    .step-description {
    color: #374151;
    }
    .grid-2-cols {
    display: grid;
    grid-template-columns: repeat(1, minmax(0, 1fr));
    gap: 1.5rem;
    }

    @media (min-width: 768px) { /* md */
    .grid-2-cols {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    }

    .article-box {
    padding: 1.5rem;
    border-radius: 0.75rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.06);
    }

    .bg-blue, .bg-purple {
    background: linear-gradient(to bottom right, var(--c-green-100), var(--c-emerald-50));
    }

    .article-title-blue {
    font-weight: 700;
    color: #1E40AF; /* text-blue-800 */
    margin-bottom: 0.75rem;
    font-size: 1.125rem;
    }

    .article-title-purple {
    font-weight: 700;
    color: #6B21A8; /* text-purple-800 */
    margin-bottom: 0.75rem;
    font-size: 1.125rem;
    }

    .article-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    color: #374151;
    }

    /* --- Calculadora Steps --- */
    .calc-step-card {
    background-color: white;
    padding: 1.5rem;
    border-radius: 0.75rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.06);
    border-left: 4px solid var(--card-color); /* Borde dinámico */
    transition: box-shadow 0.3s;
    }

    .calc-step-card:hover {
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    }

    .calc-step-title {
    font-weight: 700;
    margin-bottom: 0.5rem;
    font-size: 1.125rem;
    }

    .calc-step-description {
    color: #374151;
    }

    /* --- Minijuegos Cards --- */
    .minigame-card {
    background-color: white;
    padding: 1.5rem;
    border-radius: 0.75rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); /* shadow-lg */
    border: 2px solid;
    transition: border-color 0.3s;
    }

    .minigame-card.border-orange { border-color: #FED7AA; } /* border-orange-200 */
    .minigame-card:hover.border-orange { border-color: #FB923C; } /* hover:border-orange-400 */

    .minigame-card.border-blue { border-color: #BFDBFE; } /* border-blue-200 */
    .minigame-card:hover.border-blue { border-color: #60A5FA; } /* hover:border-blue-400 */

    .minigame-card.border-green { border-color: #A7F3D0; } /* border-green-200 */
    .minigame-card:hover.border-green { border-color: #34D399; } /* hover:border-green-400 */

    .minigame-card.border-purple { border-color: #E9D5FF; } /* border-purple-200 */
    .minigame-card:hover.border-purple { border-color: #C084FC; } /* hover:border-purple-400 */

    .minigame-icon {
    font-size: 3rem; /* text-5xl */
    margin-bottom: 1rem; /* mb-4 */
    }

    .minigame-title {
    font-weight: 700;
    margin-bottom: 0.5rem;
    font-size: 1.125rem;
    }

    .minigame-desc {
    color: #374151;
    margin-bottom: 0.75rem;
    }

    .minigame-tag {
    display: inline-block;
    padding: 0.25rem 0.75rem; /* px-3 py-1 */
    border-radius: 9999px; /* rounded-full */
    font-size: 0.875rem; /* text-sm */
    font-weight: 500; /* font-medium */
    }

    .tag-orange { background-color: var(--c-green-50); color: var(--c-green-700); }
    .tag-blue { background-color: var(--c-green-50); color: var(--c-green-700); } 
    .tag-green { background-color: #D1FAE5; color: var(--c-green-700); } 
    .tag-purple { background-color: var(--c-green-50); color: var(--c-green-700); } 

    .footer {
    margin-top: 2rem; 
    }

    .footer-inner {
    background-color: white;
    border-radius: 1rem;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    padding: 2rem;
    text-align: center;
    border: 1px solid var(--c-green-100);
    }

    .footer-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1F2937;
    margin-bottom: 1rem;
    }

    .footer-text {
    color: #4B5563;
    margin-bottom: 1.5rem;
    }

    .footer-buttons {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
    }

    .footer-btn {
    padding: 0.75rem 1.5rem;
    color: white;
    border-radius: 0.75rem;
    transition: all 0.3s ease;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    font-weight: 500;
    border: none;
    cursor: pointer;
    }

    .footer-btn:hover {
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    transform: translateY(-0.25rem);
    }

    .btn-green {
    background: linear-gradient(to right, var(--c-green-500), var(--c-emerald-600));
    }
    .btn-green:hover {
    background: linear-gradient(to right, #059669, #065F46);
    }

    .btn-blue {
    background: linear-gradient(to right, var(--c-blue-500), #06B6D4);
    }
    .btn-blue:hover {
    background: linear-gradient(to right, #2563EB, #0891B2);
    }

    .btn-purple {
    background: linear-gradient(to right, var(--c-purple-500), #EC4899); /* to-pink-600 */
    }
    .btn-purple:hover {
    background: linear-gradient(to right, #7C3AED, #DB2777);
    }

    .footer-copyright {
    margin-top: 2rem;
    padding-top: 1.5rem;
    border-top: 1px solid #E5E7EB;
    }

    .copyright-text {
    font-size: 0.875rem;
    color: #6B7280;
    margin-bottom: 0.5rem;
    }

    .version-text {
    font-size: 0.75rem;
    color: #9CA3AF;
    }

    @keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
    }

    .animate-fadeIn {
    animation: fadeIn 0.5s ease-out;
    }

    @keyframes bounce {
    0%, 100% {
        transform: translateY(-25%);
        animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    50% {
        transform: translateY(0);
        animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
    }
    </style>
