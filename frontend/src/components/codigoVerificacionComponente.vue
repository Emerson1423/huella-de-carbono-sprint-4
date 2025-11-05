<template>
  <div class="codigo-bg">
    <div class="codigo-box">
      <h2>Ingresa tu código de seguridad</h2>
      <p>
        Ingresa el código de 6 dígitos que enviamos a <b>{{ correoEnmascarado }}</b>.
      </p>
      <form @submit.prevent="handleSubmit">
        <div class="codigo-inputs">
          <input
            v-for="(d, i) in 6"
            :key="i"
            type="text"
            maxlength="1"
            v-model="codigo[i]"
            ref="inputs"
            inputmode="numeric"
            pattern="[0-9]*"
            @input="onInput(i, $event)"
            @keydown.backspace="focusPrev(i)"
            @keydown.left="focusArrowLeft(i)"
            @keydown.right="focusArrowRight(i)"
            autocomplete="one-time-code"
            required
          />
        </div>
        <p v-if="error" class="error">{{ error }}</p>
        <button type="submit" :disabled="!codigoCompleto || loading">
          Confirmar
        </button>
      </form>
      <div class="reenviar">
        <span v-if="timer > 0">
          Puedes reenviar un código nuevo en {{ timer }} segundos.
        </span>
        <a v-else @click="reenviarCodigo" href="#">¿No recibiste el código? <b>Reenviar</b></a>
      </div>
      <p v-if="mensaje" class="mensaje">{{ mensaje }}</p>
      <div class="volver">
        <a href="/recuperar-contra">Volver</a>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      codigo: ['', '', '', '', '', ''],
      error: '',
      loading: false,
      timer: 60,
      correo: localStorage.getItem('correoRecuperacion') || '',
      mensaje: ''
    };
  },
  computed: {
    codigoCompleto() {
      return this.codigo.every(d => d !== '');
    },
    codigoUnido() {
      return this.codigo.join('');
    },
    correoEnmascarado() {
      if (!this.correo || !this.correo.includes('@')) return '';
      const [user, domain] = this.correo.split('@');
      if (user.length <= 2) return this.correo;
      return user[0] + '*'.repeat(user.length - 2) + user[user.length - 1] + '@' + domain;
    }
  },
  methods: {
    onInput(i, e) {
      const valor = e.target.value.replace(/\D/g, ''); // Solo números
      if (valor === '') {
        this.codigo[i] = '';
        return;
      }
      if (!/^\d$/.test(valor)) {
        this.error = 'Solo se permiten números';
        this.codigo[i] = '';
        return;
      }
      this.error = '';
      this.codigo[i] = valor;
      // Avanza solo si hay un número y no es la última casilla
      if (i < 5 && valor) {
        this.$refs.inputs[i + 1].focus();
      }
    },
    focusPrev(i) {
      if (!this.codigo[i] && i > 0) {
        this.$refs.inputs[i - 1].focus();
      }
    },
    focusArrowLeft(i) {
      if (i > 0) this.$refs.inputs[i - 1].focus();
    },
    focusArrowRight(i) {
      if (i < 5) this.$refs.inputs[i + 1].focus();
    },
    async handleSubmit() {
      if (!this.codigoCompleto) {
        this.error = 'Debes ingresar todos los dígitos del código';
        return;
      }
      this.error = '';
      this.mensaje = '';
      this.loading = true;
      try { //cambio aqui
        await axios.post('http://localhost:3000/api/verificar-codigo', {
          token: this.codigoUnido
        });
        localStorage.setItem('codigoRecuperacion', this.codigoUnido);
        this.$router.push('/restablecer-contra');
      } catch (err) {
        this.error = err.response?.data?.error || 'Código incorrecto';
      }
      this.loading = false;
    },
    async reenviarCodigo() {
      this.error = '';
      this.mensaje = '';
      this.timer = 60;
      try {
        await axios.post('http://localhost:3000/api/solicitar-restablecimiento', { correo: this.correo });
        this.mensaje = 'Se ha enviado un nuevo código a tu correo.';
      } catch (err) {
        this.error = err.response?.data?.error || 'Error al reenviar código';
      }
      this.startTimer();
    },
    startTimer() {
      const interval = setInterval(() => {
        this.timer--;
        if (this.timer <= 0) clearInterval(interval);
      }, 1000);
    }
  },
  mounted() {
    this.startTimer();
    this.$refs.inputs && this.$refs.inputs[0].focus();
  }
};
</script>

<style scoped>
.codigo-bg {
  position: fixed;
  min-height: 100vh;
  background-image: url("@/assets/img/FondoLR.png");
  background-size: cover;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  
}
.codigo-box {
  font-family: 'Poppins', sans-serif;
  background: #fff;
  padding: 35px 30px 25px 30px;
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.10);
  width: 100%;
  max-width: 370px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
h2 {
  text-align: center;
  color: #333;
  margin-bottom: 10px;
}
.codigo-inputs {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin: 18px 0;
}
.codigo-inputs input {
  width: 38px;
  height: 48px;
  font-size: 28px;
  text-align: center;
  border: 1px solid #8BC34A;
  border-radius: 8px;
  outline: none;
  background: #fafafa;
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
.error {
  color: #e53935;
  text-align: center;
  margin-top: 8px;
}
.mensaje {
  color: #388e3c;
  text-align: center;
  margin-top: 8px;
}
.reenviar {
  text-align: center;
  margin-top: 10px;
  color: #e53935;
}
.reenviar a {
  color: #8BC34A;
  text-decoration: none;
  cursor: pointer;
}
.reenviar a:hover {
  text-decoration: underline;
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
</style>