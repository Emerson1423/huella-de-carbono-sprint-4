<template>
  <div class="soporte-container">
    <!-- Header -->
    <div class="soporte-header">
      <h1>Centro de Ayuda y Soporte</h1>
      <p>¿Necesitas ayuda? Estamos aquí para ti</p>
    </div>

    <!-- Tabs -->
    <div class="tabs">
      <button 
        @click="activeTab = 'faq'" 
        :class="{ active: activeTab === 'faq' }"
        class="tab-btn">
        <i class="fas fa-question-circle"></i> FAQ
      </button>
      <button 
        @click="activeTab = 'contacto'" 
        :class="{ active: activeTab === 'contacto' }"
        class="tab-btn">
        <i class="fas fa-envelope"></i> Contactar Soporte
      </button>
      <button 
        @click="activeTab = 'mis-mensajes'" 
        :class="{ active: activeTab === 'mis-mensajes' }"
        class="tab-btn">
        <i class="fas fa-inbox"></i> Mis Mensajes
      </button>
    </div>

    <!-- FAQ Section -->
    <div v-if="activeTab === 'faq'" class="faq-section">
      <div class="search-box">
        <i class="fas fa-search"></i>
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Buscar en preguntas frecuentes...">
      </div>

      <div class="faq-categories">
        <div 
          v-for="categoria in faqsFiltradas" 
          :key="categoria.id"
          class="faq-category">
          <h3>
            <span>{{ categoria.icono }}</span>
            {{ categoria.nombre }}
          </h3>
          
          <div class="faq-items">
            <div 
              v-for="(faq, index) in categoria.faqs" 
              :key="index"
              class="faq-item"
              :class="{ expanded: faqExpandida === `${categoria.id}-${index}` }"
              @click="toggleFaq(`${categoria.id}-${index}`)">
              <div class="faq-question">
                <span>{{ faq.pregunta }}</span>
                <i :class="faqExpandida === `${categoria.id}-${index}` ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"></i>
              </div>
              <transition name="slide">
                <div v-if="faqExpandida === `${categoria.id}-${index}`" class="faq-answer">
                  {{ faq.respuesta }}
                </div>
              </transition>
            </div>
          </div>
        </div>
      </div>

      <div v-if="faqsFiltradas.length === 0" class="no-results">
        <i class="fas fa-search fa-3x"></i>
        <p>No se encontraron resultados para "{{ searchQuery }}"</p>
        <button @click="activeTab = 'contacto'" class="filter-btn green">
          Contactar Soporte
        </button>
      </div>
    </div>

    <!-- Formulario de Contacto -->
    <div v-if="activeTab === 'contacto'" class="contacto-section">
      <div v-if="mensajeEnviado" class="mensaje-exito">
        <i class="fas fa-check-circle fa-3x"></i>
        <h3>¡Mensaje Enviado!</h3>
        <p>Hemos recibido tu mensaje. Te responderemos pronto.</p>
        <button @click="resetFormulario" class="filter-btn green">
          Enviar Otro Mensaje
        </button>
      </div>

      <div v-else class="formulario-contacto">
        <div class="info-box">
          <i class="fas fa-info-circle"></i>
          <p>Tu mensaje será asociado a tu cuenta para un mejor seguimiento.</p>
        </div>

        <div class="form-group">
          <label>Categoría del Mensaje *</label>
          <select v-model="formulario.categoria_id" required>
            <option value="">Selecciona una categoría</option>
            <option 
              v-for="cat in categorias" 
              :key="cat.id" 
              :value="cat.id">
              {{ cat.icono }} {{ cat.descripcion }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label>Asunto *</label>
          <input 
            v-model="formulario.asunto" 
            type="text" 
            placeholder="Resumen breve de tu consulta"
            maxlength="200"
            required>
          <small>{{ formulario.asunto.length }}/200 caracteres</small>
        </div>

        <div class="form-group">
          <label>Mensaje *</label>
          <textarea 
            v-model="formulario.mensaje" 
            rows="6"
            placeholder="Describe tu problema, pregunta o sugerencia con el mayor detalle posible..."
            maxlength="5000"
            required></textarea>
          <small>{{ formulario.mensaje.length }}/5000 caracteres</small>
        </div>

        <div class="form-actions">
          <button 
            @click="enviarMensaje" 
            :disabled="!formularioValido || enviando"
            class="filter-btn green">
            <i class="fas fa-paper-plane"></i>
            {{ enviando ? 'Enviando...' : 'Enviar Mensaje' }}
          </button>
        </div>

        <p v-if="error" class="error-msg">{{ error }}</p>
      </div>
    </div>

    <!-- Mis Mensajes -->
    <div v-if="activeTab === 'mis-mensajes'" class="mensajes-section">
      <div v-if="cargandoMensajes" class="loading">
        <i class="fas fa-spinner fa-spin fa-3x"></i>
        <p>Cargando mensajes...</p>
      </div>

      <div v-else class="mensajes-layout">
        <!-- Lista de mensajes -->
        <div class="mensajes-lista-container">
          <div class="filtros-estado">
            <button 
              @click="filtroEstado = null"
              :class="{ active: filtroEstado === null }"
              class="filtro-btn">
              Todos
            </button>
            <button 
              @click="filtroEstado = 'pendiente'"
              :class="{ active: filtroEstado === 'pendiente' }"
              class="filtro-btn">
              Pendientes
            </button>
            <button 
              @click="filtroEstado = 'en_proceso'"
              :class="{ active: filtroEstado === 'en_proceso' }"
              class="filtro-btn">
              En Proceso
            </button>
            <button 
              @click="filtroEstado = 'resuelto'"
              :class="{ active: filtroEstado === 'resuelto' }"
              class="filtro-btn">
              Resueltos
            </button>
          </div>

          <div v-if="misMensajes.length === 0" class="no-mensajes">
            <i class="fas fa-inbox fa-3x"></i>
            <p>No tienes mensajes {{ filtroEstado ? 'con este estado' : 'de soporte' }}</p>
            <button @click="activeTab = 'contacto'" class="filter-btn green">
              Crear Mensaje
            </button>
          </div>

          <div v-else class="lista-mensajes">
            <div 
              v-for="mensaje in misMensajes" 
              :key="mensaje.id"
              class="mensaje-card"
              :class="{ selected: mensajeSeleccionado?.id === mensaje.id }"
              @click="verDetalleMensaje(mensaje.id)">
              <div class="mensaje-header">
                <span class="categoria">
                  {{ mensaje.categoria_icono }} {{ mensaje.categoria_nombre }}
                </span>
                <span :class="['estado-badge', mensaje.estado]">
                  {{ formatearEstado(mensaje.estado) }}
                </span>
              </div>
              <h4>{{ mensaje.asunto }}</h4>
              <p class="mensaje-preview">{{ mensaje.mensaje.substring(0, 80) }}...</p>
              <div class="mensaje-footer">
                <small>
                  <i class="fas fa-calendar"></i>
                  {{ formatearFecha(mensaje.fecha_creacion) }}
                </small>
                <i class="fas fa-chevron-right"></i>
              </div>
            </div>
          </div>
        </div>

        <!-- Panel de detalle -->
        <transition name="slide-panel">
          <div v-if="panelDetalle" class="detalle-panel">
            <div class="panel-header">
              <h3>
                <i class="fas fa-envelope-open-text"></i>
                Detalle del Mensaje
              </h3>
              <button @click="cerrarPanel" class="btn-cerrar">
                <i class="fas fa-times"></i>
              </button>
            </div>

            <div v-if="cargandoDetalle" class="panel-loading">
              <i class="fas fa-spinner fa-spin fa-2x"></i>
              <p>Cargando detalles...</p>
            </div>

            <div v-else-if="mensajeSeleccionado" class="panel-body">
              <!-- Información -->
              <div class="detalle-info">
                <div class="info-item">
                  <i class="fas fa-tag"></i>
                  <div>
                    <small>Categoría</small>
                    <p>{{ mensajeSeleccionado.categoria_icono }} {{ mensajeSeleccionado.categoria_nombre }}</p>
                  </div>
                </div>
                
                <div class="info-item">
                  <i class="fas fa-info-circle"></i>
                  <div>
                    <small>Estado</small>
                    <span :class="['estado-badge', mensajeSeleccionado.estado]">
                      {{ formatearEstado(mensajeSeleccionado.estado) }}
                    </span>
                  </div>
                </div>
                
                <div class="info-item">
                  <i class="fas fa-calendar"></i>
                  <div>
                    <small>Fecha</small>
                    <p>{{ formatearFechaCompleta(mensajeSeleccionado.fecha_creacion) }}</p>
                  </div>
                </div>
              </div>

              <!-- Asunto -->
              <div class="detalle-seccion">
                <h4>Asunto</h4>
                <p class="asunto-texto">{{ mensajeSeleccionado.asunto }}</p>
              </div>

              <!-- Mensaje original -->
              <div class="detalle-seccion">
                <h4>
                  <i class="fas fa-user"></i>
                  Tu Mensaje
                </h4>
                <div class="mensaje-contenido">
                  {{ mensajeSeleccionado.mensaje }}
                </div>
              </div>

              <!-- Respuesta del soporte -->
              <div v-if="mensajeSeleccionado.respuesta" class="detalle-seccion">
                <h4>
                  <i class="fas fa-reply"></i>
                  Respuesta del Soporte
                </h4>
                <div class="respuesta-box">
                  <div class="respuesta-header">
                    <span class="admin-badge">
                      <i class="fas fa-user-shield"></i>
                      {{ mensajeSeleccionado.respondido_por || 'Equipo de Soporte' }}
                    </span>
                    <span class="respuesta-fecha">
                      {{ formatearFecha(mensajeSeleccionado.fecha_respuesta) }}
                    </span>
                  </div>
                  <div class="respuesta-texto">
                    {{ mensajeSeleccionado.respuesta }}
                  </div>
                </div>
              </div>

              <!-- Sin respuesta -->
              <div v-else class="sin-respuesta">
                <i class="fas fa-hourglass-half"></i>
                <p>Tu mensaje está siendo revisado por nuestro equipo de soporte.</p>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'SoporteComponente',
  
  data() {
    return {
      activeTab: 'faq',
      searchQuery: '',
      faqExpandida: null,
      
      // Formulario
      formulario: {
        categoria_id: '',
        asunto: '',
        mensaje: ''
      },
      categorias: [],
      mensajeEnviado: false,
      enviando: false,
      error: '',
      
      // Mensajes
      misMensajes: [],
      mensajesTodos: [],
      filtroEstado: null,
      cargandoMensajes: false,
      
      // Panel de detalle
      panelDetalle: false,
      mensajeSeleccionado: null,
      cargandoDetalle: false,
      
      // FAQs
      faqs: [
        {
          id: 'cuenta',
          nombre: 'Cuenta y Perfil',
          icono: '',
          faqs: [
            {
              pregunta: '¿Cómo creo una cuenta?',
              respuesta: 'Para crear una cuenta, haz clic en "Registrarse" en la barra de navegación. Completa el formulario con tu información y verifica tu correo electrónico.'
            },
            {
              pregunta: '¿Cómo recupero mi contraseña?',
              respuesta: 'En la página de inicio de sesión, haz clic en "¿Olvidaste tu contraseña?". Ingresa tu correo electrónico y recibirás un código para restablecerla.'
            },
            {
              pregunta: '¿Puedo cambiar mi información de perfil?',
              respuesta: 'Sí, ve a tu Perfil y haz clic en "Editar Perfil". Puedes cambiar tu nombre de usuario y contraseña.'
            }
          ]
        },
        {
          id: 'huella',
          nombre: 'Cálculo de Huella',
          icono: '',
          faqs: [
            {
              pregunta: '¿Con qué frecuencia puedo calcular mi huella?',
              respuesta: 'Puedes calcular tu huella de carbono una vez al mes. Esto nos permite hacer un seguimiento más preciso de tus cambios ambientales.'
            },
            {
              pregunta: '¿Dónde puedo ver mi historial?',
              respuesta: 'Accede a la sección "Historial" en tu perfil para ver todos tus cálculos anteriores y seguir tu progreso.'
            },
            {
              pregunta: '¿Qué significan las categorías Baja, Media y Alta?',
              respuesta: 'Estas categorías indican tu impacto ambiental: Baja (<50 kg CO₂), Media (50-100 kg CO₂), Alta (>100 kg CO₂).'
            }
          ]
        },
        {
          id: 'habitos',
          nombre: 'Hábitos Ecológicos',
          icono: '',
          faqs: [
            {
              pregunta: '¿Cuántos hábitos puedo agregar?',
              respuesta: 'Puedes agregar hasta 3 hábitos ecológicos a tu perfil. Esto te ayuda a enfocarte en cambios específicos y medibles.'
            },
            {
              pregunta: '¿Puedo eliminar un hábito?',
              respuesta: 'Sí, en tu perfil encontrarás la lista de tus hábitos con un botón "Eliminar" en cada uno.'
            }
          ]
        },
        {
          id: 'juegos',
          nombre: 'Entretenimiento',
          icono: '',
          faqs: [
            {
              pregunta: '¿Puedo guardar mi puntuación?',
              respuesta: 'Sí, si has iniciado sesión, tus puntuaciones se guardarán automáticamente en el leaderboard.'
            },
            {
              pregunta: '¿Cómo funcionan los juegos?',
              respuesta: 'Tenemos dos juegos: "Recicla" donde clasificas residuos, y "Planta Virtual" donde respondes preguntas para hacer crecer una planta.'
            }
          ]
        },
        {
          id: 'tecnico',
          nombre: 'Problemas Técnicos',
          icono: '',
          faqs: [
            {
              pregunta: 'La página no carga correctamente',
              respuesta: 'Intenta limpiar la caché de tu navegador (Ctrl+Shift+Delete), recargar la página (F5) o usar otro navegador. Si el problema persiste, contáctanos.'
            },
            {
              pregunta: 'No puedo iniciar sesión',
              respuesta: 'Verifica que tu usuario y contraseña sean correctos. Si olvidaste tu contraseña, usa la opción "Recuperar contraseña".'
            }
          ]
        }
      ]
    };
  },
  
  computed: {
    faqsFiltradas() {
      if (!this.searchQuery) return this.faqs;
      
      const query = this.searchQuery.toLowerCase();
      return this.faqs.map(categoria => ({
        ...categoria,
        faqs: categoria.faqs.filter(faq =>
          faq.pregunta.toLowerCase().includes(query) ||
          faq.respuesta.toLowerCase().includes(query)
        )
      })).filter(categoria => categoria.faqs.length > 0);
    },
    
    formularioValido() {
      return this.formulario.categoria_id &&
             this.formulario.asunto.length >= 5 &&
             this.formulario.mensaje.length >= 20;
    }
  },
  
  watch: {
    activeTab(newTab) {
      if (newTab === 'mis-mensajes') {
        this.cargarMisMensajes();
      } else {
        this.cerrarPanel();
      }
    },
    
    filtroEstado() {
      this.aplicarFiltro();
      this.cerrarPanel();
    }
  },
  
  mounted() {
    this.cargarCategorias();
  },
  
  methods: {
    async cargarCategorias() {
      try {
        const response = await axios.get('http://localhost:3000/api/soporte/categorias');
        this.categorias = response.data.categorias;
      } catch (error) {
        console.error('Error cargando categorías:', error);
      }
    },
    
    async enviarMensaje() {
      if (!this.formularioValido) return;
      
      this.enviando = true;
      this.error = '';
      
      try {
        const token = localStorage.getItem('token');
        await axios.post('http://localhost:3000/api/soporte/mensaje', this.formulario, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        this.mensajeEnviado = true;
      } catch (error) {
        console.error('Error enviando mensaje:', error);
        this.error = error.response?.data?.error || 'Error al enviar el mensaje';
      } finally {
        this.enviando = false;
      }
    },
    
    async cargarMisMensajes() {
      this.cargandoMensajes = true;
      
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/api/soporte/mis-mensajes', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        this.mensajesTodos = response.data.mensajes;
        this.aplicarFiltro();
      } catch (error) {
        console.error('Error cargando mensajes:', error);
      } finally {
        this.cargandoMensajes = false;
      }
    },
    
    aplicarFiltro() {
      if (this.filtroEstado === null) {
        this.misMensajes = this.mensajesTodos;
      } else {
        this.misMensajes = this.mensajesTodos.filter(
          mensaje => mensaje.estado === this.filtroEstado
        );
      }
    },
    
    async verDetalleMensaje(id) {
      this.panelDetalle = true;
      this.cargandoDetalle = true;
      this.error = '';
      
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:3000/api/soporte/mensaje/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        this.mensajeSeleccionado = response.data.mensaje;
      } catch (error) {
        console.error('Error cargando detalle:', error);
        this.error = 'Error al cargar el detalle';
      } finally {
        this.cargandoDetalle = false;
      }
    },
    
    cerrarPanel() {
      this.panelDetalle = false;
      setTimeout(() => {
        this.mensajeSeleccionado = null;
      }, 300);
    },
    
    toggleFaq(id) {
      this.faqExpandida = this.faqExpandida === id ? null : id;
    },
    
    resetFormulario() {
      this.formulario = {
        categoria_id: '',
        asunto: '',
        mensaje: ''
      };
      this.mensajeEnviado = false;
      this.error = '';
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
      return new Date(fecha).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    },
    
    formatearFechaCompleta(fecha) {
      return new Date(fecha).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  }
};
</script>

<style scoped>
@import '../Style.css';

.soporte-container {
  max-width: 1400px;
  margin: 120px auto 40px;
  padding: 20px;
  font-family: 'Poppins', sans-serif;
}

.soporte-header {
  text-align: center;
  margin-bottom: 30px;
}

.soporte-header h1 {
  color: #2e7d32;
  margin-bottom: 10px;
}

.soporte-header p {
  color: #666;
  font-size: 1.1rem;
}

/* Tabs */
.tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
  border-bottom: 2px solid #e0e0e0;
  overflow-x: auto;
}

.tab-btn {
  background: none;
  border: none;
  padding: 15px 25px;
  font-size: 1rem;
  font-weight: 600;
  color: #666;
  cursor: pointer;
  transition: all 0.3s;
  border-bottom: 3px solid transparent;
  white-space: nowrap;
}

.tab-btn:hover {
  color: #2e7d32;
}

.tab-btn.active {
  color: #2e7d32;
  border-bottom-color: #2e7d32;
}

.tab-btn i {
  margin-right: 8px;
}

/* Search Box */
.search-box {
  position: relative;
  margin-bottom: 30px;
}

.search-box i {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
}

.search-box input {
  width: 100%;
  padding: 15px 15px 15px 45px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s;
}

.search-box input:focus {
  outline: none;
  border-color: #2e7d32;
}

/* FAQ Categories */
.faq-categories {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.faq-category h3 {
  color: #2e7d32;
  font-size: 1.3rem;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.faq-category h3 span {
  font-size: 1.5rem;
}

.faq-items {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.faq-item {
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  padding: 15px 20px;
  cursor: pointer;
  transition: all 0.3s;
}

.faq-item:hover {
  border-color: #2e7d32;
  box-shadow: 0 2px 8px rgba(46, 125, 50, 0.1);
}

.faq-item.expanded {
  border-color: #2e7d32;
}

.faq-question {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  color: #333;
}

.faq-question i {
  color: #2e7d32;
  font-size: 1.2rem;
}

.faq-answer {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #e0e0e0;
  color: #666;
  line-height: 1.6;
}

.slide-enter-active, .slide-leave-active {
  transition: all 0.3s ease;
  max-height: 500px;
  overflow: hidden;
}

.slide-enter-from, .slide-leave-to {
  max-height: 0;
  opacity: 0;
  margin-top: 0;
  padding-top: 0;
}

.no-results {
  text-align: center;
  padding: 60px 20px;
  color: #999;
}

.no-results i {
  color: #ccc;
  margin-bottom: 20px;
}

.no-results p {
  font-size: 1.2rem;
  margin-bottom: 20px;
}

/* Formulario */
.contacto-section {
  max-width: 700px;
  margin: 0 auto;
}

.info-box {
  background: #e3f2fd;
  border-left: 4px solid #2196f3;
  padding: 15px;
  margin-bottom: 25px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.info-box i {
  color: #2196f3;
  font-size: 1.5rem;
}

.info-box p {
  margin: 0;
  color: #1565c0;
}

.formulario-contacto {
  background: white;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.form-group {
  margin-bottom: 25px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 12px 15px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  font-family: 'Poppins', sans-serif;
  transition: all 0.3s;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #2e7d32;
}

.form-group small {
  display: block;
  margin-top: 5px;
  color: #999;
  font-size: 0.85rem;
}

.form-group textarea {
  resize: vertical;
  min-height: 120px;
}

.form-actions {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 25px;
}

.filter-btn {
  padding: 12px 30px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.filter-btn.green {
  background: #2e7d32;
  color: white;
}

.filter-btn.green:hover:not(:disabled) {
  background: #1b5e20;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(46, 125, 50, 0.3);
}

.filter-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.error-msg {
  color: #d32f2f;
  text-align: center;
  margin-top: 15px;
  padding: 10px;
  background: #ffebee;
  border-radius: 5px;
}

.mensaje-exito {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.mensaje-exito i {
  color: #2e7d32;
  margin-bottom: 20px;
}

.mensaje-exito h3 {
  color: #2e7d32;
  margin-bottom: 15px;
}

.mensaje-exito p {
  color: #666;
  margin-bottom: 25px;
  font-size: 1.1rem;
}

/* Mensajes Section */
.mensajes-section {
  width: 100%;
}

.loading {
  text-align: center;
  padding: 60px 20px;
  color: #999;
}

.loading i {
  color: #2e7d32;
  margin-bottom: 20px;
}

/* Layout de dos columnas */
.mensajes-layout {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 20px;
  min-height: 600px;
}

.mensajes-lista-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.filtros-estado {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.filtro-btn {
  padding: 10px 20px;
  border: 2px solid #e0e0e0;
  background: white;
  border-radius: 20px;
  font-weight: 600;
  color: #666;
  cursor: pointer;
  transition: all 0.3s;
}

.filtro-btn:hover {
  border-color: #2e7d32;
  color: #2e7d32;
}

.filtro-btn.active {
  background: #2e7d32;
  color: white;
  border-color: #2e7d32;
}

.no-mensajes {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.no-mensajes i {
  color: #ccc;
  margin-bottom: 20px;
}

.no-mensajes p {
  color: #999;
  font-size: 1.1rem;
  margin-bottom: 20px;
}

.lista-mensajes {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 700px;
  overflow-y: auto;
  padding-right: 5px;
}

.lista-mensajes::-webkit-scrollbar {
  width: 6px;
}

.lista-mensajes::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.lista-mensajes::-webkit-scrollbar-thumb {
  background: #2e7d32;
  border-radius: 10px;
}

.mensaje-card {
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  padding: 18px;
  cursor: pointer;
  transition: all 0.3s;
}

.mensaje-card:hover {
  border-color: #2e7d32;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  transform: translateX(5px);
}

.mensaje-card.selected {
  border-color: #2e7d32;
  background: #f1f8f4;
  box-shadow: 0 4px 12px rgba(46, 125, 50, 0.15);
}

.mensaje-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  flex-wrap: wrap;
  gap: 8px;
}

.categoria {
  font-size: 0.85rem;
  color: #666;
  font-weight: 600;
}

.estado-badge {
  padding: 4px 12px;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 600;
}

.estado-badge.pendiente {
  background: #fff3e0;
  color: #f57c00;
}

.estado-badge.en_proceso {
  background: #e3f2fd;
  color: #1976d2;
}

.estado-badge.resuelto {
  background: #e8f5e9;
  color: #388e3c;
}

.estado-badge.cerrado {
  background: #f5f5f5;
  color: #757575;
}

.mensaje-card h4 {
  color: #333;
  margin-bottom: 8px;
  font-size: 1rem;
  line-height: 1.3;
}

.mensaje-preview {
  color: #666;
  font-size: 0.9rem;
  line-height: 1.4;
  margin-bottom: 12px;
}

.mensaje-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 10px;
  border-top: 1px solid #e0e0e0;
}

.mensaje-footer small {
  color: #999;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.85rem;
}

.mensaje-footer i.fa-chevron-right {
  color: #2e7d32;
}

/* Panel de detalle */
.detalle-panel {
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  max-height: 700px;
  position: sticky;
  top: 20px;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 25px;
  border-bottom: 2px solid #e0e0e0;
  background: white;
  border-radius: 15px 15px 0 0;
}

.panel-header h3 {
  color: #2e7d32;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.2rem;
}

.btn-cerrar {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #999;
  cursor: pointer;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.btn-cerrar:hover {
  background: #f5f5f5;
  color: #333;
}

.panel-body {
  padding: 25px;
  overflow-y: auto;
  flex: 1;
}

.panel-body::-webkit-scrollbar {
  width: 6px;
}

.panel-body::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.panel-body::-webkit-scrollbar-thumb {
  background: #2e7d32;
  border-radius: 10px;
}

.panel-loading {
  text-align: center;
  padding: 80px 20px;
  color: #999;
}

.panel-loading i {
  color: #2e7d32;
  margin-bottom: 15px;
}

.detalle-info {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 25px;
  background: #f8f9fa;
  padding: 20px;
  border-radius: 12px;
}

.info-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.info-item i {
  color: #2e7d32;
  font-size: 1.2rem;
  margin-top: 2px;
}

.info-item div {
  flex: 1;
}

.info-item small {
  display: block;
  color: #999;
  font-size: 0.8rem;
  margin-bottom: 4px;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.info-item p {
  margin: 0;
  color: #333;
  font-weight: 500;
}

.detalle-seccion {
  margin-bottom: 25px;
}

.detalle-seccion h4 {
  color: #2e7d32;
  margin-bottom: 12px;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
}

.asunto-texto {
  color: #333;
  font-size: 1.05rem;
  font-weight: 500;
  line-height: 1.5;
  margin: 0;
}

.mensaje-contenido {
  background: #f9fafb;
  padding: 18px;
  border-radius: 10px;
  border-left: 4px solid #2e7d32;
  color: #333;
  line-height: 1.7;
  white-space: pre-wrap;
  font-size: 0.95rem;
}

.respuesta-box {
  background: #e8f5e9;
  padding: 18px;
  border-radius: 10px;
  border-left: 4px solid #2e7d32;
}

.respuesta-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 12px;
  border-bottom: 2px solid #c8e6c9;
  flex-wrap: wrap;
  gap: 10px;
}

.admin-badge {
  background: #2e7d32;
  color: white;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.respuesta-fecha {
  color: #1b5e20;
  font-size: 0.85rem;
  font-weight: 500;
}

.respuesta-texto {
  color: #1b5e20;
  line-height: 1.7;
  white-space: pre-wrap;
  font-size: 0.95rem;
  background: white;
  padding: 15px;
  border-radius: 8px;
}

.sin-respuesta {
  text-align: center;
  padding: 40px 20px;
  background: #fff3e0;
  border-radius: 10px;
  border: 2px dashed #f57c00;
}

.sin-respuesta i {
  font-size: 2.5rem;
  color: #f57c00;
  margin-bottom: 15px;
}

.sin-respuesta p {
  color: #e65100;
  font-size: 1rem;
  margin: 0;
  line-height: 1.5;
}

/* Animación del panel */
.slide-panel-enter-active,
.slide-panel-leave-active {
  transition: all 0.3s ease;
}

.slide-panel-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.slide-panel-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* Responsive */
@media (max-width: 1024px) {
  .mensajes-layout {
    grid-template-columns: 1fr;
  }

  .detalle-panel {
    position: fixed;
    top: 0;
    right: 0;
    width: 90%;
    max-width: 500px;
    height: 100vh;
    max-height: 100vh;
    z-index: 9999;
    border-radius: 0;
  }

  .slide-panel-enter-from {
    transform: translateX(100%);
  }

  .slide-panel-leave-to {
    transform: translateX(100%);
  }

  .panel-header {
    border-radius: 0;
  }
}

@media (max-width: 768px) {
  .soporte-container {
    margin: 100px auto 20px;
    padding: 15px;
  }

  .soporte-header h1 {
    font-size: 1.8rem;
  }

  .soporte-header p {
    font-size: 1rem;
  }

  .tabs {
    gap: 5px;
  }

  .tab-btn {
    padding: 12px 15px;
    font-size: 0.9rem;
  }

  .tab-btn i {
    display: none;
  }

  .faq-category h3 {
    font-size: 1.1rem;
  }

  .formulario-contacto {
    padding: 20px;
  }

  .form-actions {
    flex-direction: column;
  }

  .filter-btn {
    width: 100%;
    justify-content: center;
  }

  .filtros-estado {
    gap: 8px;
  }

  .filtro-btn {
    padding: 8px 15px;
    font-size: 0.85rem;
  }

  .mensaje-card {
    padding: 15px;
  }

  .detalle-panel {
    width: 100%;
    max-width: 100%;
  }

  .panel-body {
    padding: 20px;
  }

  .detalle-info {
    padding: 15px;
  }
}

@media (max-width: 480px) {
  .soporte-header h1 {
    font-size: 1.5rem;
  }

  .search-box input {
    font-size: 0.9rem;
  }

  .faq-question {
    font-size: 0.95rem;
  }

  .faq-answer {
    font-size: 0.9rem;
  }

  .mensaje-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}
</style>