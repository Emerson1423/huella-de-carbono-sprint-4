<template>
  <div class="game-container">
    <h1>Recicla Rápido</h1>
    <p>Recicla ¿Y esto dónde va?</p>

    <!-- Modal de Información al inicio -->
    <div v-if="mostrarModalInfo" class="modal-overlay" @click.self="cerrarModal">
      <div class="modal-content">
        <button class="modal-cerrar" @click="cerrarModal">×</button>
        <h2>Guía de Reciclaje</h2>
        
      <div class="info-section">
        <h3>Colores de los Contenedores</h3>
        <div class="color-guide">
          <div v-for="bote in botes" :key="bote.type" class="color-item">
            <img :src="bote.imagen" :alt="bote.nombre" class="color-sample">
            <div class="color-info">
              <strong>{{ bote.nombre }}</strong>
              <p>{{ bote.descripcion }}</p>
              <small><strong>Ejemplos:</strong> {{ bote.ejemplos }}</small>
            </div>
          </div>
        </div>
      </div>

        <button class="start-game-btn" @click="empezarJuego">
          Empezar a Jugar
        </button>
      </div>
    </div>

    <!-- Juego principal -->
    <div v-else-if="!juegoTerminado && !juegoCompletado">
      <div class="game-stats">
        <div class="stat">
          <span>Aciertos: {{ aciertos }}/{{ basuraItems.length }}</span>
        </div>
        <div class="stat">
          <span>Intentos restantes: {{ intentosRestantes }}</span>
        </div>
        <div class="stat timer">
          <span>Tiempo: {{ tiempoFormateado }}</span>
        </div>
      </div>
      
      <div class="botes">
        <div 
          v-for="bote in botes" 
          :key="bote.type"
          class="bote"
          :data-type="bote.type"
          @dragover.prevent
          @drop="manejarSuelta(bote.type)">
          <img :src="bote.imagen" :alt="bote.nombre">
        </div>
      </div>
      
      <div class="basura-container">
        <div class="current-item" :class="{ 'correct': feedback.correcto, 'wrong': feedback.incorrecto }">
          <img 
            v-if="itemActual"
            :src="itemActual.src"
            :id="itemActual.id"
            class="basura-item"
            draggable="true"
            :data-type="itemActual.type"
            @dragstart="inicioArrastre"
          >
        </div>
      </div>
      
      <div class="message-area">
        <p :class="messageClass">{{ mensaje }}</p>
      </div>
    </div>

    <!-- modal de juego Terminado (por agotar intentos) -->
    <div v-if="juegoTerminado" class="modal-overlay" @click.self="cerrarModal">
      <div class="modal-content">
        <button class="modal-cerrar" @click="cerrarModal">×</button>
        <h2>¡Se agotaron los intentos!</h2>
        
        <div class="result-stats">
          <div class="result-stat">
            <span>Aciertos: {{ aciertos }}/{{ basuraItems.length }}</span>
          </div>
          <div class="result-stat">
            <span>Tiempo: {{ tiempoFormateado }}</span>
          </div>
          <div class="result-stat">
            <span>Eficiencia: {{ eficiencia }}%</span>
          </div>
          <div class="result-stat">
            <span>Intentos usados: {{ 3 - intentosRestantes }}/3</span>
          </div>
        </div>

        <div class="result-message">
          <p v-if="eficiencia >= 80">¡Excelente! Sabes identificar los contenedores</p>
          <p v-else-if="eficiencia >= 60">¡Buen trabajo! Sigue practicando</p>
          <p v-else>¡Sigue aprendiendo! Repasa la guía</p>
        </div>

        <div class="score-actions">
          <button class="btn-save" @click="guardarPuntuacion" :disabled="puntuacionGuardada || !usuarioLogueado">
            {{ !usuarioLogueado ? 'Inicia sesión para guardar' : puntuacionGuardada ? 'Puntuación Guardada' : 'Guardar Puntuación' }}
          </button>

        </div>
        <!--componente de los lideres del juego-->
        <LeaderboardGame1 :scores="leaderboard" :showAciertos="true"></LeaderboardGame1>
        
        <div class="modal-actions">
          <button class="btn-primary" @click="reiniciarJuego">
            Jugar Otra Vez
          </button>
          <button class="btn-warning" @click="verGuia">
            Ver Guía
          </button>
          <button class="btn-secondary" @click="continuarIntentando" v-if="!puntuacionGuardada">
            Continuar Sin Guardar
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de Juego Completado (todos los residuos reciclados) -->
    <div v-if="juegoCompletado && !juegoTerminado" class="modal-overlay" @click.self="cerrarModal">
      <div class="modal-content">
        <button class="modal-cerrar" @click="cerrarModal">×</button>
        <h2>¡Juego Completado!</h2>
        
        <div class="result-stats">
          <div class="result-stat">
            <span>Aciertos: {{ aciertos }}/{{ basuraItems.length }}</span>
          </div>
          <div class="result-stat">
            <span>Tiempo: {{ tiempoFormateado }}</span>
          </div>
          <div class="result-stat">
            <span>Eficiencia: {{ eficiencia }}%</span>
          </div>
          <div class="result-stat">
            <span>Intentos usados: {{ 3 - intentosRestantes }}/3</span>
          </div>
        </div>

        <div class="result-message">
          <p v-if="eficiencia >= 80">¡Excelente! Sabes identificar los contenedores</p>
          <p v-else-if="eficiencia >= 60">¡Buen trabajo! Sigue practicando</p>
          <p v-else>¡Sigue aprendiendo! El reciclaje es importante</p>
        </div>

        <div class="score-actions">
          <button class="btn-save" @click="guardarPuntuacion" :disabled="puntuacionGuardada || !usuarioLogueado">
            {{ !usuarioLogueado ? 'Inicia sesión para guardar' : puntuacionGuardada ? 'Puntuación Guardada' : 'Guardar Puntuación' }}
          </button>
          <p v-if="!usuarioLogueado" class="login-warning">
            Debes iniciar sesión para guardar tu puntuación
          </p>
        </div>

        <LeaderboardGame1 :scores="leaderboard" :showAciertos="true"></LeaderboardGame1>
        
        <div class="modal-actions">
          <button class="btn-primary" @click="reiniciarJuego">
            Jugar Otra Vez
          </button>
          <button class="btn-warning" @click="verGuia">
            Ver Guía
          </button>
          <button class="btn-secondary" @click="continuarSinGuardar" v-if="!puntuacionGuardada">
            Continuar Sin Guardar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LeaderboardGame1 from '@/components/leaderboard-Game1.vue';
// Importar las imágenes
import bananoImg from '@/assets/img/BAN.png'
import cartonImg from '@/assets/img/CARTON.png'
import botellaImg from '@/assets/img/BOTELLA.png'
import cervezaImg from '@/assets/img/CERVE.png'
import jeringaImg from '@/assets/img/jeringa.png'
import churrosImg from '@/assets/img/churros.png'
import organicoImg from '@/assets/img/boteNaranja.png'
import papelImg from '@/assets/img/boteAzul.png'
import plasticoImg from '@/assets/img/boteAmarillo.png'
import vidrioImg from '@/assets/img/boteVerde.png'
import toxicoImg from '@/assets/img/boteRojo.png'
import comunImg from '@/assets/img/boteNegro.png'

import axios from 'axios'

export default {
  name: 'JuegoReciclaje',
  components: {
    LeaderboardGame1
  },
  data() {
    return {
      currentIndex: 0,
      mensaje: '',
      mostrarModalInfo: true,
      juegoCompletado: false,
      juegoTerminado: false,
      puntuacionGuardada: false,
      aciertos: 0,
      intentosRestantes: 3,
      tiempoTranscurrido: 0,
      temporizador: null,
      leaderboard: [],
      usuarioLogueado: false,
      usuarioActual: null,
   
      feedback: {
        correcto: false,
        incorrecto: false
      },
      basuraItems: [
        { id: "banano", src: bananoImg, type: "organic", name: "Cáscara de Banano" },
        { id: "carton", src: cartonImg, type: "paper", name: "Caja de Cartón" },
        { id: "botella", src: botellaImg, type: "plastic", name: "Botella Plástica" },
        { id: "cerveza", src: cervezaImg, type: "glass", name: "Botella de Vidrio" },
        { id: "jeringa", src: jeringaImg, type: "toxic", name: "Jeringa Médica"},
        { id: "churros", src: churrosImg, type: "common", name: "Bolsitas de churros"}
      ],
      botes: [
        { 
          type: "organic", 
          nombre: "Orgánico", 
          imagen: organicoImg,
          color: "#ED9F18",
          descripcion: "Restos de comida y desechos naturales",
          ejemplos: "cáscaras de frutas, restos de verduras, café, hojas"
        },
        { 
          type: "paper", 
          nombre: "Papel", 
          imagen: papelImg,
          color: "#2196F3", 
          descripcion: "Papel, cartón y derivados",
          ejemplos: "periódicos, revistas, cajas, folletos"
        },
        { 
          type: "plastic", 
          nombre: "Plástico", 
          imagen: plasticoImg,
          color: "#FCFF00",
          descripcion: "Envases plásticos y metálicos",
          ejemplos: "botellas, latas, bolsas, envases"
        },
        { 
          type: "glass", 
          nombre: "Vidrio", 
          imagen: vidrioImg,
          color: "#4CAF50",
          descripcion: "Vidrios",
          ejemplos: "Frascos, botellas, tarros de conservas"
        },
        { 
          type: "toxic", 
          nombre: "Toxico", 
          imagen: toxicoImg,
          color: "#FF0000",
          descripcion: "Residuos Peligrosos, biologico-infecciosos",
          ejemplos: "Pilas, mascarillas, jeringas, guantes, productos químicos "
        },
        { 
          type: "common", 
          nombre: "Común", 
          imagen: comunImg,
          color: "#000000",
          descripcion: "Residuos comunes, no reciclables",
          ejemplos: "Bolsitas de churros, papel de baño, cajas de cigarro, toallas "
        }
      ]
    }
  },
  computed: {
    itemActual() {
      return this.basuraItems[this.currentIndex];
    },
    eficiencia() {
      return Math.round((this.aciertos / this.basuraItems.length) * 100);
    },
    messageClass() {
      return {
        'correct': this.mensaje.includes('Correcto'),
        'wrong': this.mensaje.includes('Intenta')
      };
    },
    tiempoFormateado() {
      const minutos = Math.floor(this.tiempoTranscurrido / 60);
      const segundos = this.tiempoTranscurrido % 60;
      return `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
    }
  },
  methods: {
    verificarAutenticacion() {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      
      if (token && user) {
        this.usuarioLogueado = true;
        this.usuarioActual = JSON.parse(user);
      } else {
        this.usuarioLogueado = false;
        this.usuarioActual = null;
      }
    },
    
    cerrarModal() {
      if (this.mostrarModalInfo) {
        this.mostrarModalInfo = false;
        this.empezarJuego();
      } else if (this.juegoTerminado || this.juegoCompletado) {
        this.juegoTerminado = false;
        this.juegoCompletado = false;
      }
    },    

    empezarJuego() {
      this.verificarAutenticacion();
      this.mostrarModalInfo = false;
      this.iniciarTemporizador();
      this.cargarLeaderboard();
    },

    iniciarTemporizador() {
      this.tiempoTranscurrido = 0;
      this.temporizador = setInterval(() => {
        this.tiempoTranscurrido++;
      }, 1000);
    },

    detenerTemporizador() {
      if (this.temporizador) {
        clearInterval(this.temporizador);
        this.temporizador = null;
      }
    },

    inicioArrastre(event) {
      event.dataTransfer.setData("text", this.itemActual.type);
    },
    
    manejarSuelta(tipoBote) {
      const basuraType = event.dataTransfer.getData("text");
      
      if (basuraType === tipoBote) {
        this.mensaje = "¡Correcto! Bien reciclado";
        this.feedback.correcto = true;
        this.aciertos++;
        
        setTimeout(() => {
          this.feedback.correcto = false;
          this.siguienteItem();
        }, 1000);
      } else {
        this.intentosRestantes--;
        this.mensaje = `¡Intenta de nuevo! Intentos restantes: ${this.intentosRestantes}`;
        this.feedback.incorrecto = true;
        
        setTimeout(() => {
          this.feedback.incorrecto = false;
          
          if (this.intentosRestantes <= 0) {
            this.terminarJuego();
          }
        }, 1000);
      }
    },
    
    siguienteItem() {
      this.currentIndex++;
      this.mensaje = "";
      
      if (this.currentIndex >= this.basuraItems.length) {
        this.detenerTemporizador();
        this.juegoCompletado = true;
        this.puntuacionGuardada = false;
        this.cargarLeaderboard();
      }
    },

    terminarJuego() {
      this.detenerTemporizador();
      this.juegoTerminado = true;
      this.puntuacionGuardada = false;
      this.cargarLeaderboard();
    },

    continuarIntentando() {
      this.juegoTerminado = false;
      this.intentosRestantes = 3;
      this.iniciarTemporizador();
    },

    continuarSinGuardar() {
      this.juegoCompletado = false;
      this.juegoTerminado = false;
    },

    reiniciarJuego() {
      this.currentIndex = 0;
      this.mensaje = "";
      this.juegoCompletado = false;
      this.juegoTerminado = false;
      this.puntuacionGuardada = false;
      this.aciertos = 0;
      this.intentosRestantes = 3;
      this.feedback.correcto = false;
      this.feedback.incorrecto = false;
      this.basuraItems = [...this.basuraItems].sort(() => Math.random() - 0.5);
      this.detenerTemporizador();
      this.iniciarTemporizador();
    },

    verGuia() {
      this.currentIndex = 0;
      this.aciertos = 0;
      this.intentosRestantes = 3;
      this.tiempoTranscurrido = 0;
      this.mensaje = "";
      this.feedback.correcto = false;
      this.feedback.incorrecto = false;
      this.puntuacionGuardada = false;
      this.basuraItems = [...this.basuraItems].sort(() => Math.random() - 0.5);
      this.juegoTerminado = false;
      this.juegoCompletado = false;
      this.mostrarModalInfo = true;
      this.detenerTemporizador();
    }, 
   

    async guardarPuntuacion() {
      if (!this.usuarioLogueado) {
        alert('Por favor inicia sesión para guardar tu puntuación');
        return;
      }

      try {
        const token = localStorage.getItem('token');
        
        const puntuacionData = {
          usuario_id: this.usuarioActual.id,
          puntuacion: this.eficiencia,
          tiempo_segundos: this.tiempoTranscurrido,
          eficiencia: this.eficiencia,
          aciertos: this.aciertos,
          total_residuos: this.basuraItems.length
        };

        const response = await axios.post('http://localhost:3000/api/juego1/puntuacion', puntuacionData, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.data.success) {
          this.puntuacionGuardada = true;
          this.cargarLeaderboard();
          
          if (response.data.action === 'updated') {
            this.mensaje = '¡Puntuación actualizada correctamente!';
          } else {
            this.mensaje = '¡Puntuación guardada correctamente!';
          }
          
          setTimeout(() => {
            this.mensaje = '';
          }, 3000);
        }
      } catch (error) {
        console.error('Error guardando puntuación:', error);
        alert(`Error ${error.response?.status}: ${error.response?.data?.error || 'Error al guardar la puntuación'}`);
      }
    },

    async cargarLeaderboard() {
      try {
        const response = await axios.get('http://localhost:3000/api/juego1/leaderboard');
        this.leaderboard = response.data;
      } catch (error) {
        console.error('Error cargando leaderboard:', error);
      }
    }
  },
  mounted() {
    this.verificarAutenticacion();
    this.basuraItems = [...this.basuraItems].sort(() => Math.random() - 0.5);
  }
}
</script>

<style scoped>
.game-container {
  max-width: 95%;
  margin: 100px auto 20px;
  padding: 15px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
  text-align: center;
}

h1 {
  color: #2E7D32;
  margin-bottom: 10px;
  font-size: clamp(1.5rem, 4vw, 2.5rem);
}

/* Game Stats Responsive */
.game-stats {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin: 15px 0;
  flex-wrap: wrap;
}

.stat {
  background: #4CAF50;
  color: white;
  padding: 8px 15px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  flex: 1;
  min-width: 120px;
  max-width: 200px;
}

.stat.timer {
  background: #FF9800;
}

/* Botes Responsive */
.botes {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 10px;
  margin: 15px 0;
}

.bote {
  background: #f8f9fa;
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.bote img {
  width: 100%;
  max-width: 50px;
  height: auto;
  aspect-ratio: 3/4;
  object-fit: contain;
  margin-bottom: 5px;
}

/* Basura Container */
.basura-container {
  margin: 15px 0;
  padding: 0 10px;
}

.current-item {
  background: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 3px 10px rgba(0,0,0,0.1);
  display: inline-block;
  max-width: 100%;
}

.current-item.correct {
  border: 3px solid #4CAF50;
}

.current-item.wrong {
  border: 3px solid #F44336;
}

.basura-item {
  width: 70px;
  height: 70px;
  max-width: 100%;
  cursor: grab;
  object-fit: contain;
}

/* Message Area */
.message-area {
  margin: 10px 0;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 10px;
}

.message-area p {
  padding: 8px 15px;
  border-radius: 15px;
  font-weight: 600;
  font-size: 0.9rem;
  text-align: center;
  width: 100%;
}

.correct {
  background: #4CAF50;
  color: white;
}

.wrong {
  background: #F44336;
  color: white;
}

/* Modal Improvements */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 12px;
  max-width: 800px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  padding: 2rem;
  position: relative;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
}

.modal-cerrar {
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #7f8c8d;
}

/* Info Section Responsive */
.info-section h3 {
  margin: 15px 0;
  text-align: center;

}
.info-section  {
  margin: 15px 0;
  text-align: left;

}

.color-guide {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.color-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 6px;
  flex-direction: column;
}

.color-sample {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 4px;
}

.color-info {
  flex: 1;
}

.color-info strong {
  font-size: 0.9rem;
}

.color-info p,
.color-info small {
  font-size: 0.8rem;
  margin: 2px 0;
}

/* Buttons */
.btn-warning, .btn-secondary, .btn-primary, .start-game-btn {
  padding: 10px 20px;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 600;
  margin-top: 10px;
  border: none;
  font-size: 0.9rem;
  width: 100%;
  max-width: 200px;
}

.btn-warning {
  background: #FF9800;
  color: white;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-primary, .start-game-btn {
  background: #4CAF50;
  color: white;
}

.btn-save {
  background: #2196F3;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  width: 100%;
  max-width: 250px;
}

.btn-save:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

/* Modal Actions */
.modal-actions {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 15px;
  flex-wrap: wrap;
}

/* Resultados Stats */
.result-stats {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 15px 0;
}

.result-stat {
  background: #f8f9fa;
  padding: 12px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.9rem;
}

.result-message {
  background: #E8F5E8;
  padding: 12px;
  border-radius: 6px;
  margin: 12px 0;
  color: #2E7D32;
  font-weight: 500;
  font-size: 0.9rem;
}

.score-actions {
  margin: 15px 0;
}

.login-warning {
  color: #ff6b6b;
  font-size: 0.8rem;
  margin-top: 5px;
}



/* Tablets */
@media (max-width: 1024px) {
  .botes {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .color-guide {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Mobile Large */
@media (max-width: 768px) {
  .game-container {
    margin: 80px auto 15px;
    padding: 12px;
  }
  
  .botes {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }
  
  .bote {
    padding: 8px;
  }
  
  .bote img {
    max-width: 40px;
  }
  
  .game-stats {
    flex-direction: column;
    align-items: center;
  }
  
  .stat {
    width: 100%;
    max-width: 250px;
  }
  
  .modal-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .modal-actions button {
    width: 100%;
    max-width: 250px;
  }
  
  .color-item {
    flex-direction: row;
    align-items: center;
  }
  
  .basura-item {
    width: 60px;
    height: 60px;
  }
}

/* Mobile Small */
@media (max-width: 480px) {
  .game-container {
    margin: 70px auto 10px;
    padding: 10px;
    border-radius: 10px;
  }
  
  .botes {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .color-guide {
    grid-template-columns: 1fr;
  }
  
  .modal-content {
    padding: 1rem;
  }
  
  .color-item {
    flex-direction: row;
    align-items: center;
  }
  
  .color-sample {
    width: 35px;
    height: 35px;
  }
  
  .color-info strong {
    font-size: 0.85rem;
  }
  
  .color-info p,
  .color-info small {
    font-size: 0.75rem;
  }
  
  .basura-item {
    width: 50px;
    height: 50px;
  }
  
  .message-area {
    height: 35px;
  }
  
  .message-area p {
    font-size: 0.8rem;
    padding: 6px 12px;
  }
}

/* Very Small Screens */
@media (max-width: 360px) {
  .botes {
    grid-template-columns: 1fr;
  }
  
  .game-stats {
    gap: 5px;
  }
  
  .stat {
    padding: 6px 10px;
    font-size: 0.8rem;
  }
  
  .modal-actions button {
    padding: 8px 16px;
    font-size: 0.85rem;
  }
}

/* Landscape Mode for Mobile */
@media (max-height: 600px) and (orientation: landscape) {
  .game-container {
    margin: 60px auto 10px;
  }
  
  .botes {
    grid-template-columns: repeat(6, 1fr);
    gap: 5px;
  }
  
  .bote img {
    max-width: 35px;
  }
  
  .basura-item {
    width: 50px;
    height: 50px;
  }
  
  .modal-content {
    max-height: 85vh;
    padding: 1rem;
  }
}

/* High Resolution Screens */
@media (min-width: 1400px) {
  .game-container {
    max-width: 1200px;
  }
  
  .bote img {
    max-width: 70px;
  }
  
  .basura-item {
    width: 80px;
    height: 80px;
  }
}
</style>