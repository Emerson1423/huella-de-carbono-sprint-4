<template>
  <div class="admin-soporte-dashboard">
    <!-- Header con estadísticas -->
    <div class="stats-grid">
      <div class="stat-card pendiente">
        <div class="stat-icon">
          <img :src="pendienteIcono" class="icon-img" /></div>
        <div class="stat-info">
          <h3>{{ estadisticas.pendientes || 0 }}</h3>
          <p>Pendientes</p>
        </div>
      </div>
      <div class="stat-card en-proceso">
        <div class="stat-icon">
          <img :src="procesoIcono" class="icon-img" />
        </div>
        <div class="stat-info">
          <h3>{{ estadisticas.en_proceso || 0 }}</h3>
          <p>En Proceso</p>
        </div>
      </div>
      <div class="stat-card resuelto">
        <div class="stat-icon">
          <img :src="resueltoIcono" class="icon-img" />
        </div>
        <div class="stat-info">
          <h3>{{ estadisticas.resueltos || 0 }}</h3>
          <p>Resueltos</p>
        </div>
      </div>
      <div class="stat-card total">
        <div class="stat-icon">
          <img :src="totalIcono" class="icon-img" />
        </div>
        <div class="stat-info">
          <h3>{{ estadisticas.total_mensajes || 0 }}</h3>
          <p>Total</p>
        </div>
      </div>
    </div>

    <!-- Filtros -->
    <div class="filtros-section">
      <div class="filtros-group">
        <select v-model="filtros.estado" @change="cargarMensajes" class="filtro-select">
          <option value="">Todos los estados</option>
          <option value="pendiente">Pendientes</option>
          <option value="en_proceso">En Proceso</option>
          <option value="resuelto">Resueltos</option>
          <option value="cerrado">Cerrados</option>
        </select>

        <select v-model="filtros.prioridad" @change="cargarMensajes" class="filtro-select">
          <option value="">Todas las prioridades</option>
          <option value="baja">Baja</option>
          <option value="media">Media</option>
          <option value="alta">Alta</option>
          <option value="urgente">Urgente</option>
        </select>

        <select v-model="filtros.categoria" @change="cargarMensajes" class="filtro-select">
          <option value="">Todas las categorías</option>
          <option v-for="cat in categorias" :key="cat.id" :value="cat.id">
            {{ cat.nombre }}
          </option>
        </select>

        <button @click="limpiarFiltros" class="btn-limpiar">
          Limpiar filtros
        </button>
      </div>
    </div>

    <!-- Lista de mensajes -->
    <div class="mensajes-container">
      <div v-if="cargando" class="loading">
        <div class="spinner"></div>
        <p>Cargando mensajes...</p>
      </div>

      <div v-else-if="mensajes.length === 0" class="empty-state">
        <p>No hay mensajes para mostrar</p>
      </div>

      <div v-else class="mensajes-lista">
        <div 
          v-for="mensaje in mensajes" 
          :key="mensaje.id"
          class="mensaje-card"
          :class="[`prioridad-${mensaje.prioridad}`, `estado-${mensaje.estado}`]"
          @click="abrirMensaje(mensaje)"
        >
          <div class="mensaje-header">
            <div class="mensaje-info">
              <span class="mensaje-id">#{{ mensaje.id }}</span>
              <span :class="`badge badge-${mensaje.prioridad}`">
                {{ mensaje.prioridad.toUpperCase() }}
              </span>
              <span :class="`badge badge-estado badge-${mensaje.estado}`">
                {{ formatearEstado(mensaje.estado) }}
              </span>
            </div>
            <div class="mensaje-fecha">
              {{ formatearFecha(mensaje.fecha_creacion) }}
            </div>
          </div>

          <div class="mensaje-body">
            <h3 class="mensaje-asunto">{{ mensaje.asunto }}</h3>
            <p class="mensaje-preview">{{ mensaje.mensaje.substring(0, 150) }}...</p>
            <div class="mensaje-meta">
              <span class="categoria">
                {{ mensaje.categoria_icono }} {{ mensaje.categoria_nombre }}
              </span>
              <span class="usuario">
                {{ mensaje.nombre_usuario }}
              </span>
              <span v-if="mensaje.total_respuestas > 0" class="respuestas">
                {{ mensaje.total_respuestas }} respuesta(s)
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Paginación -->
      <div v-if="pagination.totalPages > 1" class="pagination">
        <button 
          @click="cambiarPagina(pagination.currentPage - 1)"
          :disabled="pagination.currentPage === 1"
          class="btn-page"
        >
          ← Anterior
        </button>
        <span class="page-info">
          Página {{ pagination.currentPage }} de {{ pagination.totalPages }}
        </span>
        <button 
          @click="cambiarPagina(pagination.currentPage + 1)"
          :disabled="pagination.currentPage === pagination.totalPages"
          class="btn-page"
        >
          Siguiente →
        </button>
      </div>
    </div>

    <!-- Modal para ver y responder mensaje -->
    <div v-if="mensajeSeleccionado" class="modal-overlay" @click.self="cerrarModal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Ticket #{{ mensajeSeleccionado.id }} - {{ mensajeSeleccionado.asunto }}</h2>
          <button @click="cerrarModal" class="btn-close">✕</button>
        </div>

        <div class="modal-body">
          <!-- Info del mensaje original -->
          <div class="mensaje-original">
            <div class="mensaje-info-detalle">
              <span :class="`badge badge-${mensajeSeleccionado.prioridad}`">
                {{ mensajeSeleccionado.prioridad.toUpperCase() }}
              </span>
              <span :class="`badge badge-estado badge-${mensajeSeleccionado.estado}`">
                {{ formatearEstado(mensajeSeleccionado.estado) }}
              </span>
              <span class="categoria">
                {{ mensajeSeleccionado.categoria_icono }} {{ mensajeSeleccionado.categoria_nombre }}
              </span>
            </div>
            
            <div class="usuario-info">
              <strong>Usuario:</strong> {{ mensajeSeleccionado.nombre_usuario }}
              <span class="fecha-creacion">{{ formatearFecha(mensajeSeleccionado.fecha_creacion) }}</span>
            </div>

            <div class="mensaje-texto">
              {{ mensajeSeleccionado.mensaje }}
            </div>
          </div>

  
        <!-- Controles de estado y prioridad -->
        <div class="controles-mensaje">
          <div class="control-group">
            <label for="estado-select">Estado:</label>
            <select 
              id="estado-select"
              v-model="nuevoEstado" 
              @change="actualizarEstado"
              class="control-select"
            >
              <option value="pendiente">Pendiente</option>
              <option value="en_proceso">En Proceso</option>
              <option value="resuelto">Resuelto</option>
              <option value="cerrado">Cerrado</option>
            </select>
          </div>

          <div class="control-group">
            <label for="prioridad-select">Prioridad:</label>
            <select 
              id="prioridad-select"
              v-model="nuevaPrioridad" 
              @change="actualizarPrioridad"
              class="control-select"
            >
              <option value="baja">Baja</option>
              <option value="media">Media</option>
              <option value="alta">Alta</option>
              <option value="urgente">Urgente</option>
            </select>
          </div>
        </div>
      

          <!-- Respuestas existentes -->
          <div class="respuestas-section">
            <h3>Conversación</h3>
            <div v-if="respuestas.length === 0" class="no-respuestas">
              No hay respuestas aún
            </div>
            <div v-else class="respuestas-lista">
              <div 
                v-for="respuesta in respuestas" 
                :key="respuesta.id"
                class="respuesta-item"
                :class="{ 'respuesta-admin': respuesta.es_admin }"
              >
                <div class="respuesta-header">
                  <span class="respuesta-autor">
                    {{ respuesta.es_admin ? ' Admin' : ' ' + respuesta.nombre_usuario }}
                  </span>
                  <span class="respuesta-fecha">
                    {{ formatearFecha(respuesta.fecha_creacion) }}
                  </span>
                </div>
                <div class="respuesta-texto">
                  {{ respuesta.respuesta }}
                </div>
              </div>
            </div>
          </div>

          <!-- Formulario de respuesta -->
          <div class="respuesta-form">
            <h3>Responder</h3>
            <textarea 
              v-model="nuevaRespuesta"
              placeholder="Escribe tu respuesta aquí..."
              rows="4"
              class="respuesta-textarea"
              :disabled="enviandoRespuesta"
            ></textarea>
            <div class="form-actions">
              <button 
                @click="enviarRespuesta"
                :disabled="!nuevaRespuesta.trim() || enviandoRespuesta"
                class="btn btn-primary"
              >
                {{ enviandoRespuesta ? 'Enviando...' : 'Enviar Respuesta' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Notificación -->
    <div v-if="notificacion.mostrar" :class="`notificacion notificacion-${notificacion.tipo}`">
      {{ notificacion.mensaje }}
    </div>
  </div>
</template>

<script>
import pendienteIcono from '@/assets/icons/pendientes.png'
import procesoIcono from '@/assets/icons/proceso.png' 
import resueltoIcono from '@/assets/icons/resuelto.png' 
import totalIcono from '@/assets/icons/total.png' 
export default {
  name: 'AdminSoporteDashboard',
  data() {
    return {
      mensajes: [],
      categorias: [],
      mensajeSeleccionado: null,
      respuestas: [],
      nuevaRespuesta: '',
      nuevoEstado: '',
      nuevaPrioridad: '',
      cargando: false,
      enviandoRespuesta: false,
      pendienteIcono,
      resueltoIcono,
      procesoIcono,
      totalIcono,
      filtros: {
        estado: '',
        prioridad: '',
        categoria: ''
      },
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 10
      },
      estadisticas: {
        total_mensajes: 0,
        pendientes: 0,
        en_proceso: 0,
        resueltos: 0,
        cerrados: 0
      },
      notificacion: {
        mostrar: false,
        mensaje: '',
        tipo: 'success'
      }
    };
  },
  mounted() {
    this.cargarCategorias();
    this.cargarEstadisticas();
    this.cargarMensajes();
  },
  methods: {
    async cargarCategorias() {
      try {
        const response = await fetch('/api/soporte/categorias');
        const data = await response.json();
        if (data.success) {
          this.categorias = data.categorias;
        }
      } catch (error) {
        console.error('Error cargando categorías:', error);
      }
    }, 

    async cargarEstadisticas() {
      try {
        const response = await fetch('http://localhost:3000/api/soporte/admin/estadisticas', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        if (data.success) {
          this.estadisticas = data.estadisticas;
        }
      } catch (error) {
        console.error('Error cargando estadísticas:', error);
      }
    },

    async cargarMensajes() {
      this.cargando = true;
      try {
        const params = new URLSearchParams({
          page: this.pagination.currentPage,
          limit: this.pagination.itemsPerPage
        });

        if (this.filtros.estado) params.append('estado', this.filtros.estado);
        if (this.filtros.prioridad) params.append('prioridad', this.filtros.prioridad);
        if (this.filtros.categoria) params.append('categoria', this.filtros.categoria);

        const response = await fetch(`http://localhost:3000/api/soporte/admin/mensajes?${params}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        const data = await response.json();
        if (data.success) {
          this.mensajes = data.mensajes;
          this.pagination = data.pagination;
        }
      } catch (error) {
        console.error('Error cargando mensajes:', error);
        this.mostrarNotificacion('Error al cargar mensajes', 'error');
      } finally {
        this.cargando = false;
      }
    },

    async abrirMensaje(mensaje) {
      this.mensajeSeleccionado = mensaje;
      this.nuevoEstado = mensaje.estado;
      this.nuevaPrioridad = mensaje.prioridad;
      await this.cargarRespuestas(mensaje.id);
    },

    async cargarRespuestas(mensajeId) {
      try {
        const response = await fetch(`http://localhost:3000/api/soporte/admin/mensaje/${mensajeId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        if (data.success) {
          this.respuestas = data.respuestas;
        }
      } catch (error) {
        console.error('Error cargando respuestas:', error);
      }
    },

    async enviarRespuesta() {
      if (!this.nuevaRespuesta.trim()) return;

      this.enviandoRespuesta = true;
      try {
        const response = await fetch('http://localhost:3000/api/soporte/admin/respuesta', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            mensaje_id: this.mensajeSeleccionado.id,
            respuesta: this.nuevaRespuesta
          })
        });

        const data = await response.json();
        if (data.success) {
          this.mostrarNotificacion('Respuesta enviada correctamente', 'success');
          this.nuevaRespuesta = '';
          await this.cargarRespuestas(this.mensajeSeleccionado.id);
        } else {
          this.mostrarNotificacion(data.error || 'Error al enviar respuesta', 'error');
        }
      } catch (error) {
        console.error('Error enviando respuesta:', error);
        this.mostrarNotificacion('Error al enviar respuesta', 'error');
      } finally {
        this.enviandoRespuesta = false;
      }
    },

    async actualizarEstado() {
      try {
        const response = await fetch(`http://localhost:3000/api/soporte/admin/mensaje/${this.mensajeSeleccionado.id}/estado`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ estado: this.nuevoEstado })
        });

        const data = await response.json();
        if (data.success) {
          this.mostrarNotificacion('Estado actualizado', 'success');
          this.mensajeSeleccionado.estado = this.nuevoEstado;
          this.cargarMensajes();
          this.cargarEstadisticas();
        }
      } catch (error) {
        console.error('Error actualizando estado:', error);
        this.mostrarNotificacion('Error al actualizar estado', 'error');
      }
    },

    async actualizarPrioridad() {
      try {
        const response = await fetch(`http://localhost:3000/api/soporte/admin/mensaje/${this.mensajeSeleccionado.id}/prioridad`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ prioridad: this.nuevaPrioridad })
        });

        const data = await response.json();
        if (data.success) {
          this.mostrarNotificacion('Prioridad actualizada', 'success');
          this.mensajeSeleccionado.prioridad = this.nuevaPrioridad;
          this.cargarMensajes();
        }
      } catch (error) {
        console.error('Error actualizando prioridad:', error);
        this.mostrarNotificacion('Error al actualizar prioridad', 'error');
      }
    },

    cerrarModal() {
      this.mensajeSeleccionado = null;
      this.respuestas = [];
      this.nuevaRespuesta = '';
    },

    limpiarFiltros() {
      this.filtros = {
        estado: '',
        prioridad: '',
        categoria: ''
      };
      this.pagination.currentPage = 1;
      this.cargarMensajes();
    },

    cambiarPagina(page) {
      this.pagination.currentPage = page;
      this.cargarMensajes();
    },

    formatearEstado(estado) {
      const estados = {
        'pendiente': 'Pendiente',
        'en_proceso': 'En Proceso',
        'resuelto': 'Resuelto',
        'cerrado': 'Cerrado'
      };
      return estados[estado] || estado;
    },
    formatearFecha(fecha) {
      const date = new Date(fecha);
      const ahora = new Date();
      const diff = ahora - date;
      const minutos = Math.floor(diff / 60000);
      const horas = Math.floor(diff / 3600000);
      const dias = Math.floor(diff / 86400000);

      if (minutos < 1) return 'Hace un momento';
      if (minutos < 60) return `Hace ${minutos} minuto${minutos === 1 ? '' : 's'}`;
      if (horas < 24) return `Hace ${horas} hora${horas === 1 ? '' : 's'}`;
      if (dias < 7) return `Hace ${dias} día${dias === 1 ? '' : 's'}`;
      
      return date.toLocaleDateString('es-ES', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },

    mostrarNotificacion(mensaje, tipo = 'success') {
      this.notificacion = {
        mostrar: true,
        mensaje,
        tipo
      };
      setTimeout(() => {
        this.notificacion.mostrar = false;
      }, 3000);
    }
  }
};
</script>

<style scoped>
.admin-soporte-dashboard {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

/* Estadísticas */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.icon-img {
  width: 30px;
  height: 30px;
  object-fit: contain;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-info h3 {
  font-size: 2rem;
  margin: 0;
  color: #333;
}

.stat-info p {
  margin: 5px 0 0;
  color: #666;
  font-size: 0.9rem;
}

.stat-card.pendiente { border-left: 4px solid #ff9800; }
.stat-card.en-proceso { border-left: 4px solid #2196f3; }
.stat-card.resuelto { border-left: 4px solid #4caf50; }
.stat-card.total { border-left: 4px solid #9c27b0; }

/* Filtros */
.filtros-section {
  background: white;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.filtros-group {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.filtro-select {
  padding: 10px 15px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 0.95rem;
  cursor: pointer;
  transition: border-color 0.2s;
}

.filtro-select:hover {
  border-color: #2196f3;
}

.btn-limpiar {
  padding: 10px 20px;
  background: #f5f5f5;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s;
}

.btn-limpiar:hover {
  background: #e0e0e0;
}

/* Mensajes */
.mensajes-container {
  min-height: 400px;
}

.loading {
  text-align: center;
  padding: 60px 20px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #2196f3;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #999;
  font-size: 1.1rem;
}

.mensajes-lista {
  display: grid;
  gap: 15px;
}

.mensaje-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: all 0.2s;
  border-left: 4px solid #e0e0e0;
}

.mensaje-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.mensaje-card.prioridad-urgente { border-left-color: #f44336; }
.mensaje-card.prioridad-alta { border-left-color: #ff9800; }
.mensaje-card.prioridad-media { border-left-color: #2196f3; }
.mensaje-card.prioridad-baja { border-left-color: #9e9e9e; }

.mensaje-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.mensaje-info {
  display: flex;
  gap: 10px;
  align-items: center;
}

.mensaje-id {
  font-weight: bold;
  color: #666;
}

.badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.badge-urgente { background: #ffebee; color: #c62828; }
.badge-alta { background: #fff3e0; color: #e65100; }
.badge-media { background: #e3f2fd; color: #1565c0; }
.badge-baja { background: #f5f5f5; color: #616161; }

.badge-estado {
  background: #e0e0e0;
  color: #666;
}

.badge-pendiente { background: #fff3e0; color: #e65100; }
.badge-en_proceso { background: #e3f2fd; color: #1565c0; }
.badge-resuelto { background: #e8f5e9; color: #2e7d32; }
.badge-cerrado { background: #f5f5f5; color: #616161; }

.mensaje-fecha {
  color: #999;
  font-size: 0.85rem;
}

.mensaje-asunto {
  margin: 0 0 10px;
  color: #333;
  font-size: 1.1rem;
}

.mensaje-preview {
  color: #666;
  margin: 0 0 15px;
  line-height: 1.5;
}

.mensaje-meta {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  font-size: 0.85rem;
  color: #999;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 32px rgba(0,0,0,0.2);
}

.modal-header {
  padding: 25px;
  border-bottom: 2px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  margin: 0;
  color: #333;
  font-size: 1.3rem;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #999;
  padding: 5px 10px;
  transition: color 0.2s;
}

.btn-close:hover {
  color: #333;
}

.modal-body {
  padding: 25px;
  overflow-y: auto;
}

.mensaje-original {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 25px;
}

.mensaje-info-detalle {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
  flex-wrap: wrap;
}

.usuario-info {
  margin-bottom: 15px;
  color: #666;
}

.fecha-creacion {
  margin-left: 15px;
  color: #999;
  font-size: 0.9rem;
}

.mensaje-texto {
  white-space: pre-wrap;
  line-height: 1.6;
  color: #333;
}

/* Controles */
.controles-mensaje {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 25px;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 12px;
}

.control-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #555;
}

.control-select {
  width: 100%;
  padding: 10px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 0.95rem;
  cursor: pointer;
}

/* Respuestas */
.respuestas-section {
  margin-bottom: 25px;
}

.respuestas-section h3 {
  margin: 0 0 15px;
  color: #333;
}

.no-respuestas {
  text-align: center;
  padding: 30px;
  color: #999;
}

.respuestas-lista {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.respuesta-item {
  background: #f9f9f9;
  padding: 15px;
  border-radius: 12px;
  border-left: 4px solid #e0e0e0;
}

.respuesta-item.respuesta-admin {
  background: #e3f2fd;
  border-left-color: #2196f3;
}

.respuesta-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 0.9rem;
}

.respuesta-autor {
  font-weight: 600;
  color: #555;
}

.respuesta-fecha {
  color: #999;
}

.respuesta-texto {
  white-space: pre-wrap;
  line-height: 1.6;
  color: #333;
}

/* Formulario de respuesta */
.respuesta-form {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 12px;
}

.respuesta-form h3 {
  margin: 0 0 15px;
  color: #333;
}

.respuesta-textarea {
  width: 100%;
  padding: 15px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-family: inherit;
  font-size: 0.95rem;
  resize: vertical;
  transition: border-color 0.2s;
}

.respuesta-textarea:focus {
  outline: none;
  border-color: #2196f3;
}

.respuesta-textarea:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
}

.form-actions {
  margin-top: 15px;
  display: flex;
  justify-content: flex-end;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: #2196f3;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #1976d2;
}

.btn-primary:disabled {
  background: #ccc;
  cursor: not-allowed;
}

/* Paginación */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 30px;
  padding: 20px;
}

.btn-page {
  padding: 10px 20px;
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.btn-page:hover:not(:disabled) {
  background: #2196f3;
  color: white;
  border-color: #2196f3;
}

.btn-page:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  color: #666;
  font-weight: 500;
}

/* Notificación */
.notificacion {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 15px 25px;
  border-radius: 8px;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  z-index: 2000;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateX(400px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.notificacion-success {
  background: #4caf50;
  color: white;
}

.notificacion-error {
  background: #f44336;
  color: white;
}

/* Responsive */
@media (max-width: 768px) {
  .admin-soporte-dashboard {
    padding: 10px;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }

  .filtros-group {
    flex-direction: column;
  }

  .filtro-select {
    width: 100%;
  }

  .modal-content {
    max-width: 100%;
    max-height: 100vh;
    border-radius: 0;
  }

  .mensaje-meta {
    flex-direction: column;
    gap: 8px;
  }

  .controles-mensaje {
    grid-template-columns: 1fr;
  }

  .pagination {
    flex-direction: column;
    gap: 10px;
  }
}
</style>