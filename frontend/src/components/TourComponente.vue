<template>
  <div class="tour-floating">
    <transition name="fade-slide">
      <div class="actions-menu" v-if="expanded">
        <button class="action-item manual" @click="goManual">
          <img :src="require('@/assets/icons/manual.png')" alt="Manual" class="action-icon" />
          <span class="action-text">Manual</span>
        </button>
        <button v-if="isUserAuthenticated" class="action-item faq" @click="goFaq">
          <img :src="require('@/assets/icons/pregunta.png')" alt="pregunta" class="action-icon" />
          <span class="action-text">FAQs</span>
        </button>
      </div>
    </transition>

    <button 
      class="floating-btn" 
      @click="toggle" 
      :class="{ active: expanded }"
      :aria-expanded="expanded"
      :aria-label="expanded ? 'Cerrar ayuda' : 'Abrir ayuda'"
    >
      <span class="btn-icon" v-if="!expanded">?</span>
      <span class="btn-icon-close" v-else>✕</span>
    </button>
  </div>
</template>

<script>
export default {
  name: 'TourComponente',
  props: {
    isAuthenticated: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      expanded: false
    };
  },
  computed: {
    isUserAuthenticated() {
      try {
        return this.isAuthenticated || (!!localStorage.getItem('token') && !!localStorage.getItem('usuario'));
      } catch (e) {
        return this.isAuthenticated;
      }
    }
  },
  methods: {
    toggle() {
      this.expanded = !this.expanded;
    },
    goManual() {
      this.expanded = false;
      this.$router.push('/manualComponente');
    },
    goFaq() {
      this.expanded = false;
      this.$router.push('/soporte');
    }
  }
};
</script>

<style scoped>
.tour-floating {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 2000;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 16px;
}

/* Menú de acciones */
.actions-menu {
  background: #ffffff;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 200px;
}

.action-item {
  background: transparent;
  border: none;
  color: #fff;
  padding: 14px 16px;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 15px;
  font-weight: 500;
  letter-spacing: 0.3px;
  text-transform: uppercase;
  transition: all 0.2s ease;
  text-align: left;
}

.action-item:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateX(-4px);
}

.action-item:active {
  transform: translateX(-2px);
}

.action-icon {
  font-size: 20px;
  width: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-text {
  flex: 1;
  color: #0b6d11;
}

/* Botón flotante principal */
.floating-btn {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, #0b6d11 0%, #094d0c 100%);
  color: #fff;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(11, 109, 17, 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.floating-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, transparent 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.floating-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 12px 32px rgba(11, 109, 17, 0.4);
}

.floating-btn:hover::before {
  opacity: 1;
}

.floating-btn:active {
  transform: scale(0.95);
}

.floating-btn.active {
  background: linear-gradient(135deg, #0b6d11 0%, #094d0c 100%);
  box-shadow: 0 12px 32px rgba(64, 233, 30, 0.4);
}

.floating-btn.active .btn-icon {
  transform: rotate(45deg);
}

.btn-icon,
.btn-icon-close {
  font-size: 28px;
  font-weight: 700;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  line-height: 1;
}

.btn-icon-close {
  font-size: 32px;
  animation: rotateIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes rotateIn {
  from {
    transform: rotate(-90deg) scale(0.5);
    opacity: 0;
  }
  to {
    transform: rotate(0deg) scale(1);
    opacity: 1;
  }
}

/* Animaciones */
.fade-slide-enter-active {
  animation: fadeSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-slide-leave-active {
  animation: fadeSlideOut 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes fadeSlideIn {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes fadeSlideOut {
  from {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateY(10px) scale(0.95);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .tour-floating {
    right: 16px;
    bottom: 16px;
  }

  .floating-btn {
    width: 56px;
    height: 56px;
  }

  .btn-icon,
  .btn-icon-close {
    font-size: 24px;
  }

  .actions-menu {
    min-width: 180px;
    padding: 12px;
  }

  .action-item {
    padding: 12px 14px;
    font-size: 14px;
  }
}
</style>