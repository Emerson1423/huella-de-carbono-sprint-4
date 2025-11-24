<template>
  <div class="container">
    <!-- Pantalla inicial -->
    <div v-if="!juegoActivo" class="initial-screen">
      <header>
        <h1>Quiz: Planta Virtual</h1>
        <p class="subtitle">Responde Verdadero o Falso para ayudar a tu planta a crecer</p>
      </header>
      
      <div class="welcome-section">
        <div class="initial-actions">
          <button class="btn-start-main" @click="empezarJuego">
            Comenzar Juego
          </button>
        </div>
      </div>
      
      <!-- líderes -->
      <LeaderboardGame2 :scores="leaderboard"></LeaderboardGame2>
    </div>

    <!-- Juego principal-->
    <div v-else>
      <header>
        <h1>Quiz: Planta Virtual</h1>
        <p class="subtitle">Responde Verdadero o Falso para ayudar a tu planta a crecer</p>
      </header>
      
      <div class="game-container">
        <div class="plant-status">
          <div class="plant-visual">
            <div class="plant" :class="plantState">
              <img :src="plantImage" :alt="plantName" class="plant-img">
            </div>
            <h2>{{ plantName }}</h2>
          </div>
          
          <div class="stats">
            <div class="stat health">
              <div class="stat-name">Salud</div>
              <div class="stat-value">{{ plant.health }}%</div>
              <div class="progress-bar">
                <div class="progress" :style="{ width: plant.health + '%' }"></div>
              </div>
            </div>
            
            <div class="stat growth">
              <div class="stat-name">Crecimiento</div>
              <div class="stat-value">{{ Math.min(plant.growth, 100) }}%</div>
              <div class="progress-bar">
                <div class="progress" :style="{ width: Math.min(plant.growth, 100) + '%' }"></div>
              </div>
            </div>
            
            <div class="stat score">
              <div class="stat-name">Puntuación</div>
              <div class="stat-value">{{ score }}/{{ questionsAnswered }}</div>
              <div class="progress-bar">
                <div class="progress" :style="{ width: scoreProgress + '%' }"></div>
              </div>
            </div>
            
            <div class="stat">
              <div class="stat-name">Racha</div>
              <div class="stat-value">
                {{ streak }} 
                <span v-if="streak >= 3" class="streak-fire"></span>
              </div>
            </div>
          </div>
          
          <div class="game-message" :class="messageType">
            {{ message }}
          </div>
        </div>
        
        <div v-if="!gameOver" class="quiz-section">
          <div class="quiz-info">
            <div class="current-question">{{ currentQuestion.question }}</div>
            <div class="question-counter">Pregunta {{ currentQuestionIndex + 1 }} de {{ questions.length }}</div>
          </div>
          
          <div class="cards-container">
            <div 
              class="truth-card" 
              @click="checkAnswer(true)" 
              :class="{ 
                disabled: isChecking || gameOver,
                selected: selectedAnswer === true,
                correct: showFeedback && currentQuestion.correctAnswer === true,
                incorrect: showFeedback && selectedAnswer === true && currentQuestion.correctAnswer === false
              }">
              <div class="card-text">VERDADERO</div>
              <div v-if="showFeedback" class="feedback-icon">
                <span v-if="currentQuestion.correctAnswer === true">✓</span>
                <span v-else-if="selectedAnswer === true">✗</span>
              </div>
            </div>
            
            <div 
              class="false-card" 
              @click="checkAnswer(false)" 
              :class="{ 
                disabled: isChecking || gameOver,
                selected: selectedAnswer === false,
                correct: showFeedback && currentQuestion.correctAnswer === false,
                incorrect: showFeedback && selectedAnswer === false && currentQuestion.correctAnswer === true }">
             
              <div class="card-text">FALSO</div>
              <div v-if="showFeedback" class="feedback-icon">
                <span v-if="currentQuestion.correctAnswer === false">✓</span>
                <span v-else-if="selectedAnswer === false">✗</span>
              </div>
            </div>
          </div>

          <div v-if="showFeedback" class="explanation">
            <p><strong>Explicación:</strong> {{ currentQuestion.explicacion }}</p>
          </div>
        </div>

        <!-- Game Over -->
        <div v-else class="game-over-section">
          <div class="game-over-card">
            <h2 class="game-over-title">¡Juego Terminado!</h2>
            
            <div class="final-results">
              <div class="result-item">
                <span class="result-label">Puntuación Final:</span>
                <span class="result-value">{{ score }}/{{ questions.length }}</span>
              </div>
              
              <div class="result-item">
                <span class="result-label">Porcentaje de Aciertos:</span>
                <span class="result-value">{{ Math.round((score / questions.length) * 100) }}%</span>
              </div>
              
              <div class="result-item">
                <span class="result-label">Etapa Alcanzada:</span>
                <span class="result-value">{{ plantName }}</span>
              </div>
              
              <div class="result-item">
                <span class="result-label">Crecimiento Final:</span>
                <span class="result-value">{{ Math.round(Math.min(plant.growth, 100)) }}%</span>
              </div>
            </div>

            <div class="performance-message" :class="performanceClass">
              <h3>{{ performanceTitle }}</h3>
              <p>{{ performanceDescription }}</p>
            </div>

            <!-- Sección para guardar puntuación -->
            <div class="score-actions">
              <button class="btn-save" @click="guardarPuntuacion" :disabled="puntuacionGuardada || !usuarioLogueado">
                {{ !usuarioLogueado ? 'Inicia sesión para guardar' : puntuacionGuardada ? 'Puntuación Guardada' : 'Guardar Puntuación' }}
              </button>
              <p v-if="!usuarioLogueado" class="login-warning">
                Debes iniciar sesión para guardar tu puntuación
              </p>
            </div>
            
            <div class="game-over-buttons">
              <button @click="volverAlInicio" class="btn-primary">
                Volver al Inicio
              </button>
              <button @click="reintentarJuego" class="btn-warning">Jugar Otra Vez</button>
              <button class="btn-info" @click="mostrarLeaderboard = true">
                Ver posiciones
              </button>
            </div>
          </div>
          <!-- Modal de la tabla líderes -->
          <div v-if="mostrarLeaderboard" class="modal-overlay">
            <div class="modal-content leaderboard-modal">
              <button class="modal-close-btn" @click="mostrarLeaderboard = false">×</button>
              <h2>Tabla de Posiciones</h2>
              <div class="leaderboard-container">
                <LeaderboardGame2 :scores="leaderboard" :showAciertos="true" />
              </div>
              <div class="modal-actions">
                <button class="btn-primary" @click="mostrarLeaderboard = false">
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import LeaderboardGame2 from '@/components/leaderboard-Game2.vue';

import etapaInicial from '@/assets/img/etapaInicial.png'
import etapa1 from '@/assets/img/etapa1.png';
import etapa2 from '@/assets/img/etapa2.png';
import etapa3 from '@/assets/img/etapa3.png';
import etapa4 from '@/assets/img/etapa4.png';
import etapa5 from '@/assets/img/etapa5.png';
import etapa6 from '@/assets/img/etapa6.png';
import etapa7 from '@/assets/img/etapa7.png';
import etapa8 from '@/assets/img/etapa8.png';
import etapa9 from '@/assets/img/etapa9.png';
import etapa10 from '@/assets/img/etapa10.png';

export default {
  components: {
    LeaderboardGame2
  },
  data() {
    return {
      juegoActivo: false,
      plant: {
        health: 100,
        growth: 0
      },
      score: 0,
      streak: 0,
      questionsAnswered: 0,
      message: 'Cargando preguntas...',
      messageType: '',
      currentQuestionIndex: 0,
      questions: [],
      isChecking: false,
      selectedAnswer: null,
      showFeedback: false,
      gameOver: false,
      puntuacionGuardada: false,
      leaderboard: [],
      usuarioLogueado: false,
      usuarioActual: null,
      gameStartTime: null,
      mostrarLeaderboard: false, 
      
      plantImages: {
        tierra: etapaInicial,        
        semilla: etapa1,             
        germinacion: etapa2,         
        plantulaJoven: etapa3,       
        primerasHojas: etapa4,       
        crecimientoVegetativo: etapa5, 
        desarrolloHojasTallo: etapa6, 
        ramificacion: etapa7,        
        floracion: etapa8,           
        fructificacion: etapa9,      
        maduracion: etapa10,         
      },
    };
  },
  computed: {
    plantState() {
      if (this.plant.health >= 70) return 'healthy';
      if (this.plant.health >= 40) return 'warning';
      if (this.plant.health >= 20) return 'sick';
      return 'critical';
    },
    plantImage() {
      const growth = Math.min(this.plant.growth, 100);
      if (growth >= 95) return this.plantImages.maduracion;
      if (growth >= 85) return this.plantImages.fructificacion;
      if (growth >= 75) return this.plantImages.floracion;
      if (growth >= 65) return this.plantImages.ramificacion;
      if (growth >= 55) return this.plantImages.desarrolloHojasTallo;
      if (growth >= 45) return this.plantImages.crecimientoVegetativo;
      if (growth >= 35) return this.plantImages.primerasHojas;
      if (growth >= 25) return this.plantImages.plantulaJoven;
      if (growth >= 15) return this.plantImages.germinacion;
      if (growth >= 5) return this.plantImages.semilla;
      if (growth >= 0) return this.plantImages.tierra; 
      return this.plantImages.tierra;
    },
    plantName() {
      const growth = Math.min(this.plant.growth, 100);
      if (growth >= 95) return 'Maduración';
      if (growth >= 85) return 'Fructificación';
      if (growth >= 75) return 'Floración';
      if (growth >= 65) return 'Ramificación';
      if (growth >= 55) return 'Desarrollo Hojas/Tallo';
      if (growth >= 45) return 'Crecimiento Vegetativo';
      if (growth >= 35) return 'Primeras Hojas Verdes';
      if (growth >= 25) return 'Plántula Joven';
      if (growth >= 15) return 'Germinación';
      if (growth >= 5) return 'Semilla Brotando';
      if (growth >= 0) return 'Tierra Preparada'; 
      return 'Tierra Preparada';
    },
    currentQuestion() {
      return this.questions[this.currentQuestionIndex] || { question: 'Cargando...' };
    },
    scoreProgress() {
      return this.questionsAnswered > 0 ? (this.score / this.questionsAnswered) * 100 : 0;
    },
    performanceClass() {
      const percentage = (this.score / this.questions.length) * 100;
      if (percentage >= 80) return 'excellent';
      if (percentage >= 60) return 'good';
      if (percentage >= 40) return 'average';
      return 'poor';
    },
    performanceTitle() {
      const percentage = (this.score / this.questions.length) * 100;
      if (percentage >= 80) return '¡Excelente Cuidado! ';
      if (percentage >= 60) return 'Buen Trabajo ';
      if (percentage >= 40) return 'Necesita Mejorar';
      return 'Cuidado Insuficiente ';
    },
    performanceDescription() {
      const percentage = (this.score / this.questions.length) * 100;
      if (percentage >= 80) {
        return 'Has demostrado un excelente conocimiento sobre el medio ambiente. ¡Tu planta ha crecido saludablemente!';
      } else if (percentage >= 60) {
        return 'Tienes buen conocimiento, pero hay áreas que puedes mejorar para un mejor cuidado de tus plantas.';
      } else if (percentage >= 40) {
        return 'Tu planta no ha crecido apropiadamente. Revisa los informaciones reales sobre el medio ambiente.';
      } else {
        return 'No has podido ayudar a tu planta a crecer adecuadamente. Es importante aprender más sobre el medio ambiente';
      }
    },
    tiempoJuego() {
      if (!this.gameStartTime) return 0;
      return Math.floor((Date.now() - this.gameStartTime) / 1000);
    }
  },
  methods: {
    verificarAutenticacion() {
      const token = localStorage.getItem('token');
      const usuario = localStorage.getItem('usuario');
      
      if (token && usuario) {
        this.usuarioLogueado = true;
        this.usuarioActual = JSON.parse(usuario);
      } else {
        this.usuarioLogueado = false;
        this.usuarioActual = null;
      }
    },
    
    volverAlInicio() {
      this.juegoActivo = false;
      this.gameOver = false;
      this.cargarLeaderboard();
    },

    reintentarJuego() {
      this.reiniciarJuego();
      this.juegoActivo = true;
    },

    empezarJuego() {
      this.verificarAutenticacion();
      // Reiniciar el estado del juego antes de comenzar para evitar valores residuales
      if (typeof this.reiniciarJuego === 'function') this.reiniciarJuego();
      this.juegoActivo = true;
      this.gameStartTime = Date.now();
    },

    async cargarLeaderboard() {
      try {
        const response = await axios.get('http://localhost:3000/api/juego2/leaderboard');
        this.leaderboard = response.data;
      } catch (error) {
        console.error('Error cargando leaderboard:', error);
      }
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
          puntuacion: this.score,
          crecimiento_final: Math.round(Math.min(this.plant.growth, 100)), 
          aciertos: this.score,
          total_preguntas: this.questions.length,
          etapa_alcanzada: this.plantName,
          tiempo_juego: this.tiempoJuego
        };

        const response = await axios.post('http://localhost:3000/api/juego2/puntuacion', puntuacionData, {
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

    async loadQuestions() {
      try {
        const response = await axios.get('http://localhost:3000/api/juego2/questions');
        this.questions = response.data;
        this.message = 'Responde Verdadero o Falso para ayudar a tu planta a crecer';
      } catch (error) {
        console.error('Error cargando preguntas:', error);
        this.message = 'Error cargando las preguntas. Recarga la página.';
        this.messageType = 'negative';
      }
    },

    async checkAnswer(userAnswer) {
      if (this.isChecking || this.gameOver) return;
      
      this.isChecking = true;
      this.selectedAnswer = userAnswer;
      this.questionsAnswered++;

      try {
        const response = await axios.post('http://localhost:3000/api/juego2/check-answer', {
          questionId: this.currentQuestion.id,
          userAnswer
        });
        
        const { isCorrect, explicacion } = response.data;
        
        this.currentQuestion.correctAnswer = response.data.correctAnswer;
        this.currentQuestion.explicacion = explicacion;
        this.showFeedback = true;

        if (isCorrect) {
          this.score++;
          this.streak++;
          
          // Solo crecimiento base cuando acierta
          this.plant.growth = Math.min(100, this.plant.growth + 10);
          this.plant.health = Math.min(100, this.plant.health + 5);
          
          this.message = `¡Correcto! +10% de crecimiento`;
          this.messageType = 'positive';

        } else {
          this.streak = 0;
          
          let healthLoss = 8;
          if (this.plant.health < 30) healthLoss = 5;
          if (this.plant.health < 15) healthLoss = 3;
          
          this.plant.health = Math.max(0, this.plant.health - healthLoss);
          this.message = `Incorrecto. -${healthLoss}% salud`;
          this.messageType = 'negative';

          if (this.plant.health < 30) {
            this.message += ' | ¡Cuida tu planta!';
          }
        }

        setTimeout(() => {
          if (this.currentQuestionIndex === this.questions.length - 1) {
            this.endGame();
          } else {
            this.nextQuestion();
          }
        }, 3500);
        
      } catch (error) {
        console.error('Error verificando respuesta:', error);
        this.message = 'Error verificando la respuesta. Intenta de nuevo.';
        this.messageType = 'negative';
        this.isChecking = false;
        this.showFeedback = false;
        this.selectedAnswer = null;
      }
    },
    
    nextQuestion() {
      this.currentQuestionIndex++;
      this.message = 'Elige Verdadero o Falso para la siguiente pregunta';
      this.messageType = '';
      this.isChecking = false;
      this.showFeedback = false;
      this.selectedAnswer = null;

      if (this.plant.health < 50 && this.plant.health > 0) {
        const recovery = 2;
        this.plant.health = Math.min(100, this.plant.health + recovery);
        this.message += ` | Tu planta se recupera +${recovery}% salud`;
      }

      if (this.plant.health <= 0) {
        this.endGame(true);
      }
    },

    endGame(plantDied = false) {
      this.gameOver = true;
      this.isChecking = true;

      if (plantDied) {
        this.message = '¡Tu planta ha muerto por falta de cuidados!';
        this.messageType = 'negative';
      } else {
        const growth = Math.min(this.plant.growth, 100);
        if (growth >= 70) {
          this.message = '¡Felicidades! Has logrado que tu planta florezca completamente.';
          this.messageType = 'positive';
        } else if (growth >= 40) {
          this.message = 'Buen trabajo, tu planta ha crecido considerablemente.';
          this.messageType = 'positive';
        } else if (growth >= 20) {
          this.message = 'Tu planta ha crecido, pero no alcanzó su máximo potencial.';
          this.messageType = 'warning';
        } else {
          this.message = 'Tu planta no ha crecido apropiadamente. Necesita más cuidados.';
          this.messageType = 'negative';
        }
      }
    },

    reiniciarJuego() {
      this.plant = {
        health: 100,
        growth: 0
      };
      this.score = 0;
      this.streak = 0;
      this.questionsAnswered = 0;
      this.currentQuestionIndex = 0;
      this.message = '¡Nuevo juego! Responde Verdadero o Falso para hacer crecer tu planta.';
      this.messageType = '';
      this.selectedAnswer = null;
      this.showFeedback = false;
      this.isChecking = false;
      this.gameOver = false;
      this.puntuacionGuardada = false;
      this.gameStartTime = Date.now();
      this.loadQuestions();
    }
  },
  mounted() {
    this.verificarAutenticacion();
    this.loadQuestions();
    this.cargarLeaderboard();
  }
};
</script>

<style scoped>
.initial-screen {
  max-width: 1200px;
  margin: 0 auto;
  margin-top: 10%;
}

.initial-screen header {
  text-align: center;
  margin-top: 30px;
  margin-bottom: 30px;
  color: rgb(45, 56, 44);
}

.initial-screen h1 {
  font-size: 2.5rem;
  margin-bottom: 10px;
}

.initial-screen .subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
}

.welcome-section {
  margin-bottom: 30px;
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

.container {
  max-width: 1200px;
  margin: 0 auto;
  margin-top: 10%;
}

header {
  text-align: center;
  margin-top:30px;
  margin-bottom: 30px;
  color: rgb(45, 56, 44);
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 10px;
}

.subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
}

.game-container {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  justify-content: center;
}

.plant-status {
  flex: 1;
  min-width: 300px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.plant-visual {
  text-align: center;
  margin-bottom: 20px;
}

.plant {
  margin-bottom: 10px;
  transition: all 0.5s ease;
}

.plant-img {
  width: 150px;
  height: 150px;
  object-fit: contain;
  transition: all 0.5s ease;
}

.stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.stat {
  background: #f5f5f5;
  padding: 15px;
  border-radius: 10px;
  text-align: center;
}

.stat-name {
  font-weight: bold;
  margin-bottom: 5px;
  color: #2E7D32;
}

.stat-value {
  font-size: 1.2rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}


.progress-bar {
  height: 10px;
  background: #e0e0e0;
  border-radius: 5px;
  margin-top: 5px;
  overflow: hidden;
}

.progress {
  height: 100%;
  border-radius: 5px;
  transition: width 0.5s;
}

.health .progress {
  background: #4CAF50;
}

.growth .progress {
  background: #FF9800;
}

.score .progress {
  background: #2196F3;
}

.quiz-section {
  flex: 2;
  min-width: 300px;
}

.quiz-info {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 20px;
  text-align: center;
}

.current-question {
  font-size: 1.3rem;
  margin-bottom: 15px;
  font-weight: bold;
  color: #2E7D32;
}

.question-counter {
  font-size: 1.1rem;
  color: #666;
}

.cards-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.truth-card, .false-card {
  height: 200px;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  text-align: center;
  position: relative;
}

.truth-card {
  background: linear-gradient(135deg, #4CAF50, #2E7D32);
  color: white;
}

.false-card {
  background: linear-gradient(135deg, #F44336, #C62828);
  color: white;
}

.truth-card:hover, .false-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.truth-card:active, .false-card:active {
  transform: translateY(0);
}

.truth-card.disabled, .false-card.disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.truth-card.selected, .false-card.selected {
  transform: scale(1.05);
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.8);
}

.truth-card.correct, .false-card.correct {
  box-shadow: 0 0 0 4px #4CAF50, 0 0 20px rgba(76, 175, 80, 0.5);
}

.truth-card.incorrect, .false-card.incorrect {
  box-shadow: 0 0 0 4px #F44336, 0 0 20px rgba(244, 67, 54, 0.5);
}

.feedback-icon {
  position: absolute;
  top: 15px;
  right: 15px;
  font-size: 1.5rem;
  font-weight: bold;
}

.card-text {
  font-size: 1.5rem;
  font-weight: bold;
}

.explanation {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  padding: 15px;
  margin-top: 15px;
  border-left: 4px solid #aae448;
}

.explanation p {
  margin: 0;
  color: #333;
  line-height: 1.4;
}

.game-message {
  margin-top: 20px;
  padding: 15px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  text-align: center;
  font-weight: bold;
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.positive {
  color: #4CAF50;
  background: rgba(76, 175, 80, 0.1);
  border: 1px solid rgba(76, 175, 80, 0.3);
}

.negative {
  color: #F44336;
  background: rgba(244, 67, 54, 0.1);
  border: 1px solid rgba(244, 67, 54, 0.3);
}

.game-over-section {
  flex: 2;
  min-width: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.game-over-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 40px;
  text-align: center;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 100%;
}

.game-over-title {
  color: #2E7D32;
  font-size: 2.2rem;
  margin-bottom: 30px;
  border-bottom: 3px solid #4CAF50;
  padding-bottom: 15px;
}

.final-results {
  background: #f8f9fa;
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 25px;
}

.result-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #e9ecef;
}

.result-item:last-child {
  border-bottom: none;
}

.result-label {
  font-weight: bold;
  color: #495057;
}

.result-value {
  font-weight: bold;
  color: #2E7D32;
  font-size: 1.1rem;
}

.performance-message {
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 25px;
  border-left: 5px solid;
}

.performance-message.excellent {
  background: rgba(76, 175, 80, 0.1);
  border-left-color: #4CAF50;
  color: #2E7D32;
}

.performance-message.good {
  background: rgba(33, 150, 243, 0.1);
  border-left-color: #2196F3;
  color: #1565C0;
}

.performance-message.average {
  background: rgba(255, 152, 0, 0.1);
  border-left-color: #FF9800;
  color: #EF6C00;
}

.performance-message.poor {
  background: rgba(244, 67, 54, 0.1);
  border-left-color: #F44336;
  color: #C62828;
}

.performance-message h3 {
  margin: 0 0 10px 0;
  font-size: 1.4rem;
}

.performance-message p {
  margin: 0;
  line-height: 1.5;
}

.score-actions {
  margin: 20px 0;
  text-align: center;
}

.btn-save {
  background: #2196F3;
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 25px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  max-width: 250px;
  font-weight: 600;
}

.btn-save:hover:not(:disabled) {
  background: #1976D2;
  transform: translateY(-2px);
}

.btn-save:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
}

.login-warning {
  color: #ff6b6b;
  font-size: 0.9rem;
  margin-top: 10px;
  text-align: center;
}

.game-over-buttons {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  justify-content: center;
}

.btn-primary, .btn-warning, .btn-info, .start-game-btn {
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

.modal-actions {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 15px;
  flex-wrap: wrap;
}

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
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
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

.modal-content h2 {
  padding-right: 40px; 
}

/* Responsive */
@media (max-width: 768px) {
  .modal-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .btn-primary,
  .btn-warning,
  .btn-info,
  .start-game-btn {
    width: 100%;
    max-width: 250px;
  }
  
  .modal-actions button {
    width: 100%;
    max-width: 250px;
  }
}

@media (max-width: 480px) {
  .modal-content {
    padding: 1.5rem;
  }
  
  .btn-primary,
  .btn-warning,
  .btn-info,
  .start-game-btn {
    padding: 10px 20px;
    font-size: 0.9rem;
  }
}
</style>