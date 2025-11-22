<template>
  <div class="eventos-container">
    <!-- Indicador del modo del formulario -->
    <div :class="['form-mode', { edit: modoEdicion }]">
      {{ modoEdicion ? 'Editando Evento' : 'Crear Nuevo Evento' }}
    </div>

    <h2>{{ modoEdicion ? 'Editar Evento' : 'Crear Evento' }}</h2>
    
    <form @submit.prevent="handleSubmit" class="evento-form">
      <input type="hidden" v-model="formulario.id">

      <!-- Título -->
      <div class="form-group">
        <label>Título <span class="required">*</span></label>
        <input 
          type="text" 
          v-model="formulario.titulo"
          @input="validarCampo('titulo')"
          :class="{ 'input-error': errores.titulo }"
          placeholder="Mínimo 3 caracteres, máximo 150"
          maxlength="150"
          required
        >
        <span v-if="errores.titulo" class="error-msg">{{ errores.titulo }}</span>
        <span class="char-count">{{ formulario.titulo.length }}/150</span>
      </div>

      <!-- Descripción -->
      <div class="form-group">
        <label>Descripción <span class="required">*</span></label>
        <textarea 
          v-model="formulario.descripcion"
          @input="validarCampo('descripcion')"
          :class="{ 'input-error': errores.descripcion }"
          placeholder="Mínimo 10 caracteres, máximo 500"
          maxlength="500"
          rows="4"
          required
        ></textarea>
        <span v-if="errores.descripcion" class="error-msg">{{ errores.descripcion }}</span>
        <span class="char-count">{{ formulario.descripcion.length }}/500</span>
      </div>

      <!-- Fecha y Hora -->
      <div class="form-row">
        <div class="form-group">
          <label>Fecha <span class="required">*</span></label>
          <input 
            type="date" 
            v-model="formulario.fecha"
            @change="validarCampo('fecha')"
            :class="{ 'input-error': errores.fecha }"
            :min="fechaMinima"
            required
          >
          <span v-if="errores.fecha" class="error-msg">{{ errores.fecha }}</span>
        </div>

        <div class="form-group">
          <label>Hora <span class="required">*</span></label>
          <input 
            type="time" 
            v-model="formulario.hora"
            required
          >
        </div>
      </div>

      <!-- Ubicación -->
      <div class="form-group">
        <label>Ubicación <span class="required">*</span></label>
        <input 
          type="text" 
          v-model="formulario.ubicacion"
          placeholder="Ingrese la ubicación del evento"
          maxlength="200"
          required
        >
      </div>

      <!-- Categoría -->
      <div class="form-group">
        <label>Categoría <span class="required">*</span></label>
        <select 
          v-model="formulario.categoria"
          required
        >
          <option value="">Seleccione una categoría...</option>
          <option v-for="cat in categorias" :key="cat.value" :value="cat.value">
            {{ cat.label }}
          </option>
        </select>
      </div>

      <!-- Sección Organizador -->
      <h3>Datos del Organizador</h3>

      <div class="form-group">
        <label>Nombre del Organizador <span class="required">*</span></label>
        <input 
          type="text" 
          v-model="formulario.organizador.nombre"
          placeholder="Nombre completo"
          maxlength="100"
          required
        >
      </div>

      <div class="form-row">
        <div class="form-group">
          <label>Email</label>
          <input 
            type="email" 
            v-model="formulario.organizador.email"
            placeholder="ejemplo@correo.com"
          >
        </div>

        <div class="form-group">
          <label>Teléfono</label>
          <input 
            type="tel" 
            v-model="formulario.organizador.telefono"
            placeholder="78901234"
            maxlength="8"
          >
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label>WhatsApp</label>
          <input 
            type="tel" 
            v-model="formulario.organizador.whatsapp"
            placeholder="78901234"
            maxlength="8"
          >
        </div>

        <div class="form-group">
          <label>Instagram</label>
          <input 
            type="text" 
            v-model="formulario.organizador.instagram"
            placeholder="@usuario"
            maxlength="30"
          >
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label>Facebook</label>
          <input 
            type="url" 
            v-model="formulario.organizador.facebook"
            placeholder="https://facebook.com/usuario"
          >
        </div>

        <div class="form-group">
          <label>Sitio Web</label>
          <input 
            type="url" 
            v-model="formulario.organizador.sitioWeb"
            placeholder="https://ejemplo.com"
          >
        </div>
      </div>

      <!-- Imagen -->
      <div class="form-group">
        <label>Imagen del Evento</label>
        <input 
          type="file" 
          @change="handleImagenChange"
          accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
          ref="imagenInput"
        >
        <div class="file-info">
          <small>Formatos: JPG, PNG, GIF, WEBP | Tamaño máximo: 5MB</small>
        </div>
        <span v-if="errores.imagen" class="error-msg">{{ errores.imagen }}</span>
        
        <!-- Preview de imagen -->
        <div v-if="imagenPreview" class="image-preview">
          <img :src="imagenPreview" alt="Preview">
          <button type="button" @click="removerImagen" class="btn-remove-img">×</button>
        </div>
      </div>

      <!-- Estado -->
      <div class="form-group">
        <label>Estado <span class="required">*</span></label>
        <select v-model="formulario.estado" required>
          <option value="activo">Activo</option>
          <option value="cancelado">Cancelado</option>
          <option value="finalizado">Finalizado</option>
        </select>
      </div>

      <!-- Botones -->
      <div class="form-actions">
        <button type="submit" class="btn-submit" :disabled="cargando">
          {{ cargando ? 'Guardando...' : (modoEdicion ? 'Actualizar Evento' : 'Guardar Evento') }}
        </button>
        <button 
          v-if="modoEdicion" 
          type="button" 
          @click="cancelarEdicion" 
          class="btn-cancel"
        >
          Cancelar
        </button>
      </div>
    </form>

    <!-- Mensajes -->
    <transition name="fade">
      <div v-if="mensaje.texto" :class="['mensaje', mensaje.tipo]">
        {{ mensaje.texto }}
      </div>
    </transition>

    <!-- Lista de Eventos -->
    <h2 style="margin-top: 40px;">Eventos Registrados</h2>
    
    <div v-if="cargandoEventos" class="loading">
      Cargando eventos...
    </div>

    <div v-else-if="eventos.length === 0" class="no-eventos">
      No hay eventos registrados
    </div>

    <div v-else class="eventos-lista">
      <div v-for="evento in eventos" :key="evento.id" class="evento-card">
        <h3>{{ evento.titulo }}</h3>
        <p class="descripcion">{{ evento.descripcion }}</p>
        
        <div class="evento-info">
          <p><strong>📅 Fecha:</strong> {{ formatearFecha(evento.fecha) }}</p>
          <p><strong>🕐 Hora:</strong> {{ evento.hora }}</p>
          <p><strong>📍 Ubicación:</strong> {{ evento.ubicacion }}</p>
          <p><strong>🏷️ Categoría:</strong> {{ obtenerNombreCategoria(evento.categoria) }}</p>
          <p><strong>👤 Organizador:</strong> {{ evento.organizador?.nombre }}</p>
          <p>
            <strong>Estado:</strong> 
            <span :class="['estado-badge', evento.estado]">{{ evento.estado }}</span>
          </p>
        </div>

        <img v-if="evento.imagen" :src="evento.imagen" alt="Imagen del evento" class="evento-imagen">

        <div class="evento-acciones">
          <button @click="editarEvento(evento)" class="btn-editar">Editar</button>
          <button @click="eliminarEvento(evento.id)" class="btn-eliminar">Eliminar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GestionEventos',
  data() {
    return {
      API_URL: 'https://api-rest-eventos-9kvx.onrender.com/api/eventos',
      modoEdicion: false,
      cargando: false,
      cargandoEventos: false,
      formulario: {
        id: '',
        titulo: '',
        descripcion: '',
        fecha: '',
        hora: '',
        ubicacion: '',
        categoria: '',
        organizador: {
          nombre: '',
          email: '',
          telefono: '',
          whatsapp: '',
          facebook: '',
          instagram: '',
          sitioWeb: '',
          otroContacto: ''
        },
        estado: 'activo'
      },
      imagenArchivo: null,
      imagenPreview: null,
      errores: {},
      mensaje: {
        texto: '',
        tipo: ''
      },
      eventos: [],
      categorias: [
        { value: 'recoleccion-basura', label: 'Recolección de Basura' },
        { value: 'reciclaje', label: 'Reciclaje' },
        { value: 'reforestacion', label: 'Reforestación' },
        { value: 'conservacion-fauna', label: 'Conservación de Fauna' },
        { value: 'educacion-ambiental', label: 'Educación Ambiental' },
        { value: 'energia-renovable', label: 'Energía Renovable' },
        { value: 'agua-saneamiento', label: 'Agua y Saneamiento' },
        { value: 'agricultura-sostenible', label: 'Agricultura Sostenible' },
        { value: 'cambio-climatico', label: 'Cambio Climático' },
        { value: 'biodiversidad', label: 'Biodiversidad' },
        { value: 'contaminacion', label: 'Contaminación' },
        { value: 'economia-circular', label: 'Economía Circular' },
        { value: 'transporte-sostenible', label: 'Transporte Sostenible' },
        { value: 'otro', label: 'Otro' }
      ]
    };
  },
  computed: {
    fechaMinima() {
      return new Date().toISOString().split('T')[0];
    }
  },
  mounted() {
    this.cargarEventos();
  },
  methods: {
    // Solo validaciones básicas
    validarCampo(campo) {
      delete this.errores[campo];

      switch (campo) {
        case 'titulo': {
          if (this.formulario.titulo.length < 3) {
            this.errores[campo] = 'El título debe tener al menos 3 caracteres';
          }
          break;
        }

        case 'descripcion': {
          if (this.formulario.descripcion.length < 10) {
            this.errores[campo] = 'La descripción debe tener al menos 10 caracteres';
          }
          break;
        }

        case 'fecha': {
          const fechaSeleccionada = new Date(this.formulario.fecha);
          const hoy = new Date();
          hoy.setHours(0, 0, 0, 0);
          if (fechaSeleccionada < hoy) {
            this.errores[campo] = 'La fecha no puede ser anterior a hoy';
          }
          break;
        }
      }

      this.$forceUpdate();
    },

    handleImagenChange(event) {
      const file = event.target.files[0];
      
      if (!file) {
        return;
      }

      // Validar tipo de archivo
      const tiposPermitidos = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
      if (!tiposPermitidos.includes(file.type)) {
        this.errores.imagen = 'Solo se permiten imágenes (JPG, PNG, GIF, WEBP)';
        this.$refs.imagenInput.value = '';
        return;
      }

      // Validar tamaño (5MB máximo)
      const tamañoMaximo = 5 * 1024 * 1024;
      if (file.size > tamañoMaximo) {
        this.errores.imagen = 'La imagen no debe superar los 5MB';
        this.$refs.imagenInput.value = '';
        return;
      }

      // Si pasa las validaciones
      delete this.errores.imagen;
      this.imagenArchivo = file;

      // Crear preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagenPreview = e.target.result;
      };
      reader.readAsDataURL(file);
    },

    removerImagen() {
      this.imagenArchivo = null;
      this.imagenPreview = null;
      if (this.$refs.imagenInput) {
        this.$refs.imagenInput.value = '';
      }
    },

    validarFormulario() {
      // Solo validar campos básicos
      this.validarCampo('titulo');
      this.validarCampo('descripcion');
      this.validarCampo('fecha');

      return Object.keys(this.errores).length === 0;
    },

    async handleSubmit() {
      if (!this.validarFormulario()) {
        this.mostrarMensaje('Por favor corrija los errores en el formulario', 'error');
        return;
      }

      this.cargando = true;

      const formData = new FormData();
      
      formData.append('titulo', this.formulario.titulo);
      formData.append('descripcion', this.formulario.descripcion);
      formData.append('fecha', this.formulario.fecha);
      formData.append('hora', this.formulario.hora);
      formData.append('ubicacion', this.formulario.ubicacion);
      formData.append('categoria', this.formulario.categoria);
      formData.append('estado', this.formulario.estado);

      const organizador = { nombre: this.formulario.organizador.nombre };
      const camposExtra = ['email', 'telefono', 'whatsapp', 'facebook', 'instagram', 'sitioWeb', 'otroContacto'];
      
      camposExtra.forEach(campo => {
        if (this.formulario.organizador[campo]?.trim()) {
          organizador[campo] = this.formulario.organizador[campo].trim();
        }
      });

      formData.append('organizador', JSON.stringify(organizador));

      if (this.imagenArchivo) {
        formData.append('imagen', this.imagenArchivo);
      }

      try {
        let url, method;
        
        if (this.modoEdicion && this.formulario.id) {
          url = `${this.API_URL}/${this.formulario.id}`;
          method = 'PUT';
        } else {
          url = this.API_URL;
          method = 'POST';
        }

        const response = await fetch(url, {
          method: method,
          body: formData
        });

        const data = await response.json();

        if (data.success) {
          this.mostrarMensaje(data.message || 'Evento guardado exitosamente', 'success');
          this.limpiarFormulario();
          await this.cargarEventos();
        } else {
          this.mostrarMensaje(data.error || data.message || 'Error al guardar el evento', 'error');
        }
      } catch (error) {
        this.mostrarMensaje(`Error: ${error.message}`, 'error');
      } finally {
        this.cargando = false;
      }
    },

    limpiarFormulario() {
      this.formulario = {
        id: '',
        titulo: '',
        descripcion: '',
        fecha: '',
        hora: '',
        ubicacion: '',
        categoria: '',
        organizador: {
          nombre: '',
          email: '',
          telefono: '',
          whatsapp: '',
          facebook: '',
          instagram: '',
          sitioWeb: '',
          otroContacto: ''
        },
        estado: 'activo'
      };
      this.imagenArchivo = null;
      this.imagenPreview = null;
      this.errores = {};
      this.modoEdicion = false;
      
      if (this.$refs.imagenInput) {
        this.$refs.imagenInput.value = '';
      }
    },

    cancelarEdicion() {
      this.limpiarFormulario();
      this.mensaje = { texto: '', tipo: '' };
    },

    mostrarMensaje(texto, tipo = 'success') {
      this.mensaje = { texto, tipo };
      
      setTimeout(() => {
        this.mensaje = { texto: '', tipo: '' };
      }, tipo === 'error' ? 4000 : 3000);
    },

    async cargarEventos() {
      this.cargandoEventos = true;
      
      try {
        const response = await fetch(this.API_URL);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        this.eventos = data.data || data || [];
      } catch (error) {
        console.error('Error al cargar eventos:', error);
        this.mostrarMensaje('Error al cargar los eventos', 'error');
      } finally {
        this.cargandoEventos = false;
      }
    },

    editarEvento(evento) {
      this.modoEdicion = true;
      
      this.formulario.id = evento.id;
      this.formulario.titulo = evento.titulo || '';
      this.formulario.descripcion = evento.descripcion || '';
      this.formulario.hora = evento.hora || '';
      this.formulario.ubicacion = evento.ubicacion || '';
      this.formulario.categoria = evento.categoria || '';
      this.formulario.estado = evento.estado || 'activo';

      if (evento.fecha) {
        try {
          let fechaFormateada = '';
          if (evento.fecha._seconds) {
            fechaFormateada = new Date(evento.fecha._seconds * 1000).toISOString().split('T')[0];
          } else {
            const date = new Date(evento.fecha);
            fechaFormateada = date.toISOString().split('T')[0];
          }
          this.formulario.fecha = fechaFormateada;
        } catch (error) {
          console.error('Error procesando fecha:', error);
        }
      }

      const org = evento.organizador || {};
      this.formulario.organizador = {
        nombre: org.nombre || '',
        email: org.email || '',
        telefono: org.telefono || '',
        whatsapp: org.whatsapp || '',
        facebook: org.facebook || '',
        instagram: org.instagram || '',
        sitioWeb: org.sitioWeb || '',
        otroContacto: org.otroContacto || ''
      };

      if (evento.imagen) {
        this.imagenPreview = evento.imagen;
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    async eliminarEvento(id) {
      if (!confirm('¿Estás seguro de que deseas eliminar este evento?')) {
        return;
      }

      try {
        const response = await fetch(`${this.API_URL}/${id}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          this.mostrarMensaje('Evento eliminado exitosamente', 'success');
          await this.cargarEventos();
        } else {
          this.mostrarMensaje('Error al eliminar el evento', 'error');
        }
      } catch (error) {
        console.error('Error al eliminar evento:', error);
        this.mostrarMensaje('Error al eliminar el evento', 'error');
      }
    },

    formatearFecha(fecha) {
      if (!fecha) return 'Fecha no disponible';
      
      try {
        let fechaParaProcesar;
        
        if (fecha._seconds) {
          fechaParaProcesar = new Date(fecha._seconds * 1000);
        } else {
          fechaParaProcesar = new Date(fecha);
        }
        
        if (!isNaN(fechaParaProcesar.getTime())) {
          return fechaParaProcesar.toLocaleDateString('es-ES');
        }
        
        return 'Fecha no disponible';
      } catch (error) {
        return 'Fecha no disponible';
      }
    },

    obtenerNombreCategoria(valor) {
      const cat = this.categorias.find(c => c.value === valor);
      return cat ? cat.label : valor;
    }
  }
};
</script>

<style scoped>
.eventos-container {
  font-family: 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f0f2f5;
}

h2 {
  color: #1e3a8a;
  border-bottom: 2px solid #e2e8f0;
  padding-bottom: 10px;
  margin-top: 40px;
}

h3 {
  color: #1e3a8a;
  font-size: 1.25rem;
  margin: 25px 0 15px 0;
  padding-bottom: 8px;
  border-bottom: 1px dashed #d1d5db;
}

.form-mode {
  background-color: #dbeafe;
  color: #1e3a8a;
  padding: 12px 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-weight: 600;
  text-align: center;
}

.form-mode.edit {
  background-color: #fef3c7;
  color: #92400e;
}

.evento-form {
  background: #ffffff;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.form-group {
  margin-bottom: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

label {
  font-weight: 600;
  color: #4a5568;
  display: block;
  margin-bottom: 5px;
}

.required {
  color: #ef4444;
}

input[type="text"],
input[type="email"],
input[type="url"],
input[type="date"],
input[type="time"],
input[type="tel"],
input[type="file"],
textarea,
select {
  width: 100%;
  padding: 12px;
  border: 1px solid #cbd5e0;
  border-radius: 8px;
  font-size: 1rem;
  box-sizing: border-box;
  transition: border-color 0.2s, box-shadow 0.2s;
}

input:focus,
textarea:focus,
select:focus {
  border-color: #3b82f6;
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.25);
}

.input-error {
  border-color: #ef4444 !important;
}

.error-msg {
  color: #ef4444;
  font-size: 0.875rem;
  display: block;
  margin-top: 5px;
}

.char-count {
  color: #6b7280;
  font-size: 0.875rem;
  display: block;
  margin-top: 5px;
}

.file-info {
  margin-top: 5px;
}

.file-info small {
  color: #6b7280;
  font-size: 0.875rem;
}

textarea {
  resize: vertical;
  min-height: 100px;
}

.image-preview {
  margin-top: 15px;
  position: relative;
  display: inline-block;
}

.image-preview img {
  max-width: 200px;
  max-height: 200px;
  border-radius: 8px;
  border: 2px solid #e2e8f0;
}

.btn-remove-img {
  position: absolute;
  top: -10px;
  right: -10px;
  background-color: #ef4444;
  color: white;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  font-size: 1.5rem;
  cursor: pointer;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-remove-img:hover {
  background-color: #dc2626;
}

.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 30px;
}

.btn-submit {
  background-color: #10b981;
  color: #ffffff;
  padding: 15px 25px;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.btn-submit:hover:not(:disabled) {
  background-color: #059669;
  transform: translateY(-2px);
}

.btn-submit:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}

.btn-cancel {
  background-color: #6b7280;
  color: #ffffff;
  padding: 15px 25px;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-cancel:hover {
  background-color: #4b5563;
}

.mensaje {
  padding: 15px 20px;
  border-radius: 8px;
  font-weight: 500;
  margin-top: 20px;
}

.mensaje.success {
  background-color: #d1fae5;
  color: #065f46;
  border: 1px solid #a7f3d0;
}

.mensaje.error {
  background-color: #fee2e2;
  color: #991b1b;
  border: 1px solid #fca5a5;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.loading,
.no-eventos {
  text-align: center;
  padding: 40px;
  color: #6b7280;
  font-size: 1.1rem;
}

.eventos-lista {
  display: grid;
  gap: 20px;
  margin-top: 20px;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
}

.evento-card {
  background: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  transition: box-shadow 0.3s ease;
}

.evento-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.evento-card h3 {
  color: #1e3a8a;
  margin: 0 0 10px 0;
  border: none;
  padding: 0;
  font-size: 1.3rem;
}

.descripcion {
  color: #4a5568;
  margin: 10px 0;
  line-height: 1.6;
}

.evento-info {
  margin: 15px 0;
}

.evento-info p {
  margin: 8px 0;
  font-size: 0.95rem;
  color: #4a5568;
}

.estado-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
}

.estado-badge.activo {
  background-color: #d1fae5;
  color: #065f46;
}

.estado-badge.cancelado {
  background-color: #fee2e2;
  color: #991b1b;
}

.estado-badge.finalizado {
  background-color: #e5e7eb;
  color: #4b5563;
}

.evento-imagen {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  margin: 15px 0;
}

.evento-acciones {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.btn-editar {
  flex: 1;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  font-weight: 600;
  cursor: pointer;
  background-color: #3b82f6;
  color: #ffffff;
  transition: background-color 0.2s;
}

.btn-editar:hover {
  background-color: #2563eb;
}

.btn-eliminar {
  flex: 1;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  font-weight: 600;
  cursor: pointer;
  background-color: #ef4444;
  color: #ffffff;
  transition: background-color 0.2s;
}

.btn-eliminar:hover {
  background-color: #dc2626;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .eventos-lista {
    grid-template-columns: 1fr;
  }
}
</style>