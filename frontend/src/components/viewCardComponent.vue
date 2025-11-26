<template>
  <div class="flip-card" @click="handleClick">
    <div class="flip-card-inner" :class="{ flipped: isFlipped }">
      <!-- Frente de la tarjeta -->
      <div class="flip-card-front">
        <div class="card-glow"></div>
        <div class="icon">
          <img :src="require(`@/assets/img/${icon}`)" :alt="title" />
        </div>
        <div class="title">{{ title }}</div>
        <div class="flip-hint">Click para más info</div>
      </div>
      
      <!-- Reverso de la tarjeta -->
      <div class="flip-card-back">
        <div class="back-content">
          <h3>{{ title }}</h3>
          <p>{{ backText }}</p>
          <button class="action-btn" @click.stop="navigateToLink">
            <span>{{ actionText }}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    link: String,
    icon: String,
    backText: {
      type: String,
      default: "Descubre más sobre esta sección y explora todo el contenido disponible."
    },
    actionText: {
      type: String,
      default: "Explorar"
    }
  },
  data() {
    return {
      isFlipped: false
    }
  },
  methods: {
    handleClick() {
      this.isFlipped = !this.isFlipped;
    },
    navigateToLink() {
      if (this.link) {
        this.$router.push(this.link);
      }
    }
  }
}
</script>

<style scoped>
.flip-card {
  background: transparent;
  border-radius: 20px;
  cursor: pointer;
  height: 240px;
  perspective: 1000px;
  /* hereda la tipografía global del sitio */
  position: relative;
  z-index: 1;
}

.flip-card-inner.flipped {
  transform: rotateY(180deg);
  z-index: 10;
}

/* no cambiamos z-index al hacer hover sobre el contenedor: evita reordenamientos visuales */
.flip-card:hover{
  z-index: 1;
}
.flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.7s cubic-bezier(0.4, 0.2, 0.2, 1);
  transform-style: preserve-3d;
  transform-origin: center center; /* asegurar que gire en su propio centro */
  will-change: transform; /* hint para evitar saltos */
  -webkit-transform: translateZ(0);
  transform: translateZ(0);
  border-radius: 20px;
}

.flip-card-inner.flipped {
  transform: rotateY(180deg);
}

.flip-card-front,
.flip-card-back {
  position: absolute;
  top: 0; left: 0; /* asegurar que las caras ocupan exactamente la misma caja */
  width: 100%;
  height: 100%;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px; /* mantener padding idéntico en frente y reverso para evitar cambios de layout al voltear */
  box-sizing: border-box;
}

/* Frente de la tarjeta - Diseño más premium */
.flip-card-front {
  background: linear-gradient(135deg, #ffffff 0%, #f8fdf9 100%);
  color: #0a3d1f;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04);
  border: 2px solid rgba(5, 150, 105, 0.1);
  position: relative;
  overflow: hidden;
  transition: all 0.4s ease;
}

.card-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(52, 211, 153, 0.1) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.4s ease;
}

.flip-card:hover .card-glow {
  opacity: 1;
}

.flip-card:hover .flip-card-front {
  box-shadow: 0 20px 60px rgba(5, 150, 105, 0.15), 0 4px 12px rgba(0, 0, 0, 0.08);
  border-color: rgba(5, 150, 105, 0.2);
}

.flip-card-front .icon {
  margin-bottom: 16px;
  position: relative;
  z-index: 1;
}

.flip-card-front .icon img {
  width: 90px;
  height: 90px;
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
}

.flip-card:hover .icon img {
  transform: scale(1.15) rotate(5deg);
}

.flip-card-front .title {
  font-weight: 700;
  font-size: 1.25rem;
  margin: 12px 0 8px 0;
  color: #059669;
  position: relative;
  z-index: 1;
  letter-spacing: -0.3px;
}

.flip-hint {
  font-size: 0.75rem;
  color: #6b7280;
  opacity: 0.6;
  margin-top: 8px;
  font-weight: 500;
  transition: opacity 0.3s ease;
}

.flip-card:hover .flip-hint {
  opacity: 1;
}

/* Reverso de la tarjeta - Diseño más moderno */
.flip-card-back {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  color: white;
  transform: rotateY(180deg);
  box-shadow: 0 20px 60px rgba(5, 150, 105, 0.3), 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.1);
  padding: 24px; /* igual que el frente */
  box-sizing: border-box;
}

.back-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  width: 100%;
}

.back-content h3 {
  font-weight: 800;
  font-size: 1.4rem;
  color: white;
  margin: 0 0 12px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  letter-spacing: -0.3px;
}

.back-content p {
  font-size: 0.95rem;
  line-height: 1.5;
  margin: 0 0 20px 0;
  flex: 1 1 auto;
  display: -webkit-box;
  line-clamp: 4;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-align: center;
  color: rgba(255, 255, 255, 0.95);
  font-weight: 400;
}

.action-btn {
  background: white;
  color: #059669;
  border: none;
  padding: 14px 28px;
  border-radius: 30px;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  /* hereda la tipografía global del sitio */
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  gap: 8px;
  letter-spacing: 0.3px;
}

.action-btn svg {
  transition: transform 0.3s ease;
}

.action-btn:hover {
  background: #f0fdf4;
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.action-btn:hover svg {
  transform: translateX(4px);
}

.action-btn:active {
  transform: translateY(-1px) scale(1.02);
}

/* Responsive */
@media (max-width: 768px) {
  .flip-card {
    height: 220px;
  }
  
  .flip-card-front .icon img {
    width: 80px;
    height: 80px;
  }

  .flip-card-front .title {
    font-size: 1.15rem;
  }
  
  .back-content h3 {
    font-size: 1.25rem;
  }
  
  .back-content p {
    font-size: 0.9rem;
  }

  .action-btn {
    padding: 12px 24px;
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .flip-card {
    /* Reducir un poco la altura para que dos filas quepan mejor en móviles de 2 columnas */
    height: 170px;
  }
  
  .flip-card-front .icon img {
    width: 60px;
    height: 60px;
  }

  .flip-card-front .title {
    font-size: 1.05rem;
  }
  
  .back-content h3 {
    font-size: 1.1rem;
    margin-bottom: 8px;
  }
  
  .back-content p {
    font-size: 0.82rem;
    line-clamp: 3;
    -webkit-line-clamp: 3;
  }
  
  .action-btn {
    padding: 8px 12px;
    font-size: 0.82rem;
    /* Botón más compacto y ancho para el espacio reducido en 2 columnas */
    width: 92%;
    display: block;
    margin: 6px auto 0 auto;
    box-sizing: border-box;
    border-radius: 20px;
  }

  .flip-hint {
    font-size: 0.7rem;
  }
}

@media (max-width: 359px) {
  .flip-card {
    /* Optimización extra para pantallas muy estrechas manteniendo 2 columnas */
    height: 160px;
  }
  
  .flip-card-front,
  .flip-card-back {
    padding: 20px;
  }

  .back-content {
    padding: 0;
    gap: 6px;
  }
  .action-btn {
    width: 94%;
    padding: 8px 12px;
    font-size: 0.78rem;
    border-radius: 16px;
  }
}
</style>