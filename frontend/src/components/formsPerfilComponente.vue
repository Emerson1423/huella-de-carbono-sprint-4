<template>
  <div class="perfil-usuario">
    <div class="container">
      <h1 class="titulo">Mis Datos</h1>
      <avatar-componente></avatar-componente>
      <br>
      <!-- Mensajes de éxito y error -->
      <div v-if="mensaje" class="mensaje" :class="{ 'mensaje-exito': esExito, 'mensaje-error': !esExito }">
        {{ mensaje }}
      </div>
      
      <!-- Vista de perfil -->
      <div v-if="!editando && !cambiandoPassword" class="perfil-vista">
        <div v-if="cargando" class="cargando">Cargando datos...</div>
        <div v-else>
          <div class="campo">
            <label>Nombre de usuario:</label>
            <p>{{ usuario.usuario }}</p>
          </div>
          
          <div class="campo">
            <label>Correo electrónico:</label>
            <p>{{ usuario.correo }}</p>
          </div>
          
          <div class="campo">
            <label>Usuario desde:</label>
            <p>{{ formatearFecha(usuario.fecha_creacion) }}</p>
          </div>
          
          <div class="botones">
            <button @click="activarEdicion" class="btn btn-editar">Editar Perfil</button>
            <button @click="activarCambioPassword" class="btn btn-password">Cambiar Contraseña</button>
          </div>
        </div>
      </div>
      
      <!-- Formulario de edición -->
      <div v-if="editando" class="formulario-edicion">
        <h2>Editar Perfil</h2>
        
        <form @submit.prevent="guardarPerfil">
          <div class="campo-formulario">
            <label for="usuario">Nombre de usuario:</label>
            <input
              type="text"
              id="usuario"
              v-model="usuarioEditado.usuario"
              required>
          
          </div>
          
          <div class="campo-formulario">
            <label>Correo electrónico:</label>
            <p class="campo-no-editable">{{ usuario.correo }}</p>
            <small>El correo electrónico no se puede cambiar</small>
          </div>
          
          <div class="botones">
            <button type="submit" :disabled="cargando" class="btn btn-guardar">
              {{ cargando ? 'Guardando...' : 'Guardar Cambios' }}
            </button>
            <button type="button" @click="cancelarEdicion" class="btn btn-cancelar">Cancelar</button>
          </div>
        </form>
      </div>
      
      <!-- Formulario de cambio de contraseña -->
      <div v-if="cambiandoPassword" class="formulario-password">
        <h2>Cambiar Contraseña</h2>
        
        <form @submit.prevent="cambiarPassword">
          <div class="campo-formulario">
            <label for="currentPassword">Contraseña actual:</label>
            <input
              type="password"
              id="currentPassword"
              v-model="passwordData.currentPassword"
              required >
           
          </div>
          
          <div class="campo-formulario">
            <label for="newPassword">Nueva contraseña:</label>
            <input
              type="password"
              id="newPassword"
              v-model="passwordData.newPassword"
              @input="validarContraseña"
              required>

              <div class="password-strength" v-if="passwordData.newPassword.length > 0">
                <div class="strength-bar" :class="strengthClass"></div>
                <ul class="requirements">
                  <li :class="{'valid':hasMinLength}">Mínimo 8 caracteres</li>
                  <li :class="{ 'valid': hasUpperCase }">1 letra mayúscula</li>
                  <li :class="{ 'valid': hasLowerCase }">1 letra minúscula</li>
                  <li :class="{ 'valid': hasNumber }">1 número</li>
                  <li :class="{ 'valid': hasSpecialChar }">1 carácter especial</li>                 
                </ul>
              </div>
          </div>
          
          <div class="campo-formulario">
            <label for="confirmPassword">Confirmar nueva contraseña:</label>
            <input
              type="password"
              id="confirmPassword"
              v-model="passwordData.confirmPassword"
              required >
           
          </div>
          
          <div class="botones">
            <button type="submit" :disabled="cargando" class="btn btn-guardar">
              {{ cargando ? 'Cambiando...' : 'Cambiar Contraseña' }}
            </button>
            <button type="button" @click="cancelarCambioPassword" class="btn btn-cancelar">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import avatarComponente from './avatarComponente.vue';

export default {

  components:{
    avatarComponente
  },
  data() {
    return {
      usuario: {
        id: '',
        usuario: '',
        correo: '',
        fecha_creacion: ''
      },
      usuarioEditado: {
        usuario: ''
      },
      passwordData: {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      hasMinLength: false,
      hasUpperCase: false,
      hasLowerCase: false,
      hasNumber: false,
      hasSpecialChar: false, 

      editando: false,
      cambiandoPassword: false,
      cargando: false,
      mensaje: '',
      esExito: false
    }
  },
  computed: {
    strengthClass() {
      const strength = [this.hasMinLength, this.hasUpperCase, this.hasLowerCase, this.hasNumber, this.hasSpecialChar]
        .filter(Boolean).length;
      
      return {
        'weak': strength <= 2,
        'medium': strength === 3 || strength === 4,
        'strong': strength === 5
      };
    },
    // Validar si la contraseña cumple con todos los requisitos
    passwordIsValid() {
      return (
        this.hasMinLength &&
        this.hasUpperCase &&
        this.hasLowerCase &&
        this.hasNumber &&
        this.hasSpecialChar
      );
    }
  },
  mounted() {
    this.obtenerPerfil();
  },
  methods: {
     validarContraseña() {
      this.hasMinLength = this.passwordData.newPassword.length >= 8;
      this.hasUpperCase = /[A-Z]/.test(this.passwordData.newPassword);
      this.hasLowerCase = /[a-z]/.test(this.passwordData.newPassword);
      this.hasNumber = /\d/.test(this.passwordData.newPassword);
      this.hasSpecialChar = /[\W_]/.test(this.passwordData.newPassword);
    },   
   //token del localStorage
    obtenerToken() {
      return localStorage.getItem('token');
    },
    
    async obtenerPerfil() {
      try {
        this.cargando = true;
        const token = this.obtenerToken();
        
        const response = await axios.get('http://localhost:3000/api/perfil', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        this.usuario = response.data.user;
        this.usuarioEditado.usuario = response.data.user.usuario;
        this.mensaje = '';
      } catch (error) {
        console.error('Error al obtener perfil:', error);
        
        if (error.response?.status === 401) {
          this.mostrarMensaje('Sesión expirada. Por favor, inicia sesión nuevamente.', false);
        
          setTimeout(() => {
            this.$router.push('/login');
          }, 2000);
        } else {
          this.mostrarMensaje(error.response?.data?.error || 'Error al cargar el perfil', false);
        }
      } finally {
        this.cargando = false;
      }
    },
    
    activarEdicion() {
      this.editando = true;
      this.cambiandoPassword = false;
      this.mensaje = '';
    },
    
    activarCambioPassword() {
      this.cambiandoPassword = true;
      this.editando = false;
      this.mensaje = '';
      this.passwordData = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      };
      this.hasMinLength = false;
      this.hasUpperCase = false;
      this.hasLowerCase = false;
      this.hasNumber = false;
      this.hasSpecialChar = false;
    },
    
    cancelarEdicion() {
      this.editando = false;
      this.usuarioEditado.usuario = this.usuario.usuario;
    },
    
    cancelarCambioPassword() {
      this.cambiandoPassword = false;
    },
    
    async guardarPerfil() {
      this.cargando = true;
      this.mensaje = '';
      
      try {
        const token = this.obtenerToken();
        const response = await axios.put('http://localhost:3000/api/perfil', {
          usuario: this.usuarioEditado.usuario
        }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        this.usuario = response.data.user;
        this.editando = false;
        this.mostrarMensaje('Perfil actualizado exitosamente', true);
        window.dispatchEvent(new CustomEvent('perfilActualizado'))//este se relaciona con perfilComponente, en methods 
      } catch (error) {
        console.error('Error al actualizar perfil:', error);
        this.mostrarMensaje(error.response?.data?.error || 'Error al actualizar el perfil', false);
      } finally {
        this.cargando = false;
      }
    },
    
    async cambiarPassword() {
      // Validaciones
      if (!this.passwordIsValid) {
        this.mostrarMensaje('La contraseña no cumple con todos los requisitos de seguridad', false);
        return;
      }
      
      if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {
        this.mostrarMensaje('Las contraseñas no coinciden', false);
        return;
      }
      
      this.cargando = true;
      this.mensaje = '';
      
      try {
        const token = this.obtenerToken();
        await axios.put('http://localhost:3000/api/cambiar-contra', {
          currentPassword: this.passwordData.currentPassword,
          newPassword: this.passwordData.newPassword
        }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
   this.cambiandoPassword = false;
    this.passwordData = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
    // Resetear validaciones
    this.hasMinLength = false;
    this.hasUpperCase = false;
    this.hasLowerCase = false;
    this.hasNumber = false;
    this.hasSpecialChar = false;
    
    this.mostrarMensaje('Contraseña actualizada exitosamente', true);
  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    this.mostrarMensaje(error.response?.data?.error || 'Error al cambiar la contraseña', false);
  } finally {
    this.cargando = false;
  }
    },
    
    mostrarMensaje(texto, esExito) {
      this.mensaje = texto;
      this.esExito = esExito;
      
      // Auto-ocultar mensaje después de 5 segundos
      setTimeout(() => {
        this.mensaje = '';
      }, 5000);
    },
    
    formatearFecha(fecha) {
      if (!fecha) return '';
      
      const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(fecha).toLocaleDateString('es-ES', opciones);
    }
  }
}
</script>

<style scoped>
.perfil-usuario {

  margin: 0 auto;
  font-family: 'Poppins', sans-serif;
  
}

.container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 25px;
  width: 100%;

  
}

.titulo {
  color: #2c3e50;
  text-align: center;
  margin-top: 0;
  margin-bottom: 20px;

}

.mensaje {
  padding: 0.75rem 1rem;
  border-radius: 4px;
  margin-bottom: 1.5rem;
  text-align: center;
}

.mensaje-exito {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.mensaje-error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.cargando {
  text-align: center;
  padding: 2rem;
  color: #7f8c8d;
}

.campo {
  margin-bottom: 1.5rem;
}

.campo label {
  display: block;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.campo p {
  margin: 0;
  padding: 0.5rem 0;
  color: #34495e;
}

.campo-formulario {
  margin-bottom: 1.5rem;
}

.campo-formulario label {
  display: block;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.campo-formulario input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.campo-formulario input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
}

.campo-no-editable {
  color: #7f8c8d;
  font-style: italic;
}

.password-strength {
  margin-top: 10px;
}

.strength-bar {
  height: 5px;
  border-radius: 5px;
  margin-bottom: 10px;
  transition: width 0.3s, background 0.3s;
}

.strength-bar.weak {
  width: 30%;
  background: #ff4444;
}

.strength-bar.medium {
  width: 60%;
  background: #ffbb33;
}

.strength-bar.strong {
  width: 100%;
  background: #4b9c46;
}

.requirements {
  list-style: none;
  padding: 0;
  margin: 5px 0 0 0;
  font-size: 0.8rem;
}

.requirements li {
  position: relative;
  padding-left: 20px;
  margin-bottom: 3px;
  color: #152516;
}

.requirements li:before {
  content: "x";
  position: absolute;
  left: 0;
  color: #ff4444;
}

.requirements li.valid:before {
  content: "✓";
  color: #00C851;
}

.botones {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-editar {
  background-color: #3d8e3e;
  color: white;
}

.btn-editar:hover:not(:disabled) {
  background-color: #52a973;
}

.btn-password {
  background-color: #49493f;
  color: white;
}

.btn-password:hover:not(:disabled) {
  background-color: #7f8c8d;
}

.btn-guardar {
  background-color: #3d8e3e;
  color: white;
}

.btn-guardar:hover:not(:disabled) {
  background-color: #219a52;
}

.btn-cancelar {
  background-color: #e74c3c;
  color: white;
}

.btn-cancelar:hover:not(:disabled) {
  background-color: #c0392b;
}

@media (max-width: 600px) {
  .perfil-usuario {
    padding: 1rem;
  }
  
  .container {
    padding: 1.5rem;
  }
  
  .botones {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
  }
}
</style>