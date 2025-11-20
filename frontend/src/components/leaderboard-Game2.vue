<template>
  <div class="leaderboard-section" v-if="scores.length > 0">
    <h3>Mejores Puntuaciones - Mi Planta Virtual</h3>
    <div class="table-container">
      <table class="leaderboard-table">
        <thead>
          <tr>
            <th class="col-rank-enc">Posición</th>
            <th class="col-name-enc">Jugador</th>
            <th class="col-aciertos-enc">Aciertos</th>
            <th class="col-etapa-enc">Etapa</th>
            <th class="col-growth-enc">Crecimiento</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(score, index) in scores" :key="score.id || index" class="leaderboard-row">
            <td class="col-rank">#{{ index + 1 }}</td>
            <td class="col-name">{{ score.usuario }}</td>
            <td class="col-aciertos">{{ score.aciertos }}/{{ score.total_preguntas }}</td>
            <td class="col-etapa">{{ score.etapa_alcanzada }}</td>
            <td class="col-growth">{{ score.crecimiento_final }}%</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: "LeaderboardGame2",
  props: {
    scores: {
      type: Array,
      required: true,
      default: () => []
    }
  }
}
</script>

<style scoped>
.leaderboard-section {
  margin: 20px auto 0 auto; 
  padding: 15px;
  border-top: 2px solid #24bf71;
  max-width: 500px; 
  width: 90%; 
}

.leaderboard-section h3 {
  margin-bottom: 15px;
  color: #2E7D32;
  text-align: center;
}

.table-container {
  max-height: 300px;
  overflow-y: auto;
  border-radius: 8px;
  padding: 10px;
  
}

.leaderboard-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 6px;
  overflow: hidden;
  
}


.leaderboard-table thead {
  background: #2E7D32;
  color: white;
}

.leaderboard-table th {
  padding: 12px 8px;
  font-weight: bold;
  text-align: center;
  font-size: 0.9rem;
  border-bottom: 2px solid #1B5E20;
}


.leaderboard-table tbody tr {
  transition: background-color 0.2s;
}

.leaderboard-table tbody tr:nth-child(even) {
  background: #f8f9fa;
}

.leaderboard-table tbody tr:nth-child(odd) {
  background: #ffffff;
}

.leaderboard-table tbody tr:hover {
  background: #e8f5e8;
}

.leaderboard-table td {
  padding: 10px 8px;
  text-align: center;
  border-bottom: 1px solid #e0e0e0;
}

/* Estilos específicos por columna */
.col-rank {
  font-weight: bold;
  color: #2E7D32;
  width: 50px;
}

.col-name {
  text-align: left;
  font-weight: 500;
  color: #2E7D32;
  padding-left: 15px;
}

.col-aciertos {
  color: #2196F3;
  font-weight: bold;
  width: 80px;
}


.col-etapa {
  color: #FF9800;
  font-weight: bold;
  width: 130px;
  font-size: 0.85rem;
  line-height: 1.2;
}

.col-growth {
  color: #4CAF50;
  font-weight: bold;
  width: 70px;
}

/* Versión móvil */
@media (max-width: 768px) {
  .table-container {
    max-height: 350px;
  }
  
  .leaderboard-table {
    font-size: 0.85rem;
  }
  
  .leaderboard-table th,
  .leaderboard-table td {
    padding: 8px 4px;
  }
  
  .col-name {
    padding-left: 8px;
    max-width: 80px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  .col-etapa {
    width: 100px;
    font-size: 0.8rem;
  }
  
  .col-aciertos {
    width: 70px;
  }
  
  .col-growth {
    width: 60px;
  }
}

@media (max-width: 480px) {
  .leaderboard-section {
    max-width: 350px;
    width: 100%;
    padding: 10px;
  }
  
  .table-container {
    padding: 5px;
  }
  
  .leaderboard-table {
    font-size: 0.8rem;
  }
  
  .leaderboard-table th,
  .leaderboard-table td {
    padding: 6px 3px;
  }
  
  .col-etapa {
    width: 90px;
    font-size: 0.75rem;
  }
  
  .col-name {
    max-width: 60px;
  }
}

</style>