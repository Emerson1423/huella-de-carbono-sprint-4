<template>
  <div class="historial">
    <h1 class="titulo">Tu Huella Ecológica de este mes </h1>

     <!-- Resultado calculado -->
    <div class="resultado" v-if="resultado">
      <h2>Resultado:</h2>
      <!-- CORREGIDO: Mostrar kgCO2 o puntuacionTotal -->
      <p><strong>Total de emisiones:</strong> {{ resultado.kgCO2 || resultado.puntuacionTotal || 0 }} kg CO₂</p>
      
      <!-- Representación visual de la huella -->
      <div class="huella-visual">
        <h3>Tu huella es:</h3>
        <div :class="['categoria-huella', resultado.categoria.toLowerCase()]">
          {{ resultado.categoria }}
          <span v-if="resultado.categoria === 'Baja'"></span>
          <span v-else-if="resultado.categoria === 'Media'"></span>
          <span v-else></span>
        </div>
        
        <!-- Barra de progreso visual -->
        <div class="barra-huella">
          <div 
            :style="{ width: porcentajeHuella + '%' }"
            :class="['progreso', resultado.categoria.toLowerCase()]"
          ></div>
        </div>
        <small>{{ porcentajeHuella }}% del máximo estimado</small>
      </div>
    </div>


    <!-- Datos originales del formulario -->
    <div class="datos-formulario" v-if="datosOriginales">
      <h2>Tus datos:</h2>
      <p><strong>Kilómetros/mes:</strong> {{ datosOriginales.kilometros }} km</p>
      <p><strong>Transporte:</strong> {{ formatTransporte(datosOriginales.transporte) }}</p>
      <p><strong>Consumo eléctrico:</strong> {{ datosOriginales.electricidad }} kWh</p>
      <p><strong>Energía renovable:</strong> {{ datosOriginales.energiaRenovable === 'si' ? 'Sí' : 'No' }}</p>
      <p><strong>Reciclaje:</strong> {{ formatReciclaje(datosOriginales.reciclaje) }}</p>
    </div>

   
    <div class="acciones">
      <button @click="guardarEnHistorial" class="guardar-btn" :disabled="guardando">
        {{ guardando ? 'Guardando...' : 'Guardar en historial' }}
      </button>
      <button @click="volverAFormulario" class="volver-btn">Volver al formulario</button>
    </div>

   
  </div>
   <h1 class="actividades">¡Realiza distintas actividades para mejorar tu huella de carbono!</h1>

    <div class="cards">
      <ViewCard title="Hábitos" link="/habitos" icon="habitos.png" />
      <ViewCard title="Eventos" link="/eventos" icon="Eventos.png" />
      <ViewCard title="Noticias" link="/noticias" icon="Noticias.png" />
    </div>
</template>

<script>
import ViewCard from '@/components/viewCardComponent.vue';

export default {
  components: {
    ViewCard
  },
  data() {
    return {
      resultado: null,
      datosOriginales: null,
      maxPuntuacion: 150,
      guardando: false
    };
  },
  computed: {
    porcentajeHuella() {
      if (!this.resultado) return 0;
      // Usar kgCO2 que es el valor correcto
      const emisiones = this.resultado.kgCO2 || this.resultado.puntuacionTotal || 0;
      return Math.min(Math.round((emisiones / this.maxPuntuacion) * 100), 100);
    },
    datosValidos() {
      return this.resultado && this.datosOriginales && 
             this.datosOriginales.kilometros !== undefined &&
             (this.resultado.kgCO2 !== undefined || this.resultado.puntuacionTotal !== undefined);
    }
  },
  created() {
    if (this.$route.query.resultado) {
      try {
        this.resultado = JSON.parse(decodeURIComponent(this.$route.query.resultado));
        this.datosOriginales = JSON.parse(decodeURIComponent(this.$route.query.datosOriginales));
        
        // Normalizar el resultado para asegurar puntuacionTotal
        if (this.resultado && !this.resultado.puntuacionTotal && this.resultado.kgCO2) {
          this.resultado.puntuacionTotal = this.resultado.kgCO2;
        }
        
      } catch (e) {
        console.error("Error parsing URL data:", e);
        this.$router.push('/');
      }
    }
  },
  methods: {
    formatTransporte(transporte) {
      const nombres = {
        coche: 'Coche',
        moto: 'Moto',
        autobus: 'Autobús',
        bicicleta: 'Bicicleta',
        "a pie": 'A pie'
      };
      return nombres[transporte] || transporte;
    },
    
    formatReciclaje(reciclaje) {
      if (!reciclaje || reciclaje === 'no_reciclo') return 'No recicla';
      if (typeof reciclaje === 'string') return `${reciclaje} ${this.getReciclajeIcon(reciclaje)}`;
      if (Array.isArray(reciclaje)) {
        if (reciclaje.length === 0 || reciclaje.includes('no_reciclo')) return 'No recicla';
        return reciclaje.map(item => `${item} ${this.getReciclajeIcon(item)}`).join(', ');
      }
      return 'No recicla';
    },
    
    getReciclajeIcon(item) {
      const iconos = { 
        papel: '', 
        plastico: '', 
        vidrio: '', 
        carton: '',
        no_reciclo: ''
      };
      return iconos[item] || '';
    },

    async guardarEnHistorial() {
      if (this.guardando) return;
      this.guardando = true;

      try {
        const token = localStorage.getItem('token');
        if (!token) {
          alert('Debes iniciar sesión para guardar tus resultados');
          this.$router.push('/login');
          return;
        }

        if (!this.datosValidos) {
          alert('Datos incompletos para guardar');
          return;
        }

        // ✅ Usar kgCO2 o puntuacionTotal (el que exista)
        const totalEmisiones = this.resultado.kgCO2 || this.resultado.puntuacionTotal;

        const payload = {
          kilometros: this.datosOriginales.kilometros,
          transporte: this.datosOriginales.transporte,
          electricidad: Number.parseFloat(this.datosOriginales.electricidad),
          energiaRenovable: this.datosOriginales.energiaRenovable,
          reciclaje: Array.isArray(this.datosOriginales.reciclaje) 
            ? this.datosOriginales.reciclaje 
            : [this.datosOriginales.reciclaje],
          total_emisiones: totalEmisiones
        };

        const response = await fetch('http://localhost:3000/api/guardar', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });

        const data = await response.json();
        
        if (response.status === 409) {
          alert(`${data.mensaje}\n\nPuedes ver tu historial, pero no guardar un nuevo cálculo este mes.`);
          this.$router.push('/historial');
          return;
        }

        if (!response.ok) {
          throw new Error(data.error || 'Error al guardar');
        }

        alert('¡Datos guardados correctamente!');
        this.$router.push('/historial');

      } catch (error) {
        console.error('Error al guardar:', error);
        
        if (error.message.includes('Ya realizaste')) {
          alert(` ${error.message}\n\nPodrás hacer otro cálculo el próximo mes.`);
        } else {
          alert(` Error: ${error.message}\nVerifica que todos los campos sean válidos`);
        }
      } finally {
        this.guardando = false;
      }
    },

    volverAFormulario() {
      this.$router.push('/huella');
    }
  }
};
</script>
<style scoped>
/* Contenedor principal */
.historial {
  max-width: 650px;
  margin: 60px auto 40px;
  background: linear-gradient(145deg, #ffffff, #f8fff9);
  border-radius: 24px;
  box-shadow: 0 10px 40px rgba(11, 109, 17, 0.12);
  padding: 48px 40px;
  font-family: 'Poppins', sans-serif;
  border: 1px solid rgba(76, 175, 80, 0.1);
  animation: fadeInUp 0.6s ease;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Título principal */
.titulo {
  text-align: center;
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(135deg, #0b6d11 0%, #4CAF50 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 36px;
  letter-spacing: -0.5px;
  animation: slideDown 0.5s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Título de actividades */
.actividades {
  text-align: center;
  margin: 60px auto 40px;
  font-family: 'Poppins', sans-serif;
  font-size: 1.8rem;
  font-weight: 700;
  color: #2d5016;
  max-width: 800px;
  padding: 0 20px;
  animation: fadeIn 0.8s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Grid de tarjetas */
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 28px;
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 20px 60px;
  animation: fadeIn 1s ease;
}

@media (min-width: 800px) {
  .cards {
    grid-template-columns: repeat(3, 1fr);
    gap: 36px;
    max-width: 1100px;
  }
}

@media (max-width: 420px) {
  .cards {
    grid-template-columns: 1fr;
    gap: 20px;
  }
}

/* Tarjetas de resultado y datos */
.datos-formulario, .resultado {
  background: white;
  border-radius: 16px;
  padding: 28px 24px;
  margin-bottom: 28px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(76, 175, 80, 0.08);
  transition: all 0.3s ease;
  animation: slideIn 0.5s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.datos-formulario:hover, .resultado:hover {
  box-shadow: 0 6px 24px rgba(76, 175, 80, 0.15);
  transform: translateY(-2px);
}

.datos-formulario h2,
.resultado h2 {
  color: #0b6d11;
  margin-bottom: 20px;
  font-size: 1.4rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 10px;
}

.datos-formulario h2::before,
.resultado h2::before {
  color: #4CAF50;
  font-size: 0.7em;
}

.datos-formulario p,
.resultado p {
  margin: 14px 0;
  font-size: 1.05rem;
  color: #495057;
  line-height: 1.6;
  padding-left: 8px;
}

.datos-formulario p strong,
.resultado p strong {
  color: #2d5016;
  font-weight: 600;
}

/* Visualización de la huella */
.huella-visual {
  margin-top: 28px;
  text-align: center;
  padding: 24px;
  background: linear-gradient(145deg, #f8fff9, #ffffff);
  border-radius: 16px;
  border: 2px solid rgba(76, 175, 80, 0.1);
}

.huella-visual h3 {
  font-size: 1.2rem;
  color: #2d5016;
  margin-bottom: 16px;
  font-weight: 600;
}

/* Categoría de huella */
.categoria-huella {
  font-size: 1.6rem;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 14px 32px;
  border-radius: 50px;
  margin: 16px 0;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  animation: scaleIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.categoria-huella:hover {
  transform: scale(1.05);
}

.categoria-huella.baja {
  background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
  color: #2e7d32;
  border: 2px solid #81c784;
  box-shadow: 0 4px 16px rgba(76, 175, 80, 0.3);
}

.categoria-huella.media {
  background: linear-gradient(135deg, #fff9c4 0%, #fff59d 100%);
  color: #f57f17;
  border: 2px solid #ffd54f;
  box-shadow: 0 4px 16px rgba(251, 192, 45, 0.3);
}

.categoria-huella.alta {
  background: linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%);
  color: #c62828;
  border: 2px solid #ef9a9a;
  box-shadow: 0 4px 16px rgba(211, 47, 47, 0.3);
}

/* Barra de progreso */
.barra-huella {
  width: 100%;
  height: 24px;
  background: #e0e0e0;
  border-radius: 50px;
  margin: 20px 0 12px 0;
  overflow: hidden;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
}

.barra-huella::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.3), transparent);
  border-radius: 50px;
}

.progreso {
  height: 100%;
  border-radius: 50px;
  transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.progreso::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.4), transparent);
  border-radius: 50px;
}

.progreso.baja {
  background: linear-gradient(90deg, #66bb6a 0%, #43a047 50%, #2e7d32 100%);
  animation: fillBar 1s ease;
}

.progreso.media {
  background: linear-gradient(90deg, #ffeb3b 0%, #fbc02d 50%, #f57f17 100%);
  animation: fillBar 1s ease;
}

.progreso.alta {
  background: linear-gradient(90deg, #ef5350 0%, #e53935 50%, #c62828 100%);
  animation: fillBar 1s ease;
}

@keyframes fillBar {
  from {
    width: 0 !important;
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

small {
  color: #757575;
  font-size: 0.95em;
  font-weight: 500;
  display: block;
  margin-top: 8px;
}

/* Botones modernos */
.guardar-btn, .volver-btn {
  display: inline-block;
  margin: 0; /* spacing ahora controlado por el contenedor .acciones */
  padding: 16px 32px;
  border: none;
  border-radius: 50px;
  font-size: 1.05rem;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: 'Poppins', sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.guardar-btn {
  background: linear-gradient(135deg, #4CAF50 0%, #0b6d11 100%);
  color: #fff;
}

.guardar-btn:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(76, 175, 80, 0.4);
  background: linear-gradient(135deg, #45a049 0%, #0a5d0f 100%);
}

.guardar-btn:active:not(:disabled) {
  transform: translateY(-1px);
}

.guardar-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.volver-btn {
  background: linear-gradient(145deg, #f5f5f5, #e0e0e0);
  color: #424242;
  border: 2px solid #e0e0e0;
}

.volver-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
  background: linear-gradient(145deg, #eeeeee, #bdbdbd);
  border-color: #bdbdbd;
}

.volver-btn:active {
  transform: translateY(-1px);
}

/* Responsivo */
@media (max-width: 768px) {
  .historial {
    margin: 40px 20px;
    padding: 36px 24px;
  }

  .titulo {
    font-size: 1.6rem;
  }

  .actividades {
    font-size: 1.5rem;
    margin: 40px auto 30px;
  }

  .categoria-huella {
    font-size: 1.3rem;
    padding: 12px 24px;
  }

  .guardar-btn, .volver-btn {
    width: 100%;
    margin: 12px 0;
  }
}

/* Contenedor para centrar acciones */
.acciones {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-top: 16px;
  flex-wrap: wrap;
}

@media (max-width: 420px) {
  .historial {
    padding: 28px 20px;
  }

  .datos-formulario, .resultado {
    padding: 20px 16px;
  }

  .huella-visual {
    padding: 20px 12px;
  }

  .titulo {
    font-size: 1.4rem;
  }

  .actividades {
    font-size: 1.3rem;
  }
}
</style>