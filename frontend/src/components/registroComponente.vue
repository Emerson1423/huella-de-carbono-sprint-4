<template>


  <div class="register-page"> 
    <div class="caja">

      <form @submit.prevent="handleRegister" class="register-form">
        <h1>Registrate</h1>
        
        <div class="campo">
          <input v-model="usuario" placeholder="Usuario" required class="input">
        </div>
        
        <div class="campo">
          <input v-model="correo" type="email" placeholder="Correo" required class="input">
        </div>
        
        <div class="campo">
          <input v-model="contraseña" @input="validarContraseña" type="password" placeholder="Contraseña" required class="input">
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
          <input v-model="confirmarContraseña" type="password" placeholder="Confirmar contraseña" required class="input">
          <p v-if="confirmarContraseña && !passwordsMatch" class="error-text">Las contraseñas no coinciden</p>
        </div>
        
        <button type="submit" >Registrarse</button>
        <p v-if="error" class="error">{{ error }}</p>
        <div class="login-link">
          <div class="google-btn">
        <a href="http://localhost:3000/api/auth/google">
          <button type="button" class="google">Registrate con
              <svg width="18" height="18" viewBox="0 0 48 48" style="vertical-align: middle; margin-right: 8px;">
                <g>
              <path fill="#4285F4" d="M43.6 20.5h-1.9V20H24v8h11.3c-1.6 4.3-5.7 7-11.3 7-6.6 0-12-5.4-12-12s5.4-12 12-12c2.7 0 5.2.9 7.2 2.4l6.1-6.1C34.1 5.1 29.3 3 24 3 12.9 3 4 11.9 4 23s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.7-.3-4z"/>
              <path fill="#34A853" d="M6.3 14.7l6.6 4.8C14.3 16.1 18.8 13 24 13c2.7 0 5.2.9 7.2 2.4l6.1-6.1C34.1 5.1 29.3 3 24 3c-7.1 0-13.1 4.1-16.3 10.1z"/>
              <path fill="#FBBC05" d="M24 43c5.3 0 10.1-1.8 13.8-4.9l-6.4-5.2c-2 1.4-4.5 2.1-7.4 2.1-5.6 0-10.3-3.7-12-8.7l-6.6 5.1C10.9 39.1 17 43 24 43z"/>
              <path fill="#EA4335" d="M43.6 20.5h-1.9V20H24v8h11.3c-1.1 3-3.5 5.3-6.3 6.6l6.4 5.2C41.1 36.1 44 30.1 44 24c0-1.3-.1-2.7-.4-4z"/>
              </g>
            </svg>
              
          </button>
        </a>
      </div>
        <p>¿Ya tienes cuenta? <a href="/login">Inicia sesión</a></p>
      </div>
      </form>
    </div>
  </div>

</template>

<script>
import axios from 'axios';


export default {

  data() {
    return {
      usuario: '',
      correo: '',
      contraseña: '',
      confirmarContraseña: '',
      error: '',
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
        this.correo &&
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
  methods: {
    validarContraseña() {
      this.hasMinLength = this.contraseña.length >= 8;
      this.hasUpperCase = /[A-Z]/.test(this.contraseña);
      this.hasLowerCase = /[a-z]/.test(this.contraseña);
      this.hasNumber = /\d/.test(this.contraseña);
      this.hasSpecialChar = /[\W_]/.test(this.contraseña);
    },
    async handleRegister() {
      if (!this.formIsValid) return;
      
      try {
        const response = await axios.post('http://localhost:3000/api/registro', {
          usuario: this.usuario,
          correo: this.correo,
          contraseña: this.contraseña
        });
        alert(response.data.message);
        this.$router.push({ path: '/login' });
      } catch (err) {
        this.error = err.response?.data?.error || 'Error al registrarse';
      }
    }
  }
};
</script>

<style>

.register-page {
  position:fixed;

  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url("@/assets/img/FondoLR.png");
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
  padding:35px 30px 25px 30px;
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.10);
  width: 100%;
  display: flex;
  max-width: 370px;
  flex-direction: column;
  align-items: stretch;
  font-family: Poppins, sans-serif;
}
.caja{
padding-top: 100px;
}



h1 {
  text-align: center;
  color: #333;
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
  border-color:#8BC34A ;
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

.google-btn {
  text-align: center;
  margin-bottom: 10px;
}
button.google {
  background: rgb(44, 79, 36);
  color:#fff;
  margin-top: 0;
}

button.google:hover {
  background: #4d7ee6;
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