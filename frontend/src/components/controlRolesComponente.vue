<template>
  <div class="admin-container">
    
      <h1>Gestión de Usuarios</h1>
      <p class="subtitle">Administra usuarios y sus roles</p>
  

    <!-- Mensajes de alerta -->
    <div v-if="mensaje.texto" :class="['mensaje', mensaje.tipo]">
      {{ mensaje.texto }}
    </div>

    <!-- Tabla de usuarios -->
    <div class="card">
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Usuario</th>
              <th>Correo</th>
              <th>Rol</th>
              <th>Fecha Creación</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="cargando">
              <td colspan="6" class="text-center">
                <div class="loading">
                  <div class="spinner"></div>
                  <span>Cargando usuarios...</span>
                </div>
              </td>
            </tr>
            <tr v-else-if="usuarios.length === 0">
              <td colspan="6" class="text-center empty">
                No hay usuarios registrados
              </td>
            </tr>
            <tr v-else v-for="usuario in usuarios" :key="usuario.id">
              <td>{{ usuario.id }}</td>
              <td class="font-bold">{{ usuario.usuario }}</td>
              <td>{{ usuario.correo }}</td>
              <td>
                <span :class="['badge', usuario.rol === 'admin' ? 'badge-admin' : 'badge-user']">
                  {{ usuario.rol || 'Sin rol' }}
                </span>
              </td>
              <td>{{ formatearFecha(usuario.fecha_creacion) }}</td>
              <td class="acciones">
                <button @click="abrirModalEditar(usuario)" class="btn btn-edit">
                  Editar Rol
                </button>
                <button @click="confirmarEliminar(usuario)" class="btn btn-delete">
                  Eliminar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Editar Rol -->
    <div v-if="modalEditar" class="modal-overlay" @click.self="cerrarModal">
      <div class="modal">
        <h2>Editar Rol de Usuario</h2>
        
        <div class="modal-content">
          <p class="info-text">Usuario: <span class="font-bold">{{ usuarioEditar.usuario }}</span></p>
          <p class="info-text">Correo: <span class="font-bold">{{ usuarioEditar.correo }}</span></p>
          
          <label class="label">Seleccionar nuevo rol:</label>
          <select v-model="nuevoRolId" class="select">
            <option value="">-- Seleccione un rol --</option>
            <option v-for="rol in roles" :key="rol.id" :value="rol.id">
              {{ rol.nombre }} - {{ rol.descripcion }}
            </option>
          </select>
        </div>

        <div class="modal-actions">
          <button @click="actualizarRol" :disabled="!nuevoRolId || procesando" class="btn btn-primary">
            {{ procesando ? 'Actualizando...' : 'Actualizar Rol' }}
          </button>
          <button @click="cerrarModal" :disabled="procesando" class="btn btn-secondary">
            Cancelar
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Confirmar Eliminación -->
    <div v-if="modalEliminar" class="modal-overlay" @click.self="cerrarModalEliminar">
      <div class="modal">
        <h2>Confirmar Eliminación</h2>
        <p class="modal-text">
          ¿Estás seguro de eliminar al usuario <span class="font-bold">{{ usuarioEliminar.usuario }}</span>?
          Esta acción no se puede deshacer.
        </p>
        
        <div class="modal-actions">
          <button @click="eliminarUsuario" :disabled="procesando" class="btn btn-danger">
            {{ procesando ? 'Eliminando...' : 'Sí, Eliminar' }}
          </button>
          <button @click="cerrarModalEliminar" :disabled="procesando" class="btn btn-secondary">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminUsuarios',
  data() {
    return {
      usuarios: [],
      roles: [],
      cargando: false,
      procesando: false,
      modalEditar: false,
      modalEliminar: false,
      usuarioEditar: {},
      usuarioEliminar: {},
      nuevoRolId: '',
      mensaje: {
        texto: '',
        tipo: ''
      }
    }
  },
  mounted() {
    this.cargarDatos();
  },
  methods: {
    async cargarDatos() {
      this.cargando = true;
      await Promise.all([
        this.obtenerUsuarios(),
        this.obtenerRoles()
      ]);
      this.cargando = false;
    },

    async obtenerUsuarios() {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/api/admin/usuarios', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) throw new Error('Error al obtener usuarios');
        
        this.usuarios = await response.json();
      } catch (error) {
        this.mostrarMensaje('Error al cargar usuarios: ' + error.message, 'error');
      }
    },

    async obtenerRoles() {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/api/admin/roles', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) throw new Error('Error al obtener roles');
        
        this.roles = await response.json();
      } catch (error) {
        this.mostrarMensaje('Error al cargar roles: ' + error.message, 'error');
      }
    },

    abrirModalEditar(usuario) {
      this.usuarioEditar = { ...usuario };
      const rolActual = this.roles.find(r => r.nombre === usuario.rol);
      this.nuevoRolId = rolActual ? rolActual.id : '';
      this.modalEditar = true;
    },

    async actualizarRol() {
      if (!this.nuevoRolId) {
        this.mostrarMensaje('Por favor selecciona un rol', 'error');
        return;
      }

      this.procesando = true;
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:3000/api/admin/usuarios/${this.usuarioEditar.id}/rol`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ rol_id: this.nuevoRolId })
        });

        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Error al actualizar rol');
        }

        this.mostrarMensaje(data.message, 'success');
        await this.obtenerUsuarios();
        this.cerrarModal();
      } catch (error) {
        this.mostrarMensaje(error.message, 'error');
      } finally {
        this.procesando = false;
      }
    },

    confirmarEliminar(usuario) {
      this.usuarioEliminar = { ...usuario };
      this.modalEliminar = true;
    },

    async eliminarUsuario() {
      this.procesando = true;
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:3000/api/admin/usuarios/${this.usuarioEliminar.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Error al eliminar usuario');
        }

        this.mostrarMensaje(data.message, 'success');
        await this.obtenerUsuarios();
        this.cerrarModalEliminar();
      } catch (error) {
        this.mostrarMensaje(error.message, 'error');
      } finally {
        this.procesando = false;
      }
    },

    cerrarModal() {
      this.modalEditar = false;
      this.usuarioEditar = {};
      this.nuevoRolId = '';
    },

    cerrarModalEliminar() {
      this.modalEliminar = false;
      this.usuarioEliminar = {};
    },

    mostrarMensaje(texto, tipo) {
      this.mensaje = { texto, tipo };
      setTimeout(() => {
        this.mensaje = { texto: '', tipo: '' };
      }, 5000);
    },

    formatearFecha(fecha) {
      if (!fecha) return '-';
      const date = new Date(fecha);
      return date.toLocaleDateString('es-ES', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  }
}
</script>

<style scoped>
/* Contenedor principal */
.admin-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

/* Header */
.header {
  margin-bottom: 30px;
}

.header h1 {
  font-size: 28px;
  color: #1f2937;
  margin: 0 0 8px 0;
  font-weight: bold;
}

.subtitle {
  color: #6b7280;
  margin: 0;
  font-size: 14px;
}

/* Mensajes */
.mensaje {
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 14px;
}

.mensaje.success {
  background-color: #d1fae5;
  color: #065f46;
  border: 1px solid #6ee7b7;
}

.mensaje.error {
  background-color: #fee2e2;
  color: #991b1b;
  border: 1px solid #fca5a5;
}

/* Card */
.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

/* Tabla */
.table-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background-color: #f9fafb;
  border-bottom: 2px solid #e5e7eb;
}

th {
  padding: 12px 16px;
  text-align: left;
  font-size: 12px;
  font-weight: 600;
  color: #374151;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

tbody tr {
  border-bottom: 1px solid #e5e7eb;
  transition: background-color 0.2s;
}

tbody tr:hover {
  background-color: #f9fafb;
}

td {
  padding: 12px 16px;
  font-size: 14px;
  color: #1f2937;
}

.text-center {
  text-align: center;
}

.empty {
  padding: 40px;
  color: #6b7280;
}

.font-bold {
  font-weight: 600;
}

/* Badge */
.badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.badge-admin {
  background-color: #ede9fe;
  color: #6b21a8;
}

.badge-user {
  background-color: #dbeafe;
  color: #1e40af;
}

/* Acciones */
.acciones {
  text-align: center;
}

/* Botones */
.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-edit {
  background-color: #3b82f6;
  color: white;
  margin-right: 8px;
}

.btn-edit:hover:not(:disabled) {
  background-color: #2563eb;
}

.btn-delete {
  background-color: #ef4444;
  color: white;
}

.btn-delete:hover:not(:disabled) {
  background-color: #dc2626;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
  flex: 1;
}

.btn-primary:hover:not(:disabled) {
  background-color: #2563eb;
}

.btn-secondary {
  background-color: #d1d5db;
  color: #1f2937;
  flex: 1;
}

.btn-secondary:hover:not(:disabled) {
  background-color: #9ca3af;
}

.btn-danger {
  background-color: #ef4444;
  color: white;
  flex: 1;
}

.btn-danger:hover:not(:disabled) {
  background-color: #dc2626;
}

/* Loading */
.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: #6b7280;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #e5e7eb;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 12px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal {
  background: white;
  border-radius: 8px;
  padding: 30px;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.modal h2 {
  margin: 0 0 20px 0;
  font-size: 24px;
  color: #1f2937;
}

.modal-content {
  margin-bottom: 24px;
}

.info-text {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 8px;
}

.modal-text {
  color: #6b7280;
  margin-bottom: 24px;
  line-height: 1.5;
}

.label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin: 16px 0 8px 0;
}

.select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  color: #1f2937;
  background-color: white;
  cursor: pointer;
  transition: border-color 0.2s;
}

.select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.modal-actions {
  display: flex;
  gap: 12px;
}

/* Responsive */
@media (max-width: 768px) {
  .admin-container {
    padding: 10px;
  }

  table {
    font-size: 12px;
  }

  th, td {
    padding: 8px;
  }

  .btn {
    padding: 6px 12px;
    font-size: 12px;
  }

  .modal {
    padding: 20px;
  }

  .modal-actions {
    flex-direction: column;
  }
}
</style>