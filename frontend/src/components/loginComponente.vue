<template> 
<NavComponente></NavComponente>

  <div class="login-page">  
  <div class="caja">
  <form @submit.prevent="handleSubmit" class="login-form">
    <h1>Bienvenido de nuevo</h1>

    <div class="campo">
    <input 
      v-model="usuario" 
      placeholder="Usuario" 
      required
      class="input"
    >
    </div>
    <div class="campo">
    <input 
      v-model="contraseña" 
      type="password" 
      placeholder="Contraseña" 
      required
      class="input"
    >
    
    </div>
    <button type="submit" :disabled="loading">
      {{ loading ? 'Cargando...' : 'Ingresar' }}
    </button>
    <p v-if="error" class="error">{{ error }}</p>
          <div class="google-btn">
        <a href="http://localhost:3000/api/auth/google">
          <button type="button" class="google">Inicia con
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
    <div class="sign">
        <p>¿No tienes cuenta? <a href="/registro">Regístrate</a></p>
      </div>
      <div class="olvido">
        <p><a href="/recuperar-contra">¿Olvidaste tu contraseña?</a></p>
      </div>

  </form>

  </div> 
  </div>
</template>

<script>
import axios from 'axios';
import NavComponente from '@/components/NavComponente.vue';


export default {
  components:{
    NavComponente

  },

  data() {
    return {
      usuario: '',
      contraseña: '',
      error: '',
      loading: false,
    };
  },
  methods: {
    // En el método handleSubmit(), reemplaza esta parte:

async handleSubmit() {
  this.loading = true;
  this.error = '';

  console.log('📤 Enviando solicitud de login...');

  try {
    const response = await axios.post(
      'http://localhost:3000/api/login',
      {
        usuario: this.usuario,
        contraseña: this.contraseña,
      }
    );

    console.log('📥 Respuesta recibida:', response.data);

    if (!response.data.token) {
      throw new Error('No se recibió token del servidor');
    }

    // Guardar token y datos de usuario
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('usuario', JSON.stringify(response.data.usuario));

    console.log('✅ Token guardado:', response.data.token.substring(0, 20) + '...');
    console.log('✅ Usuario guardado:', response.data.usuario);

    // Disparar evento para actualizar navbar
    window.dispatchEvent(new Event('authStateChanged'));
    
    console.log('🏠 Redirigiendo a home...');
    
    // Redirigir
    this.$router.push('/');
    
  } catch (err) {
    console.error('❌ Error completo:', err);
    console.error('❌ Respuesta del servidor:', err.response);
    
    this.error = err.response?.data?.error || 
                err.message || 
                'Error al iniciar sesión';
  } finally {
    this.loading = false;
  }
}
  }
};
</script>


<style scoped>

.login-page {
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

.login-form {
  background: #fff;
  background: rgba(255, 255, 255, 0.35); /* Blanco translúcido */
  backdrop-filter: blur(8px);             /* Efecto blur */
  padding: 35px 30px 25px 30px;
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.10);
  width: 100%;
  max-width: 370px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  font-family:  'Poppins', sans-serif;
}
.caja{
  padding-top: 100px;
}
h1 {
  text-align: center;
  margin-bottom: 18px;
  color: #333;
}

.campo {
  margin-bottom: 18px;
  
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
    color:#8BC34A;
}


button {
  width: 100%;
  padding: 10px;
  background: #8bc34a;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
}

button:disabled {
  background: #a5d6a7;
  cursor: not-allowed;
}

.google-btn {
  text-align: center;
  margin-bottom: 20px;
  margin-top: 18px;
}
button.google {
  background: rgb(44, 79, 36);
  color:#fff;
  margin-top: 0;
}

button.google:hover {
  background: #4d7ee6;
}
.olvido {
  text-align: center;
  margin-top: 20px;
  
}
.olvido a {
  color: white;
  text-decoration: none;
}

.sign  {
    text-align: center;
  
}
.sign a {
  color: white;
  text-decoration: none;
}
</style>
