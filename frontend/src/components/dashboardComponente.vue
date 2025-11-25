<template>
  <div class="dashboard-container">
    <!-- Header del Dashboard -->
    <div class="dashboard-header">
      <h1>Panel de Administración</h1>
      <p class="subtitle">Bienvenido, <strong>{{ usuario.usuario }}</strong> - Rol: <span class="rol-badge">{{ usuario.rol }}</span></p>
    </div>

    <!-- Tarjetas de Resumen -->
    <div class="stats-grid" v-if="resumen">
      <div class="stat-card usuarios">
        <div class="stat-icon">
          <img :src="usuariosIcono"  class="nav-icon" /></div>
        <div class="stat-content">
          <h3>{{ resumen.usuarios?.total || 0 }}</h3>
          <p>Usuarios Totales</p>
          <span class="stat-badge">+{{ resumen.usuarios?.recientes || 0 }} esta semana</span>
        </div>
      </div>

      <div class="stat-card huella">
        <div class="stat-icon">
          <img :src="huellaIcono"  class="nav-icon" />
        </div>
        <div class="stat-content">
          <h3>{{ resumen.huellaCarbono?.total || 0 }}</h3>
          <p>Huellas Calculadas</p>
          <span class="stat-badge">{{ resumen.huellaCarbono?.promedioEmisiones || 0 }} kg CO₂</span>
        </div>
      </div>

      <div class="stat-card juegos">
        <div class="stat-icon">
           <img :src="juegosIcono"  class="nav-icon" />
        </div>
        <div class="stat-content">
          <h3>{{ resumen.juegos?.totalPartidas || 0 }}</h3>
          <p>Partidas Jugadas</p>
          <span class="stat-badge">{{ resumen.juegos?.promedioPuntuacion || 0 }}% promedio</span>
        </div>
      </div>

      <div class="stat-card actividad">
        <div class="stat-icon">
           <img :src="actividadIcono"  class="nav-icon" />
        </div>
        <div class="stat-content">
          <h3>{{ actividadTotal }}</h3>
          <p>Actividad Total</p>
          <span class="stat-badge">Últimos 7 días</span>
        </div>
      </div>
    </div>

    <!-- Gráficos -->
    <div class="charts-grid">
      <!-- Gráfico 1: Usuarios por mes -->
      <div class="chart-card">
        <h3>Usuarios Registrados (Últimos 6 meses)</h3>
        <canvas ref="usuariosMesChart"></canvas>
      </div>

      <!-- Gráfico 2: Distribución de roles -->
      <div class="chart-card">
        <h3>Distribución por Rol</h3>
        <canvas ref="rolesChart"></canvas>
      </div>

      <!-- Gráfico 3: Emisiones por transporte -->
      <div class="chart-card">
        <h3>Emisiones por Transporte</h3>
        <canvas ref="transporteChart"></canvas>
      </div>

      <!-- Gráfico 4: Tendencia de emisiones -->
      <div class="chart-card">
        <h3>Tendencia de Emisiones CO₂</h3>
        <canvas ref="tendenciaChart"></canvas>
      </div>
    </div>

    <!-- Top Jugadores y Actividad Reciente -->
    <div class="bottom-grid">
      <!-- Top 5 Jugadores -->
      <div class="table-card">
        <h3>Top 5 Jugadores</h3>
        <table v-if="resumen.juegos?.topJugadores?.length > 0">
          <thead>
            <tr>
              <th>#</th>
              <th>Usuario</th>
              <th>Partidas</th>
              <th>Promedio</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(jugador, index) in resumen.juegos.topJugadores" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ jugador.usuario }}</td>
              <td>{{ jugador.partidas }}</td>
              <td>{{ parseFloat(jugador.promedio).toFixed(0) }}%</td>
            </tr>
          </tbody>
        </table>
        <p v-else class="no-data">No hay datos disponibles</p>
      </div>

      <!-- Actividad Reciente -->
      <div class="table-card">
        <h3> Actividad Reciente</h3>
        <div class="activity-list" v-if="actividadReciente.length > 0">
          <div v-for="item in actividadReciente" :key="item.id" class="activity-item">
            <span class="activity-icon" :class="item.tipo">
              <img :src="getActivityIcon(item.tipo)" :alt="item.tipo" class="activity-icon-img" />
            </span>
            <div class="activity-content">
              <p><strong>{{ item.usuario }}</strong> {{ getActivityText(item) }}</p>
              <small>{{ formatDate(item.fecha) }}</small>
            </div>
          </div>
        </div>
        <p v-else class="no-data">No hay actividad reciente</p>
      </div>
    </div>

    <!-- Botones de Acción -->
    <div class="action-buttons">
      <router-link to="/admin/usuarios" class="btn-primary">
        Gestionar Usuarios
      </router-link>
      <router-link to="/eventos" class="btn-secondary">
        Ver Eventos
      </router-link>
    </div>
  </div>
</template>

<script>
import { Chart, registerables } from 'chart.js';
import usuariosIcono from '@/assets/icons/usuarios.png'
import huellaIcono from '@/assets/icons/huellas.png'
import juegosIcono from '@/assets/icons/juegos.png'
import actividadIcono from '@/assets/icons/actividad.png'
import registroIcono from '@/assets/icons/registro.png'
Chart.register(...registerables);

export default {
  name: 'DashboardComponente',
  data() {
    return {
      usuario: {},
      resumen: {},
      actividadReciente: [],
      charts: {},
      usuariosIcono,
      huellaIcono,
      juegosIcono,
      actividadIcono,
      registroIcono,
    };
  },
  computed: {
    actividadTotal() {
      return (this.resumen.usuarios?.total || 0) + 
             (this.resumen.huellaCarbono?.total || 0) + 
             (this.resumen.juegos?.totalPartidas || 0);
    }
  },
  async mounted() {
    this.cargarUsuario();
    await this.cargarDatos();
  },
  beforeUnmount() {
    for (const chart of Object.values(this.charts)) {
      chart?.destroy();
    }
  },
  methods: {
    cargarUsuario() {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          this.usuario = payload;
        } catch (error) {
          console.error('Error al decodificar token:', error);
        }
      }
    },
    
    async cargarDatos() {
      try {
        const token = localStorage.getItem('token');
        const headers = { 'Authorization': `Bearer ${token}` };

        // Cargar resumen
        const resumenRes = await fetch('http://localhost:3000/api/dashboard/resumen', { headers });
        this.resumen = await resumenRes.json();

        // Cargar actividad reciente
        const actividadRes = await fetch('http://localhost:3000/api/dashboard/actividad/reciente', { headers });
        this.actividadReciente = await actividadRes.json();

        // Cargar gráficos
        await this.cargarGraficos();
      } catch (error) {
        console.error('Error al cargar datos:', error);
      }
    },

    async cargarGraficos() {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };

      try {
        // Usuarios por mes
        const usuariosMesRes = await fetch('http://localhost:3000/api/dashboard/usuarios/por-mes', { headers });
        const datosUsuariosMes = await usuariosMesRes.json();
        this.crearGraficoUsuariosMes(datosUsuariosMes);

        // Roles
        const rolesRes = await fetch('http://localhost:3000/api/dashboard/usuarios/por-rol', { headers });
        const datosRoles = await rolesRes.json();
        this.crearGraficoRoles(datosRoles);

        // Transporte
        const transporteRes = await fetch('http://localhost:3000/api/dashboard/huella/por-transporte', { headers });
        const datosTransporte = await transporteRes.json();
        this.crearGraficoTransporte(datosTransporte);

        // Tendencia
        const tendenciaRes = await fetch('http://localhost:3000/api/dashboard/huella/tendencia', { headers });
        const datosTendencia = await tendenciaRes.json();
        this.crearGraficoTendencia(datosTendencia);
      } catch (error) {
        console.error('Error al cargar gráficos:', error);
      }
    },

    crearGraficoUsuariosMes(datos) {
      const ctx = this.$refs.usuariosMesChart;
      if (!ctx) return;
      
      if (this.charts.usuariosMes) this.charts.usuariosMes.destroy();
      
      this.charts.usuariosMes = new Chart(ctx, {
        type: 'line',
        data: {
          labels: datos.map(d => d.mes),
          datasets: [{
            label: 'Usuarios',
            data: datos.map(d => d.cantidad),
            borderColor: '#4CAF50',
            backgroundColor: 'rgba(76, 175, 80, 0.1)',
            tension: 0.4,
            fill: true
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } }
        }
      });
    },

    crearGraficoRoles(datos) {
      const ctx = this.$refs.rolesChart;
      if (!ctx) return;
      
      if (this.charts.roles) this.charts.roles.destroy();
      
      this.charts.roles = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: datos.map(d => d.rol),
          datasets: [{
            data: datos.map(d => d.cantidad),
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
    },

    crearGraficoTransporte(datos) {
      const ctx = this.$refs.transporteChart;
      if (!ctx) return;
      
      if (this.charts.transporte) this.charts.transporte.destroy();
      
      this.charts.transporte = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: datos.map(d => d.transporte),
          datasets: [{
            label: 'Emisiones (kg CO₂)',
            data: datos.map(d => Number.parseFloat(d.promedio_emisiones)),
            backgroundColor: '#FF9800'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } }
        }
      });
    },

    crearGraficoTendencia(datos) {
      const ctx = this.$refs.tendenciaChart;
      if (!ctx) return;
      
      if (this.charts.tendencia) this.charts.tendencia.destroy();
      
      this.charts.tendencia = new Chart(ctx, {
        type: 'line',
        data: {
          labels: datos.map(d => d.mes),
          datasets: [{
            label: 'Emisiones Promedio',
            data: datos.map(d => Number.parseFloat(d.promedio_emisiones)),
            borderColor: '#F44336',
            backgroundColor: 'rgba(244, 67, 54, 0.1)',
            tension: 0.4,
            fill: true
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } }
        }
      });
    },

    getActivityIcon(tipo) {
      const icons = { 
        registro: this.registroIcono, 
        huella: this.huellaIcono, 
        juego: this.juegosIcono
      };
      return icons[tipo] || this.actividadIcon;
    },

    getActivityText(item) {
      switch(item.tipo) {
        case 'registro': return 'se registró';
        case 'huella': return `calculó su huella (${item.total_emisiones} kg CO₂)`;
        case 'juego': return `jugó (${item.puntuacion}%)`;
        default: return 'realizó una acción';
      }
    },

    formatDate(fecha) {
      const date = new Date(fecha);
      const ahora = new Date();
      const diff = Math.floor((ahora - date) / 1000 / 60);
      
      if (diff < 60) return `Hace ${diff} min`;
      if (diff < 1440) return `Hace ${Math.floor(diff / 60)} hrs`;
      return `Hace ${Math.floor(diff / 1440)} días`;
    }
  }
};
</script>

<style scoped>
.dashboard-container {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  font-family: 'Poppins', sans-serif;
}

.dashboard-header {
  margin-bottom: 2rem;
  text-align: center;
}

.dashboard-header h1 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #7f8c8d;
  font-size: 1rem;
}

.rol-badge {
  background: #4CAF50;
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 600;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-card.usuarios .stat-icon { background: rgba(76, 175, 80, 0.1); }
.stat-card.huella .stat-icon { background: rgba(76, 175, 80, 0.15); }
.stat-card.juegos .stat-icon { background: rgba(33, 150, 243, 0.1); }
.stat-card.actividad .stat-icon { background: rgba(255, 152, 0, 0.1); }

.nav-icon {
  width: 30px;
  height: 30px;
  object-fit: contain;
}

.stat-content h3 {
  margin: 0;
  font-size: 2rem;
  color: #2c3e50;
}

.stat-content p {
  margin: 0.25rem 0;
  color: #7f8c8d;
  font-size: 0.9rem;
}

.stat-badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  background: #e8f5e9;
  color: #4CAF50;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.chart-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.chart-card h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: #2c3e50;
  font-size: 1rem;
}

.chart-card canvas {
  max-height: 250px;
}

.bottom-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.table-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.table-card h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: #2c3e50;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background: #f5f5f5;
}

th, td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #eee;
}

th {
  font-weight: 600;
  color: #7f8c8d;
  font-size: 0.85rem;
}

.activity-list {
  max-height: 300px;
  overflow-y: auto;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 0.75rem;
  border-bottom: 1px solid #eee;
}

.activity-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
}
.activity-icon-img {
  width: 20px;
  height: 20px;
  object-fit: contain;
}

.activity-icon.registro { background: rgba(33, 150, 243, 0.1); }
.activity-icon.huella { background: rgba(76, 175, 80, 0.1); }
.activity-icon.juego { background: rgba(255, 152, 0, 0.1); }

.activity-content p {
  margin: 0 0 0.25rem 0;
  color: #2c3e50;
  font-size: 0.9rem;
}

.activity-content small {
  color: #95a5a6;
  font-size: 0.75rem;
}

.no-data {
  text-align: center;
  color: #95a5a6;
  padding: 2rem;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
}

.btn-primary, .btn-secondary {
  padding: 1rem 2rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: transform 0.2s;
}

.btn-primary {
  background: #4CAF50;
  color: white;
}

.btn-secondary {
  background: #2196F3;
  color: white;
}

.btn-primary:hover, .btn-secondary:hover {
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .charts-grid, .bottom-grid {
    grid-template-columns: 1fr;
  }
  
  .action-buttons {
    flex-direction: column;
  }
}
</style>