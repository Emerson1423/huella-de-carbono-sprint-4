<template>
  <div class="register-page">
    <div class="caja">
      <form @submit.prevent="completarRegistro" class="register-form">
        <h1>Completa tu registro</h1>
        <p class="google-email">Email de Google: <strong>{{ emailGoogle }}</strong></p>
        
        <div class="campo">
          <input v-model="usuario" placeholder="Nombre de usuario" required class="input">
        </div>
        
        <div class="campo">
          <input 
            v-model="contraseña" 
            @input="validarContraseña" 
            type="password" 
            placeholder="Contraseña" 
            required 
            class="input"
          >
          <div class="password-strength" v-if="contraseña.length > 0">
            <div class="strength-bar" :class="strengthClass"></div>
            <ul class="requirements">
              <li :class="{ 'valid': hasMinLength }">Mínimo 8 caracteres</li>
              <li :class="{ 'valid': hasUpperCase }">1 letra mayúscula</li>
              <li :class="{ 'valid': hasLowerCase }">1 letra minúscula</li>
              <li :class="{ 'valid': hasNumber }">1 número</li>
              <li :class="{ 'valid': hasSpecialChar }">1 carácter especial</li>
            </ul>
          </div>
        </div>
        
        <div class="campo">
          <input 
            v-model="confirmarContraseña" 
            type="password" 
            placeholder="Confirmar contraseña" 
            required 
            class="input"
          >
          <p v-if="confirmarContraseña && !passwordsMatch" class="error-text">
            Las contraseñas no coinciden
          </p>
        </div>
        
        <button type="submit" :disabled="!formIsValid || loading">
          {{ loading ? 'Completando registro...' : 'Completar registro' }}
        </button>
        
        <p v-if="error" class="error">{{ error }}</p>
        
        <div class="login-link">
          <p><a href="/login">Volver al login</a></p>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'CompletarRegistroGoogle',
  data() {
    return {
      tempToken: '',
      emailGoogle: '',
      usuario: '',
      contraseña: '',
      confirmarContraseña: '',
      error: '',
      loading: false,
      hasMinLength: false,
      hasUpperCase: false,
      hasLowerCase: false,
      hasNumber: false,
      hasSpecialChar: false
    };
  },
  computed: {
    passwordsMatch() {
      return this.contraseña === this.confirmarContraseña;
    },
    strengthClass() {
      const strength = [this.hasMinLength, this.hasUpperCase, this.hasLowerCase, this.hasNumber, this.hasSpecialChar]
        .filter(Boolean).length;
      
      return {
        'weak': strength <= 2,
        'medium': strength === 3 || strength === 4,
        'strong': strength === 5
      };
    },
    formIsValid() {
      return (
        this.usuario &&
        this.contraseña &&
        this.confirmarContraseña &&
        this.passwordsMatch &&
        this.hasMinLength &&
        this.hasUpperCase &&
        this.hasLowerCase &&
        this.hasNumber &&
        this.hasSpecialChar
      );
    }
  },
  mounted() {
    this.obtenerTokenTemporal();
  },
  methods: {
    obtenerTokenTemporal() {
      // Obtener token temporal de la URL
      const urlParams = new URLSearchParams(window.location.search);
      this.tempToken = urlParams.get('temp_token');
      
      if (!this.tempToken) {
        this.error = 'Token temporal no encontrado';
        setTimeout(() => {
          this.$router.push('/login');
        }, 3000);
        return;
      }

      // Decodificar token para obtener email (solo para mostrar, no para seguridad)
      try {
        const payload = JSON.parse(atob(this.tempToken.split('.')[1]));
        console.log('Payload completo del token:', payload);
        
        // Buscar el email en diferentes posibles nombres de campo
        this.emailGoogle = payload.email || payload.correo || payload.email_google || payload.sub || 'No disponible';
        
        console.log('Email de Google obtenido del token:', this.emailGoogle);
      } catch (err) {
        console.error('Error al decodificar token:', err);
        this.emailGoogle = 'No disponible';
      }
    },
    
    validarContraseña() {
      this.hasMinLength = this.contraseña.length >= 8;
      this.hasUpperCase = /[A-Z]/.test(this.contraseña);
      this.hasLowerCase = /[a-z]/.test(this.contraseña);
      this.hasNumber = /\d/.test(this.contraseña);
      this.hasSpecialChar = /[\W_]/.test(this.contraseña);
    },
    
    async completarRegistro() {
      if (!this.formIsValid) return;
      
      this.loading = true;
      this.error = '';
      
      try {
        const response = await axios.post('http://localhost:3000/api/completar-registro-google', {
          temp_token: this.tempToken,
          usuario: this.usuario,
          contraseña: this.contraseña
        });
        
        // Guardar token y datos de usuario
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Redirigir a huella
        this.$router.push('/');
        
      } catch (err) {
        console.error('Error al completar registro:', err);
        this.error = err.response?.data?.error || 'Error al completar el registro';
        
        if (this.error.includes('Token inválido') || this.error.includes('expirado')) {
          setTimeout(() => {
            this.$router.push('/login');
          }, 3000);
        }
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.register-page {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url("@/assets/img/fondoS3.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  justify-content: center;
  align-items: center;
}

.register-form {
  background-color: rgba(255, 255, 255, 0.35);
  backdrop-filter: blur(8px);
  padding: 35px 30px 25px 30px;
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.10);
  width: 100%;
  display: flex;
  max-width: 370px;
  flex-direction: column;
  align-items: stretch;
  font-family: Poppins, sans-serif;
}

.caja {
  padding-top: 100px;
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 10px;
}

.google-email {
  text-align: center;
  color: #555;
  font-size: 14px;
  margin-bottom: 20px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 8px;
}

.campo {
  margin: 15px 0;
}

.input {
  width: 100%;
  padding: 10px 16px;
  box-sizing: border-box;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  outline: none;
  border-color: #8BC34A;
}

.input:focus {
  border-color: #8BC34A;
  outline: none;
}

.input::placeholder {
  color: #8BC34A;
}

button {
  width: 100%;
  padding: 10px;
  background: #8bc34a;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.3s;
}

button:disabled {
  background: #cccccc;
  cursor: not-allowed;
}

.error {
  color: #ff4444;
  margin-top: 10px;
  text-align: center;
}

.error-text {
  color: #ff4444;
  font-size: 0.8rem;
  margin-top: 5px;
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
  background: #00C851;
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

.login-link {
  text-align: center;
  margin-top: 10px;
}

.login-link a {
  color: white;
  text-decoration: none;
}

.login-link a:hover {
  text-decoration: underline;
}
</style>