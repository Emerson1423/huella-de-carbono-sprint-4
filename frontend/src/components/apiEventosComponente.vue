<template>
  <div class="eventos-container">
    <header class="eventos-header">
      <h1>Eventos Ambientales</h1>
    </header>

    <!-- Banner principal -->
    <div class="banner-principal">
      <div class="banner-content">
        <h2>Protejamos nuestro hogar:</h2>
        <h2>la Tierra, ¡Súmate hoy!</h2>
      </div>
    </div>

    <!-- Filtros por categoría -->
    <div class="filtros-container">
      <h3>Filtrar por tipo de evento:</h3>
      <div class="filtros-botones">
        <button 
          @click="filtrarPorCategoria(null)"
          :class="{ activo: categoriaSeleccionada === null }"
          class="btn-filtro"
        >
          Todos
        </button>
        <button 
          v-for="categoria in categorias" 
          :key="categoria.value"
          @click="filtrarPorCategoria(categoria.value)"
          :class="{ activo: categoriaSeleccionada === categoria.value }"
          class="btn-filtro"
        >
          {{ categoria.label }}
        </button>
      </div>
    </div>

    <!-- Mensaje de carga -->
    <div v-if="cargando" class="mensaje-carga">
      <div class="spinner"></div>
      <p>Cargando eventos...</p>
    </div>

    <!-- Mensaje de error -->
    <div v-else-if="error" class="mensaje-error">
      <p>{{ error }}</p>
      <button @click="cargarEventos" class="btn-reintentar">Reintentar</button>
    </div>

    <!-- Lista de eventos -->
    <div v-else class="eventos-lista">
      <p class="tipo-eventos">
        {{ categoriaSeleccionada ? `Eventos de: ${obtenerNombreCategoria(categoriaSeleccionada)}` : 'Todos los eventos' }}
        ({{ eventosFiltrados.length }})
      </p>
      
      <div 
        v-for="evento in eventosFiltrados" 
        :key="evento.id"
        class="evento-card"
        :class="{ expandido: eventosExpandidos.includes(evento.id) }"
      >
        <!-- Imagen siempre visible -->
        <div class="evento-imagen">
          <img :src="evento.imagen" :alt="evento.titulo" />
          <!-- Contador de días -->
          <div class="contador-dias" :class="obtenerClaseContador(evento.fecha)">
            <div class="dias-numero">{{ calcularDiasFaltantes(evento.fecha) }}</div>
            <div class="dias-texto">días</div>
          </div>
        </div>

        <div class="evento-info">
          <div class="evento-header">
            <h3>{{ evento.titulo }}</h3>
            <span class="evento-categoria">{{ formatearCategoria(evento.categoria) }}</span>
          </div>
          
          <p class="evento-descripcion">{{ evento.descripcion }}</p>
          
          <!-- Detalles expandibles -->
          <transition name="slide-fade">
            <div v-if="eventosExpandidos.includes(evento.id)" class="evento-detalles-expandidos">
              <div class="evento-detalles">
                <div class="detalle-item destacado">
                  <i class="fas fa-calendar-alt"></i>
                  <span><strong>Fecha:</strong> {{ formatearFecha(evento.fecha) }}</span>
                </div>
                <div class="detalle-item destacado">
                  <i class="fas fa-clock"></i>
                  <span><strong>Hora:</strong> {{ evento.hora }}</span>
                </div>
                <div class="detalle-item destacado">
                  <i class="fas fa-map-marker-alt"></i>
                  <span><strong>Lugar:</strong> {{ evento.ubicacion }}</span>
                </div>
              </div>
              
              <div class="evento-organizador-info">
                <h4><i class="fas fa-users"></i> Información del Organizador</h4>
                <p><strong>Organiza:</strong> {{ evento.organizador.nombre }}</p>
                
                <div class="contacto-organizador">
                  <div v-if="evento.organizador.email" class="contacto-item">
                    <i class="fas fa-envelope"></i>
                    <a :href="'mailto:' + evento.organizador.email">{{ evento.organizador.email }}</a>
                  </div>
                  
                  <div v-if="evento.organizador.telefono" class="contacto-item">
                    <i class="fas fa-phone"></i>
                    <a :href="'tel:' + evento.organizador.telefono">{{ evento.organizador.telefono }}</a>
                  </div>
                  
                  <div v-if="evento.organizador.sitioWeb" class="contacto-item">
                    <i class="fas fa-globe"></i>
                    <a :href="evento.organizador.sitioWeb" target="_blank" rel="noopener">Sitio Web</a>
                  </div>
                  
                  <div v-if="evento.organizador.facebook" class="contacto-item">
                    <i class="fab fa-facebook"></i>
                    <a :href="evento.organizador.facebook" target="_blank" rel="noopener">Facebook</a>
                  </div>
                </div>
              </div>
            </div>
          </transition>
          
          <button 
            @click="toggleDetalles(evento.id)" 
            class="btn-ver-mas"
          >
            {{ eventosExpandidos.includes(evento.id) ? 'Ocultar detalles' : 'Ver detalles' }}
            <i :class="eventosExpandidos.includes(evento.id) ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"></i>
          </button>
        </div>
      </div>

      <!-- Mensaje cuando no hay eventos -->
      <div v-if="eventosFiltrados.length === 0 && !cargando" class="sin-eventos">
        <i class="fas fa-calendar-times fa-3x"></i>
        <p v-if="categoriaSeleccionada">
          No hay eventos de "{{ obtenerNombreCategoria(categoriaSeleccionada) }}" disponibles.
        </p>
        <p v-else>No hay eventos disponibles en este momento.</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'EventosComponente',
  
  data() {
    return {
      eventos: [],
      categoriaSeleccionada: null,
      cargando: true,
      error: null,
      eventosExpandidos: [],
      pagination: {
        page: 1,
        limit: 10,
        total: 0
      },
      categorias: [
        { value: 'cambio-climatico', label: 'Cambio Climático' },
        { value: 'conservacion-fauna', label: 'Conservación de Fauna' },
        { value: 'energia-renovable', label: 'Energía Renovable' },
        { value: 'reciclaje', label: 'Reciclaje' },
        { value: 'jornada-limpieza', label: 'Jornada de Limpieza' },
        { value: 'taller', label: 'Talleres' },
        { value: 'reforestacion', label: 'Reforestación' },
        { value: 'educacion-ambiental', label: 'Educación Ambiental' }
      ]
    };
  },
  
  computed: {
    eventosFiltrados() {
      if (!this.categoriaSeleccionada) {
        return this.eventos;
      }
      return this.eventos.filter(evento => evento.categoria === this.categoriaSeleccionada);
    }
  },
  
  mounted() {
    this.cargarEventos();
  },
  
  methods: {
    async cargarEventos() {
      try {
        this.cargando = true;
        this.error = null;
        
        const response = await axios.get('https://api-rest-eventos-9kvx.onrender.com/api/eventos', {
          params: {
            page: this.pagination.page,
            limit: this.pagination.limit,
            estado: 'activo'
          }
        });
        
        if (response.data.success) {
          this.eventos = response.data.data;
          this.pagination = response.data.pagination;
        } else {
          this.error = response.data.message || 'Error al cargar eventos';
        }
        
      } catch (error) {
        console.error('Error al cargar eventos:', error);
        this.error = 'No se pudieron cargar los eventos. Intenta de nuevo más tarde.';
      } finally {
        this.cargando = false;
      }
    },
    
    toggleDetalles(eventoId) {
      const index = this.eventosExpandidos.indexOf(eventoId);
      if (index > -1) {
        this.eventosExpandidos.splice(index, 1);
      } else {
        this.eventosExpandidos.push(eventoId);
      }
    },
    
    filtrarPorCategoria(categoria) {
      this.categoriaSeleccionada = categoria;
      this.eventosExpandidos = [];
    },
    
    obtenerNombreCategoria(categoria) {
      const cat = this.categorias.find(c => c.value === categoria);
      return cat ? cat.label : categoria;
    },
    
    calcularDiasFaltantes(fechaEvento) {
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      
      const fecha = new Date(fechaEvento);
      fecha.setHours(0, 0, 0, 0);
      
      const diferencia = fecha - hoy;
      const dias = Math.ceil(diferencia / (1000 * 60 * 60 * 24));
      
      if (dias < 0) return 'Finalizado';
      if (dias === 0) return '¡Hoy!';
      return dias;
    },
    
    obtenerClaseContador(fechaEvento) {
      const dias = this.calcularDiasFaltantes(fechaEvento);
      
      if (dias === '¡Hoy!' || dias === 'Finalizado') return 'especial';
      if (dias <= 3) return 'urgente';
      if (dias <= 7) return 'proximo';
      return 'normal';
    },
    
    formatearFecha(fechaISO) {
      const fecha = new Date(fechaISO);
      return fecha.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    },
    
    formatearCategoria(categoria) {
      const categorias = {
        'cambio-climatico': 'Cambio Climático',
        'conservacion-fauna': 'Conservación de Fauna',
        'energia-renovable': 'Energía Renovable',
        'reciclaje': 'Reciclaje',
        'jornada-limpieza': 'Jornada de Limpieza',
        'taller': 'Taller',
        'reforestacion': 'Reforestación',
        'educacion-ambiental': 'Educación Ambiental'
      };
      return categorias[categoria] || categoria;
    }
  }
}
</script>

<style scoped>
/* Animación para expandir/contraer detalles */
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s ease-in;
}

.slide-fade-enter-from {
  transform: translateY(-10px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}

/* Estilos para los detalles expandidos */
.evento-detalles-expandidos {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 2px solid #e0e0e0;
}

.evento-card {
  transition: all 0.3s ease;
}

.evento-card.expandido {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn-ver-mas {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.btn-ver-mas i {
  transition: transform 0.3s ease;
}

.eventos-container {
  font-family: 'Poppins', sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  margin-top: 80px;
}

.eventos-header {
  text-align: center;
  margin-bottom: 30px;
}

.eventos-header h1 {
  font-size: 2.3rem;
  font-weight: bold;
  color: #0b6d11;
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.banner-principal {
  background: linear-gradient(135deg, rgba(46, 125, 50, 0.9), rgba(76, 175, 80, 0.9)),
              url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200') center/cover;
  border-radius: 20px;
  padding: 80px 40px;
  margin-bottom: 40px;
  text-align: center;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.banner-content h2 {
  color: white;
  font-size: 2.5rem;
  margin: 5px 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

/* Filtros */
.filtros-container {
  background: white;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.filtros-container h3 {
  margin: 0 0 15px 0;
  color: #333;
  font-size: 1.1rem;
}

.filtros-botones {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.btn-filtro {
  padding: 10px 20px;
  border: 2px solid #4caf50;
  background: white;
  color: #4caf50;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  font-size: 0.95rem;
}

.btn-filtro:hover {
  background: #e8f5e9;
  transform: translateY(-2px);
}

.btn-filtro.activo {
  background: #4caf50;
  color: white;
}

.tipo-eventos {
  font-size: 1.2rem;
  color: #555;
  margin-bottom: 20px;
  padding-left: 10px;
  border-left: 4px solid #4caf50;
  font-weight: 600;
}

.mensaje-carga,
.mensaje-error {
  text-align: center;
  padding: 60px 20px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #4caf50;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.mensaje-error {
  color: #d32f2f;
}

.btn-reintentar {
  background: #4caf50;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 15px;
  transition: all 0.3s ease;
}

.btn-reintentar:hover {
  background: #45a049;
  transform: translateY(-2px);
}

.eventos-lista {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.evento-card {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 20px;
  background: white;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  overflow: hidden;
}

.evento-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.evento-imagen {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  height: 200px;
  width: 100%;
  max-width: 100%;
}

.evento-imagen img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* Contador de días */
.contador-dias {
  position: absolute;
  top: 15px;
  right: 15px;
  background: rgba(255, 255, 255, 0.95);
  padding: 10px 15px;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  min-width: 70px;
}

.dias-numero {
  font-size: 1.8rem;
  font-weight: bold;
  line-height: 1;
}

.dias-texto {
  font-size: 0.75rem;
  text-transform: uppercase;
  margin-top: 2px;
}

.contador-dias.urgente {
  background: rgba(244, 67, 54, 0.95);
  color: white;
}

.contador-dias.proximo {
  background: rgba(255, 152, 0, 0.95);
  color: white;
}

.contador-dias.normal {
  background: rgba(76, 175, 80, 0.95);
  color: white;
}

.contador-dias.especial {
  background: rgba(33, 150, 243, 0.95);
  color: white;
}

.evento-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.evento-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 15px;
}

.evento-header h3 {
  margin: 0;
  color: #2e7d32;
  font-size: 1.4rem;
  flex: 1;
}

.evento-categoria {
  background: #e8f5e9;
  color: #2e7d32;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  white-space: nowrap;
}

.evento-descripcion {
  color: #555;
  line-height: 1.6;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 5;
  line-clamp: 5;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.evento-detalles {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  padding: 15px;
  background: #f5f5f5;
  border-radius: 8px;
  margin: 10px 0;
}

.detalle-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
  font-size: 0.95rem;
}

.detalle-item.destacado {
  font-weight: 600;
  color: #333;
}

.detalle-item i {
  color: #4caf50;
  font-size: 1.1rem;
}

/* Información del organizador mejorada */
.evento-organizador-info {
  background: #e8f5e9;
  padding: 20px;
  border-radius: 12px;
  margin-top: 15px;
}

.evento-organizador-info h4 {
  color: #2e7d32;
  font-size: 1.1rem;
  margin: 0 0 15px 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.evento-organizador-info h4 i {
  color: #4caf50;
}

.evento-organizador-info > p {
  color: #333;
  font-size: 1rem;
  margin: 0 0 15px 0;
}

.contacto-organizador {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  margin-top: 10px;
}

.contacto-item {
  display: flex;
  align-items: center;
  gap: 8px;
  background: white;
  padding: 10px 12px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.contacto-item:hover {
  transform: translateX(5px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.contacto-item i {
  color: #4caf50;
  font-size: 1.1rem;
  min-width: 20px;
}

.contacto-item a {
  color: #555;
  text-decoration: none;
  font-size: 0.9rem;
  word-break: break-all;
}

.contacto-item a:hover {
  color: #2e7d32;
  text-decoration: underline;
}

.btn-ver-mas {
  background: #4caf50;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  align-self: flex-start;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.btn-ver-mas:hover {
  background: #45a049;
  transform: translateX(5px);
}

.sin-eventos {
  text-align: center;
  padding: 60px 20px;
  color: #888;
}

.sin-eventos i {
  color: #bbb;
  margin-bottom: 20px;
}

@media (max-width: 768px) {
  .eventos-header h1 {
    font-size: 2rem;
  }
  
  .banner-content h2 {
    font-size: 1.8rem;
  }
  
  .filtros-botones {
    gap: 8px;
  }
  
  .btn-filtro {
    font-size: 0.85rem;
    padding: 8px 16px;
  }
  
  .evento-card {
    grid-template-columns: 1fr;
    gap: 15px;
    padding: 16px;
  }
  
  .evento-imagen {
    height: 160px;
    width: 100%;
    max-width: 100%;
  }
  
  .evento-imagen img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 10px;
  }

  .evento-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .evento-detalles {
    flex-direction: column;
    gap: 10px;
  }
  
  .contacto-organizador {
    grid-template-columns: 1fr;
  }
}
</style>