<template>
  <div class="callback-page">
    <div class="loader">
      <div class="spinner"></div>
      <p>{{ mensaje }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginGoogle',
  data() {
    return {
      mensaje: 'Procesando autenticación con Google...'
    }
  },
  mounted() {
    this.manejarCallback();
  },
  methods: {
  manejarCallback() {
    const urlParams = new URLSearchParams(globalThis.location.search);
    const token = urlParams.get('token');
    const tempToken = urlParams.get('temp_token');
    
    console.log('🔍 LoginGoogle - Token recibido:', token ? 'Sí' : 'No');
    console.log('🔍 LoginGoogle - TempToken recibido:', tempToken ? 'Sí' : 'No');
    
    if (token) {
      // Login exitoso - usuario ya existía
      this.mensaje = 'Iniciando sesión...';
      localStorage.setItem('token', token);
      
      try {
        // Decodificar el payload del JWT
        const payload = JSON.parse(atob(token.split('.')[1]));
        
        console.log('📦 Payload decodificado:', payload);
        
        const usuarioData = {
          id: payload.id,
          usuario: payload.usuario,
          correo: payload.correo,
          rol: payload.rol || 'usuario'
        };
        
        localStorage.setItem('usuario', JSON.stringify(usuarioData));
        
        globalThis.dispatchEvent(new Event('authStateChanged'));
        
      } catch (err) {
        console.error('❌ Error al decodificar token:', err);
      }
      
      setTimeout(() => {
        console.log('🏠 Redirigiendo a /huella');
        this.$router.push('/huella');
      }, 1000);
      
    } else if (tempToken) {
      // Necesita completar registro - usuario nuevo
      this.mensaje = 'Redirigiendo para completar registro...';
      console.log('📝 Usuario nuevo, redirigiendo a completar registro');
      
      setTimeout(() => {
        this.$router.push(`/completar-registro-google?temp_token=${tempToken}`);
      }, 1000);
      
    } else {
      // Error - no se recibió ningún token
      this.mensaje = 'Error en la autenticación';
      console.error('❌ No se recibió token de Google');
      
      setTimeout(() => {
        this.$router.push('/login?error=google_auth_failed');
      }, 2000);
    }
  }
}
};
</script>

<style scoped>
.callback-page {
  position: fixed;
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

.loader {
  text-align: center;
  background: rgba(255, 255, 255, 0.35);
  backdrop-filter: blur(8px);
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.10);
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #8bc34a;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 2s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

p {
  color: #333;
  font-family: Poppins, sans-serif;
  margin: 0;
}
</style>