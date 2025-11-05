<template>
  <div class="recuperar-bg">
    <div class="recuperar-box">
      <h1>Recuperar contraseña</h1>
      <form @submit.prevent="handleSubmit">
        <input v-model="correo" type="email" placeholder="Correo" required />
        <button type="submit" :disabled="timer > 0">
          {{ timer > 0 ? `Espera ${timer}s` : 'Enviar código' }}
        </button>
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
      correo: '',
      mensaje: '',
      error: '',
      timer: 0,
      intervalId: null
    };
  },
  methods: {
    async handleSubmit() {
      if (this.timer > 0) return;
      this.mensaje = '';
      this.error = '';
      try {
        await axios.post('http://localhost:3000/api/solicitar-restablecimiento', { correo: this.correo });
        localStorage.setItem('correoRecuperacion', this.correo);
        this.$router.push('/codigo-verificacion');
        this.timer = 60;
        this.startTimer();
      } catch (err) {
        this.error = err.response?.data?.error || 'Error al enviar el código';
      }
    },
    startTimer() {
      this.intervalId = setInterval(() => {
        this.timer--;
        if (this.timer <= 0) {
          clearInterval(this.intervalId);
          this.intervalId = null;
        }
      }, 1000);
    }
  },
  beforeUnmount() {
    if (this.intervalId) clearInterval(this.intervalId);
  }
};
</script>

<style>

.recuperar-bg {
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
.recuperar-box {
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
  color: #080808;
  text-decoration: none;
}
.volver a:hover {
  text-decoration: underline;
}

</style> 