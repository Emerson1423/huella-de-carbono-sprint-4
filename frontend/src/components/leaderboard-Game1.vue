<template>
  <div class="leaderboard-section" v-if="scores.length > 0">
    <h3>Mejores Puntuaciones</h3>
    <div class="leaderboard-list">
      <div v-for="(score, index) in scores" :key="score.id || index" class="leaderboard-item">
        <span class="rank">#{{ index + 1 }}</span>
        <span class="player-name">{{ score.usuario }}</span>
        <span class="player-aciertos" v-if="showAciertos">{{ score.aciertos }}/{{ score.total_residuos }}</span>
        <span class="player-score">{{ score.puntuacion }}%</span>
        <span class="player-time">{{ formatoTiempo(score.tiempo_segundos) }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
 name: "LeaderboardGame1",
  props: {
    scores: {
      type: Array,
      required: true,
      default: () => []
    },
    showAciertos: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    formatoTiempo(segundos) {
      const minutos = Math.floor(segundos / 60);
      const segs = segundos % 60;
      return `${minutos}:${segs.toString().padStart(2, '0')}`;
    }
  }
}
</script>

<style scoped>
.leaderboard-section {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 2px solid #eee;
}

.leaderboard-section h3 {
  margin-bottom: 15px;
  color: #2E7D32;
  text-align: center;
}

.leaderboard-list {
  max-height: 200px;
  overflow-y: auto;
}

.leaderboard-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  margin: 5px 0;
  background: #f8f9fa;
  border-radius: 8px;

}

.rank {
  font-weight: bold;
  color: #2E7D32;
  min-width: 30px;
}

.player-name {
  flex: 1;
  text-align: left;
  margin-left: 10px;
  font-weight: 500;
}

.player-aciertos {
  color: #666;
  font-size: 0.9rem;
  min-width: 60px;
  text-align: center;
}

.player-score {
  font-weight: bold;
  color: #FF9800;
  min-width: 50px;
  text-align: center;
}

.player-time {
  color: #666;
  font-size: 0.9rem;
  min-width: 50px;
  text-align: center;
}

@media (max-width: 768px) {
  .leaderboard-item {
    flex-wrap: wrap;
    gap: 5px;
  }
  
  .player-aciertos {
    order: 3;
    width: 100%;
    text-align: center;
    margin-top: 5px;
  }
}
</style>