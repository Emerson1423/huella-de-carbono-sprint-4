<template>
  <div class="restablecer-bg">
    <div class="restablecer-box">
      <h1>Restablecer contraseña</h1>
      <form @submit.prevent="handleSubmit">
        <div class="campo">
          <input v-model="nueva" @input="validarContraseña" type="password" placeholder="Nueva contraseña" required class="input" />
          <div class="password-strength" v-if="nueva.length > 0">
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
          <input v-model="confirmar" type="password" placeholder="Confirmar contraseña" required class="input" />
          <p v-if="confirmar && !passwordsMatch" class="error-text">Las contraseñas no coinciden</p>
        </div>

        <button type="submit">Restablecer</button>
        <p v-if="mensaje" class="mensaje">{{ mensaje }}</p>
        <p v-if="error" class="error">{{ error }}</p>
      </form>
      <div class="volver">
        <a href="/login">Volver al login</a>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      nueva: '',
      confirmar: '',
      mensaje: '',
      error: '',
      correo: localStorage.getItem('correoRecuperacion') || '',
      codigo: localStorage.getItem('codigoRecuperacion') || '',
      hasMinLength: false,
      hasUpperCase: false,
      hasLowerCase: false,
      hasNumber: false,
      hasSpecialChar: false
    };
  },
  computed: {
    passwordsMatch() {
      return this.nueva === this.confirmar;
    },
    strengthClass() {
      const strength = [this.hasMinLength, this.hasUpperCase, this.hasLowerCase, this.hasNumber, this.hasSpecialChar]
        .filter(Boolean).length;

      return {
        'weak': strength <= 2,
        'medium': strength === 3 || strength === 4,
        'strong': strength === 5
      };
    }
  },
  methods: {
    validarContraseña() {
      this.hasMinLength = this.nueva.length >= 8;
      this.hasUpperCase = /[A-Z]/.test(this.nueva);
      this.hasLowerCase = /[a-z]/.test(this.nueva);
      this.hasNumber = /\d/.test(this.nueva);
      this.hasSpecialChar = /[\W_]/.test(this.nueva);
    },
    async handleSubmit() {
      this.mensaje = '';
      this.error = '';

      if (!this.passwordsMatch) {
        this.error = 'Las contraseñas no coinciden';
        return;
      }

      if (!this.codigo) {
        this.error = 'Código inválido';
        return;
      }

      try {
        const res = await axios.post('http://localhost:3000/api/restablecer-contra', {
          token: this.codigo,
          nuevaContraseña: this.nueva
        });

        this.mensaje = res.data.message;
        localStorage.removeItem('correoRecuperacion');
        localStorage.removeItem('codigoRecuperacion');
      } catch (err) {
        this.error = err.response?.data?.error || 'Error al restablecer contraseña';
      }
    }
  }
};
</script>

<style>

.restablecer-bg {
  position: fixed;
  min-height: 100vh;
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
.restablecer-box {
  background-color: rgba(255, 255, 255, 0.35);
  backdrop-filter: blur(8px);  
  padding: 35px 30px 25px 30px;
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.10);
  width: 100%;
  max-width: 370px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  font-family: 'Poppins', sans-serif;
}
h1 {
  text-align: center;
  color: #333;
  margin-bottom: 18px;
}
.input::placeholder {
    color:#8BC34A;
}
input {
  width: 100%;
  padding: 10px;
  border: 1px solid #8BC34A;
  border-radius: 8px;
  font-size: 16px;
  outline: none;
  margin-bottom: 18px;
}
button {
  width: 100%;
  padding: 10px;
  background: #8BC34A;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  margin-bottom: 10px;
  transition: background 0.2s;
}
button:disabled {
  background: #b6d7a8;
  cursor: not-allowed;
}
.mensaje {
  color: #388e3c;
  text-align: center;
  margin-top: 8px;
}
.error {
  color: #e53935;
  text-align: center;
  margin-top: 8px;
}
.volver {
  text-align: center;
  margin-top: 10px;
}
.volver a {
  color: #101707;
  text-decoration: none;
}
.volver a:hover {
  text-decoration: underline;
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
  color: #0a210b;
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

</style>