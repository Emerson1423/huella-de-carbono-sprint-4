<template>
  <NavComponente></NavComponente>
  
  <div class="detalle-container">
    <div class="detalle-habito">
      <div class="detalle-contenido">
        
        
        <h2 class="detalle-title">{{ habito.title }}</h2>
        
        <p class="detalle-descripcion">{{ habito.desc }}</p>

        
        <div v-if="habito.explicacionCompleta" class="explicacion-completa">
        <div class="titulo-explicacion">
          
          <p v-html="habito.explicacionCompleta.replace(/\n/g, '<br>')"></p>
        </div>
        </div>

        <!-- BENEFICIOS -->
         
        <div v-if="habito.beneficios" class="desplegable" @click="toggle('beneficios')" :class="{ activo: abierto.beneficios }">
          <div class="desplegable-header"> Beneficios</div>
          <ul class="desplegable-contenido">
            <li v-for="beneficio in habito.beneficios" :key="beneficio">
              {{ beneficio }}
            </li>
          </ul>
        </div>

        <!-- CONSEJOS PRÁCTICOS -->
         
        <div v-if="habito.consejosPracticos" class="desplegable" @click="toggle('consejos')" :class="{ activo: abierto.consejos }">
          <div class="desplegable-header"> Consejos prácticos</div>
          <ul class="desplegable-contenido">
            <li v-for="consejo in habito.consejosPracticos" :key="consejo">
              {{ consejo }}
            </li>
          </ul>
        </div>

        <!-- ARTÍCULOS -->
        <div v-if="habito.articulos" class="articulos-section">
          <h3>Lee más información </h3> 
          <div class="articulos-grid">
            <div v-for="articulo in habito.articulos" :key="articulo.url" class="articulo-card">
              <h4>{{ articulo.titulo }}</h4>
              <p class="fuente">Fuente: {{ articulo.fuente }}</p>
              <a :href="articulo.url" target="_blank" class="filter-btn link-btn">
                Leer aquí 
              </a>
            </div>
          </div>
        </div>

        <!-- VIDEOS -->
         <div v-if="habito.videos" class="videos-section">
          <h3>Video educativo</h3> 
          <div class="videos-grid">
            <div v-for="video in habito.videos" :key="video.url" class="video-card">
              
              <!-- VISTA PREVIA DEL VIDEO -->
              <div class="video-preview" @click="abrirVideo(video.url)">
                <img 
                  :src="obtenerThumbnailYoutube(video.url)" 
                  :alt="video.titulo"
                  class="video-thumbnail"
                />
                <div class="play-button">
                  <div class="play-icon">▶ Duración</div> 
                </div>
                <div class="video-duracion">{{ video.duracion }}</div>
              </div>
              
              <div class="video-info">
                <h4>{{ video.titulo }}</h4>
                <a :href="video.url" target="_blank" class="filter-btn red link-btn red">
                  Ver en YouTube 
               </a>
              </div>
            </div>
          </div>
        </div>
        
      </div>
      <!-- botones de navegacion y acciones -->
      <div class="botones-navegacion">
        <!-- btn anterior -->
        <button 
          @click="$emit('anterior')" 
          :disabled="habitoActual === 0"
          class="filter-btn"
        >
          ← Anterior
        </button>

        <!-- boton agregar habito -->
        <button 
          @click="$emit('agregar')" 
          class="filter-btn green"
        >
          ✓ Agregar Hábito
        </button>

        <!-- boton siguiente -->
        <button 
          @click="$emit('siguiente')" 
          :disabled="habitoActual === totalHabitos - 1"
          class="filter-btn"
        >
          Siguiente →
        </button>

        <!-- boton para volver -->
        <button 
          @click="$emit('volver')" 
          class="filter-btn gray"
        >
          ← Volver a la Lista
        </button>
      </div>

       
      <div class="indicador-progreso">
        <span>{{ habitoActual + 1 }} de {{ totalHabitos }}</span>
        <div class="barra-progreso">
          <div 
            class="progreso-actual" 
            :style="{ width: ((habitoActual + 1) / totalHabitos * 100) + '%' }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import '../Style.css';
export default {
  name: 'HabitoDetalle', 
  
  props: {
    // Objeto con datos del hábito
    habito: {
      type: Object,
      required: true
    },
    
    // Índice actual del hábito
    habitoActual: {
      type: Number,
      required: true
    },
    
    // Total de hábitos
    totalHabitos: {
      type: Number,
      required: true
    }
  },
  
  
  emits: ['anterior', 'siguiente', 'volver', 'agregar'],

  // Navegación con teclado
  mounted() {
    window.addEventListener('keydown', this.manejarTeclas);
  },

  beforeUnmount() {
    window.removeEventListener('keydown', this.manejarTeclas);
  }, 
  
  //cambio aqui
  data() {
   
  return {
    abierto: {
      beneficios: false,
      consejos: false
    }
    };
    },
    //
watch: {
  habitoActual() {
    this.scrollToTop();
  }
},

methods: {
  manejarTeclas(evento) {
    switch(evento.key) {
      case 'ArrowLeft':
        evento.preventDefault();
        if (this.habitoActual > 0) {
          this.$emit('anterior');
        }
        break;
      case 'ArrowRight':
        evento.preventDefault();
        if (this.habitoActual < this.totalHabitos - 1) {
          this.$emit('siguiente');
        }
        break;
      case 'Escape':
        evento.preventDefault();
        this.$emit('volver');
        break;
      case 'Enter':
        evento.preventDefault();
        this.$emit('agregar'); 
        break;
    } 
  }, 
  //cambio aqui
  toggle(seccion) {
    this.abierto[seccion] = !this.abierto[seccion];
  }, 
//
  /**
   * Extrae el thumbnail de YouTube automáticamente
   */
  obtenerThumbnailYoutube(url) {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
    const match = url.match(regex);

    if (match && match[1]) {
      const videoId = match[1];
      return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    }

    return 'https://via.placeholder.com/480x360/cccccc/666666?text=Video';
  }, 

  abrirVideo(url) {
    window.open(url, '_blank');
  },
  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
} 
}
};

</script>
<style scoped>
/* Contenedor principal */
.detalle-container {
  max-width: 1000px;
  margin: 2rem auto;
  padding: 0 1rem;
}

/* Card del hábito */
.detalle-habito {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Contenido interno */
.detalle-contenido {
  padding: 2rem;
  text-align: center;
}

/* Título del hábito */
.detalle-title {
  font-size: 2.2rem;
  font-weight: bold;
  color: #2e7d32;
  margin-bottom: 1.5rem;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* Párrafos */
.detalle-parrafo {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #444;
  margin-bottom: 1.5rem;
  text-align: justify;
}

/* Botones de navegación */
.botones-navegacion {
  display: flex;
  justify-content: center;
  gap: 1rem;
  padding: 2rem;
  flex-wrap: wrap;
  background: #f8f9fa;
}

/*.btn-nav,
.btn-agregar,
.btn-volver {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 120px;
  font-size: 0.95rem;
}

.btn-nav {
  background: #2e7d32;
  color: white;
}
.btn-nav:hover:not(:disabled) { background: #1b5e20; transform: translateY(-2px); }
.btn-nav:disabled { background: #ccc; cursor: not-allowed; transform: none; }

.btn-agregar {
  background: #4caf50;
  color: white;
  font-weight: 600;
}
.btn-agregar:hover { background: #45a049; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3); }

.btn-volver {
  background: #757575;
  color: white;
}
.btn-volver:hover { background: #616161; transform: translateY(-2px); }

/* Indicador de progreso */
.indicador-progreso {
  text-align: center;
  padding: 1.5rem;
  background: #f0f0f0;
  color: #666;
  font-size: 0.9rem;
  font-weight: 500;
}
.barra-progreso {
  width: 100%;
  height: 6px;
  background: #ddd;
  border-radius: 3px;
  margin-top: 0.5rem;
  overflow: hidden;
}
.progreso-actual {
  height: 100%;
  background: linear-gradient(90deg, #4caf50, #2e7d32);
  border-radius: 3px;
  transition: width 0.3s ease;
}

/* Secciones adicionales */
.explicacion-completa,
.consejos-section,
.articulos-section,
.videos-section {
  margin: 2rem 0;
  text-align: left;
}

.explicacion-completa {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.titulo-explicacion {
  display: flex;
  align-items: center;
  gap: 8px;
}

.icono-habitos {
  width: 40px;
  height: auto;
}

.explicacion-completa h3,
.beneficios-section h3,
.consejos-section h3,
.articulos-section h3,
.videos-section h3 {
  color: #2e7d32;
  font-size: 1.3rem;
  margin-bottom: 1rem;
  border-bottom: 2px solid #e8f5e8;
  padding-bottom: 0.5rem;
}


/* Cards de artículos y videos */
.articulos-grid,
.videos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.articulo-card,
.video-card {
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: transform 0.2s ease;
  
}

.articulo-card:hover,
.video-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.articulo-card h4,
.video-card h4 {
  color: #333;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}

.fuente,
.duracion {
  color: #666;
  font-size: 0.9rem;
  font-style: italic;
  margin-bottom: 1rem;
}

/* Descripción general */
.detalle-descripcion {
  font-size: 1.2rem;
  font-weight: normal;
  color: #444;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  text-align: justify;
}

/* Título de sección con icono */
.titulo-explicacion h3 {
  font-size: 1.5rem;
  font-weight: bold;
  color: #2e7d32;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 1rem;
}

/* Icono */
.icono-habitos {
  width: 120px;
  height: 120px;
  margin-bottom: 80px;
}

/* Texto de explicación completa */
.explicacion-completa p {
  font-size: 1.1rem;
  font-weight: normal;
  color: #555;
  line-height: 1.6;
  margin-top: 0.5rem;
  text-align: justify;
}

/* Lista de hábitos */
.explicacion-completa ul {
  list-style: disc;
  padding-left: 1.5rem;
  margin-top: 0.5rem;
}

.explicacion-completa li {
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
  color: #555;
  line-height: 1.5;
}

/* Cambio aqui */

/* Contenedor desplegable */
.desplegable{
  margin: 1.5rem 0;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
}

/* Cabecera */
.desplegable-header {
  background: #4caf50;
  color: #fff;
  padding: 0.8rem 1rem;
  font-weight: bold;
  cursor: pointer;
}

/* Contenido oculto */
.desplegable-contenido {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.4s ease, padding 0.3s ease;
  background: #f9f9f9;
  padding: 0 1rem; /* padding horizontal fijo */
  list-style-type: none;
}

/* Cuando pasas el puntero, se despliega */
.desplegable.activo .desplegable-contenido {
  max-height: 500px; /* ajusta según lo largo del texto */
  padding: 1rem;
}

/* Estilo de ítems */
.desplegable-contenido li {
  background: #f1f8e9;
  margin: 0.5rem 0;
  padding: 0.8rem;
  border-left: 4px solid #4caf50;
  border-radius: 4px;
}
.videos-grid {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.video-card {
  max-width: 1000px; 
  width: 100%;
  text-align: center;
  overflow: hidden;
}
.video-preview {
  position: relative;
  width: 100%;
  max-width: 100%;
  overflow: hidden;
}

.video-thumbnail {
  width: 100%;
  height: auto;
  display: block;
  max-width: 100%;
}

/*.link-btn:hover { background: #1b5e20; }

.video-btn { background: #d32f2f; }
.video-btn:hover { background: #b71c1c; }

/* Responsividad */
@media (max-width: 768px) {
  .detalle-container { margin: 1rem; padding: 0; }
  .detalle-contenido { padding: 1.5rem; }
  .detalle-title { font-size: 1.8rem; }
  .botones-navegacion { padding: 1.5rem; gap: 0.8rem; }
  .btn-nav, .btn-agregar, .btn-volver { min-width: 100px; padding: 10px 16px; font-size: 0.9rem; }
}

@media (max-width: 480px) {
  .botones-navegacion { flex-direction: column; align-items: center; }
  .btn-nav, .btn-agregar, .btn-volver { width: 100%; max-width: 200px; }
  .explicacion-completa { flex-direction: column; align-items: flex-start; }
  
}
</style>
