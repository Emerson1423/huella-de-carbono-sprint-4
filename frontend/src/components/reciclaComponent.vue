<template>
  <div class="game-container">
    <h1>Recicla Rápido</h1>
    <p class="nombre-game">¿Y esto a dónde va?</p>

    <!-- Pantalla inicial -->
    <div v-if="!juegoActivo" class="initial-screen">
      <div class="welcome-section">
        <div class="initial-actions">
          <button class="btn-start-main" @click="mostrarModalInfo = true">
            Comenzar Juego
          </button>
        </div>
      </div>
      <!-- Tabla de líderes -->
      <div class="leaderboard-section-initial">
        <LeaderboardGame1 :scores="leaderboard" :showAciertos="true"></LeaderboardGame1>
      </div>
    </div>

    <!-- Juego principal -->
    <div v-else-if="!juegoTerminado && !juegoCompletado" class="game-main">
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

    <!-- Modal de Guía -->
    <div v-if="mostrarModalInfo" class="modal-overlay">
      <div class="modal-content">
        <button class="modal-close-btn" @click="mostrarModalInfo = false">×</button>
        <h2>Guía de Reciclaje</h2>
        <p class="guide-subtitle">Es importante aprender antes de jugar</p>
        
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

        <div class="modal-actions">
          <button class="start-game-btn" @click="empezarJuego">
            ¡Entendido, Empezar a Jugar!
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de juego Terminado (por agotar intentos) -->
    <div v-if="juegoTerminado" class="modal-overlay">
      <div class="modal-content">
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
        
        <div class="modal-actions">
          <button class="btn-primary" @click="volverAlInicio">
            Volver al Inicio
          </button>
          <button class="btn-warning" @click="reintentarJuego">
            Reintentar
          </button>
          <button class="btn-info" @click="mostrarLeaderboard = true">
            Ver posiciones
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de Juego Completado (todos los residuos reciclados) -->
    <div v-if="juegoCompletado && !juegoTerminado" class="modal-overlay">
      <div class="modal-content">
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
        
        <div class="modal-actions">
          <button class="btn-primary" @click="volverAlInicio">
            Volver al Inicio
          </button>
          <button class="btn-warning" @click="reintentarJuego">
            Jugar Otra Vez
          </button>
          <button class="btn-info" @click="mostrarLeaderboard = true">
            Ver posiciones
          </button>
        </div>
      </div>
    </div>

    <!-- Modal del Leaderboard -->
    <div v-if="mostrarLeaderboard" class="modal-overlay">
      <div class="modal-content leaderboard-modal">
        <button class="modal-close-btn" @click="mostrarLeaderboard = false">×</button>
        <h2>Tabla de Posiciones</h2>
        <div class="leaderboard-container">
          <LeaderboardGame1 :scores="leaderboard" :showAciertos="true" />
        </div>
        <div class="modal-actions">
          <button class="btn-primary" @click="mostrarLeaderboard = false">
            Cerrar
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
      juegoActivo: false, 
      currentIndex: 0,
      mensaje: '',
      mostrarModalInfo: false, 
      mostrarLeaderboard: false, 
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
    
    // Vuelve a la pantalla inicial
    volverAlInicio() {
      this.juegoActivo = false;
      this.juegoTerminado = false;
      this.juegoCompletado = false;
      this.mostrarLeaderboard = false;
      this.detenerTemporizador();
      this.cargarLeaderboard();
    },

    // Reintenta juego
    reintentarJuego() {
      this.reiniciarJuego();
      this.mostrarModalInfo = true;
    },

    empezarJuego() {
      this.verificarAutenticacion();
      this.mostrarModalInfo = false;
      this.juegoActivo = true;
      this.iniciarTemporizador();
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
      }
    },

    terminarJuego() {
      this.detenerTemporizador();
      this.juegoTerminado = true;
      this.puntuacionGuardada = false;
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
    this.cargarLeaderboard();
  }
}
</script>

<style scoped>

.modal-close-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #7f8c8d;
  transition: color 0.2s;
}
.modal-close-btn:hover{
  color: #e74c3c;

}
.leaderboard-modal {
  max-width: 600px;
}

.leaderboard-container {
  margin: 20px 0;
  max-height: 400px;
  overflow-y: auto;
}

.modal-content {
  position: relative;
  padding: 2rem;
}

.modal-content h2 {
  padding-right: 40px; 
}

.game-container {
  max-width: 95%;
  margin: 100px auto 20px;
  padding: 15px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
  font-family: 'Poppins', sans-serif;
  text-align: center;
}

h1 {
  color: #2E7D32;
  margin-bottom: 10px;
  font-size: 45px;
  font-family: 'Poppins', sans-serif;
}
.nombre-game{
  font-size: 28px;
  
}

.initial-screen {
  padding: 20px 0;
}

.welcome-section {
  margin-bottom: 30px;
}

.welcome-section h2 {
  color: #2E7D32;
  margin-bottom: 10px;
}

.welcome-section p {
  color: #666;
  margin-bottom: 25px;
  font-size: 1.1rem;
}

.initial-actions {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin: 25px 0;
}

.btn-start-main {
  background: #4CAF50;
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1.1rem;
  transition: background-color 0.3s;
}

.btn-start-main:hover {
  background: #45a049;
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

.guide-subtitle {
  color: #666;
  text-align: center;
  margin-bottom: 20px;
  font-style: italic;
}

/* Info Section Responsive */
.info-section h3 {
  margin: 15px 0;
  text-align: center;
}

.info-section {
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
.btn-warning, .btn-secondary, .btn-primary, .btn-info,.start-game-btn {
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

/* Responsive Design */
@media (max-width: 768px) {
  .initial-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .btn-start-main {
    width: 100%;
    max-width: 250px;
  }
  
  .color-guide {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .botes {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 480px) {
  .color-guide {
    grid-template-columns: 1fr;
  }
  
  .botes {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .modal-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .modal-actions button {
    width: 100%;
    max-width: 250px;
  }
}
</style>