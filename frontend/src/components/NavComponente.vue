<template>
  <header class="header">
    <div class="header-container">
      <div class="logo">
        <img src="@/assets/img/logo.png" alt="Logo" class="logo-img" />
      </div>
    
      <button class="menu-toggle" @click="toggleMenu" :class="{ active: isMenuOpen }" aria-label="Toggle menu">
        <span class="bar"></span>
        <span class="bar"></span>
        <span class="bar"></span>
      </button>
    
      <nav class="navigation" :class="{ 'active': isMenuOpen }">
        <ul class="nav-list">
          <li class="nav-item">
            <router-link to="/" class="nav-link" @click="closeMenu">Inicio</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/noticias" class="nav-link" @click="closeMenu">Noticias</router-link>
          </li>
          
          <li class="nav-item dropdown" @click.stop="toggleDropdown('recursos')">
            <a href="#" class="nav-link" @click.prevent>
              Recursos
            </a>
            <ul class="dropdown-menu" :class="{ 'active': activeDropdown === 'recursos' }">
              <li class="dropdown-item">
                <router-link to="/articulos" class="dropdown-link" @click="closeAll">Artículos</router-link>
              </li>
              <li class="dropdown-item">
                <router-link to="/curiosidades" class="dropdown-link" @click="closeAll">Datos Curiosos</router-link>
              </li>
              <li class="dropdown-item">
                <router-link to="/videos" class="dropdown-link" @click="closeAll">Videos</router-link>
              </li>
            </ul>
          </li>
          
          <li class="nav-item dropdown" @click.stop="toggleDropdown('actua')">
            <a href="#" class="nav-link" @click.prevent>
              Actúa
            </a>
            <ul class="dropdown-menu" :class="{ 'active': activeDropdown === 'actua' }">
              <li class="dropdown-item">
                <router-link to="/huella" class="dropdown-link" @click="closeAll">Calcular Co2</router-link>
              </li>
              <li class="dropdown-item">
                <router-link to="/habitos" class="dropdown-link" @click="closeAll">Hábitos</router-link>
              </li>
              <li class="dropdown-item">
                <router-link to="/eventos" class="dropdown-link" @click="closeAll">Eventos</router-link>
              </li>
              <li class="dropdown-item">
                <router-link to="/entretenimiento" class="dropdown-link" @click="closeAll">Entretenimiento</router-link>
              </li>
            </ul>
          </li>
          <li v-if="isAuthenticated && isAdminOrMod" class="nav-item">
            <router-link to="/dashboard" class="nav-link dashboard-link" @click="closeMenu">
              <i class="fas fa-tachometer-alt"></i> Dashboard
            </router-link>
          </li>

          <!-- Mostrar solo cuando NO está autenticado -->
          <template v-if="!isAuthenticated">
            <li class="nav-item">
              <router-link to="/registro" class="nav-link" @click="closeMenu">Registro</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/login" class="nav-link" @click="closeMenu">Iniciar Sesión</router-link>
            </li>
          </template>

          <!-- Mostrar solo cuando SÍ está autenticado -->
          <template v-if="isAuthenticated">
            <li class="nav-item dropdown" @click.stop="toggleDropdown('usuario')">
              <a href="#" class="nav-link-user-container" @click.prevent>
                <img :src="userAvatar" alt="Avatar" class="avatar-img" />
              </a>
              <ul class="dropdown-menu" :class="{ 'active': activeDropdown === 'usuario' }">
                <li class="dropdown-item">
                  <router-link to="/historial" class="dropdown-link" @click="closeAll">
                    <i class="fas fa-history"></i> Historial
                  </router-link>
                </li>
                <li class="dropdown-item">
                  <router-link to="/perfil" class="dropdown-link" @click="closeAll">
                    <i class="fas fa-user"></i> Perfil
                  </router-link>
                </li>
                <li class="dropdown-item">
                  <a href="#" class="dropdown-link logout-link" @click.prevent="showLogoutModal = true; closeAll()">
                    <i class="fas fa-sign-out-alt"></i> Cerrar Sesión
                  </a>
                </li>
              </ul>
            </li> 
          </template>
        </ul>
      </nav>
    </div>

    <!-- Modal de confirmación de logout -->
    <div v-if="showLogoutModal" class="modal-overlay" @click="showLogoutModal = false">
      <div class="modal-content" @click.stop>
        <h3>Confirmar Cierre de Sesión</h3>
        <p>¿Estás seguro de que deseas salir de tu cuenta?</p>
        <div class="modal-actions">
          <button @click="logout" class="btn-confirm">Sí, Cerrar Sesión</button>
          <button @click="showLogoutModal = false" class="btn-cancel">Cancelar</button>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'NavComponente',
  data() {
    return {
      isMenuOpen: false,
      activeDropdown: null,
      showLogoutModal: false,
      isAuthenticated: false,
      userName: '',
      userRole: '',
      userAvatar: require('@/assets/perfil/reemplazarP.png')
    }
  },
  
  computed: {
    isAdminOrMod() {
      return this.userRole === 'admin' || this.userRole === 'moderador';
    }
  },
  
  mounted() {
    console.log('NavBar montado, verificando autenticación...');
    this.checkAuthStatus();
    
    globalThis.addEventListener('storage', this.checkAuthStatus);
    globalThis.addEventListener('authStateChanged', this.checkAuthStatus);
    document.addEventListener('click', this.handleOutsideClick);
  },

  beforeUnmount() {
    globalThis.removeEventListener('storage', this.checkAuthStatus);
    globalThis.removeEventListener('authStateChanged', this.checkAuthStatus);
    document.removeEventListener('click', this.handleOutsideClick);
  },
  
  methods: {
    checkAuthStatus() {
      console.log('Verificando estado de autenticación...');
      
      const token = localStorage.getItem('token');
      const usuarioStr = localStorage.getItem('usuario');
      const avatarPrefs = localStorage.getItem('avatarPreferencias');
      
      console.log('Token:', token ? 'Existe' : 'No existe');
      console.log('Usuario:', usuarioStr);
      
      if (token && usuarioStr) {
        try {
          const usuario = JSON.parse(usuarioStr);
          this.isAuthenticated = true;
          this.userName = usuario.usuario;
          this.userRole = usuario.rol || 'usuario';
          
          console.log('Usuario autenticado:', {
            nombre: this.userName,
            rol: this.userRole,
            esAdmin: this.isAdminOrMod
          });
          
          if (avatarPrefs) {
            const avatarData = JSON.parse(avatarPrefs);
            if (avatarData.personajeBase) {
              this.userAvatar = avatarData.personajeBase;
            }
          }
          
        } catch (error) {
          console.error('Error parseando usuario:', error);
          this.forceLogout();
        }
      } else {
        console.log(' No hay sesión activa');
        this.isAuthenticated = false;
        this.userName = '';
        this.userRole = '';
        this.userAvatar = require('@/assets/perfil/reemplazarP.png'); 
      }
    },
    
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    
    toggleDropdown(dropdownName) {
      this.activeDropdown = this.activeDropdown === dropdownName ? null : dropdownName;
    },
    
    closeAll() {
      this.isMenuOpen = false;
      this.activeDropdown = null;
    },
    
    closeMenu() {
      this.isMenuOpen = false;
    },

    async logout() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          this.forceLogout();
          return;
        }

        const response = await fetch('http://localhost:3000/api/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Error al cerrar sesión');
        }
        
        this.forceLogout();
        
      } catch (error) {
        console.error('Error en logout:', error.message);
        this.forceLogout();
      } finally {
        this.showLogoutModal = false;
      }
    },
    
    handleOutsideClick(event) {
      const headerEl = this.$el;
      if (!headerEl) return;
      if (!headerEl.contains(event.target)) {
        this.closeAll();
      }
    },
    
    forceLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('avatarPreferencias');
    
    this.isAuthenticated = false;
    this.userName = '';
    this.userRole = '';
    this.userAvatar = require('@/assets/perfil/reemplazarP.png');
    
    globalThis.dispatchEvent(new Event('authStateChanged'));
    
    this.$router.push('/').catch(() => {});
  }
  }
}
</script>

<style>
body {
  margin: 0;
  padding: 0;
  font-family: 'Poppins', sans-serif;
  background-color: rgb(255, 255, 255);
}

.header {
  width: 100%;
  background-color: #ffffff;
  font-family: 'Poppins', sans-serif;
  padding: 15px;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: none;
  margin: 0;
  padding: 0;
  height: 60px;
  position: relative;
}

.logo {
  margin-right:auto;
  margin-left: 20px;
  padding-left: 0;
  z-index: 1001;
}

.logo-img {
  height: 75px;
  width: auto;
  transition: transform 0.3s ease;
}

.logo:hover .logo-img {
  transform: scale(1.05);
}

.navigation {
  display: flex;
  justify-content: center;
  width: 100%;
}

.nav-list {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 2rem;
  justify-content: center;
  align-items: center;
}

.nav-item {
  position: relative;
}

.nav-link {
  color: #333;
  text-decoration: none;
  font-size: 1.1rem;
  transition: color 0.3s ease;
  font-weight: bold;
  padding: 0.5rem 1rem;
  display: flex;
  align-items: center;
  gap: 8px;
  border-radius: 6px;
}

.nav-link:hover {
  color: #42b983;
  background-color: rgba(66, 185, 131, 0.1);
}

.router-link-active {
  color: #42b983;
  background-color: rgba(66, 185, 131, 0.1);
}

/* ⭐ ESTILOS PARA EL BOTÓN FAQ */
.faq-link {
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  color: white !important;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);
  transition: all 0.3s ease;
}

.faq-link:hover {
  background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
  color: white !important;
}

.faq-link.router-link-active {
  background: linear-gradient(135deg, #4338ca 0%, #3730a3 100%);
}

/* ⭐ ESTILOS PARA EL BOTÓN DE DASHBOARD */
.dashboard-link {
  background: linear-gradient(135deg, #42b983 0%, #2c8f5e 100%);
  color: white !important;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(66, 185, 131, 0.3);
  transition: all 0.3s ease;
}

.dashboard-link:hover {
  background: linear-gradient(135deg, #2c8f5e 0%, #42b983 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(66, 185, 131, 0.4);
}

.dashboard-link.router-link-active {
  background: linear-gradient(135deg, #2c8f5e 0%, #1f7245 100%);
}

.nav-link-user-container {
  display: flex !important;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8px 12px !important;
  text-decoration: none;
  color: inherit;
  gap: 4px;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.nav-link-user-container:hover {
  background-color: rgba(66, 185, 131, 0.1);
}

.avatar-img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e0e0e0;
  transition: all 0.3s ease;
}

.nav-link-user-container:hover .avatar-img {
  border-color: #42b983;
  transform: scale(1.05);
}

.menu-toggle {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 10px;
  position: absolute;
  right: 20px;
  z-index: 1001;
}

.bar {
  display: block;
  width: 25px;
  height: 3px;
  background-color: #333;
  margin: 5px 0;
  transition: all 0.3s ease;
}

.nav-item.dropdown .nav-link {
  padding: 8px 16px;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  background-color: white;
  min-width: 180px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 8px 0;
  margin-top: 8px;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.3s ease;
  z-index: 1000;
  border: 1px solid #f0f0f0;
  list-style: none;
}

.dropdown-menu.active {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.dropdown-item {
  padding: 0;
}

.dropdown-link {
  display: block;
  padding: 10px 16px;
  color: #333;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.2s ease;
  text-decoration: none;
}

.dropdown-link:hover {
  background-color: #f8f8f8;
  color: #42b983;
}

.logout-link {
  color: #dc3545 !important;
}

.logout-link:hover {
  background-color: rgba(220, 53, 69, 0.1) !important;
  color: #dc3545 !important;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  max-width: 400px;
  width: 90%;
  text-align: center;
}

.modal-content h3 {
  margin: 0 0 1rem 0;
  color: #333;
  font-size: 1.5rem;
}

.modal-content p {
  margin: 0 0 1.5rem 0;
  color: #666;
  line-height: 1.5;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.btn-confirm,
.btn-cancel {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-confirm {
  background-color: #dc3545;
  color: white;
}

.btn-confirm:hover {
  background-color: #c82333;
}

.btn-cancel {
  background-color: #6c757d;
  color: white;
}

.btn-cancel:hover {
  background-color: #5a6268;
}

@media (max-width: 768px) {
  .header {
    padding: 1rem;
  }

  .menu-toggle {
    display: block;
    position: absolute;
    right: 16px;
    top: 14px;
    z-index: 2001;
  }

  .navigation {
    width: 82%;
    height: 100vh;
    border-top-right-radius: 8px;
    max-width: 230px;
    transform: translateX(100%);
    transition: transform .25s ease;
    background: #ffffff;
    position: fixed;
    top: 0;
    right: 0;
    z-index: 2000;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    overflow-y: auto;
    padding-top: 70px;
    will-change: transform;
    background-image: linear-gradient(rgb(255, 255, 255), rgba(77, 165, 0, 0.173));
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }

  .navigation.active {
    transform: translateX(0);
  }

  .nav-list {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 12px;
    margin: 0;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  .nav-link {
    font-size: 1.05rem;
    padding: 10px 12px;
    border-radius: 12px;
    transition: all 0.2s ease;
    font-weight: 500;
  }

  .dropdown-menu {
    display: none;
    padding-left: 16px;
    margin-top: 6px;
    position: static;
    z-index: 1500;
    width: 100%;
  }

  .nav-link:hover {
    background-color: rgba(66, 185, 131, 0.15);
  }

  .dropdown-menu.active {
    display: block;
    padding: 8px;
    border-radius: 8px;
  }

  .dropdown-link {
    display: block;
    font-size: 0.95rem;
    padding: 10px 12px;
    border-radius: 8px;
  }

  .menu-toggle.active .bar:nth-child(1) {
    transform: translateY(8px) rotate(45deg);
  }

  .menu-toggle.active .bar:nth-child(2) {
    opacity: 0;
  }

  .menu-toggle.active .bar:nth-child(3) {
    transform: translateY(-8px) rotate(-45deg);
  }
}
</style>