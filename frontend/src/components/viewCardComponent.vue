<template>
  <div class="flip-card" @click="handleClick">
    <div class="flip-card-inner" :class="{ flipped: isFlipped }">
      <!-- Frente de la tarjeta -->
      <div class="flip-card-front">
        <div class="icon">
          <img :src="require(`@/assets/img/${icon}`)" :alt="title" />
        </div>
        <div class="title">{{ title }}</div>
      </div>
      
      <!-- Reverso de la tarjeta -->
      <div class="flip-card-back">
        <div class="back-content">
          <h3>{{ title }}</h3>
          <p>{{ backText }}</p>
          <button class="action-btn" @click.stop="navigateToLink">
            {{ actionText }}
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
    icon: String, // nombre del archivo PNG
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
  border-radius: 12px;
  cursor: pointer;
  height: 280px;
  perspective: 1000px;
  font-family: 'Poppins', sans-serif;
}

.flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.6s;
  transform-style: preserve-3d;
  border-radius: 12px;
}

.flip-card-inner.flipped {
  transform: rotateY(180deg);
}

.flip-card-front,
.flip-card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  box-sizing: border-box;
}

/* Frente de la tarjeta */
.flip-card-front {
  background: rgb(6, 156, 59);
  color: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  transition: all 0.3s ease;
}

.flip-card-front:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
}

.flip-card-front .icon img {
  width: 120px;
  height: 120px;
  margin-bottom: 16px;
  transition: transform 0.3s ease;
}

.flip-card-front:hover .icon img {
  transform: scale(1.1);
}

.flip-card-front .title {
  font-weight: 600;
  font-size: 1.3em;
  margin: 0;
}

/* Reverso de la tarjeta */
.flip-card-back {
  background: linear-gradient(135deg, #067c3b 0%, #04a34d 100%);
  color: white;
  transform: rotateY(180deg);
  box-shadow: 0 8px 32px rgba(0,0,0,0.15);
  padding: 25px;
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
  font-size: 1.4em;
  font-weight: 700;
  margin: 0 0 15px 0;
  color: #fff;
  text-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.back-content p {
  font-size: 0.95em;
  line-height: 1.5;
  margin: 0 0 20px 0;
  flex-grow: 1;
  display: flex;
  align-items: center;
  text-align: center;
}

.action-btn {
  background: rgba(255, 255, 255, 0.9);
  color: #067c3b;
  border: none;
  padding: 12px 24px;
  border-radius: 25px;
  font-weight: 600;
  font-size: 0.9em;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Poppins', sans-serif;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  width: 80%;
  max-width: 150px;
}

.action-btn:hover {
  background: white;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0,0,0,0.2);
}

/* Responsive */
@media (max-width: 768px) {
  .flip-card {
    height: 250px;
  }
  
  .flip-card-front .icon img {
    width: 100px;
    height: 100px;
  }
  
  .back-content h3 {
    font-size: 1.2em;
  }
  
  .back-content p {
    font-size: 0.9em;
  }
}

@media (max-width: 480px) {
  .flip-card {
    height: 220px;
  }
  
  .flip-card-front .icon img {
    width: 80px;
    height: 80px;
  }
  
  .back-content h3 {
    font-size: 1.1em;
  }
  
  .back-content p {
    font-size: 0.85em;
  }
  
  .action-btn {
    padding: 10px 20px;
    font-size: 0.85em;
  }
}
</style>