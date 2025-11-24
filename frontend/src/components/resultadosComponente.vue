<template>
  <div class="historial">
    <h1 class="titulo">Tu Huella Ecológica de este mes </h1>

     <!-- Resultado calculado -->
    <div class="resultado" v-if="resultado">
      <h2>📊 Resultado:</h2>
      <!-- ✅ CORREGIDO: Mostrar kgCO2 o puntuacionTotal -->
      <p><strong>Total de emisiones:</strong> {{ resultado.kgCO2 || resultado.puntuacionTotal || 0 }} kg CO₂</p>
      
      <!-- Representación visual de la huella -->
      <div class="huella-visual">
        <h3>Tu huella es:</h3>
        <div :class="['categoria-huella', resultado.categoria.toLowerCase()]">
          {{ resultado.categoria }}
          <span v-if="resultado.categoria === 'Baja'">🌱</span>
          <span v-else-if="resultado.categoria === 'Media'">⚠️</span>
          <span v-else>🔥</span>
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
      <h2>📝 Tus datos:</h2>
      <p><strong>Kilómetros/mes:</strong> {{ datosOriginales.kilometros }} km</p>
      <p><strong>Transporte:</strong> {{ formatTransporte(datosOriginales.transporte) }}</p>
      <p><strong>Consumo eléctrico:</strong> {{ datosOriginales.electricidad }} kWh</p>
      <p><strong>Energía renovable:</strong> {{ datosOriginales.energiaRenovable === 'si' ? 'Sí ♻️' : 'No ⚠️' }}</p>
      <p><strong>Reciclaje:</strong> {{ formatReciclaje(datosOriginales.reciclaje) }}</p>
    </div>

   
    <button @click="guardarEnHistorial" class="guardar-btn" :disabled="guardando">
      {{ guardando ? '⏳ Guardando...' : '💾 Guardar en historial' }}
    </button>
    <button @click="volverAFormulario" class="volver-btn">✏️ Volver al formulario</button>

   
  </div>
   <h1 class="actividades">¡Realiza distintas actividades para mejorar tu huella de carbono!</h1>

    <div class="cards">
      <ViewCard title="Hábitos" link="/" icon="habitos.png" />
      <ViewCard title="Eventos" link="/" icon="Eventos.png" />
      <ViewCard title="Noticias" link="/" icon="Noticias.png" />
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
      // ✅ Usar kgCO2 que es el valor correcto
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
        
        // ✅ Normalizar el resultado para asegurar puntuacionTotal
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
        coche: 'Coche 🚗',
        moto: 'Moto 🏍️',
        autobus: 'Autobús 🚌',
        bicicleta: 'Bicicleta 🚲',
        "a pie": 'A pie 🚶'
      };
      return nombres[transporte] || transporte;
    },
    
    formatReciclaje(reciclaje) {
      if (!reciclaje || reciclaje === 'no_reciclo') return 'No recicla ❌';
      if (typeof reciclaje === 'string') return `${reciclaje} ${this.getReciclajeIcon(reciclaje)}`;
      if (Array.isArray(reciclaje)) {
        if (reciclaje.length === 0 || reciclaje.includes('no_reciclo')) return 'No recicla ❌';
        return reciclaje.map(item => `${item} ${this.getReciclajeIcon(item)}`).join(', ');
      }
      return 'No recicla ❌';
    },
    
    getReciclajeIcon(item) {
      const iconos = { 
        papel: '📄', 
        plastico: '🥤', 
        vidrio: '🍷', 
        carton: '📦',
        no_reciclo: '❌'
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
          alert(`⚠️ ${data.mensaje}\n\nPuedes ver tu historial, pero no guardar un nuevo cálculo este mes.`);
          this.$router.push('/historial');
          return;
        }

        if (!response.ok) {
          throw new Error(data.error || 'Error al guardar');
        }

        alert('✅ ¡Datos guardados correctamente!');
        this.$router.push('/historial');

      } catch (error) {
        console.error('Error al guardar:', error);
        
        if (error.message.includes('Ya realizaste')) {
          alert(`📅 ${error.message}\n\nPodrás hacer otro cálculo el próximo mes.`);
        } else {
          alert(`❌ Error: ${error.message}\nVerifica que todos los campos sean válidos`);
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

<style>

.historial {
  max-width: 500px;
  margin: 40px auto;
  background: #f8fafc;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  padding: 32px 24px;
  font-family: 'Poppins',  sans-serif;
}

.titulo{
  text-align: center;
  color: #2e7d32;
  margin-bottom: 24px;
}

.actividades {
  text-align: center;
  margin-bottom: 24px;
  font-family: 'Poppins', sans-serif;

}

.cards {
  display: grid;
  grid-template-columns: repeat(3, 300px);
  gap: 32px;
  margin-top: 32px;
  width: 100%;
  justify-content: center;
}

.datos-formulario, .resultado {
  background: #fff;
  border-radius: 10px;
  padding: 18px 16px;
  margin-bottom: 22px;
  box-shadow: 0 1px 4px rgba(44,62,80,0.06);
}

.datos-formulario h2,
.resultado h2 {
  color: #1565c0;
  margin-bottom: 12px;
  font-size: 1.15rem;
}

.datos-formulario p,
.resultado p {
  margin: 6px 0;
  font-size: 1rem;
}

.huella-visual {
  margin-top: 18px;
  text-align: center;
}

.categoria-huella {
  font-size: 1.3rem;
  font-weight: bold;
  display: inline-block;
  padding: 6px 18px;
  border-radius: 20px;
  margin-bottom: 10px;
  margin-top: 6px;
}

.categoria-huella.baja {
  background: #e8f5e9;
  color: #388e3c;
  border: 1px solid #81c784;
}

.categoria-huella.media {
  background: #fffde7;
  color: #fbc02d;
  border: 1px solid #ffe082;
}

.categoria-huella.alta {
  background: #ffebee;
  color: #d32f2f;
  border: 1px solid #ef9a9a;
}

.barra-huella {
  width: 100%;
  height: 18px;
  background: #e0e0e0;
  border-radius: 10px;
  margin: 12px 0 6px 0;
  overflow: hidden;
  box-shadow: 0 1px 2px rgba(0,0,0,0.04);
}

.progreso {
  height: 100%;
  border-radius: 10px;
  transition: width 0.7s cubic-bezier(.4,2,.6,1);
}

.progreso.baja {
  background: linear-gradient(90deg, #81c784 60%, #43a047 100%);
}

.progreso.media {
  background: linear-gradient(90deg, #ffe082 60%, #fbc02d 100%);
}

.progreso.alta {
  background: linear-gradient(90deg, #ef9a9a 60%, #d32f2f 100%);
}

small {
  color: #888;
  font-size: 0.95em;
}

.guardar-btn, .volver-btn {
  display: inline-block;
  margin: 10px 8px 0 0;
  padding: 10px 22px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s;
}

.guardar-btn {
  background: #1976d2;
  color: #fff;
}

.guardar-btn:hover:not(:disabled) {
  background: #1565c0;
}

.guardar-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.volver-btn {
  background: #e0e0e0;
  color: #333;
}

.volver-btn:hover {
  background: #bdbdbd;
}
</style>